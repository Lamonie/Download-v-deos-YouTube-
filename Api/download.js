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

    const servidores = [
      "https://api.cobalt.tools/",
      "https://cobalt.api.engos.dev/",
      "https://cobalt.catbox.video/"
    ];

    let ultimoErro = "Nenhum servidor respondeu corretamente.";

    for (const servidor of servidores) {
      try {
        const headers = {
          "Content-Type": "application/json",
          "Accept": "application/json"
        };

        if (servidor === "https://api.cobalt.tools/" && process.env.API_KEY) {
          headers["Authorization"] = `Api-Key ${process.env.API_KEY}`;
        } else {
          headers["User-Agent"] = "Mozilla/5.0";
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

        if (!response.ok) {
          ultimoErro = `Servidor ${servidor} respondeu ${response.status}: ${texto}`;
          continue;
        }

        if (data.url) {
          return res.status(200).json({
            success: true,
            downloadUrl: data.url
          });
        }

        ultimoErro = `Servidor ${servidor} não retornou "url". Resposta: ${texto}`;
      } catch (err) {
        ultimoErro = `Falha em ${servidor}: ${err.message}`;
      }
    }

    return res.status(400).json({
      success: false,
      error: "Não foi possível preparar o vídeo. " + ultimoErro
    });
  } catch (erroGeral) {
    return res.status(500).json({
      success: false,
      error: "Erro interno da Vercel: " + erroGeral.message
    });
  }
}
