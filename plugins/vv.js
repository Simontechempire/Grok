module.exports = {
  command: ["vv", "viewonce", "readvo", "reveal"],
  handler: async (sock, m, { settings }) => {
    const jid = m.key.remoteJid

    // Must reply to a View Once message
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
    if (!quoted) {
      return sock.sendMessage(jid, {
        text: `⚠️ Reply to a *View Once* message with *${settings.prefix}vv*`
      }, { quoted: m })
    }

    try {
      // View Once Image
      if (quoted.viewOnceMessageV2 || quoted.viewOnceMessage) {
        const viewOnce = quoted.viewOnceMessageV2?.message || quoted.viewOnceMessage?.message

        if (viewOnce?.imageMessage) {
          const buffer = await sock.downloadMediaMessage({
            key: m.message.extendedTextMessage.contextInfo,
            message: viewOnce
          })

          await sock.sendMessage(jid, {
            image: buffer,
            caption: "✅ *View Once Image Revealed*"
          }, { quoted: m })
          return
        }

        if (viewOnce?.videoMessage) {
          const buffer = await sock.downloadMediaMessage({
            key: m.message.extendedTextMessage.contextInfo,
            message: viewOnce
          })

          await sock.sendMessage(jid, {
            video: buffer,
            caption: "✅ *View Once Video Revealed*"
          }, { quoted: m })
          return
        }
      }

      // Fallback for older viewOnce format
      if (quoted.imageMessage?.viewOnce || quoted.videoMessage?.viewOnce) {
        const type = quoted.imageMessage ? "image" : "video"
        const buffer = await sock.downloadMediaMessage({
          key: m.message.extendedTextMessage.contextInfo,
          message: quoted
        })

        await sock.sendMessage(jid, {
          [type]: buffer,
          caption: `✅ *View Once ${type} Revealed*`
        }, { quoted: m })
        return
      }

      // Not a view once message
      await sock.sendMessage(jid, {
        text: "❌ This is not a View Once message."
      }, { quoted: m })

    } catch (err) {
      console.error("VV Error:", err)
      await sock.sendMessage(jid, {
        text: "❌ Failed to reveal View Once message.\nMake sure you replied to a valid View Once photo/video."
      }, { quoted: m })
    }
  }
            }
