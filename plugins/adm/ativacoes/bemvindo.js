"use strict";
module.exports = {
nomes: ["bemvindo"],
desc: "Ativa ou desativa o sistema de bemvindo no grupo",
tags: ["grupo", "config"],
run: async () => {
const { salvarConfigGrupo, lerConfigGrupo } = require("../../../config.js");
const configAtual = lerConfigGrupo(from);
if (!isGroup) return enviar(resposta.so_grupo);
if (!isGroupAdmins) return enviar(resposta.so_adm);
if (!q) {
const estado = configAtual.bemvindogp ? "✅ Ativado" : "❌ Desativado";
return enviar(`bemvindo atualmente: ${estado}\nUse: ${prefix}bemvindo on/off`);
}

const opcao = args[0].toLowerCase();

if (opcao === "on") {
if (configAtual.bemvindogp) {
return enviar("⚠ O bemvindo já está ativado!");
}
if (salvarConfigGrupo(from, { bemvindogp: true })) {
return enviar("✅ bemvindo ativado no grupo!");
} else {
return enviar("❌ Erro ao ativar o bemvindo.");
}
} else if (opcao === "off") {
if (!configAtual.bemvindogp) {
return enviar("⚠ O bemvindo já está desativado!");
}
if (salvarConfigGrupo(from, { bemvindogp: false })) {
return enviar("✅ bemvindo desativado no grupo!");
} else {
return enviar("❌ Erro ao desativar o bemvindo.");
}
} else {
return enviar(`⚠ Opção inválida. Use: ${prefix}bemvindo on|off`);
}
},
};