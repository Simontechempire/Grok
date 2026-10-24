const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const plugins = new Map()

const pluginFiles = fs.readdirSync(__dirname).filter(f => f.endsWith(".js") && f !== "index.js")

for (const file of pluginFiles) {
  try {
    const exported = require(path.join(__dirname, file))
    const list = Array.isArray(exported) ? exported : [exported]

    for (const plugin of list) {
      if (!plugin.command || !plugin.handler) continue
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
      cmds.forEach(cmd => plugins.set(cmd.toLowerCase(), plugin))
    }
    console.log(chalk.green(`✓ Loaded: ${file}`))
  } catch (e) {
    console.error(chalk.red(`✗ Failed ${file}:`), e.message)
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

    const sender = (m.key.participant || m.key.remoteJid || "").replace(/:.*@/, "@")
    const isOwner = settings.owner.some(o => sender.includes(o))
    const isGroup = m.key.remoteJid.endsWith("@g.us")

    if (plugin.owner && !isOwner) {
      return sock.sendMessage(m.key.remoteJid, { text: settings.messages.ownerOnly }, { quoted: m })
    }
    if (plugin.group && !isGroup) {
      return sock.sendMessage(m.key.remoteJid, { text: settings.messages.groupOnly }, { quoted: m })
    }

    await plugin.handler(sock, m, {
      args, text, command, prefix: settings.prefix,
      isOwner, isGroup, settings, sender
    })
  } catch (err) {
    console.error("Handler error:", err)
  }
}
