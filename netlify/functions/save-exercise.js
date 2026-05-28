const https = require('https');

function postJSON(data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = https.request({
      hostname: 'jsonblob.com',
      path: '/api/jsonBlob',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    if (!data.exercise) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing exercise' }) };

    const res = await postJSON({
      title: data.title || '',
      exercise: data.exercise,
      correction: data.correction || '',
    });

    if (res.status === 201) {
      // Location header: https://jsonblob.com/api/jsonBlob/{id}
      const id = (res.headers.location || '').split('/').pop();
      if (!id) return { statusCode: 500, headers, body: JSON.stringify({ error: 'No ID returned' }) };
      return { statusCode: 200, headers, body: JSON.stringify({ id }) };
    }
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Storage failed (' + res.status + ')' }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
