export default async function handler(req, res) {
  // Configuração de CORS para permitir que o seu frontend fale com a API
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { url, quality } = req.body;
    
    // Chamada à API do Cobalt
    const response = await fetch("https://co.wuk.sh/api/json", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      },
      body: JSON.stringify({ 
        url: url, 
        vQuality: quality || "720",
        isAudioOnly: false 
      })
    });
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao processar vídeo" });
  }
}
