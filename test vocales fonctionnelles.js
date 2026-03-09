require('dotenv').config();
const fs = require('fs');
const path = require('path'); // ← mettre path avant son utilisation

const gamesFile = path.join(__dirname, 'data', 'games.json');
let gamesData = JSON.parse(fs.readFileSync(gamesFile, 'utf8'));


// 📁 Créer le dossier data s'il n'existe pas
if (!fs.existsSync('./riotData.json')) {
  fs.writeFileSync('./riotData.json', '{}');
}

const welcomedPath = path.join(__dirname, 'welcomed.json');

function loadWelcomed() {
  if (!fs.existsSync(welcomedPath)) return {};
  try {
    const raw = fs.readFileSync(welcomedPath, 'utf-8');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }


}

async function updateGameEmbed(game, guild) {
  const channel = guild.channels.cache.get(game.waitingVC);
  if (!channel) return;

  const members = channel.members.map(m => `<@${m.id}>`).join('\n') || 'Aucun joueur';
  const registrationMsg = await channel.messages.fetch(game.id).catch(() => null);
  if (!registrationMsg) return;

  const embed = registrationMsg.embeds[0];
  if (!embed) return;

  const newEmbed = {
    ...embed.toJSON(),
    fields: [
      {
        name: 'Joueurs inscrits',
        value: members,
        inline: false
      }
    ]
  };

  await registrationMsg.edit({ embeds: [newEmbed] }).catch(() => {});
}

// Boucle qui met à jour toutes les secondes
setInterval(() => {
  for (const game of gamesData.games) {
    const guild = client.guilds.cache.get(game.guildId);
    if (guild) updateGameEmbed(game, guild);
  }
}, 1000);


function saveWelcomed(data) {
    fs.writeFileSync(welcomedPath, JSON.stringify(data, null, 2));
}

const ROLE_VERIFIE = '1461354176931041312';
const WELCOME_CHANNEL_ID = '1474066060528451743';

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Dossier data créé automatiquement');
}

const invitesFile = path.join(__dirname, 'data', 'invites.json');
if (!fs.existsSync(invitesFile)) fs.writeFileSync(invitesFile, JSON.stringify({}, null, 2));
const invitesCache = new Map();
const gameLocks = {};
const loadInvites = () => JSON.parse(fs.readFileSync(invitesFile, 'utf8'));
const saveInvites = (data) => fs.writeFileSync(invitesFile, JSON.stringify(data, null, 2));
const BADGES = {
  TOP1: '<:TopLeaderboard:1465709888729776296>',
  TOP_INVITER: '<:TopInviter:1465747415670984862>'
  
};
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
const maps = require('./config/maps');
const maplive = require('./config/maplive');
const rankEmojis = require('./config/ranks');
const ACCUEIL_CHANNEL_ID = '1171488314524713000';

const ROLE_NOTIF_PP = '1468458885357502599';
const rankValues = {
  'Radiant': 25, 
  'Immortal3': 24, 'Immortal2': 23, 'Immortal1': 22,
  'Ascendant3': 21, 'Ascendant2': 20, 'Ascendant1': 19,
  'Diamond3': 18, 'Diamond2': 17, 'Diamond1': 16,
  'Platinum3': 15, 'Platinum2': 14, 'Platinum1': 13,
  'Gold3': 12, 'Gold2': 11, 'Gold1': 10,
  'Silver3': 9, 'Silver2': 8, 'Silver1': 7,
  'Bronze3': 6, 'Bronze2': 5, 'Bronze1': 4,
  'Iron3': 3, 'Iron2': 2, 'Iron1': 1
};

const reportHandler = require('./handlers/reportHandler');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences, // 👈 OBLIGATOIRE
    GatewayIntentBits.MessageContent
  ],
});

// ===== Storage =====
const pointsFile = path.join(__dirname, 'data', 'points.json');
const top15File = path.join(__dirname, 'data', 'top15.json');
if (!fs.existsSync(gamesFile)) fs.writeFileSync(gamesFile, JSON.stringify({ games: [] }, null, 2));
if (!fs.existsSync(pointsFile)) fs.writeFileSync(pointsFile, JSON.stringify({}, null, 2));
if (!fs.existsSync(top15File)) fs.writeFileSync(top15File, JSON.stringify({}, null, 2));
const loadGames = () => JSON.parse(fs.readFileSync(gamesFile, 'utf8'));
const saveGames = (data) => fs.writeFileSync(gamesFile, JSON.stringify(data, null, 2));
const loadPoints = () => JSON.parse(fs.readFileSync(pointsFile, 'utf8'));
const savePoints = (data) => fs.writeFileSync(pointsFile, JSON.stringify(data, null, 2));
const loadTop15 = () => JSON.parse(fs.readFileSync(top15File, 'utf8'));
const saveTop15 = (data) => fs.writeFileSync(top15File, JSON.stringify(data, null, 2));

// ===== Slash Commands =====
const commands = [
  { name: 'pp', description: 'Créer une partie personnalisée' },
  { name: 'report', description: 'Ouvrir l\'embed report', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'top15', description: 'Créer l\'embed TOP 15', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'regles', description: 'Afficher l\'embed des règles', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'invites', description: 'Afficher le top des invitations', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'vocal', description: 'Créer un panneau de vocaux personnalisés', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'manage', description: 'Gérer les RR d\'un joueur', default_member_permissions: PermissionFlagsBits.Administrator.toString(), options: [{name: 'joueur', description: 'Le joueur à gérer', type: 6, required: true}]}
];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('✅ Slash commands enregistrées'))
  .catch(console.error);

// ===== Ready event + CADRE CONSOLE =====
client.once('clientReady', async () => {
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

  // Update automatique toutes les 20 minutes
  setInterval(async () => {
    try {
      await updateTop15Embed();
      console.log(`${colors.red}🔄 Leaderboard mis à jour automatiquement toutes les 2H${colors.reset}`);
    } catch (err) {
      console.error('❌ Erreur leaderboard :', err);
    }
  }, 120 * 60 * 1000);
});









// ===== Helpers =====
async function buildPlayerList(interaction, playerIds) {
  if (!playerIds.length) return 'En attente de joueurs...';
  const list = [];
  for (const id of playerIds) {
    let member;
    try { member = await interaction.guild.members.fetch(id); } catch { member = null; }
    const emoji = member ? rankEmojis[member.roles.cache.find(r => rankEmojis[r.name])?.name] || '' : '';
    list.push({ id, mention: `<@${id}>`, emoji, member });
  }
  const sorted = list.sort((a,b) => {
    const rankA = a.member ? rankValues[a.member.roles.cache.find(r => rankValues[r.name])?.name] ?? -1000 : -1000;
    const rankB = b.member ? rankValues[b.member.roles.cache.find(r => rankValues[r.name])?.name] ?? -1000 : -1000;
    return rankB - rankA;
  });
  return sorted.map(x => `- ${x.emoji} ${x.mention}`).join('\n') || 'En attente de joueurs...';
}














