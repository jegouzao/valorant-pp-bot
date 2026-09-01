require('dotenv').config();
const fs = require('fs');
const path = require('path'); // ← mettre path avant son utilisation

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });




const Points = require('./models/Points');
const Invite = require('./models/Invite');
const RiotUser = require('./models/RiotUser');
const Moderation = require('./models/Moderation');
const Config = require('./models/Config');
const Game = require('./models/Game');

const maps = require('./config/maps');

const mongoose = require('mongoose');

async function initMongo() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connecté');
}



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


const TEST_MODE = true;


const { 
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  REST,
  Routes,
  PermissionFlagsBits,
  PermissionsBitField,
  StringSelectMenuBuilder,

  // Components V2
  ContainerBuilder,
  TextDisplayBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  SectionBuilder,
  ThumbnailBuilder,


  Events,
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
  'Iron 1': '<:Iron_1:1461399458246955195>',};
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


    const RANK_UP_ORDER = [
  'Iron1',
  'Iron2',
  'Iron3',
  'Bronze1',
  'Bronze2',
  'Bronze3',
  'Silver1',
  'Silver2',
  'Silver3',
  'Gold1',
  'Gold2',
  'Gold3',
  'Platinum1',
  'Platinum2',
  'Platinum3',
  'Diamond1',
  'Diamond2',
  'Diamond3',
  'Ascendant1',
  'Ascendant2',
  'Ascendant3',
  'Immortal1',
  'Immortal2',
  'Immortal3',
  'Radiant'
];

const RANK_LABELS = {
  Iron1: 'Iron 1',
  Iron2: 'Iron 2',
  Iron3: 'Iron 3',
  Bronze1: 'Bronze 1',
  Bronze2: 'Bronze 2',
  Bronze3: 'Bronze 3',
  Silver1: 'Silver 1',
  Silver2: 'Silver 2',
  Silver3: 'Silver 3',
  Gold1: 'Gold 1',
  Gold2: 'Gold 2',
  Gold3: 'Gold 3',
  Platinum1: 'Platinum 1',
  Platinum2: 'Platinum 2',
  Platinum3: 'Platinum 3',
  Diamond1: 'Diamond 1',
  Diamond2: 'Diamond 2',
  Diamond3: 'Diamond 3',
  Ascendant1: 'Ascendant 1',
  Ascendant2: 'Ascendant 2',
  Ascendant3: 'Ascendant 3',
  Immortal1: 'Immortal 1',
  Immortal2: 'Immortal 2',
  Immortal3: 'Immortal 3',
  Radiant: 'Radiant'
};

function getMemberRankKey(member) {
  return Object.entries(RANK_ROLES).find(
    ([, roleId]) => member.roles.cache.has(roleId)
  )?.[0] || null;
}


const RANK_ORDER = {
  'Radiant': 1, 
  'Immortal 3': 2, 'Immortal 2': 3, 'Immortal 1': 4,
  'Ascendant 3': 5, 'Ascendant 2': 6, 'Ascendant 1': 7,
  'Diamond 3': 8, 'Diamond 2': 9, 'Diamond 1': 10,
  'Platinum 3': 11, 'Platinum 2': 12, 'Platinum 1': 13,
  'Gold 3': 14, 'Gold 2': 15, 'Gold 1': 16,
  'Silver 3': 17, 'Silver 2': 18, 'Silver 1': 19,
  'Bronze 3': 20, 'Bronze 2': 21, 'Bronze 1': 22,
  'Iron 3': 23, 'Iron 2': 24, 'Iron 1': 25};
  

function getRankEmojiFromMember(member) {
  if (!member) return rankEmojis.Unranked || '';

  const rankKey = Object.entries(RANK_ROLES).find(
    ([, roleId]) => member.roles.cache.has(roleId)
  )?.[0];

  if (!rankKey) {
    return rankEmojis.Unranked || '';
  }

  const emojiKey = rankKey.replace(/([A-Za-z]+)(\d)$/, '$1 $2');

  return rankEmojis[emojiKey] || '';
}

const MIN_ACCOUNT_AGE_DAYS = 30;

const CLIPFARMING_CHANNEL_ID = '1473461253681971425';

const spamMap = new Map();

const spamStrikeMap = new Map();

const SPAM_INTERVAL = 5000; // 5 secondes



const STRIKE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h


const SERVER_TAG_ROLE_ID = '1497390571051024615'; // rôle donné quand le membre porte ton tag serveur
const SERVER_TAG_GUILD_ID = process.env.GUILD_ID;

let saveTimeouts = new Map();

function getActiveStrike(strikeMap, userId, now = Date.now()) {
  const data = strikeMap.get(userId);

  if (!data) {
    return 0;
  }

  if ((now - data.lastStrikeAt) > STRIKE_WINDOW_MS) {
    strikeMap.delete(userId);
    return 0;
  }

  return data.count;
}

function addStrike(strikeMap, userId, now = Date.now()) {
  const current = getActiveStrike(strikeMap, userId, now);

  strikeMap.set(userId, {
    count: current + 1,
    lastStrikeAt: now
  });
}

function getSpamPenalty(strike) {
  if (strike >= 2) {
    return {
      limit: 4,
      durationMs: 60 * 60 * 1000,
      label: '1 heure'
    };
  }

  if (strike === 1) {
    return {
      limit: 5,
      durationMs: 5 * 60 * 1000,
      label: '5 minutes'
    };
  }

  return {
    limit: 7,
    durationMs: 60 * 1000,
    label: '1 minute'
  };
}


function saveGameDebounced(game) {
  if (saveTimeouts.has(game.id)) {
    clearTimeout(saveTimeouts.get(game.id));
  }

  const timeout = setTimeout(async () => {
    try {
      await saveGame(game);
    } catch (err) {
      console.error('Erreur saveGameDebounced :', err);
    } finally {
      saveTimeouts.delete(game.id);
    }
  }, 300);

  saveTimeouts.set(game.id, timeout);
}

function extractUrls(content = '') {
  return content.match(/https?:\/\/[^\s]+/gi) || [];
}



function isGifUrl(url = '') {
  const u = url.toLowerCase();

  return (
    // Fichier GIF direct
    u.endsWith('.gif') ||
    u.includes('.gif?') ||
    u.includes('.gif#') ||

    // Tenor
    u.includes('tenor.com') ||
    u.includes('media.tenor.com') ||

    // Giphy
    u.includes('giphy.com') ||
    u.includes('media.giphy.com') ||

    // Klipy
    u.includes('klipy.com/gif/') ||
    u.includes('klipy.com/gifs/') ||

    // Autres URLs explicitement orientées GIF
    u.includes('/gif/') ||
    u.includes('/gifs/')
  );
}


function messageContainsBlockedGif(message) {
  const urls = extractUrls(message.content);
  const attachments = [...message.attachments.values()];

  const gifInText = urls.some(url => isGifUrl(url));

  const gifInAttachments = attachments.some(att => {
    const name = (att.name || '').toLowerCase();
    const contentType = (att.contentType || '').toLowerCase();
    const url = (att.url || '').toLowerCase();

    return (
      name.endsWith('.gif') ||
      contentType.includes('gif') ||
      isGifUrl(url)
    );
  });

  return gifInText || gifInAttachments;
}





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
  if (!playerIds.length) return '-# ᴀᴜᴄᴜɴ';

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

    const container = buildAnnounceContainer({
  waitingVCId: game.waitingVC,
  mode: '5v5',
  code: game.valorantCode,
  organisateur: creatorDisplayName,
  remaining,
  votes,
  needed,
  playersText,
  mapName: game.mapName,
  mapImage: game.mapImage,
  footerIcon:
    game.creatorAvatar ||
    guild.iconURL({ dynamic: true, size: 32 })
});

const row = new ActionRowBuilder().addComponents(

  new ButtonBuilder()
    .setCustomId('join_game')
    .setLabel('Rejoindre la partie')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('change_map')
    .setLabel('Changer la map')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('start')
    .setLabel('Équilibrer les équipes')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('cancel_registration')
    .setLabel('Annuler')
    .setStyle(ButtonStyle.Secondary)
);

container.addActionRowComponents(row);

await registrationMsg.edit({
  components: [container]
});

  } catch (err) {
    if (err.code !== 10008) console.error('Erreur update embed PARTIE CRÉÉE:', err);
  }
}



const COMMUNITY_CATEGORY_ID = '1462477754208616750';
const ROLE_VERIFIE = '1461354176931041312';
const AUTO_CREATE_VC_ID = '1479547523201896490'; // ← mets ici l'id du vocal "créer"
const TEMP_VOCAL_CATEGORY_ID = '1479549016466395217';
const WELCOME_CHANNEL_ID = '1474066060528451743';

const ACTIVITIES_CHANNEL_ID = WELCOME_CHANNEL_ID;


async function sendActivityMessage(guild, payload) {
  const channel =
    guild.channels.cache.get(ACTIVITIES_CHANNEL_ID) ||
    await guild.channels.fetch(ACTIVITIES_CHANNEL_ID).catch(() => null);

  if (!channel) return null;
  return channel.send(payload).catch(() => null);
}

// ✅ Salons vocaux à ne jamais supprimer automatiquement
const EXEMPT_VC_IDS = [
  '1479551340635095270',
  '1479547523201896490', // ✅ salon "créer" à ne jamais supprimer
  '1488654880385007729', // ✅ salon fixe à ne jamais supprimer
];


const invitesCache = new Map();
const autoCreateLocks = new Map();
const gameLocks = {};
const BADGES = {
  TOP1: '<:TopLeaderboard:1465709888729776296>',
  TOP_INVITER: '<:TopInviter:1465747415670984862>',

  OG: '<:OG:1544365215565619360>',
  ORGANIZER: '<:Roles:1493046347337699499>',
  WINNER: '<:Vainqueur:1544365369253171282>',

  SERVER_TAG: '<:tag:1497390943928586300>',
  BOOSTER: '<:Bonus20:1492125876437913641>'
};

const ACCUEIL_CHANNEL_ID = '1171488314524713000';

const ROLE_NOTIF_PP = '1468458885357502599';
const BOT_OWNER_ID = '1471602146964406365';
const ORGANIZER_ROLE_ID = '1461348856100028439';
const OG_ROLE_ID = '1544361324556062812';
const WINNER_ROLE_ID = '1544361311067045928';
const BOOSTER_ROLE_ID = '1134168535866806314';

const RR_VALUES = {
  WIN: 30,
  WIN_TAG: 33,
  WIN_BOOSTER: 36,
  LOSS: -15,
};

const PARALLELOGRAM_FULL = '<:plein:1544373192469123163>';
const PARALLELOGRAM_EMPTY = '<:vide:1544373488725393489>';

const RR_EMOJIS = {
  WIN_30: '<:rr_plus_30:1493259044893360200>',
  RR_GREEN: '<:rr_green:1493259054804369408>',

  WIN_33: '<:33_gold:1497395187415126127>',
  RR_GOLD: '<:rr_gold:1497395194289455114>',

  WIN_36: '<:36_rose:1497395169224556686>',
  RR_ROSE: '<:rr_rose:1497395178045050992>',

  LOSS_15: '<:rr_minus_15:1493259005584343080>',
  RR_RED: '<:rr_red:1493259016686538932>',
};

function getPlayerRRDelta(member, isWinner) {
  if (!isWinner) return RR_VALUES.LOSS;

  const isBooster = member?.roles?.cache?.has(BOOSTER_ROLE_ID);
  if (isBooster) return RR_VALUES.WIN_BOOSTER;

  const hasServerTag = member?.roles?.cache?.has(SERVER_TAG_ROLE_ID);
  if (hasServerTag) return RR_VALUES.WIN_TAG;

  return RR_VALUES.WIN;
}

function formatRRDeltaEmoji(delta) {
  if (delta === RR_VALUES.WIN_BOOSTER) {
    return ` ${RR_EMOJIS.WIN_36}${RR_EMOJIS.RR_ROSE}`;
  }

  if (delta === RR_VALUES.WIN_TAG) {
    return ` ${RR_EMOJIS.WIN_33}${RR_EMOJIS.RR_GOLD}`;
  }

  if (delta === RR_VALUES.WIN) {
    return ` ${RR_EMOJIS.WIN_30}${RR_EMOJIS.RR_GREEN}`;
  }

  if (delta === RR_VALUES.LOSS) {
    return ` ${RR_EMOJIS.LOSS_15}${RR_EMOJIS.RR_RED}`;
  }

  return ` ${delta > 0 ? `+${delta}` : delta}ʀʀ`;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});






// ✅ Variables globales en mémoire
let gamesData = { games: [] };











async function getPlayerPoints(userId) {
  let doc = await Points.findOne({ userId });

  if (!doc) {
    doc = await Points.create({
      userId,
      rr: 0,
      games: 0,
      wins: 0,
      timeouts: 0
    });
  }

  return {
    userId: doc.userId,
    rr: doc.rr,
    games: doc.games,
    wins: doc.wins,
    timeouts: doc.timeouts || 0
  };
}

async function setPlayerPoints(userId, data) {
  await Points.updateOne(
    { userId },
    {
      $set: {
        rr: data.rr ?? 0,
        games: data.games ?? 0,
        wins: data.wins ?? 0,
        timeouts: data.timeouts ?? 0
      }
    },
    { upsert: true }
  );
}

async function incrementPlayerTimeouts(userId) {
  await Points.updateOne(
    { userId },
    { $inc: { timeouts: 1 } },
    { upsert: true }
  );
}


async function incrementPlayerStats(userId, rrDelta, isWinner) {
  await Points.updateOne(
    { userId },
    {
      $inc: {
        rr: rrDelta,
        games: 1,
        wins: isWinner ? 1 : 0
      }
    },
    { upsert: true }
  );

  // Empêche les RR négatifs
  await Points.updateOne(
    { userId, rr: { $lt: 0 } },
    { $set: { rr: 0 } }
  );
}


async function getAllPoints() {
  const docs = await Points.find({}).lean();
  const result = {};

  for (const doc of docs) {
    result[doc.userId] = {
      rr: doc.rr,
      games: doc.games,
      wins: doc.wins,
      timeouts: doc.timeouts || 0
    };
  }

  return result;
}

async function getInviteData(inviterId) {
  let doc = await Invite.findOne({ inviterId });

  if (!doc) {
    doc = await Invite.create({
      inviterId,
      invites: 0,
      members: []
    });
  }

  return {
    inviterId: doc.inviterId,
    invites: doc.invites,
    members: doc.members
  };
}

async function setInviteData(inviterId, data) {
  await Invite.updateOne(
    { inviterId },
    {
      $set: {
        invites: data.invites ?? 0,
        members: data.members ?? []
      }
    },
    { upsert: true }
  );
}

async function incrementInvite(inviterId, memberId) {
  await Invite.updateOne(
    { inviterId },
    {
      $inc: { invites: 1 },
      $addToSet: { members: memberId }
    },
    { upsert: true }
  );
}

async function getAllInvites() {
  const docs = await Invite.find({}).lean();
  const result = {};

  for (const doc of docs) {
    result[doc.inviterId] = {
      invites: doc.invites,
      members: doc.members
    };
  }

  return result;
}



async function setRiotUser(userId, data) {
  await RiotUser.updateOne(
    { userId },
    {
      $set: {
        pseudo: data.pseudo ?? ''
      }
    },
    { upsert: true }
  );
}




async function getConfigValue(key, fallback = null) {
  const doc = await Config.findOne({ key });
  return doc ? doc.value : fallback;
}

async function setConfigValue(key, value) {
  await Config.updateOne(
    { key },
    { $set: { value } },
    { upsert: true }
  );
}

async function getSeasonChampions() {
  return await getConfigValue('seasonChampions', []);
}

async function saveSeasonChampion({
  seasonKey,
  seasonLabel,
  userId
}) {
  const champions = await getSeasonChampions();

  // Une seule entrée par saison.
  // Si on corrige le gagnant, l'ancienne entrée est remplacée.
  const filtered = champions.filter(
    champion => champion.seasonKey !== seasonKey
  );

  filtered.push({
    seasonKey,
    seasonLabel,
    userId
  });

  filtered.sort((a, b) =>
    a.seasonKey.localeCompare(b.seasonKey)
  );

  await setConfigValue(
    'seasonChampions',
    filtered
  );

  return filtered;
}


