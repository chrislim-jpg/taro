export default async function handler(_request, response) {
  const source = await fetch(
    'https://raw.githubusercontent.com/chrislim-jpg/taro/main/index.html',
    { cache: 'no-store' },
  )

  if (!source.ok) {
    response.status(502).send('Failed to load the Tarotica app.')
    return
  }

  const html = (await source.text())
    .replace('const top=', 'const topbar=')
    .replaceAll('top(', 'topbar(')

  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
  response.status(200).send(html)
}
