import axios from 'axios'
import fs from 'fs'
import os from 'os'
import ffmpeg from 'fluent-ffmpeg'
import yts from 'yt-search'
import fetch from 'node-fetch'

const extractVideoID = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw m.reply(`✧ Ejemplo: ${usedPrefix}${command} https://youtube.com/watch?v=_r7impapnQY`);

 await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})

  const args = text.split(' ');
  const videoUrl = args[0];
  const resolution = args[1] || '480';

const videoID = extractVideoID(videoUrl);
  if (!videoID) throw m.reply('✧ Ingresa un link válido de YouTube.');

  try {
    let dataos = await fetch(`https://api.zenkey.my.id/api/download/ytmp4?url=${videoUrl}&apikey=zenkey`)
    let dp = await dataos.json()
    let { title, mediaLink } = dp.result.content[0]

    if (!mediaLink) throw m.reply('No hay respuesta de la api.');
    
    const caption = `Aqui tiene su vídeo @${m.sender.split('@')[0]}`;

await conn.sendMessage(m.chat, { document: { url: mediaLink }, caption: caption, mimetype: 'video/mp4', fileName: `${title}` + `.mp4`}, {quoted: m })
await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})

  } catch (error) {
    console.error(`Error: ${error.message}`);
    await conn.sendMessage(m.chat, { react: { text: '❎', key: m.key }})
    throw m.reply(`Failed to process request: ${error.message || error}`);
  }
};

handler.help = ['ytmp4v2 *<link>*','ytvdocv2 *<link>*'];
handler.tags = ['downloader'];
handler.command = /^(ytmp4v2|ytvdocv2|ytmp4docv2)$/i;

handler.register = true
handler.disable = false

export default handler