async function getAllGames() {
  return await Game.find({}).lean();
}


async function saveGame(gameData) {
  await Game.updateOne(
    { id: gameData.id },
    { $set: gameData },
    { upsert: true }
  );
}

async function deleteGame(gameId) {
  await Game.deleteOne({ id: gameId });
}




// ============================================================
// ===== STYLE COMMUN DES EMBEDS (inspiré du style "Clutch") ====
// ============================================================

const EMBED_COLOR = 0x242429;


function buildSimpleContainer(content, accentColor = EMBED_COLOR) {
  return new ContainerBuilder()
    .setAccentColor(accentColor)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(content)
    );
}

function simpleReply(interaction, content, accentColor = EMBED_COLOR) {
  return interaction.reply({
    components: [
      buildSimpleContainer(content, accentColor)
    ],
    flags:
      MessageFlags.Ephemeral |
      MessageFlags.IsComponentsV2
  });
}

function simpleEditReply(interaction, content, accentColor = EMBED_COLOR) {
  return interaction.editReply({
    content: null,
    components: [
      buildSimpleContainer(content, accentColor)
    ],
    flags: MessageFlags.IsComponentsV2
  });
}

// 🖼️ Remplace ces URLs par tes propres bannières une fois prêtes
const BANNERS = {
  leaderboard: 'https://cdn.discordapp.com/attachments/1461761854563942400/1493355314307661936/960_x_540_px_25.png',
  regles: 'https://cdn.discordapp.com/attachments/1461761854563942400/1493071194306383962/3.png',
  onboarding: 'https://cdn.discordapp.com/attachments/1461761854563942400/1541033840007708682/960_x_540_px_1.png?ex=6a8c1f1a&is=6a8acd9a&hm=5b185b5c5d692c57ae194e92e9062e62ccc6f77d2173b450dbe95daaddeb4842&',
};


// ── Embed Leaderboard ──
function buildLeaderboardContainer({
  sorted,
  totalInvitesPerMember,
  guildMembersCache,
  playerCount,
  seasonLabel = 'Saison 1',
  page = 0
}) {

  if (!sorted.length) {
    return new ContainerBuilder()
      .setAccentColor(EMBED_COLOR)

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:VIDE:1493046347337699499> LEADERBOARD\n` +
          `-# ᴄᴀʟᴄᴜʟ ᴇɴ ᴄᴏᴜʀꜱ...`
        )
      );
  }

  // ── TOP INVITER ──
  let topInviterId = null;
  let maxInvites = -1;

  for (const [id, invites] of Object.entries(totalInvitesPerMember)) {
    if (invites > maxInvites) {
      maxInvites = invites;
      topInviterId = id;
    }
  }

  const maxRR = sorted[0][1].rr || 1;
const playersPerPage = 10;
const barLength = 8;
const totalPages = Math.max(
  1,
  Math.ceil(sorted.length / playersPerPage)
);

page = Math.max(
  0,
  Math.min(page, totalPages - 1)
);

const startIndex = page * playersPerPage;

const pagePlayers = sorted.slice(
  startIndex,
  startIndex + playersPerPage
);

const lines = pagePlayers.map(([id, data], idx) => {

  const globalIndex = startIndex + idx;
  const invites = totalInvitesPerMember[id] || 0;

  // ── BARRE RR ──
  const rawBars =
    (data.rr / maxRR) * barLength;

  const filledBars = Math.max(
    0,
    Math.min(
      barLength,
      Math.round(rawBars)
    )
  );

  const bar =
    PARALLELOGRAM_FULL.repeat(filledBars) +
    PARALLELOGRAM_EMPTY.repeat(
      barLength - filledBars
    );

  // ── RANK ──
  const member =
    guildMembersCache?.get(id) || null;

  const rankEmoji =
    getRankEmojiFromMember(member);

  // ── BADGES ──
  let badges = '';

  if (globalIndex === 0) {
    badges += BADGES.TOP1;
  }

  if (
    id === topInviterId &&
    maxInvites > 0
  ) {
    badges += BADGES.TOP_INVITER;
  }

  return (
  `### #${globalIndex + 1} <@${id}> ` +
  `${rankEmoji ? rankEmoji : ''}` +
  `${badges ? ` ${badges}` : ''}  ` +
  `**${data.rr || 0}**<:VIDE:1541125087384829962> ` +
  `**${invites}**<:VIDE:1472667823875559708>  ` +
  `${bar}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u2063`
);
});

  const container = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
  new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## <:VIDE:1493046347337699499> LEADERBOARD ꜱᴇᴘᴛᴇᴍʙʀᴇ\n` +
        `-# ᴅᴇʀɴɪᴇʀᴇ ᴍɪꜱᴇ ᴀ ᴊᴏᴜʀ : <t:${Math.floor(Date.now() / 1000)}:R>\n` +
        `-# ᴊᴏᴜᴇᴜʀꜱ ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛꜱ : \`${playerCount}\`\n` +
        `-# ᴄᴀꜱʜᴘʀɪᴢᴇ ᴅᴜ ᴍᴏɪꜱ : <:VIDE:1469100224289968242> ᴀ ᴅᴇꜰɪɴɪʀ`

      )
    )
    .setThumbnailAccessory(
      new ThumbnailBuilder()
        .setURL('https://cdn.discordapp.com/attachments/1461761854563942400/1543614174788190259/Copie_de_Guide_TRADE_REPUBLIC_12.png?ex=6a95823a&is=6a9430ba&hm=ad6142c6ac5dd3768e3e1973d2461e2850d0ea14e976cc7b66bf874fe14adb16&é')
    )
)

    .addSeparatorComponents(
  new SeparatorBuilder()
    .setSpacing(SeparatorSpacingSize.Large)
);

  for (let i = 0; i < lines.length; i++) {
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(lines[i])
  );

  // Séparateur uniquement entre les joueurs
  if (i < lines.length - 1) {
  container.addSeparatorComponents(
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
  );
}
}

container.addSeparatorComponents(
  new SeparatorBuilder()
    .setSpacing(SeparatorSpacingSize.Large)
);

if (page === 0) {

  // Page publique : un seul bouton
  const openLeaderboardRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('leaderboard_stats')
    .setLabel('Mes statistiques personnelles')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('leaderboard_open')
    .setLabel('Voir le classement complet')
    .setStyle(ButtonStyle.Secondary)
);

container.addActionRowComponents(openLeaderboardRow);

} else {

  // Pages privées : navigation
  const paginationRow = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId(`leaderboard_page_${page - 1}`)
      .setEmoji({ id: '1543638363125588098' })
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page <= 1),

    new ButtonBuilder()
      .setCustomId(`leaderboard_page_${page + 1}`)
      .setEmoji({ id: '1543638348248121538' })
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page >= totalPages - 1)

  );

  container.addActionRowComponents(paginationRow);
}

  return container;
}



// ===== Slash Commands =====
const commands = [
  {
  name: 'addchampion',
  description: 'Ajouter un ancien vainqueur au palmarès',
  default_member_permissions:
    PermissionFlagsBits.Administrator.toString(),

  options: [
    {
      name: 'joueur',
      description: 'Vainqueur de la saison',
      type: 6,
      required: true
    },
    {
      name: 'saison',
      description: 'Exemple : Août 2026',
      type: 3,
      required: true
    },
    {
      name: 'cle',
      description: 'Exemple : 2026-08',
      type: 3,
      required: true
    }
  ]
},
  { name: 'resetseason', description: 'Reinitialiser toutes les données', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'pp', description: 'Créer une partie personnalisée' },
  { name: 'leaderboard', description: 'Afficher le leaderboard', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'manage', description: 'Gérer les données', default_member_permissions: PermissionFlagsBits.Administrator.toString(), options: [{ name: 'joueur', description: 'Joueur', type: 6, required: true }] },
  { name: 'onboarding', description: 'Afficher l’onboarding', default_member_permissions: PermissionFlagsBits.Administrator.toString() }
];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('✅ Slash commands enregistrées'))
  .catch(console.error);

async function syncServerTagRole(userId, user = null) {
  try {
    const guild = client.guilds.cache.get(SERVER_TAG_GUILD_ID);
    if (!guild) return;

    const member =
      guild.members.cache.get(userId) ||
      await guild.members.fetch(userId).catch(() => null);

    if (!member) return;

    const freshUser =
      user ||
      await client.users.fetch(userId, { force: true }).catch(() => null);

    if (!freshUser) return;

    const pg = freshUser.primaryGuild;

    const hasServerTag =
      pg?.identityEnabled === true &&
      pg?.identityGuildId === SERVER_TAG_GUILD_ID;

    const hasRole = member.roles.cache.has(SERVER_TAG_ROLE_ID);

    if (hasServerTag && !hasRole) {
      await member.roles.add(
        SERVER_TAG_ROLE_ID,
        'Tag serveur actif'
      );

      const tagEnabledContainer = new ContainerBuilder()
  .setAccentColor(0xc5b174)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:tag:1497390943928586300> TAG DU SERVEUR ACTIVÉ\n` +
          `-# **${member.user.tag}** (<@${member.id}>)\n` +
          `-# ʟᴇ ʙᴏɴᴜꜱ ᴠɪᴇɴᴛ ᴅ'ᴇᴛʀᴇ ᴀᴄᴛɪᴠᴇ ᴘᴏᴜʀ ᴛᴇꜱ ᴘʀᴏᴄʜᴀɪɴᴇꜱ ᴠɪᴄᴛᴏɪʀᴇꜱ`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          member.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await sendActivityMessage(guild, {
  components: [tagEnabledContainer],
  flags: MessageFlags.IsComponentsV2
});
    }

    if (!hasServerTag && hasRole) {
      await member.roles.remove(
        SERVER_TAG_ROLE_ID,
        'Tag serveur retiré'
      );

      const tagRemovedContainer = new ContainerBuilder()
  .setAccentColor(0x858585)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:tag:1543303374974357695> TAG DU SERVEUR RETIRÉ\n` +
          `-# **${member.user.tag}** (<@${member.id}>)\n` +
          `-# ʟᴇ ʙᴏɴᴜꜱ ᴀꜱꜱᴏᴄɪᴇ ᴀᴜ ᴛᴀɢ ꜱᴇʀᴠᴇᴜʀ ᴀ ᴇᴛᴇ ʀᴇᴛɪʀᴇ`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          member.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await sendActivityMessage(guild, {
  components: [tagRemovedContainer],
  flags: MessageFlags.IsComponentsV2
});
    }

  } catch (err) {
    console.error('Erreur syncServerTagRole :', err);
  }
}
let monthlyWinnersRunning = false;
async function announceMonthlyWinners(guild) {
  if (monthlyWinnersRunning) return;
  try {
    const now = new Date();

    // Heure française, DST automatiquement gérée
    const parisParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    })
      .formatToParts(now)
      .reduce((acc, part) => {
        if (part.type !== 'literal') {
          acc[part.type] = part.value;
        }
        return acc;
      }, {});

    const year = Number(parisParts.year);
    const month = Number(parisParts.month);
    const day = Number(parisParts.day);
    const hour = Number(parisParts.hour);
    const minute = Number(parisParts.minute);
    const second = Number(parisParts.second);

    // Dernier jour du mois
    const lastDayOfMonth =
      new Date(Date.UTC(year, month, 0)).getUTCDate();

    // On ne fait rien tant qu'on n'est pas exactement à 23:59:59
    if (
      day !== lastDayOfMonth ||
      hour !== 23 ||
      minute !== 59 ||
      second !== 59
    ) {
      return;
    }

    monthlyWinnersRunning = true;

    const monthKey =
      `${year}-${String(month).padStart(2, '0')}`;

    // Sécurité : empêche une double annonce
    const lastAnnouncement =
      await getConfigValue('monthlyWinnersLastAnnouncement', null);

    if (lastAnnouncement === monthKey) {
      return;
    }

    // On verrouille immédiatement
    await setConfigValue(
      'monthlyWinnersLastAnnouncement',
      monthKey
    );

    // ==============================
    // LEADERBOARD
    // ==============================

    const pointsData = await getAllPoints();
    const invitesData = await getAllInvites();

    const totalInvitesPerMember = {};

    for (const inviterId in invitesData) {
      totalInvitesPerMember[inviterId] =
        invitesData[inviterId].invites || 0;
    }

    const sorted = sortLeaderboardPlayers(
      pointsData,
      totalInvitesPerMember,
      guild.members.cache
    );

    const leaderboardWinner = sorted[0] || null;

    // ==============================
    // INVITATIONS
    // ==============================

    let topInviterId = null;
    let maxInvites = -1;

    for (const [inviterId, data] of Object.entries(invitesData)) {
      const member = guild.members.cache.get(inviterId);

      // Ignore les personnes qui ne sont plus sur le serveur
      if (!member || member.user.bot) {
        continue;
      }

      const invites = data.invites || 0;

      if (invites > maxInvites) {
        maxInvites = invites;
        topInviterId = inviterId;
      }
    }

    const monthLabel = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      month: 'long',
      year: 'numeric'
    }).format(now);

    // ==============================
    // MESSAGE TOP LEADERBOARD
    // ==============================

    if (leaderboardWinner) {
      const [winnerId, winnerData] = leaderboardWinner;

      const winnerMember =
        guild.members.cache.get(winnerId);

      const winnerRank =
        getRankEmojiFromMember(winnerMember);

        const seasonLabel =
  monthLabel.charAt(0).toUpperCase() +
  monthLabel.slice(1);

await saveSeasonChampion({
  seasonKey: monthKey,
  seasonLabel,
  userId: winnerId
});

if (
  winnerMember &&
  !winnerMember.roles.cache.has(WINNER_ROLE_ID)
) {
  await winnerMember.roles.add(
    WINNER_ROLE_ID,
    `Vainqueur — ${seasonLabel}`
  ).catch(() => {});
}

      const games = winnerData.games || 0;
      const wins = winnerData.wins || 0;

      const winrate = games
        ? Math.round((wins / games) * 100)
        : 0;

      const leaderboardWinnerContainer =
        new ContainerBuilder()
          .setAccentColor(EMBED_COLOR)

          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `## 🏆 GAGNANT DU LEADERBOARD\n` +
                  `-# Classement final — **${monthLabel}**\n\n` +
                  `### ${BADGES.TOP1} <@${winnerId}> ${winnerRank}\n` +
                  `-# Termine la saison à la **1ʀᴇ place** avec **${winnerData.rr || 0} RR**.\n` +
                  `-# **${wins}** victoires • **${games}** parties • **${winrate}%** de winrate`
                )
              )

              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(
                  winnerMember?.displayAvatarURL({
                    extension: 'png',
                    size: 256
                  }) ||
                  guild.iconURL({
                    extension: 'png',
                    size: 256
                  })
                )
              )
          );

      await sendActivityMessage(guild, {
        components: [leaderboardWinnerContainer],
        flags: MessageFlags.IsComponentsV2
      });
    }

    // ==============================
    // MESSAGE TOP INVITEUR
    // ==============================

    if (topInviterId && maxInvites > 0) {
      const inviterMember =
        guild.members.cache.get(topInviterId);

      const invitationWinnerContainer =
        new ContainerBuilder()
          .setAccentColor(EMBED_COLOR)

          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `## 🤝 MEILLEUR INVITEUR DU MOIS\n` +
                  `-# Classement final — **${monthLabel}**\n\n` +
                  `### ${BADGES.TOP_INVITER} <@${topInviterId}>\n` +
                  `-# Termine à la **1ʀᴇ place des invitations** avec **${maxInvites} invitation${maxInvites > 1 ? 's' : ''}**.`
                )
              )

              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(
                  inviterMember?.displayAvatarURL({
                    extension: 'png',
                    size: 256
                  }) ||
                  guild.iconURL({
                    extension: 'png',
                    size: 256
                  })
                )
              )
          );

      await sendActivityMessage(guild, {
        components: [invitationWinnerContainer],
        flags: MessageFlags.IsComponentsV2
      });
    }

    console.log(
      `🏆 Gagnants mensuels annoncés pour ${monthKey}`
    );

  } catch (err) {
  console.error(
    'Erreur annonce gagnants mensuels :',
    err
  );
} finally {
  monthlyWinnersRunning = false;
}
}

