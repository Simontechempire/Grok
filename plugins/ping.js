module.exports = {
  command: ["ping", "p"],
  handler: async (sock, m) => {
    const start = Date.now()
    const sent = await sock.sendMessage(m.key.remoteJid, { text: "Pong!" }, { quoted: m })
    const latency = Date.now() - start
    await sock.sendMessage(m.key.remoteJid, {
      text: `🏓 *Pong!*\nLatency: ${latency} ms`,
      edit: sent.key
    })
  }
}
