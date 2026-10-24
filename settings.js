require("dotenv").config()

module.exports = {
  botName: process.env.BOT_NAME || "Grok",
  prefix: process.env.PREFIX || "!",
  owner: [process.env.OWNER_NUMBER || "2349166265317"],
  ownerName: process.env.OWNER_NAME || "Grok Owner",
  sessionName: process.env.SESSION_NAME || "grok-session",
  packname: process.env.PACKNAME || "Grok Bot",
  author: process.env.AUTHOR || "Grok",
  timezone: process.env.TIMEZONE || "Africa/Lagos",

  // Server
  port: process.env.PORT || 3000,

  // Features
  autoRead: process.env.AUTO_READ === "true",
  autoTyping: process.env.AUTO_TYPING === "true",
  antiCall: process.env.ANTI_CALL !== "false",

  // Messages
  messages: {
    success: "✅ Done!",
    error: "❌ An error occurred.",
    wait: "⏳ Please wait...",
    ownerOnly: "⛔ Owner only command.",
    groupOnly: "⛔ This command is for groups only.",
    privateOnly: "⛔ This command is for private chat only.",
    adminOnly: "⛔ Admin only.",
    botAdmin: "⛔ I need to be admin to do that."
  }
}
