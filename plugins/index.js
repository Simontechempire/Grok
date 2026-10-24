const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const plugins = new Map()

// Load all plugins in this folder
const pluginFiles = fs.readdirSync(__dirname).filter(f => f.endsWith(".js") && f !== "index.js")

for (const file of pluginFiles) {
  try {
    const plugin = require(path.join(__dirname, file))
    if (plugin.command && plugin.handler) {
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
      cmds.forEach(cmd => plugins.set(cmd.toLowerCase(), plugin))
      console.log(chalk.green(`✓ Loaded plugin: ${file}`))
    }
  } catch (e) {
    console.error(chalk.red(`✗ Failed to load ${file}:`), e.message)
  }
}

module.exports = async function (sock, m, settings) {
  try {
    const body = m.message?.conversation
      || m.message?.extendedTextMessage?.text
      || m.message?.imageMessage?.caption
      || m.message?.videoMessage?.caption
      || ""

    if (!body.startsWith(settings.prefix)) return

    const args = body.slice(settings.prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()
    const text = args.join(" ")

    const plugin = plugins.get(command)
    if (!plugin) return

    // Owner check
    const sender = m.key.remoteJid.endsWith("@g.us")
      ? (m.key.participant || m.participant)
      : m.key.remoteJid
    const isOwner = settings.owner.some(o => sender.includes(o))

    if (plugin.owner && !isOwner) {
      return sock.sendMessage(m.key.remoteJid, { text: settings.messages.ownerOnly }, { quoted: m })
    }

    // Group only
    if (plugin.group && !m.key.remoteJid.endsWith("@g.us")) {
      return sock.sendMessage(m.key.remoteJid, { text: settings.messages.groupOnly }, { quoted: m })
    }

    // Run the command
    await plugin.handler(sock, m, {
      args,
      text,
      command,
      prefix: settings.prefix,
      isOwner,
      settings,
      sender
    })

  } catch (err) {
    console.error("Handler error:", err)
  }
                           }
