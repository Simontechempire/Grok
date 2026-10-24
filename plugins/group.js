module.exports = {
  command: [
    "tagall", "hidetag", "promote", "demote", "kick", "add",
    "group", "setname", "setdesc", "setppgc", "link", "revoke",
    "listadmin", "totag", "ephemeral", "editinfo", "invite",
    "leavegc", "kickall", "promoteall"
  ],
  group: true,
  handler: async (sock, m, { args, text, command, settings, isOwner, sender }) => {
    const jid = m.key.remoteJid
    const groupMeta = await sock.groupMetadata(jid)
    const participants = groupMeta.participants
    const isAdmin = participants.find(p => p.id === sender)?.admin
    const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net"
    const botAdmin = participants.find(p => p.id === botId)?.admin

    // Helper
    const needAdmin = async () => {
      if (!isAdmin && !isOwner) {
        await sock.sendMessage(jid, { text: settings.messages.adminOnly }, { quoted: m })
        return false
      }
      if (!botAdmin) {
        await sock.sendMessage(jid, { text: settings.messages.botAdmin }, { quoted: m })
        return false
      }
      return true
    }

    switch (command) {
      case "tagall":
        if (!(await needAdmin())) return
        let teks = text ? `📢 *Announcement*\n\n${text}\n\n` : "📢 *Tag All*\n\n"
        for (let p of participants) teks += `@${p.id.split("@")[0]}\n`
        await sock.sendMessage(jid, {
          text: teks,
          mentions: participants.map(p => p.id)
        }, { quoted: m })
        break

      case "hidetag":
        if (!(await needAdmin())) return
        await sock.sendMessage(jid, {
          text: text || "Hidden tag",
          mentions: participants.map(p => p.id)
        }, { quoted: m })
        break

      case "promote":
        if (!(await needAdmin())) return
        const promoteUser = m.message?.extendedTextMessage?.contextInfo?.participant
          || (text ? text.replace(/\D/g, "") + "@s.whatsapp.net" : null)
        if (!promoteUser) return sock.sendMessage(jid, { text: "Reply or tag user" }, { quoted: m })
        await sock.groupParticipantsUpdate(jid, [promoteUser], "promote")
        await sock.sendMessage(jid, { text: "✅ Promoted" }, { quoted: m })
        break

      case "demote":
        if (!(await needAdmin())) return
        const demoteUser = m.message?.extendedTextMessage?.contextInfo?.participant
          || (text ? text.replace(/\D/g, "") + "@s.whatsapp.net" : null)
        if (!demoteUser) return sock.sendMessage(jid, { text: "Reply or tag user" }, { quoted: m })
        await sock.groupParticipantsUpdate(jid, [demoteUser], "demote")
        await sock.sendMessage(jid, { text: "✅ Demoted" }, { quoted: m })
        break

      case "kick":
        if (!(await needAdmin())) return
        const kickUser = m.message?.extendedTextMessage?.contextInfo?.participant
          || (text ? text.replace(/\D/g, "") + "@s.whatsapp.net" : null)
        if (!kickUser) return sock.sendMessage(jid, { text: "Reply or tag user" }, { quoted: m })
        await sock.groupParticipantsUpdate(jid, [kickUser], "remove")
        await sock.sendMessage(jid, { text: "✅ Kicked" }, { quoted: m })
        break

      case "add":
        if (!(await needAdmin())) return
        if (!text) return sock.sendMessage(jid, { text: "Usage: !add 234xxxx" }, { quoted: m })
        const addNum = text.replace(/\D/g, "") + "@s.whatsapp.net"
        await sock.groupParticipantsUpdate(jid, [addNum], "add")
        await sock.sendMessage(jid, { text: "✅ Add request sent" }, { quoted: m })
        break

      case "group":
        if (!(await needAdmin())) return
        if (!args[0]) return sock.sendMessage(jid, { text: "Usage: !group open / close" }, { quoted: m })
        const gstate = args[0].toLowerCase() === "open" ? "not_announcement" : "announcement"
        await sock.groupSettingUpdate(jid, gstate)
        await sock.sendMessage(jid, { text: `✅ Group now ${args[0]}` }, { quoted: m })
        break

      case "setname":
        if (!(await needAdmin())) return
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setname New Name" }, { quoted: m })
        await sock.groupUpdateSubject(jid, text)
        await sock.sendMessage(jid, { text: "✅ Group name updated" }, { quoted: m })
        break

      case "setdesc":
        if (!(await needAdmin())) return
        if (!text) return sock.sendMessage(jid, { text: "Usage: !setdesc description" }, { quoted: m })
        await sock.groupUpdateDescription(jid, text)
        await sock.sendMessage(jid, { text: "✅ Description updated" }, { quoted: m })
        break

      case "setppgc":
        await sock.sendMessage(jid, { text: "Send image with caption !setppgc" }, { quoted: m })
        break

      case "link":
      case "invite":
        if (!(await needAdmin())) return
        const code = await sock.groupInviteCode(jid)
        await sock.sendMessage(jid, { text: `https://chat.whatsapp.com/${code}` }, { quoted: m })
        break

      case "revoke":
        if (!(await needAdmin())) return
        await sock.groupRevokeInvite(jid)
        await sock.sendMessage(jid, { text: "✅ Invite link revoked" }, { quoted: m })
        break

      case "listadmin":
        const admins = participants.filter(p => p.admin).map(p => `• @${p.id.split("@")[0]}`)
        await sock.sendMessage(jid, {
          text: `*Group Admins*\n\n${admins.join("\n")}`,
          mentions: participants.filter(p => p.admin).map(p => p.id)
        }, { quoted: m })
        break

      case "totag":
        if (!(await needAdmin())) return
        // Reply to a message to tag everyone with it
        await sock.sendMessage(jid, { text: "Reply to a message with !totag" }, { quoted: m })
        break

      case "ephemeral":
        if (!(await needAdmin())) return
        await sock.sendMessage(jid, { text: "Usage: !ephemeral 24h / 7d / 90d / off" }, { quoted: m })
        break

      case "editinfo":
        if (!(await needAdmin())) return
        await sock.sendMessage(jid, { text: "Usage: !editinfo admin / all" }, { quoted: m })
        break

      case "leavegc":
        if (!isOwner) return
        await sock.groupLeave(jid)
        break

      case "kickall":
        if (!isOwner) return
        await sock.sendMessage(jid, { text: "⚠️ Dangerous command – implement carefully" }, { quoted: m })
        break

      case "promoteall":
        if (!isOwner) return
        await sock.sendMessage(jid, { text: "⚠️ Owner only – implement carefully" }, { quoted: m })
        break
    }
  }
    }
