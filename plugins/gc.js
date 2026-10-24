module.exports = {
  command: ["togstatus", "bcgc", "broadcastgc", "postgc", "gc"],
  owner: true, // Only owner can use this
  handler: async (sock, m, { text, settings, prefix }) => {
    const jid = m.key.remoteJid

    if (!text) {
      return sock.sendMessage(jid, {
        text: `*Usage:*\n\( {prefix}togstatus <message>\n\nExample:\n \){prefix}togstatus Hello everyone!`
      }, { quoted: m })
    }

    try {
      // Get all groups the bot is in
      const groups = Object.keys(await sock.groupFetchAllParticipating())

      if (groups.length === 0) {
        return sock.sendMessage(jid, {
          text: "❌ Bot is not in any group."
        }, { quoted: m })
      }

      await sock.sendMessage(jid, {
        text: `⏳ Sending message to *${groups.length}* groups...`
      }, { quoted: m })

      let success = 0
      let failed = 0

      for (const groupId of groups) {
        try {
          await sock.sendMessage(groupId, {
            text: text
          })
          success++
          // Small delay to avoid spam detection
          await new Promise(r => setTimeout(r, 1500))
        } catch (err) {
          failed++
          console.log("Failed to send to:", groupId, err.message)
        }
      }

      await sock.sendMessage(jid, {
        text: `✅ *Broadcast Completed*\n\n• Success: ${success}\n• Failed: ${failed}\n• Total Groups: ${groups.length}`
      }, { quoted: m })

    } catch (err) {
      console.error("togstatus error:", err)
      await sock.sendMessage(jid, {
        text: "❌ Failed to broadcast. Error: " + err.message
      }, { quoted: m })
    }
  }
          }
