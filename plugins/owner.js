module.exports = {
  command: [
    "broadcast", "bc", "join", "leave", "block", "unblock",
    "ban", "unban", "listban", "setpp", "setname", "setbio",
    "restart", "shutdown", "self", "public", "mode",
    "addowner", "delowner", "getsession"
  ],
  owner: true,
  handler: async (sock, m, { args, text, command, settings, isOwner }) => {
    const jid = m.key.remoteJid

    switch (command) {
      case "broadcast":
      case "bc":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !broadcast <message>" }, { quoted: m })
        await sock.sendMessage(jid, { text: `✅ Broadcast queued:\n\n${text}` }, { quoted: m })
        // Expand later with full chat store
        break

      case "join":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !join <group link>" }, { quoted: m })
        try {
          const invite = text.split("https://chat.whatsapp.com/")[1]
          if (!invite) throw new Error("Invalid link")
          await sock.groupAcceptInvite(invite)
          await sock.sendMessage(jid, { text: "✅ Joined the group!" }, { quoted: m })
        } catch (e) {
          await sock.sendMessage(jid, { text: "❌ Failed to join: " + e.message }, { quoted: m })
        }
        break

      case "leave":
        if (!m.key.remoteJid.endsWith("@g.us")) return
        await sock.sendMessage(jid, { text: "👋 Leaving group..." }, { quoted: m })
        await sock.groupLeave(jid)
        break

      case "block":
        if (!text && !m.message?.extendedTextMessage?.contextInfo?.participant) {
          return sock.sendMessage(jid, { text: "Reply to user or give number" }, { quoted: m })
        }
        const blockNum = text ? text.replace(/\D/g, "") + "@s.whatsapp.net"
          : m.message.extendedTextMessage.contextInfo.participant
        await sock.updateBlockStatus(blockNum, "block")
        await sock.sendMessage(jid, { text: `✅ Blocked ${blockNum}` }, { quoted: m })
        break

      case "unblock":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !unblock <number>" }, { quoted: m })
        const unNum = text.replace(/\D/g, "") + "@s.whatsapp.net"
        await sock.updateBlockStatus(unNum, "unblock")
        await sock.sendMessage(jid, { text: `✅ Unblocked ${unNum}` }, { quoted: m })
        break

      case "ban":
        // Simple in-memory ban list example
        global.banned = global.banned || new Set()
        const banTarget = text ? text.replace(/\D/g, "") : null
        if (!banTarget) return sock.sendMessage(jid, { text: "Usage: !ban <number>" }, { quoted: m })
        global.banned.add(banTarget)
        await sock.sendMessage(jid, { text: `✅ Banned ${banTarget}` }, { quoted: m })
        break

      case "unban":
        global.banned = global.banned || new Set()
        const unbanTarget = text ? text.replace(/\D/g, "") : null
        if (!unbanTarget) return sock.sendMessage(jid, { text: "Usage: !unban <number>" }, { quoted: m })
        global.banned.delete(unbanTarget)
        await sock.sendMessage(jid, { text: `✅ Unbanned ${unbanTarget}` }, { quoted: m })
        break

      case "listban":
        global.banned = global.banned || new Set()
        const list = [...global.banned].join("\n") || "No one banned"
        await sock.sendMessage(jid, { text: `*Banned Users*\n\n${list}` }, { quoted: m })
        break

      case "setpp":
        await sock.sendMessage(jid, { text: "Send an image with caption !setpp (full media handler needed)" }, { quoted: m })
        break

      case "setname":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setname <new name>" }, { quoted: m })
        await sock.updateProfileName(text)
        await sock.sendMessage(jid, { text: `✅ Bot name changed to: ${text}` }, { quoted: m })
        break

      case "setbio":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setbio <text>" }, { quoted: m })
        await sock.updateProfileStatus(text)
        await sock.sendMessage(jid, { text: `✅ Bio updated` }, { quoted: m })
        break

      case "restart":
        await sock.sendMessage(jid, { text: "🔄 Restarting bot..." }, { quoted: m })
        process.exit(0) // Railway will restart
        break

      case "shutdown":
        await sock.sendMessage(jid, { text: "🛑 Shutting down..." }, { quoted: m })
        process.exit(1)
        break

      case "self":
        global.publicMode = false
        await sock.sendMessage(jid, { text: "✅ Bot is now in *Self* mode (owner only)" }, { quoted: m })
        break

      case "public":
        global.publicMode = true
        await sock.sendMessage(jid, { text: "✅ Bot is now in *Public* mode" }, { quoted: m })
        break

      case "mode":
        const mode = global.publicMode !== false ? "Public" : "Self"
        await sock.sendMessage(jid, { text: `Current mode: *${mode}*` }, { quoted: m })
        break

      case "addowner":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !addowner <number>" }, { quoted: m })
        const newOwner = text.replace(/\D/g, "")
        if (!settings.owner.includes(newOwner)) settings.owner.push(newOwner)
        await sock.sendMessage(jid, { text: `✅ Added owner: ${newOwner}` }, { quoted: m })
        break

      case "delowner":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !delowner <number>" }, { quoted: m })
        const delOwner = text.replace(/\D/g, "")
        settings.owner = settings.owner.filter(o => o !== delOwner)
        await sock.sendMessage(jid, { text: `✅ Removed owner: ${delOwner}` }, { quoted: m })
        break

      case "getsession":
        await sock.sendMessage(jid, { text: "Session folder is `./session`. Download it from Railway volume or server." }, { quoted: m })
        break
    }
  }
                                                                            }
