require('dotenv').config();
const fs = require('fs');
const path = require('path'); // ← mettre path avant son utilisation

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const gamesFile = path.join(dataDir, 'games.json');
if (!fs.existsSync(gamesFile)) fs.writeFileSync(gamesFile, JSON.stringify({ games: [] }, null, 2));


const maps = require('./config/maps');





const http = require('http');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running');
}).listen(PORT, () => {
  console.log(`Health server running on port ${PORT}`);
});




if (!fs.existsSync('./riotData.json')) {
  fs.writeFileSync('./riotData.json', '{}');
}

const { 
  Client,
  GatewayIntentBits,
  ChannelType, // <- Ajoute ceci
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,       // <- Ajoute ça
  TextInputBuilder,   // <- Ajoute ça
  TextInputStyle,
  EmbedBuilder,
  REST,
  Routes,
  PermissionFlagsBits,
  PermissionsBitField,
  StringSelectMenuBuilder, // ← AJOUTÉ
} = require('discord.js');

const rankEmojis = {
  Unranked: '<:Unranked:1465744234182086789>',
  'Radiant': '<:Radiant:1461399011712958703>',
  'Immortal 3': '<:Immortal_3:1461399034165068063>',
  'Immortal 2': '<:Immortal_2:1461399056449274171>',
  'Immortal 1': '<:Immortal_1:1461399078616170516>',
  'Ascendant 3': '<:Ascendant_3:1461399102116856001>',
  'Ascendant 2': '<:Ascendant_2:1461399120240574586>',
  'Ascendant 1': '<:Ascendant_1:1461399137076379648>',
  'Diamond 3': '<:Diamond_3:1461399154805964963>',
  'Diamond 2': '<:Diamond_2:1461399171838902292>',
  'Diamond 1': '<:Diamond_1:1461399187362152480>',
  'Platinum 3': '<:Platinum_3:1461399203065368619>',
  'Platinum 2': '<:Platinum_2:1461399220035784928>',
  'Platinum 1': '<:Platinum_1:1461399234778501345>',
  'Gold 3': '<:Gold_3:1461399252814135338>',
  'Gold 2': '<:Gold_2:1461399269151084604>',
  'Gold 1': '<:Gold_1:1461399285429043251>',
  'Silver 3': '<:Silver_3:1461399305993846785>',
  'Silver 2': '<:Silver_2:1461399321642532874>',
  'Silver 1': '<:Silver_1:1461399338965270538>',
  'Bronze 3': '<:Bronze_3:1461399355465666722>',
  'Bronze 2': '<:Bronze_2:1461399372779749457>',
  'Bronze 1': '<:Bronze_1:1461399395605024972>',
  'Iron 3': '<:Iron_3:1461399413619429472>',
  'Iron 2': '<:Iron_2:1461399435924865127>',
  'Iron 1': '<:Iron_1:1461399458246955195>',
};

const RANK_ORDER = {
  'Radiant': 1, 
  'Immortal 3': 2, 'Immortal 2': 3, 'Immortal 1': 4,
  'Ascendant 3': 5, 'Ascendant 2': 6, 'Ascendant 1': 7,
  'Diamond 3': 8, 'Diamond 2': 9, 'Diamond 1': 10,
  'Platinum 3': 11, 'Platinum 2': 12, 'Platinum 1': 13,
  'Gold 3': 14, 'Gold 2': 15, 'Gold 1': 16,
  'Silver 3': 17, 'Silver 2': 18, 'Silver 1': 19,
  'Bronze 3': 20, 'Bronze 2': 21, 'Bronze 1': 22,
  'Iron 3': 23, 'Iron 2': 24, 'Iron 1': 25
};

const MIN_ACCOUNT_AGE_DAYS = 30;


const registrationUpdateTimeouts = new Map();

function scheduleRegistrationUpdate(guild, game) {
  if (!game?.id) return;

  const existing = registrationUpdateTimeouts.get(game.id);
  if (existing) clearTimeout(existing);

  const timeout = setTimeout(async () => {
    try {
      await updateRegistrationEmbed(guild, game);
    } catch (err) {
      console.error('Erreur debounce update registration:', err);
    } finally {
      registrationUpdateTimeouts.delete(game.id);
    }
  }, 800);

  registrationUpdateTimeouts.set(game.id, timeout);
}














// ===== BUILD PLAYER LIST =====
async function buildPlayerList(guild, playerIds) {
  if (!playerIds.length) return '*en attente de participants...*';

  const list = [];

  for (const id of playerIds) {
    let member = guild.members.cache.get(id);
    if (!member) {
      member = await guild.members.fetch(id).catch(() => null);
    }

    let rankEmoji = rankEmojis.Unranked;
    let rankValue = 1000;

    if (member) {
      const rankRole = member.roles.cache.find(r => RANK_ORDER[r.name]);
      if (rankRole) {
        rankEmoji = rankEmojis[rankRole.name] || rankEmojis.Unranked;
        rankValue = RANK_ORDER[rankRole.name];
      }
    }

    list.push({ id, mention: `<@${id}>`, emoji: rankEmoji, rankValue });
  }

  list.sort((a, b) => a.rankValue - b.rankValue);
  return list.map(p => `- ${p.emoji} ${p.mention}`).join('\n');
}

// ===== UPDATE REGISTRATION EMBED =====
async function updateRegistrationEmbed(guild, game) {
  try {
    const registrationChannel = guild.channels.cache.get(game.channelId);
    if (!registrationChannel?.isTextBased()) return;

    let registrationMsg;
    try { registrationMsg = await registrationChannel.messages.fetch(game.messageId || game.id); } 
    catch { registrationMsg = null; }

    if (!registrationMsg) return;

    const playersText = await buildPlayerList(guild, game.players);
    const spectatorCount = game.spectators ? Object.keys(game.spectators).length : 0;
const remaining = Math.max(0, 10 - (game.players.length + spectatorCount));

    const votes = game.changeMapVotes?.length || 0;
    const needed = 6;

    const creatorMember = guild.members.cache.get(game.creatorId);
    const creatorDisplayName = creatorMember?.displayName || game.creatorName || 'Inconnu';

const embed = new EmbedBuilder()
  .setTitle(`PARTIE CRÉÉE`)
  .setDescription(
    `## <#${game.waitingVC}>\n` +
    `*${remaining} slots restants*\n` +
    `*${votes}/${needed} next map votes*`
  )
  .addFields({ name: 'ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛꜱ', value: playersText })
  .setFooter({
    iconURL: game.creatorAvatar || guild.iconURL({ dynamic: true, size: 32 }),
    text: `Organisée par ${creatorDisplayName}`
  })
  .setColor(0x242429)
      

    if (game.mapImage) embed.setImage(game.mapImage);

    await registrationMsg.edit({ embeds: [embed] });

  } catch (err) {
    if (err.code !== 10008) console.error('Erreur update embed PARTIE CRÉÉE:', err);
  }
}




const ROLE_VERIFIE = '1461354176931041312';
const AUTO_CREATE_VC_ID = '1479547523201896490'; // ← mets ici l'id du vocal "créer"
const TEMP_VOCAL_CATEGORY_ID = '1479549016466395217';
const WELCOME_CHANNEL_ID = '1474066060528451743';
// ✅ Salons vocaux à ne jamais supprimer automatiquement
const EXEMPT_VC_IDS = [
  '1479551340635095270',
  '1479547523201896490', // ✅ salon "créer" à ne jamais supprimer
];


const invitesFile = path.join(__dirname, 'data', 'invites.json');
if (!fs.existsSync(invitesFile)) fs.writeFileSync(invitesFile, JSON.stringify({}, null, 2));
const invitesCache = new Map();
const autoCreateLocks = new Map();
const gameLocks = {};
const BADGES = {
  TOP1: '<:TopLeaderboard:1465709888729776296>',
  TOP_INVITER: '<:TopInviter:1465747415670984862>'
  
};

const ACCUEIL_CHANNEL_ID = '1171488314524713000';

const ROLE_NOTIF_PP = '1468458885357502599';
const BOT_OWNER_ID = '1471602146964406365';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// ===== Storage =====
const pointsFile = path.join(__dirname, 'data', 'points.json');
const top15File = path.join(__dirname, 'data', 'top15.json');

if (!fs.existsSync(pointsFile)) fs.writeFileSync(pointsFile, JSON.stringify({}, null, 2));
if (!fs.existsSync(top15File)) fs.writeFileSync(top15File, JSON.stringify({}, null, 2));

const loadGames = () => JSON.parse(fs.readFileSync(gamesFile, 'utf8'));
const loadPoints = () => JSON.parse(fs.readFileSync(pointsFile, 'utf8'));
const loadTop15 = () => JSON.parse(fs.readFileSync(top15File, 'utf8'));
const loadInvites = () => JSON.parse(fs.readFileSync(invitesFile, 'utf8'));



// ✅ Variables globales en mémoire
let gamesData = loadGames();
let pointsData = loadPoints();
let invitesData = loadInvites();
let top15Data = loadTop15();


const moderationFile = path.join(__dirname, 'data', 'moderation.json');

if (!fs.existsSync(moderationFile)) {
  fs.writeFileSync(
    moderationFile,
    JSON.stringify(
      {
        bannedUsers: {},
        flaggedUsers: {}
      },
      null,
      2
    )
  );
}

const loadModeration = () => JSON.parse(fs.readFileSync(moderationFile, 'utf8'));

let moderationData = loadModeration();

function persistModeration() {
  fs.writeFileSync(moderationFile, JSON.stringify(moderationData, null, 2));
}


// ✅ Fonctions de sauvegarde
function persistGames() {
  fs.writeFileSync(gamesFile, JSON.stringify(gamesData, null, 2));
}

function persistPoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(pointsData, null, 2));
}

function persistInvites() {
  fs.writeFileSync(invitesFile, JSON.stringify(invitesData, null, 2));
}

function persistTop15() {
  fs.writeFileSync(top15File, JSON.stringify(top15Data, null, 2));
}

// ===== Slash Commands =====
const commands = [
  { 
  name: 'ban',
  description: 'Bannir un joueur avec raison',
  default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
  options: [
    { name: 'joueur', description: 'Le joueur à bannir', type: 6, required: true }
  ]
},
{ 
  name: 'timeout',
  description: 'Timeout un joueur pendant une durée',
  default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
  options: [
    { name: 'joueur', description: 'Le joueur à timeout', type: 6, required: true },
    { name: 'duree', description: 'Durée en minutes', type: 4, required: true }
  ]
},
  { name: 'pp', description: 'Créer une partie personnalisée' },
  { name: 'top15', description: 'Créer l\'embed TOP 15', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'regles', description: 'Afficher l\'embed des règles', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'invites', description: 'Afficher le top des invitations', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'manage', description: 'Gérer les RR d\'un joueur', default_member_permissions: PermissionFlagsBits.Administrator.toString(), options: [{name: 'joueur', description: 'Le joueur à gérer', type: 6, required: true}]}
];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('✅ Slash commands enregistrées'))
  .catch(console.error);

