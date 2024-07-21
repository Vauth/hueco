
const TOKEN = 'ENV_BOT_TOKEN' // Get from @botfather
const WEBHOOK = '/endpoint'
const SECRET = 'ENV_BOT_SECRET' // Your secret key
const OWNER = 'ENV_OWNER' // Owner username/id

addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  const param =  url.searchParams
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event))
  } else if (url.pathname === '/registerWebhook') {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET))
  } else if (url.pathname === '/unRegisterWebhook') {
    event.respondWith(unRegisterWebhook(event))
  } else if (param.has('send')) {
    event.respondWith(sendMessage(OWNER, param.get('send'))) 
  } else {
    event.respondWith(new Response('No handler for this request'))
  }
})


async function handleWebhook (event) {
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
    return new Response('Unauthorized', { status: 403 })
  }

  const update = await event.request.json()
  event.waitUntil(onUpdate(update))
  return new Response('Ok')
}


async function onUpdate (update) {
  if ('message' in update) {await onMessage(update.message)}
}

function onMessage (message) {
  if (message.text == '/start') {
    if (message.chat.id != OWNER) {
      sendMessage(OWNER, `*#start*\n*Name:* ${message.chat.first_name}\n*ID:* \`${message.chat.id}\``)
    }
    return sendMessage(message.chat.id, '*https://t.me/huecobot/start*')
  }
}

async function sendMessage (chatId, text) {
  await fetch(apiUrl('sendMessage', {chat_id: chatId, parse_mode: 'markdown', text}))
  return new Response('Ok')
}

async function registerWebhook (event, requestUrl, suffix, secret) {
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`
  const r = await (await fetch(apiUrl('setWebhook', { url: webhookUrl, secret_token: secret }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

async function unRegisterWebhook (event) {
  const r = await (await fetch(apiUrl('setWebhook', { url: '' }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

function apiUrl (methodName, params = null) {
  let query = ''
  if (params) {query = '?' + new URLSearchParams(params).toString()}
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`
}