client.once(Events.ClientReady, async () => {

  const colors = {
    reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m',
    yellow: '\x1b[33m', blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m'
  };

  console.log(`${colors.cyan}${colors.bright}=== BOOMBOT — VERSION 3.0.0 (Dev by Jegouzão) ===${colors.reset}`);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return;

  try {
  await initMongo();

  gamesData.games = await getAllGames();
  console.log(`✅ ${gamesData.games.length} parties chargées depuis MongoDB`);
} catch (err) {
  console.error('❌ Impossible de démarrer MongoDB :', err);
  return;
}

  await guild.members.fetch();
  console.log('✅ Tous les membres du serveur ont été chargés en cache');
  for (const member of guild.members.cache.values()) {
    await syncServerTagRole(member.id, member.user);
  }
  console.log('✅ Rôles tag serveur synchronisés');

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

  invitesCache.set(guild.id, allInvites);
  console.log(`${colors.green}✅ Invites initialisées en cache (y compris temporaires)${colors.reset}`);
  console.log(`${colors.green}✅ ${colors.bright}${client.user.tag}${colors.reset}${colors.green} est maintenant en ligne !${colors.reset}`);
  console.log(`${colors.blue}✅ Connecté sur le serveur: ${colors.bright}${guild.name}${colors.reset}`);
  console.log(`${colors.blue}✅ ${colors.bright}${guild.memberCount}${colors.reset}${colors.blue} membres${colors.reset}`);

  client.user.setPresence({
    activities: [{ name: 'by @jegouzao', type: 1, url: 'https://www.twitch.tv/jegouzao' }],
    status: 'online'
  });
  console.log(`${colors.magenta}✅ Statut du bot défini${colors.reset}`);

  try {
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
    }

    let ticketCategory = guild.channels.cache.find(c => c.type === 4 && c.name === 'ᴍᴏᴅᴇʀᴀᴛɪᴏɴ');

    if (!ticketCategory) {
      ticketCategory = await guild.channels.create({
        name: 'ᴍᴏᴅᴇʀᴀᴛɪᴏɴ',
        type: 4,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: staffRole.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels] }
        ],
        reason: 'Création automatique de la catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ'
      });
      console.log(`${colors.red}✅ Catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ créée automatiquement (ID: ${ticketCategory.id})${colors.reset}`);
    }

    const configFile = path.join(__dirname, 'data', 'config.json');
    const config = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile, 'utf8')) : {};
    config.ticketCategoryId = ticketCategory.id;
    config.staffRoleId = staffRole.id;
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error(`${colors.red}❌ Erreur lors de la création automatique:${colors.reset}`, error);
  }

await updateleaderboardEmbed();

console.log(
  `${colors.yellow}🚀 Leaderboard initialisé au démarrage${colors.reset}`
);

// Vérifie l'heure 4 fois par seconde.
// L'annonce ne peut partir qu'une seule fois grâce à monthlyWinnersLastAnnouncement.
setInterval(() => {
  announceMonthlyWinners(guild);
}, 250);

console.log(
  `${colors.green}✅ Annonce mensuelle des gagnants activée${colors.reset}`
);
});

client.on(Events.UserUpdate, async (oldUser, newUser) => {
  await syncServerTagRole(newUser.id, newUser);
});

function sortLeaderboardPlayers(pointsData, totalInvitesPerMember, guildMembersCache) {
  return Object.entries(pointsData)
    .filter(([id]) => guildMembersCache.has(id))
    .sort(([idA, a], [idB, b]) => {
      // 1. Plus de RR
      const rrDiff = (b.rr || 0) - (a.rr || 0);
      if (rrDiff !== 0) return rrDiff;

      // 2. Meilleur winrate
      const winrateA = (a.games || 0)
        ? (a.wins || 0) / a.games
        : 0;

      const winrateB = (b.games || 0)
        ? (b.wins || 0) / b.games
        : 0;

      const winrateDiff = winrateB - winrateA;
      if (winrateDiff !== 0) return winrateDiff;

      // 3. Plus d'invitations
      const invitesA = totalInvitesPerMember[idA] || 0;
      const invitesB = totalInvitesPerMember[idB] || 0;

      const invitesDiff = invitesB - invitesA;
      if (invitesDiff !== 0) return invitesDiff;

      // 4. Moins de timeouts
      return (a.timeouts || 0) - (b.timeouts || 0);
    });
}



async function updateleaderboardEmbed() {
  try {
    const leaderboardData = await getConfigValue('leaderboardData', {});

    console.log('🔄 Update leaderboard demandé');
    console.log('Leaderboard config :', leaderboardData);

    if (!leaderboardData.messageId || !leaderboardData.channelId) {
      console.log('❌ leaderboardData incomplet');
      return;
    }

    const channel =
      client.channels.cache.get(leaderboardData.channelId) ||
      await client.channels.fetch(leaderboardData.channelId).catch(() => null);

    if (!channel) {
      console.log('❌ Salon leaderboard introuvable');
      return;
    }

    const msg = await channel.messages
      .fetch(leaderboardData.messageId)
      .catch(err => {
        console.error('❌ Impossible de fetch le message leaderboard :', err);
        return null;
      });

    if (!msg) {
      console.log('❌ Message leaderboard introuvable');
      return;
    }

    const invitesData = await getAllInvites();

    const totalInvitesPerMember = {};

    for (const inviterId in invitesData) {
      totalInvitesPerMember[inviterId] =
        invitesData[inviterId].invites || 0;
    }

    const pointsData = await getAllPoints();

    const guild = channel.guild;

    await guild.members.fetch().catch(() => {});

    const sorted = sortLeaderboardPlayers(
      pointsData,
      totalInvitesPerMember,
      guild.members.cache
    );

    const currentMembers =
      guild.members.cache.filter(member => !member.user.bot).size;

    const playerCount = Math.round(currentMembers * 0.85);

    const container = buildLeaderboardContainer({
      sorted,
      totalInvitesPerMember,
      guildMembersCache: guild.members.cache,
      playerCount,
      page: 0
    });

    if (!msg.flags.has(MessageFlags.IsComponentsV2)) {
      const newMsg = await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });

      await setConfigValue('leaderboardData', {
        messageId: newMsg.id,
        channelId: channel.id
      });

      await msg.delete().catch(() => {});

      console.log('✅ Leaderboard recréé en Components V2');
      return;
    }

    await msg.edit({
      components: [container]
    });

    console.log('✅ Leaderboard mis à jour');

  } catch (err) {
    console.error('❌ ERREUR UPDATE LEADERBOARD :', err);
  }
}


// ===== Contenu de la commande /onboarding =====

function buildOnboardingContainer() {
  const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('open_rules')
    .setLabel('Règlement')
    .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
    .setCustomId('toggle_notif_pp')
    .setLabel('Notifications PP')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('rank_up')
    .setLabel('Rank Up')
    .setStyle(ButtonStyle.Secondary),

     new ButtonBuilder()
    .setCustomId('apply_organizer')
    .setLabel('Devenir organisateur')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('open_ticket')
    .setLabel('Support')
    .setStyle(ButtonStyle.Secondary)
);

  return new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## <:Roles:1493046347337699499> ONBOARDING — VALORANT PP`
      )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
    )

    .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder()
          .setURL(BANNERS.onboarding)
      )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
    )

    .addActionRowComponents(row);
}

  async function showPlayerStats(interaction) {

  await simpleReply(
    interaction,
    '⏳ Chargement de tes statistiques...'
  );

  const member = interaction.member;
  const guild = interaction.guild;

  const allPoints = await getAllPoints();
  const allInvites = await getAllInvites();
  const seasonChampions =
  await getSeasonChampions();

const playerChampionships =
  seasonChampions
    .filter(
      champion =>
        champion.userId === member.id
    )
    .sort((a, b) =>
      b.seasonKey.localeCompare(a.seasonKey)
    );

const championshipLine =
  playerChampionships.length
    ? playerChampionships
        .map(champion => champion.seasonLabel)
        .join(' • ')
    : null;

  const stats = allPoints[member.id] || {
    rr: 0,
    games: 0,
    wins: 0,
    timeouts: 0
  };

  const invitesData = allInvites[member.id] || {
    invites: 0,
    members: []
  };

  const totalInvitesPerMember = {};

  for (const [id, data] of Object.entries(allInvites)) {
    totalInvitesPerMember[id] = data.invites || 0;
  }

  const sorted = sortLeaderboardPlayers(
    allPoints,
    totalInvitesPerMember,
    guild.members.cache
  );

  const positionIndex = sorted.findIndex(
    ([id]) => id === member.id
  );

  const position =
    positionIndex !== -1
      ? positionIndex + 1
      : '—';

  const rankEmoji = getRankEmojiFromMember(member);

  let topInviterId = null;
  let maxInvites = -1;

  for (const [id, data] of Object.entries(allInvites)) {
    const invites = data.invites || 0;

    if (invites > maxInvites) {
      maxInvites = invites;
      topInviterId = id;
    }
  }

  const badgeTop1 =
  position === 1
    ? BADGES.TOP1
    : '';

const badgeTopInviter =
  member.id === topInviterId && maxInvites > 0
    ? BADGES.TOP_INVITER
    : '';

const badgeOG =
  member.roles.cache.has(OG_ROLE_ID)
    ? BADGES.OG
    : '';

const badgeOrganizer =
  member.roles.cache.has(ORGANIZER_ROLE_ID)
    ? BADGES.ORGANIZER
    : '';

const badgeWinner =
  member.roles.cache.has(WINNER_ROLE_ID)
    ? BADGES.WINNER
    : '';

const badgeServerTag =
  member.roles.cache.has(SERVER_TAG_ROLE_ID)
    ? BADGES.SERVER_TAG
    : '';

const badgeBooster =
  member.roles.cache.has(BOOSTER_ROLE_ID)
    ? BADGES.BOOSTER
    : '';

const badgesLine = [
  badgeTop1,
  badgeTopInviter,
  badgeWinner,
  badgeOG,
  badgeOrganizer,
  badgeServerTag,
  badgeBooster
]
  .filter(Boolean)
  .join(' ');

  const winrate = stats.games
    ? ((stats.wins / stats.games) * 100).toFixed(1)
    : 0;

  const joinedTs = member.joinedTimestamp
    ? Math.floor(member.joinedTimestamp / 1000)
    : null;

  const roleNames = member.roles.cache
    .filter(r => r.id !== guild.id)
    .sort((a, b) => b.position - a.position)
    .map(r => `<@&${r.id}>`)
    .join(', ') || 'Aucun';

  const maxRR =
    sorted[0]?.[1]?.rr || 1;

const barLength = 15;
  const rawBars =
    (stats.rr / maxRR) * barLength;

  const filledBars = Math.max(
    0,
    Math.min(
      barLength,
      Math.round(rawBars)
    )
  );

  const progressBar =
  PARALLELOGRAM_FULL.repeat(filledBars) +
  PARALLELOGRAM_EMPTY.repeat(barLength - filledBars);

  const statsContainer = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
      new SectionBuilder()

        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## ${member.displayName} ${rankEmoji ? rankEmoji + ' ' : ''}${badgesLine}\n` +
            `-# Tes statistiques personnelles sur **VALORANT PP**\n` +
            `-# Membre  <:VIDE:1493046369076777110>  depuis le ${joinedTs ? `<t:${joinedTs}:D>` : '—'}\n` +
            `-# **#${position}** au classement général\n` +
            `-# ${progressBar}`
          )
        )

        .setThumbnailAccessory(
          new ThumbnailBuilder()
            .setURL(
              member.displayAvatarURL({
                size: 256
              })
            )
        )
    )


    .addTextDisplayComponents(
  new TextDisplayBuilder().setContent(
    `### ${stats.rr}<:VIDE:1541125087384829962>      ` +
    `${winrate}<:VIDE:1541167342535319603>%  　` +
    `${stats.games}<:VIDE:1472667851239456935>　` +
    `${stats.wins}<:VIDE:1493266372954820741>　` +
    `${invitesData.invites}<:VIDE:1472667823875559708>　` +
    `${stats.timeouts || 0}<:VIDE:1493378253446975619>　\n`
  )
)

.addSeparatorComponents(
  new SeparatorBuilder()
)

.addTextDisplayComponents(
  new TextDisplayBuilder().setContent(
    championshipLine
      ? `### ${BADGES.WINNER} PALMARÈS\n` +
        `-# ${championshipLine}\n\n${roleNames}`
      : `${roleNames}`
  )
)
);

  return interaction.editReply({
  components: [statsContainer]
});
}



function buildRulesContainer() {
  return new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## <:36:1493046347337699499> RÈGLEMENT — VALORANT PP\n` +
        `-# ᴀꜰᴋ / ʟᴇᴀᴠᴇ / ꜰᴀᴜx ᴘᴇᴀᴋ ʀᴀɴᴋ ꜱᴀɴᴄᴛɪᴏɴɴᴇꜱ\n` +
        `-# ᴀ ᴘᴀʀᴛ ᴄᴀ, **NO RULES**\n` +
        `-# ᴄᴀ ɴᴇ ᴘʟᴀɪʀᴀ ᴘᴀꜱ ᴀ ᴛᴏᴜꜱ, _*ᴍᴀɪꜱ ᴀ ʟᴀ ɢʀᴀɴᴅᴇ ᴍᴀᴊᴏʀɪᴛᴇ*_\n` +
        `-# ᴘᴀꜱ ᴅᴇ ʟɪᴍɪᴛᴇꜱ ᴀᴜ ɴɪᴠᴇᴀᴜ ᴅᴇ ʟ'ᴇǫᴜɪᴘᴇᴍᴇɴᴛ ᴏᴜ ᴅᴇꜱ ᴅᴇᴄɪʙᴇʟꜱ\n` +
        `-# ᴏɴ ᴇꜱᴛ ʟᴀ ᴘᴏᴜʀ __ᴄʀɪᴇʀ ᴅᴇ ʀɪʀᴇ__, ᴇᴛ __ʀᴇɴᴛʀᴇʀ ᴅᴇꜱ ᴄʟɪᴘꜱ__`
      )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `### ʙᴀʀᴇᴍᴇ ᴅᴇꜱ ᴘᴏɪɴᴛꜱ\n` +
        `<:boost:1488545490189549629> **ᴘᴀʀᴛɪᴇ ɢᴀɢɴᴇᴇ** : <:36:1497395169224556686><:RR:1497395178045050992> ᴀᴠᴇᴄ ʟᴇ ʙᴏᴏꜱᴛ ᴅᴇ ꜱᴇʀᴠᴇᴜʀ\n` +
        `<:tag:1497390943928586300> **ᴘᴀʀᴛɪᴇ ɢᴀɢɴᴇᴇ** : <:33:1497395187415126127><:RR:1497395194289455114> ᴀᴠᴇᴄ ʟᴇ ᴛᴀɢ ᴅᴇ ꜱᴇʀᴠᴇᴜʀ\n` +
        `<:VPP:1493046369076777110> **ᴘᴀʀᴛɪᴇ ɢᴀɢɴᴇᴇ** : <:30:1493259044893360200><:RR:1493259054804369408> ᴘᴏᴜʀ ᴜɴ ᴍᴇᴍʙʀᴇ ꜱᴛᴀɴᴅᴀʀᴅ\n` +
        `<:VPP:1493046369076777110> **ᴘᴀʀᴛɪᴇ ᴘᴇʀᴅᴜᴇ** : <:15:1493259005584343080><:RR:1493259016686538932> ᴘᴏᴜʀ ᴜɴ ᴍᴇᴍʙʀᴇ ꜱᴛᴀɴᴅᴀʀᴅ`
      )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `### ᴇǫᴜɪʟɪʙʀᴀɢᴇ\n` +
        `-# **ʙᴏᴏᴍʙᴏᴛ ᴇꜱᴛ ᴀᴜᴛᴏᴍᴀᴛɪꜱᴇ ᴘᴏᴜʀ ᴇǫᴜɪʟɪʙʀᴇʀ ɪɴᴛᴇʟʟɪɢᴇᴍᴍᴇɴᴛ**\n` +
        `-# **ɢʀᴀᴄᴇ ᴀᴜ ᴘᴇᴀᴋ ʀᴀɴᴋ ǫᴜᴇ ᴠᴏᴜꜱ ꜰᴏᴜʀɴɪꜱꜱᴇᴢ ᴀ ʟ'ᴀʀʀɪᴠᴇᴇ**\n` +
        `-# ꜱɪ ᴠᴏᴜꜱ ᴀᴍᴇʟɪᴏʀᴇᴢ ᴠᴏᴛʀᴇ ʀᴀɴɢ, @ᴛᴀɢɢᴇᴢ ǫᴜᴇʟǫᴜ'ᴜɴ`
      )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `### ᴄᴀꜱʜᴘʀɪᴢᴇꜱ ᴍᴇɴꜱᴜᴇʟꜱ\n` +
        `-# <:TL:1465704930160410847><:TL:1465709888729776296> ᴛᴏᴘ ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ\n` +
        `-# <:TL:1465704930160410847><:TI:1465747415670984862> ᴛᴏᴘ ɪɴᴠɪᴛᴀᴛɪᴏɴꜱ\n` +
        `-# <:TL:1493378369364951131> ʟᴇꜱ ᴘʀɪx ᴠᴀʀɪᴇʀᴏɴᴛ : ʙᴜɴᴅʟᴇꜱ, ʀɪᴏᴛᴄᴀʀᴅ, ᴘᴀʏᴘᴀʟ, ɴɪᴛʀᴏ...`
      )
    );
}

