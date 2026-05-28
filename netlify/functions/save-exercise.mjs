import { getStore } from '@netlify/blobs';

function randomId(len = 7) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

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
    const id = randomId(7);
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
