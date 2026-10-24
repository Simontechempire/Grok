module.exports = {
  command: [
    "setprefix", "setbotname", "setowner", "setpackname",
    "setauthor", "botinfo", "settings", "config",
    "resetsettings", "statusbot"
  ],
  owner: true,
  handler: async (sock, m, { args, text, command, settings }) => {
    const jid = m.key.remoteJid

    switch (command) {
      case "setprefix":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setprefix <symbol>" }, { quoted: m })
        settings.prefix = text[0]
        await sock.sendMessage(jid, { text: `✅ Prefix changed to: ${settings.prefix}` }, { quoted: m })
        break

      case "setbotname":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setbotname Grok" }, { quoted: m })
        settings.botName = text
        await sock.sendMessage(jid, { text: `✅ Bot name: ${text}` }, { quoted: m })
        break

      case "setowner":
        await sock.sendMessage(jid, { text: "Use !addowner / !delowner instead" }, { quoted: m })
        break

      case "setpackname":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setpackname MyPack" }, { quoted: m })
        settings.packname = text
        await sock.sendMessage(jid, { text: `✅ Packname: ${text}` }, { quoted: m })
        break

      case "setauthor":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setauthor Name" }, { quoted: m })
        settings.author = text
        await sock.sendMessage(jid, { text: `✅ Author: ${text}` }, { quoted: m })
        break

      case "botinfo":
      case "statusbot":
        const info = `
*Bot Info*
Name: ${settings.botName}
Prefix: ${settings.prefix}
Owner: ${settings.owner.join(", ")}
Mode: ${global.publicMode !== false ? "Public" : "Self"}
        `.trim()
        await sock.sendMessage(jid, { text: info }, { quoted: m })
        break

      case "settings":
      case "config":
        await sock.sendMessage(jid, {
          text: `Current settings loaded from settings.js\nUse individual set commands to change.`
        }, { quoted: m })
        break

      case "resetsettings":
        await sock.sendMessage(jid, { text: "Restart the bot to reload settings.js" }, { quoted: m })
        break
    }
  }
          }
