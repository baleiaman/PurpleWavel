"use strict";
module.exports = {
nomes: ["modobrincadeira"],
desc: "Ativa ou desativa o sistema de modobrincadeira no grupo",
tags: ["grupo", "config"],
run: async () => {
const { salvarConfigGrupo, lerConfigGrupo } = require("../../../config.js");
const configAtual = lerConfigGrupo(from);
if (!isGroup) return enviar(resposta.so_grupo);
if (!isGroupAdmins) return enviar(resposta.so_adm);
if (!q) {
const estado = configAtual.modobrincadeiragp ? "✅ Ativado" : "❌ Desativado";
return enviar(`modobrincadeira atualmente: ${estado}\nUse: ${prefix}modobrincadeira on/off`);
}

const opcao = args[0].toLowerCase();

if (opcao === "on") {
if (configAtual.modobrincadeiragp) {
return enviar("⚠ O modobrincadeira já está ativado!");
}
if (salvarConfigGrupo(from, { modobrincadeiragp: true })) {
return enviar("✅ modobrincadeira ativado no grupo!");
} else {
return enviar("❌ Erro ao ativar o modobrincadeira.");
}
} else if (opcao === "off") {
if (!configAtual.modobrincadeiragp) {
return enviar("⚠ O modobrincadeira já está desativado!");
}
if (salvarConfigGrupo(from, { modobrincadeiragp: false })) {
return enviar("✅ modobrincadeira desativado no grupo!");
} else {
return enviar("❌ Erro ao desativar o modobrincadeira.");
}
} else {
return enviar(`⚠ Opção inválida. Use: ${prefix}modobrincadeira on|off`);
}
},
};