// ===== Ready event + CADRE CONSOLE =====
const { Events } = require('discord.js');

client.once(Events.ClientReady, async () => {
  
  // 🎨 Message de démarrage stylé avec couleurs ANSI
  const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m'
  };

  console.log('\n');
  console.log(`${colors.cyan}${colors.bright}╔═══════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}                                                                           ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}   ${colors.red}${colors.bright}██╗   ██╗ █████╗ ██╗      ██████╗ ██████╗  █████╗ ███╗   ██╗████████╗${colors.reset}   ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}   ${colors.red}${colors.bright}██║   ██║██╔══██╗██║     ██╔═══██╗██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝${colors.reset}   ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}   ${colors.red}${colors.bright}██║   ██║███████║██║     ██║   ██║██████╔╝███████║██╔██╗ ██║   ██║${colors.reset}      ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}   ${colors.red}${colors.bright}╚██╗ ██╔╝██╔══██║██║     ██║   ██║██╔══██╗██╔══██║██║╚██╗██║   ██║${colors.reset}      ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}   ${colors.red}${colors.bright} ╚████╔╝ ██║  ██║███████╗╚██████╔╝██║  ██║██║  ██║██║ ╚████║   ██║${colors.reset}      ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}   ${colors.red}${colors.bright}  ╚═══╝  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝${colors.reset}      ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}                                                                           ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}               ${colors.magenta}${colors.bright}██████╗ ██████╗     ██████╗  ██████╗ ████████╗${colors.reset}              ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}               ${colors.magenta}${colors.bright}██╔══██╗██╔══██╗    ██╔══██╗██╔═══██╗╚══██╔══╝${colors.reset}              ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}               ${colors.magenta}${colors.bright}██████╔╝██████╔╝    ██████╔╝██║   ██║   ██║${colors.reset}                 ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}               ${colors.magenta}${colors.bright}██╔═══╝ ██╔═══╝     ██╔══██╗██║   ██║   ██║${colors.reset}                 ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}               ${colors.magenta}${colors.bright}██║     ██║         ██████╔╝╚██████╔╝   ██║${colors.reset}                 ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}               ${colors.magenta}${colors.bright}╚═╝     ╚═╝         ╚═════╝  ╚═════╝    ╚═╝${colors.reset}                 ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}                                                                           ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}                              ${colors.yellow}${colors.bright}VERSION 2.4.0${colors.reset}                                ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}                             ${colors.green}Dev by ${colors.bright}Jegouzão${colors.reset}                               ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}                                                                           ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}╚═══════════════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('\n');

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return;

  await guild.members.fetch();
console.log('✅ Tous les membres du serveur ont été chargés en cache');

  // Récupérer toutes les invites du serveur
  const guildInvites = await guild.invites.fetch();
  const allInvites = new Map();
  guildInvites.forEach(inv => {
    allInvites.set(inv.code, {
      code: inv.code,
      inviter: inv.inviter?.id || null,
      inviterTag: inv.inviter?.tag || "Inconnu",
      uses: inv.uses,
      maxAge: inv.maxAge,
      temporary: inv.temporary
    });
  });

  // Stocker en cache
  invitesCache.set(guild.id, allInvites);
  console.log(`${colors.green}✅ Invites initialisées en cache (y compris temporaires)${colors.reset}`);
  console.log(`${colors.green}✅ ${colors.bright}${client.user.tag}${colors.reset}${colors.green} est maintenant en ligne !${colors.reset}`);
  console.log(`${colors.blue}✅ Connecté sur le serveur: ${colors.bright}${guild.name}${colors.reset}`);
  console.log(`${colors.blue}✅ ${colors.bright}${guild.memberCount}${colors.reset}${colors.blue} membres${colors.reset}`);

  // 🎮 Définir le statut du bot
  client.user.setPresence({
    activities: [{
      name: '.gg/valorant-pp',
      type: 1,
      url: 'https://www.twitch.tv/jegouzao' // peut être factice
    }],
    status: 'online' // online, idle, dnd, invisible, EN STREAMING.
  });
  console.log(`${colors.magenta}✅ Statut du bot défini + statut violet${colors.reset}`);

  // 🎫 Création automatique de la catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ et du rôle Administrateur
  try {
    // Vérifier/Créer le rôle Administrateur
    let staffRole = guild.roles.cache.find(r => r.name === 'Administrateur');
    if (!staffRole) {
      staffRole = await guild.roles.create({
        name: 'Administrateur',
        color: 0xFF4655,
        permissions: [
          PermissionsBitField.Flags.ManageMessages,
          PermissionsBitField.Flags.ManageChannels,
          PermissionsBitField.Flags.KickMembers,
          PermissionsBitField.Flags.BanMembers,
          PermissionsBitField.Flags.ModerateMembers
        ],
        reason: 'Création automatique du rôle Administrateur pour le système de tickets'
      });
      console.log(`✅ Rôle Administrateur créé automatiquement`);
    } else {
      console.log(`✅ Rôle Administrateur déjà existant`);
    }

    // Vérifier/Créer la catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ
    let ticketCategory = guild.channels.cache.find(
      c => c.type === 4 && c.name === 'ᴍᴏᴅᴇʀᴀᴛɪᴏɴ'
    );
    
    if (!ticketCategory) {
      ticketCategory = await guild.channels.create({
        name: 'ᴍᴏᴅᴇʀᴀᴛɪᴏɴ',
        type: 4, // Catégorie
        permissionOverwrites: [
          {
            id: guild.id, // @everyone
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: staffRole.id, // Administrateur
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ManageChannels
            ]
          }
        ],
        reason: 'Création automatique de la catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ'
      });
      console.log(`${colors.red}✅ Catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ créée automatiquement ${colors.bright}(ID: ${ticketCategory.id})${colors.reset}`);
      
      // Sauvegarder l'ID dans un fichier pour référence future
      const configFile = path.join(__dirname, 'data', 'config.json');
      const config = fs.existsSync(configFile) 
        ? JSON.parse(fs.readFileSync(configFile, 'utf8'))
        : {};
      config.ticketCategoryId = ticketCategory.id;
      config.staffRoleId = staffRole.id;
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
      console.log(`${colors.yellow}✅ Configuration sauvegardée dans data/config.json${colors.reset}`);
    } else {
      console.log(`${colors.cyan}✅ Catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ déjà existante ${colors.bright}(ID: ${ticketCategory.id})${colors.reset}`);
      
      // Sauvegarder quand même l'ID
      const configFile = path.join(__dirname, 'data', 'config.json');
      const config = fs.existsSync(configFile) 
        ? JSON.parse(fs.readFileSync(configFile, 'utf8'))
        : {};
      config.ticketCategoryId = ticketCategory.id;
      config.staffRoleId = staffRole.id;
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    }
  } catch (error) {
    console.error(`${colors.red}❌ Erreur lors de la création automatique:${colors.reset}`, error);
  }


// 🟢 Premier update immédiat du leaderboard
await updateTop15Embed();
console.log(`${colors.yellow}🚀 Leaderboard initialisé au démarrage${colors.reset}`);

});















async function updateTop15Embed() {
  if (!top15Data.messageId || !top15Data.channelId) return;

  const channel = client.channels.cache.get(top15Data.channelId)
    || await client.channels.fetch(top15Data.channelId).catch(() => null);
  if (!channel) return;

  const msg = await channel.messages.fetch(top15Data.messageId).catch(() => null);
  if (!msg) return console.log('❌ Message leaderboard introuvable');

  const totalInvitesPerMember = {};
  for (const inviterId in invitesData) {
    totalInvitesPerMember[inviterId] = invitesData[inviterId].invites || 0;
  }

  const sorted = Object.entries(pointsData)
    .sort((a, b) => b[1].rr - a[1].rr)
    .slice(0, 10);

  if (!sorted.length) {
    const emptyEmbed = new EmbedBuilder()
      .setTitle("ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ ᴍᴀʀꜱ")
      .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472293135437529159/3.png?ex=69920b55&is=6990b9d5&hm=8202e2bd395ddb64d47464154b3a02d174f83c942a633b448a54672d04288666&')
      .setDescription("*Calcul en cours...*")
      .setColor(0x242429);

    await msg.edit({ embeds: [emptyEmbed] }).catch(() => {});
    return;
  }

  const maxRR = sorted[0][1].rr || 1;
  const barLength = 25;

  let topInviterId = null;
  let maxInvites = -1;
  for (const [id, invites] of Object.entries(totalInvitesPerMember)) {
    if (invites > maxInvites) {
      maxInvites = invites;
      topInviterId = id;
    }
  }

  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  const lines = await Promise.all(sorted.map(async ([id, data], idx) => {
    const rawBars = (data.rr / maxRR) * barLength;
    const filledBars = Math.max(0, Math.min(barLength, Math.round(rawBars)));
    const bar = "▰".repeat(filledBars) + "▱".repeat(barLength - filledBars);
    const invites = totalInvitesPerMember[id] || 0;

    let rankEmoji = '';

    let member = guild?.members?.cache?.get(id) || null;
    if (!member && guild) {
      member = await guild.members.fetch(id).catch(() => null);
    }

    if (member) {
      const rankName = member.roles.cache.find(r => rankEmojis[r.name])?.name;
      if (rankName) rankEmoji = rankEmojis[rankName] + ' ';
    }

    let badges = '';
    if (idx === 0) badges += BADGES.TOP1;
    if (id === topInviterId) badges += BADGES.TOP_INVITER;

    return `\n> **#${idx + 1}**   <@${id}> ${rankEmoji}${badges}` +
           `\n> ${bar}` +
           `\n> *${data.rr} ʀʀ  &  ${invites} invites*`;
  }));

  const embed = new EmbedBuilder()
    .setTitle("ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ ᴍᴀʀꜱ")
    .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472293135437529159/3.png?ex=69920b55&is=6990b9d5&hm=8202e2bd395ddb64d47464154b3a02d174f83c942a633b448a54672d04288666&')
    .setDescription(lines.join("\n") || "*Calcul en cours...*")
    .setColor(0x242429);

  await msg.edit({ embeds: [embed] }).catch(() => {});
}
