function getDiscordVisualWidth(text, guild) {
  if (!text) return 0;

  let width = 0;

  const parts = text.match(
    /<@!?\d+>|<a?:\w+:\d+>|./gu
  ) || [];

  for (const part of parts) {

    // Mention utilisateur
    const mentionMatch = part.match(/^<@!?(\d+)>$/);

    if (mentionMatch) {
      const member = guild.members.cache.get(mentionMatch[1]);

      const name = member
        ? `@${member.displayName}`
        : '@Utilisateur';

      for (const char of name) {
        if ('ilIjtfr1.,\'`|!:'.includes(char)) {
          width += 0.45;
        } else if ('MW@#%&'.includes(char)) {
          width += 1.15;
        } else if (/[A-ZÀ-Ü]/.test(char)) {
          width += 0.85;
        } else if (/[0-9]/.test(char)) {
          width += 0.75;
        } else {
          width += 0.72;
        }
      }

      continue;
    }

    // Emoji custom Discord
    if (/^<a?:\w+:\d+>$/.test(part)) {
      width += 2.15;
      continue;
    }

    // Espaces normaux
    if (part === ' ') {
      width += 0.42;
      continue;
    }

    // Caractères classiques
    if ('ilIjtfr1.,\'`|!:'.includes(part)) {
      width += 0.45;
    } else if ('MW@#%&'.includes(part)) {
      width += 1.15;
    } else if (/[A-ZÀ-Ü]/.test(part)) {
      width += 0.85;
    } else {
      width += 0.72;
    }
  }

  return width;
}



function padTeamLine(left, right, guild) {
  const COLUMN_TARGET = 21.5;
  const FULL_SPACE_WIDTH = 1.35;

  const normalizedLeft = left || '';
const normalizedRight = right || '';


if (!normalizedLeft) {
  const blankSpaces = Math.round(
  COLUMN_TARGET / FULL_SPACE_WIDTH
) + 1;

  return `${'　'.repeat(blankSpaces)}\u2009${normalizedRight}`;
}

  const mentionMatch = normalizedLeft.match(/<@!?\d+>/);

  let widthReference = normalizedLeft;

  if (mentionMatch) {
    const mentionEnd =
      normalizedLeft.indexOf(mentionMatch[0]) +
      mentionMatch[0].length;

    widthReference = normalizedLeft.slice(0, mentionEnd);
  }

  const leftWidth = getDiscordVisualWidth(
    widthReference,
    guild
  );

  let RR_ZONE = 0;

if (mentionMatch) {
  const mentionEnd =
    normalizedLeft.indexOf(mentionMatch[0]) +
    mentionMatch[0].length;

  const suffix = normalizedLeft
    .slice(mentionEnd)
    .trim();

  if (suffix) {
    RR_ZONE = 4.8;
  }
}

  const spacesNeeded = Math.max(
    2,
    Math.round(
      (COLUMN_TARGET - leftWidth - RR_ZONE) /
      FULL_SPACE_WIDTH
    )
  );

  return `${normalizedLeft}${'　'.repeat(spacesNeeded)}${normalizedRight}`;
}


function buildInGameContainer({
  attackersText,
  defendersText,
  mapName,
  mapImage,
  footerText,
  guild
}) {
  const attackers = String(attackersText || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const defenders = String(defendersText || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const maxPlayers = Math.max(
    attackers.length,
    defenders.length
  );

  const teamLines = [];

  for (let i = 0; i < maxPlayers; i++) {
  const attacker = attackers[i] || '';
  const defender = defenders[i] || '';

  teamLines.push(
    padTeamLine(attacker, defender, guild)
  );
}

const container = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## <:VIDE:1493046347337699499> PARTIE EN COURS ${mapName || ''}\n` +
            `-# Partie lancée par **${footerText}**\n` +
            `-# Mode spectateur disponible\n` +
            `-# Rejoins un salon vocal avant de choisir le side à observer`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(mapImage)
        )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        teamLines.join('\n')
      )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    );

  return container;
}

// ── Embed "Annonce Custom" (partie créée / inscription) ──
function buildAnnounceContainer({
  waitingVCId,
  mode,
  code,
  organisateur,
  remaining,
  votes,
  needed,
  playersText,
  mapName,
  mapImage,
  footerIcon
}) {

  const container = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## <:VIDE:1493046347337699499> PARTIE EN PRÉPARATION ${mapName || ''}\n` +
            `-# Partie organisée par **${organisateur}**\n` +
            `-# \`${remaining}\` slots restant pour le lobby \`${code}\`\n` +
            `-# \`${votes}/${needed}\` votes pour changer la map`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder()
            .setURL(footerIcon)
        )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# En attente de participants...\n` +
        `${playersText || '-# ᴀᴜᴄᴜɴ'}`
      )
    )

.addSeparatorComponents(
  new SeparatorBuilder()
    .setSpacing(SeparatorSpacingSize.Large)
);

  if (mapImage) {
    container.addMediaGalleryComponents(
      new MediaGalleryBuilder()
        .addItems(
          new MediaGalleryItemBuilder()
            .setURL(mapImage)
        )
    );
  }

  return container;
}

// ── Embed "Partie en cours" ──
// ── Container "Partie en cours" ──
function buildResultContainer({
  attackers,
  defenders,
  mapName,
  mapImage,
  validatedBy,
  winningSide,
  guild
}) {
  const maxPlayers = Math.max(
    attackers.length,
    defenders.length
  );

  const teamLines = [];

  function buildPlayerText(player) {
    if (!player) return '';

    return `${player.rankEmoji} <@${player.id}>${player.rrDisplay}`;
  }

  for (let i = 0; i < maxPlayers; i++) {
    const attacker = attackers[i] || null;
    const defender = defenders[i] || null;

    const attackerText = buildPlayerText(attacker);
    const defenderText = buildPlayerText(defender);

    teamLines.push(
      padTeamLine(
        attackerText,
        defenderText,
        guild
      )
    );
  }

  const winnerText =
    winningSide === 'attack'
      ? 'ATTAQUANTS'
      : 'DÉFENSEURS';

  const container = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## <:VIDE:1493046347337699499> PARTIE TERMINÉE ${mapName || ''}\n` +
            `-# Partie validée par **${validatedBy}**\n` +
            `-# Victoire des **${winnerText}**\n` +
            `-# Le calcul prend en compte les avantages Tag et Boost de serveur`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(mapImage)
        )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        teamLines.join('\n')
      )
    );

  return container;
}

// ===== Interaction Handler =====
client.on('interactionCreate', async (interaction) => {
  try {



    const MOD_ROLE_ID = '1461348856100028439';
    const VERIFIED_ROLE_ID = '1461354176931041312';

    const isMod = interaction.member?.roles?.cache?.has(MOD_ROLE_ID);
    const isVerified = interaction.member?.roles?.cache?.has(VERIFIED_ROLE_ID);

    // --------------------------------------
// BOUTON RIOT
// --------------------------------------
if (interaction.isButton() && interaction.customId === 'verify_riot') {
  if (interaction.replied || interaction.deferred) return;

  if (!memberHasSelectedRank(interaction.member)) {
  return simpleReply(
    interaction,
    '❌ Tu dois d’abord sélectionner ton **peak rank** avant de pouvoir te renommer.'
  );
}

  const modal = new ModalBuilder()
    .setCustomId('riot_modal')
    .setTitle('Vérification Riot ID');

  const pseudoInput = new TextInputBuilder()
    .setCustomId('riot_pseudo')
    .setLabel('Pseudo sur VALORANT, sans le #TAG')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(pseudoInput)
  );

  await interaction.showModal(modal);
  return;
}

    function findGame(interaction) {
      if (interaction.isStringSelectMenu() && interaction.customId.startsWith('spectate_select_')) {
        const gameId = interaction.customId.replace('spectate_select_', '');
        return gamesData.games.find(g =>
          g.id === gameId || g.messageId === gameId || g.manageMessageId === gameId || g.betMessageId === gameId
        );
      }

      if (interaction.message?.id) {
        const mid = interaction.message.id;
        return gamesData.games.find(g =>
          g.id === mid || g.messageId === mid || g.manageMessageId === mid || g.betMessageId === mid
        );
      }

      return null;
    }

    let game = findGame(interaction);
    const isGameOwner = game?.creatorId === interaction.user.id;
    const canManageThisGame = interaction.user.id === BOT_OWNER_ID || isGameOwner;

    // ── /onboarding ──
    if (interaction.isChatInputCommand() && interaction.commandName === 'onboarding') {
  return interaction.reply({
    components: [buildOnboardingContainer()],
    flags: MessageFlags.IsComponentsV2
  });
}

if (
  interaction.isStringSelectMenu() &&
  interaction.customId === 'rank_up_select'
) {
  const currentRank = getMemberRankKey(interaction.member);
  const selectedRank = interaction.values[0];

  if (!currentRank) {
  return simpleReply(
    interaction,
    '❌ Aucun rang actuel détecté.'
  );
}

  const currentIndex = RANK_UP_ORDER.indexOf(currentRank);
  const selectedIndex = RANK_UP_ORDER.indexOf(selectedRank);

  if (
  selectedIndex === -1 ||
  selectedIndex <= currentIndex
) {
  return simpleReply(
    interaction,
    '❌ Tu ne peux sélectionner qu’un rang supérieur à ton rang actuel.'
  );
}
await interaction.deferUpdate();

  const oldRoleId = RANK_ROLES[currentRank];
const newRoleId = RANK_ROLES[selectedRank];

await interaction.member.roles.remove(oldRoleId).catch(() => {});
await interaction.member.roles.add(newRoleId).catch(() => {});

const newRankLabel = RANK_LABELS[selectedRank];
const newRankEmoji = rankEmojis[newRankLabel] || rankEmojis.Unranked;

const rankUpActivityContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${newRankEmoji} RANK UP\n` +
          `-# **${interaction.member.displayName}** (<@${interaction.user.id}>)\n` +
          `-# Vient de passer de **${RANK_LABELS[currentRank]}** à **${newRankLabel}**.`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          interaction.user.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await sendActivityMessage(interaction.guild, {
  components: [rankUpActivityContainer],
  flags: MessageFlags.IsComponentsV2
});

const rankUpDoneContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ✅ RANK UP\n` +
      `-# **${RANK_LABELS[currentRank]}** → **${RANK_LABELS[selectedRank]}**`
    )
  );

return interaction.editReply({
  components: [rankUpDoneContainer]
});
}

    // ✅ Boutons hors "game" (doivent répondre vite)
    if (interaction.isButton()) {

      if (interaction.customId === 'leaderboard_stats') {
  return showPlayerStats(interaction);
}

if (
  interaction.customId === 'leaderboard_open' ||
  interaction.customId.startsWith('leaderboard_page_')
) {

  // "Classement complet" ouvre directement #11 à #20
  const page = interaction.customId === 'leaderboard_open'
    ? 1
    : parseInt(
        interaction.customId.replace('leaderboard_page_', ''),
        10
      );

  if (isNaN(page) || page < 1) return;

  const guild = interaction.guild;

  // ── INVITATIONS ──
  const invitesData = await getAllInvites();
  const totalInvitesPerMember = {};

  for (const inviterId in invitesData) {
    totalInvitesPerMember[inviterId] =
      invitesData[inviterId].invites || 0;
  }

  // ── POINTS ──
  const pointsData = await getAllPoints();

  const sorted = sortLeaderboardPlayers(
  pointsData,
  totalInvitesPerMember,
  guild.members.cache
);

  const currentMembers = guild.members.cache.filter(member => !member.user.bot).size;
const playerCount = Math.round(currentMembers * 0.85);

  const container = buildLeaderboardContainer({
    sorted,
    totalInvitesPerMember,
    guildMembersCache: guild.members.cache,
    playerCount,
    page
  });

  // Premier clic depuis le leaderboard public
  if (interaction.customId === 'leaderboard_open') {
    return interaction.reply({
      components: [container],
      flags:
        MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2,
      allowedMentions: {
        parse: []
      }
    });
  }

  // Navigation dans le classement éphémère
  return interaction.update({
    components: [container],
    allowedMentions: {
      parse: []
    }
  });
}

if (interaction.customId === 'rank_up') {
  const currentRank = getMemberRankKey(interaction.member);

  if (!currentRank) {
    return interaction.reply({
      content: '❌ Aucun rang actuel détecté.',
      flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
    });
  }

  const currentIndex = RANK_UP_ORDER.indexOf(currentRank);

  const availableRanks = RANK_UP_ORDER
  .slice(currentIndex + 1)
  .reverse();

  if (!availableRanks.length) {
  return simpleReply(
    interaction,
    '👑 Tu es déjà au rang maximum : **Radiant**.'
  );
}
  const rankUpMenu = new StringSelectMenuBuilder()
    .setCustomId('rank_up_select')
    .setPlaceholder('Sélectionne ton nouveau rang')
    .addOptions(
  availableRanks.map(rankKey => {
    const rankLabel = RANK_LABELS[rankKey];
    const emojiString = rankEmojis[rankLabel];

    const emojiMatch = emojiString?.match(
      /<a?:([^:]+):(\d+)>/
    );

    return {
      label: rankLabel,
      value: rankKey,
      ...(emojiMatch && {
        emoji: {
          name: emojiMatch[1],
          id: emojiMatch[2]
        }
      })
    };
  })
);

  const rankUpContainer = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## RANK UP\n` +
        `-# Rang actuel : **${RANK_LABELS[currentRank]}**\n` +
        `-# Sélectionne ton nouveau peak rank.`
      )
    )
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(rankUpMenu)
    );

  return interaction.reply({
    components: [rankUpContainer],
    flags:
      MessageFlags.Ephemeral |
      MessageFlags.IsComponentsV2
  });
}

