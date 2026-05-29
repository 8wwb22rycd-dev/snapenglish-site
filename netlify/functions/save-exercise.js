const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
      body: '',
    };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    if (!data.exercise) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing exercise' }) };

    const store = getStore('exercises');
    const id = Math.random().toString(36).slice(2, 9);
    await store.setJSON(id, {
      title: data.title || '',
      exercise: data.exercise,
      correction: data.correction || '',
    });

    return { statusCode: 200, headers, body: JSON.stringify({ id }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
