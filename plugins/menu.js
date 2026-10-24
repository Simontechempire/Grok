module.exports = {
  command: ["menu", "help", "bot"],
  handler: async (sock, m, { settings, prefix }) => {
    const menu = `
╔══════════════════╗
║   *${settings.botName}* Menu
╚══════════════════╝

*Owner:* ${settings.ownerName}
*Prefix:* ${prefix}

┌─「 Main 」
│ ${prefix}menu
│ ${prefix}ping
│ ${prefix}owner
│ ${prefix}runtime
└──────────────

┌─「 Fun 」
│ ${prefix}sticker
│ ${prefix}quote
└──────────────

┌─「 AI 」
│ ${prefix}ai <question>
└──────────────

┌─「 Owner 」
│ ${prefix}broadcast
│ ${prefix}join
└──────────────

> Powered by Grok Bot
`
    await sock.sendMessage(m.key.remoteJid, { text: menu.trim() }, { quoted: m })
  }
}
