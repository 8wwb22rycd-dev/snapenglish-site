const https = require('https');

function getJSON(id) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'jsonblob.com',
      path: `/api/jsonBlob/${id}`,
      headers: { 'Accept': 'application/json' },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    }).on('error', reject);
  });
}

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  const id = event.queryStringParameters?.id;
  if (!id || !/^\d+$/.test(id)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid id' }) };
  }

  try {
    const res = await getJSON(id);
    if (res.status === 200) return { statusCode: 200, headers, body: res.body };
    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Exercise not found' }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