// ===== Interaction Handler =====
client.on('interactionCreate', async (interaction) => {
  try {

    const MOD_ROLE_ID = '1461348856100028439';
    const VERIFIED_ROLE_ID = '1461354176931041312';

    const isMod = interaction.member?.roles?.cache?.has(MOD_ROLE_ID);
    const isVerified = interaction.member?.roles?.cache?.has(VERIFIED_ROLE_ID);

    // ✅ Fonction pour retrouver une game
    function findGame(interaction) {
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith('spectate_select_')) {
    const gameId = interaction.customId.replace('spectate_select_', '');
    return gamesData.games.find(g =>
      g.id === gameId ||
      g.messageId === gameId ||
      g.manageMessageId === gameId ||
      g.betMessageId === gameId
    );
  }

  if (interaction.message?.id) {
    const mid = interaction.message.id;
    return gamesData.games.find(g =>
      g.id === mid ||
      g.messageId === mid ||
      g.manageMessageId === mid ||
      g.betMessageId === mid
    );
  }

  return null;
}

    // ✅ UNE seule variable game
    let game = findGame(interaction);
    const isGameOwner = game?.creatorId === interaction.user.id;
    const canManageThisGame = interaction.user.id === BOT_OWNER_ID || isGameOwner;


  // ✅ Boutons hors "game" (doivent répondre vite)
if (interaction.isButton()) {


  // OPEN TICKET
  if (interaction.customId === 'open_ticket') {
    const modal = new ModalBuilder()
      .setCustomId('ticket_reason_modal')
      .setTitle('Ouvrir un ticket');

    const reasonInput = new TextInputBuilder()
      .setCustomId('ticket_reason')
      .setLabel('Motif (ex: report, question, reset, etc.)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
    return interaction.showModal(modal);
  }

  // CLOSE TICKET
  if (interaction.customId === 'close_ticket') {
    await interaction.deferReply({ ephemeral: true });
    const ch = interaction.channel;
    if (!ch) return interaction.editReply('❌ Salon introuvable.');
    await ch.delete().catch(() => {});
    return;
  }

  // MANAGE RR (ADD / REMOVE)
  if (interaction.customId.startsWith('manage_add_') || interaction.customId.startsWith('manage_remove_')) {
    const isAdd = interaction.customId.startsWith('manage_add_');
    const userId = interaction.customId.split('_').pop();

    const modal = new ModalBuilder()
      .setCustomId(`manage_modal_${isAdd ? 'add' : 'remove'}_${userId}`)
      .setTitle(isAdd ? 'Ajouter des RR' : 'Retirer des RR');

    const rrInput = new TextInputBuilder()
      .setCustomId('rr_amount')
      .setLabel('Combien de RR ?')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(rrInput));
    return interaction.showModal(modal);
  }

  // MANAGE RESET
  if (interaction.customId.startsWith('manage_reset_')) {
    await interaction.deferReply({ ephemeral: true });
    const userId = interaction.customId.split('_').pop();

    pointsData[userId] = { rr: 0, games: 0, wins: 0 };
    persistPoints();
    await updateTop15Embed();

    return interaction.editReply(`🔄 Stats reset pour <@${userId}> (0 RR, 0 games, 0 wins).`);
  }
}


if (interaction.isButton() && interaction.customId === 'toggle_notif_pp') {
  const roleId = ROLE_NOTIF_PP;
  const member = interaction.member;

  if (!member || !member.roles) {
    return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
  }

  const hasRole = member.roles.cache.has(roleId);

  try {
    if (hasRole) {
      await member.roles.remove(roleId);
      return interaction.reply({
        content: '🔕 Tu ne recevras plus les notifications PP.',
        ephemeral: true
      });
    } else {
      await member.roles.add(roleId);
      return interaction.reply({
        content: '🔔 Tu recevras désormais les notifications PP.',
        ephemeral: true
      });
    }
  } catch (err) {
    console.error(err);
    return interaction.reply({
      content: '❌ Impossible de modifier ton rôle de notification.',
      ephemeral: true
    });
  }
}











// ✅ Sécurité UNIQUEMENT pour les interactions qui ont un customId (boutons / menus)
if (interaction.isButton()) {

  const gameButtons = [
    'change_map',
    'start',
    'cancel_registration',
    'spectate',
    'attack_win',
    'defense_win',
    'cancel_game'
  ];

  if (gameButtons.includes(interaction.customId) && !game) {
    return interaction.reply({ content: "Cette partie n'existe plus.", ephemeral: true });
  }

  // ✅ Boutons de gestion de partie = uniquement créateur du /pp ou toi
  const ownerOnlyButtons = [
    'start',
    'cancel_registration',
    'attack_win',
    'defense_win',
    'cancel_game'
  ];

  if (ownerOnlyButtons.includes(interaction.customId) && !canManageThisGame) {
    return interaction.reply({
      content: '⛔ Seul le créateur de cette partie peut utiliser ce bouton.',
      ephemeral: true
    });
  }

  // 👀 Vérifiés seulement pour spectate
  const verifiedOnly = ['spectate'];
  if (verifiedOnly.includes(interaction.customId) && !isVerified) {
    return interaction.reply({ content: '⛔ Seuls les membres Vérifiés peuvent observer.', ephemeral: true });
  }
}



  const waitingVC = game ? interaction.guild.channels.cache.get(game.waitingVC) : null;

  async function moveVerifiedToVC(member, vc) {
  if (!member || !vc) return;

  const originalLimit = vc.userLimit;

  try {
    // ✅ Si le salon a une limite (>0) et qu'il est plein, on augmente temporairement
    if (vc.userLimit > 0 && vc.members.size >= vc.userLimit) {
      await vc.edit({ userLimit: vc.members.size + 1 });
    }

    await member.voice.setChannel(vc).catch(() => {});
  } finally {
    // ✅ On remet la limite d'origine
    if (vc.editable) {
      await vc.edit({ userLimit: originalLimit }).catch(() => {});
    }
  }
}

  // ── COMMANDES SLASH ──
 if (interaction.isChatInputCommand() && interaction.commandName === 'pp') {
  if (!isMod) {
  return interaction.reply({ content: '⛔ Seuls les Organisateur de parties peuvent créer une partie.', ephemeral: true });
}

  const modal = new ModalBuilder()
    .setCustomId('pp_create_modal')
    .setTitle('Créer une partie personnalisée');

  const valorantCodeInput = new TextInputBuilder()
    .setCustomId('valorant_code')
    .setLabel('Code de groupe Valorant')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(6)
    .setMaxLength(6);

  modal.addComponents(new ActionRowBuilder().addComponents(valorantCodeInput));
  return interaction.showModal(modal);
}

  // ── MODAL SUBMIT ──
  if (interaction.isModalSubmit() && interaction.customId === 'pp_create_modal') {
    await interaction.deferReply({ ephemeral: true });
    const valorantCode = interaction.fields.getTextInputValue('valorant_code');
    const verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Vérifié');
    if (!verifiedRole) return interaction.editReply("⚠️ Le rôle Vérifié n'existe pas.");

    const category = await interaction.guild.channels.create({
      name: 'ᴘᴀʀᴛɪᴇ ᴇɴ ᴄᴏᴜʀꜱ',
      type: 4,
      permissionOverwrites: [
  {
  id: interaction.guild.id,
  deny: [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.Connect,
  ],
},
  {
    id: verifiedRole.id,
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.Connect,
    ],
  },
  ...(MOD_ROLE_ID
    ? [
        {
          id: MOD_ROLE_ID,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.MoveMembers,
          ],
        },
      ]
    : [])
      ]
    });

    const waitingVC = await interaction.guild.channels.create({
  name: `┃préparation ${valorantCode}`,
  type: 2,
  parent: category.id,
  userLimit: 10,
  permissionOverwrites: [
  {
  id: interaction.guild.id,
  deny: [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.Connect,
  ],
},
  {
    id: verifiedRole.id, // rôle Vérifié
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.Connect,
      PermissionsBitField.Flags.Speak,
    ],
  },
  ...(MOD_ROLE_ID
    ? [{
        id: MOD_ROLE_ID, // rôle orga/mod
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.Connect,
          PermissionsBitField.Flags.MoveMembers,
        ],
      }]
    : []),
],
});

    const map = maps[Math.floor(Math.random() * maps.length)];

const embed = new EmbedBuilder()
  .setTitle(`PARTIE CRÉÉE`)
  .setDescription(`## <#${waitingVC.id}>\n*10 slots restants*\n*en attente de participants...*`)
  .setImage(map?.image || 'https://cdn.discordapp.com/attachments/1461761854563942400/1476383168964722848/Dessin.gif')
  .setColor(0x242429)
  .setFooter({
    iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 32 }),
    text: `Organisée par ${interaction.member.displayName}`
  });

    const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId('change_map').setLabel('Map rotation').setStyle(ButtonStyle.Secondary),
  new ButtonBuilder().setCustomId('start').setLabel('Lancer la partie').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('cancel_registration').setLabel('Annuler').setStyle(ButtonStyle.Primary)
);


// Stocke l'ID du channel dans la partie
const msg = await interaction.channel.send({ embeds: [embed], components: [row] });
gamesData.games.push({
  id: msg.id,
  messageId: msg.id,          // ✅ AJOUT
  channelId: interaction.channel.id,
  valorantCode,
  categoryId: category.id,
  waitingVC: waitingVC.id,
  players: [],
  spectators: {},
  mapName: map.name,
  mapImage: map.image,
  changeMapVotes: [],
  locks: {},
  creatorId: interaction.user.id,
  creatorName: interaction.member.displayName,
  creatorAvatar: interaction.user.displayAvatarURL({ dynamic: true, size: 32 }),
});

    persistGames();
    return interaction.editReply('✅ Partie créée.');
  }

  // ── SELECT MENU OBSERVER ──
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith('spectate_select_')) {
    if (!isVerified) return interaction.reply({ content: '⛔ Seuls les Vérifiés peuvent observer.', ephemeral: true });
    if (!game) return interaction.reply({ content: "Cette partie n'existe plus.", ephemeral: true });
    const choice = interaction.values[0]; // attack ou defense
    const att = interaction.guild.channels.cache.get(game.attVC);
const def = interaction.guild.channels.cache.get(game.defVC);
const vc = (choice === 'attack' ? att : def) || waitingVC;
    if (!vc) return interaction.reply({ content: '❌ Aucun salon disponible.', ephemeral: true });
    await moveVerifiedToVC(interaction.member, vc);
    if (!game.spectators) game.spectators = {};
    game.spectators[interaction.user.id] = choice;
    persistGames();

    // Update embed PARTIE CRÉÉE
    await updateRegistrationEmbed(interaction.guild, game);

    return interaction.update({ content: `Tu observes les ${choice === 'attack' ? 'attaquants' : 'défenseurs'} !`, components: [] });
  }





