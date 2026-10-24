module.exports = {
  command: [
    "warn", "unwarn", "listwarn", "resetwarn",
    "mute", "unmute", "mutelist",
    "kickwarn", "warninfo", "setwarn"
  ],
  group: true,
  handler: async (sock, m, { args, text, command, settings, isOwner, sender }) => {
    const jid = m.key.remoteJid
    global.warns = global.warns || {}

    const groupMeta = await sock.groupMetadata(jid)
    const isAdmin = groupMeta.participants.find(p => p.id === sender)?.admin
    if (!isAdmin && !isOwner) {
      return sock.sendMessage(jid, { text: settings.messages.adminOnly }, { quoted: m })
    }

    const target = m.message?.extendedTextMessage?.contextInfo?.participant
      || (text ? text.replace(/\D/g, "") + "@s.whatsapp.net" : null)

    switch (command) {
      case "warn":
        if (!target) return sock.sendMessage(jid, { text: "Reply to user or tag" }, { quoted: m })
        global.warns[jid] = global.warns[jid] || {}
        global.warns[jid][target] = (global.warns[jid][target] || 0) + 1
        const count = global.warns[jid][target]
        await sock.sendMessage(jid, {
          text: `⚠️ @\( {target.split("@")[0]} has been warned\nTotal warns: * \){count}*`,
          mentions: [target]
        }, { quoted: m })
        break

      case "unwarn":
        if (!target) return sock.sendMessage(jid, { text: "Reply to user" }, { quoted: m })
        if (global.warns[jid]?.[target]) {
          global.warns[jid][target]--
          if (global.warns[jid][target] <= 0) delete global.warns[jid][target]
        }
        await sock.sendMessage(jid, { text: "✅ Warn removed" }, { quoted: m })
        break

      case "listwarn":
        const warns = global.warns[jid] || {}
        let list = Object.entries(warns).map(([u, c]) => `• @${u.split("@")[0]} → ${c}`).join("\n") || "No warns"
        await sock.sendMessage(jid, { text: `*Warn List*\n\n${list}`, mentions: Object.keys(warns) }, { quoted: m })
        break

      case "resetwarn":
        if (!isOwner) return
        global.warns[jid] = {}
        await sock.sendMessage(jid, { text: "✅ All warns reset" }, { quoted: m })
        break

      case "mute":
        await sock.sendMessage(jid, { text: "Mute feature – use WhatsApp mute or implement duration mute" }, { quoted: m })
        break

      case "unmute":
        await sock.sendMessage(jid, { text: "Unmute feature" }, { quoted: m })
        break

      case "mutelist":
        await sock.sendMessage(jid, { text: "Muted users list (implement with Map)" }, { quoted: m })
        break

      case "kickwarn":
        await sock.sendMessage(jid, { text: "Auto-kick when warns reach limit (set with !setwarn)" }, { quoted: m })
        break

      case "warninfo":
        await sock.sendMessage(jid, { text: "Current warn settings: max 3 (default)" }, { quoted: m })
        break

      case "setwarn":
        if (!isOwner) return
        await sock.sendMessage(jid, { text: "Usage: !setwarn <number>  (max warns before kick)" }, { quoted: m })
        break
    }
  }
    }