// ── DEVENIR ORGANISATEUR ──
if (interaction.customId === 'apply_organizer') {

  if (interaction.member.roles.cache.has(ORGANIZER_ROLE_ID)) {
    return simpleReply(
      interaction,
      '❌ Tu es déjà Organisateur de parties.'
    );
  }

  const organizerInfoContainer = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## 🎮 DEVENIR ORGANISATEUR DE PARTIES\n` +
        `-# Les organisateurs permettent de faire vivre les parties personnalisées du serveur.\n\n` +

        `### TON RÔLE\n` +
        `En devenant **Organisateur de parties**, tu pourras créer et gérer des PP directement avec Boombot.\n\n` +

        `Tu devras notamment :\n` +
        `- créer les parties lorsque des joueurs sont disponibles ;\n` +
        `- communiquer le bon code de groupe Valorant ;\n` +
        `- surveiller les inscriptions et le bon déroulement de la partie ;\n` +
        `- lancer et équilibrer les équipes lorsque tout le monde est prêt ;\n` +
        `- gérer ta partie jusqu'à sa fin et intervenir si nécessaire.\n\n` +

        `### COMMENT CRÉER UNE PP ?\n` +
        `Utilise la commande **/pp**. Boombot te demandera ensuite le **code de groupe Valorant à 6 caractères** puis s'occupera automatiquement de créer la partie, les salons nécessaires et les inscriptions.\n\n` +

        `Une fois les joueurs réunis, les boutons de la partie permettent de gérer son déroulement, notamment l'équilibrage des équipes et l'annulation si nécessaire.\n\n` +

        `### CE QU'ON ATTEND DE TOI\n` +
        `On recherche avant tout des personnes **actives, sérieuses et disponibles**, capables de prendre l'initiative d'organiser des parties et de les suivre correctement.\n\n` +

        `-# En postulant, ta candidature sera transmise à l'équipe pour validation.`
      )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    )

    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('organizer_apply_confirm')
          .setLabel('Je postule')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('organizer_apply_cancel')
          .setLabel('Annuler')
          .setStyle(ButtonStyle.Secondary)
      )
    );

  return interaction.reply({
    components: [organizerInfoContainer],
    flags:
      MessageFlags.Ephemeral |
      MessageFlags.IsComponentsV2
  });
}


// ── CONFIRMER LA CANDIDATURE ORGANISATEUR ──
if (interaction.customId === 'organizer_apply_confirm') {

  if (interaction.member.roles.cache.has(ORGANIZER_ROLE_ID)) {
    return interaction.update({
      components: [
        buildSimpleContainer(
          '❌ Tu es déjà Organisateur de parties.'
        )
      ]
    });
  }

  const acceptButton = new ButtonBuilder()
    .setCustomId(`organizer_accept_${interaction.user.id}`)
    .setLabel('Accepter')
    .setStyle(ButtonStyle.Success);

  const refuseButton = new ButtonBuilder()
    .setCustomId(`organizer_refuse_${interaction.user.id}`)
    .setLabel('Refuser')
    .setStyle(ButtonStyle.Danger);

  const applicationContainer = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## CANDIDATURE ORGANISATEUR DE PARTIES\n` +
            `-# **${interaction.member.displayName}** (<@${interaction.user.id}>)\n` +
            `-# Souhaite devenir **Organisateur de parties**.`
          )
        )

        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            interaction.user.displayAvatarURL({
              extension: 'png',
              size: 256
            })
          )
        )
    )

    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        acceptButton,
        refuseButton
      )
    );

  await sendActivityMessage(interaction.guild, {
    components: [applicationContainer],
    flags: MessageFlags.IsComponentsV2
  });

  return interaction.update({
    components: [
      buildSimpleContainer(
        '✅ Ta candidature a été envoyée.'
      )
    ]
  });
}


// ── ANNULER LA CANDIDATURE ORGANISATEUR ──
if (interaction.customId === 'organizer_apply_cancel') {
  return interaction.update({
    components: [
      buildSimpleContainer(
        '❌ Candidature annulée.'
      )
    ]
  });
}

if (
  interaction.customId.startsWith('organizer_accept_') ||
  interaction.customId.startsWith('organizer_refuse_')
) {
  if (interaction.user.id !== BOT_OWNER_ID) {
  return simpleReply(
    interaction,
    '❌ Seul le propriétaire peut traiter cette candidature.'
  );
}

  const accepted =
    interaction.customId.startsWith('organizer_accept_');

  const userId = interaction.customId
    .replace('organizer_accept_', '')
    .replace('organizer_refuse_', '');

  const member = await interaction.guild.members
    .fetch(userId)
    .catch(() => null);

  if (!member) {
  return simpleReply(
    interaction,
    '❌ Membre introuvable.'
  );
}

  if (accepted) {
    await member.roles.add(
      ORGANIZER_ROLE_ID,
      'Candidature Organisateur acceptée'
    );
  }

  const resultContainer = new ContainerBuilder()
    .setAccentColor(
      accepted
        ? 0x57f287
        : 0xed4245
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        accepted
          ? `## ✅ CANDIDATURE ACCEPTÉE\n` +
            `-# <@${userId}> est désormais **Organisateur de parties**.`
          : `## ❌ CANDIDATURE REFUSÉE\n` +
            `-# La candidature de <@${userId}> a été refusée.`
      )
    );

  return interaction.update({
    components: [resultContainer]
  });
}

if (interaction.customId === 'open_rules') {
  return interaction.reply({
    components: [buildRulesContainer()],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
  });
}

      if (interaction.customId === 'open_ticket') {
        const modal = new ModalBuilder().setCustomId('ticket_reason_modal').setTitle('Ouvrir un ticket');
        const reasonInput = new TextInputBuilder()
  .setCustomId('ticket_reason')
  .setLabel('Objet du ticket')
  .setPlaceholder('Signalement, rank-up, question...')
  .setStyle(TextInputStyle.Short)
  .setRequired(false);
        modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
        return interaction.showModal(modal);
      }

      if (interaction.customId.startsWith('close_ticket_')) {
  const ticketOwnerId = interaction.customId.replace('close_ticket_', '');

const staffRole = interaction.guild.roles.cache.find(
  r => r.name === 'Administrateur'
);

const isBotOwner = interaction.user.id === BOT_OWNER_ID;

const isAdministrator =
  staffRole &&
  interaction.member.roles.cache.has(staffRole.id);

if (!isBotOwner && !isAdministrator) {
  return interaction.reply({
    content: '❌ Seule l’équipe peut clôturer ce ticket.',
    flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
  });
}

  await interaction.deferReply({
    flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
  });

  const ch = interaction.channel;

  if (!ch) {
    return interaction.editReply('❌ Salon introuvable.');
  }

  await ch.delete().catch(() => {});
  return;
}



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

      if (interaction.customId.startsWith('manage_reset_')) {
  await interaction.deferReply({
    flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
  });

  const userId = interaction.customId.split('_').pop();

  await setPlayerPoints(userId, {
    rr: 0,
    games: 0,
    wins: 0,
    timeouts: 0
  });

  await updateleaderboardEmbed();

  return simpleEditReply(
  interaction,
  `🔄 Stats reset pour <@${userId}> (0 RR, 0 games, 0 wins).`
);
}

if (interaction.isButton() && interaction.customId === 'toggle_notif_pp') {
  const roleId = ROLE_NOTIF_PP;
  const member = interaction.member;

  if (!member || !member.roles) {
    return simpleReply(
      interaction,
      '❌ Membre introuvable.'
    );
  }

  const hasRole = member.roles.cache.has(roleId);

  try {
    if (hasRole) {
      await member.roles.remove(roleId);

      return simpleReply(
        interaction,
        '🔕 Tu ne recevras plus les notifications PP.'
      );

    } else {
      await member.roles.add(roleId);

      return simpleReply(
        interaction,
        '🔔 Tu recevras désormais les notifications PP.'
      );
    }

  } catch (err) {
    console.error(err);

    return simpleReply(
      interaction,
      '❌ Impossible de modifier ton rôle de notification.'
    );
  }
}

}

// ✅ Sécurité UNIQUEMENT pour les interactions qui ont un customId (boutons / menus)
if (interaction.isButton()) {

  const gameButtons = [
    'join_game',
    'change_map',
    'start',
    'cancel_registration',
    'spectate',
    'attack_win',
    'defense_win',
    'cancel_game'
  ];

  if (gameButtons.includes(interaction.customId) && !game) {
  return simpleReply(
    interaction,
    "❌ Cette partie n'existe plus."
  );
}

  const ownerOnlyButtons = [
    'start',
    'cancel_registration',
    'attack_win',
    'defense_win',
    'cancel_game'
  ];

  if (
  ownerOnlyButtons.includes(interaction.customId) &&
  !canManageThisGame
) {
  return simpleReply(
    interaction,
    '⛔ Seul le créateur de cette partie peut utiliser ce bouton.'
  );
}

  const verifiedOnly = ['spectate'];

  if (
  verifiedOnly.includes(interaction.customId) &&
  !isVerified
) {
  return simpleReply(
    interaction,
    '⛔ Seuls les membres Vérifiés peuvent observer.'
  );
}
}

    const waitingVC = game ? interaction.guild.channels.cache.get(game.waitingVC) : null;

    async function moveVerifiedToVC(member, vc) {
      if (!member || !vc) return;
      const originalLimit = vc.userLimit;

      try {
        if (vc.userLimit > 0 && vc.members.size >= vc.userLimit) {
          await vc.edit({ userLimit: vc.members.size + 1 });
        }
        await member.voice.setChannel(vc).catch(() => {});
      } finally {
        if (vc.editable) {
          await vc.edit({ userLimit: originalLimit }).catch(() => {});
        }
      }
    }

    // ── COMMANDES SLASH ──
    if (interaction.isChatInputCommand() && interaction.commandName === 'pp') {
  if (!isMod) {
  return simpleReply(
    interaction,
    '⛔ Seuls les Organisateurs de parties peuvent créer une partie.'
  );
}

      const modal = new ModalBuilder().setCustomId('pp_create_modal').setTitle('Créer une partie personnalisée');
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

    if (interaction.isChatInputCommand() && interaction.commandName === 'resetseason') {
      await interaction.deferReply({
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});

      try {
        const result = await Points.updateMany({}, { $set: { rr: 0, games: 0, wins: 0 } });
        await updateleaderboardEmbed();

        return simpleEditReply(
  interaction,
  `✅ Nouvelle saison initialisée.\n` +
  `Joueurs reset : **${result.modifiedCount ?? 0}**`
);
      } catch (err) {
        console.error('Erreur resetseason :', err);
        return simpleEditReply(
  interaction,
  '❌ Impossible de réinitialiser la saison.'
);
      }
    }

    // ── MODAL SUBMIT ──
if (interaction.isModalSubmit() && interaction.customId === 'pp_create_modal') {
  if (interaction.replied || interaction.deferred) return;

  await interaction.deferReply({
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});

  const valorantCode = interaction.fields.getTextInputValue('valorant_code');

  const verifiedRole = interaction.guild.roles.cache.find(
    r => r.name === 'Vérifié'
  );

  if (!verifiedRole) {
  return simpleEditReply(
    interaction,
    "⚠️ Le rôle Vérifié n'existe pas."
  );
}

  const category = await interaction.guild.channels.create({
        name: 'ᴘᴀʀᴛɪᴇ ᴇɴ ᴄᴏᴜʀꜱ',
        type: 4,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect] },
          { id: verifiedRole.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect] },
          ...(MOD_ROLE_ID ? [{
            id: MOD_ROLE_ID,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.MoveMembers]
          }] : [])
        ]
      });

      const communityCategory = interaction.guild.channels.cache.get(COMMUNITY_CATEGORY_ID)
        || await interaction.guild.channels.fetch(COMMUNITY_CATEGORY_ID).catch(() => null);

      if (communityCategory) {
        await category.setPosition(communityCategory.position + 1).catch(console.error);
      }

      const waitingVC = await interaction.guild.channels.create({
        name: `┃préparation ${valorantCode}`,
        type: 2,
        parent: category.id,
        userLimit: 10,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect] },
          { id: verifiedRole.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak] },
          ...(MOD_ROLE_ID ? [{
            id: MOD_ROLE_ID,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.MoveMembers]
          }] : [])
        ]
      });

      const map = maps[Math.floor(Math.random() * maps.length)];

      const container = buildAnnounceContainer({
  waitingVCId: waitingVC.id,
  mode: '5v5',
  code: valorantCode,
  organisateur: interaction.member.displayName,
  remaining: 10,
  votes: 0,
  needed: 6,
  playersText: '-# ᴀᴜᴄᴜɴ',
  mapName: map.name,
  mapImage: map?.image,
  footerIcon: interaction.user.displayAvatarURL({
  size: 256
})
});

const row = new ActionRowBuilder().addComponents(

  new ButtonBuilder()
    .setCustomId('join_game')
    .setLabel('Rejoindre la partie')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('change_map')
    .setLabel('Changer la map')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('start')
    .setLabel('Équilibrer les équipes')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('cancel_registration')
    .setLabel('Annuler')
    .setStyle(ButtonStyle.Secondary)
);

// Les boutons sont intégrés DANS le container V2
container.addActionRowComponents(row);

const msg = await interaction.channel.send({
  components: [container],
  flags: MessageFlags.IsComponentsV2
});

      const newGame = {
        id: msg.id,
        messageId: msg.id,
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
        creatorAvatar: interaction.user.displayAvatarURL({
  size: 256
}),
      };

      gamesData.games.push(newGame);
      await saveGame(newGame);
      return simpleEditReply(
  interaction,
  '✅ Partie créée.'
);
    }

// ── SELECT MENU OBSERVER ──
if (
  interaction.isStringSelectMenu() &&
  interaction.customId.startsWith('spectate_select_')
) {

  if (!isVerified) {
  return simpleReply(
    interaction,
    '⛔ Seuls les Vérifiés peuvent observer.'
  );
}

if (!game) {
  return simpleReply(
    interaction,
    "❌ Cette partie n'existe plus."
  );
}

  await interaction.deferUpdate();

  const choice = interaction.values[0];
  const att = interaction.guild.channels.cache.get(game.attVC);
  const def = interaction.guild.channels.cache.get(game.defVC);
  const vc = (choice === 'attack' ? att : def) || waitingVC;

  if (!vc) {
  return simpleEditReply(
    interaction,
    '❌ Aucun salon disponible.'
  );
}

  await moveVerifiedToVC(interaction.member, vc);

  if (!game.spectators) game.spectators = {};

  game.spectators[interaction.user.id] = choice;

  saveGameDebounced(game);

  await updateRegistrationEmbed(
    interaction.guild,
    game
  );

  return simpleEditReply(
  interaction,
  `✅ Tu observes les ${
    choice === 'attack'
      ? 'attaquants'
      : 'défenseurs'
  } !`
);
}

