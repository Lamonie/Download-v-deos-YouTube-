export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const { url, quality } = req.body;

  try {
    const response = await fetch("https://co.wuk.sh/api/json", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({ 
        url: url, 
        vQuality: quality || "720"
      })
    });
    
    const data = await response.json();
    
    if (data.url) {
      // Devolve o link direto para o site exibir, sem forçar o redirecionamento
      return res.status(200).json({ success: true, downloadUrl: data.url });
    } else {
      return res.status(400).json({ success: false, error: "Vídeo não encontrado ou privado." });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: "Erro de processamento no servidor." });
  }
}
