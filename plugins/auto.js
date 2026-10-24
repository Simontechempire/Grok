module.exports = {
  command: [
    "welcome", "left", "goodbye", "autowelcome",
    "autoread", "autotyping", "autobio", "autorecord",
    "unavailable", "available", "online", "offline",
    "setwelcome", "setleft", "setgoodbye",
    "autosticker", "autoname", "autorespond", "leveling", "afk"
  ],
  handler: async (sock, m, { args, text, command, settings, isOwner }) => {
    const jid = m.key.remoteJid
    global.auto = global.auto || {
      welcome: true,
      left: true,
      autoread: settings.autoRead,
      autotyping: false
    }

    // Most are toggles – owner only for safety
    if (!isOwner && !["afk"].includes(command)) {
      return sock.sendMessage(jid, { text: settings.messages.ownerOnly }, { quoted: m })
    }

    switch (command) {
      case "welcome":
      case "autowelcome":
        global.auto.welcome = !global.auto.welcome
        await sock.sendMessage(jid, { text: `Welcome: *${global.auto.welcome ? "ON" : "OFF"}*` }, { quoted: m })
        break

      case "left":
      case "goodbye":
        global.auto.left = !global.auto.left
        await sock.sendMessage(jid, { text: `Goodbye: *${global.auto.left ? "ON" : "OFF"}*` }, { quoted: m })
        break

      case "autoread":
        global.auto.autoread = !global.auto.autoread
        await sock.sendMessage(jid, { text: `Auto Read: *${global.auto.autoread ? "ON" : "OFF"}*` }, { quoted: m })
        break

      case "autotyping":
        global.auto.autotyping = !global.auto.autotyping
        await sock.sendMessage(jid, { text: `Auto Typing: *${global.auto.autotyping ? "ON" : "OFF"}*` }, { quoted: m })
        break

      case "setwelcome":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setwelcome Hello @user" }, { quoted: m })
        global.welcomeText = text
        await sock.sendMessage(jid, { text: "✅ Welcome message set" }, { quoted: m })
        break

      case "setleft":
      case "setgoodbye":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setleft Goodbye @user" }, { quoted: m })
        global.leftText = text
        await sock.sendMessage(jid, { text: "✅ Left message set" }, { quoted: m })
        break

      case "autobio":
      case "autorecord":
      case "unavailable":
      case "available":
      case "online":
      case "offline":
      case "autosticker":
      case "autoname":
      case "autorespond":
      case "leveling":
        await sock.sendMessage(jid, { text: `Toggle *${command}* – implement presence / bio logic here` }, { quoted: m })
        break

      case "afk":
        global.afk = global.afk || {}
        global.afk[m.key.participant || m.key.remoteJid] = text || "AFK"
        await sock.sendMessage(jid, { text: `You are now AFK: ${text || "AFK"}` }, { quoted: m })
        break
    }
  }
}