async function updateTop15Embed() {  
  const pointsData = loadPoints(); // ton points.json
  const topData = loadTop15(); // messageId + channelId
  const invitesData = loadInvites();

  if (!topData.messageId || !topData.channelId) return;
  const channel = await client.channels.fetch(topData.channelId).catch(() => null);
  if (!channel) return;
  const msg = await channel.messages.fetch(topData.messageId).catch(() => null);
  if (!msg) return console.log('❌ Message leaderboard introuvable');

  // Calculer le total d'invites pour chaque membre depuis invites.json
const totalInvitesPerMember = {};
for (const inviterId in invitesData) {
  const inviter = invitesData[inviterId];
  totalInvitesPerMember[inviterId] = inviter.invites || 0; // On prend directement le total d’invites
}

  // Top 15 trié par RR
  const sorted = Object.entries(pointsData)
    .sort((a, b) => b[1].rr - a[1].rr)
    .slice(0, 10);

  if (!sorted.length) {
    const emptyEmbed = new EmbedBuilder()
      .setTitle("ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ")
      .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472293135437529159/3.png?ex=69920b55&is=6990b9d5&hm=8202e2bd395ddb64d47464154b3a02d174f83c942a633b448a54672d04288666&')
      .setDescription("*Calcul en cours...*")
      .setColor(0x242429);
    await msg.edit({ embeds: [emptyEmbed] }).catch(() => {});
    return;
  }

  const maxRR = sorted[0][1].rr || 1;
  const barLength = 25;

  // Trouver le top inviter parmi le top 15
  let topInviterId = null;
  let maxInvites = -1;
  for (const [id, invites] of Object.entries(totalInvitesPerMember)) {
    if (invites > maxInvites) {
      maxInvites = invites;
      topInviterId = id;
    }
  }

  // Présentation LEADERBOARD
  const lines = await Promise.all(sorted.map(async ([id, data], idx) => {
    const rawBars = (data.rr / maxRR) * barLength;
    const filledBars = Math.max(0, Math.min(barLength, Math.round(rawBars)));
    const bar = "▰".repeat(filledBars) + "▱".repeat(barLength - filledBars);
    const games = data.games || 0;
    const wins = data.wins || 0;
    const winrate = data.games ? (data.wins / data.games * 100).toFixed(1) : 0;
    const invites = totalInvitesPerMember[id] || 0;

    let rankEmoji = '';
    const member = await client.guilds.cache.get(process.env.GUILD_ID)?.members.fetch(id).catch(() => null);
    if (member) {
      const rankName = member.roles.cache.find(r => rankEmojis[r.name])?.name;
      if (rankName) rankEmoji = rankEmojis[rankName] + ' ';
    }

    // Ajouter badges TOP1 / TOP_INVITER
    let badges = '';
    if (idx === 0) badges += BADGES.TOP1;
    if (id === topInviterId) badges += BADGES.TOP_INVITER;

    return `\n> **#${idx + 1}**   <@${id}> ${rankEmoji} ${badges}` +
           `\n> ${bar}` +
           `\n> *${data.rr} ʀʀ  &  ${invites} invites*`;
  }));

  const embed = new EmbedBuilder()
    .setTitle("ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ")
    .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472293135437529159/3.png?ex=69920b55&is=6990b9d5&hm=8202e2bd395ddb64d47464154b3a02d174f83c942a633b448a54672d04288666&')
    .setDescription(lines.join("\n") || "*Calcul en cours...*")
    .setColor(0x242429);

  await msg.edit({ embeds: [embed] }).catch(() => {});
}

















