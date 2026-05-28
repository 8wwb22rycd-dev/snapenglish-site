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

  // Try TinyURL first
  try {
    const short = await tryShorten(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    if (short.startsWith('https://tinyurl.com/')) {
      return { statusCode: 200, headers, body: short };
    }
  } catch (_) {}

  // Fallback: is.gd
  try {
    const short = await tryShorten(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
    if (short.startsWith('https://is.gd/')) {
      return { statusCode: 200, headers, body: short };
    }
  } catch (_) {}

  return { statusCode: 500, body: 'error' };
};