// ensuite ton switch
if (interaction.isButton()) {
  switch (interaction.customId) {

case 'change_map': {
  if (!game) return interaction.reply({ content: "Cette partie n'existe plus.", ephemeral: true });

  const voterId = interaction.user.id;

  const prepVC = interaction.guild.channels.cache.get(game.waitingVC);
  const inPrepVC = prepVC?.members?.has(voterId);

  if (!inPrepVC) {
    return interaction.reply({ content: "❌ Tu dois être dans le vocal de préparation pour voter.", ephemeral: true });
  }

  if (!game.changeMapVotes) game.changeMapVotes = [];

  if (game.changeMapVotes.includes(voterId)) {
    return interaction.reply({ content: "✅ Tu as déjà voté pour changer la map.", ephemeral: true });
  }

  game.changeMapVotes.push(voterId);

  const needed = 6;
  const votes = game.changeMapVotes.length;

  if (votes >= needed) {
    const currentName = game.mapName;
    const pool = maps.filter(m => m.name !== currentName);
    const newMap = pool.length
      ? pool[Math.floor(Math.random() * pool.length)]
      : maps[Math.floor(Math.random() * maps.length)];

    game.mapName = newMap.name;
    game.mapImage = newMap.image;

    game.changeMapVotes = [];
    persistGames();

    await updateRegistrationEmbed(interaction.guild, game);

    return interaction.reply({
      content: `🗺️ **Map changée !** Nouvelle map : **${game.mapName}** (votes reset)`,
      ephemeral: true
    });
  }

  persistGames();
  await updateRegistrationEmbed(interaction.guild, game);

  return interaction.reply({ content: `✅ Vote enregistré (${votes}/${needed}).`, ephemeral: true });
}



    case 'cancel_registration': {
  const WAITING_ROOM_ID = '1474562499897594071';
  const lobbyVC = interaction.guild.channels.cache.get(WAITING_ROOM_ID);

  if (!lobbyVC) {
    return interaction.reply({ content: "❌ Salon 'salle d'attente' introuvable.", ephemeral: true });
  }

  // Déplacer joueurs
  if (game.players?.length) {
    await Promise.all(game.players.map(async (id) => {
      const member = interaction.guild.members.cache.get(id) || null;
      if (member?.voice?.channel) {
        await member.voice.setChannel(lobbyVC).catch(() => {});
      }
    }));
  }

  // Déplacer spectateurs
  if (game.spectators) {
    await Promise.all(Object.keys(game.spectators).map(async (id) => {
      const member = interaction.guild.members.cache.get(id) || null;
      if (member?.voice?.channel) {
        await member.voice.setChannel(lobbyVC).catch(() => {});
      }
    }));
  }

  // Supprimer les channels de la partie
  const toDelete = [game.attVC, game.defVC, game.waitingVC, game.categoryId].filter(Boolean);

await Promise.all(toDelete.map(async (id) => {
  const ch = interaction.guild.channels.cache.get(id);
  if (ch) await ch.delete().catch(() => {});
}));

  // Supprimer le message d'inscription
  const registrationMsg = await interaction.channel.messages.fetch(game.messageId || game.id).catch(() => null);
  if (registrationMsg) await registrationMsg.delete().catch(() => {});

  // Supprimer la partie du json
  gamesData.games = gamesData.games.filter(g => g.id !== game.id);
  persistGames();

  // Réponse
  try {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Partie annulée : joueurs/spectateurs renvoyés en salle d'attente.", ephemeral: true });
    } else {
      await interaction.followUp({ content: "❌ Partie annulée : joueurs/spectateurs renvoyés en salle d'attente.", ephemeral: true });
    }
  } catch {}

  if (gameLocks[game.id]) delete gameLocks[game.id];
  break;
}

    case 'start': {
  await interaction.deferReply({ ephemeral: true });

  const verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Vérifié');
  if (!verifiedRole) {
    return interaction.editReply({ content: '⚠️ Rôle Vérifié introuvable.' });
  }

  if (!game.players.length) {
    return interaction.editReply({ content: "Aucun joueur inscrit." });
  }

  const registrationMsg = await interaction.channel.messages.fetch(game.messageId || game.id).catch(() => null);
  if (registrationMsg) await registrationMsg.delete().catch(() => {});


  // ─────────────── ÉQUILIBRAGE DES ÉQUIPES ───────────────
  function balanceTeams(players) {
    if (players.length === 2) return { attackers: [players[0]], defenders: [players[1]] };
    const combinations = getCombinations(players, Math.floor(players.length / 2));
    let bestDiff = Infinity;
    let bestTeams = null;
    for (const teamA of combinations) {
      const teamB = players.filter(p => !teamA.includes(p));
      const sumA = teamA.reduce((sum, p) => sum + p.rankValue, 0);
      const sumB = teamB.reduce((sum, p) => sum + p.rankValue, 0);
      const diff = Math.abs(sumA - sumB);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestTeams = { attackers: teamA, defenders: teamB };
      }
    }
    return bestTeams;
  }

  function getCombinations(arr, k) {
    const result = [];
    function comb(start, chosen) {
      if (chosen.length === k) { result.push([...chosen]); return; }
      for (let i = start; i < arr.length; i++) {
        chosen.push(arr[i]);
        comb(i + 1, chosen);
        chosen.pop();
      }
    }
    comb(0, []);
    return result;
  }
  
  // Valeurs de rank par roleId
  const RANK_VALUES_BY_ID = {
    '1114187578866933790': 69, '1114182691550658650': 61, '1461352160850870427': 55,
    '1461352201267188046': 46, '1114186784574812332': 44, '1461352272075292844': 36,
    '1461352294237868222': 32, '1114187919662522429': 30, '1461352361355378688': 29,
    '1461352408788762738': 28, '1113191909876318268': 27, '1461352440132800768': 25,
    '1461352460227580111': 23, '1113191866888884274': 22, '1461352488623014026': 21,
    '1461352505257754888': 20, '1113191838657020074': 19, '1461352528250933369': 18,
    '1461352567647768729': 18, '1113191790967799889': 17, '1461352629182529740': 17,
    '1461352645309759508': 16, '1461352661684064309': 14, '1461352687777091666': 12,
    '1461352715631460516': 10
  };
  
  const sortedPlayers = game.players.map(userId => {
    const member = interaction.guild.members.cache.get(userId);
    const rankValue = member
      ? member.roles.cache.reduce((val, role) => val || RANK_VALUES_BY_ID[role.id], 0)
      : 0;
    return { id: userId, member, rankValue };
  });

  const balanced = balanceTeams(sortedPlayers);
  game.attackers = balanced.attackers.map(p => ({ id: p.id, member: p.member }));
  game.defenders = balanced.defenders.map(p => ({ id: p.id, member: p.member }));

  // ─────────────── LOGS ───────────────
  const attSum = balanced.attackers.reduce((sum, p) => sum + p.rankValue, 0);
  const defSum = balanced.defenders.reduce((sum, p) => sum + p.rankValue, 0);
  console.log(`┌─────────────────────────────┐`);
  console.log(`│ ÉQUIPE ATTAQUANTS :     ${attSum.toString().padStart(3)} │`);
  console.log(`│ ÉQUIPE DÉFENSEURS :     ${defSum.toString().padStart(3)} │`);
  console.log(`│ DIFFÉRENCE :            ${Math.abs(attSum - defSum).toString().padStart(3)} │`);
  console.log(`└─────────────────────────────┘`);



  // ─────────────── CRÉATION VOCAUX ───────────────
  const everyoneRole = interaction.guild.roles.everyone;
  const category = interaction.guild.channels.cache.get(game.categoryId);

// ❌ Ne JAMAIS supprimer par nom globalement
// for (const name of ['┃attaquants','┃défenseurs']) ...

// ✅ Si jamais tu veux nettoyer une ancienne instance de la même game (re-start), fais-le par ID
for (const id of [game.attVC, game.defVC]) {
  const ch = interaction.guild.channels.cache.get(id);
  if (ch) await ch.delete().catch(() => {});
}

const VERIFIED_ROLE_ID = '1461354176931041312';

const attVC = await interaction.guild.channels.create({
  name: '┃attaquants',
  type: 2,
  parent: category?.id,
  userLimit: 5,
  permissionOverwrites: [
    // Cache le vocal à tout le monde
    {
      id: everyoneRole.id,
      deny: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.Connect,
      ],
    },

    // ✅ Tous les vérifiés voient, mais ne peuvent pas se co
    {
      id: VERIFIED_ROLE_ID,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
      ],
      deny: [
        PermissionsBitField.Flags.Connect,
      ],
    },

    // ✅ Les attaquants peuvent voir + se co + parler
    ...game.attackers.map(p => ({
      id: p.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak,
      ],
    })),
  ],
});

const defVC = await interaction.guild.channels.create({
  name: '┃défenseurs',
  type: 2,
  parent: category?.id,
  userLimit: 5,
  permissionOverwrites: [
    {
      id: everyoneRole.id,
      deny: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.Connect,
      ],
    },
    {
      id: VERIFIED_ROLE_ID,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
      ],
      deny: [
        PermissionsBitField.Flags.Connect,
      ],
    },
    ...game.defenders.map(p => ({
      id: p.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak,
      ],
    })),
  ],
});

  game.attVC = attVC.id;
  game.defVC = defVC.id;

persistGames();

  // Déplacer joueurs et spectateurs connectés
  for (const p of [...game.attackers, ...game.defenders]) {
    if (p.member?.voice?.channel) {
      const targetVC = game.attackers.find(a=>a.id===p.id) ? attVC : defVC;
      await p.member.voice.setChannel(targetVC).catch(()=>{});
    }
  }

  if (game.spectators) {
  for (const [id, choice] of Object.entries(game.spectators)) {
    const member = interaction.guild.members.cache.get(id) || null;
    const vc = choice === 'attack' ? attVC : defVC;
    if (member?.voice?.channel) await member.voice.setChannel(vc).catch(() => {});
  }
}

  // Supprimer le salon de préparation
  const prepVC = interaction.guild.channels.cache.get(game.waitingVC);
  if (prepVC) await prepVC.delete().catch(() => {});

  // ─────────────── EMBED PARTIE EN COURS ───────────────
  // 🔥 Fonction pour trier une équipe par rank (du plus fort au plus faible)
const sortTeamByRank = (team) => {

  let data = [];

  for (const player of team) {

    const member = interaction.guild.members.cache.get(player.id) || null;
    if (!member) continue;

    const rankRole = member.roles.cache.find(r => RANK_ORDER[r.name]);
    const rankValue = rankRole ? RANK_ORDER[rankRole.name] : 999;
    const rankEmoji = rankRole ? rankEmojis[rankRole.name] : '<:Unranked:1465744234182086789>';

    data.push({
      id: player.id,
      rankValue,
      rankEmoji
    });
  }

  // 👇 Plus petit = plus fort (Radiant=1), donc ascendant
  data.sort((a, b) => a.rankValue - b.rankValue);

  return data.map(p => `${p.rankEmoji} <@${p.id}>`).join('\n') || 'Aucun';
};

// 🔹 On génère le texte des équipes
const attackersText = sortTeamByRank(game.attackers);
const defendersText = sortTeamByRank(game.defenders);


const gameEmbed = new EmbedBuilder()
  .setTitle(`PARTIE EN COURS`)
  .addFields(
    { name:'<:VIDE:1465704930160410847> ᴀᴛᴛᴀǫᴜᴀɴᴛs', value: attackersText, inline:true },
    { name:'<:VIDE:1465704930160410847> ᴅᴇꜰᴇɴsᴇᴜʀs', value: defendersText, inline:true }
  )
  .setColor(0x242429)
  .setFooter({
    iconURL: interaction.user.displayAvatarURL({ dynamic:true, size:32 }),
    text:`Lancée par ${interaction.member.displayName}`
  });

