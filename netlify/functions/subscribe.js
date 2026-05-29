const https = require('https');

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const params = new URLSearchParams(event.body);
  const email = (params.get('email') || '').trim();
  if (!email || !email.includes('@')) return { statusCode: 400, body: 'Invalid email' };

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { statusCode: 500, body: 'API key not configured' };

  const listId = parseInt(process.env.BREVO_LIST_ID || '2');
  const authHeaders = { 'api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' };

  // 1. Add contact to Brevo list (ignore errors if already exists)
  try {
    await brevoPost('/v3/contacts', { email, listIds: [listId], updateEnabled: true }, authHeaders);
  } catch (_) {}

  // 2. Send welcome email
  try {
    await brevoPost('/v3/smtp/email', {
      sender: { name: 'Caroline — SnapEnglish', email: 'contact@snapenglish.fr' },
      to: [{ email }],
      subject: '🇬🇧 Votre ebook gratuit — How to Sound Like a Native',
      htmlContent: welcomeEmail(),
    }, authHeaders);
  } catch (e) {
    return { statusCode: 500, headers: corsHeaders, body: 'send_failed' };
  }

  return { statusCode: 200, headers: { ...corsHeaders, 'Content-Type': 'text/plain' }, body: 'ok' };
};

function brevoPost(path, data, headers) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = https.request({
      hostname: 'api.brevo.com', path, method: 'POST',
      headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => res.statusCode < 300 ? resolve(d) : reject(new Error(`${res.statusCode}: ${d}`)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function welcomeEmail() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Votre ebook gratuit SnapEnglish</title>
</head>
<body style="margin:0;padding:0;background:#F7F4EF;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4EF;padding:32px 16px;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

      <!-- HEADER -->
      <tr>
        <td style="background:#1B2A4A;padding:36px 40px;text-align:center;border-top:4px solid #B8975A;">
          <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#FDFCFA;letter-spacing:-0.5px;">
            Snap<span style="font-weight:400;color:#B8975A;">English</span>
          </div>
          <div style="font-size:11px;font-weight:400;letter-spacing:2px;text-transform:uppercase;color:rgba(253,252,250,0.4);margin-top:6px;">
            La newsletter gratuite
          </div>
        </td>
      </tr>

      <!-- HERO -->
      <tr>
        <td style="background:#FDFCFA;padding:44px 40px 32px;text-align:center;">
          <div style="font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#B8975A;margin-bottom:16px;">
            Bienvenue !
          </div>
          <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1B2A4A;line-height:1.25;margin:0 0 16px;letter-spacing:-0.5px;">
            Votre ebook gratuit<br>
            <em style="font-style:italic;color:#B8975A;">vous attend</em>
          </h1>
          <p style="font-size:15px;font-weight:300;color:#2C2C2C;line-height:1.75;margin:0 0 32px;opacity:0.85;">
            Merci de rejoindre la newsletter SnapEnglish !<br>
            Voici votre ebook gratuit : <strong style="font-weight:600;">32 expressions</strong> que les anglophones utilisent au quotidien — pour parler un anglais plus naturel et plus fluide.
          </p>

          <!-- CTA EBOOK -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="background:#B8975A;border-radius:2px;">
                <a href="https://www.snapenglish.fr/ebook-expressions-anglophones"
                   style="display:inline-block;padding:14px 36px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1B2A4A;text-decoration:none;">
                  📖 Accéder à mon ebook gratuit
                </a>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- APERÇU EXPRESSIONS -->
      <tr>
        <td style="background:#EDE8DF;padding:32px 40px;">
          <div style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#B8975A;margin-bottom:20px;text-align:center;">
            Un avant-goût de l'ebook
          </div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #D4C9B4;">
                <div style="font-family:Georgia,serif;font-size:15px;color:#1B2A4A;font-weight:400;">Don't beat around the bush</div>
                <div style="font-size:13px;color:#2C2C2C;opacity:0.65;font-style:italic;margin-top:2px;">Ne tournez pas autour du pot</div>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #D4C9B4;">
                <div style="font-family:Georgia,serif;font-size:15px;color:#1B2A4A;font-weight:400;">In a nutshell</div>
                <div style="font-size:13px;color:#2C2C2C;opacity:0.65;font-style:italic;margin-top:2px;">En résumé</div>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #D4C9B4;">
                <div style="font-family:Georgia,serif;font-size:15px;color:#1B2A4A;font-weight:400;">It's a no-brainer</div>
                <div style="font-size:13px;color:#2C2C2C;opacity:0.65;font-style:italic;margin-top:2px;">C'est une évidence</div>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;">
                <div style="font-family:Georgia,serif;font-size:15px;color:#1B2A4A;font-weight:400;">The ball is in your court</div>
                <div style="font-size:13px;color:#2C2C2C;opacity:0.65;font-style:italic;margin-top:2px;">La balle est dans ton camp</div>
              </td>
            </tr>
          </table>
          <div style="text-align:center;margin-top:20px;">
            <a href="https://www.snapenglish.fr/ebook-expressions-anglophones"
               style="font-size:12px;font-weight:600;color:#1B2A4A;text-decoration:none;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #B8975A;padding-bottom:2px;">
              Voir les 32 expressions →
            </a>
          </div>
        </td>
      </tr>

      <!-- FORMATIONS -->
      <tr>
        <td style="background:#1B2A4A;padding:32px 40px;text-align:center;">
          <p style="font-family:Georgia,serif;font-size:17px;font-weight:400;color:#FDFCFA;margin:0 0 8px;line-height:1.3;">
            Envie d'aller plus loin ?
          </p>
          <p style="font-size:13px;font-weight:300;color:rgba(253,252,250,0.55);margin:0 0 20px;line-height:1.65;">
            Découvrez les formations SnapEnglish finançables CPF — cours particuliers 100% en ligne avec Caroline.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="border:1.5px solid rgba(184,151,90,0.5);border-radius:2px;">
                <a href="https://www.snapenglish.fr/formations"
                   style="display:inline-block;padding:10px 28px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#B8975A;text-decoration:none;">
                  Voir les formations CPF
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding:24px 40px;text-align:center;">
          <p style="font-size:11px;color:#2C2C2C;opacity:0.35;line-height:1.7;margin:0;">
            Vous recevez cet email car vous vous êtes inscrit(e) sur snapenglish.fr.<br>
            <a href="https://www.snapenglish.fr" style="color:#B8975A;text-decoration:none;">snapenglish.fr</a>
            &nbsp;·&nbsp;
            <a href="mailto:contact@snapenglish.fr" style="color:#B8975A;text-decoration:none;">contact@snapenglish.fr</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
