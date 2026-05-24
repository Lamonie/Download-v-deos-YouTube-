export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { url, quality } = body;
    
    const response = await fetch("https://co.wuk.sh/api/json", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0" 
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
    return res.status(500).json({ error: "Erro de servidor: " + error.message });
  }
}