// ✅ Image de la map de la game (celle tirée au /pp ou changée par votes)
if (game.mapImage) {
  gameEmbed.setImage(game.mapImage);
}

  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId('spectate').setLabel('Spectate').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('attack_win').setLabel('Attaquants').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('defense_win').setLabel('Défenseurs').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('cancel_game').setLabel('Annuler').setStyle(ButtonStyle.Danger)
    );

  const inGameMsg = await interaction.channel.send({ embeds: [gameEmbed], components: [buttons] });

// ✅ on stocke l'id du message "PARTIE EN COURS"
game.manageMessageId = inGameMsg.id;
persistGames();

await interaction.editReply('✅ Partie lancée');
break;
}

case 'spectate': {
  const verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Vérifié');
  if (!verifiedRole || !interaction.member.roles.cache.has(verifiedRole.id)) {
    return interaction.reply({ content: '❌ Seuls les membres Vérifiés peuvent observer.', ephemeral: true });
  }

  if (game.players.includes(interaction.user.id)) {
    return interaction.reply({ content: '❌ Tu es déjà inscrit à la partie.', ephemeral: true });
  }

  // Créer le select menu pour choisir l'équipe
  const selectMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`spectate_select_${game.id}`)
      .setPlaceholder('Assure toi d\'être dans un salon vocal !')
      .addOptions([
        { label: 'Observer les attaquants', value: 'attack'},
        { label: 'Observer les défenseurs', value: 'defense'}
      ])
  );

  return interaction.reply({ content: '', components: [selectMenu], ephemeral: true });
}

case 'attack_win':
case 'defense_win':
case 'cancel_game': {
  await interaction.deferUpdate();

  if (!game) return;

  // ✅ AJOUT ICI
  if (interaction.customId === 'attack_win' || interaction.customId === 'defense_win') {
    if (game.manageMessageId) {
      const inGameMsg = await interaction.channel.messages.fetch(game.manageMessageId).catch(() => null);
      if (inGameMsg?.deletable) await inGameMsg.delete().catch(() => {});
    }
  }
  
const WAITING_ROOM_ID = '1474562499897594071';
const waitingVC = interaction.guild.channels.cache.get(WAITING_ROOM_ID);

if (!waitingVC) {
  console.log("❌ Lobby principal introuvable.");
  return;
}

  const attackers = game.attackers.map(p => p.id);
  const defenders = game.defenders.map(p => p.id);
  const allPlayers = [...attackers, ...defenders];

  const moveMembersToVC = async (ids, vc) => {
    for (const id of ids) {
      const member = interaction.guild.members.cache.get(id) || null;
      if (member?.voice?.channel) await member.voice.setChannel(vc).catch(() => {});
    }
  };


  // ───────────── CANCEL GAME ─────────────
  if (interaction.customId === 'cancel_game') {
    // Déplacer joueurs + spectateurs
    await moveMembersToVC(allPlayers, waitingVC);
    if (game.spectators) await moveMembersToVC(Object.keys(game.spectators), waitingVC);

    // Supprimer channels
    for (const id of [game.attVC, game.defVC, game.categoryId]) {
      const ch = interaction.guild.channels.cache.get(id);
      if (ch) await ch.delete().catch(() => {});
    }

    // Supprimer message
    const gameMsgId = game.manageMessageId || game.betMessageId || game.id;
    const gameMsg = await interaction.channel.messages.fetch(gameMsgId).catch(() => null);
    if (gameMsg?.deletable) await gameMsg.delete().catch(() => {});

    // Supprimer la partie
    gamesData.games = gamesData.games.filter(g => g.id !== game.id);
    persistGames();
    if (gameLocks[game.id]) delete gameLocks[game.id];
    return;
  }

  // ───────────── FIN DE PARTIE ─────────────
  const winningSide = interaction.customId === 'attack_win' ? 'attack' : 'defense';
  const finalColor = winningSide === 'attack' ? 0x763746 : 0x1f8072;
  const matchRR = {};

  // Attribution RR
  for (const playerId of allPlayers) {
    if (!pointsData[playerId]) pointsData[playerId] = { rr: 0, games: 0, wins: 0 };
    const isWinner =
      (winningSide === 'attack' && attackers.includes(playerId)) ||
      (winningSide === 'defense' && defenders.includes(playerId));
    const delta = isWinner ? 30 : -15;

    pointsData[playerId].rr = Math.max(0, pointsData[playerId].rr + delta);
    pointsData[playerId].games += 1;
    if (isWinner) pointsData[playerId].wins += 1;
    matchRR[playerId] = delta;
  }

  // ✅ Déplacer tout le monde IMMÉDIATEMENT (joueurs + spectateurs)
const spectatorIds = game.spectators ? Object.keys(game.spectators) : [];
const everyoneToMove = [...new Set([...allPlayers, ...spectatorIds])];

await moveMembersToVC(everyoneToMove, waitingVC);

// ✅ Ensuite seulement : RR + leaderboard (lent)
persistPoints();
await updateTop15Embed();


  // Cleanup channels
  for (const id of [game.attVC, game.defVC, game.categoryId]) {
    const ch = interaction.guild.channels.cache.get(id);
    if (ch) await ch.delete().catch(() => {});
  }

  // Supprimer la partie
  gamesData.games = gamesData.games.filter(g => g.id !== game.id);
  persistGames();

  // ───────────── Embed final ─────────────
  const formatPlayers = (ids) => {

  let data = [];

  for (const id of ids) {

    const member = interaction.guild.members.cache.get(id) || null;
    if (!member) continue;

    const rankRole = member.roles.cache.find(r => RANK_ORDER[r.name]);
    const rankValue = rankRole ? RANK_ORDER[rankRole.name] : 999;
    const rankEmoji = rankRole ? rankEmojis[rankRole.name] : rankEmojis.Unranked;

    const rr = matchRR[id] > 0 ? `+${matchRR[id]}ʀʀ` : `${matchRR[id]}ʀʀ`;

    data.push({
      id,
      rankValue,
      rankEmoji,
      rr
    });
  }

  data.sort((a, b) => a.rankValue - b.rankValue);

  return data.map(p => `${p.rankEmoji} <@${p.id}>  **${p.rr}**`).join('\n');
};


  const embed = new EmbedBuilder()
  .setTitle(`PARTIE TERMINÉE`)
  .addFields(
    { name: '<:VIDE:1465704930160410847>  ᴀᴛᴛᴀǫᴜᴀɴᴛs', value: formatPlayers(attackers), inline: true },
    { name: '<:VIDE:1465704930160410847>  ᴅᴇꜰᴇɴsᴇᴜʀs', value: formatPlayers(defenders), inline: true }
  )
  .setColor(finalColor)
  .setFooter({
    iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 32 }),
    text: `Validée par ${interaction.member.displayName}`
  });

  await interaction.channel.send({ embeds: [embed] }).catch(console.error);
  if (gameLocks[game.id]) delete gameLocks[game.id];
  break;
}default:
      break;
  }
}













    if (interaction.isChatInputCommand() && interaction.commandName === 'manage') {
  const targetUser = interaction.options.getUser('joueur');
  const userStats = pointsData[targetUser.id] || { rr: 0, games: 0, wins: 0 };

  const embed = new EmbedBuilder()
    .setTitle(`⚙️ GESTION DE ${targetUser.tag}`)
    .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
    .setColor(0x242429)
    .addFields(
      { name: 'RR actuel', value: `${userStats.rr} ʀʀ`, inline: true },
      { name: 'Parties jouées', value: `${userStats.games}`, inline: true },
      { name: 'Victoires', value: `${userStats.wins}`, inline: true }
    )
    .setFooter({ text: 'Utilisez les boutons ci-dessous pour gérer ce joueur' });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`manage_add_${targetUser.id}`)
      .setLabel('+ Ajouter RR')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`manage_remove_${targetUser.id}`)
      .setLabel('- Retirer RR')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`manage_reset_${targetUser.id}`)
      .setLabel('🔄 Reset Complet')
      .setStyle(ButtonStyle.Secondary)
  );

  return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}











const RANK_ROLES = {
    Radiant: '1114187578866933790',
    Immortal3: '1114182691550658650',
    Immortal2: '1461352160850870427',
    Immortal1: '1461352201267188046',
    Ascendant3: '1114186784574812332',
    Ascendant2: '1461352272075292844',
    Ascendant1: '1461352294237868222',
    Diamond3: '1114187919662522429',
    Diamond2: '1461352361355378688',
    Diamond1: '1461352408788762738',
    Platinum3: '1113191909876318268',
    Platinum2: '1461352440132800768',
    Platinum1: '1461352460227580111',
    Gold3: '1113191866888884274',
    Gold2: '1461352488623014026',
    Gold1: '1461352505257754888',
    Silver3: '1113191838657020074',
    Silver2: '1461352528250933369',
    Silver1: '1461352567647768729',
    Bronze3: '1113191790967799889',
    Bronze2: '1461352629182529740',
    Bronze1: '1461352645309759508',
    Iron3: '1461352661684064309',
    Iron2: '1461352687777091666',
    Iron1: '1461352715631460516'
  };


  // --------------------------------------
  // MENU RANK
  // --------------------------------------
if (interaction.isStringSelectMenu() && interaction.customId === 'rank_select') {
  if (interaction.replied || interaction.deferred) return;

  await interaction.reply({
    content: 'Mise à jour du rank…',
    ephemeral: true,
  });

  const thread = interaction.channel;
  if (thread?.isThread()) await thread.sendTyping();
  await new Promise(r => setTimeout(r, 250));

  for (const roleId of Object.values(RANK_ROLES)) {
    if (interaction.member.roles.cache.has(roleId)) {
      await interaction.member.roles.remove(roleId).catch(() => {});
    }
  }

  const selectedRank = interaction.values[0];
  const roleIdToAdd = RANK_ROLES[selectedRank];

  await interaction.member.roles.add(roleIdToAdd).catch(() => {});

  const role = interaction.guild.roles.cache.get(roleIdToAdd);

  const rankEmbed = new EmbedBuilder()
    .setColor(0x242429)
    .setDescription(
      `### Ton peak rank 2025 a été défini sur ${role ? `<@&${role.id}>` : `**${selectedRank}**`}`
    )
    .setFooter({ text: 'Si ton peak rank évolue au fil du temps, contacte-nous.' });

  return interaction.editReply({ content: null, embeds: [rankEmbed] });
}
  // --------------------------------------
  // BOUTON RIOT
  // --------------------------------------
  if (interaction.isButton() && interaction.customId === 'verify_riot') {
    if (interaction.replied || interaction.deferred) return;

    const modal = new ModalBuilder()
      .setCustomId('riot_modal')
      .setTitle('Vérification Riot ID');

    const pseudoInput = new TextInputBuilder()
      .setCustomId('riot_pseudo')
      .setLabel('Pseudo sur VALORANT, sans le #TAG')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(pseudoInput)    );

    await interaction.showModal(modal);
    return;
  }
  // --------------------------------------
  // MODAL RIOT
  // --------------------------------------
