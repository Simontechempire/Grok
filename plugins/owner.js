module.exports = {
  command: [
    "menu",
    "ping",
    "runtime",
    "owner",
    "restart",
    "shutdown",
    "broadcast",
    "block",
    "unblock",
    "join",
    "leave",
    "setprefix",
    "setname",
    "setbio",
    "clear",
    "getsession",
    "listgroup",
    "listplugin",
    "update",
    "ownerinfo"
  ],

  handler: async (sock, m, args, command) => {
    const from = m.key.remoteJid;
    const text = args.join(" ");

    // Configure your owner number in your main bot settings.
    const ownerNumber = "234XXXXXXXXXX";

    const sender = (
      m.key.participant ||
      m.key.remoteJid ||
      ""
    ).split("@")[0].split(":")[0];

    const isOwner = sender === ownerNumber;

    // Owner permission check
    const ownerCommands = [
      "restart",
      "shutdown",
      "broadcast",
      "block",
      "unblock",
      "join",
      "leave",
      "setprefix",
      "setname",
      "setbio",
      "clear",
      "update"
    ];

    if (ownerCommands.includes(command) && !isOwner) {
      return sock.sendMessage(
        from,
        {
          text: "❌ This command is restricted to the bot owner!"
        },
        { quoted: m }
      );
    }

    switch (command) {

      // 1. MENU
      case "menu":
        return sock.sendMessage(
          from,
          {
            text: `🐺 *WOLF XMD BOT*

━━━━━━━━━━━━━━━━━━
👑 OWNER COMMANDS
━━━━━━━━━━━━━━━━━━

.menu
.ping
.runtime
.owner
.restart
.shutdown
.broadcast
.block
.unblock
.join
.leave
.setprefix
.setname
.setbio
.clear
.getsession
.listgroup
.listplugin
.update
.ownerinfo

━━━━━━━━━━━━━━━━━━
⚡ POWERED BY WOLF XMD
━━━━━━━━━━━━━━━━━━`
          },
          { quoted: m }
        );

      // 2. PING
      case "ping": {
        const start = Date.now();

        await sock.sendMessage(
          from,
          { text: "🏓 Pinging..." },
          { quoted: m }
        );

        const latency = Date.now() - start;

        return sock.sendMessage(from, {
          text: `🏓 Pong!\n⚡ Response: ${latency}ms`
        });
      }

      // 3. RUNTIME
      case "runtime": {
        const seconds = Math.floor(process.uptime());
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return sock.sendMessage(
          from,
          {
            text:
              `⏱️ *BOT RUNTIME*\n\n` +
              `📅 Days: ${days}\n` +
              `🕐 Hours: ${hours}\n` +
              `⏳ Minutes: ${minutes}\n` +
              `⚡ Seconds: ${secs}`
          },
          { quoted: m }
        );
      }

      // 4. OWNER
      case "owner":
      case "ownerinfo":
        return sock.sendMessage(
          from,
          {
            text:
              `👑 *BOT OWNER INFORMATION*\n\n` +
              `🐺 Bot: WOLF XMD\n` +
              `👑 Owner: ${ownerNumber}\n` +
              `⚡ Status: Online`
          },
          { quoted: m }
        );

      // 5. RESTART
      case "restart":
        await sock.sendMessage(
          from,
          { text: "🔄 Restarting bot..." },
          { quoted: m }
        );

        // Requires a process manager such as PM2.
        if (process.env.PM2_HOME) {
          process.exit(0);
        }

        return sock.sendMessage(from, {
          text: "⚠️ Configure a process manager to enable restarting."
        });

      // 6. SHUTDOWN
      case "shutdown":
        await sock.sendMessage(
          from,
          {
            text: "🛑 Shutting down the bot process..."
          },
          { quoted: m }
        );

        process.exit(0);
        break;

      // 7. BROADCAST
      case "broadcast": {
        if (!text) {
          return sock.sendMessage(
            from,
            {
              text: "❌ Usage: .broadcast Your announcement"
            },
            { quoted: m }
          );
        }

        const chats = await sock.groupFetchAllParticipating();
        const groups = Object.keys(chats);

        let sent = 0;
        let failed = 0;

        for (const jid of groups) {
          try {
            await sock.sendMessage(jid, {
              text: `📢 *WOLF XMD ANNOUNCEMENT*\n\n${text}`
            });

            sent++;
          } catch {
            failed++;
          }
        }

        return sock.sendMessage(
          from,
          {
            text:
              `✅ *BROADCAST COMPLETE*\n\n` +
              `📨 Sent: ${sent}\n` +
              `❌ Failed: ${failed}`
          },
          { quoted: m }
        );
      }

      // 8. BLOCK
      case "block": {
        const target = text.replace(/\D/g, "");

        if (!target) {
          return sock.sendMessage(
            from,
            { text: "❌ Usage: .block 234XXXXXXXXXX" },
            { quoted: m }
          );
        }

        await sock.updateBlockStatus(
          `${target}@s.whatsapp.net`,
          "block"
        );

        return sock.sendMessage(
          from,
          { text: `🚫 Blocked: ${target}` },
          { quoted: m }
        );
      }

      // 9. UNBLOCK
      case "unblock": {
        const target = text.replace(/\D/g, "");

        if (!target) {
          return sock.sendMessage(
            from,
            { text: "❌ Usage: .unblock 234XXXXXXXXXX" },
            { quoted: m }
          );
        }

        await sock.updateBlockStatus(
          `${target}@s.whatsapp.net`,
          "unblock"
        );

        return sock.sendMessage(
          from,
          { text: `✅ Unblocked: ${target}` },
          { quoted: m }
        );
      }

      // 10. JOIN GROUP
      case "join": {
        const invite = text.match(
          /chat\.whatsapp\.com\/([0-9A-Za-z]+)/i
        );

        if (!invite) {
          return sock.sendMessage(
            from,
            {
              text: "❌ Usage: .join https://chat.whatsapp.com/INVITECODE"
            },
            { quoted: m }
          );
        }

        const result = await sock.groupAcceptInvite(invite[1]);

        return sock.sendMessage(
          from,
          { text: `✅ Joined group: ${result}` },
          { quoted: m }
        );
      }

      // 11. LEAVE GROUP
      case "leave":
        if (!from.endsWith("@g.us")) {
          return sock.sendMessage(
            from,
            { text: "❌ Use this command inside the group to leave." },
            { quoted: m }
          );
        }

        await sock.groupLeave(from);

        break;

      // 12. SET PREFIX
      case "setprefix":
        if (!text) {
          return sock.sendMessage(
            from,
            { text: "❌ Usage: .setprefix !" },
            { quoted: m }
          );
        }

        global.prefix = text;

        return sock.sendMessage(
          from,
          {
            text: `✅ Prefix changed to: ${text}\n⚠️ Persistence requires saving your bot configuration.`
          },
          { quoted: m }
        );

      // 13. SET NAME
      case "setname":
        if (!text) {
          return sock.sendMessage(
            from,
            { text: "❌ Usage: .setname WOLF XMD" },
            { quoted: m }
          );
        }

        await sock.updateProfileName(text);

        return sock.sendMessage(
          from,
          { text: `✅ Bot name updated to: ${text}` },
          { quoted: m }
        );

      // 14. SET BIO
      case "setbio":
        if (!text) {
          return sock.sendMessage(
            from,
            { text: "❌ Usage: .setbio Your new status" },
            { quoted: m }
          );
        }

        await sock.updateProfileStatus(text);

        return sock.sendMessage(
          from,
          { text: "✅ Bot status updated!" },
          { quoted: m }
        );

      // 15. CLEAR
      case "clear":
        return sock.sendMessage(
          from,
          {
            text:
              "⚠️ This command does not delete messages or session data.\n" +
              "Configure a specific cleanup operation before using it."
          },
          { quoted: m }
        );

      // 16. SESSION STATUS
      case "getsession":
        return sock.sendMessage(
          from,
          {
            text:
              `🔐 *SESSION STATUS*\n\n` +
              `📡 Connection: ${sock.user ? "Connected" : "Disconnected"}\n` +
              `👤 Account: ${sock.user?.id || "Unknown"}`
          },
          { quoted: m }
        );

      // 17. LIST GROUPS
      case "listgroup": {
        const chats = await sock.groupFetchAllParticipating();
        const groups = Object.values(chats);

        const list = groups
          .map((group, index) =>
            `${index + 1}. ${group.subject || "Unnamed group"}\n👥 Members: ${group.participants?.length || 0}`
          )
          .join("\n\n");

        return sock.sendMessage(
          from,
          {
            text: `📋 *BOT GROUPS*\n\n${list || "No groups found."}`
          },
          { quoted: m }
        );
      }

      // 18. LIST PLUGINS
      case "listplugin":
        return sock.sendMessage(
          from,
          {
            text:
              "📂 *PLUGIN FILES*\n\n" +
              "Owner.js\n" +
              "Sticker.js\n" +
              "Group.js\n" +
              "Moderator.js\n" +
              "Auto.js\n" +
              "Anti.js\n" +
              "botsettings.js\n\n" +
              "⚠️ This is the configured plugin list, not a live directory scan."
          },
          { quoted: m }
        );

      // 19. UPDATE
      case "update":
        return sock.sendMessage(
          from,
          {
            text:
              "⚠️ Automatic updates are not configured.\n" +
              "Connect this command to your authorized update system."
          },
          { quoted: m }
        );

      default:
        return;
    }
  }
};
