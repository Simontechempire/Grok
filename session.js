const express = require("express")
const path = require("path")
const chalk = require("chalk")
const settings = require("./settings")
const { startConnection, requestPairingCode, getSocket, getPairingCode } = require("./connection")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Serve pairing dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// API: request pairing code
app.post("/pair", async (req, res) => {
  try {
    let { number } = req.body
    if (!number) return res.status(400).json({ error: "Phone number is required" })

    // Clean number
    number = number.replace(/\D/g, "")
    if (number.startsWith("0")) number = "234" + number.slice(1) // Nigeria common fix

    const code = await requestPairingCode(number)

    res.json({
      success: true,
      code: code,
      message: "Enter this 8-digit code in WhatsApp → Linked Devices → Link with phone number"
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// Status endpoint
app.get("/status", (req, res) => {
  const sock = getSocket()
  res.json({
    connected: !!(sock && sock.user),
    pairingCode: getPairingCode(),
    botName: settings.botName
  })
})

// Start server + bot
const PORT = settings.port
app.listen(PORT, async () => {
  console.log(chalk.blue(`\n🚀 Grok Bot server running on port ${PORT}`))
  console.log(chalk.yellow(`Open http://localhost:${PORT} to pair\n`))

  // Start WhatsApp connection
  await startConnection()
})