if (interaction.isButton()) {
      switch (interaction.customId) {

        
case 'join_game': {

  if (!game) {
  return simpleReply(
    interaction,
    "❌ Cette partie n'existe plus."
  );
}

  const prepVC = interaction.guild.channels.cache.get(game.waitingVC);

  if (!prepVC) {
  return simpleReply(
    interaction,
    '❌ Le salon vocal de préparation est introuvable.'
  );
}

  if (game.players.includes(interaction.user.id)) {
  return simpleReply(
    interaction,
    '✅ Tu participes déjà à cette partie.'
  );
}

  if (game.players.length >= 10) {
  return simpleReply(
    interaction,
    '❌ La partie est déjà complète.'
  );
}

  if (!interaction.member.voice?.channel) {
  return simpleReply(
    interaction,
    '❌ Connecte-toi d’abord à un salon vocal du serveur.'
  );
}

  await interaction.member.voice
    .setChannel(prepVC)
    .catch(() => null);

  return simpleReply(
  interaction,
  '✅ Tu as rejoint la partie.'
);
}

        case 'change_map': {
          if (!game) {
  return simpleReply(
    interaction,
    "❌ Cette partie n'existe plus."
  );
}

          const voterId = interaction.user.id;
          const prepVC = interaction.guild.channels.cache.get(game.waitingVC);
          const inPrepVC = prepVC?.members?.has(voterId);

          if (!inPrepVC) {
  return simpleReply(
    interaction,
    '❌ Tu dois être dans le vocal de préparation pour voter.'
  );
}

if (!game.changeMapVotes) game.changeMapVotes = [];

if (game.changeMapVotes.includes(voterId)) {
  return simpleReply(
    interaction,
    '✅ Tu as déjà voté pour changer la map.'
  );
}

game.changeMapVotes.push(voterId);

          const needed = 6;
          const votes = game.changeMapVotes.length;

          if (votes >= needed) {
            const currentName = game.mapName;
            const pool = maps.filter(m => m.name !== currentName);
            const newMap = pool.length ? pool[Math.floor(Math.random() * pool.length)] : maps[Math.floor(Math.random() * maps.length)];

            game.mapName = newMap.name;
            game.mapImage = newMap.image;
            game.changeMapVotes = [];
            saveGameDebounced(game);

            await updateRegistrationEmbed(interaction.guild, game);

            return simpleReply(
  interaction,
  `🗺️ **Map changée !** Nouvelle map : **${game.mapName}** (votes reset)`
);
          }

          await saveGame(game);
          await updateRegistrationEmbed(interaction.guild, game);

          return simpleReply(
  interaction,
  `✅ Vote enregistré (${votes}/${needed}).`
);
        }

        case 'cancel_registration': {
          const WAITING_ROOM_ID = '1474562499897594071';
          const lobbyVC = interaction.guild.channels.cache.get(WAITING_ROOM_ID);

          if (!lobbyVC) {
  return simpleReply(
    interaction,
    "❌ Salon 'salle d'attente' introuvable."
  );
}
          

          if (game.players?.length) {
            await Promise.all(game.players.map(async (id) => {
              const member = interaction.guild.members.cache.get(id) || null;
              if (member?.voice?.channel) {
                await member.voice.setChannel(lobbyVC).catch(() => {});
              }
            }));
          }

          if (game.spectators) {
            await Promise.all(Object.keys(game.spectators).map(async (id) => {
              const member = interaction.guild.members.cache.get(id) || null;
              if (member?.voice?.channel) {
                await member.voice.setChannel(lobbyVC).catch(() => {});
              }
            }));
          }

          const toDelete = [game.attVC, game.defVC, game.waitingVC, game.categoryId].filter(Boolean);

          await Promise.all(toDelete.map(async (id) => {
            const ch = interaction.guild.channels.cache.get(id);
            if (ch) await ch.delete().catch(() => {});
          }));

          const registrationMsg = await interaction.channel.messages.fetch(game.messageId || game.id).catch(() => null);
          if (registrationMsg?.deletable) {
            registrationMsg.delete().catch(() => {});
          }

          gamesData.games = gamesData.games.filter(g => g.id !== game.id);
          await deleteGame(game.id);

          try {
  if (!interaction.replied && !interaction.deferred) {
    await simpleReply(
      interaction,
      "❌ Partie annulée : joueurs/spectateurs renvoyés en salle d'attente."
    );
  } else {
    await interaction.followUp({
      components: [
        buildSimpleContainer(
          "❌ Partie annulée : joueurs/spectateurs renvoyés en salle d'attente."
        )
      ],
      flags:
        MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2
    });
  }
} catch {}

          if (gameLocks[game.id]) delete gameLocks[game.id];
          break;
        }

        case 'start': {
  await simpleReply(
    interaction,
    '⏳ Lancement de la partie...'
  );

          const verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Vérifié');
          if (!verifiedRole) {
  return simpleEditReply(
    interaction,
    '⚠️ Rôle Vérifié introuvable.'
  );
}

          if (!TEST_MODE && game.players.length !== 10) {
  return simpleEditReply(
    interaction,
    `❌ La partie doit obligatoirement être lancée en **5v5**.\nActuellement : **${game.players.length}/10 joueurs**.`
  );
}

if (TEST_MODE && game.players.length < 1) {
  return simpleEditReply(
    interaction,
    '❌ Il faut au moins 1 joueur pour lancer le test.'
  );
}

          const registrationMsg = await interaction.channel.messages.fetch(game.messageId || game.id).catch(() => null);
          if (registrationMsg?.deletable) {
            registrationMsg.delete().catch(() => {});
          }

          function balanceTeams(players) {

  players.sort((a, b) => b.rankValue - a.rankValue);

  // ── MODE TEST : fonctionne avec 1, 2, 3... joueurs ──
  if (TEST_MODE && players.length !== 10) {

    const attackers = [];
    const defenders = [];

    let sumA = 0;
    let sumB = 0;

    for (const player of players) {

      if (sumA <= sumB) {
        attackers.push(player);
        sumA += player.rankValue;
      } else {
        defenders.push(player);
        sumB += player.rankValue;
      }
    }

    return {
      attackers,
      defenders
    };
  }

  // ── MODE NORMAL : vrai 5v5 ──
  if (players.length !== 10) {
    throw new Error(
      `Équilibrage impossible : ${players.length} joueurs au lieu de 10.`
    );
  }

  let best = null;

  function combinations(arr, k, start = 0, combo = [], result = []) {
    if (combo.length === k) {
      result.push([...combo]);
      return result;
    }

    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      combinations(arr, k, i + 1, combo, result);
      combo.pop();
    }

    return result;
  }

  const allAttackCombinations = combinations(players, 5);

  for (const attackers of allAttackCombinations) {

    const attackerIds = new Set(
      attackers.map(p => p.id)
    );

    const defenders = players.filter(
      p => !attackerIds.has(p.id)
    );

    const sumA = attackers.reduce(
      (sum, p) => sum + p.rankValue,
      0
    );

    const sumB = defenders.reduce(
      (sum, p) => sum + p.rankValue,
      0
    );

    const diff = Math.abs(sumA - sumB);

    if (!best || diff < best.diff) {
      best = {
        attackers,
        defenders,
        diff
      };
    }
  }

  return {
    attackers: best.attackers,
    defenders: best.defenders
  };
}

          const RANK_VALUES_BY_ID = {
            '1114187578866933790': 70, '1114182691550658650': 61, '1461352160850870427': 55,
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
          if (
  !TEST_MODE &&
  (balanced.attackers.length !== 5 || balanced.defenders.length !== 5)
) {
  return simpleEditReply(
    interaction,
    '❌ Erreur équilibrage : impossible de créer un vrai 5v5.'
  );
}

          game.attackers = balanced.attackers.map(p => ({ id: p.id, member: p.member }));
          game.defenders = balanced.defenders.map(p => ({ id: p.id, member: p.member }));

          const attSum = balanced.attackers.reduce((sum, p) => sum + p.rankValue, 0);
          const defSum = balanced.defenders.reduce((sum, p) => sum + p.rankValue, 0);
          console.log(`Équilibrage — Attaquants: ${attSum} | Défenseurs: ${defSum} | Diff: ${Math.abs(attSum - defSum)}`);

          const everyoneRole = interaction.guild.roles.everyone;
          const category = interaction.guild.channels.cache.get(game.categoryId);

          for (const id of [game.attVC, game.defVC]) {
            const ch = interaction.guild.channels.cache.get(id);
            if (ch) await ch.delete().catch(() => {});
          }

          const attVC = await interaction.guild.channels.create({
            name: '┃attaquants',
            type: 2,
            parent: category?.id,
            userLimit: 5,
            permissionOverwrites: [
              { id: everyoneRole.id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect] },
              { id: VERIFIED_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel], deny: [PermissionsBitField.Flags.Connect] },
              ...game.attackers.map(p => ({
                id: p.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
              })),
            ],
          });

          const defVC = await interaction.guild.channels.create({
            name: '┃défenseurs',
            type: 2,
            parent: category?.id,
            userLimit: 5,
            permissionOverwrites: [
              { id: everyoneRole.id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect] },
              { id: VERIFIED_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel], deny: [PermissionsBitField.Flags.Connect] },
              ...game.defenders.map(p => ({
                id: p.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
              })),
            ],
          });

          game.attVC = attVC.id;
          game.defVC = defVC.id;

          await saveGame(game);

          const movePromises = [];

          for (const p of game.attackers) {
            if (p.member?.voice?.channel) movePromises.push(p.member.voice.setChannel(attVC).catch(() => {}));
          }
          for (const p of game.defenders) {
            if (p.member?.voice?.channel) movePromises.push(p.member.voice.setChannel(defVC).catch(() => {}));
          }
          if (game.spectators) {
            for (const [id, choice] of Object.entries(game.spectators)) {
              const member = interaction.guild.members.cache.get(id) || null;
              const vc = choice === 'attack' ? attVC : defVC;
              if (member?.voice?.channel) movePromises.push(member.voice.setChannel(vc).catch(() => {}));
            }
          }

          await Promise.all(movePromises);

          const prepVC = interaction.guild.channels.cache.get(game.waitingVC);
          if (prepVC) await prepVC.delete().catch(() => {});

          const sortTeamByRank = (team) => {
            let data = [];
            for (const player of team) {
              const member = interaction.guild.members.cache.get(player.id) || null;
              if (!member) continue;
              const rankRole = member.roles.cache.find(r => RANK_ORDER[r.name]);
              const rankValue = rankRole ? RANK_ORDER[rankRole.name] : 999;
              const rankEmoji = rankRole ? rankEmojis[rankRole.name] : '<:Unranked:1465744234182086789>';
              data.push({ id: player.id, rankValue, rankEmoji });
            }
            data.sort((a, b) => a.rankValue - b.rankValue);
            return data.map(p => `${p.rankEmoji} <@${p.id}>`).join('\n') || 'Aucun';
          };

          const attackersText = sortTeamByRank(game.attackers);
const defendersText = sortTeamByRank(game.defenders);





const gameContainer = buildInGameContainer({
  attackersText,
  defendersText,
  mapName: game.mapName,
  mapImage: game.mapImage,
  footerText: interaction.member.displayName,
  guild: interaction.guild
});


const buttons = new ActionRowBuilder().addComponents(

  new ButtonBuilder()
  .setCustomId('attack_win')
  .setLabel('Attaquants')
  .setEmoji({ id: '1544390412246974605' })
  .setStyle(ButtonStyle.Secondary),
  
  new ButtonBuilder()
    .setCustomId('spectate')
    .setLabel('Observer la partie')
    .setStyle(ButtonStyle.Secondary),

new ButtonBuilder()
  .setCustomId('defense_win')
  .setLabel('Défenseurs')
  .setEmoji({ id: '1544390421113995274' })
  .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('cancel_game')
    .setLabel('Annuler')
    .setStyle(ButtonStyle.Secondary)
);

gameContainer.addActionRowComponents(buttons);

const inGameMsg = await interaction.channel.send({
  components: [gameContainer],
  flags: MessageFlags.IsComponentsV2
});

game.manageMessageId = inGameMsg.id;
await saveGame(game);
await simpleEditReply(
  interaction,
  '✅ Partie lancée'
);


          break;
        }

        case 'spectate': {
  const verifiedRole = interaction.guild.roles.cache.find(
    r => r.name === 'Vérifié'
  );

  if (!verifiedRole || !interaction.member.roles.cache.has(verifiedRole.id)) {
  return simpleReply(
    interaction,
    '❌ Seuls les membres Vérifiés peuvent observer.'
  );
}

  if (game.players.includes(interaction.user.id)) {
  return simpleReply(
    interaction,
    '❌ Tu es déjà inscrit à la partie.'
  );
}

  const selectMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`spectate_select_${game.id}`)
      .setPlaceholder('Assure toi d\'être dans un salon vocal !')
      .addOptions([
        { label: 'Observer les attaquants', value: 'attack' },
        { label: 'Observer les défenseurs', value: 'defense' }
      ])
  );

  return interaction.reply({
  components: [selectMenu],
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});
}

        case 'attack_win':
        case 'defense_win':
        case 'cancel_game': {
          await interaction.deferUpdate();
          if (!game) return;

          if (gameLocks[game.id]) return;
          gameLocks[game.id] = true;

          try {
            const WAITING_ROOM_ID = '1474562499897594071';
            const waitingVC = interaction.guild.channels.cache.get(WAITING_ROOM_ID);

            if (!waitingVC) {
              console.log("❌ Lobby principal introuvable.");
              return;
            }


            const attChannel = interaction.guild.channels.cache.get(game.attVC);
            const defChannel = interaction.guild.channels.cache.get(game.defVC);

            const attackers = game.attackers.map(p => p.id);
            const defenders = game.defenders.map(p => p.id);
            const allPlayers = [...attackers, ...defenders];

            const liveAttackers = attChannel ? [...attChannel.members.keys()] : [];
            const liveDefenders = defChannel ? [...defChannel.members.keys()] : [];
            const spectatorIds = game.spectators ? Object.keys(game.spectators) : [];

            const everyoneInGameVCs = [...new Set([...liveAttackers, ...liveDefenders, ...allPlayers, ...spectatorIds])];

            const moveMembersToVC = async (ids, vc) => {
              await Promise.all(ids.map(async (id) => {
                const member = interaction.guild.members.cache.get(id) || null;
                if (member?.voice?.channel) await member.voice.setChannel(vc).catch(() => {});
              }));
            };

            await moveMembersToVC(everyoneInGameVCs, waitingVC);

            if (game.manageMessageId) {
              const inGameMsg = await interaction.channel.messages.fetch(game.manageMessageId).catch(() => null);
              if (inGameMsg?.deletable) await inGameMsg.delete().catch(() => {});
            }

            if (interaction.customId === 'cancel_game') {

  for (const id of [game.attVC, game.defVC]) {
    const ch = interaction.guild.channels.cache.get(id);

    if (ch) {
      await ch.delete().catch(() => {});
    }
  }

  if (game.categoryId) {
    const category =
      interaction.guild.channels.cache.get(game.categoryId);

    if (category) {
      await category.delete().catch(() => {});
    }
  }

  gamesData.games = gamesData.games.filter(g => g.id !== game.id);
  await deleteGame(game.id);

  return;
}

            const winningSide = interaction.customId === 'attack_win' ? 'attack' : 'defense';
            const matchRR = {};

for (const playerId of allPlayers) {
  const member =
    interaction.guild.members.cache.get(playerId) ||
    await interaction.guild.members.fetch(playerId).catch(() => null);

  const isWinner =
    (winningSide === 'attack' && attackers.includes(playerId)) ||
    (winningSide === 'defense' && defenders.includes(playerId));

  const delta = getPlayerRRDelta(member, isWinner);

  await incrementPlayerStats(playerId, delta, isWinner);

  matchRR[playerId] = delta;
}

await updateleaderboardEmbed().catch(err =>
  console.error('Erreur update leaderboard après partie :', err)
);

// Supprime les vocaux Attaquants / Défenseurs puis la catégorie
for (const id of [game.attVC, game.defVC]) {
  const ch = interaction.guild.channels.cache.get(id);

  if (ch) {
    await ch.delete().catch(err =>
      console.error(`Erreur suppression salon ${id} :`, err)
    );
  }
}

// La catégorie doit être supprimée APRÈS ses salons
if (game.categoryId) {
  const category =
    interaction.guild.channels.cache.get(game.categoryId);

  if (category) {
    await category.delete().catch(err =>
      console.error('Erreur suppression catégorie de partie :', err)
    );
  }
}

gamesData.games = gamesData.games.filter(g => g.id !== game.id);
await deleteGame(game.id);

  

            const formatResultPlayers = async (ids) => {
  const data = [];

  for (const id of ids) {
    const member =
      interaction.guild.members.cache.get(id) ||
      await interaction.guild.members.fetch(id).catch(() => null);

    if (!member) continue;

    const rankRole = member.roles?.cache?.find(
      r => RANK_ORDER[r.name]
    );

    const rankValue = rankRole
      ? RANK_ORDER[rankRole.name]
      : 999;

    const rankEmoji = rankRole
      ? rankEmojis[rankRole.name]
      : rankEmojis.Unranked;

    const rrDisplay = formatRRDeltaEmoji(matchRR[id]);

    data.push({
      id,
      rankValue,
      rankEmoji,
      rrDisplay,
      displayName: member.displayName
    });
  }

  data.sort((a, b) => a.rankValue - b.rankValue);

  return data;
};



const formattedAttackers = await formatResultPlayers(attackers);

const formattedDefenders = await formatResultPlayers(defenders);


const resultContainer = buildResultContainer({
  attackers: formattedAttackers,
  defenders: formattedDefenders,
  mapName: game.mapName,
  mapImage: game.mapImage,
  validatedBy: interaction.member.displayName,
  winningSide,
  guild: interaction.guild
});

await interaction.channel.send({
  components: [resultContainer],
  flags: MessageFlags.IsComponentsV2
}).catch(console.error);
          } finally {
            delete gameLocks[game.id];
          }

          break;
        }
      }
    }

