#!/usr/bin/env python3
"""
Инкрементальный скрапер: скачивает первые N страниц kor.ru/newspaper/news/
и добавляет только новые посты к существующему db/news.json.
Используется в GitHub Actions — не трогает старые данные.
"""
import urllib.request, ssl, re, json, time, sys, os
from html import unescape

ctx = ssl._create_unverified_context()
HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
BASE = 'https://www.kor.ru'
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'db', 'news.json')
PAGES_TO_SCAN = int(os.environ.get('SCRAPE_PAGES', '5'))

def fetch(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            return urllib.request.urlopen(req, context=ctx, timeout=15).read().decode('utf-8')
        except Exception as e:
            if attempt == retries - 1:
                print(f'  FAIL {url}: {e}', file=sys.stderr)
                return ''
            time.sleep(3)

def strip_tags(s):
    s = re.sub(r'<br\s*/?>', '\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    return unescape(s).strip()

MON_PAT = r'(январ\w*|феврал\w*|март\w*|апрел\w*|ма[йяе]\w*|июн\w*|июл\w*|август\w*|сентябр\w*|октябр\w*|ноябр\w*|декабр\w*)'

def classify(title, text):
    t = (title + ' ' + text).lower()
    if re.search(r'технич\w+ работ', t): return 'maintenance'
    if re.search(r'акция!|акция\s+с\s+\d', title.lower()): return 'offer'
    if re.search(r'бонусн\w+ рубин', t): return 'bonus'
    if re.search(r'завершени\w+ .{0,20}турнир', t): return 'tournament_end'
    if re.search(r'итог\w+ .{0,20}турнир|турнир\w* завершён', t): return 'tournament_end'
    if re.search(r'турнир', t): return 'tournament'
    if re.search(r'ярмарк', t): return 'fair'
    if re.search(r'королевски\w+ сезон|сезон\w*:\s*' + MON_PAT, t): return 'season'
    if re.search(r'зов глубин', t): return 'event'
    if re.search(r'небесн\w+ дракон', t): return 'event'
    if re.search(r'месяц .{0,20}(хмел|цветущ|пробужден|цветов)', t): return 'event'
    if re.search(r'колдер', t): return 'event'
    if re.search(r'тыквенн\w+ фестивал|хэллоуин', t): return 'event'
    if re.search(r'пиратск\w+ (ден|праздник)|день пирата', t): return 'event'
    if re.search(r'гоблинск\w+ рай', t): return 'event'
    if re.search(r'экспедиц', t): return 'event'
    if re.search(r'земли мёртвых|земл\w+ мертв', t): return 'event'
    if re.search(r'день рожден\w+ королевства', t): return 'event'
    if re.search(r'цветов пробужден|первоцвет', t): return 'event'
    if re.search(r'обновлени', title.lower()): return 'update'
    if re.search(r'8 марта|23 феврал|новый год|пасх|1 мая|9 мая|день побед|1 апрел|день влюблённ', t): return 'holiday'
    if re.search(r'аукцион', t): return 'auction'
    return 'other'

def parse_page(html):
    posts = []
    seen_ids = set()

    day_pattern = re.compile(
        r'<div class="posts_day">.*?<div class="date" id="date_(\d{4}-\d{2}-\d{2})">(.*?)</div>(.*?)(?=<div class="posts_day">|<div class="numbers")',
        re.DOTALL
    )
    post_pattern = re.compile(
        r'<div class="inner" id="post_(\d+)">(.*?)(?=<div class="inner" id="post_|\Z)',
        re.DOTALL
    )
    heading_pattern = re.compile(r'<div class="heading"[^>]*>.*?<a[^>]+>(.*?)</a>', re.DOTALL)
    text_pattern    = re.compile(r'<span class="text">(.*?)</span>', re.DOTALL)

    for day_m in day_pattern.finditer(html):
        date_iso = day_m.group(1)
        day_html = day_m.group(3)
        for post_m in post_pattern.finditer(day_html):
            post_id = int(post_m.group(1))
            post_html = post_m.group(2)
            h  = heading_pattern.search(post_html)
            title = strip_tags(h.group(1)) if h else ''
            tx = text_pattern.search(post_html)
            text  = strip_tags(tx.group(1)) if tx else ''
            cat   = classify(title, text)
            seen_ids.add(post_id)
            posts.append({'id': post_id, 'date': date_iso, 'title': title, 'text': text[:600], 'cat': cat})

    # Закреплённые посты без date-div (определяем дату из line_blog_YYYY-MM-DD)
    pinned_pat = re.compile(
        r'<div class="inner" id="post_(\d+)">(.*?)id="line_blog_(\d{4}-\d{2}-\d{2})"',
        re.DOTALL
    )
    for m in pinned_pat.finditer(html):
        post_id = int(m.group(1))
        if post_id in seen_ids:
            continue
        post_html = m.group(2)
        date_iso  = m.group(3)
        h  = heading_pattern.search(post_html)
        title = strip_tags(h.group(1)) if h else ''
        tx = text_pattern.search(post_html)
        text  = strip_tags(tx.group(1)) if tx else ''
        cat   = classify(title, text)
        seen_ids.add(post_id)
        posts.append({'id': post_id, 'date': date_iso, 'title': title, 'text': text[:600], 'cat': cat})

    return posts

def main():
    # Загружаем существующую базу
    with open(DB_PATH, encoding='utf-8') as f:
        existing = json.load(f)
    existing_ids = {n['id'] for n in existing}
    print(f'Существующих постов: {len(existing)}')

    # Скрапим первые PAGES_TO_SCAN страниц
    new_posts = []
    for page in range(1, PAGES_TO_SCAN + 1):
        url = f'{BASE}/newspaper/news/' if page == 1 else f'{BASE}/newspaper/news/p/{page}'
        print(f'Страница {page}/{PAGES_TO_SCAN} ...', end=' ', flush=True)
        html = fetch(url)
        if not html:
            print('пропущена')
            continue
        posts = parse_page(html)
        added = [p for p in posts if p['id'] not in existing_ids]
        new_posts.extend(added)
        existing_ids.update(p['id'] for p in added)
        print(f'{len(posts)} постов, новых: {len(added)}')
        if page < PAGES_TO_SCAN:
            time.sleep(0.5)

    if not new_posts:
        print('Нет новых постов.')
        return

    print(f'\nДобавлено: {len(new_posts)} постов')
    for p in new_posts:
        print(f'  {p["date"]} [{p["cat"]}] {p["title"][:60]}')

    all_posts = new_posts + existing
    all_posts.sort(key=lambda x: (x['date'], x['id']), reverse=True)

    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_posts, f, ensure_ascii=False, separators=(',', ':'))
    print(f'\nСохранено: {len(all_posts)} постов')

if __name__ == '__main__':
    main()