// ===== Interaction Handler =====
client.on('interactionCreate', async interaction => {
  const gamesData = loadGames();



  // ── Move member to VC même si full
async function moveVerifiedToVC(member, vc) {
  if (!member || !vc) return;
  const originalLimit = vc.userLimit;
  try {
    if (vc.members.size >= vc.userLimit) await vc.edit({ userLimit: vc.members.size + 1 });
    await member.voice.setChannel(vc).catch(() => {});
  } finally {
    if (vc.editable) await vc.edit({ userLimit: originalLimit }).catch(() => {});
  }
}








if (interaction.commandName === 'pp') {
  const moderatorRole = interaction.guild.roles.cache.find(
    r => r.name === 'Organisateur de parties'
  );
  if (!moderatorRole || !interaction.member.roles.cache.has(moderatorRole.id)) {
    return interaction.reply({
      content: '⛔ Seuls les **Modérateurs PP** peuvent créer une partie.',
      ephemeral: true
    });
  }
  const modal = {
    title: 'Créer une partie personnalisée',
    custom_id: 'pp_create_modal',
    components: [
      {
        type: 1,
        components: [{
          type: 4,
          custom_id: 'valorant_code',
          label: 'Code de groupe Valorant',
          style: 1,
          required: true,
          min_length: 6,
          max_length: 6
        }]
      }
    ]
  };
  return interaction.showModal(modal);
}






  if (
  interaction.isModalSubmit() &&
  interaction.customId === 'pp_create_modal'
) {
  await interaction.deferReply({ ephemeral: true });
  const valorantCode = interaction.fields.getTextInputValue('valorant_code');
  const verifiedRole = interaction.guild.roles.cache.find(
    r => r.name === 'Vérifié'
  );
  if (!verifiedRole) {
    return interaction.editReply("⚠️ Le rôle Vérifié n\'existe pas.");
  }
  const category = await interaction.guild.channels.create({
  name: 'ᴘᴀʀᴛɪᴇ ᴇɴ ᴄᴏᴜʀꜱ',
  type: 4, // catégorie
  permissionOverwrites: [
    {
      id: interaction.guild.id,
      allow: [PermissionsBitField.Flags.ViewChannel], // tout le monde peut voir
      deny: [PermissionsBitField.Flags.Connect] // mais pas connecter aux vocaux
    }
  ]
});
  const map = maps[Math.floor(Math.random() * maps.length)];
  const embed = new EmbedBuilder()
    .setTitle('PARTIE CRÉÉE  '+map.name)
    .setDescription('*10 places restantes*\n*En attente de joueurs...*')
    .setImage(map.image)
    .setColor(0x242429)
    .setFooter({
    iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 32 }),  
    text: `Organisée par ${interaction.user.displayName}`
});
const row = new ActionRowBuilder().addComponents(
  // new ButtonBuilder().setCustomId('join').setLabel('Rejoindre').setStyle(ButtonStyle.Secondary),
  // new ButtonBuilder().setCustomId('leave').setLabel('Quitter').setStyle(ButtonStyle.Secondary),
  new ButtonBuilder().setCustomId('change_map').setLabel('Map rotation').setStyle(ButtonStyle.Secondary),
  new ButtonBuilder().setCustomId('start').setLabel('Lancer').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('cancel_registration').setLabel('Annuler').setStyle(ButtonStyle.Primary)
);
  const moderatorRole = interaction.guild.roles.cache.find(r => r.name === 'Organisateur de parties');
const waitingVC = await interaction.guild.channels.create({
  name: '┃préparation',
  type: 2,
  parent: category.id,
  userLimit: 10,
  permissionOverwrites: [
    { id: interaction.guild.id, allow: ['ViewChannel'], deny: ['Connect'] },
    { id: verifiedRole.id, allow: ['ViewChannel', 'Connect'] },
    ...(moderatorRole ? [{ id: moderatorRole.id, allow: ['Connect', 'MoveMembers'] }] : [])
  ]
});
const msg = await interaction.channel.send({
  embeds: [embed],
  components: [row]
});

// 🔹 Ici, juste après l'envoi du message, tu ajoutes la partie dans ton data
gamesData.games.push({
  id: msg.id,               // ID du message embed
  players: [],              // liste vide au départ
  map: map.name,
  waitingVC: waitingVC.id,  // ID du vocal préparation
  categoryId: category.id,
  valorantCode,             // code Valorant saisi dans le modal
  changeMapVotes: []        // votes pour changer la map
});

saveGames(gamesData);
  return interaction.editReply('✅ Partie créée.');
}




  // ── Gestion du select menu Observer ──
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith('spectate_select_')) {
  const gameId = interaction.customId.replace('spectate_select_', '');
  const game = gamesData.games.find(g => g.id === gameId);
  if (!game) return interaction.reply({ content: 'Cette partie n\'existe plus.', ephemeral: true });
  const choice = interaction.values[0]; // attack ou defense
  const vcId = choice === 'attack' ? game.attVC : game.defVC;
  const vc = interaction.guild.channels.cache.get(vcId);
  if (!vc) return interaction.reply({ content: '❌ VC introuvable.', ephemeral: true });
  await moveVerifiedToVC(interaction.member, vc);
  if (!game.spectators) game.spectators = {};
  game.spectators[interaction.user.id] = choice;
  saveGames(gamesData);
  return interaction.update({ 
    content: `Tu observes les ${choice === 'attack' ? 'attaquants' : 'défenseurs'} !`,
    components: []
  });
}






  const game = gamesData.games.find(
  g => g.id === interaction.message.id || g.betMessageId === interaction.message.id
);

  // --- Bouton change_map doit passer même si game n'est pas complet
  if (interaction.customId === 'change_map') {
  if (!game) return interaction.reply({ content: "Cette partie n\'existe plus.", ephemeral: true });
  if (!game.players.includes(interaction.user.id))
    return interaction.reply({ content: '❌ Seuls les joueurs inscrits peuvent voter pour changer la map.', ephemeral: true });
  if (!game.changeMapVotes.includes(interaction.user.id))
    game.changeMapVotes.push(interaction.user.id);
  const votes = game.changeMapVotes.length;
  const total = game.players.length;

  // S'assurer qu'on a un embed existant
  const oldEmbed = interaction.message.embeds[0] || new EmbedBuilder().setTitle('PARTIE CRÉÉE  '+game.map);
  const list = await buildPlayerList(interaction, game.players);
  const embed = EmbedBuilder.from(oldEmbed)
    .setTitle('PARTIE CRÉÉE  '+game.map)
    .setDescription(`*${10-game.players.length} places restantes*\n*${votes}/6 votes pour changer la map*\n${list}`)
    ;
  if (votes >= 6) {
    let newMap;
    do {
      newMap = maps[Math.floor(Math.random() * maps.length)];
    } while (newMap.name === game.map);
    game.map = newMap.name;
    game.changeMapVotes = [];
    embed.setTitle('PARTIE CRÉÉE  '+newMap.name)
      .setDescription(`*${10-game.players.length} places restantes*\n*0/6 votes pour changer la map*\n${list}`)
      .setImage(newMap.image || null)
      ;
  }
  saveGames(gamesData);
  return interaction.update({ embeds: [embed] });
}

  // --- Vérification game pour les autres boutons
  if (!game) return interaction.reply({ content: "Cette partie n\'existe plus.", ephemeral: true });
  const moderatorRole = interaction.guild.roles.cache.find(r => r.name === 'Organisateur de parties');

  // Vérification accès modérateur pour certains boutons
  const moderatorButtons = ['start', 'cancel_registration', 'attack_win', 'defense_win', 'cancel_game'];
  if (moderatorButtons.includes(interaction.customId)) {
    if (!moderatorRole || !interaction.member.roles.cache.has(moderatorRole.id)) {
      return interaction.reply({ content: '⛔ Seuls les Modérateurs PP peuvent utiliser ce bouton.', ephemeral: true });
    }
  }
  switch(interaction.customId) {


case 'cancel_registration': {
  const category = interaction.guild.channels.cache.get(game.categoryId);
  const waitingVC = interaction.guild.channels.cache.get(game.waitingVC);
  const lobbyVC = waitingVC; // la salle d'attente

  // 🔹 Déplacer tous les joueurs dans la salle d'attente
  if (game.players?.length) {
    await Promise.all(game.players.map(async playerId => {
      const member = await interaction.guild.members.fetch(playerId).catch(() => null);
      if (member?.voice && lobbyVC) await member.voice.setChannel(lobbyVC).catch(() => {});
    }));
  }

  // 🔹 Déplacer les spectateurs également
  if (game.spectators) {
    await Promise.all(Object.keys(game.spectators).map(async spectatorId => {
      const member = await interaction.guild.members.fetch(spectatorId).catch(() => null);
      if (member?.voice && lobbyVC) await member.voice.setChannel(lobbyVC).catch(() => {});
    }));
  }

  // 🔹 Supprimer tous les channels liés à la partie
  [game.attVC, game.defVC, game.waitingVC, game.categoryId].forEach(async id => {
    const ch = interaction.guild.channels.cache.get(id);
    if (ch) await ch.delete().catch(()=>{});
  });

  // 🔹 Supprimer le message d'inscription
  const registrationMsg = await interaction.channel.messages.fetch(game.id).catch(() => null);
  if (registrationMsg) await registrationMsg.delete().catch(() => {});

  // 🔹 Retirer la partie du stockage
  gamesData.games = gamesData.games.filter(g => g.id !== game.id);
  saveGames(gamesData);

  // 🔹 Réponse safe à l'interaction
  try {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '❌ Partie annulée et joueurs/spectateurs renvoyés en salle d\'attente.',
        ephemeral: true
      });
    } else {
      await interaction.followUp({
        content: '❌ Partie annulée et joueurs/spectateurs renvoyés en salle d\'attente.',
        ephemeral: true
      });
    }
  } catch (err) {
    console.log('Impossible de répondre à l’interaction cancel:', err.message);
  }

  if (gameLocks[game.id]) delete gameLocks[game.id];
  break;
}