if (
  interaction.isChatInputCommand() &&
  interaction.commandName === 'addchampion'
) {
  await interaction.deferReply({
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});

  const targetUser =
    interaction.options.getUser('joueur');

  const seasonLabel =
    interaction.options.getString('saison');

  const seasonKey =
    interaction.options.getString('cle');

  if (!/^\d{4}-\d{2}$/.test(seasonKey)) {
    return simpleEditReply(
      interaction,
      '❌ La clé doit être au format **AAAA-MM**. Exemple : `2026-08`.'
    );
  }

  const member = await interaction.guild.members
    .fetch(targetUser.id)
    .catch(() => null);

  if (!member) {
    return simpleEditReply(
      interaction,
      '❌ Ce joueur n’est plus présent sur le serveur.'
    );
  }

  await saveSeasonChampion({
    seasonKey,
    seasonLabel,
    userId: targetUser.id
  });

  if (!member.roles.cache.has(WINNER_ROLE_ID)) {
    await member.roles.add(
      WINNER_ROLE_ID,
      `Vainqueur — ${seasonLabel}`
    ).catch(() => {});
  }

  return simpleEditReply(
    interaction,
    `🏆 **${targetUser.username}** a été ajouté au palmarès — **${seasonLabel}**.`
  );
}



    if (interaction.isChatInputCommand() && interaction.commandName === 'manage') {
      const targetUser = interaction.options.getUser('joueur');
      const userStats = await getPlayerPoints(targetUser.id);

      const manageContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)

  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:VIDE:1493046347337699499> GESTION DE ${targetUser.username.toUpperCase()}\n` +
          `-# ʀʀ ᴀᴄᴛᴜᴇʟ : **${userStats.rr} RR**\n` +
          `-# ᴘᴀʀᴛɪᴇꜱ ᴊᴏᴜᴇᴇꜱ : **${userStats.games}**\n` +
          `-# ᴠɪᴄᴛᴏɪʀᴇꜱ : **${userStats.wins}**\n` +
          `-# ᴜᴛɪʟɪꜱᴇ ʟᴇꜱ ʙᴏᴜᴛᴏɴꜱ ᴄɪ-ᴅᴇꜱꜱᴏᴜꜱ ᴘᴏᴜʀ ɢᴇʀᴇʀ ᴄᴇ ᴊᴏᴜᴇᴜʀ`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          targetUser.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  )

  .addSeparatorComponents(
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
  );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`manage_add_${targetUser.id}`).setLabel('+ Ajouter RR').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`manage_remove_${targetUser.id}`).setLabel('- Retirer RR').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`manage_reset_${targetUser.id}`).setLabel('🔄 Reset Complet').setStyle(ButtonStyle.Secondary)
      );

      manageContainer.addActionRowComponents(row);

      return interaction.reply({
  components: [manageContainer],
  flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
});
    }


    function getRankEmojiFromMember(member) {
  if (!member) return rankEmojis.Unranked || '';

  const rankKey = Object.entries(RANK_ROLES).find(
    ([, roleId]) => member.roles.cache.has(roleId)
  )?.[0];

  if (!rankKey) {
    return rankEmojis.Unranked || '';
  }

  const emojiKey = rankKey.replace(/([A-Za-z]+)(\d)$/, '$1 $2');

  return rankEmojis[emojiKey] || '';
}

    function memberHasSelectedRank(member) {
      if (!member?.roles?.cache) return false;
      return Object.values(RANK_ROLES).some(roleId => member.roles.cache.has(roleId));
    }

    // --------------------------------------
    // MENU RANK
    // --------------------------------------
    if (interaction.isStringSelectMenu() && interaction.customId === 'rank_select') {
  if (interaction.replied || interaction.deferred) return;

  await interaction.deferUpdate();

  const thread = interaction.channel;

  for (const roleId of Object.values(RANK_ROLES)) {
    if (interaction.member.roles.cache.has(roleId)) {
      await interaction.member.roles.remove(roleId).catch(() => {});
    }
  }

  const selectedRank = interaction.values[0];
  const roleIdToAdd = RANK_ROLES[selectedRank];

  await interaction.member.roles.add(roleIdToAdd).catch(() => {});

  const role = interaction.guild.roles.cache.get(roleIdToAdd);

  if (thread?.isThread()) {
    await thread.sendTyping();
    await new Promise(resolve => setTimeout(resolve, 800));
  }

 const peakRankDoneContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## Peak rank défini sur **${role?.name || selectedRank}**\n` +
      `-# Parfait. Il ne te reste plus qu'à renseigner ton **pseudo VALORANT** pour terminer la vérification.`
    )
  );

await thread.send({
  components: [peakRankDoneContainer],
  flags: MessageFlags.IsComponentsV2
});

  if (thread?.isThread()) {
    await thread.sendTyping();
    await new Promise(resolve => setTimeout(resolve, 700));
  }

  const riotButton = new ButtonBuilder()
    .setCustomId('verify_riot')
    .setLabel(`Me renommer pour débloquer l'accès`)
    .setEmoji({ id: '1493378334326001816' })
    .setStyle(ButtonStyle.Primary);

 const riotContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `-# Clique sur le bouton ci-dessous puis entre ton pseudo **IN-GAME**, sans le #TAG.`
    )
  )
  .addActionRowComponents(
    new ActionRowBuilder().addComponents(riotButton)
  );

await thread.send({
  components: [riotContainer],
  flags: MessageFlags.IsComponentsV2
});

  return;
}


    // --------------------------------------
    // MODAL RIOT
    // --------------------------------------
    if (interaction.isModalSubmit() && interaction.customId === 'riot_modal') {
      if (interaction.replied || interaction.deferred) return;

      const pseudo = interaction.fields.getTextInputValue('riot_pseudo');

      await setRiotUser(interaction.user.id, { pseudo });
      await interaction.member.setNickname(pseudo).catch(() => {});

      await interaction.reply({
  content: 'Vérification en cours…',
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});

await interaction.deleteReply().catch(() => {});

const thread = interaction.channel;

if (thread?.isThread?.()) {
  await thread.sendTyping();
  await new Promise(resolve => setTimeout(resolve, 700));
}

const verificationDoneContainer = new ContainerBuilder()
  .setAccentColor(0xc5b174)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ${interaction.member.displayName}, vérification terminée !\n` +
      `-# Ton pseudo VALORANT a été défini sur **${pseudo}**.\n` +
      `-# Tes salons vont être débloqués dans quelques secondes...`
    )
  );

await thread.send({
  components: [verificationDoneContainer],
  flags: MessageFlags.IsComponentsV2
});

await thread.sendTyping();
await new Promise(resolve => setTimeout(resolve, 500));

const buildCountdownContainer = (number) =>
  new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# ${number}`)
    );

const countdownMessage = await thread.send({
  components: [buildCountdownContainer(5)],
  flags: MessageFlags.IsComponentsV2
});

for (let i = 4; i >= 1; i--) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  await countdownMessage.edit({
    components: [buildCountdownContainer(i)]
  });
}

await new Promise(resolve => setTimeout(resolve, 1000));

await interaction.member.roles.add(ROLE_VERIFIE).catch(() => {});
await interaction.member.roles.add(ROLE_NOTIF_PP).catch(() => {});

const accessUnlockedContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ✅ Accès débloqué !\n` +
      `-# Bienvenue sur **VALORANT PP**, amuse-toi bien !`
    )
  );

await countdownMessage.edit({
  components: [accessUnlockedContainer]
});

if (thread?.isThread?.()) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  await thread.setLocked(true).catch(() => {});
  await thread.setArchived(true).catch(() => {});
  await thread.delete().catch(() => {});
}

return;
    }

    if (interaction.isChatInputCommand() && interaction.commandName === 'leaderboard') {

  await interaction.deferReply({
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});

  const container = buildLeaderboardContainer({
    sorted: [],
    totalInvitesPerMember: {},
    guildMembersCache: null,
    playerCount: 0
  });

  const msg = await interaction.channel.send({
    components: [container],
    flags: MessageFlags.IsComponentsV2
  });

  await setConfigValue('leaderboardData', {
    messageId: msg.id,
    channelId: interaction.channel.id
  });

  await updateleaderboardEmbed();

 return simpleEditReply(
  interaction,
  '✅ Leaderboard créé dans ce salon.'
);
}


    // ── Gestion du modal TICKET REASON ──
    if (interaction.isModalSubmit() && interaction.customId === 'ticket_reason_modal') {
      await interaction.deferReply({
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});

      const guild = interaction.guild;
      const member = interaction.member;
      const reason = interaction.fields.getTextInputValue('ticket_reason') || '';

      const safeReason = reason
  .toLowerCase()
  .trim()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/(^-|-$)/g, '')
  .slice(0, 30);

      const finalReason = safeReason || 'demande';

      const configFile = path.join(__dirname, 'data', 'config.json');
      if (!fs.existsSync(configFile)) {
  return simpleEditReply(
    interaction,
    '❌ Configuration manquante. Redémarre le bot pour créer la catégorie ᴍᴏᴅᴇʀᴀᴛɪᴏɴ.'
  );
}

      const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      const ticketCategoryId = config.ticketCategoryId;

      const existingTicket = guild.channels.cache.find(ch =>
  ch.parentId === ticketCategoryId &&
  ch.name.startsWith('┃ticket-') &&
  ch.permissionOverwrites?.cache?.has(member.id)
);

if (existingTicket) {
  return simpleEditReply(
    interaction,
    `❌ Tu as déjà un ticket ouvert : <#${existingTicket.id}>`
  );
}

const staffRole = guild.roles.cache.find(r => r.name === 'Administrateur');

if (!staffRole) {
  return simpleEditReply(
    interaction,
    '❌ Erreur : Le rôle Administrateur n\'existe pas. Redémarre le bot.'
  );
}

      const ticketChannel = await guild.channels.create({
        name: `┃ticket-${finalReason}`,
        type: 0,
        parent: ticketCategoryId,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          {
            id: member.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
              PermissionsBitField.Flags.AttachFiles
            ]
          },
          {
            id: staffRole.id,
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

      const closeButton = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(`close_ticket_${member.id}`)
    .setLabel('Clôturer la discussion')
    .setStyle(ButtonStyle.Secondary)
);

const ticketContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)

  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:VIDE:1493046347337699499> NOUVELLE DEMANDE\n` +
          `-# Ticket ouvert par **${member.displayName}**\n` +
          `-# Motif : **${reason || 'Demande'}**\n` +
          `-# Décris-nous ta demande plus en détail afin que l'équipe puisse t'aider`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          member.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  )

  .addSeparatorComponents(
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
  )

  .addActionRowComponents(
    closeButton
  );

await ticketChannel.send({
  components: [ticketContainer],
  flags: MessageFlags.IsComponentsV2
});

return simpleEditReply(
  interaction,
  `✅ Ton ticket a été créé : <#${ticketChannel.id}>`
);
}

    // ── Gestion du modal MANAGE ──
    if (interaction.isModalSubmit() && interaction.customId.startsWith('manage_modal_')) {
      await interaction.deferReply({
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});

      const [, , type, userId] = interaction.customId.split('_');
      const amount = parseInt(interaction.fields.getTextInputValue('rr_amount'));

      if (isNaN(amount) || amount <= 0) {
  return simpleEditReply(
    interaction,
    '❌ Montant invalide. Veuillez entrer un nombre positif.'
  );
}

const currentStats = await getPlayerPoints(userId);

      if (type === 'add') {
        currentStats.rr += amount;
      } else if (type === 'remove') {
        currentStats.rr -= amount;
        if (currentStats.rr < 0) currentStats.rr = 0;
      }

      await setPlayerPoints(userId, currentStats);
      await updateleaderboardEmbed();

      const actionText = type === 'add' ? 'ajouté' : 'retiré';

return simpleEditReply(
  interaction,
  `✅ ${amount} ʀʀ ${actionText} pour <@${userId}>. Nouveau total : **${currentStats.rr} ʀʀ**`
);
}

} catch (err) {
  console.error(err);
}
});



client.on('voiceStateUpdate', async (oldState, newState) => {
  const guild = newState.guild || oldState.guild;
  if (!guild) return;

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
        saveGameDebounced(affectedGame);
        scheduleRegistrationUpdate(guild, affectedGame);
      }
    }

    if (oldState.channelId === affectedGame.waitingVC && oldState.channelId !== newState.channelId) {
      affectedGame.players = affectedGame.players.filter(id => id !== oldState.member.id);
      saveGameDebounced(affectedGame);
      scheduleRegistrationUpdate(guild, affectedGame);
    }
  }

  if (newState.channelId === AUTO_CREATE_VC_ID) {
    const member = newState.member;
    if (!member) return;

    if (autoCreateLocks.has(member.id)) return;
    autoCreateLocks.set(member.id, true);

    try {
      if (member.voice.channelId !== AUTO_CREATE_VC_ID) return;

      const verifiedRoleId = ROLE_VERIFIE;
      const everyoneRoleId = guild.id;

      const channel = await guild.channels.create({
        name: `${member.displayName}`,
        type: 2,
        parent: TEMP_VOCAL_CATEGORY_ID,
        permissionOverwrites: [
          { id: everyoneRoleId, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect] },
          {
            id: verifiedRoleId,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
            deny: [PermissionsBitField.Flags.ManageChannels]
          },
          {
            id: member.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ManageChannels]
          }
        ]
      });

      const createVC = guild.channels.cache.get(AUTO_CREATE_VC_ID);
      if (createVC && createVC.parentId === TEMP_VOCAL_CATEGORY_ID) {
        await channel.setPosition(createVC.rawPosition + 1).catch(() => {});
      }

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

  const leftChannel = oldState.channel;

  if (
    leftChannel &&
    leftChannel.type === 2 &&
    leftChannel.parentId === TEMP_VOCAL_CATEGORY_ID &&
    leftChannel.members.size === 0 &&
    !EXEMPT_VC_IDS.includes(leftChannel.id)
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

  if (accountAgeDays < MIN_ACCOUNT_AGE_DAYS) {
    const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

    if (welcomeChannel) {
      const restrictedContainer = new ContainerBuilder()
  .setAccentColor(0xe70019)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:Roles:1493073492856406156> COMPTE RESTREINT\n` +
          `-# ${member}\n` +
          `-# Ton compte a seulement **${accountAgeDays} jours**`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          member.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

    await welcomeChannel.send({
        components: [restrictedContainer],
        flags: MessageFlags.IsComponentsV2
      }).catch(() => {});
    }

    return;
  }

  try {
    const accueilChannel = member.guild.channels.cache.get(ACCUEIL_CHANNEL_ID);
    if (accueilChannel) {
      const thread = await accueilChannel.threads.create({
        name: `${member.displayName}`,
        autoArchiveDuration: 1440,
        type: ChannelType.PrivateThread
      });

      await thread.members.add(member.id);

await thread.sendTyping();
await new Promise(resolve => setTimeout(resolve, 800));

const verifyWelcomeContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ${member.displayName}, bienvenue sur <:Roles:1493046347337699499> **VALORANT PP**`
    )
  );

await thread.send({
  components: [verifyWelcomeContainer],
  flags: MessageFlags.IsComponentsV2
});

await thread.sendTyping();
await new Promise(resolve => setTimeout(resolve, 700));

const verifyInstructionsContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `-# Pour débloquer l'accès au serveur, nous avons besoin de quelques informations.\n` +
      `-# Commence par sélectionner le **plus haut rank que tu as atteint sur VALORANT**.`
    )
  );

await thread.send({
  components: [verifyInstructionsContainer],
  flags: MessageFlags.IsComponentsV2
});

await thread.sendTyping();
await new Promise(resolve => setTimeout(resolve, 700));

const rankMenu = new StringSelectMenuBuilder()
  .setCustomId('rank_select')
  .setPlaceholder('Sélectionne ton peak rank')
  .setMinValues(1)
  .setMaxValues(1)
  .addOptions([
    { label: 'Radiant', value: 'Radiant', emoji: { id: '1461399011712958703' } },
    { label: 'Immortal 3', value: 'Immortal3', emoji: { id: '1461399034165068063' } },
    { label: 'Immortal 2', value: 'Immortal2', emoji: { id: '1461399056449274171' } },
    { label: 'Immortal 1', value: 'Immortal1', emoji: { id: '1461399078616170516' } },
    { label: 'Ascendant 3', value: 'Ascendant3', emoji: { id: '1461399102116856001' } },
    { label: 'Ascendant 2', value: 'Ascendant2', emoji: { id: '1461399120240574586' } },
    { label: 'Ascendant 1', value: 'Ascendant1', emoji: { id: '1461399137076379648' } },
    { label: 'Diamond 3', value: 'Diamond3', emoji: { id: '1461399154805964963' } },
    { label: 'Diamond 2', value: 'Diamond2', emoji: { id: '1461399171838902292' } },
    { label: 'Diamond 1', value: 'Diamond1', emoji: { id: '1461399187362152480' } },
    { label: 'Platinum 3', value: 'Platinum3', emoji: { id: '1461399203065368619' } },
    { label: 'Platinum 2', value: 'Platinum2', emoji: { id: '1461399220035784928' } },
    { label: 'Platinum 1', value: 'Platinum1', emoji: { id: '1461399234778501345' } },
    { label: 'Gold 3', value: 'Gold3', emoji: { id: '1461399252814135338' } },
    { label: 'Gold 2', value: 'Gold2', emoji: { id: '1461399269151084604' } },
    { label: 'Gold 1', value: 'Gold1', emoji: { id: '1461399285429043251' } },
    { label: 'Silver 3', value: 'Silver3', emoji: { id: '1461399305993846785' } },
    { label: 'Silver 2', value: 'Silver2', emoji: { id: '1461399321642532874' } },
    { label: 'Silver 1', value: 'Silver1', emoji: { id: '1461399338965270538' } },
    { label: 'Bronze 3', value: 'Bronze3', emoji: { id: '1461399355465666722' } },
    { label: 'Bronze 2', value: 'Bronze2', emoji: { id: '1461399372779749457' } },
    { label: 'Bronze 1', value: 'Bronze1', emoji: { id: '1461399395605024972' } },
    { label: 'Iron 3', value: 'Iron3', emoji: { id: '1461399413619429472' } },
    { label: 'Iron 2', value: 'Iron2', emoji: { id: '1461399435924865127' } },
    { label: 'Iron 1', value: 'Iron1', emoji: { id: '1461399458246955195' } }
  ]);

const rankMenuContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addActionRowComponents(
    new ActionRowBuilder().addComponents(rankMenu)
  );

await thread.send({
  components: [rankMenuContainer],
  flags: MessageFlags.IsComponentsV2
});

    }
  } catch (err) {
    console.error('Erreur thread bienvenue :', err);
  }

  const guild = member.guild;
  const cachedInvites = invitesCache.get(guild.id) || new Map();
  const guildInvites = await guild.invites.fetch();
  const newInvites = new Map();

  guildInvites.forEach(inv => {
    newInvites.set(inv.code, {
      code: inv.code,
      inviter: inv.inviter || null,
      uses: inv.uses,
      maxAge: inv.maxAge,
      temporary: inv.temporary
    });
  });

  let usedInvite;
  for (const [code, invite] of newInvites.entries()) {
    const oldUses = cachedInvites.get(code)?.uses || 0;
    if (invite.uses > oldUses) {
      usedInvite = invite;
      break;
    }
  }

  invitesCache.set(guild.id, newInvites);

  let inviterTag = '.gg/valorant-pp';
  if (usedInvite?.inviter) {
    inviterTag = usedInvite.inviter.tag;
  }

  const memberJoinDate = member.user.createdAt;
  const accountAge = Math.floor((Date.now() - memberJoinDate) / (1000 * 60 * 60 * 24));

  const welcomeChannel = guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!welcomeChannel) return;

  const inviterText = usedInvite?.inviter
  ? `-# Invité par **${usedInvite.inviter.displayName || usedInvite.inviter.tag}**`
  : `-# Invité via **.gg/valorant-pp**`;

