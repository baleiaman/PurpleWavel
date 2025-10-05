// É necessário ter o 'axios' instalado para fazer as requisições à API.
// Se não tiver, instale com: npm install axios
const axios = require("axios");

module.exports = {
    // Nomes/aliases para ativar o comando
    nomes: ["play", "música", "p"],
    // Descrição do que o comando faz
    desc: ["Pesquisa e reproduz uma música do YouTube."],
    // Exemplo de como usar o comando
    uso: ["<nome da música>"],

    // A função principal que será executada
    run: async ({ bot, from, info, q, enviar, resposta }) => {
        // Funções para contagem de comandos (do seu código original)
        // aumentartotalcmds();
        // aumentarcmdsgeral();

        // 1. Verifica se o usuário digitou o nome da música
        if (!q) {
            // Se 'q' (a query/texto) estiver vazio, envia uma mensagem de erro.
            // A variável 'resposta.textoparametro' deve estar configurada no seu bot.
            return enviar(resposta.textoparametro);
        }

        try {
            // 2. Pesquisa a música na API
            const searchUrl = `https://kuromi-system-tech.onrender.com/api/pesquisayt?query=${encodeURIComponent(q)}`;
            const response = await axios.get(searchUrl);
            const data = response.data;

            // 3. Verifica se a pesquisa retornou algum resultado
            if (!data || !data.formattedVideos || data.formattedVideos.length === 0) {
                return enviar("❌ Nenhuma música encontrada com esse nome. Tente outro termo!");
            }

            // Pega o primeiro vídeo da lista de resultados
            const video = data.formattedVideos[0];

            // 4. Formata a mensagem com os detalhes do vídeo
            const resultadoTexto = `
🎵 *MÚSICA ENCONTRADA* 🎵

🎬 *Título:* ${video.title || "Não informado"}
👤 *Canal:* ${video.channel || "Não informado"}
🕒 *Duração:* ${video.duration || "Não informado"}
👀 *Views:* ${video.views || "Não informado"}

_Enviando o áudio, aguarde..._
            `.trim();

            // 5. Envia a mensagem com a foto (thumbnail) e os detalhes
            await bot.sendMessage(
                from,
                {
                    image: { url: video.thumbnail }, // URL da imagem do vídeo
                    caption: resultadoTexto,
                },
                { quoted: info } // Responde à mensagem original do usuário
            );

            // 6. Monta a URL para baixar o áudio
            // A API usa o título do vídeo para gerar o link de áudio
            const audioUrl = `https://kuromi-system-tech.onrender.com/api/play?name=${encodeURIComponent(video.title)}`;

            // 7. Envia a mensagem com o áudio
            await bot.sendMessage(
                from,
                {
                    audio: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${video.title}.mp3` // Nome do arquivo de áudio
                },
                { quoted: info } // Responde à mensagem original do usuário
            );

        } catch (erro) {
            // Em caso de qualquer erro no processo, loga no console e envia uma mensagem
            console.error("❌ Erro no comando 'play':", erro);
            // A variável 'resposta.erro' deve estar configurada no seu bot.
            enviar(resposta.erro || "❌ Ocorreu um erro ao processar sua solicitação.");
        }
    },
};
