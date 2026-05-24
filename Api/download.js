export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  res.status(200).json({
    redirect: `https://co.wuk.sh/api/json?url=${encodeURIComponent(url)}`
  });
}