const welcomeContainer = new ContainerBuilder()
  .setAccentColor(0xc5b174)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:Roles:1493046347337699499> NOUVEAU MEMBRE\n` +
          `-# **${member.user.tag}** (<@${member.id}>)\n` +
          `-# Actif sur Discord depuis ${accountAge} jours\n` +
          inviterText
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          member.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await welcomeChannel.send({
  components: [welcomeContainer],
  flags: MessageFlags.IsComponentsV2
});

if (usedInvite) {
  const inviterId = usedInvite.inviter?.id;

  if (inviterId) {
    await incrementInvite(inviterId, member.id);
  }
}

});

client.on('guildMemberRemove', async member => {
  try {
    let wasBanned = false;

    try {
      const logs = await member.guild.fetchAuditLogs({ type: 22, limit: 10 });
      const entry = logs.entries.find(entry =>
        entry.target?.id === member.id && Date.now() - entry.createdTimestamp < 15000
      );
      if (entry) wasBanned = true;
    } catch (err) {
      console.error('Erreur audit logs guildMemberRemove :', err);
    }

    if (wasBanned) return;

    const leaveChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!leaveChannel) return;

    function formatServerDuration(joinedAt) {
      if (!joinedAt) return 'une durée inconnue';
      const diffMs = Date.now() - joinedAt.getTime();
      const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      if (totalDays < 1) return 'moins d\u2019un jour';
      if (totalDays === 1) return '1 jour';
      return `${totalDays} jours`;
    }

    const serverDuration = formatServerDuration(member.joinedAt);

    const leaveContainer = new ContainerBuilder()
  .setAccentColor(0xe70019)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:Roles:1493073492856406156> DÉPART DU SERVEUR\n` +
          `-# **${member.user.tag}** (<@${member.id}>)\n` +
          `-# aura tenu ${serverDuration} sur le serveur`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          member.user.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await leaveChannel.send({
  components: [leaveContainer],
  flags: MessageFlags.IsComponentsV2
});
  } catch (err) {
    console.error('Erreur lors de l\'embed de départ :', err);
  }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  try {

    const hadOGRole =
  oldMember.roles.cache.has(OG_ROLE_ID);

const hasOGRole =
  newMember.roles.cache.has(OG_ROLE_ID);

if (!hadOGRole && hasOGRole) {
  const ogAddedContainer = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## ${BADGES.OG} NOUVEAU MEMBRE OG\n` +
            `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
            `-# En remerciement d'avoir été là depuis les débuts de **VALORANT PP**.`
          )
        )

        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            newMember.displayAvatarURL({
              extension: 'png',
              size: 256
            })
          )
        )
    );

  await sendActivityMessage(newMember.guild, {
    components: [ogAddedContainer],
    flags: MessageFlags.IsComponentsV2
  });
}

    const hadOrganizerRole =
  oldMember.roles.cache.has(ORGANIZER_ROLE_ID);

const hasOrganizerRole =
  newMember.roles.cache.has(ORGANIZER_ROLE_ID);

if (!hadOrganizerRole && hasOrganizerRole) {
  const organizerAddedContainer = new ContainerBuilder()
    .setAccentColor(0x57f287)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## NOUVEL ORGANISATEUR DE PARTIES\n` +
            `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
            `-# Le rôle **Organisateur de parties** vient de lui être attribué.`
          )
        )

        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            newMember.displayAvatarURL({
              extension: 'png',
              size: 256
            })
          )
        )
    );

  await sendActivityMessage(newMember.guild, {
    components: [organizerAddedContainer],
    flags: MessageFlags.IsComponentsV2
  });
}

if (hadOrganizerRole && !hasOrganizerRole) {
  const organizerRemovedContainer = new ContainerBuilder()
    .setAccentColor(0x858585)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## RÔLE ORGANISATEUR RETIRÉ\n` +
            `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
            `-# Le rôle **Organisateur de parties** vient de lui être retiré.`
          )
        )

        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            newMember.displayAvatarURL({
              extension: 'png',
              size: 256
            })
          )
        )
    );

  await sendActivityMessage(newMember.guild, {
    components: [organizerRemovedContainer],
    flags: MessageFlags.IsComponentsV2
  });
}


    const wasBooster = oldMember.roles.cache.has(BOOSTER_ROLE_ID);
    const isBooster = newMember.roles.cache.has(BOOSTER_ROLE_ID);

    if (!wasBooster && isBooster) {
      const boostContainer = new ContainerBuilder()
  .setAccentColor(0xff73fa)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:Bonus20:1492125876437913641> NOUVEAU BOOST\n` +
          `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
          `-# Le bonus vient d'être activé`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          newMember.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await sendActivityMessage(newMember.guild, {
  components: [boostContainer],
  flags: MessageFlags.IsComponentsV2
});
    }

    if (wasBooster && !isBooster) {
  const boostExpiredContainer = new ContainerBuilder()
  .setAccentColor(0x858585)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:Bonus20:1543305540594045068> BOOST EXPIRÉ\n` +
          `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
          `-# Le boost a expiré, le bonus associé a été retiré`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          newMember.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await sendActivityMessage(newMember.guild, {
  components: [boostExpiredContainer],
  flags: MessageFlags.IsComponentsV2
});
}

    const oldTimeoutTs =
  oldMember.communicationDisabledUntilTimestamp ?? 0;

const newTimeoutTs =
  newMember.communicationDisabledUntilTimestamp ?? 0;

const timeoutApplied =
  newTimeoutTs > Date.now() &&
  newTimeoutTs !== oldTimeoutTs;

if (timeoutApplied) {
  await incrementPlayerTimeouts(newMember.id)
    .catch(err =>
      console.error('Erreur incrementPlayerTimeouts :', err)
    );

  await updateleaderboardEmbed()
    .catch(err =>
      console.error('Erreur update leaderboard après timeout :', err)
    );

  let reason = 'Non fournie';
  let moderator = null;

  try {
    const logs = await newMember.guild.fetchAuditLogs({
      type: 24,
      limit: 10
    });

    const entry = logs.entries.find(entry =>
      entry.target?.id === newMember.id &&
      Date.now() - entry.createdTimestamp < 15000
    );

    if (entry) {
      moderator = entry.executor || null;

      if (entry.reason) {
        reason = entry.reason;
      }
    }
  } catch (err) {
    console.error('Erreur audit logs timeout :', err);
  }

  const endUnix = Math.floor(newTimeoutTs / 1000);

  const moderatorText = moderator
  ? `Appliquée par **${moderator.displayName || moderator.tag}**`
  : '';

const timeoutContainer = new ContainerBuilder()
  .setAccentColor(0xe70019)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
  `## <:Roles:1493073492856406156> EXCLUSION TEMPORAIRE\n` +
  `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
  `-# L'exclusion prendra fin <t:${endUnix}:R>\n` +
  `-# ${moderatorText} pour ${reason}`
)
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          newMember.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await sendActivityMessage(newMember.guild, {
  components: [timeoutContainer],
  flags: MessageFlags.IsComponentsV2
});

} // fin timeoutApplied

} catch (err) {
  console.error('Erreur guildMemberUpdate activité :', err);
}
}); // fin guildMemberUpdate


client.on('guildBanAdd', async (ban) => {
  try {
    const guild = ban.guild;
    const user = ban.user;

    let reason = 'Non fournie';
    let moderator = null;

    // Discord peut mettre un petit délai avant d'ajouter le ban aux Audit Logs
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Récupère aussi le ban directement pour avoir la raison la plus récente
      const fetchedBan = await guild.bans.fetch(user.id).catch(() => null);

      if (fetchedBan?.reason) {
        reason = fetchedBan.reason;
      }

      const logs = await guild.fetchAuditLogs({
        type: 22,
        limit: 10
      });

      const entry = logs.entries.find(entry =>
        entry.target?.id === user.id &&
        Date.now() - entry.createdTimestamp < 30000
      );

      if (entry) {
        moderator = entry.executor || null;

        // La raison des Audit Logs est prioritaire
        if (entry.reason) {
          reason = entry.reason;
        }
      }

    } catch (err) {
      console.error('Erreur audit logs ban :', err);
    }

    const moderatorText = moderator
  ? `Appliquée par **${moderator.globalName || moderator.username}**`
  : '';

const banContainer = new ContainerBuilder()
  .setAccentColor(0xe70019)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:Roles:1493073492856406156> BANNISSEMENT\n` +
          `-# **${user.tag}** (<@${user.id}>)\n` +
          `-# L'exclusion est définitive\n` +
          `-# ${moderatorText} pour ${reason}`
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          user.displayAvatarURL({
            extension: 'png',
            size: 256
          })
        )
      )
  );

await sendActivityMessage(guild, {
  components: [banContainer],
  flags: MessageFlags.IsComponentsV2
});

  } catch (err) {
    console.error('Erreur embed ban activité :', err);
  }
});



const JOUER_CHANNEL_ID = '1461346832591360173';

client.on('messageCreate', async (message) => {
  try {
    if (!message.guild) return;
    if (message.author.bot) return;

    if (message.channel.id !== JOUER_CHANNEL_ID) return;

    await message.delete().catch(() => {});

    const warningContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ${message.author}, les messages ne sont pas autorisés ici.\n` +
      `-# Ce salon est exclusivement réservé aux parties créées avec **/pp**.`
    )
  );

const warning = await message.channel.send({
  components: [warningContainer],
  flags: MessageFlags.IsComponentsV2
}).catch(() => null);

    if (warning) {
      setTimeout(() => {
        warning.delete().catch(() => {});
      }, 5000);
    }

  } catch (err) {
    console.error('Erreur modération salon rejoindre :', err);
  }
});

client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.channel.id !== CLIPFARMING_CHANNEL_ID) return;

    const userId = message.author.id;
    const now = Date.now();

    if (!spamMap.has(userId)) {
      spamMap.set(userId, []);
    }

    const strike = getActiveStrike(spamStrikeMap, userId, now);
    const penalty = getSpamPenalty(strike);

    let timestamps = (spamMap.get(userId) || []).filter(ts => now - ts < SPAM_INTERVAL);

    timestamps.push(now);
    spamMap.set(userId, timestamps);

    if (timestamps.length > penalty.limit) {
      const member = message.member;

      if (member?.moderatable) {
        try {
          await member.timeout(penalty.durationMs, `Spam dans #clipfarming`);

          addStrike(spamStrikeMap, userId, now);
          spamMap.delete(userId);

          const spamWarningContainer = new ContainerBuilder()
  .setAccentColor(0xe70019)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ⛔ SPAM DÉTECTÉ\n` +
      `-# ${message.author} a été timeout **${penalty.label}** pour spam dans <#${CLIPFARMING_CHANNEL_ID}>.`
    )
  );

const warning = await message.channel.send({
  components: [spamWarningContainer],
  flags: MessageFlags.IsComponentsV2
}).catch(() => null);

          if (warning) {
            setTimeout(() => { warning.delete().catch(() => {}); }, 5000);
          }
        } catch (err) {
          console.error('Erreur timeout anti-spam #clipfarming :', err);
        }
      }

      return;
    }

    const hasBlockedGif = messageContainsBlockedGif(message);

    if (hasBlockedGif) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await message.delete().catch(() => {});

      const gifWarningContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ${message.author}, les **GIF** sont interdits dans ce salon.\n` +
      `-# Tu peux envoyer du **texte**, des **images**, des **vidéos** ou des **liens**, mais pas de GIFs.`
    )
  );

const warning = await message.channel.send({
  components: [gifWarningContainer],
  flags: MessageFlags.IsComponentsV2
}).catch(() => null);

      if (warning) {
        setTimeout(() => { warning.delete().catch(() => {}); }, 5000);
      }

      return;
    }

    

  } catch (err) {
    console.error('Erreur modération #clipfarming :', err);
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const token = (process.env.TOKEN || '').trim();

client.on('error', (err) => {
  console.error("❌ client error :", err);
});

client.on('warn', (msg) => {
  console.warn("⚠️ client warn :", msg);
});

client.on('invalidated', () => {
  console.error("❌ Session invalidated");
});

client.on('shardConnecting', (id) => {
  console.log(`🔌 Shard ${id} connecting...`);
});

client.on('shardReady', (id) => {
  console.log(`✅ Shard ${id} ready`);
});

client.on('shardDisconnect', (event, id) => {
  console.error(`❌ Shard ${id} disconnected. Code: ${event.code}`);
});

client.on('shardError', (error, id) => {
  console.error(`❌ Shard ${id} error:`, error);
});

client.on('shardReconnecting', (id) => {
  console.log(`🔄 Shard ${id} reconnecting...`);
});

console.log("Tentative de connexion Discord...");

client.login(token)
  .then(() => console.log("✅ client.login réussi"))
  .catch((err) => console.error("❌ client.login échoué :", err));
