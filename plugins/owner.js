module.exports = {
  command: ["owner", "creator"],
  handler: async (sock, m, { settings }) => {
    const ownerNumber = settings.owner[0]
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${settings.ownerName}
TEL;type=CELL;type=VOICE;waid=\( {ownerNumber}:+ \){ownerNumber}
END:VCARD`

    await sock.sendMessage(m.key.remoteJid, {
      contacts: {
        displayName: settings.ownerName,
        contacts: [{ vcard }]
      }
    }, { quoted: m })
  }
}
