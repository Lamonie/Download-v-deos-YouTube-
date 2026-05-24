export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: "Apenas POST permitido" });

  const { url, quality } = req.body;

  try {
    const headers = {
      "Content-Type": "application/json", 
      "Accept": "application/json",
      "User-Agent": "YTDown Pro API"
    };

    // Puxando a chave de segurança diretamente do cofre da Vercel
    // Troque 'API_KEY' pelo nome exato que você salvou lá, se for diferente.
    if (process.env.API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.API_KEY}`;
    }

    // Usando a API oficial atualizada
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ 
        url: url, 
        videoQuality: quality || "1080" // Parâmetro corrigido
      })
    });
    
    // Se a API externa bloquear, agora o erro real é repassado sem ser mascarado
    if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ success: false, error: `Bloqueio da API (${response.status}): ${errText}` });
    }

    const data = await response.json();
    
    // Sucesso, o link limpo foi gerado
    if (data.url) {
      return res.status(200).json({ success: true, downloadUrl: data.url });
    } 
    // Se o vídeo for realmente bloqueado (ex: YouTube derrubou), ele te diz o motivo
    else if (data.status === "error" || data.text) {
      return res.status(400).json({ success: false, error: "A API recusou: " + data.text });
    } else {
      return res.status(400).json({ success: false, error: "Resposta vazia do servidor." });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: "Erro interno da Vercel: " + err.message });
  }
}
