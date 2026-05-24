export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;

  try {
    const response = await fetch("https://co.wuk.sh/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ url: url, isAudioOnly: false })
    });
    
    const data = await response.json();
    
    // Se o Cobalt retornar o link, enviamos para o front
    if (data.url) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ error: "Não foi possível gerar o link." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Erro de conexão com a API." });
  }
}
