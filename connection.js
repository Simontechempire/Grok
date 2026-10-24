const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} = require("@whiskeysockets/baileys")
const { Boom } = require("@hapi/boom")
const pino = require("pino")
const NodeCache = require("node-cache")
const fs = require("fs-extra")
const path = require("path")
const chalk = require("chalk")
const settings = require("./settings")

const msgRetryCounterCache = new NodeCache()
const logger = pino({ level: "silent" })

let sock = null
let pairingCode = null
let isConnecting = false

async function startConnection() {
  if (isConnecting) return sock
  isConnecting = true

  const sessionPath = path.join(__dirname, "session", settings.sessionName)
  await fs.ensureDir(sessionPath)

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()

  sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    browser: Browsers.ubuntu("Chrome"),
    msgRetryCounterCache,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    markOnlineOnConnect: true
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (connection === "open") {
      console.log(chalk.green("✅ Grok Bot connected successfully!"))
      pairingCode = null
      isConnecting = false

      // Notify owner
      try {
        const ownerJid = settings.owner[0] + "@s.whatsapp.net"
        await sock.sendMessage(ownerJid, {
          text: `✨ *${settings.botName}* is now online!\n\nPrefix: ${settings.prefix}`
        })
      } catch (e) {}
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode
        : 0

      const shouldReconnect = statusCode !== DisconnectReason.loggedOut
      console.log(chalk.red(`Connection closed. Reconnecting: ${shouldReconnect}`))

      isConnecting = false
      if (shouldReconnect) {
        setTimeout(() => startConnection(), 3000)
      } else {
        console.log(chalk.red("Logged out. Delete session folder and pair again."))
      }
    }
  })

  // Load plugins after connection is ready
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return
    const m = messages[0]
    if (!m.message || m.key.fromMe) return

    try {
      require("./plugins")(sock, m, settings)
    } catch (err) {
      console.error("Plugin error:", err)
    }
  })

  return sock
}

async function requestPairingCode(phoneNumber) {
  // Sanitize number: only digits
  const number = phoneNumber.replace(/\D/g, "")
  if (!number || number.length < 10) {
    throw new Error("Invalid phone number. Include country code (e.g. 2349166265317)")
  }

  if (!sock) {
    await startConnection()
  }

  // Wait a bit for socket to be ready
  await new Promise(r => setTimeout(r, 2000))

  if (sock.authState.creds.registered) {
    throw new Error("Already registered / session exists. Delete session folder to re-pair.")
  }

  const code = await sock.requestPairingCode(number)
  pairingCode = code
  console.log(chalk.cyan(`Pairing code for ${number}: ${code}`))
  return code
}

function getSocket() {
  return sock
}

function getPairingCode() {
  return pairingCode
}

module.exports = {
  startConnection,
  requestPairingCode,
  getSocket,
  getPairingCode
}
