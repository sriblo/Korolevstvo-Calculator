#!/usr/bin/env python3
"""
Добавляет поле end_date к news items и матчит турниры.
Сохраняет обновлённый news_cal.json.
"""
import json, re
from datetime import date, timedelta

# Склонения месяцев → номер
MONTHS = {
    'янв': 1, 'фев': 2, 'мар': 3, 'апр': 4,
    'май': 5, 'мая': 5, 'мае': 5,
    'июн': 6, 'июл': 7, 'авг': 8, 'сен': 9,
    'окт': 10, 'ноя': 11, 'дек': 12,
    'январ': 1, 'феврал': 2, 'март': 3, 'апрел': 4,
    'июнь': 6, 'июня': 6, 'июне': 6,
    'июль': 7, 'июля': 7, 'июле': 7,
    'август': 8, 'августа': 8, 'августе': 8,
    'сентябр': 9, 'октябр': 10, 'ноябр': 11, 'декабр': 12,
}
MON_PAT = r'(январ\w*|феврал\w*|март\w*|апрел\w*|ма[йяе]\w*|июн\w*|июл\w*|август\w*|сентябр\w*|октябр\w*|ноябр\w*|декабр\w*)'

def mon(s):
    s = s.lower()
    for k, v in MONTHS.items():
        if s.startswith(k):
            return v
    return None

def mk_date(y, m, d):
    try:
        return date(y, m, d).isoformat()
    except:
        return None

def parse_end(title, text, base_iso):
    """Пытается найти дату окончания в тексте/заголовке."""
    base_y = int(base_iso[:4])
    base_m = int(base_iso[5:7])
    full = (title + ' ' + text[:800]).lower()

    # Паттерн 1: "с X по Y месяц" — один месяц
    # "с 19 по 23 мая", "с 7 по 11 мая"
    m = re.search(r'с\s+\d+\s+по\s+(\d+)\s+' + MON_PAT, full)
    if m:
        end_d, end_m = int(m.group(1)), mon(m.group(2))
        if end_m:
            y = base_y if end_m >= base_m - 1 else base_y + 1
            r = mk_date(y, end_m, end_d)
            if r: return r

    # Паттерн 2: "с X месяц по Y месяц" — разные месяцы
    # "с 28 апреля по 3 мая", "с 19 мая по 2 июня"
    m = re.search(r'с\s+\d+\s+' + MON_PAT + r'\s+по\s+(\d+)\s+' + MON_PAT, full)
    if m:
        end_d, end_m = int(m.group(2)), mon(m.group(3))
        start_m = mon(m.group(1))
        if end_m and start_m:
            y = base_y
            if end_m < start_m:  # переход через новый год
                y += 1
            r = mk_date(y, end_m, end_d)
            if r: return r

    # Паттерн 3: "по X месяц включительно" или "до X месяц"
    # "по 31 июля 2026 включительно", "до 26 мая включительно"
    m = re.search(r'(?:по|до)\s+(\d+)\s+' + MON_PAT + r'(?:\s+(\d{4}))?\s+включительно', full)
    if m:
        end_d, end_m = int(m.group(1)), mon(m.group(2))
        y = int(m.group(3)) if m.group(3) else base_y
        if end_m:
            if not m.group(3) and end_m < base_m - 1:
                y += 1
            r = mk_date(y, end_m, end_d)
            if r: return r

    # Паттерн 4: "X–Y месяц" или "X-Y месяц" (диапазон через тире)
    # "19–23 мая", "7-11 мая"
    m = re.search(r'(\d+)\s*[–—-]\s*(\d+)\s+' + MON_PAT, full)
    if m:
        end_d, end_m = int(m.group(2)), mon(m.group(3))
        if end_m and end_m >= base_m - 1:
            r = mk_date(base_y, end_m, end_d)
            if r: return r

    # Паттерн 5: "акция продлится до X"
    m = re.search(r'продлится до\s+(\d+)\s+' + MON_PAT, full)
    if m:
        end_d, end_m = int(m.group(1)), mon(m.group(2))
        if end_m:
            r = mk_date(base_y, end_m, end_d)
            if r: return r

    return None


def match_tournaments(items):
    """
    Матчит старт турнира с его завершением.
    Для каждого tournament_end ищем ближайший tournament start перед ним.
    """
    starts = [x for x in items if x['c'] == 'tournament']
    ends   = [x for x in items if x['c'] == 'tournament_end']

    # Для каждого старта — найти ближайший конец после него (в пределах 35 дней)
    matched = {}  # start_id → end_date
    used_ends = set()

    for s in sorted(starts, key=lambda x: x['d']):
        sd = date.fromisoformat(s['d'])
        best = None
        best_delta = 999
        for e in ends:
            if e['id'] in used_ends:
                continue
            ed = date.fromisoformat(e['d'])
            delta = (ed - sd).days
            if 10 <= delta <= 38 and delta < best_delta:
                best = e
                best_delta = delta
        if best:
            matched[s['id']] = best['d']
            used_ends.add(best['id'])

    return matched


