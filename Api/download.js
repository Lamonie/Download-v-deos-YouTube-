export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Use POST" });

  try {
    const { url, quality } = req.body;
    
    // Adicionamos um User-Agent para a API nos reconhecer como um browser legítimo
    const response = await fetch("https://co.wuk.sh/api/json", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
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
    return res.status(500).json({ error: "Erro de processamento: " + error.message });
  }
}