case 'start': {

  const verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Vérifié');
  if (!verifiedRole)
    return interaction.reply({ content: '⚠️ Rôle Vérifié introuvable.', ephemeral: true });

  if (!game.players.length)
    return interaction.reply({ content: "Aucun joueur inscrit.", ephemeral: true });

  await interaction.deferReply(); // 🔥 évite bug interaction déjà répondue

  // ─────────────── ÉQUILIBRAGE DES ÉQUIPES (INTOUCHÉ) ───────────────

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
    '1114187578866933790': 83, '1114182691550658650': 62, '1461352160850870427': 55,
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

  // ─────────────── LOGS (INTOUCHÉS) ───────────────

  const attSum = balanced.attackers.reduce((sum, p) => sum + p.rankValue, 0);
  const defSum = balanced.defenders.reduce((sum, p) => sum + p.rankValue, 0);

  console.log(`┌─────────────────────────────┐`);
  console.log(`│ ÉQUIPE ATTAQUANTS : ${attSum.toString().padStart(3)} │`);
  console.log(`│ ÉQUIPE DÉFENSEURS : ${defSum.toString().padStart(3)} │`);
  console.log(`│ DIFFÉRENCE : ${Math.abs(attSum - defSum).toString().padStart(3)} │`);
  console.log(`└─────────────────────────────┘`);

  // ─────────────── SUPPRESSION SALON PRÉPARATION ───────────────

  const prepVC = interaction.guild.channels.cache.get(game.waitingVC);
  if (prepVC) await prepVC.delete().catch(() => {});

  // ─────────────── SUPPRESSION MESSAGE INSCRIPTION ───────────────

  if (game.messageId) {
    const channel = interaction.channel;
    const msg = await channel.messages.fetch(game.messageId).catch(() => null);
    if (msg) await msg.delete().catch(() => {});
  }

  // ─────────────── CRÉATION VOCAUX (NOMS INCHANGÉS) ───────────────

  const everyoneRole = interaction.guild.roles.everyone;
  const category = interaction.guild.channels.cache.get(game.categoryId);

  for (const name of ['┃attaquants','┃défenseurs']) {
    const oldVC = interaction.guild.channels.cache.find(c => c.name === name);
    if (oldVC) await oldVC.delete().catch(()=>{});
  }

  const attVC = await interaction.guild.channels.create({
    name:'┃attaquants',
    type:2,
    parent:category?.id,
    userLimit:5,
    permissionOverwrites:[
      {id:everyoneRole.id, deny:['Connect']},
      ...game.attackers.map(p=>({id:p.id, allow:['Connect','ViewChannel','Speak']}))
    ]
  });

  const defVC = await interaction.guild.channels.create({
    name:'┃défenseurs',
    type:2,
    parent:category?.id,
    userLimit:5,
    permissionOverwrites:[
      {id:everyoneRole.id, deny:['Connect']},
      ...game.defenders.map(p=>({id:p.id, allow:['Connect','ViewChannel','Speak']}))
    ]
  });

  game.attVC = attVC.id;
  game.defVC = defVC.id;

  saveGames(loadGames());

  // ─────────────── DÉPLACEMENT JOUEURS ───────────────

  for (const p of game.attackers)
    if (p.member?.voice?.channel)
      await p.member.voice.setChannel(attVC).catch(()=>{});

  for (const p of game.defenders)
    if (p.member?.voice?.channel)
      await p.member.voice.setChannel(defVC).catch(()=>{});

  // ─────────────── EMBED PARTIE EN COURS ───────────────

  const attackersText =
    game.attackers.map(p =>
      `${rankEmojis[p.member?.roles.cache.find(r=>rankEmojis[r.name])?.name]||''} <@${p.id}>`
    ).join('\n') || 'Aucun';

  const defendersText =
    game.defenders.map(p =>
      `${rankEmojis[p.member?.roles.cache.find(r=>rankEmojis[r.name])?.name]||''} <@${p.id}>`
    ).join('\n') || 'Aucun';

  const gameEmbed = new EmbedBuilder()
    .setTitle(`PARTIE EN COURS  ${game.map}`)
    .addFields(
      {name:'<:VIDE:1465704930160410847>  ᴀᴛᴛᴀǫᴜᴀɴᴛs',value:attackersText,inline:true},
      {name:'<:VIDE:1465704930160410847>  ᴅᴇꜰᴇɴsᴇᴜʀs',value:defendersText,inline:true}
    )
    .setColor(0x242429)
    .setFooter({
      iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 32 }),
      text: `Lancée par ${interaction.user.displayName}`
    });

  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId('spectate').setLabel('Spectate').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('attack_win').setLabel('⚔️ Attaquants').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('defense_win').setLabel('🛡️ Défenseurs').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('cancel_game').setLabel('❌ Annuler').setStyle(ButtonStyle.Danger)
    );

  await interaction.editReply({
    embeds:[gameEmbed],
    components:[buttons]
  });

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
    .setCustomId(`spectate_select_${game.id}`) // ← ajouter l'ID de la game ici
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
  const waitingVC = interaction.guild.channels.cache.get('1464444777306132703');
  if (!waitingVC) return;

  // 🔹 SUPPRIMER L'ANCIEN EMBED "Spectate disponible"
  const timerMsgId = game.betMessageId || game.manageMessageId;
  if (timerMsgId) {
    const timerMsg = await interaction.channel.messages.fetch(timerMsgId).catch(() => null);
    if (timerMsg?.deletable) await timerMsg.delete().catch(() => {});
  }
  const pointsData = loadPoints();
  const moveMembersToVC = async (ids, vc) => {
    for (const id of ids) {
      const member = await interaction.guild.members.fetch(id).catch(() => null);
      if (member?.voice?.channel) {
        await member.voice.setChannel(vc).catch(() => {});
      }
    }
  };
