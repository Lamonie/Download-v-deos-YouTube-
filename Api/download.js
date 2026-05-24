export default async function handler(req, res) {
  // Libera a conexão do seu site
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: "Use POST" });

  try {
    // Garante que a leitura do link venha perfeita do iPhone
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { url, quality } = body;

    if (!url) {
      return res.status(400).json({ success: false, error: "Link do YouTube não fornecido." });
    }

    // A SOLUÇÃO DEFINITIVA: 3 servidores para garantir que nunca falhe.
    // Usando a rota principal ("/") atualizada.
    const servidores = [
      "https://api.cobalt.tools/",     // Oficial (usa a chave que está na sua Vercel)
      "https://cobalt.api.engos.dev/", // Servidor Reserva 1 (Público)
      "https://cobalt.catbox.video/"   // Servidor Reserva 2 (Público)
    ];

    let ultimoErro = "";

    for (const servidor of servidores) {
      try {
        const headers = {
          "Content-Type": "application/json", 
          "Accept": "application/json"
        };

        // Correção da palavra-chave de segurança que a API exige agora
        if (servidor === "https://api.cobalt.tools/" && process.env.API_KEY) {
          headers["Authorization"] = `Api-Key ${process.env.API_KEY}`;
        } else {
          headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
        }

        const response = await fetch(servidor, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ 
            url: url, 
            videoQuality: quality || "720"
          })
        });
        
        // Se o servidor bloquear ou cair, pula silenciosamente para o próximo da lista
        if (!response.ok) {
            ultimoErro = `Servidor ${servidor} recusou a conexão.`;
            continue; 
        }

        const data = await response.json();
        
        // Sucesso! Conseguiu o link final, devolve imediatamente para o botão verde
        if (data.url) {
          return res.status(200).json({ success: true, downloadUrl: data.url });
        }
      } catch (err) {
        ultimoErro = err.message;
      }
    }

    // Só exibe erro se o vídeo for privado ou se os 3 servidores explodirem ao mesmo tempo
    return res.status(400).json({ success: false, error: "Não foi possível baixar. " + ultimoErro });

  } catch (erroGeral) {
    return res.status(500).json({ success: false, error: "Erro interno da Vercel: " + erroGeral.message });
  }
}