if (interaction.isModalSubmit() && interaction.customId === 'riot_modal') {
  if (interaction.replied || interaction.deferred) return;

  const pseudo = interaction.fields.getTextInputValue('riot_pseudo');

  // 📁 Sauvegarde des données
  const data = JSON.parse(fs.readFileSync('./riotData.json', 'utf8'));
  data[interaction.user.id] = { pseudo };
  fs.writeFileSync('./riotData.json', JSON.stringify(data, null, 2));

  // 🏷️ Changement de pseudo
  await interaction.member.setNickname(pseudo).catch(() => {});

  // ⏳ Réponse immédiate
  await interaction.reply({ content: 'Vérification en cours…', ephemeral: true });

  const thread = interaction.channel;

  if (thread?.isThread?.()) await thread.sendTyping();
  await new Promise(r => setTimeout(r, 250));

  // 📦 Embed de vérification
const verifyEmbed = new EmbedBuilder()
  .setColor(0x242429)
  .setDescription(
    `# ${interaction.user.tag} <:DISCORD:1472201746246799451><:DEBUT:1472199399382978672><:MILIEU:1472199381854847109><:FIN:1472199414155051172><:RIOT:1472201753306071217> ${pseudo}`
  )
  .setFooter({ text: 'Ton compte est vérifié, amuse-toi bien !' });

await interaction.editReply({ content: null, embeds: [verifyEmbed] });

// 🧵 Fermer + supprimer le thread APRES 3 secondes
if (thread?.isThread?.()) {

  // attendre 3 secondes
  await new Promise(resolve => setTimeout(resolve, 5000));
  await thread.setLocked(true).catch(() => {});
  await thread.setArchived(true).catch(() => {});
  await thread.delete().catch(() => {});
}

// ✅ DONNER LE ROLE EN DERNIER (après suppression)
await interaction.member.roles.add(ROLE_VERIFIE).catch(() => {});
await interaction.member.roles.add(ROLE_NOTIF_PP).catch(() => {});

return;
}
















    if (interaction.isChatInputCommand() && interaction.commandName === 'top15'){
      await interaction.deferReply({ ephemeral: true });
      const embed = new EmbedBuilder()
        .setTitle("ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ ᴍᴀʀꜱ")
        .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472293135437529159/3.png?ex=69920b55&is=6990b9d5&hm=8202e2bd395ddb64d47464154b3a02d174f83c942a633b448a54672d04288666&')
        .setDescription("*Calcul en cours...*")
        .setColor(0x242429);
      const msg = await interaction.channel.send({ embeds:[embed] });
      top15Data = { messageId: msg.id, channelId: interaction.channel.id };
      persistTop15();
      await updateTop15Embed();
      return interaction.editReply({ content: "✅ TOP15 créé dans ce salon", ephemeral: true });
}







if (interaction.isChatInputCommand() && interaction.commandName === 'regles') {
  const embed = new EmbedBuilder()
    .setDescription(
      '### ***RÈGLES DU SERVEUR***\n' +
      '- <:Automate:1466470349351686194>      **Faux peak rank** / **AFK**   →   **BAN**\n' +
      '- <:Armes:1466470377327825028>      Aucune limite d\'armes\n' +
      '- <:TopInviterCashprize:1465709888729776296>      Cashprize mensuel pour le **TOP 1   Leaderboard**\n' +
      '- <:TopLeaderboardCashprize:1465747415670984862>      Cashprize mensuel pour le **TOP 1   Invitations**\n' +
      '- <:Performance:1466957289813442721>      Pour afficher votre classement   →   `!tracker`\n' +
      '\n' +
      '### ***COMMENT JOUER ?***\n' +
      '- <:VC:1466608491861901362>** ┃file d’attente**\n' +
      '- <:Annonce:1472840875708252192>** ┃jouer**\n' +
      '>   <:ENTRY2:1466591986382278831> *Nouvelle partie vocale créée*\n' +
      '>   <:ENTRY:1466591997874929876> *Connexion manuelle*\n' +
      '> <:VIDE:1465704930160410847>\n' +
      '- <:VC:1466608491861901362>** ┃préparation**\n' +
      '>   <:ENTRY2:1466591986382278831> *Code de groupe*\n' +
      '>   <:ENTRY2:1466591986382278831> *Équilibrage intelligent*\n' +
      '>   <:ENTRY:1466591997874929876> *Redirection auto*\n' +
      '> <:VIDE:1465704930160410847>\n' +
      '- <:VC:1466608491861901362>** ┃attaquants**\n' +
      '- <:VC:1466608491861901362>** ┃défenseurs**\n' +
      '>   <:ENTRY2:1466591986382278831> *Résultats*\n' +
      '>   <:ENTRY2:1466591986382278831> *Mise à jour du classement*\n' +
      '>   <:ENTRY:1466591997874929876> *Redirection auto*\n' +
      '> <:VIDE:1465704930160410847>\n' +
      '- <:VC:1466608491861901362>** ┃file d’attente**\n' +
      '<:VIDE:1465704930160410847>\n'
    )
    .setColor(0x242429)
    .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472298885828575476/5.png?ex=699210b0&is=6990bf30&hm=154bedcadfe650e1ce6ac21ec90b1a0933fb13e5a37c7f77d2207ea3808387e6&');

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('open_ticket')
      .setLabel('┃Ouvrir un ticket')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji({ id: '1466470365269070026' }),

    new ButtonBuilder()
      .setCustomId('toggle_notif_pp')
      .setLabel('┃Notifications PP')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji({ id: '1466608491861901362' })
  );

  await interaction.channel.send({
    embeds: [embed],
    components: [row]
  });

  return interaction.reply({ content: '✅ Règles envoyées', ephemeral: true });
}





if (interaction.isChatInputCommand() && interaction.commandName === 'ban') {
  const targetUser = interaction.options.getUser('joueur');

  const modal = new ModalBuilder()
    .setCustomId(`ban_modal_${targetUser.id}`)
    .setTitle('Banir un joueur');

  const reasonInput = new TextInputBuilder()
    .setCustomId('ban_reason')
    .setLabel('Raison du ban')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(500);

  modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
  return interaction.showModal(modal);
}

if (interaction.isChatInputCommand() && interaction.commandName === 'timeout') {
  const targetUser = interaction.options.getUser('joueur');
  const duration = interaction.options.getInteger('duree');

  const modal = new ModalBuilder()
    .setCustomId(`timeout_modal_${targetUser.id}_${duration}`)
    .setTitle('Timeout un joueur');

  const reasonInput = new TextInputBuilder()
    .setCustomId('timeout_reason')
    .setLabel('Raison du timeout')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(500);

  modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
  return interaction.showModal(modal);
}

if (interaction.isModalSubmit() && interaction.customId.startsWith('ban_modal_')) {
  await interaction.deferReply({ ephemeral: true });

  const userId = interaction.customId.split('_').pop();
  const reason = interaction.fields.getTextInputValue('ban_reason');
  const user = await client.users.fetch(userId).catch(() => null);

  if (!user) {
    return interaction.editReply('❌ Utilisateur introuvable.');
  }

  try {
    await user.send(
      `Tu as été **banni** du serveur **${interaction.guild.name}**.\nRaison : **${reason}**`
    ).catch(() => {});
    
    // Stockage modération
    const riotData = JSON.parse(fs.readFileSync('./riotData.json', 'utf8'));
    moderationData.bannedUsers[userId] = {
      reason,
      date: new Date().toISOString(),
      riotPseudo: riotData[userId]?.pseudo || null,
      username: user.tag
    };
    persistModeration();

    await interaction.guild.members.ban(userId, { reason });

    return interaction.editReply(`✅ <@${userId}> a été banni.\n**Raison :** ${reason}`);
  } catch (err) {
    console.error(err);
    return interaction.editReply(`❌ Impossible de bannir <@${userId}>.`);
  }
}

if (interaction.isModalSubmit() && interaction.customId.startsWith('timeout_modal_')) {
  await interaction.deferReply({ ephemeral: true });

  const parts = interaction.customId.split('_');
  const userId = parts[2];
  const durationMinutes = parseInt(parts[3], 10);
  const reason = interaction.fields.getTextInputValue('timeout_reason');

  const member = await interaction.guild.members.fetch(userId).catch(() => null);
  if (!member) {
    return interaction.editReply('❌ Membre introuvable.');
  }

  if (!member.moderatable) {
    return interaction.editReply('❌ Je ne peux pas timeout ce membre.');
  }

  try {
    await member.send(
      `Tu as reçu un **timeout de ${durationMinutes} minute(s)** sur **${interaction.guild.name}**.\nRaison : **${reason}**`
    ).catch(() => {});

    await member.timeout(durationMinutes * 60 * 1000, reason);

    return interaction.editReply(
      `✅ <@${userId}> a été timeout pendant **${durationMinutes} minute(s)**.\n**Raison :** ${reason}`
    );
  } catch (err) {
    console.error(err);
    return interaction.editReply(`❌ Impossible de timeout <@${userId}>.`);
  }
}






// ── Gestion du modal TICKET REASON ──
if (interaction.isModalSubmit() && interaction.customId === 'ticket_reason_modal') {
  await interaction.deferReply({ ephemeral: true });

  const guild = interaction.guild;
  const member = interaction.member;
  const reason = interaction.fields.getTextInputValue('ticket_reason') || '';

  // ✅ Sanitize pour éviter les erreurs Discord (caractères interdits / trop long / vide)
  const safeReason = reason
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève accents
    .replace(/[^a-z0-9-]/g, '-')                      // remplace tout le reste
    .replace(/-+/g, '-')                              // évite les --- 
    .replace(/(^-|-$)/g, '')                          // enlève - au début/fin
    .slice(0, 30);

  const finalReason = safeReason || 'demande';

  // Charger la configuration
  const configFile = path.join(__dirname, 'data', 'config.json');
  if (!fs.existsSync(configFile)) {
    return interaction.editReply({
      content: '❌ Configuration manquante. Redémarre le bot pour créer la catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ.',
      ephemeral: true
    });
  }

  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  const ticketCategoryId = config.ticketCategoryId;

  // ✅ Vérifier si l'utilisateur a déjà un ticket ouvert (1 ticket max)
  // On check dans la catégorie + un salon ticket- + permissions qui contiennent le membre
  const existingTicket = guild.channels.cache.find(ch =>
    ch.parentId === ticketCategoryId &&
    ch.name.startsWith('┃ticket-') &&
    ch.permissionOverwrites?.cache?.has(member.id)
  );

  if (existingTicket) {
    return interaction.editReply({
      content: `❌ Tu as déjà un ticket ouvert : <#${existingTicket.id}>`,
      ephemeral: true
    });
  }

  // Récupérer le rôle STAFF
  const staffRole = guild.roles.cache.find(r => r.name === 'Administrateur');
  if (!staffRole) {
    return interaction.editReply({
      content: '❌ Erreur : Le rôle Administrateur n\'existe pas. Redémarre le bot.',
      ephemeral: true
    });
  }

  // Créer le salon ticket
  const ticketChannel = await guild.channels.create({
    name: `┃ticket-${finalReason}`,
    type: 0, // Text channel
    parent: ticketCategoryId,
    permissionOverwrites: [
      {
        id: guild.id, // @everyone
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: member.id, // L'utilisateur
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.AttachFiles
        ]
      },
      {
        id: staffRole.id, // Staff
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.ManageMessages
        ]
      }
    ]
  });

  // Embed de bienvenue dans le ticket avec la raison (non-sanitized = joli)
  const ticketEmbed = new EmbedBuilder()
    .setDescription(
      `- Motif : **${reason || 'Demande'}**\n` +
      `> Merci de nous expliquer la raison de ta demande.\n` +
      `> L'équipe a été notifiée et viendra t'aider.\n\n`
    )
    .setColor(0x242429)
    .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472278091505336320/Design_sans_titre_12.png?ex=6991fd52&is=6990abd2&hm=dffdb1ec6091d2c48214f62277dfea503810656773296813b1062c12c53ecbc5&');

  const closeButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setEmoji({ id: '1466470349351686194' })
      .setLabel('┃Clôturer la discussion')
      .setStyle(ButtonStyle.Secondary)
  );

  await ticketChannel.send({
    content: `${member} ${staffRole}`,
    embeds: [ticketEmbed],
    components: [closeButton]
  });

  return interaction.editReply({
    content: `✅ Ton ticket a été créé : <#${ticketChannel.id}>`,
    ephemeral: true
  });
}












