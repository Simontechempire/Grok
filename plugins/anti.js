module.exports = {
  command: [
    "antilink", "antivirtex", "antiviewonce", "antidelete",
    "antibot", "anticall", "antispam", "antitoxic",
    "antiwame", "antipromote", "antidemote", "antikick",
    "antilinkgc", "antitag", "antimention", "antiswearing",
    "antifake", "antibadword", "antisticker", "antipoll"
  ],
  group: true,
  handler: async (sock, m, { args, text, command, settings, isOwner, sender }) => {
    const jid = m.key.remoteJid
    global.anti = global.anti || {}

    const groupMeta = await sock.groupMetadata(jid).catch(() => null)
    const isAdmin = groupMeta?.participants.find(p => p.id === sender)?.admin
    if (!isAdmin && !isOwner) {
      return sock.sendMessage(jid, { text: settings.messages.adminOnly }, { quoted: m })
    }

    // Toggle system
    global.anti[jid] = global.anti[jid] || {}

    const toggle = (key) => {
      global.anti[jid][key] = !global.anti[jid][key]
      return global.anti[jid][key] ? "ON" : "OFF"
    }

    switch (command) {
      case "antilink":
        await sock.sendMessage(jid, { text: `Anti Link: *${toggle("antilink")}*` }, { quoted: m })
        break
      case "antivirtex":
        await sock.sendMessage(jid, { text: `Anti Virtex: *${toggle("antivirtex")}*` }, { quoted: m })
        break
      case "antiviewonce":
        await sock.sendMessage(jid, { text: `Anti ViewOnce: *${toggle("antiviewonce")}*` }, { quoted: m })
        break
      case "antidelete":
        await sock.sendMessage(jid, { text: `Anti Delete: *${toggle("antidelete")}*` }, { quoted: m })
        break
      case "antibot":
        await sock.sendMessage(jid, { text: `Anti Bot: *${toggle("antibot")}*` }, { quoted: m })
        break
      case "anticall":
        await sock.sendMessage(jid, { text: `Anti Call: *${toggle("anticall")}*` }, { quoted: m })
        break
      case "antispam":
        await sock.sendMessage(jid, { text: `Anti Spam: *${toggle("antispam")}*` }, { quoted: m })
        break
      case "antitoxic":
        await sock.sendMessage(jid, { text: `Anti Toxic: *${toggle("antitoxic")}*` }, { quoted: m })
        break
      case "antiwame":
        await sock.sendMessage(jid, { text: `Anti Wa.me: *${toggle("antiwame")}*` }, { quoted: m })
        break
      case "antipromote":
        await sock.sendMessage(jid, { text: `Anti Promote: *${toggle("antipromote")}*` }, { quoted: m })
        break
      case "antidemote":
        await sock.sendMessage(jid, { text: `Anti Demote: *${toggle("antidemote")}*` }, { quoted: m })
        break
      case "antikick":
        await sock.sendMessage(jid, { text: `Anti Kick: *${toggle("antikick")}*` }, { quoted: m })
        break
      case "antilinkgc":
        await sock.sendMessage(jid, { text: `Anti Link GC: *${toggle("antilinkgc")}*` }, { quoted: m })
        break
      case "antitag":
        await sock.sendMessage(jid, { text: `Anti Tag: *${toggle("antitag")}*` }, { quoted: m })
        break
      case "antimention":
        await sock.sendMessage(jid, { text: `Anti Mention: *${toggle("antimention")}*` }, { quoted: m })
        break
      case "antiswearing":
        await sock.sendMessage(jid, { text: `Anti Swearing: *${toggle("antiswearing")}*` }, { quoted: m })
        break
      case "antifake":
        await sock.sendMessage(jid, { text: `Anti Fake: *${toggle("antifake")}*` }, { quoted: m })
        break
      case "antibadword":
        await sock.sendMessage(jid, { text: `Anti Badword: *${toggle("antibadword")}*` }, { quoted: m })
        break
      case "antisticker":
        await sock.sendMessage(jid, { text: `Anti Sticker: *${toggle("antisticker")}*` }, { quoted: m })
        break
      case "antipoll":
        await sock.sendMessage(jid, { text: `Anti Poll: *${toggle("antipoll")}*` }, { quoted: m })
        break
    }
  }
}
