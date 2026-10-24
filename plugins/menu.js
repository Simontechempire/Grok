module.exports = {
  command: ["menu", "help", "bot", "list"],
  handler: async (sock, m, { settings, prefix }) => {
    const menu = `
╔════════════════════════════════╗
║         *${settings.botName.toUpperCase()}*         
║           Command Menu         
╚════════════════════════════════╝

👤 *Owner* : ${settings.ownerName}
⚙️ *Prefix* : ${prefix}
📅 *Date*  : ${new Date().toLocaleDateString("en-GB")}

┌─「 📌 MAIN 」
│ ${prefix}menu
│ ${prefix}ping
│ ${prefix}runtime
│ ${prefix}owner
│ ${prefix}botinfo
└────────────────

┌─「 👑 OWNER (20) 」
│ ${prefix}broadcast  ${prefix}join
│ ${prefix}leave      ${prefix}block
│ ${prefix}unblock    ${prefix}ban
│ ${prefix}unban      ${prefix}listban
│ ${prefix}setpp      ${prefix}setname
│ ${prefix}setbio     ${prefix}restart
│ ${prefix}shutdown   ${prefix}self
│ ${prefix}public     ${prefix}mode
│ ${prefix}addowner   ${prefix}delowner
│ ${prefix}getsession
└────────────────

┌─「 🖼️ STICKER (20) 」
│ ${prefix}sticker    ${prefix}s
│ ${prefix}toimg      ${prefix}tovid
│ ${prefix}take       ${prefix}steal
│ ${prefix}smeme      ${prefix}attp
│ ${prefix}ttp        ${prefix}emojimix
│ ${prefix}circle     ${prefix}sgif
│ ${prefix}wm
└────────────────

┌─「 👥 GROUP (20) 」
│ ${prefix}tagall     ${prefix}hidetag
│ ${prefix}promote    ${prefix}demote
│ ${prefix}kick       ${prefix}add
│ ${prefix}group      ${prefix}setname
│ ${prefix}setdesc    ${prefix}link
│ ${prefix}revoke     ${prefix}listadmin
│ ${prefix}totag      ${prefix}ephemeral
│ ${prefix}leavegc
└────────────────

┌─「 🛡️ MODERATOR (10) 」
│ ${prefix}warn       ${prefix}unwarn
│ ${prefix}listwarn   ${prefix}resetwarn
│ ${prefix}mute       ${prefix}unmute
│ ${prefix}kickwarn   ${prefix}setwarn
└────────────────

┌─「 🤖 AUTO (20) 」
│ ${prefix}welcome    ${prefix}goodbye
│ ${prefix}autoread   ${prefix}autotyping
│ ${prefix}setwelcome ${prefix}setleft
│ ${prefix}afk        ${prefix}autobio
└────────────────

┌─「 🚫 ANTI (20) 」
│ ${prefix}antilink   ${prefix}antivirtex
│ ${prefix}antiviewonce ${prefix}antidelete
│ ${prefix}antibot    ${prefix}anticall
│ ${prefix}antispam   ${prefix}antitoxic
│ ${prefix}antiwame   ${prefix}antipromote
│ ${prefix}antidemote ${prefix}antilinkgc
│ ${prefix}antitag    ${prefix}antibadword
└────────────────

┌─「 ⚙️ BOT SETTINGS (10) 」
│ ${prefix}setprefix  ${prefix}setbotname
│ ${prefix}setpackname ${prefix}setauthor
│ ${prefix}botinfo    ${prefix}settings
│ ${prefix}statusbot  ${prefix}resetsettings
└────────────────

┌─「 🔐 CODE / UNCODE (100+) 」
│ ${prefix}base64     ${prefix}hex
│ ${prefix}binary     ${prefix}rot13
│ ${prefix}morse      ${prefix}hash
│ ${prefix}md5        ${prefix}sha256
│ ${prefix}encode     ${prefix}decode
│ ${prefix}reverse    ${prefix}uppercase
│ ${prefix}mock       ${prefix}password
│ ${prefix}pick       ${prefix}dice
│ ${prefix}ship       ${prefix}rate
│ ${prefix}calc       ${prefix}time
│ ${prefix}say        ${prefix}uuid
│ + many more...
└────────────────

┌─「 🤖 AI 」
│ ${prefix}ai <question>
│ ${prefix}gpt <question>
└────────────────

> Type *${prefix}menu* anytime
> Bot by *Grok*
`.trim()

    await sock.sendMessage(m.key.remoteJid, { text: menu }, { quoted: m })
  }
  }
