module.exports = {
  botName: "Grok",
  prefix: "!",
  owner: ["2349166265317"],          // owner number without + or spaces
  ownerName: "Grok Owner",
  sessionName: "grok-session",
  packname: "Grok Bot",
  author: "Grok",
  timezone: "Africa/Lagos",

  // Railway / server
  port: process.env.PORT || 3000,

  // Features
  autoRead: true,
  autoTyping: false,
  antiCall: true,

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
