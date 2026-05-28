const https = require('https');

exports.handler = async (event) => {
  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: 'Missing url' };

  return new Promise((resolve) => {
    https.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        },
        body: data.trim()
      }));
    }).on('error', () => resolve({ statusCode: 500, body: 'error' }));
  });
};
