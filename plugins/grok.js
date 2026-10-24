module.exports = {
  command: [
    // ===== ENCODE / DECODE (Code Uncode) =====
    "encode", "decode", "base64", "base64enc", "base64dec",
    "hex", "hexenc", "hexdec", "binary", "binenc", "bindec",
    "urlencode", "urldecode", "htmlencode", "htmldecode",
    "rot13", "morse", "morseenc", "morsedec",
    "ascii", "reverse", "uppercase", "lowercase", "capitalize",
    "hash", "md5", "sha1", "sha256", "sha512",
    "binary2text", "text2binary", "hex2text", "text2hex",
    "base32", "base32enc", "base32dec", "unicode", "unidecode",

    // ===== TEXT TOOLS =====
    "mock", "fancy", "style", "emojify", "spoiler",
    "repeat", "count", "wordcount", "charcount", "length",
    "replace", "randomcase", "zalgo", "tiny", "vaporwave",
    "flip", "mirror", "creepify",

    // ===== RANDOM / FUN =====
    "random", "pick", "choose", "dice", "flipcoin", "coin",
    "password", "genpass", "uuid", "joke", "quote", "fact",
    "ship", "rate", "gay", "simp", "iq", "pp",

    // ===== INFO / UTILS =====
    "ping", "runtime", "uptime", "owner", "menu", "help",
    "bot", "info", "server", "speed", "stats", "script",
    "ownerinfo", "donasi", "sc", "github",

    // ===== CONVERTERS =====
    "toimg", "tovid", "tomp3", "tovn", "tour", "tts",
    "translate", "tr", "short", "shorturl", "expand",

    // ===== CALCULATOR / MATH =====
    "calc", "math", "add", "sub", "mul", "div", "percent",

    // ===== TIME / DATE =====
    "time", "date", "timezone", "wita", "wib", "wit",

    // ===== MISC =====
    "afk", "say", "echo", "readmore", "hidetag", "tagme",
    "link", "tour", "check", "whois", "ip", "cuaca", "weather"
  ],

  handler: async (sock, m, { args, text, command, prefix, settings, isOwner, sender }) => {
    const jid = m.key.remoteJid
    const reply = (txt) => sock.sendMessage(jid, { text: txt }, { quoted: m })

    // ====================== ENCODE / DECODE ======================
    const base64Encode = (str) => Buffer.from(str, "utf-8").toString("base64")
    const base64Decode = (str) => Buffer.from(str, "base64").toString("utf-8")
    const hexEncode = (str) => Buffer.from(str, "utf-8").toString("hex")
    const hexDecode = (str) => Buffer.from(str, "hex").toString("utf-8")
    const binaryEncode = (str) => str.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ")
    const binaryDecode = (str) => str.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("")
    const rot13 = (str) => str.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26))
    const reverse = (str) => str.split("").reverse().join("")

    const morseMap = {
      a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
      i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
      q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
      y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
      "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
      " ": "/"
    }
    const morseEncode = (str) => str.toLowerCase().split("").map(c => morseMap[c] || c).join(" ")
    const morseDecode = (str) => {
      const rev = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]))
      return str.split(" ").map(c => rev[c] || c).join("")
    }

    // ====================== HANDLER ======================
    switch (command) {

      // ---------- ENCODE / DECODE ----------
      case "encode":
      case "base64":
      case "base64enc":
        if (!text) return reply(`Usage: \( {prefix} \){command} <text>`)
        return reply(`*Base64 Encode*\n\n${base64Encode(text)}`)

      case "decode":
      case "base64dec":
        if (!text) return reply(`Usage: \( {prefix} \){command} <base64>`)
        try { return reply(`*Base64 Decode*\n\n${base64Decode(text)}`) }
        catch { return reply("❌ Invalid Base64") }

      case "hex":
      case "hexenc":
        if (!text) return reply(`Usage: ${prefix}hex <text>`)
        return reply(`*Hex Encode*\n\n${hexEncode(text)}`)

      case "hexdec":
        if (!text) return reply(`Usage: ${prefix}hexdec <hex>`)
        try { return reply(`*Hex Decode*\n\n${hexDecode(text)}`) }
        catch { return reply("❌ Invalid Hex") }

      case "binary":
      case "binenc":
      case "text2binary":
        if (!text) return reply(`Usage: ${prefix}binary <text>`)
        return reply(`*Binary Encode*\n\n${binaryEncode(text)}`)

      case "bindec":
      case "binary2text":
        if (!text) return reply(`Usage: ${prefix}bindec <binary>`)
        try { return reply(`*Binary Decode*\n\n${binaryDecode(text)}`) }
        catch { return reply("❌ Invalid Binary") }

      case "urlencode":
        if (!text) return reply(`Usage: ${prefix}urlencode <text>`)
        return reply(encodeURIComponent(text))

      case "urldecode":
        if (!text) return reply(`Usage: ${prefix}urldecode <text>`)
        return reply(decodeURIComponent(text))

      case "htmlencode":
        if (!text) return reply(`Usage: ${prefix}htmlencode <text>`)
        return reply(text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"))

      case "htmldecode":
        if (!text) return reply(`Usage: ${prefix}htmldecode <text>`)
        return reply(text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'))

      case "rot13":
        if (!text) return reply(`Usage: ${prefix}rot13 <text>`)
        return reply(rot13(text))

      case "morse":
      case "morseenc":
        if (!text) return reply(`Usage: ${prefix}morse <text>`)
        return reply(morseEncode(text))

      case "morsedec":
        if (!text) return reply(`Usage: ${prefix}morsedec <morse>`)
        return reply(morseDecode(text))

      case "ascii":
        if (!text) return reply(`Usage: ${prefix}ascii <text>`)
        return reply(text.split("").map(c => c.charCodeAt(0)).join(" "))

      case "reverse":
        if (!text) return reply(`Usage: ${prefix}reverse <text>`)
        return reply(reverse(text))

      case "uppercase":
        if (!text) return reply(`Usage: ${prefix}uppercase <text>`)
        return reply(text.toUpperCase())

      case "lowercase":
        if (!text) return reply(`Usage: ${prefix}lowercase <text>`)
        return reply(text.toLowerCase())

      case "capitalize":
        if (!text) return reply(`Usage: ${prefix}capitalize <text>`)
        return reply(text.replace(/\b\w/g, c => c.toUpperCase()))

      case "hash":
      case "md5":
      case "sha1":
      case "sha256":
      case "sha512":
        if (!text) return reply(`Usage: \( {prefix} \){command} <text>`)
        const crypto = require("crypto")
        const algo = command === "hash" ? "sha256" : command
        const hash = crypto.createHash(algo).update(text).digest("hex")
        return reply(`*\( {algo.toUpperCase()}*\n\n \){hash}`)

      case "text2hex":
        if (!text) return reply(`Usage: ${prefix}text2hex <text>`)
        return reply(hexEncode(text))

      case "hex2text":
        if (!text) return reply(`Usage: ${prefix}hex2text <hex>`)
        try { return reply(hexDecode(text)) } catch { return reply("❌ Invalid") }

      case "unicode":
        if (!text) return reply(`Usage: ${prefix}unicode <text>`)
        return reply(text.split("").map(c => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")).join(""))

      case "unidecode":
        if (!text) return reply(`Usage: ${prefix}unidecode <\\uXXXX>`)
        try {
          return reply(JSON.parse('"' + text.replace(/\\u/g, "\\u") + '"'))
        } catch { return reply("❌ Invalid unicode") }

      // ---------- TEXT FUN ----------
      case "mock":
        if (!text) return reply(`Usage: ${prefix}mock <text>`)
        return reply(text.split("").map((c, i) => i % 2 ? c.toLowerCase() : c.toUpperCase()).join(""))

      case "repeat":
        if (!text) return reply(`Usage: ${prefix}repeat <text> | <number>`)
        const [repText, times] = text.split("|").map(s => s.trim())
        const n = parseInt(times) || 3
        return reply((repText + " ").repeat(Math.min(n, 50)).trim())

      case "count":
      case "wordcount":
      case "charcount":
      case "length":
        if (!text) return reply(`Usage: \( {prefix} \){command} <text>`)
        return reply(`Characters: ${text.length}\nWords: ${text.trim().split(/\s+/).length}`)

      case "replace":
        if (!text || !text.includes("|")) return reply(`Usage: ${prefix}replace old|new|text`)
        const [oldW, newW, ...rest] = text.split("|")
        return reply(rest.join("|").split(oldW.trim()).join(newW.trim()))

      case "randomcase":
        if (!text) return reply(`Usage: ${prefix}randomcase <text>`)
        return reply(text.split("").map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join(""))

      case "flip":
      case "mirror":
        if (!text) return reply(`Usage: ${prefix}flip <text>`)
        const flipMap = { a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z" }
        return reply(text.toLowerCase().split("").map(c => flipMap[c] || c).reverse().join(""))

      // ---------- RANDOM / FUN ----------
      case "random":
      case "pick":
      case "choose":
        if (!text) return reply(`Usage: ${prefix}pick option1 | option2 | option3`)
        const options = text.split("|").map(s => s.trim()).filter(Boolean)
        if (options.length < 2) return reply("Give at least 2 options separated by |")
        return reply(`🎯 I choose: *${options[Math.floor(Math.random() * options.length)]}*`)

      case "dice":
        return reply(`🎲 You rolled: *${Math.floor(Math.random() * 6) + 1}*`)

      case "flipcoin":
      case "coin":
        return reply(Math.random() > 0.5 ? "🪙 Heads" : "🪙 Tails")

      case "password":
      case "genpass":
        const len = parseInt(args[0]) || 12
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        let pass = ""
        for (let i = 0; i < Math.min(len, 32); i++) pass += chars[Math.floor(Math.random() * chars.length)]
        return reply(`🔑 Password (\( {pass.length}):\n\` \){pass}\``)

      case "uuid":
        return reply(require("crypto").randomUUID())

      case "rate":
        if (!text) return reply(`Usage: ${prefix}rate <something>`)
        return reply(`*\( {text}*\nis rated * \){Math.floor(Math.random() * 100) + 1}/100*`)

      case "gay":
      case "simp":
      case "iq":
      case "pp":
        const targetName = text || "You"
        const score = Math.floor(Math.random() * 101)
        const labels = { gay: "Gay", simp: "Simp", iq: "IQ", pp: "PP Size" }
        return reply(`*${labels[command] || command}* of \( {targetName}: * \){score}%*`)

      case "ship":
        if (!text || !text.includes("|")) return reply(`Usage: ${prefix}ship name1 | name2`)
        const [n1, n2] = text.split("|").map(s => s.trim())
        const love = Math.floor(Math.random() * 101)
        return reply(`❤️ *\( {n1}*  +  * \){n2}*\nCompatibility: *${love}%*`)

      case "joke":
        const jokes = [
          "Why don’t scientists trust atoms? Because they make up everything!",
          "I’m reading a book about anti-gravity. It’s impossible to put down.",
          "Why did the scarecrow win an award? Because he was outstanding in his field!"
        ]
        return reply(jokes[Math.floor(Math.random() * jokes.length)])

      case "quote":
        return reply("“The only way to do great work is to love what you do.” – Steve Jobs")

      case "fact":
        return reply("Honey never spoils. Archaeologists have found 3000-year-old honey that’s still edible.")

      // ---------- INFO ----------
      case "ping":
        const start = Date.now()
        const sent = await sock.sendMessage(jid, { text: "Pong!" }, { quoted: m })
        return sock.sendMessage(jid, { text: `🏓 Latency: ${Date.now() - start} ms`, edit: sent.key })

      case "runtime":
      case "uptime":
        const up = process.uptime()
        const h = Math.floor(up / 3600)
        const min = Math.floor((up % 3600) / 60)
        const s = Math.floor(up % 60)
        return reply(`⏱️ Runtime: ${h}h ${min}m ${s}s`)

      case "owner":
      case "ownerinfo":
        return reply(`👑 *Owner*\nwa.me/${settings.owner[0]}`)

      case "menu":
      case "help":
      case "bot":
        return reply(`
╔══════════════════╗
║   *${settings.botName}* 
╚══════════════════╝
Prefix: ${prefix}

*Code / Uncode*
${prefix}base64  ${prefix}hex  ${prefix}binary
${prefix}rot13   ${prefix}morse  ${prefix}hash

*Fun*
${prefix}pick  ${prefix}dice  ${prefix}ship
${prefix}rate  ${prefix}password

*Info*
${prefix}ping  ${prefix}runtime  ${prefix}owner

Total commands in this file: \~100
        `.trim())

      case "info":
      case "botinfo":
      case "stats":
        return reply(`Bot: ${settings.botName}\nPrefix: ${prefix}\nOwner: ${settings.owner[0]}`)

      case "script":
      case "sc":
      case "github":
        return reply("This bot is custom built with Baileys + Grok plugins.")

      // ---------- MATH ----------
      case "calc":
      case "math":
        if (!text) return reply(`Usage: ${prefix}calc 2+2*5`)
        try {
          // very basic safe eval
          const result = Function('"use strict"; return (' + text.replace(/[^0-9+\-*/().% ]/g, "") + ")")()
          return reply(`🧮 Result: *${result}*`)
        } catch {
          return reply("❌ Invalid expression")
        }

      // ---------- TIME ----------
      case "time":
      case "date":
        return reply(new Date().toLocaleString("en-GB", { timeZone: settings.timezone || "Africa/Lagos" }))

      // ---------- MISC ----------
      case "say":
      case "echo":
        if (!text) return reply(`Usage: ${prefix}say <text>`)
        return reply(text)

      case "afk":
        global.afk = global.afk || {}
        global.afk[sender] = text || "AFK"
        return reply(`You are now AFK${text ? ": " + text : ""}`)

      case "readmore":
        if (!text) return reply(`Usage: ${prefix}readmore text1 | text2`)
        const [a, b] = text.split("|")
        return reply((a || "") + "\u200B".repeat(4000) + (b || ""))

      case "tagme":
        return sock.sendMessage(jid, { text: `@${sender.split("@")[0]}`, mentions: [sender] }, { quoted: m })

      default:
        // fallback for any remaining listed commands
        return reply(`Command *${command}* is registered but needs extra implementation or media support.`)
    }
  }
    }
