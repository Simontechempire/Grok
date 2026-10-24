module.exports = {
  command: ["ai", "gpt", "grok"],
  handler: async (sock, m, { text, settings }) => {
    if (!text) {
      return sock.sendMessage(m.key.remoteJid, {
        text: `Usage: ${settings.prefix}ai your question`
      }, { quoted: m })
    }
    await sock.sendMessage(m.key.remoteJid, {
      text: `🤖 *Grok AI*\n\nYou asked: ${text}\n\n(Connect your own AI API key here – OpenAI / xAI / Groq etc.)`
    }, { quoted: m })
  }
}
