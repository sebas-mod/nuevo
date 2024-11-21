const rewards = {
  limit: 7500,
}
const cooldown = 86400000
let handler = async (m,{ conn} ) => {
  let user = global.db.data.users[m.sender]

  if (user.role === 'Free user' && user.limit >= 7500) {
    conn.reply(m.chat, '✧ Los usuarios normales obtendran 7500 Eris', m)
    return
  }

  if (new Date - user.lastclaim < cooldown) throw m.reply(`✧ Ya reclamaste los eris diarios, regresa *${((user.lastclaim + cooldown) - new Date()).toTimeString()}*`);
  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    user[reward] += rewards[reward]
    text += `*+${rewards[reward]}* ${reward}\n`
  }
  conn.reply(m.chat, text.trim(), m)
  user.lastclaim = new Date * 1
}
handler.help = ['claimeris']
handler.tags = ['main']
handler.command = /^(claimeris)$/i

handler.cooldown = cooldown
handler.disable = false
handler.register = true

export default handler