const attackers = game.attackers.map(p => p.id);
const defenders = game.defenders.map(p => p.id);
const allPlayers = [...attackers, ...defenders];

  // 🔒 Sécurité : seuls les joueurs peuvent valider la fin (sauf cancel)
  if (
  interaction.customId !== 'cancel_game' &&
  !allPlayers.includes(interaction.user.id)
) {
  return;
}

  // ───────────────── CANCEL GAME ─────────────────
  if (interaction.customId === 'cancel_game') {

    // 🔹 Déplacer joueurs + spectateurs
    await moveMembersToVC(allPlayers, waitingVC);
    if (game.spectators) {
      await moveMembersToVC(Object.keys(game.spectators), waitingVC);
    }

    // 🔹 Cleanup channels
    for (const id of [game.attVC, game.defVC, game.categoryId]) {
      const ch = interaction.guild.channels.cache.get(id);
      if (ch) await ch.delete().catch(() => {});
    }

    // 🔥 Supprimer le message "PARTIE EN COURS"
const gameMsgId = game.manageMessageId || game.betMessageId;
const gameMsg = await interaction.channel.messages
  .fetch(gameMsgId)
  .catch(() => null);
if (gameMsg?.deletable) {
  await gameMsg.delete().catch(() => {});
}
game.betMessageId = null;
game.manageMessageId = null;
    gamesData.games = gamesData.games.filter(g => g.id !== game.id);
    saveGames(gamesData);
    if (gameLocks[game.id]) delete gameLocks[game.id];
  return; // ⬅️ OBLIGATOIRE
}

  // ───────────────── FIN DE PARTIE ─────────────────
  const winningSide = interaction.customId === 'attack_win' ? 'attack' : 'defense';
  const matchRR = {}; // RR du match uniquement (pour l\'embed)

  // 🔹 Points PARTIE
  for (const playerId of allPlayers) {
    if (!pointsData[playerId]) {
      pointsData[playerId] = { rr: 0, games: 0, wins: 0};
    }
    const isWinner =
      (winningSide === 'attack' && attackers.includes(playerId)) ||
      (winningSide === 'defense' && defenders.includes(playerId));
    const delta = isWinner ? 30 : -15;
    pointsData[playerId].rr += delta;
    
    // 🔒 Protection contre les RR négatifs (minimum 0)
    if (pointsData[playerId].rr < 0) {
      pointsData[playerId].rr = 0;
    }
    
    matchRR[playerId] = delta;
    pointsData[playerId].games += 1;
    if (isWinner) pointsData[playerId].wins += 1;
}


// 2️⃣ Sauvegarde les points **avant** les embeds
savePoints(pointsData);

// 4️⃣ Puis mets à jour le leaderboard
await updateTop15Embed();

  // 🔹 Déplacer joueurs + spectateurs
  await moveMembersToVC(allPlayers, waitingVC);
  if (game.spectators) {
    await moveMembersToVC(Object.keys(game.spectators), waitingVC);
  }
  gamesData.games = gamesData.games.filter(g => g.id !== game.id);
  saveGames(gamesData);
  for (const id of [game.attVC, game.defVC, game.categoryId]) {
    const ch = interaction.guild.channels.cache.get(id);
    if (ch) await ch.delete().catch(() => {});
  }

  // 🔹 Embed FINAL (RR du match uniquement)
  const formatPlayers = async (ids) => {
    const arr = [];
    for (const id of ids) {
      const member = await interaction.guild.members.fetch(id).catch(() => null);
      const emoji = rankEmojis[
        member?.roles.cache.find(r => rankEmojis[r.name])?.name
      ] || '';
      const rr = matchRR[id] > 0 ? `+${matchRR[id]}ʀʀ` : `${matchRR[id]}ʀʀ`;
      arr.push(`${emoji} <@${id}>  **${rr}**`);
    }
    return arr.join('\n');
  };
  const mapObj = maplive.find(m => m.name === game.map);
if (!mapObj) {
  console.log('Map non trouvée !');
  return;
}
const embed = new EmbedBuilder()
  .setTitle(`PARTIE TERMINÉE  ${game.map}`)
  .addFields(
    {
      name: '<:VIDE:1465704930160410847>  ᴀᴛᴛᴀǫᴜᴀɴᴛs',
      value: await formatPlayers(attackers),
      inline: true,
    },
    {
      name: '<:VIDE:1465704930160410847>  ᴅᴇꜰᴇɴsᴇᴜʀs',
      value: await formatPlayers(defenders),
      inline: true,
    }
  )
  .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472310195278577775/4210_x_45_px_8000_x_40_px.png?ex=69921b38&is=6990c9b8&hm=09b4673c59eedb6f5944f388d84e6a7a77421dbc9ae97a6c47fe56ed21359202')
  .setColor(0x242429)
  .setFooter({
    iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 32 }),  
    text: `Validée par ${interaction.user.displayName}`
  });

// 🔹 Envoi sécurisé
await interaction.channel.send({ embeds: [embed] }).catch(console.error);