// ── Gestion du modal MANAGE ──
if (interaction.isModalSubmit() && interaction.customId.startsWith('manage_modal_')) {
  const [, , type, userId] = interaction.customId.split('_');
  const amount = parseInt(interaction.fields.getTextInputValue('rr_amount'));

  if (isNaN(amount) || amount <= 0) {
    return interaction.reply({
      content: '❌ Montant invalide. Veuillez entrer un nombre positif.',
      ephemeral: true
    });
  }

  if (!pointsData[userId]) {
    pointsData[userId] = { rr: 0, games: 0, wins: 0 };
  }

  if (type === 'add') {
    pointsData[userId].rr += amount;
  } else if (type === 'remove') {
    pointsData[userId].rr -= amount;
    if (pointsData[userId].rr < 0) {
      pointsData[userId].rr = 0;
    }
  }

  persistPoints();
  await updateTop15Embed();

  const actionText = type === 'add' ? 'ajouté' : 'retiré';
  return interaction.reply({
    content: `✅ ${amount} ʀʀ ${actionText} pour <@${userId}>. Nouveau total : **${pointsData[userId].rr} ʀʀ**`,
    ephemeral: true
  });
}










} catch (err) {
    console.error(err);
  }
});













client.on('voiceStateUpdate', async (oldState, newState) => {
  const guild = newState.guild || oldState.guild;
  if (!guild) return;


  // ─────────────────────────────
  // Gestion des parties PP
  // ─────────────────────────────
  const affectedGame = gamesData.games.find(game =>
  game.waitingVC === newState.channelId || game.waitingVC === oldState.channelId
);

if (affectedGame) {
  if (newState.channelId === affectedGame.waitingVC) {
    if (!affectedGame.players.includes(newState.member.id)) {
      if (affectedGame.players.length >= 10) {
        await newState.member.voice.disconnect().catch(() => {});
        return;
      }

      affectedGame.players.push(newState.member.id);
      persistGames();
      scheduleRegistrationUpdate(guild, affectedGame);
    }
  }

  if (oldState.channelId === affectedGame.waitingVC && oldState.channelId !== newState.channelId) {
    affectedGame.players = affectedGame.players.filter(id => id !== oldState.member.id);
    persistGames();
    scheduleRegistrationUpdate(guild, affectedGame);
  }
}

  // ─────────────────────────────
  // Auto-création de vocal
  // ─────────────────────────────
  if (newState.channelId === AUTO_CREATE_VC_ID) {
  const member = newState.member;
  if (!member) return;

  if (autoCreateLocks.has(member.id)) return;
  autoCreateLocks.set(member.id, true);

  try {
    // ✅ Si entre-temps il a déjà été déplacé, on stoppe
    if (member.voice.channelId !== AUTO_CREATE_VC_ID) return;

    const verifiedRoleId = ROLE_VERIFIE;
    const everyoneRoleId = guild.id;

    const channel = await guild.channels.create({
      name: `${member.displayName}`,
      type: 2,
      parent: TEMP_VOCAL_CATEGORY_ID,
      permissionOverwrites: [
        {
          id: everyoneRoleId,
          deny: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect
          ]
        },
        {
          id: verifiedRoleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect
          ],
          deny: [
            PermissionsBitField.Flags.ManageChannels
          ]
        },
        {
          id: member.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.ManageChannels
          ]
        }
      ]
    });

    // ✅ Recheck avant move
    if (member.voice.channelId === AUTO_CREATE_VC_ID) {
      await member.voice.setChannel(channel).catch(() => {});
    } else {
      await channel.delete().catch(() => {});
    }
  } finally {
    setTimeout(() => autoCreateLocks.delete(member.id), 2000);
  }

  return;
}

  // ─────────────────────────────
  // Suppression des vocaux vides de la catégorie
  // ─────────────────────────────
  const leftChannel = oldState.channel;

  if (
    leftChannel &&
    leftChannel.type === 2 &&
    leftChannel.parentId === TEMP_VOCAL_CATEGORY_ID &&
    leftChannel.members.size === 0 &&
    !EXEMPT_VC_IDS.includes(leftChannel.id) // ✅ dérogation
  ) {
    try {
      await leftChannel.delete().catch(() => {});
      console.log(`Salon vocal supprimé : ${leftChannel.name}`);
    } catch (err) {
      console.error('Erreur lors de la suppression du salon vocal :', err);
    }
  }
});
















client.on('guildMemberAdd', async member => {
    console.log(`Nouveau membre détecté : ${member.displayName}`);

    const accountAgeDays = Math.floor((Date.now() - member.user.createdAt) / (1000 * 60 * 60 * 24));

  // ❌ Compte trop récent = pas de thread privé
  if (accountAgeDays < MIN_ACCOUNT_AGE_DAYS) {
    const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

    if (welcomeChannel) {
      const embed = new EmbedBuilder()
        .setColor(0xd05855)
        .setDescription(
          `## <:Roles:1471219666473980065> ACCÈS RESTREINT\n\n` +
          `> ${member}\n` +
          `> Ton compte Discord a seulement **${accountAgeDays} jours**.\n` +
          `> Un minimum de **30 jours** est requis pour accéder au serveur.\n` +
          `> Ouvre un ticket si tu penses qu'il s'agit d'une erreur.`
        )
        .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 128 }))
        .setTimestamp();

      await welcomeChannel.send({ embeds: [embed] }).catch(() => {});
    }

    return;
  }

    // =======================
    // THREAD BIENVENUE PRIVÉ
    // =======================
    try {
      const accueilChannel = member.guild.channels.cache.get(ACCUEIL_CHANNEL_ID);
    if (accueilChannel) {
        const thread = await accueilChannel.threads.create({
            name: `${member.displayName}`,
            autoArchiveDuration: 1440,
            type: ChannelType.PrivateThread
        });

        await thread.members.add(member.id);


        await thread.send(
            `## ${member.displayName}, bienvenue sur **VALORANT PP** <:Roles:1471219666473980065>\n\n` +
            `Pour débloquer l'accès, configure ton profil :` +
            `> 1. Choisis ton **PEAK rank 2025**\n` +
            `> 2. Renomme toi par ton pseudo In-game\n` +
            `> 3. Et essaie de survivre`
        );


        const rankMenu = new StringSelectMenuBuilder()
            .setCustomId('rank_select')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([ { label: 'Radiant', value: 'Radiant', emoji: { id: '1461399011712958703' } }, { label: 'Immortal 3', value: 'Immortal3', emoji: { id: '1461399034165068063' } }, { label: 'Immortal 2', value: 'Immortal2', emoji: { id: '1461399056449274171' } }, { label: 'Immortal 1', value: 'Immortal1', emoji: { id: '1461399078616170516' } }, { label: 'Ascendant 3', value: 'Ascendant3', emoji: { id: '1461399102116856001' } }, { label: 'Ascendant 2', value: 'Ascendant2', emoji: { id: '1461399120240574586' } }, { label: 'Ascendant 1', value: 'Ascendant1', emoji: { id: '1461399137076379648' } }, { label: 'Diamond 3', value: 'Diamond3', emoji: { id: '1461399154805964963' } }, { label: 'Diamond 2', value: 'Diamond2', emoji: { id: '1461399171838902292' } }, { label: 'Diamond 1', value: 'Diamond1', emoji: { id: '1461399187362152480' } }, { label: 'Platinum 3', value: 'Platinum3', emoji: { id: '1461399203065368619' } }, { label: 'Platinum 2', value: 'Platinum2', emoji: { id: '1461399220035784928' } }, { label: 'Platinum 1', value: 'Platinum1', emoji: { id: '1461399234778501345' } }, { label: 'Gold 3', value: 'Gold3', emoji: { id: '1461399252814135338' } }, { label: 'Gold 2', value: 'Gold2', emoji: { id: '1461399269151084604' } }, { label: 'Gold 1', value: 'Gold1', emoji: { id: '1461399285429043251' } }, { label: 'Silver 3', value: 'Silver3', emoji: { id: '1461399305993846785' } }, { label: 'Silver 2', value: 'Silver2', emoji: { id: '1461399321642532874' } }, { label: 'Silver 1', value: 'Silver1', emoji: { id: '1461399338965270538' } }, { label: 'Bronze 3', value: 'Bronze3', emoji: { id: '1461399355465666722' } }, { label: 'Bronze 2', value: 'Bronze2', emoji: { id: '1461399372779749457' } }, { label: 'Bronze 1', value: 'Bronze1', emoji: { id: '1461399395605024972' } }, { label: 'Iron 3', value: 'Iron3', emoji: { id: '1461399413619429472' } }, { label: 'Iron 2', value: 'Iron2', emoji: { id: '1461399435924865127' } }, { label: 'Iron 1', value: 'Iron1', emoji: { id: '1461399458246955195' } } ]);

        await thread.send({ components: [new ActionRowBuilder().addComponents(rankMenu)] });


        const riotButton = new ButtonBuilder()
            .setCustomId('verify_riot')
            .setLabel('┃Me renommer')
            .setEmoji({ id: '1466470349351686194' })
            .setStyle(ButtonStyle.Success);

        await thread.send({ content: ' ', components: [new ActionRowBuilder().addComponents(riotButton)] });
    }
    } catch (err) {
  console.error('Erreur thread bienvenue :', err);
}

    // =======================
    // EMBED DE BIENVENUE PUBLIC
    // =======================
const guild = member.guild;

// Récupérer les invites en cache
const cachedInvites = invitesCache.get(guild.id) || new Map();

// Récupérer les invites actuelles
const guildInvites = await guild.invites.fetch();
const newInvites = new Map();

