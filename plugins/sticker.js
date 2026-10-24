module.exports = {
  command: ["sticker", "s", "stiker"],
  handler: async (sock, m, { settings }) => {
    // Basic placeholder – you can expand with sharp / wa-sticker-formatter later
    await sock.sendMessage(m.key.remoteJid, {
      text: "📎 Send an image/video with caption *!sticker* to convert (feature coming soon / add media handler)."
    }, { quoted: m })
  }
}
