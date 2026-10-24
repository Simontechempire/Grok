module.exports = {
  command: ["runtime", "uptime"],
  handler: async (sock, m) => {
    const uptime = process.uptime()
    const h = Math.floor(uptime / 3600)
    const min = Math.floor((uptime % 3600) / 60)
    const s = Math.floor(uptime % 60)
    await sock.sendMessage(m.key.remoteJid, {
      text: `⏱️ *Runtime*\n${h}h ${min}m ${s}s`
    }, { quoted: m })
  }
}
