"use strict";
const chalk = require('chalk');
const { 
detectarLinkDeGrupo, 
creategrupo, 
getGrupoConfig, 
togglegrupoconfig, 
detectarLinkDeCanal 
} = require("../utils/grupo");

function normalizeJid(jid) {
if (!jid) return null;
return jid
.replace(/:.*(?=@)/, '')
.replace('@lid', '@s.whatsapp.net')
.replace('@c.us', '@s.whatsapp.net');
}

Object.defineProperty(module.exports, "__esModule", { value: true });

module.exports = {
file: 'message_logger.js',
eventNames: ['messages.upsert'],
desc: 'Handler para log de todas as mensagens',
tags: ['logger', 'messages'],

async start(bot, { messages }, ctx) {
for (const info of messages || []) {
const mensagem = info.message;
if (!mensagem) continue;

const from = info.key.remoteJid;
const isGroup = from.endsWith("@g.us");

// ------------------------------
// Normaliza sender
// ------------------------------
let sender = info.key.participant || info.key.remoteJid;
const normalizedSender = normalizeJid(sender);

// ------------------------------
// Metadata do grupo
// ------------------------------
const groupMetadata = isGroup ? await bot.groupMetadata(from) : null;
const groupMembers = groupMetadata?.participants || [];

// ------------------------------
// Lista de admins
// ------------------------------
const groupAdmins = (groupMembers || [])
.filter(i => i?.admin === "admin" || i?.admin === "superadmin")
.map(i => normalizeJid(i?.id || i?.lid?._serialized))
.filter(Boolean);

const BotNumber = normalizeJid(bot.user?.id || bot.user?.lid?._serialized);
const isBotGroupAdmins = BotNumber && groupAdmins.includes(BotNumber);

const isSenderAdmin = normalizedSender ? groupAdmins.includes(normalizedSender) : false;

// ------------------------------
// Nome do grupo e timestamp
// ------------------------------
const groupName = isGroup ? groupMetadata?.subject : "";
const timestamp = ctx.moment(info.messageTimestamp * 1000)
.tz("America/Sao_Paulo")
.format("YYYY-MM-DD HH:mm:ss");

const pushName = info.pushName || "Desconhecido";
const fromDisplay = isGroup
? `${groupName} (${from})`
: `Chat Privado (${from})`;

// ------------------------------
// Detecta tipo da mensagem
// ------------------------------
let messageType = "texto";
let displayBody = info.message?.conversation || "";

if (info.message?.imageMessage) {
displayBody = info.message.imageMessage.caption || "[Imagem]";
messageType = "imagem";
} else if (info.message?.videoMessage) {
displayBody = info.message.videoMessage.caption || "[Vídeo]";
messageType = "vídeo";
} else if (info.message?.stickerMessage) {
displayBody = "[Sticker]";
messageType = "sticker";
} else if (info.message?.audioMessage) {
displayBody = "[Áudio]";
messageType = "áudio";
} else if (info.message?.contactMessage) {
displayBody = "[Contato]";
messageType = "contato";
} else if (info.message?.locationMessage) {
displayBody = "[Localização]";
messageType = "localização";
} else if (info.message?.documentMessage || info.message?.documentWithCaptionMessage?.message?.documentMessage) {
displayBody = info.message.documentMessage?.title || info.message.documentWithCaptionMessage?.message?.documentMessage?.title || "[Documento]";
messageType = "documento";
} else if (info.message?.buttonsMessage) {
displayBody = info.message.buttonsMessage.contentText || "[Mensagem com Botões]";
messageType = "botões";
} else if (info.message?.listMessage) {
displayBody = info.message.listMessage.description || "[Lista]";
messageType = "lista";
} else if (info.message?.reactionMessage) {
displayBody = "[Reação]";
messageType = "reação";
} else if (info.message?.pollCreationMessage) {
displayBody = "[Enquete]";
messageType = "enquete";
} else if (info.message?.viewOnceMessage) {
displayBody = "[Mensagem de Visualização Única]";
messageType = "viewOnce";
} else if (info.message?.extendedTextMessage) {
displayBody = info.message.extendedTextMessage.text || "[Texto Estendido]";
messageType = "texto";
} else if (info.message?.conversation) {
displayBody = info.message.conversation;
messageType = "texto";
} else {
displayBody = "[Tipo Desconhecido]";
messageType = "desconhecido";
}


// ------------------------------
// Limite de exibição do conteúdo
// ------------------------------
const maxContentLength = 50;
if (displayBody.length > maxContentLength) {
displayBody = displayBody.slice(0, maxContentLength) + '...';
}

// ------------------------------
// Log completo do usuário e grupo
// ------------------------------
console.log(chalk.blue.bold('\n--- NOVA MENSAGEM RECEBIDA ---'));
console.log(chalk.gray('Data/Hora: ') + chalk.white(timestamp));
console.log(chalk.gray('Usuário: ') + chalk.white(`${pushName} (${normalizedSender})`));
console.log(chalk.gray('Admin: ') + chalk.white(isSenderAdmin ? 'Sim' : 'Não'));
console.log(chalk.gray('Grupo: ') + chalk.white(`${groupName || '[Privado]'} (${from})`));
console.log(chalk.gray('Bot Admin: ') + chalk.white(isBotGroupAdmins ? 'Sim' : 'Não'));
console.log(chalk.gray('Tipo: ') + chalk.white(messageType));
console.log(chalk.gray('Conteúdo: ') + chalk.white(displayBody));
console.log(chalk.gray('Admins do grupo: ') + chalk.white(groupAdmins.join(', ') || 'Nenhum'));
console.log(chalk.gray('-----------------------------'));
}
}
};