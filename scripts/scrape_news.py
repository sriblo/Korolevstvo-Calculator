#!/usr/bin/env python3
"""
Scrapes all news from kor.ru/newspaper/news/ and saves to db/news.json
165 pages, ~10-15 posts per page
"""
import urllib.request, ssl, re, json, time, sys
from html import unescape

ctx = ssl._create_unverified_context()
HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
BASE = 'https://www.kor.ru'

def fetch(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            return urllib.request.urlopen(req, context=ctx, timeout=15).read().decode('utf-8')
        except Exception as e:
            if attempt == retries - 1:
                print(f'  FAIL {url}: {e}')
                return ''
            time.sleep(2)

def strip_tags(s):
    s = re.sub(r'<br\s*/?>', '\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    return unescape(s).strip()

def classify(title, text):
    t = (title + ' ' + text).lower()
    if re.search(r'технич\w+ работ', t): return 'maintenance'
    if re.search(r'акция!|акция\s+с\s+\d', title.lower()): return 'offer'
    if re.search(r'бонусн\w+ рубин', t): return 'bonus'
    if re.search(r'завершени\w+ .{0,20}турнир', t): return 'tournament_end'
    if re.search(r'итог\w+ .{0,20}турнир|турнир\w* завершён', t): return 'tournament_end'
    if re.search(r'турнир', t): return 'tournament'
    if re.search(r'ярмарк', t): return 'fair'
    if re.search(r'королевски\w+ сезон|сезон\w*:\s*(январ|феврал|март|апрел|май|июн|июл|август|сентябр|октябр|ноябр|декабр)', t): return 'season'
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
    if re.search(r'8 марта|23 феврал|новый год|пасх|1 мая|9 мая|день побед|halloween|1 апрел|день влюблённ', t): return 'holiday'
    if re.search(r'аукцион', t): return 'auction'
    return 'other'

def parse_page(html):
    posts = []
    # Extract all date+post groups
    day_pattern = re.compile(
        r'<div class="posts_day">.*?<div class="date" id="date_(\d{4}-\d{2}-\d{2})">(.*?)</div>(.*?)(?=<div class="posts_day">|<div class="numbers")',
        re.DOTALL
    )
    post_pattern = re.compile(
        r'<div class="inner" id="post_(\d+)">(.*?)(?=<div class="inner" id="post_|\Z)',
        re.DOTALL
    )
    heading_pattern = re.compile(r'<div class="heading"[^>]*>.*?<a[^>]+>(.*?)</a>', re.DOTALL)
    text_pattern = re.compile(r'<span class="text">(.*?)</span>', re.DOTALL)

    for day_m in day_pattern.finditer(html):
        date_iso = day_m.group(1)  # YYYY-MM-DD
        day_html = day_m.group(3)

        for post_m in post_pattern.finditer(day_html):
            post_id = int(post_m.group(1))
            post_html = post_m.group(2)

            h = heading_pattern.search(post_html)
            title = strip_tags(h.group(1)) if h else ''

            tx = text_pattern.search(post_html)
            text = strip_tags(tx.group(1)) if tx else ''

            cat = classify(title, text)
            posts.append({
                'id': post_id,
                'date': date_iso,
                'title': title,
                'text': text[:600],  # truncate long texts
                'cat': cat,
            })
    return posts

def main():
    all_posts = []
    total_pages = 165

    for page in range(1, total_pages + 1):
        if page == 1:
            url = f'{BASE}/newspaper/news/'
        else:
            url = f'{BASE}/newspaper/news/p/{page}'

        print(f'Page {page}/{total_pages} ...', end=' ', flush=True)
        html = fetch(url)
        if not html:
            print('skipped')
            continue

        posts = parse_page(html)
        all_posts.extend(posts)
        print(f'{len(posts)} posts (total {len(all_posts)})')

        if page < total_pages:
            time.sleep(0.4)  # be polite

    # Sort by date desc, then id desc
    all_posts.sort(key=lambda x: (x['date'], x['id']), reverse=True)

    # Stats
    from collections import Counter
    cats = Counter(p['cat'] for p in all_posts)
    print('\n=== Stats ===')
    for cat, n in cats.most_common():
        print(f'  {cat}: {n}')
    print(f'Total: {len(all_posts)} posts')

    out_path = '/Users/sriblo/Korolevstvo/db/news.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(all_posts, f, ensure_ascii=False, separators=(',', ':'))
    print(f'\nSaved to {out_path} ({len(json.dumps(all_posts, ensure_ascii=False)) // 1024} KB)')

if __name__ == '__main__':
    main()
