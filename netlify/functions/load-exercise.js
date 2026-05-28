exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  const id = event.queryStringParameters?.id;
  if (!id || id.length > 20) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid id' }) };
  }

  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('exercises');

    const data = await store.get(id, { type: 'json' });
    if (!data) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Exercise not found' }) };

    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