if (gameLocks[game.id]) delete gameLocks[game.id];
break;

}}









    if (interaction.commandName === 'vocal') {
  const embed = new EmbedBuilder()
  	.setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472278091505336320/Design_sans_titre_12.png?ex=6991fd52&is=6990abd2&hm=dffdb1ec6091d2c48214f62277dfea503810656773296813b1062c12c53ecbc5&')
    .setFooter({ text:'ᴄʀᴇᴇʀ ᴛᴏɴ ꜱᴀʟᴏɴ ᴠᴏᴄᴀʟ ᴘᴇʀꜱᴏɴɴᴀʟɪꜱᴀʙʟᴇ, ᴄᴇʟᴜɪ-ᴄɪ ᴅɪꜱᴘᴀʀᴀɪᴛʀᴀ ᴜɴᴇ ꜰᴏɪꜱ ᴠɪᴅᴇ. ʀᴀɴᴋᴇᴅ, ᴡᴀᴛᴄʜᴘᴀʀᴛʏ ᴠᴄᴛ, ᴄᴏᴀᴄʜɪɴɢ, ᴄᴏ-ᴏᴘ ꜱᴜʀ ᴜɴ ᴀᴜᴛʀᴇ ᴊᴇᴜ, ꜱᴛʀᴇᴀᴍ ᴍᴀᴛᴄʜ ᴅᴇ ꜰᴏᴏᴛ, ɴɪɢʜᴛ ᴛᴀʟᴋꜱ, ʀᴇᴀᴄᴛ, ᴀᴜᴄᴜɴᴇ ʟɪᴍɪᴛᴇ, ᴄᴇᴛᴛᴇ ᴘᴀʀᴛɪᴇ ᴠᴏᴜꜱ ᴇꜱᴛ ᴅᴇᴅɪᴇᴇ !'})
    .setColor(0x242429);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_vocal')
      .setLabel('┃Créer mon vocal')
      .setEmoji({ id: '1466608491861901362' })
      .setStyle(ButtonStyle.Secondary)
  );
  await interaction.channel.send({ embeds: [embed], components: [row] });
  return interaction.reply({ content: '✅ Panneau vocal créé', ephemeral: true });
}






    if (interaction.commandName === 'manage') {
  const targetUser = interaction.options.getUser('joueur');
  const pointsData = loadPoints();
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

  const accueilChannel = interaction.guild.channels.cache.get(ACCUEIL_CHANNEL_ID);

  // --------------------------------------
  // MENU RANK
  // --------------------------------------
if (interaction.isStringSelectMenu() && interaction.customId === 'rank_select') {
    if (interaction.replied || interaction.deferred) return;

    const temp = await interaction.reply({ content: 'Mise à jour du rank…', fetchReply: true });

    if (accueilChannel && accueilChannel.isThread()) await accueilChannel.sendTyping();
    await new Promise(r => setTimeout(r, 250));

    // Supprimer anciens rôles
    for (const roleId of Object.values(RANK_ROLES)) {
      if (interaction.member.roles.cache.has(roleId)) await interaction.member.roles.remove(roleId);
    }

    const selectedRank = interaction.values[0];
    const roleIdToAdd = RANK_ROLES[selectedRank];

    // Ajouter le rôle sélectionné
    await interaction.member.roles.add(roleIdToAdd);

    // Récupérer l'objet rôle pour la mention
    const role = interaction.guild.roles.cache.get(roleIdToAdd);

    const rankEmbed = new EmbedBuilder()
      .setColor(0x242429)
      .setDescription(
        `### Ton peak rank 2025 a été défini sur ${role ? `<@&${role.id}>` : '**' + selectedRank + '**'}`
      )
      .setFooter({ text: 'Si ton peak rank évolue au fil du temps, contacte-nous.' });

    await interaction.editReply({ content: null, embeds: [rankEmbed] });
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
  const data = JSON.parse(fs.readFileSync('./riotData.json'));
  data[interaction.user.id] = { pseudo };
  fs.writeFileSync('./riotData.json', JSON.stringify(data, null, 2));

  // 🏷️ Changement de pseudo
  await interaction.member.setNickname(pseudo).catch(() => {});

  // ⏳ Réponse immédiate
  await interaction.reply({ content: 'Vérification en cours…' });

  const thread = interaction.channel;

  if (thread.isThread()) await thread.sendTyping();
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
if (thread.isThread()) {

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













    if(interaction.commandName==='report'){
      const embed = new EmbedBuilder()
        .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472278091505336320/Design_sans_titre_12.png?ex=6991fd52&is=6990abd2&hm=dffdb1ec6091d2c48214f62277dfea503810656773296813b1062c12c53ecbc5&')
        .setFooter({ text: 'ꜱɪɢɴᴀʟᴇʀ ᴜɴ ᴘʀᴏʙʟᴇᴍᴇ ᴏᴜ ᴜɴ ᴄᴏᴍᴘᴏʀᴛᴇᴍᴇɴᴛ, ᴘᴏꜱᴛᴜʟᴇʀ ᴇɴ ᴛᴀɴᴛ ǫᴜ\'ᴏʀɢᴀɴɪꜱᴀᴛᴇᴜʀ ᴅᴇ ᴘᴀʀᴛɪᴇꜱ, ʀᴇᴛɪʀᴇʀ ʟᴇꜱ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴꜱ, ᴅᴇᴍᴀɴᴅᴇʀ ᴜɴᴇ ʀᴇɢᴜᴀʟɪʀꜱᴀᴛɪᴏɴ ᴀᴜ ɴɪᴠᴇᴀᴜ ᴅᴜ ᴄʟᴀꜱꜱᴇᴍᴇɴᴛ, ᴄʜᴀɴɢᴇʀ ᴅᴇ ʀᴀɴɢ ᴏᴜ ᴅᴇ ᴘꜱᴇᴜᴅᴏ, ᴘʀᴏᴘᴏꜱᴇʀ ᴜɴᴇ ᴀᴍᴇʟɪᴏʀᴀᴛɪᴏɴ...'})
        .setColor(0x242429); // couleur uniforme
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket').setLabel('┃Ouvrir un ticket').setStyle(ButtonStyle.Secondary).setEmoji({ id: '1466470349351686194' })
      );
      await interaction.channel.send({ embeds:[embed], components:[row] });
      return interaction.reply({ content:'✅ Embed envoyé', ephemeral:true });
}








    if(interaction.commandName==='top15'){
      await interaction.deferReply({ ephemeral: true });
      const embed = new EmbedBuilder()
        .setTitle("ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ")
        .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472293135437529159/3.png?ex=69920b55&is=6990b9d5&hm=8202e2bd395ddb64d47464154b3a02d174f83c942a633b448a54672d04288666&')
        .setDescription("*Calcul en cours...*")
        .setColor(0x242429);
      const msg = await interaction.channel.send({ embeds:[embed] });
      saveTop15({ messageId: msg.id, channelId: interaction.channel.id });
      return interaction.editReply({ content: "✅ TOP15 créé dans ce salon", ephemeral: true });
}







    if (interaction.commandName === 'regles') {
  const embed = new EmbedBuilder()
  .setDescription(
    '### ***RÈGLES DU SERVEUR***\n' +
    '- <:Automate:1466470349351686194>      **Faux peak rank** / **AFK**   →   **BAN**\n' +
    '- <:Armes:1466470377327825028>      Aucune limite d\'armes\n' +
    '- <:TopInviterCashprize:1465709888729776296>      Cashprize mensuel pour le **TOP 1   Leaderboard**\n' +
    '- <:TopLeaderboardCashprize:1465747415670984862>      Cashprize mensuel pour le **TOP 1   Invitations**\n' +
    '- <:Performance:1466957289813442721>      Pour afficher votre classement   →   `!tracker`\n' +
    '\n' +
    '### ***COMMENT JOUER ?***\n' +
    '- <:VC:1466608491861901362>** ┃salle d\'attente**\n' +
    '- <:Annonce:1472840875708252192>** ┃jouer**\n' +
    '>   <:ENTRY2:1466591986382278831> *Nouvelle partie créée*\n' +
    '>   <:ENTRY2:1466591986382278831> *Inscription manuelle*\n' +  
    '>   <:ENTRY:1466591997874929876> *Redirection auto*\n' +
    '> <:VIDE:1465704930160410847>\n' +
    '- <:VC:1466608491861901362>** ┃préparation**\n' +
    '>   <:ENTRY2:1466591986382278831> *Code de groupe*\n' +
    '>   <:ENTRY2:1466591986382278831> *Équilibrage intelligent*\n' +
    '>   <:ENTRY:1466591997874929876> *Redirection auto*\n' +
    '> <:VIDE:1465704930160410847>\n' +
    '- <:VC:1466608491861901362>** ┃attaquants**\n' +
    '- <:VC:1466608491861901362>** ┃défenseurs**\n' +
    '>   <:ENTRY2:1466591986382278831> *Résultats*\n' +
    '>   <:ENTRY2:1466591986382278831> *Mise à jour du classement*\n' +
    '>   <:ENTRY:1466591997874929876> *Redirection auto*\n' +
    '> <:VIDE:1465704930160410847>\n' +
    '- <:VC:1466608491861901362>** ┃salle d\'attente**\n' +
    '<:VIDE:1465704930160410847>\n' +
    '\n'
  )
  .setColor(0x242429)
  .setImage('https://cdn.discordapp.com/attachments/1461761854563942400/1472298885828575476/5.png?ex=699210b0&is=6990bf30&hm=154bedcadfe650e1ce6ac21ec90b1a0933fb13e5a37c7f77d2207ea3808387e6&');
  await interaction.channel.send({ embeds: [embed] });
  return interaction.reply({ content: '✅ Règles envoyées', ephemeral: true });
}











  // ===== Buttons =====
  if (interaction.isButton()) {
// ── Gestion des boutons MANAGE ──
if (interaction.customId.startsWith('manage_')) {
  const [action, type, userId] = interaction.customId.split('_');
  const pointsData = loadPoints();
  
  if (type === 'reset') {
    // Reset complet
    pointsData[userId] = { rr: 0, games: 0, wins: 0 };
    savePoints(pointsData);
    await updateTop15Embed();
    
    return interaction.update({
      content: `✅ Statistiques de <@${userId}> réinitialisées.`,
      embeds: [],
      components: []
    });
  }

  if (type === 'add' || type === 'remove') {
    // Demander le montant via modal
    const modal = {
      title: type === 'add' ? 'Ajouter des RR' : 'Retirer des RR',
      custom_id: `manage_modal_${type}_${userId}`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'rr_amount',
              label: 'Montant de RR',
              style: 1,
              required: true,
              placeholder: 'Exemple: 50',
              min_length: 1,
              max_length: 4
            }
          ]
        }
      ]
    };
    return interaction.showModal(modal);
  }
}











