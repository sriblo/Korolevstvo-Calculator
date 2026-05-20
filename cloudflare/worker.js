// Cloudflare Worker — поиск игроков Королевства
//
// Переменные окружения (настрой в Cloudflare Dashboard → Worker → Settings → Variables):
//   KOR_LOGIN    — email или ник для входа на kor.ru
//   KOR_PASSWORD — пароль
//   KOR_SUBDOMAIN — твой ник-поддомен (например: xkasperx)

let cachedSession = null;

const CORS_ORIGIN = 'https://sriblo.github.io';

async function login(env) {
  const resp = await fetch('http://www.kor.ru/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (compatible)',
    },
    body: `login=${encodeURIComponent(env.KOR_LOGIN)}&password=${encodeURIComponent(env.KOR_PASSWORD)}&return_url=`,
    redirect: 'manual',
  });

  const setCookie = resp.headers.get('set-cookie') || '';
  const m = setCookie.match(/sbsid=([^;,\s]+)/);
  return m ? m[1] : null;
}

async function searchUsers(subdomain, sbsid, query) {
  const resp = await fetch(`http://${subdomain}.kor.ru/bank/get/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': `sbsid=${sbsid}`,
    },
    body: `name=${encodeURIComponent(query)}`,
    redirect: 'manual',
  });

  if (resp.status === 302) return null; // сессия истекла
  return await resp.text();
}

function parseUsers(html) {
  const users = [];
  const parts = html.split('<li id="user_');
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    const id    = (p.match(/^(\d+)/)                        || [])[1];
    const nick  = (p.match(/class="text_12">([^<]+)</)       || [])[1]?.trim();
    const level = (p.match(/class="sup">(\d+)</)             || [])[1];
    const race  = (p.match(/\/race_(\d)\.png/)               || [])[1];
    if (id && nick) {
      users.push({
        id:    +id,
        nick,
        level: +(level || 0),
        race:  race === '2' ? 'elf' : 'human',
        url:   `http://${nick}.kor.ru`,
      });
    }
  }
  return users;
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const query = (url.searchParams.get('q') || '').trim();

    if (query.length < 2) {
      return new Response(JSON.stringify([]), { headers: corsHeaders });
    }

    // Логин при первом запросе или после сброса сессии
    if (!cachedSession) {
      cachedSession = await login(env);
    }
    if (!cachedSession) {
      return new Response(JSON.stringify({ error: 'login failed' }), { status: 500, headers: corsHeaders });
    }

    let html = await searchUsers(env.KOR_SUBDOMAIN, cachedSession, query);

    // Сессия истекла — перелогинимся один раз
    if (html === null) {
      cachedSession = await login(env);
      if (!cachedSession) {
        return new Response(JSON.stringify({ error: 'login failed' }), { status: 500, headers: corsHeaders });
      }
      html = await searchUsers(env.KOR_SUBDOMAIN, cachedSession, query);
    }

    const users = html ? parseUsers(html) : [];
    return new Response(JSON.stringify(users), { headers: corsHeaders });
  },
};
