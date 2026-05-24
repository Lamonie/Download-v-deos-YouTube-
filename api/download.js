export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Use POST" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { url, quality } = body || {};

    if (!url) {
      return res.status(400).json({ success: false, error: "Link do YouTube não fornecido." });
    }

    // LISTA ATUALIZADA: Instâncias alternativas que costumam deixar o YouTube ativado
    const servidores = [
      "https://api.cobalt.kim/",
      "https://cobalt-api.kwiatekmateusz.com/",
      "https://cobalt.api.engos.dev/",
      "https://api.cobalt.tools/" // O oficial fica por último caso eles reativem
    ];

    let ultimoErro = "Nenhum servidor respondeu corretamente.";

    for (const servidor of servidores) {
      try {
        const headers = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        };

        // A sua chave da Vercel só serve no servidor oficial
        if (servidor === "https://api.cobalt.tools/" && process.env.API_KEY) {
          headers["Authorization"] = `Api-Key ${process.env.API_KEY}`;
        }

        const response = await fetch(servidor, {
          method: "POST",
          headers,
          body: JSON.stringify({
            url,
            videoQuality: quality || "720"
          })
        });

        const texto = await response.text();

        let data = {};
        try {
          data = JSON.parse(texto);
        } catch {
          data = {};
        }

        // Se o servidor bloquear (como o oficial fez), ele anota o erro e PULA para o próximo
        if (!response.ok) {
          ultimoErro = `O servidor ${servidor} recusou. Motivo: ${texto}`;
          continue; 
        }

        // Se deu certo, entrega o link para o botão verde e encerra!
        if (data.url) {
          return res.status(200).json({
            success: true,
            downloadUrl: data.url
          });
        }

        ultimoErro = `Servidor ${servidor} não retornou o arquivo.`;
      } catch (err) {
        ultimoErro = `Falha em ${servidor}: ${err.message}`;
      }
    }

    // Se todos da lista falharem, ele mostra o erro do último
    return res.status(400).json({
      success: false,
      error: "Todos os servidores de download falharam ou bloquearam o YouTube. " + ultimoErro
    });
  } catch (erroGeral) {
    return res.status(500).json({
      success: false,
      error: "Erro interno da Vercel: " + erroGeral.message
    });
  }
}
