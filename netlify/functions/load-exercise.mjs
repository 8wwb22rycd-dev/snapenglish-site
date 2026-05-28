import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const id = event.queryStringParameters?.id;
  if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id' }) };

  if (!/^[a-z0-9]{5,12}$/.test(id)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid id' }) };
  }

  try {
    const store = getStore('exercises');
    const data = await store.get(id, { type: 'json' });

    if (!data) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Exercise not found' }) };

    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