if (interaction.isButton() && interaction.customId === 'create_vocal') {
    // 🔹 Créer le modal pour demander nom et limite du vocal
    const modal = {
        title: 'Créer ton salon vocal',
        custom_id: 'create_vocal_modal',
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: 'vocal_name',
                        label: 'Nom du salon',
                        style: 1, // courte réponse
                        required: true,
                        max_length: 32,
                        value: `${interaction.user.displayName}` // préremplissage
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: 'vocal_limit',
                        label: 'Limite de places (0 = illimité)',
                        style: 1,
                        required: false, // facultatif
                        max_length: 2,
                        value: '' // vide par défaut = illimité
                    }
                ]
            }
        ]
    };

    return interaction.showModal(modal);
}












if (interaction.isButton() && interaction.customId === 'open_ticket') {
  // 🎫 Ouvrir un modal pour choisir la raison du ticket
  const modal = {
    title: 'Ouvrir un ticket',
    custom_id: 'ticket_reason_modal',
    components: [
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: 'ticket_reason',
            label: 'Raison de ta demande',
            style: 2, // Paragraphe
            required: true,
            placeholder: 'Signalement, Candidature PP, Problème RR, Question, Suggestion...',
            min_length: 5,
            max_length: 50
          }
        ]
      }
    ]
  };
  
  return interaction.showModal(modal);
}











const ADMIN_ROLE_ID = '1467889225973240016'; // ← Remplace par l'ID du rôle titualire et développeur

// ── Fermeture de ticket ──
if (interaction.isButton() && interaction.customId === 'close_ticket') {
  // Vérifie que l'utilisateur a le rôle admin
  if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
    return interaction.reply({
      content: '❌ Seul un administrateur peut fermer ce ticket.',
      ephemeral: true
    });
  }

  const channel = interaction.channel;

  // Vérifie que c'est bien un ticket
  if (!channel.name.startsWith('┃ticket-')) {
    return interaction.reply({
      content: '❌ Cette commande ne fonctionne que dans un ticket.',
      ephemeral: true
    });
  }

  await interaction.reply({
    content: '<:Automate:1466470349351686194> Fermeture du ticket...',
    ephemeral: false
  });

  setTimeout(async () => {
    try {
      await channel.delete();
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket:', error);
    }
  }, 1000);

  return; // Empêche le code de continuer
}
}

// ── Gestion du modal TICKET REASON ──
if (interaction.isModalSubmit() && interaction.customId === 'ticket_reason_modal') {
  await interaction.deferReply({ ephemeral: true });

  const guild = interaction.guild;
  const member = interaction.member;
  const reason = interaction.fields.getTextInputValue('ticket_reason');

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

  // Vérifier si l'utilisateur a déjà un ticket ouvert
  const existingTicket = guild.channels.cache.find(
    ch => ch.name === `┃ticket-${member.user.username.toLowerCase()}` && ch.parentId === ticketCategoryId
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
    name: `┃ticket-${reason}`,
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
        id: staffRole.id, // Le Administrateur
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

  // Embed de bienvenue dans le ticket avec la raison
  const ticketEmbed = new EmbedBuilder()
    .setDescription(
      `- Motif : **${reason}**\n` +
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
  
  const pointsData = loadPoints();
  if (!pointsData[userId]) {
    pointsData[userId] = { rr: 0, games: 0, wins: 0 };
  }
  
  if (type === 'add') {
    pointsData[userId].rr += amount;
  } else if (type === 'remove') {
    pointsData[userId].rr -= amount;
    // 🔒 Protection contre les RR négatifs
    if (pointsData[userId].rr < 0) {
      pointsData[userId].rr = 0;
    }
  }
  
  savePoints(pointsData);
  await updateTop15Embed();
  
  const actionText = type === 'add' ? 'ajouté' : 'retiré';
  return interaction.reply({
    content: `✅ ${amount} ʀʀ ${actionText} pour <@${userId}>. Nouveau total : **${pointsData[userId].rr} ʀʀ**`,
    ephemeral: true
  });
}















if (interaction.isModalSubmit() && interaction.customId === 'create_vocal_modal') {
    const name = interaction.fields.getTextInputValue('vocal_name') || `${interaction.user.nickname}`;
    const limitInput = interaction.fields.getTextInputValue('vocal_limit');
    const limit = limitInput ? parseInt(limitInput, 10) : 0; // 0 = illimité

    const verifiedRoleId = '1461354176931041312'; // rôle Vérifié
    const everyoneRoleId = interaction.guild.id; // @everyone

    // Créer le salon vocal
    const channel = await interaction.guild.channels.create({
        name: name,
        type: 2, // Vocal
        parent: '1462477754208616750',
        userLimit: limit === 0 ? undefined : limit,
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
                ]
            },
            {
                id: interaction.user.id, // créateur du salon
                allow: [
                    PermissionsBitField.Flags.ManageChannels
                ]
            }
        ]
    });

    await interaction.reply({ content: `Salon vocal créé : ${channel}`, ephemeral: true });
}

  if(interaction.isModalSubmit() && interaction.customId==='report_modal'){
    return reportHandler.handleModal(interaction);
  }
});













const CATEGORY_ID = '1462477754208616750'; // catégorie des vocaux à gérer
const EXCEPT_CHANNEL_ID = '1476254900777259169'; // salon à exclure

