const https = require('https');

function tryShorten(apiUrl) {
  return new Promise((resolve, reject) => {
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data.trim()));
    }).on('error', reject);
  });
}

exports.handler = async (event) => {
  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: 'Missing url' };

  const headers = { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' };

  // is.gd : redirige instantanément sans publicité
  try {
    const short = await tryShorten(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
    if (short.startsWith('https://is.gd/')) {
      return { statusCode: 200, headers, body: short };
    }
  } catch (_) {}

  // v.gd : service sœur de is.gd, même comportement sans pub
  try {
    const short = await tryShorten(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
    if (short.startsWith('https://v.gd/')) {
      return { statusCode: 200, headers, body: short };
    }
  } catch (_) {}

  return { statusCode: 500, body: 'error' };
};