def main():
    with open('/Users/sriblo/Korolevstvo/db/news.json', encoding='utf-8') as f:
        news = json.load(f)

    # Пересчитываем категории (та же логика что в scrape_news.py)
    def reclassify(n):
        cat = n['cat']
        t = n['title'].lower()
        tx = n.get('text', '').lower()
        full = t + ' ' + tx
        if cat in ('tournament', 'tournament_end'): return cat
        if re.search(r'технич\w+ работ', full): return 'maintenance'
        if re.search(r'зов глубин', full): return 'event'
        if re.search(r'небесн\w+ дракон', full): return 'event'
        if re.search(r'месяц .{0,15}(хмел|цветущ|пробужден)', full): return 'event'
        if re.search(r'колдер', full): return 'event'
        if re.search(r'тыквенн\w+ фестивал', full): return 'event'
        if re.search(r'день пирата|пиратск\w+ (ден|неде|праздник)', full): return 'event'
        if re.search(r'гоблинск\w+ рай', full): return 'event'
        if re.search(r'экспедиц\w+.{0,30}(сбор|припас|старт|начал|открыт)', full): return 'event'
        if re.search(r'земли мёртвых', full): return 'event'
        if re.search(r'день рожден\w+ королевства', full): return 'event'
        if re.search(r'акция!|акция\s+с\s+\d', t): return 'offer'
        if re.search(r'наборы стража', full): return 'offer'
        if re.search(r'распродажа аватар|распродажа костюм', full): return 'offer'
        if re.search(r'бонусн\w+ рубин', full): return 'bonus'
        if cat == 'fair': return 'fair'
        if re.search(r'ярмарк', full): return 'fair'
        if re.search(r'8 марта', full): return 'holiday'
        if re.search(r'23 феврал', full): return 'holiday'
        if re.search(r'\b9 мая\b|день побед', full): return 'holiday'
        if re.search(r'1 апрел|день смеха', full): return 'holiday'
        if re.search(r'с новым год|новый год\b', full): return 'holiday'
        if re.search(r'день рожден\w+ королевства|итоги.{0,20}день рожден', full): return 'holiday'
        if re.search(r'королевски\w+ сезон', full): return 'season'
        if re.search(r'^обновлени', t): return 'update'
        if cat == 'update': return 'update'
        return cat

    # Собираем compact items
    compact = []
    for n in news:
        cat = reclassify(n)
        end = parse_end(n['title'], n.get('text', ''), n['date'])
        # Максимальные длительности по категории (дней)
        MAX_DAYS = {
            'offer': 14, 'bonus': 14, 'auction': 14,
            'tournament': 35, 'tournament_end': 0,
            'event': 35, 'season': 45,
            'fair': 45,
            'holiday': 10,
            'maintenance': 3, 'update': 3,
            'other': 14,
        }
        item = {
            'd': n['date'],
            't': n['title'],
            'c': cat,
            'id': n['id'],
        }
        if end and end > n['date']:
            base = date.fromisoformat(n['date'])
            end_d = date.fromisoformat(end)
            max_d = MAX_DAYS.get(cat, 14)
            if (end_d - base).days <= max_d:
                item['e'] = end
        compact.append(item)

    # Матчим турниры
    t_matched = match_tournaments(compact)
    matched_count = 0
    for item in compact:
        if item['c'] == 'tournament' and item['id'] in t_matched:
            item['e'] = t_matched[item['id']]
            matched_count += 1
        elif item['c'] == 'tournament' and 'e' not in item:
            # Эвристика: турнир ~26 дней
            item['e'] = (date.fromisoformat(item['d']) + timedelta(days=26)).isoformat()
            item['approx'] = True

    # Ярмарки: конец = день перед следующей ярмаркой (или +28 дней)
    fairs = sorted([x for x in compact if x['c'] == 'fair'], key=lambda x: x['d'])
    for i, f in enumerate(fairs):
        if 'e' not in f:
            if i + 1 < len(fairs):
                next_d = date.fromisoformat(fairs[i+1]['d'])
                this_d = date.fromisoformat(f['d'])
                gap = (next_d - this_d).days
                # Ярмарка длится до следующей (обычно 28-35 дней)
                if gap <= 45:
                    f['e'] = (next_d - timedelta(days=1)).isoformat()
                else:
                    f['e'] = (this_d + timedelta(days=30)).isoformat()
                    f['approx'] = True
            else:
                f['e'] = (date.fromisoformat(f['d']) + timedelta(days=30)).isoformat()
                f['approx'] = True

    # Ивенты без даты: +14 дней (примерная длительность)
    for item in compact:
        if item['c'] == 'event' and 'e' not in item:
            item['e'] = (date.fromisoformat(item['d']) + timedelta(days=14)).isoformat()
            item['approx'] = True

    # Статистика
    with_end  = [x for x in compact if 'e' in x]
    exact     = [x for x in with_end if not x.get('approx')]
    approx    = [x for x in with_end if x.get('approx')]
    from collections import Counter
    print(f'Всего: {len(compact)}')
    print(f'С датой окончания: {len(with_end)} (точных: {len(exact)}, приблизительных: {len(approx)})')
    print(f'  матч турниров: {matched_count}')
    print()
    print('С датами по категориям:')
    cats_all = Counter(x['c'] for x in compact)
    cats_exact = Counter(x['c'] for x in exact)
    cats_approx = Counter(x['c'] for x in approx)
    for cat, total in cats_all.most_common():
        e = cats_exact.get(cat, 0)
        a = cats_approx.get(cat, 0)
        print(f'  {cat}: {e} точных + {a} приблиз. / {total}')

    # Примеры точных
    print('\nПримеры с точной датой:')
    for x in exact[:8]:
        print(f"  {x['d']} → {x['e']}  [{x['c']}]  {x['t'][:55]}")

    compact.sort(key=lambda x: (x['d'], x['id']), reverse=True)
    with open('/Users/sriblo/Korolevstvo/db/news_cal.json', 'w', encoding='utf-8') as f:
        json.dump(compact, f, ensure_ascii=False, separators=(',', ':'))

    import os
    size = os.path.getsize('/Users/sriblo/Korolevstvo/db/news_cal.json')
    print(f'\nСохранено: {size//1024} KB')

if __name__ == '__main__':
    main()