client.on('voiceStateUpdate', async (oldState, newState) => {
  const gamesData = loadGames();

  // Chercher si la personne rejoint un VC lié à une partie
  const game = gamesData.games.find(g => g.waitingVC === newState.channelId);
  if (!game) return;

  // 🔹 Ajouter le joueur s'il n'est pas déjà dans la liste
  if (newState.channelId && !game.players.includes(newState.member.id)) {
    game.players.push(newState.member.id);
    saveGames(gamesData);
  }

  // 🔹 Retirer le joueur si il quitte le VC préparation
  if (oldState.channelId === game.waitingVC && oldState.channelId !== newState.channelId) {
    game.players = game.players.filter(id => id !== oldState.member.id);
    saveGames(gamesData);
  }

  // 🔹 Mettre à jour l’embed de la partie si le message existe
  const msg = await newState.guild.channels.cache.get(newState.channel?.guild.systemChannelId || newState.guild.id)
    ?.messages.fetch(game.id).catch(() => null);
  if (msg) {
    const oldEmbed = msg.embeds[0] || new EmbedBuilder().setTitle('PARTIE CRÉÉE  '+game.map);
    const list = await buildPlayerList(null, game.players); // ta fonction pour lister les joueurs
    const embed = EmbedBuilder.from(oldEmbed)
      .setDescription(`*${10 - game.players.length} places restantes*\n*En attente de joueurs...*\n${list}`);
    msg.edit({ embeds: [embed] }).catch(() => {});
  }






  if (!oldState.channelId) return;

  const channel = oldState.channel;

  // Vérifie que le salon est dans la catégorie qu'on gère
  if (channel.parentId !== CATEGORY_ID) return;

  // Exception : on ignore ce salon précis
  if (channel.id === EXCEPT_CHANNEL_ID) return;

  // Vérifie que c'est un salon vocal et qu'il est vide
  if (channel.type === 2 && channel.members.size === 0) {
    try {
      await channel.delete();
      console.log(`Salon vocal supprimé : ${channel.name}`);
    } catch (err) {
      console.error('Erreur lors de la suppression du salon vocal :', err);
    }
  }
});

















client.on('guildMemberAdd', async member => {
    console.log(`Nouveau membre détecté : ${member.displayName}`);

    // =======================
    // THREAD BIENVENUE PRIVÉ
    // =======================
    const accueilChannel = member.guild.channels.cache.get(ACCUEIL_CHANNEL_ID);
    if (accueilChannel) {
        const thread = await accueilChannel.threads.create({
            name: `${member.displayName}`,
            autoArchiveDuration: 1440,
            type: ChannelType.PrivateThread
        });

        await thread.members.add(member.id);

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await thread.sendTyping();
        await sleep(2000);

        await thread.send(
            `${member.displayName}, bienvenue sur **VALORANT PP** <:Roles:1471219666473980065>\n\n` +
            `Avant tout, pour débloquer l'accès au serveur complet, configure ton profil :`
        );

        await thread.sendTyping();
        await sleep(500);

        const rankMenu = new StringSelectMenuBuilder()
            .setCustomId('rank_select')
            .setPlaceholder('Sélectionne ton PEAK rank de 2025')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([ { label: 'Radiant', value: 'Radiant', emoji: { id: '1461399011712958703' } }, { label: 'Immortal 3', value: 'Immortal3', emoji: { id: '1461399034165068063' } }, { label: 'Immortal 2', value: 'Immortal2', emoji: { id: '1461399056449274171' } }, { label: 'Immortal 1', value: 'Immortal1', emoji: { id: '1461399078616170516' } }, { label: 'Ascendant 3', value: 'Ascendant3', emoji: { id: '1461399102116856001' } }, { label: 'Ascendant 2', value: 'Ascendant2', emoji: { id: '1461399120240574586' } }, { label: 'Ascendant 1', value: 'Ascendant1', emoji: { id: '1461399137076379648' } }, { label: 'Diamond 3', value: 'Diamond3', emoji: { id: '1461399154805964963' } }, { label: 'Diamond 2', value: 'Diamond2', emoji: { id: '1461399171838902292' } }, { label: 'Diamond 1', value: 'Diamond1', emoji: { id: '1461399187362152480' } }, { label: 'Platinum 3', value: 'Platinum3', emoji: { id: '1461399203065368619' } }, { label: 'Platinum 2', value: 'Platinum2', emoji: { id: '1461399220035784928' } }, { label: 'Platinum 1', value: 'Platinum1', emoji: { id: '1461399234778501345' } }, { label: 'Gold 3', value: 'Gold3', emoji: { id: '1461399252814135338' } }, { label: 'Gold 2', value: 'Gold2', emoji: { id: '1461399269151084604' } }, { label: 'Gold 1', value: 'Gold1', emoji: { id: '1461399285429043251' } }, { label: 'Silver 3', value: 'Silver3', emoji: { id: '1461399305993846785' } }, { label: 'Silver 2', value: 'Silver2', emoji: { id: '1461399321642532874' } }, { label: 'Silver 1', value: 'Silver1', emoji: { id: '1461399338965270538' } }, { label: 'Bronze 3', value: 'Bronze3', emoji: { id: '1461399355465666722' } }, { label: 'Bronze 2', value: 'Bronze2', emoji: { id: '1461399372779749457' } }, { label: 'Bronze 1', value: 'Bronze1', emoji: { id: '1461399395605024972' } }, { label: 'Iron 3', value: 'Iron3', emoji: { id: '1461399413619429472' } }, { label: 'Iron 2', value: 'Iron2', emoji: { id: '1461399435924865127' } }, { label: 'Iron 1', value: 'Iron1', emoji: { id: '1461399458246955195' } } ]);

        await thread.send({ components: [new ActionRowBuilder().addComponents(rankMenu)] });

        await thread.sendTyping();
        await sleep(500);

        const riotButton = new ButtonBuilder()
            .setCustomId('verify_riot')
            .setLabel('┃Accéder au serveur complet')
            .setEmoji({ id: '1466470349351686194' })
            .setStyle(ButtonStyle.Success);

        await thread.send({ content: ' ', components: [new ActionRowBuilder().addComponents(riotButton)] });
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
  .setColor(0x242429)
  .setDescription(
    `## <:Roles:1471219666473980065> BIENVENUE SUR VALORANT PP\n\n` +
    `### <#1464444777306132703> pour participer à la prochaine !\n` +
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
    const invitesData = loadInvites();
    if (!invitesData[inviterId]) invitesData[inviterId] = { invites: 0, members: [] };
    invitesData[inviterId].invites += 1;
    invitesData[inviterId].members.push(member.id);
    saveInvites(invitesData);
  }
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
  const pointsData = loadPoints();
  const invitesData = loadInvites();

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
  const rankEmoji = rankName ? rankEmojis[rankName] : '❔';

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


client.login(process.env.TOKEN);