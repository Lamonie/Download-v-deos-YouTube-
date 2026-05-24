export default async function handler(req, res) {
  const { url } = req.body;
  
  // Redirecionamento direto: evitamos que a Vercel processe o arquivo pesado.
  // Apenas enviamos o link para o frontend processar.
  res.status(200).json({
    url: `https://co.wuk.sh/api/json?url=${encodeURIComponent(url)}`,
    status: "redirect"
  });
}
