export default async function handler(req, res) {
  // Isso apenas valida se o link veio certo
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL necessária" });

  // Em vez de esperar o Cobalt baixar, nós apenas redirecionamos
  // Isso não consome o tempo da Vercel
  res.status(200).json({
    redirect: `https://co.wuk.sh/api/json?url=${encodeURIComponent(url)}`
  });
}
