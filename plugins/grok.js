module.exports = {
  command: ["grok", "ai", "ask", "gpt"],
  handler: async (sock, m, { args, text, settings }) => {
    const jid = m.key.remoteJid
    if(!text) return sock.sendMessage(jid, { text: "Ask me something! Example: !grok what is Node.js" }, { quoted: m })

    await sock.sendMessage(jid, { text: "🤖 Grok thinking..." }, { quoted: m })

    try {
      // Replace with your actual Grok API call
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.grokApiKey || process.env.GROK_API_KEY}`
        },
        body: JSON.stringify({
          model: "grok-3-mini",
          messages: [{ role: "user", content: text }]
        })
      })
      const data = await response.json()
      const answer = data.choices?.[0]?.message?.content || "No reply from Grok"
      
      return sock.sendMessage(jid, { text: answer }, { quoted: m })
    } catch(e) {
      console.error(e)
      return sock.sendMessage(jid, { text: `❌ Grok error: ${e.message}` }, { quoted: m })
    }
  }
}