// Transformer en map par code pour comparer
guildInvites.forEach(inv => {
  newInvites.set(inv.code, {
    code: inv.code,
    inviter: inv.inviter || null,
    uses: inv.uses,
    maxAge: inv.maxAge,
    temporary: inv.temporary
  });
});

// Trouver l'invite utilisée
let usedInvite;
for (const [code, invite] of newInvites.entries()) {
  const oldUses = cachedInvites.get(code)?.uses || 0;
  if (invite.uses > oldUses) {
    usedInvite = invite;
    break;
  }
}

// Mettre à jour le cache
invitesCache.set(guild.id, newInvites);

// ✅ Moyen d'invitation
let inviterTag = '.gg/valorant-pp';
if (usedInvite?.inviter) {
  inviterTag = usedInvite.inviter.tag;
}

// ✅ Ancienneté du compte
const memberJoinDate = member.user.createdAt;
const accountAge = Math.floor((Date.now() - memberJoinDate) / (1000 * 60 * 60 * 24)); // en jours


const welcomeChannel = guild.channels.cache.get(WELCOME_CHANNEL_ID);
if (!welcomeChannel) return;

const embed = new EmbedBuilder()
  .setColor(0x4f6183)
  .setDescription(
    `## <:Roles:1471219666473980065> BIENVENUE SUR VALORANT PP\n\n` +
    `### <#1474562499897594071> pour participer à la prochaine !\n` +
    `> ${member}\n` +
    `> Invité par **${inviterTag}**\n` +
    `> Sur Discord depuis **${accountAge} jours**`
  )
  .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 128 }))
  .setTimestamp();

await welcomeChannel.send({ embeds: [embed] });

if (usedInvite) {
  const inviterId = usedInvite.inviter?.id;
  if (inviterId) {
    if (!invitesData[inviterId]) invitesData[inviterId] = { invites: 0, members: [] };
invitesData[inviterId].invites += 1;
invitesData[inviterId].members.push(member.id);
persistInvites();
  }
}
});

client.on('guildMemberRemove', async member => {


  const leaveMockeries = [
  "a quitté OOHHH GNOOOOOOOOOOOOOON.",
  "a quitté GNOOOOOOOOOOOOOOOOON.",
  "a quitté GNOOOOOOOOOON YUKIIIIIII.",
  "a quitté ALLOOOOOOOOOOOOOO LES GARS GNOOOOOOOOON.",
  "a quitté GNOOOOOOOOOOOOOOOOOON.",
  "a quitté GNOOOOOOOOOOOOOOOOOOOOOOON.",
  "a quitté. J'avooooooouuuuuuuuuuuuuuuuuuuue",
  "est parti, et c'est OK",
  "a leave notre doux serveur.",
  "a mangé son carry",
  "a prit son carry",
  "AHAHAH ! regardez-moi ce looser",
  "est parti oh gnoooooooooooooooon yuki les gaaaars",
  "le gros bébé cadum",
  "s'est envolé, on souhaite TOUS une bonne continuation",
  "Parfois la retraite est la meilleure option.",
  "s'est échappé avant de passer dans #clipfarming",
  "a pris la fuite",
  "utilise l'attaque Fuite",
  "utilise Téléport.",
  "a fui le combat.",
  "utilise Anti-Brume et disparait.",
  "utilise Vol.",
  "a quitté la zone.",
  "a quitté le quartier.",
  "a quitté le tieks.",
  "a quitté le tiéquar.",
  "a quitté le cité.",
  "a disparu wesh.",
  "a prit la porte",
  "a été renvoyé",
  "a tout whippin",
  "a tout cassé son bureau",
  "a explosé son PC",
  "est tellement vener qu'il a fait un trou dans le mur",
  "est dégouté...",
  "a perdu le combat.\nVous gagnez **1200 ₽**.",
  "a pris un coup critique",
  "a utilisé Brume et a disparu.",
  "a pris la fuite. Le combat est terminé.",
  "s’est enfui. +999XP.",
  "a quitté le serveur.",
  "a déconnecté.",
  "a quitté ce monde.",
  "a quitté la partie prématurément.",
  "est déjà parti. La découverte fut brève.",
  "a abandonné la mission.",
  "a quitté la session.",
  "a abandonné la quête.",
  "a quitté la guilde.",
  "a quitté le clan.",
  "s'est fait diff",
  "est un imposteur",
  "est un thug life",
  "est mega aigri les gars",
  "s'est fait labubu",
  "ne veux plus jouer de PP avec nous.....",
  "est parti bouder dans son coin frérot",
  "eh va dormir ya zebi",
  "est cringe",
  "est parti, est-ce que c'est bon pour vous",
  "a quitté. Raison : Serveur trop exigent",
  "a quitté. Raison : Serveur trop competitif",
  "a quitté. Raison : Trop de troll",
  "a quitté. Raison : Serveur trop sérieux",
  "a quitté. Raison : Serveur non-sérieux wala",
  "a quitté. Raison : Pas assez de trolling",
  "a quitté. Raison : Serveur pas assez intelligent",
  "a quitté. Raison : Serveur trop doux",
  "a quitté. Raison : Serveur pas assez drôle",
  "est parti, et c'est ciaooooooOOOOAHAHAHHAHAHAHHAHAHA",
  "a quitté. Serveur trop beau et trop intelligent pour lui baby.",
  "saiu. Servidor bonito demais, do brasile, saudeeeeee ninguem me fode.",
  "est trop bas QI pour le serv...",
  "nous souhaite tout le malheur du monde.",
  "adios amigos hastas prontos pequenitos espagnolitos",
  "à plus l'ancien",
  "est parti manger une pizza au kebab",
  "au revoir mon sucre",
  "au revoir mon loup",
  "n'a pas assez de mental",
  "s'est prit un pressing, carrément il est parti",
  "s'est stratégiquement barré.",
  "est parti, j'espère vraiement que le serveur survivra à cette perte...",
  "a tiré sa révérence.",
  "est parti, fin de l'aventure.",
  "a quitté la scène.",
  "HJIhoiuopJ.PH?ouhg _799 okhhhk;...bIO GNOOOOOOOON",
  "EST PARTI?! QUOI???????",
  "est discrètement parti."
];

function getRandomLeaveMockery() {
  return leaveMockeries[Math.floor(Math.random() * leaveMockeries.length)];
}


  try {
    const leaveChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!leaveChannel) return;

    const leaveEmbed = new EmbedBuilder()
      .setColor(0xd05855)
      .setDescription(
         `## <:Roles:1471219666473980065> DÉPART DU SERVEUR\n\n` +
        `> **${member.user.tag}** (<@${member.id}>) ${getRandomLeaveMockery()}\n`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 128 }))
      .setTimestamp();

    await leaveChannel.send({ embeds: [leaveEmbed] });
  } catch (err) {
    console.error('Erreur lors de l\'embed de départ :', err);
  }
});















client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!tracker')) return;

   // ✅ Autoriser uniquement dans ce salon
if (message.channel.id !== '1474064338431250482') {

  // Supprime le message !tracker
  await message.delete().catch(() => {});

  // Envoie un message temporaire
  const warning = await message.channel.send(
    `❌ ${message.author}, cette commande est disponible uniquement dans <#1474064338431250482>.`
  );

  // Supprime le message après 5 secondes
  setTimeout(() => {
    warning.delete().catch(() => {});
  }, 5000);

  return;
}


  const args = message.content.split(' ');
  const target =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[1]) ||
    message.member;

  await sendStatsEmbed(message, target);
});
async function sendStatsEmbed(message, member) {

// Total d'invites par membre
const totalInvitesPerMember = {};
for (const inviterId in invitesData) {
  totalInvitesPerMember[inviterId] = invitesData[inviterId].invites || 0;
}

  // 🔹 Stats
  const stats = pointsData[member.id] || { rr: 0, games: 0, wins: 0 };
  const winrate = stats.games ? ((stats.wins / stats.games) * 100).toFixed(1) : 0;

  // 🔹 Emoji de rank
  const rankName = member.roles.cache.find(r => rankEmojis[r.name])?.name;
  const rankEmoji = rankName ? rankEmojis[rankName] : '<:Unranked:1465744234182086789>';

  // 🔹 Classement RR
  const sorted = Object.entries(pointsData).sort((a, b) => b[1].rr - a[1].rr);
  const index = sorted.findIndex(([id]) => id === member.id);
  const position = index !== -1 ? index + 1 : '0';

  // Top inviter global
let topInviterId = null;
let maxInvites = -1;
for (const [id, invites] of Object.entries(totalInvitesPerMember)) {
  if (invites > maxInvites) {
    maxInvites = invites;
    topInviterId = id;
  }
}

const memberInvites = totalInvitesPerMember[member.id] || 0;

  // 🔹 Badges (à droite du pseudo)
  const badgeTop1=position===1?BADGES.TOP1:'';
  const badgeTopInviter=member.id===topInviterId&&maxInvites>0?BADGES.TOP_INVITER:'';

  // 🔹 Ligne badges
  let badgesLine='';
  if (badgeTop1||badgeTopInviter) {
    badgesLine=`${badgeTop1}${badgeTop1&&badgeTopInviter?'':''}${badgeTopInviter}`;
  } else {
    badgesLine='<:VIDE:1465704930160410847>';
  }

  // 🔹 Largeur titres égale
  const formatName = (text) => `**${text.padEnd(10, ' ')}**`;


  // 🔹 Embed
  const embed = new EmbedBuilder()
    .setColor(0x242429)
    .setDescription(`## **${member.displayName}** ${rankEmoji}${badgesLine}`)
    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472593223984877592/Design_sans_titre_14.png?ex=699322d0&is=6991d150&hm=d1110919ea1d1d88d72ec25f1f8756b33036adb76cb48ced58595b3de0a700ab&')
    .addFields(
      { name: formatName('ᴘᴏꜱɪᴛɪᴏɴ'), value: position !== '<:POINTS:1472667834881409181> ' ? `<:POINTS:1472667834881409181> #${position}` : `<:POINTS:1472667834881409181> `, inline: true },
      { name: formatName('ᴘᴏɪɴᴛꜱ'), value: `<:Performance:1472667816468418631> ${stats.rr} ʀʀ`, inline: true },
      { name: formatName('ɪɴᴠɪᴛᴇꜱ'), value: `<:INVITES:1472667823875559708> ${memberInvites}`, inline: true },
      { name: formatName('ᴘᴀʀᴛɪᴇꜱ'), value: `<:PARTIES:1472667851239456935> ${stats.games}`, inline: true },
      { name: formatName('ᴠɪᴄᴛᴏɪʀᴇꜱ'), value: `<:VICTOIRES:1472667857405087897> ${stats.wins}`, inline: true },
      { name: formatName('ᴡɪɴʀᴀᴛᴇ'), value: `<:Performance:1472667816468418631> ${winrate}%`, inline: true }  );


  await message.reply({ embeds: [embed] });
}







process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});






client.login(process.env.TOKEN);