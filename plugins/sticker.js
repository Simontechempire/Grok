module.exports = {
  command: [
    "sticker", "s", "stiker", "toimg", "toimage", "tovid", "tovideo",
    "take", "steal", "smeme", "stickermeme", "attp", "ttp",
    "emojimix", "emix", "circle", "round", "stickergif", "sgif", "wm"
  ],
  handler: async (sock, m, { args, text, command, settings }) => {
    const jid = m.key.remoteJid

    // Most sticker features need extra packages (sharp, wa-sticker-formatter, ffmpeg)
    // These are ready-to-expand stubs

    switch (command) {
      case "sticker":
      case "s":
      case "stiker":
        await sock.sendMessage(jid, {
          text: "📎 Reply to an image/video with caption *!sticker*\n\n(Requires media download + sticker library)"
        }, { quoted: m })
        break

      case "toimg":
      case "toimage":
        await sock.sendMessage(jid, { text: "Reply to a sticker with *!toimg*" }, { quoted: m })
        break

      case "tovid":
      case "tovideo":
        await sock.sendMessage(jid, { text: "Reply to an animated sticker with *!tovid*" }, { quoted: m })
        break

      case "take":
      case "steal":
      case "wm":
        await sock.sendMessage(jid, {
          text: `Usage: !take <packname | author>\nExample: !take Grok|Owner`
        }, { quoted: m })
        break

      case "smeme":
      case "stickermeme":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !smeme top text | bottom text" }, { quoted: m })
        await sock.sendMessage(jid, { text: `Meme sticker: ${text}` }, { quoted: m })
        break

      case "attp":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !attp <text>" }, { quoted: m })
        await sock.sendMessage(jid, { text: `ATTP: ${text}\n(Requires attp API or canvas)` }, { quoted: m })
        break

      case "ttp":
        if (!text) return sock.sendMessage(jid, { text: "Usage: !ttp <text>" }, { quoted: m })
        await sock.sendMessage(jid, { text: `TTP: ${text}` }, { quoted: m })
        break

      case "emojimix":
      case "emix":
        if (!text || !text.includes("+")) {
          return sock.sendMessage(jid, { text: "Usage: !emojimix 😂+🔥" }, { quoted: m })
        }
        await sock.sendMessage(jid, { text: `Emoji mix: ${text}` }, { quoted: m })
        break

      case "circle":
      case "round":
        await sock.sendMessage(jid, { text: "Reply to image with *!circle* to make round sticker" }, { quoted: m })
        break

      case "stickergif":
      case "sgif":
        await sock.sendMessage(jid, { text: "Reply to video/gif with *!sgif*" }, { quoted: m })
        break
    }
  }
                                           }
