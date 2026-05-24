export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Use POST" });
  
  const { url, quality } = req.body;
  
  try {
    const response = await fetch("https://co.wuk.sh/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ url: url, vQuality: quality || "720" })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro de conexão" });
  }
}
