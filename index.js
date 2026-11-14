require('dotenv').config();
const fs = require('fs');
const path = require('path'); // ← mettre path avant son utilisation
const cheerio = require('cheerio/slim');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const Points = require('./models/Points');
const Invite = require('./models/Invite');
const RiotUser = require('./models/RiotUser');
const Moderation = require('./models/Moderation');
const Config = require('./models/Config');
const Game = require('./models/Game');
const Clip = require('./models/Clip');
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
const TEST_MODE = false;
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
  ContainerBuilder,
  TextDisplayBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  SectionBuilder,
  ThumbnailBuilder,
    AttachmentBuilder,

  Events,
  Partials,
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
const MIN_ACCOUNT_AGE_DAYS = 10;
function formatAccountAge(createdAt) {
  const diffMs = Date.now() - createdAt.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${Math.max(1, minutes)} minute${minutes > 1 ? 's' : ''}`;
  }

  if (hours < 24) {
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  }

  return `${days} jour${days > 1 ? 's' : ''}`;
}

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
  const existingTimeout = saveTimeouts.get(game.id);

  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const timeout = setTimeout(async () => {
    try {
      await saveGame(game);
    } catch (err) {
      console.error(
        `❌ Sauvegarde échouée pour la partie ${game.id} :`,
        err
      );

      setTimeout(() => {
        if (!saveTimeouts.has(game.id)) {
          saveGameDebounced(game);
        }
      }, 5000);
    } finally {
      if (saveTimeouts.get(game.id) === timeout) {
        saveTimeouts.delete(game.id);
      }
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

function containsRealText(content = '') {
  const cleaned = content
    // Emojis Discord custom
    .replace(/<a?:\w+:\d+>/g, '')

    // Emojis Unicode
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\uFE0F\u200D]/g, '')

    // Espaces
    .trim();

  return cleaned.length > 0;
}




const registrationUpdateTimeouts = new Map();
const registrationUpdateQueues = new Map();

function scheduleRegistrationUpdate(guild, game) {
  if (!game?.id) return;

  const existing = registrationUpdateTimeouts.get(game.id);
  if (existing) clearTimeout(existing);

  const timeout = setTimeout(async () => {
    try {
      // Sérialiser les modifications du même message pour éviter les mises à jour concurrentes.
      const previous = registrationUpdateQueues.get(game.id) || Promise.resolve();
      const current = previous.catch(() => {}).then(() => updateRegistrationEmbed(guild, game));
      registrationUpdateQueues.set(game.id, current);
      try {
        await current;
      } finally {
        if (registrationUpdateQueues.get(game.id) === current) {
          registrationUpdateQueues.delete(game.id);
        }
      }
    } catch (err) {
      console.error('Erreur debounce update registration:', err);
    } finally {
      if (
        registrationUpdateTimeouts.get(game.id) === timeout
      ) {
        registrationUpdateTimeouts.delete(game.id);
      }
    }
  }, 200);

  registrationUpdateTimeouts.set(game.id, timeout);
}




// ===== BUILD PLAYER LIST =====
async function buildPlayerList(guild, playerIds) {
  if (!playerIds.length) return '-# ᴀᴜᴄᴜɴ';

  // Récupération simultanée des membres absents du cache (10 joueurs maximum).
  const list = await Promise.all(playerIds.map(async id => {
    const member = guild.members.cache.get(id) ||
      await guild.members.fetch(id).catch(() => null);

    let rankEmoji = rankEmojis.Unranked;
    let rankValue = 1000;

    if (member) {
      const rankRole = member.roles.cache
        .filter(role => RANK_ORDER[role.name] !== undefined)
        .sort((a, b) => RANK_ORDER[a.name] - RANK_ORDER[b.name])
        .first();
      if (rankRole) {
        rankEmoji = rankEmojis[rankRole.name] || rankEmojis.Unranked;
        rankValue = RANK_ORDER[rankRole.name];
      }
    }

    return { id, mention: `<@${id}>`, emoji: rankEmoji, rankValue };
  }));

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

const hasCurrentMapAttachment = registrationMsg.attachments.some(
  attachment => attachment.name === game.mapImage
);

const editPayload = {
  components: [container]
};

if (!hasCurrentMapAttachment) {
  editPayload.files = [{
    attachment: `./assets/maps/${game.mapImage}`,
    name: game.mapImage
  }];
}

await registrationMsg.edit(editPayload);

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

function getPreviousMonthKey(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error(`Mois invalide : ${monthKey}`);
  }

  const previous = new Date(Date.UTC(year, month - 2, 1));

  return (
    `${previous.getUTCFullYear()}-` +
    `${String(previous.getUTCMonth() + 1).padStart(2, '0')}`
  );
}

function getParisMonthKey(date = new Date()) {
  const parts =
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit'
    })
      .formatToParts(date)
      .reduce((acc, part) => {
        if (part.type !== 'literal') {
          acc[part.type] = part.value;
        }

        return acc;
      }, {});

  return `${parts.year}-${parts.month}`;
}

function toSmallCaps(text) {
  const map = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ',
    E: 'ᴇ', F: 'ꜰ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ',
    M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 'ꜱ', T: 'ᴛ',
    U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ',
    É: 'ᴇ', È: 'ᴇ', Ê: 'ᴇ',
    À: 'ᴀ', Ù: 'ᴜ', Ç: 'ᴄ'
  };

  return text
    .toUpperCase()
    .split('')
    .map(char => map[char] || char)
    .join('');
}

const LEADERBOARD_MONTHS = [
  'ᴊᴀɴᴠɪᴇʀ',
  'ꜰᴇᴠʀɪᴇʀ',
  'ᴍᴀʀꜱ',
  'ᴀᴠʀɪʟ',
  'ᴍᴀɪ',
  'ᴊᴜɪɴ',
  'ᴊᴜɪʟʟᴇᴛ',
  'ᴀᴏᴜᴛ',
  'ꜱᴇᴘᴛᴇᴍʙʀᴇ',
  'ᴏᴄᴛᴏʙʀᴇ',
  'ɴᴏᴠᴇᴍʙʀᴇ',
  'ᴅᴇᴄᴇᴍʙʀᴇ'
];

function getLeaderboardMonthLabel(date = new Date()) {
  const month = Number(getParisMonthKey(date).split('-')[1]);
  return LEADERBOARD_MONTHS[month - 1];
}

function getParisMonthLabel(date = new Date()) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    month: 'long'
  })
    .format(date)
    .toUpperCase();
}

function buildClipLikeContainer(clip) {
  const likes = clip.likes?.length || 0;

  const clipUrl =
    `https://discord.com/channels/` +
    `${clip.guildId}/` +
    `${clip.channelId}/` +
    `${clip.messageId}`;

    const isImage =
  clip.mediaType?.startsWith('image/');

const mediaTitle =
  isImage
    ? 'MÉDIA'
    : 'CLIP';

  const container =
    new ContainerBuilder()
      .setAccentColor(EMBED_COLOR)

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:OG:1493378552941252788> ${mediaTitle} DE <@${clip.authorId}>\n`
        )
      )

.addActionRowComponents(
  new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId(
        `clip_like_${clip._id}`
      )
      .setEmoji('1493650946583040000')
      .setLabel(
        `${likes} like${likes > 1 ? 's' : ''}`
      )
      .setStyle(
        ButtonStyle.Secondary
      ),

    new ButtonBuilder()
      .setCustomId(
        'leaderboard_clips'
      )
      .setLabel(
        'Voir le classement'
      )
      .setStyle(
        ButtonStyle.Secondary
      )

  )
);
  return container;
}


async function getPermanentAvatar(user) {
  try {
    const avatarUrl = user.displayAvatarURL({
      extension: 'png',
      size: 256
    });

    const response = await fetch(avatarUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    const fileName = `avatar-${user.id}.png`;

    return {
      url: `attachment://${fileName}`,
      file: {
        attachment: buffer,
        name: fileName
      }
    };

  } catch (err) {
    console.error(
      `❌ Impossible de récupérer l'avatar de ${user.tag}:`,
      err
    );

    return {
      url: user.displayAvatarURL({
        size: 256
      }),
      file: null
    };
  }
}

async function sendActivityMessage(guild, payload) {
  const channel =
    guild.channels.cache.get(ACTIVITIES_CHANNEL_ID) ||
    await guild.channels.fetch(ACTIVITIES_CHANNEL_ID).catch(() => null);

  if (!channel) return null;
  return channel.send(payload).catch(err => {
  console.error('❌ Erreur envoi activité système :', err);
  return null;
});
}

function getModeratorName(guild, moderator) {
  if (!moderator) {
    return '**Administrateur inconnu**';
  }

  const member = guild.members.cache.get(moderator.id);

  return `**${member?.displayName || moderator.globalName || moderator.username}**`;
}

// ✅ Salons vocaux à ne jamais supprimer automatiquement
const EXEMPT_VC_IDS = [
  '1479551340635095270',
  '1479547523201896490', // ✅ salon "créer" à ne jamais supprimer
  '1488654880385007729', // ✅ salon fixe à ne jamais supprimer
];


const invitesCache = new Map();

const vanityCache = new Map();

async function fetchVanityUses(guild) {
  try {
    const data = await guild.fetchVanityData();

    if (!data || data.code !== 'valorant-pp') {
      return null;
    }

    return Number.isInteger(data.uses) ? data.uses : null;
  } catch (err) {
    console.warn(
      `⚠️ Compteur du lien public indisponible pour ${guild.id} :`,
      err.message
    );
    return null;
  }
}


const memberJoinQueues = new Map();

function queueMemberJoin(member, handler) {
  const guildId = member.guild.id;
  const previous = memberJoinQueues.get(guildId) || Promise.resolve();

  const current = previous
    .catch(() => {})
    .then(() => handler(member));

  memberJoinQueues.set(guildId, current);

  current.finally(() => {
    if (memberJoinQueues.get(guildId) === current) {
      memberJoinQueues.delete(guildId);
    }
  }).catch(() => {});

  return current;
}

const autoCreateLocks = new Map();
const ppCreationLocks = new Set();
const gameLocks = {};
const spectatorOriginalNicknames = new Map();

async function markAsSpectator(member) {
  const key = `${member.guild.id}:${member.id}`;

  if (!spectatorOriginalNicknames.has(key)) {
    spectatorOriginalNicknames.set(
      key,
      member.nickname
    );
  }

  const currentName =
    member.displayName.replace(/^👁\s*/, '');

  await member
    .setNickname(`👁 ${currentName}`)
    .catch(() => {});
}

async function restoreSpectatorNickname(member) {
  const key = `${member.guild.id}:${member.id}`;

  if (spectatorOriginalNicknames.has(key)) {
    const originalNickname =
      spectatorOriginalNicknames.get(key);

    spectatorOriginalNicknames.delete(key);

    await member
      .setNickname(originalNickname)
      .catch(() => {});

    return;
  }

  // Sécurité si le bot a redémarré entre-temps
  if (member.nickname?.startsWith('👁')) {
    const restored =
      member.nickname.replace(/^👁\s*/, '');

    await member
      .setNickname(restored || null)
      .catch(() => {});
  }
}

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
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],

  partials: [
    Partials.Message,
    Partials.Channel
  ]
});


client.on('inviteCreate', invite => {
  const guild = invite.guild;
  if (!guild) return;

  const cache = invitesCache.get(guild.id);
  if (!cache) return;

  cache.set(invite.code, {
    code: invite.code,
    inviter: invite.inviter || null,
    uses: invite.uses ?? 0,
    maxAge: invite.maxAge,
    temporary: invite.temporary
  });

  console.log(
    `🔗 Invitation créée : ${invite.code}`
  );
});

client.on('inviteDelete', invite => {
  const guild = invite.guild;
  if (!guild) return;

  const cache = invitesCache.get(guild.id);
  if (!cache) return;

  cache.delete(invite.code);

  console.log(
    `🗑️ Invitation supprimée : ${invite.code}`
  );
});






// ✅ Variables globales en mémoire
let gamesData = { games: [] };









let pointsOperationQueue = Promise.resolve();

async function withPointsLock(operation) {
  const previous = pointsOperationQueue;

  let release;
  pointsOperationQueue = new Promise(resolve => {
    release = resolve;
  });

  await previous;

  try {
    return await operation();
  } finally {
    release();
  }
}



async function getPlayerPoints(userId) {
  let doc = await Points.findOne({ userId });

  if (!doc) {
    doc = await Points.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          rr: 0,
          games: 0,
          wins: 0,
          timeouts: 0
        }
      },
      {
        upsert: true,
        new: true
      }
    );
  }

  return {
    userId: doc.userId,
    rr: doc.rr ?? 0,
    games: doc.games ?? 0,
    wins: doc.wins ?? 0,
    timeouts: doc.timeouts ?? 0
  };
}


async function setPlayerPoints(userId, data) {
  return withPointsLock(async () => {
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
  });
}



async function incrementPlayerTimeouts(userId) {
  return withPointsLock(async () => {
    await Points.updateOne(
      { userId },
      { $inc: { timeouts: 1 } },
      { upsert: true }
    );
  });
}




async function incrementPlayerStats(userId, rrDelta, isWinner) {
  if (!Number.isFinite(rrDelta)) {
    throw new Error(
      `Variation RR invalide pour ${userId} : ${rrDelta}`
    );
  }

  return withPointsLock(async () => {
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

    await Points.updateOne(
      { userId, rr: { $lt: 0 } },
      { $set: { rr: 0 } }
    );
  });
}



async function applyMatchPoints(gameId, updates) {
  if (!gameId) {
    throw new Error('Identifiant de partie manquant');
  }

  if (!Array.isArray(updates) || updates.length === 0) {
    throw new Error('Aucune statistique à attribuer');
  }

  const ids = updates.map(u => u.userId);

  if (new Set(ids).size !== ids.length) {
    throw new Error('Joueur présent plusieurs fois');
  }

  for (const update of updates) {
    if (!update.userId || !Number.isFinite(update.delta)) {
      throw new Error('Attribution RR invalide');
    }
  }

  

  return withPointsLock(async () => {
    const key = `matchPointsApplied_${gameId}`;

    // Une partie déjà comptabilisée ne doit pas être
    // bloquée simplement parce que le mois a changé.
    if (await Config.exists({ key })) return false;

    // Empêcher l'attribution de RR sur l'ancien mois.
    const leaderboardData = await getConfigValue(
      'leaderboardData',
      null
    );

    const currentMonth = getParisMonthKey();

    if (leaderboardData?.monthKey !== currentMonth) {
      throw new Error(
        `RR non attribués pour ${gameId} : classement ` +
        `${leaderboardData?.monthKey || 'non initialisé'}, ` +
        `mois actuel ${currentMonth}. Rotation nécessaire.`
      );
    }

    const session = await mongoose.startSession();
    let alreadyApplied = false;



    try {
      await session.withTransaction(async () => {
        alreadyApplied = false;

        const existing = await Config.findOne({ key })
          .session(session);

        if (existing) {
          alreadyApplied = true;
          return;
        }

        for (const { userId, delta, isWinner } of updates) {
          await Points.updateOne(
            { userId },
            {
              $inc: {
                rr: delta,
                games: 1,
                wins: isWinner ? 1 : 0
              }
            },
            { upsert: true, session }
          );

          await Points.updateOne(
            { userId, rr: { $lt: 0 } },
            { $set: { rr: 0 } },
            { session }
          );
        }

        await Config.create(
          [{
            key,
            value: {
              gameId,
              appliedAt: new Date().toISOString(),
              players: ids
            }
          }],
          { session }
        );
      });

      return !alreadyApplied;
    } finally {
      await session.endSession();
    }
  });
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
  const doc = await Invite.findOneAndUpdate(
    { inviterId },
    {
      $setOnInsert: {
        inviterId,
        invites: 0,
        members: []
      }
    },
    {
      upsert: true,
      new: true
    }
  );

  return {
    inviterId: doc.inviterId,
    invites: doc.invites ?? 0,
    members: doc.members ?? []
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
  if (!inviterId || !memberId || inviterId === memberId) {
    return;
  }

  const inviter = await client.users
    .fetch(inviterId)
    .catch(() => null);

  if (!inviter || inviter.bot) return;

  await Invite.updateOne(
    { inviterId },
    [
      {
        $set: {
          inviterId,
          members: {
            $setUnion: [
              { $ifNull: ['$members', []] },
              [memberId]
            ]
          }
        }
      },
      {
        $set: {
          invites: { $size: '$members' }
        }
      }
    ],
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
  const pendingTimeout = saveTimeouts.get(gameId);

  if (pendingTimeout) {
    clearTimeout(pendingTimeout);
    saveTimeouts.delete(gameId);
  }

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




const REFERRAL_OFFERS = {};


function addReferralOffer(slug, data) {
  REFERRAL_OFFERS[`┃${slug}`] = {
    slug,
    title: data.title,
    category: data.category || 'banque',
    bonus: data.bonus ?? null,
    notice: data.notice || null,
    verifiedAt: data.verifiedAt || null,
    logoUrl: data.logoUrl || null,
    displayStatus: data.displayStatus || 'auto',
    url: data.url || null,
    referralCode: data.referralCode || null,
    signupUrl: data.signupUrl || null,
    officialUrl: data.officialUrl || null,
    referralTermsUrl: data.referralTermsUrl || null,
    steps: data.steps || [],
    ticketId: data.ticketId || null,
    draft: data.draft ?? false
  };
}


// ==========================
// PARRAINAGES BANCAIRES
// ==========================

addReferralOffer('boursobank', {
  title: 'BoursoBank',
  category: 'banque',
  bonus: '180 €',
  verifiedAt: '09/11/2026',
  notice: 'Prime soumise à conditions, avec risque de reprise avant 24 mois.',
  officialUrl: 'https://www.boursobank.com/bon-plan/parrainage-boursobank',
  ticketId: 'open_referral_ticket_boursobank',
  steps: [
    [
      'Ouvre ton premier compte via le lien de parrainage',
      '+20 € de prime pour toi à l’ouverture du compte'
    ],
    [
      'Verse-y 300 € pour obtenir la prime maximale',
      '+40 € de prime si 300 € déposés'
    ],
    [
      'Utilise ta carte une fois par mois pendant 3 mois',
      '+40 € de prime supplémentaire'
    ],
    [
      'Réalise une mobilité bancaire via EasyMove',
      '+80 € de prime supplémentaire'
    ]
  ]
});

addReferralOffer('fortuneo', {
  title: 'Fortuneo',
  category: 'banque',
  bonus: '150 €',
  verifiedAt: '09/11/2026',
  notice: 'Offre bancaire jusqu’au 30/11/2026, sous conditions. Compte et carte à conserver au moins 1 an.',
    officialUrl: 'https://www.fortuneo.fr/parrainage',
  signupUrl: 'https://www.fortuneo.fr/compte-bancaire',
  ticketId: 'open_referral_ticket_fortuneo',
  
steps: [
  [
    'Ouvre ton premier compte Fortuneo avec Fosfo ou Gold',
    '+80 € avec Fosfo ou +150 € avec Gold Mastercard'
  ],
  [
    'Renseigne le code parrain pendant ton inscription',
    'Code à saisir dans le formulaire de souscription'
  ],
  [
    'Verse 300 € dans les 6 jours suivant l’ouverture',
    'Versement obligatoire pour obtenir la prime'
  ],
  [
    'Découvre les offres Bourse et assurance-vie',
    'Jusqu’à 80 € en Bourse ou 120 € en assurance-vie, sous conditions ; offres non cumulables'
  ]
]

});



addReferralOffer('revolut', {
  title: 'Revolut',
  category: 'banque',
  bonus: 'Jusqu’à 60 € reversés au filleul',
  url: 'https://revolut.com/referral/?referral-code=lucaspz80!NOV1-26-AR-SAV-H2&geo-redirect',
  notice: 'Campagne du 10/11/2026 : échéance le 17/11/2026 à 20h59 UTC. Maximum 10 parrainages récompensés. Partage 50/50 proposé par le parrain, non versé directement par Revolut.',
  steps: [
    [
      'Inscris-toi avec mon lien Revolut',
      'Crée ton compte et valide ton identité'
    ],
    [
      'Ajoute de l’argent sur ton compte',
      'Alimente ton compte conformément aux conditions de la campagne'
    ],
    [
      'Commande ta carte physique',
      'Ajoute également ta carte à Apple Pay ou Google Pay'
    ],
    [
      'Effectue 3 achats de 5 € minimum',
      'Achats éligibles à réaliser avant la date limite'
    ],
    [
      'Dépose 100 € sur ton compte épargne',
      'Condition supplémentaire pour débloquer les 20 € de bonus épargne'
    ],
    [
      'Récupère ta part de la prime',
      '50 € reversés par le parrain, ou 60 € si le bonus épargne est obtenu'
    ]
  ]
});


// ==========================
// AUTRES ENSEIGNES
// ==========================

const REFERRAL_CATALOG = {
  banque: [
    ['revolut', 'Revolut'],
    ['hello-bank', 'Hello bank!'],
    ['monabanq', 'Monabanq'],
    ['n26', 'N26'],
    ['bunq', 'bunq'],
    ['distingo-bank', 'Distingo Bank'],
    ['nickel', 'Nickel'],
    ['sumeria', 'Sumeria'],
    ['wise', 'Wise'],
    ['la-banque-postale', 'La Banque Postale']
  ],

  investissement: [
    ['trade-republic', 'Trade Republic'],
    ['trading212', 'Trading 212'],
    ['etoro', 'eToro'],
    ['shares', 'Shares'],
    ['yomoni', 'Yomoni'],
    ['ramify', 'Ramify'],
    ['finary', 'Finary']
  ],

  crypto: [
    ['coinbase', 'Coinbase'],
    ['swissborg', 'SwissBorg'],
    ['bitvavo', 'Bitvavo'],
    ['kraken', 'Kraken'],
    ['bitpanda', 'Bitpanda'],
    ['crypto-com', 'Crypto.com']
  ],

  cashback: [
    ['igraal', 'iGraal'],
    ['widilo', 'Widilo'],
    ['ebuyclub', 'eBuyClub'],
    ['joko', 'Joko'],
    ['rakuten', 'Rakuten'],
    ['poulpeo', 'Poulpeo'],
    ['shopmium', 'Shopmium'],
    ['naomi', 'Naomi'],
    ['capital-koala', 'Capital Koala'],
    ['topcashback', 'TopCashback'],
    ['wanteeed', 'Wanteeed']
  ],

  aides: [
    ['pass-culture', 'Pass Culture'],
    ['prime-activité', 'Prime d’activité'],
    ['contrat-engagement-jeune', 'Engagement jeune'],
    ['rsa-jeune-actif', 'RSA jeune actif'],
    ['aides-logement', 'Aides au logement'],
    ['aides-étudiantes', 'Aides étudiantes'],
    ['aide-mobili-jeune', 'MOBILI-JEUNE'],
    ['fonds-aide-jeunes', 'Fonds d’aide aux jeunes'],
    ['service-civique', 'Service civique'],
    ['aides-mobilité', 'Aides à la mobilité'],
    ['aides-permis', 'Aides au permis'],
    ['autres-aides', 'Autres aides']
  ]
};





// ============================================================
// SURVEILLANCE DES ANNONCES — CONFIGURATION ET MONGODB
// ============================================================

const WATCH_CATEGORY_ID = '1569389053852520658';
const WATCH_PANEL_CHANNEL_ID = '1569389930713714858';
const WATCH_PANEL_CONFIG_KEY = 'watchPublicPanel';

const WATCH_CONFIG = {
  maxSearchesPerMember: 5,
  checkIntervalMs: 60_000,
  initialResultsLimit: 10,
  defaultMentions: false,
  platforms: {
    vinted: { name: 'Vinted', emojiName: 'vinted' },
    leboncoin: { name: 'Leboncoin', emojiName: 'leboncoin' },
    ebay: { name: 'eBay', emojiName: 'ebay' }
  }
};

const watchSearchSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  channelId: { type: String, required: true, unique: true },
  platform: {
    type: String,
    enum: ['vinted', 'leboncoin', 'ebay'],
    required: true
  },
  keywords: { type: String, default: '' },
searchUrl: { type: String, default: '' },
customName: { type: String, default: '' },
  excludedKeywords: { type: String, default: '' },
  minPrice: { type: Number, default: null },
  maxPrice: { type: Number, default: null },
  brand: { type: String, default: '' },
  condition: { type: String, default: '' },
  category: { type: String, default: '' },
  size: { type: String, default: '' },
  shippingOnly: { type: Boolean, default: false },
  mentions: { type: Boolean, default: false },
  paused: { type: Boolean, default: false },
  seenListingIds: { type: [String], default: [] },
  managementMessageId: { type: String, default: null },
initialScanDone: { type: Boolean, default: false },
lastCheckedAt: { type: Date, default: null },
lastScanError: { type: String, default: '' }
}, { timestamps: true });

watchSearchSchema.index({ guildId: 1, userId: 1 });

const WatchSearch = mongoose.models.WatchSearch ||
  mongoose.model('WatchSearch', watchSearchSchema);


const watchNotificationSchema = new mongoose.Schema({
  searchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WatchSearch',
    required: true
  },
  listingKey: { type: String, required: true },
  platform: { type: String, required: true },
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  userId: { type: String, required: true },

  listing: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  initial: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ['pending', 'sending', 'sent', 'failed'],
    default: 'pending'
  },

  attempts: { type: Number, default: 0 },
  nextAttemptAt: { type: Date, default: Date.now },
  lockedUntil: { type: Date, default: null },
  messageId: { type: String, default: null },
  sentAt: { type: Date, default: null },
  lastError: { type: String, default: '' }
}, { timestamps: true });

watchNotificationSchema.index(
  { searchId: 1, listingKey: 1 },
  { unique: true }
);

watchNotificationSchema.index({
  status: 1,
  nextAttemptAt: 1
});

const WatchNotification =
  mongoose.models.WatchNotification ||
  mongoose.model('WatchNotification', watchNotificationSchema);



function validateWatchSearchUrl(platform, rawUrl) {
  let url;

  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new Error('Le lien de recherche est invalide.');
  }

  if (url.protocol !== 'https:') {
    throw new Error('Le lien doit commencer par https://');
  }

  if (url.username || url.password) {
    throw new Error('Ce type de lien n’est pas accepté.');
  }

  const hostname = url.hostname.toLowerCase();

  const allowedDomains = {
    vinted: ['vinted.fr', 'vinted.com'],
    leboncoin: ['leboncoin.fr'],
    ebay: ['ebay.fr', 'ebay.com']
  };

  const validDomain = allowedDomains[platform]?.some(
    domain =>
      hostname === domain ||
      hostname === `www.${domain}`
  );

  if (!validDomain) {
    throw new Error(
      'Ce lien ne correspond pas à la plateforme sélectionnée.'
    );
  }

  if (url.toString().length > 3000) {
    throw new Error('Le lien est trop long.');
  }

  // Retirer uniquement le fragment, inutile pour la recherche.
  url.hash = '';

  return url.toString();
}

function watchSafeChannelName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}


function getWatchEmoji(guild, platform) {
  const config = WATCH_CONFIG.platforms[platform];
  if (!config) return '';

  const emoji = guild.emojis.cache.find(
    e => e.name?.toLowerCase() === config.emojiName
  );

  return emoji?.toString() || '';
}

function getWatchTitle(guild, platform, title) {
  const emoji = getWatchEmoji(guild, platform);
  return `# ${emoji ? `${emoji} ` : ''}${title}`;
}




function buildWatchMainPanel(guild, count = 0) {
  const leboncoin = getWatchEmoji(guild, 'leboncoin');
  const vinted = getWatchEmoji(guild, 'vinted');
  const ebay = getWatchEmoji(guild, 'ebay');

  return new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# ${[leboncoin, vinted, ebay].filter(Boolean).join('')} SURVEILLANCE DES ANNONCES\n` +
        '-# Configure tes filtres sur la plateforme, trie du plus récent au plus ancien, puis colle ton lien de recherche.\n' +
        '-# Jusqu’à 5 recherches personnelles, chacune dans un salon privé.'
      )
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
    )   
.addActionRowComponents(
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('watch_platform_leboncoin')
      .setLabel('Recherche Leboncoin')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('watch_platform_vinted')
      .setLabel('Recherche Vinted')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('watch_platform_ebay')
      .setLabel('Recherche eBay')
      .setStyle(ButtonStyle.Secondary)
  )
);
}





async function publishWatchPublicPanel(guild) {
  const channel = await guild.channels
    .fetch(WATCH_PANEL_CHANNEL_ID)
    .catch(() => null);

  if (!channel || !channel.isTextBased()) {
    throw new Error('Salon du panneau de surveillance introuvable.');
  }

  const configKey = `${WATCH_PANEL_CONFIG_KEY}_${guild.id}`;
  const saved = await getConfigValue(configKey, null);

  const payload = {
    components: [buildWatchMainPanel(guild, 0)],
    flags: MessageFlags.IsComponentsV2,
    allowedMentions: { parse: [] }
  };

  // Actualiser le panneau existant, sans doublon.
  if (saved?.messageId) {
    const existing = await channel.messages
      .fetch(saved.messageId)
      .catch(() => null);

    if (existing && existing.author.id === client.user.id) {
      await existing.edit(payload);
      return existing;
    }
  }

  const message = await channel.send(payload);

  await setConfigValue(configKey, {
    channelId: channel.id,
    messageId: message.id
  });

  return message;
}



function buildWatchManagementPanel(guild, search) {
  const platformName =
    WATCH_CONFIG.platforms[search.platform].name;

  const legacy = !search.searchUrl;

  const details = legacy
    ? `**Ancienne recherche :** ${search.keywords || 'Sans nom'}\n` +
      '-# Cette recherche utilise encore les anciens filtres.'
    : `**Nom :** ${search.customName || 'Recherche sans nom'}\n` +
      `**Recherche :** [Ouvrir sur ${platformName}](${search.searchUrl})\n` +
      '**Tri demandé :** Du plus récent au plus ancien';


 

const container = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)
    .addTextDisplayComponents(
      
new TextDisplayBuilder().setContent(
  getWatchTitle(
    guild,
    search.platform,
    `SURVEILLANCE — ${platformName.toUpperCase()}`
  ) +
  '\n' +
  `-# Recherche de <@${search.userId}>\n\n` +
  `${details}\n` +
  `**Statut :** ${search.paused ? 'Suspendue' : 'Active'}\n\n` +
  '-# Les annonces sont publiées automatiquement dans ce salon.\n' +
  '-# Pour recevoir les alertes sur ton téléphone, active les notifications de ce salon dans Discord.'
)

    )
    .addSeparatorComponents(
      new SeparatorBuilder()
    )
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
  .setCustomId(`watch_suspend_${search._id}`)
  .setLabel('Mettre en pause')
  .setStyle(ButtonStyle.Secondary)
  .setDisabled(Boolean(search.paused)),

new ButtonBuilder()
  .setCustomId(`watch_resume_${search._id}`)
  .setLabel('Reprendre')
  .setStyle(ButtonStyle.Secondary)
  .setDisabled(!search.paused),

new ButtonBuilder()
  .setCustomId(`watch_delete_${search._id}`)
  .setLabel('Arrêter')
  .setStyle(ButtonStyle.Secondary),

new ButtonBuilder()
  .setCustomId(`watch_test_${search._id}`)
  .setLabel('Tester une annonce')
  .setStyle(ButtonStyle.Secondary)

  
      )
      
    );


if (search.platform === 'vinted') {
  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`watch_vinted_url_${search._id}`)
        .setLabel('Diagnostic URL Vinted')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔍')
    )
  );
}

if (search.platform === 'leboncoin') {
  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`watch_leboncoin_url_${search._id}`)
        .setLabel('Diagnostic URL Leboncoin')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔍')
    )
  );
}


if (search.platform === 'ebay') {
  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`watch_ebay_api_${search._id}`)
        .setLabel('Diagnostic API eBay')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔍')
    )
  );
}

return container;

}


async function updateWatchManagementPanel(guild, search) {
  const channel = await guild.channels
    .fetch(search.channelId)
    .catch(() => null);

  if (!channel?.isTextBased() || !search.managementMessageId) {
    return;
  }

  const message = await channel.messages
    .fetch(search.managementMessageId)
    .catch(() => null);

  if (!message) return;

  await message.edit({
    components: [buildWatchManagementPanel(guild, search)],
    flags: MessageFlags.IsComponentsV2
  });
}



 // ============================================================
 // SURVEILLANCE — MOTEUR AUTOMATIQUE
 // ============================================================



let ebayAccessToken = null;
let ebayTokenExpiresAt = 0;

async function getEbayAccessToken() {
  if (
    ebayAccessToken &&
    Date.now() < ebayTokenExpiresAt
  ) {
    return ebayAccessToken;
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Identifiants API eBay manquants dans .env.'
    );
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString('base64');

  const response = await fetch(
    'https://api.ebay.com/identity/v1/oauth2/token',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope:
          'https://api.ebay.com/oauth/api_scope'
      }),
      signal: AbortSignal.timeout(15000)
    }
  ); 

if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));

  const errorCode = String(errorData.error || 'unknown');
  const errorDescription = String(
    errorData.error_description || 'Aucune précision'
  );

  throw new Error(
    `Authentification eBay : HTTP ${response.status} — ` +
    `${errorCode} — ${errorDescription}`
  );
}

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Jeton eBay absent.');
  }

  ebayAccessToken = data.access_token;
  ebayTokenExpiresAt =
    Date.now() +
    Math.max(0, data.expires_in - 60) * 1000;

  return ebayAccessToken;
}



function parseEbaySearchFilters(searchUrl) {
  const url = new URL(
    validateWatchSearchUrl('ebay', searchUrl)
  );

  const params = url.searchParams;

  const supported = new Set([
    '_nkw', '_udlo', '_udhi', '_sop',
    '_ipg', '_pgn', 'rt', 'mkcid',
    'mkrid', 'siteid', 'campid',
    'customid', 'toolid',
    '_sacat', '_from', '_dcat',
    'LH_ItemCondition', 'LH_BIN',
    'Personnage'
  ]);

  const unsupported = [...new Set(
    [...params.keys()].filter(key => !supported.has(key))
  )];

  if (unsupported.length) {
    throw new Error(
      'Filtres eBay non pris en charge : ' +
      unsupported.join(', ')
    );
  }

  const keywords = (params.get('_nkw') || '').trim();

  if (!keywords) {
    throw new Error('Mots-clés eBay introuvables.');
  }

  const readPrice = key => {
    const raw = params.get(key);

    if (raw == null || raw === '') return null;

    const value = Number(raw.replace(',', '.'));

    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Prix eBay invalide : ${key}`);
    }

    return value;
  };

  const minPrice = readPrice('_udlo');
  const maxPrice = readPrice('_udhi');

  if (
    minPrice !== null &&
    maxPrice !== null &&
    minPrice > maxPrice
  ) {
    throw new Error(
      'Le prix minimum dépasse le prix maximum.'
    );
  }

  const sort = params.get('_sop');

  if (sort && sort !== '10') {
    throw new Error(
      'Trie la recherche par annonces récentes.'
    );
  }

  const category =
    params.get('_dcat') ||
    params.get('_sacat');

  if (
    category &&
    category !== '0' &&
    !/^\d+$/.test(category)
  ) {
    throw new Error('Catégorie eBay invalide.');
  }

  const condition = params.get('LH_ItemCondition');

  if (condition && condition !== '3') {
    throw new Error(
      'Cet état eBay n’est pas encore pris en charge.'
    );
  }

  const buyNow = params.get('LH_BIN');

  if (buyNow && buyNow !== '1') {
    throw new Error(
      'Filtre achat immédiat invalide.'
    );
  }

  const personnage = params.get('Personnage');

  if (personnage && !category) {
    throw new Error(
      'Le filtre Personnage nécessite une catégorie.'
    );
  }

  return {
    keywords,
    minPrice,
    maxPrice,
    category: category === '0' ? null : category,
    condition,
    buyNow: buyNow === '1',
    personnage
  };
}





async function fetchEbayListings(searchUrl) {
  const filters = parseEbaySearchFilters(searchUrl);
  const token = await getEbayAccessToken();

  const apiUrl = new URL(
    'https://api.ebay.com/buy/browse/v1/item_summary/search'
  );

  apiUrl.searchParams.set('q', filters.keywords);
  apiUrl.searchParams.set('limit', '50');
  apiUrl.searchParams.set('sort', 'newlyListed');

  
const apiFilters = [];

if (filters.category) {
  apiUrl.searchParams.set(
    'category_ids',
    filters.category
  );
}

if (filters.condition === '3') {
  apiFilters.push('conditions:{USED}');
}

if (filters.buyNow) {
  apiFilters.push('buyingOptions:{FIXED_PRICE}');
}

if (filters.personnage) {
  if (!filters.category) {
    throw new Error(
      'Catégorie obligatoire pour le filtre Personnage.'
    );
  }

  const safeValue = filters.personnage
    .replace(/[{}|\\]/g, '\\$&');

  apiUrl.searchParams.set(
    'aspect_filter',
    `categoryId:${filters.category},Personnage:{${safeValue}}`
  );
}


  if (
    filters.minPrice !== null ||
    filters.maxPrice !== null
  ) {
    const min = filters.minPrice ?? 0;
    const max = filters.maxPrice ?? '';

    apiFilters.push(`price:[${min}..${max}]`);
    apiFilters.push('priceCurrency:EUR');
  }

  if (apiFilters.length) {
    apiUrl.searchParams.set(
      'filter',
      apiFilters.join(',')
    );
  }

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR',
      'Accept-Language': 'fr-FR',
      Accept: 'application/json'
    },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `API eBay HTTP ${response.status} : ` +
      details.slice(0, 300)
    );
  }

  const data = await response.json();

  if (!Array.isArray(data.itemSummaries)) {
    return [];
  }

  return data.itemSummaries
    .filter(item =>
      item.itemId &&
      item.title &&
      item.itemWebUrl
    )
    .map(item => ({
      id: String(item.itemId),
      title: item.title,
      url: item.itemWebUrl,
      price:
        item.price?.currency === 'EUR'
          ? Number(item.price.value)
          : null,
      imageUrl: item.image?.imageUrl || null,
      location: [
        item.itemLocation?.city,
        item.itemLocation?.country
      ].filter(Boolean).join(', '),
      publishedAt: item.itemCreationDate || null
    }));
}


function parseVintedSearchFilters(searchUrl) {
  const url = new URL(
    validateWatchSearchUrl('vinted', searchUrl)
  );

  const params = url.searchParams;

  const allowed = new Set([
    'search_text',
    'order',
    'price_from',
    'price_to',
    'catalog[]',
    'brand_ids[]',
    'size_ids[]',
    'status_ids[]',
    'color_ids[]',
    'material_ids[]',
    'page',
    'per_page',
    'currency',
    'time'
  ]);

  const ignored = new Set([
    'referrer',
    'search_id',
    'search_by_image_uuid',
    'search_by_image_id'
  ]);


  const unsupported = [...new Set(
    [...params.keys()].filter(
      key => !allowed.has(key) && !ignored.has(key)
    )
  )];

  if (unsupported.length) {
    throw new Error(
      'Paramètres Vinted à vérifier : ' +
      unsupported.join(', ')
    );
  }

  const order = params.get('order');

  if (order && order !== 'newest_first') {
    throw new Error(
      'Trie ta recherche Vinted par annonces récentes.'
    );
  }

  const readPrice = key => {
    const raw = params.get(key);
    if (raw == null || raw === '') return null;

    const value = Number(raw.replace(',', '.'));

    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Prix Vinted invalide : ${key}`);
    }

    return value;
  };

  const minPrice = readPrice('price_from');
  const maxPrice = readPrice('price_to');

  if (
    minPrice !== null &&
    maxPrice !== null &&
    minPrice > maxPrice
  ) {
    throw new Error(
      'Le prix minimum dépasse le prix maximum.'
    );
  }

  return {
    keywords: params.get('search_text') || '',
    order: order || 'non précisé',
    minPrice,
    maxPrice,
    catalogs: params.getAll('catalog[]'),
    brands: params.getAll('brand_ids[]'),
    sizes: params.getAll('size_ids[]'),
    conditions: params.getAll('status_ids[]'),
    colors: params.getAll('color_ids[]'),
    materials: params.getAll('material_ids[]')
  };
}



function extractVintedHtmlSamples(html, baseUrl) {
  const $ = cheerio.load(html);
  const samples = [];
  const seen = new Set();

  $('a[href*="/items/"]').each((_, element) => {
    if (samples.length >= 5) return false;

    const card = $(element);
    const href = card.attr('href');
    if (!href) return;

    let url;
    let id;

    try {
      const parsed = new URL(href, baseUrl);

      if (!['vinted.fr', 'www.vinted.fr',
             'vinted.com', 'www.vinted.com']
          .includes(parsed.hostname)) return;

      const match = parsed.pathname.match(/^\/items\/(\d+)/);
      if (!match) return;

      id = match[1];
      url = parsed.origin + parsed.pathname;
    } catch {
      return;
    }

    if (seen.has(id)) return;
    seen.add(id);

    const parent = card.parent();

    const imageElement = card.find('img').first().length
      ? card.find('img').first()
      : parent.find('img').first();

    const image =
      imageElement.attr('src') ||
      imageElement.attr('data-src') ||
      imageElement.attr('srcset')
        ?.split(',')[0]?.trim().split(/\s+/)[0] ||
      null;

    const title =
      card.attr('title') ||
      card.attr('aria-label') ||
      imageElement.attr('alt') ||
      card.text().trim() ||
      null;

    const text = parent.text().replace(/\s+/g, ' ').trim();

    const priceMatch = (title || text).match(
      /(\d+(?:[.,]\d{1,2})?)\s*€/
    );

    const price = priceMatch
      ? Number(priceMatch[1].replace(',', '.'))
      : null;

    samples.push({
      id,
      url,
      title: title?.slice(0, 200) || null,
      price,
      image: image?.slice(0, 500) || null,
      text: text.slice(0, 200)
    });
  });

  return samples;
}




async function diagnoseVintedAccess(searchUrl) {
  const url = new URL(
    validateWatchSearchUrl('vinted', searchUrl)
  );

  const startedAt = Date.now();

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'text/html'
      },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow'
    });

    const contentType =
      response.headers.get('content-type') || '';

    const html = await response.text();
    const htmlSamples = response.ok
  ? extractVintedHtmlSamples(html, response.url)
  : [];


const indicators = {
  itemLinks: (
    html.match(/href=["'][^"']*\/items\/\d+/gi) || []
  ).length,

  itemIds: (
    html.match(/"item_id"\s*:\s*\d+/gi) || []
  ).length,

  itemObjects: (
    html.match(/"items"\s*:\s*\[/gi) || []
  ).length
};


const sampleLinks = [
  ...new Set(
    [...html.matchAll(
      /href=["']([^"']*\/items\/\d+[^"']*)["']/gi
    )]
      .map(match => match[1].replace(/&amp;/g, '&'))
      .map(link => {
        try {
          const itemUrl = new URL(link, response.url);
          if (!['vinted.fr', 'www.vinted.fr',
                 'vinted.com', 'www.vinted.com']
                .includes(itemUrl.hostname)) {
            return null;
          }
          return itemUrl.origin + itemUrl.pathname;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
  )
].slice(0, 3);



    const title =
      html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?.replace(/\s+/g, ' ')
      ?.trim() || 'Non trouvé';

    return {
      indicators,
      sampleLinks,
      htmlSamples,
      success: response.ok,
      status: response.status,
      durationMs: Date.now() - startedAt,
      contentType,
      title: title.slice(0, 150),
      htmlLength: html.length,
      finalUrl: response.url
    };

  } catch (error) {
    return {
      success: false,
      durationMs: Date.now() - startedAt,
      error: error.message
    };
  }
}




async function fetchVintedListings(searchUrl) {
  const url = validateWatchSearchUrl('vinted', searchUrl);
  parseVintedSearchFilters(url);

  const response = await fetch(url, {
    headers: { Accept: 'text/html' },
    signal: AbortSignal.timeout(12000)
  });

  if (!response.ok) {
    throw new Error(`Vinted HTTP ${response.status}`);
  }

  const $ = cheerio.load(await response.text());
  const listings = new Map();

  $('a[href*="/items/"]').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');
    if (!href) return;

    let parsed;
    try {
      parsed = new URL(href, response.url);
      if (!['vinted.fr', 'www.vinted.fr'].includes(parsed.hostname)) return;
    } catch {
      return;
    }

    const match = parsed.pathname.match(/^\/items\/(\d+)/);
    if (!match) return;

    const id = match[1];
    if (listings.has(id)) return;

    const card = link.closest('[data-testid*="item"]');
    const context = card.length ? card : link.parent();

const imageElement = link.parent().find('img').first().length
  ? link.parent().find('img').first()
  : context.find('img').first();


const imageCandidates = [
  imageElement.attr('data-src'),
  imageElement.attr('data-original'),
  imageElement.attr('srcset')?.split(',')[0]?.trim().split(/\s+/)[0],
  imageElement.attr('src'),
  context.find('img[data-src]').first().attr('data-src'),
  context.find('img[srcset]').first()
    .attr('srcset')?.split(',')[0]?.trim().split(/\s+/)[0],
  context.find('img[src]').first().attr('src')
];


const imageUrl = imageCandidates
  .filter(value => typeof value === 'string' && value.trim())
  .map(value => {
    try {
      return new URL(value.trim(), response.url).toString();
    } catch {
      return null;
    }
  })
  .find(value =>
    value &&
    value.startsWith('https://') &&
    !value.includes('placeholder')
  ) || null;

const rawTitle =
      link.attr('title') ||
      link.attr('aria-label') ||
      imageElement.attr('alt') ||
      link.text().trim();

    if (!rawTitle) return;

    const title = rawTitle
      .split(/,\s*(?:Marque|État|Taille)\s*:/i)[0]
      .trim();

    const brand = rawTitle.match(
      /(?:^|,)\s*Marque\s*:\s*([^,]+)/i
    )?.[1]?.trim() || '';

    const condition = rawTitle.match(
      /(?:^|,)\s*État\s*:\s*([^,]+)/i
    )?.[1]?.trim() || '';

    const size = rawTitle.match(
      /(?:^|,)\s*Taille\s*:\s*([^,]+)/i
    )?.[1]?.trim() || '';

    const text = context.text()
      .replace(/\s+/g, ' ')
      .trim();


const priceText = `${rawTitle} ${text}`;

const prices = [
  ...priceText.matchAll(/(\d+(?:[.,]\d{1,2})?)\s*€/g)
].map(match => Number(match[1].replace(',', '.')));

const price = prices.length >= 2
  ? prices[1]
  : prices[0] ?? null;


    listings.set(id, {
      id,
      title: title.slice(0, 300),
      url: parsed.origin + parsed.pathname,
      price,
      imageUrl,
      brand,
      size,
      condition,
      location: '',
      publishedAt: null
    });
  });

  return [...listings.values()];
}



function parseLeboncoinSearchFilters(searchUrl) {
  const url = new URL(
    validateWatchSearchUrl('leboncoin', searchUrl)
  );

  if (url.pathname !== '/recherche') {
    throw new Error(
      'Le lien doit être une recherche Leboncoin.'
    );
  }

  const params = url.searchParams;

  const allowed = new Set([
  'text',
  'keywords',
  'category',
    'price',
    'mileage',
    'regdate',
    'u_car_brand',
    'u_car_model',
    'sort',
    'order'
  ]);

  const unsupported = [...new Set(
    [...params.keys()].filter(key => !allowed.has(key))
  )];

  if (unsupported.length) {
    throw new Error(
      'Filtres Leboncoin non encore pris en charge : ' +
      unsupported.join(', ')
    );
  }

  const parseRange = (key) => {
    const raw = params.get(key);
    if (!raw) return null;

    const match = raw.match(
      /^(?:(min|max)-)?(\d+)(?:-(\d+))?$/
    );

    if (!match) {
      throw new Error(
        `Format de filtre Leboncoin invalide : ${key}`
      );
    }

    return {
      raw,
      prefix: match[1] || null,
      first: Number(match[2]),
      second: match[3] == null
        ? null
        : Number(match[3])
    };
  };

  const price = parseRange('price');
  const mileage = parseRange('mileage');
  const regdate = parseRange('regdate');

  if (
    price?.second !== null &&
    price?.second !== undefined &&
    price.first > price.second
  ) {
    throw new Error('Plage de prix invalide.');
  }

  return {
    url: url.toString(),
    category: params.get('category'),
    price,
    mileage,
    regdate,
    brand: params.get('u_car_brand'),
    model: params.get('u_car_model'),
    sort: params.get('sort'),
    order: params.get('order')
  };
}


async function diagnoseLeboncoinAccess(searchUrl) {
  const url = validateWatchSearchUrl(
    'leboncoin',
    searchUrl
  );

  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'text/html'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000)
    });

    const html = await response.text();

    const $ = cheerio.load(html);

    const title = $('title').first().text().trim();

    const listingLinks = new Set();

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');

      try {
        const parsed = new URL(href, response.url);

        if (
          ['leboncoin.fr', 'www.leboncoin.fr']
            .includes(parsed.hostname) &&
          /^\/ad\/[^/]+\/\d+/.test(parsed.pathname)
        ) {
          listingLinks.add(
            parsed.origin + parsed.pathname
          );
        }
      } catch {}
    });

    const indicators = {
      listingLinks: listingLinks.size,
      jsonLdScripts:
        $('script[type="application/ld+json"]').length,
      nextData: html.includes('__NEXT_DATA__'),
      blocked:
        /captcha|access denied|robot check/i.test(title)
    };

    return {
      success: response.ok,
      status: response.status,
      durationMs: Date.now() - startedAt,
      contentType:
        response.headers.get('content-type') || '',
      title: title.slice(0, 150),
            htmlLength: html.length,
      finalUrl: response.url,
      server: response.headers.get('server') || '',
      requestId: response.headers.get('x-request-id') || '',
      bodyPreview: $('body')
        .text()
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 350),
      indicators,
      sampleLinks: [...listingLinks].slice(0, 3)
    };

  } catch (error) {
    return {
      success: false,
      durationMs: Date.now() - startedAt,
      error: error.message
    };
  }
}
async function testLeboncoinApiSearch() {
  const startedAt = Date.now();

  try {
    const { search, CATEGORY, SORT_BY, SORT_ORDER } =
  require('./leboncoin-api-search.cjs');

    if (typeof search !== 'function') {
      throw new Error('La fonction search est introuvable.');
    }

    // Test limité : Lada Niva, catégorie voitures,
    // prix entre 1000 et 4500 euros.
    const results = await search({
      keywords: 'Lada Niva',
      category: CATEGORY.VOITURES,
      sort_by: SORT_BY.TIME,
      sort_order: SORT_ORDER.DESC,
      price_min: 1000,
      price_max: 4500,
      limit: 5
    });

    const items = Array.isArray(results)
      ? results
      : Array.isArray(results?.ads)
        ? results.ads
        : Array.isArray(results?.data?.ads)
          ? results.data.ads
          : null;

    return {
      success: items !== null,
      durationMs: Date.now() - startedAt,
      count: items?.length ?? 0,
      responseType: Array.isArray(results)
        ? 'tableau'
        : typeof results,
      keys: results && typeof results === 'object'
        ? Object.keys(results).slice(0, 10)
        : [],
        responsePreview: JSON.stringify(results)?.slice(0, 500),
      examples: (items || []).slice(0, 3).map(item => ({
  title: item.subject || item.title || 'Sans titre',
  price: item.price?.[0] ?? item.price ?? '?',
  attributes: (item.attributes || [])
  .filter(attr =>
    ![
      'profile_picture_url',
      'brand',
      'model',
      'u_car_brand',
      'u_car_model'
    ].includes(attr.key)
  )
  .map(attr => ({
    key: attr.key,
    label: attr.key_label,
    value: attr.value_label || attr.value
  }))
}))
    };

  } catch (error) {
    return {
      success: false,
      durationMs: Date.now() - startedAt,
      error: error.message
    };
  }
}

async function fetchLeboncoinListings(searchUrl) {
  const filters = parseLeboncoinSearchFilters(searchUrl);
  const { search } = require('./leboncoin-api-search.cjs');

  const rangeBounds = (range) => {
    if (!range) return null;

    if (range.second !== null) {
      return { min: range.first, max: range.second };
    }

    if (range.prefix === 'min') {
      return { max: range.first };
    }

    if (range.prefix === 'max') {
      return { min: range.first };
    }

    return { min: range.first, max: range.first };
  };

  const price = rangeBounds(filters.price);
  const mileage = rangeBounds(filters.mileage);
  const regdate = rangeBounds(filters.regdate);

  const options = {
    category: filters.category || '0',
    limit: 30,
    sort_by: filters.sort === 'price' ? 'price'
      : filters.sort === 'relevance' ? 'relevance'
      : 'date',
    sort_order: filters.order === 'asc' ? 'asc' : 'desc'
  };

  if (price) {
    if (price.min != null) options.price_min = price.min;
    if (price.max != null) options.price_max = price.max;
  }

  const ranges = {};

  if (mileage) ranges.mileage = mileage;
  if (regdate) ranges.regdate = regdate;

  if (Object.keys(ranges).length) {
    options.ranges = ranges;
  }

  const enums = {};

  if (filters.brand) {
    enums.u_car_brand = [filters.brand];
  }

  if (filters.model) {
    enums.u_car_model = [filters.model];
  }

  if (Object.keys(enums).length) {
    options.enums = enums;
  }

  const params = new URL(filters.url).searchParams;
  const keywords = params.get('text') || params.get('keywords');

  if (keywords) {
    options.keywords = keywords;
  }

  const response = await search(options);

  if (!Array.isArray(response?.ads)) {
    throw new Error('Réponse Leboncoin invalide : annonces absentes.');
  }

  return response.ads.map(ad => ({

vehicleDetails: Object.fromEntries(
  (ad.attributes || [])
    .filter(attr => [
      'regdate',
      'mileage',
      'fuel',
      'gearbox',
      'doors',
      'seats',
      'vehicle_technical_inspection_valid'
    ].includes(attr.key))
    .map(attr => [
      attr.key,
      String(attr.value_label ?? attr.value ?? '').trim()
    ])
),

    id: String(ad.list_id || ''),
    title: ad.subject || '',
    url: ad.url || '',
    price: Array.isArray(ad.price) ? ad.price[0] : ad.price,
    imageUrl: ad.images?.urls?.[0]
      || ad.images?.thumb_url
      || null,
    brand: ad.brand || '',
    size: '',
    condition: '',
    location: [
      ad.location?.city_label,
      ad.location?.zipcode
    ].filter(Boolean).join(' '),
    publishedAt: ad.first_publication_date || null
  }));
}

const WATCH_CONNECTORS = {
  leboncoin: fetchLeboncoinListings,
  vinted: fetchVintedListings,
  ebay: fetchEbayListings
};

const WATCH_ACTIVE_SCANS = new Set();

let watchSchedulerStarted = false;
let watchGlobalScanRunning = false;
let watchSearchRotation = 0;

function watchListingKey(platform, listing) {
  const id = String(listing.id || '').trim();

  if (!id) {
    throw new Error('Annonce sans identifiant.');
  }

  return `${platform}:${id}`;
}

function normalizeWatchListing(platform, raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Annonce invalide.');
  }

  const id = String(raw.id || '').trim();
  const title = String(raw.title || '').trim();
  const url = String(raw.url || '').trim();

  if (!id || !title || !url) {
    throw new Error('Annonce incomplète.');
  }

  const parsed = new URL(url);

  if (parsed.protocol !== 'https:') {
    throw new Error('URL d’annonce non sécurisée.');
  }

  // Vérifier également le domaine de chaque annonce.
  validateWatchSearchUrl(platform, url);

  const price = raw.price == null
    ? null
    : Number(raw.price);

  return {
    id,
    title: title.slice(0, 300),
    url,
    price: Number.isFinite(price) ? price : null,
    
imageUrl: raw.imageUrl || null,
brand: String(raw.brand || '').slice(0, 60),
size: String(raw.size || '').slice(0, 30),
condition: String(raw.condition || '').slice(0, 60),
location: String(raw.location || ''),
publishedAt: raw.publishedAt || null,
vehicleDetails: platform === 'leboncoin'
  ? (raw.vehicleDetails || {})
  : {}

  };
}


async function watchQueueListing(search, listing, initial = false) {
  const listingKey = watchListingKey(
    search.platform,
    listing
  );

  await WatchNotification.updateOne(
    {
      searchId: search._id,
      listingKey
    },
    {
      $setOnInsert: {
        searchId: search._id,
        listingKey,
        platform: search.platform,
        guildId: search.guildId,
        channelId: search.channelId,
        userId: search.userId,
        listing,
        initial,
        status: 'pending',
        attempts: 0,
        nextAttemptAt: new Date()
      }
    },
    { upsert: true }
  );
}


// Le moteur appelle uniquement des connecteurs configurés.
// Aucun accès non autorisé aux plateformes n'est effectué.
async function watchScanSearch(search) {
  const key = String(search._id);

  if (WATCH_ACTIVE_SCANS.has(key)) return;
  if (search.paused || !search.searchUrl) return;

  const connector = WATCH_CONNECTORS[search.platform];

  if (typeof connector !== 'function') return;

WATCH_ACTIVE_SCANS.add(key);

const scanStartedAt = Date.now();

try {
  const results = await connector(search.searchUrl, search);

  console.log('[SURVEILLANCE] RÉCUPÉRATION TERMINÉE', {
    plateforme: search.platform,
    recherche: key,
    dureeMs: Date.now() - scanStartedAt,
    annoncesRecuperees: Array.isArray(results)
      ? results.length
      : 'INVALIDE'
  });






    if (!Array.isArray(results)) {
      throw new Error('Le connecteur doit retourner un tableau.');
    }

    
const listings = [];
let invalidCount = 0;

for (const item of results) {
  try {
    const listing = normalizeWatchListing(
      search.platform,
      item
    );

    listings.push(listing);
  } catch (error) {
    invalidCount++;

    console.warn(
      `[SURVEILLANCE] Annonce ignorée (${search.platform}) :`,
      error.message
    );
  }
}

if (results.length > 0 && listings.length === 0) {
  throw new Error(
    `Aucune annonce exploitable sur ${results.length} résultats.`
  );
}

if (invalidCount > 0) {
  console.warn(
    `[SURVEILLANCE] ${invalidCount} annonce(s) invalides ignorée(s).`
  );
}


    // Déduplication dans les résultats reçus.
    const unique = [
      ...new Map(
        listings.map(item => [
          watchListingKey(search.platform, item),
          item
        ])
      ).values()
    ];


    const isInitialScan = !search.initialScanDone;

    // Lors du premier passage, on affiche au maximum
    // 10 annonces, mais on mémorise toutes celles récupérées.
    const selected = isInitialScan
      ? unique.slice(0, WATCH_CONFIG.initialResultsLimit)
      : unique;



for (const listing of selected) {
  await watchQueueListing(
    search,
    listing,
    isInitialScan
  );
}

    // Les anciennes annonces non affichées au premier
    // passage sont aussi mémorisées pour éviter
    // de les notifier au scan suivant.
    if (isInitialScan) {
      for (const listing of unique.slice(
        WATCH_CONFIG.initialResultsLimit
      )) {
        await WatchNotification.updateOne(
          {
            searchId: search._id,
            listingKey: watchListingKey(
              search.platform,
              listing
            )
          },
          {
            $setOnInsert: {
              searchId: search._id,
              listingKey: watchListingKey(
                search.platform,
                listing
              ),
              platform: search.platform,
              guildId: search.guildId,
              channelId: search.channelId,
              userId: search.userId,
              listing,
              initial: true,
              status: 'sent',
              sentAt: new Date()
            }
          },
          { upsert: true }
        );
      }
    }

    search.initialScanDone = true;
    search.seenListingIds = [];

    search.lastCheckedAt = new Date();
    search.lastScanError = '';

    await WatchSearch.updateOne(
  { _id: search._id },
  {
    $set: {
      initialScanDone: true,
      seenListingIds: [],
      lastCheckedAt: search.lastCheckedAt,
      lastScanError: ''
    }
  }
);

  } catch (error) {
    console.error(
      `[SURVEILLANCE] ${search.platform} / ${search._id}:`,
      error
    );

    await WatchSearch.updateOne(
      { _id: search._id },
      {
        $set: {
          lastCheckedAt: new Date(),
          lastScanError: String(error.message).slice(0, 500)
        }
      }
    ).catch(() => {});
  } finally {
    WATCH_ACTIVE_SCANS.delete(key);
  }
}


async function watchScanAll() {
  if (watchGlobalScanRunning) return;

  watchGlobalScanRunning = true;
  const cycleStartedAt = Date.now();

  try {
    const platforms = Object.entries(WATCH_CONNECTORS)
      .filter(([, connector]) => typeof connector === 'function')
      .map(([platform]) => platform);

    if (!platforms.length) return;

    const searches = await WatchSearch.find({
  paused: false,
  searchUrl: { $exists: true, $ne: '' },
  platform: { $in: platforms }
}).sort({ _id: 1 });

const MAX_CONCURRENT_SCANS = 3;

// Changer le point de départ à chaque cycle.
// Évite de privilégier systématiquement les mêmes recherches.
if (searches.length > 0) {
  const offset = watchSearchRotation % searches.length;

  const rotatedSearches = [
    ...searches.slice(offset),
    ...searches.slice(0, offset)
  ];

  searches.splice(0, searches.length, ...rotatedSearches);

  watchSearchRotation =
    (watchSearchRotation + MAX_CONCURRENT_SCANS) % searches.length;
}

    let nextIndex = 0;

    async function worker() {
      while (nextIndex < searches.length) {
        const search = searches[nextIndex++];

        try {
          await watchScanSearch(search);
        } catch (error) {
          console.error(
            `[SURVEILLANCE] Recherche ${search._id} :`,
            error
          );
        }
      }
    }

    await Promise.all(
      Array.from(
        {
          length: Math.min(
            MAX_CONCURRENT_SCANS,
            searches.length
          )
        },
        () => worker()
      )
    );

  } catch (error) {
    console.error(
      '[SURVEILLANCE] Erreur globale :',
      error
    );
} finally {
  console.log('[SURVEILLANCE] CYCLE TERMINÉ', {
    dureeMs: Date.now() - cycleStartedAt,
    intervalleCibleMs: WATCH_CONFIG.checkIntervalMs
  });

  watchGlobalScanRunning = false;
}
}



// ============================================================
// SURVEILLANCE — NETTOYAGE DES SALONS SUPPRIMÉS
// ============================================================

client.on(Events.ChannelDelete, async channel => {
  try {
    if (!channel.guildId) return;

    const search = await WatchSearch.findOne({
      guildId: channel.guildId,
      channelId: channel.id
    });

    if (!search) return;

    // Empêcher le moteur de reprendre cette recherche.
    await WatchSearch.updateOne(
      { _id: search._id },
      { $set: { paused: true } }
    );

    // Supprimer les notifications associées.
    const result = await WatchNotification.deleteMany({
      searchId: search._id
    });

    // Libérer la place de surveillance du membre.
    await WatchSearch.deleteOne({
      _id: search._id
    });

    console.log(
      `[SURVEILLANCE] Salon supprimé : ${channel.id}. ` +
      `Recherche ${search._id} nettoyée, ` +
      `${result.deletedCount} notification(s) supprimée(s).`
    );

  } catch (error) {
    console.error(
      '[SURVEILLANCE] Erreur nettoyage salon :',
      error
    );
  }
});



async function watchCleanupMissingChannels() {
  console.log('[SURVEILLANCE] Vérification des salons au démarrage...');

  const searches = await WatchSearch.find({});
  let deleted = 0;
  let checked = 0;
  let skipped = 0;

  for (const search of searches) {
    try {
      const guild = client.guilds.cache.get(search.guildId);

      // Serveur inaccessible : ne rien supprimer.
      if (!guild) {
        skipped++;
        continue;
      }

      checked++;

      try {
        const channel = await guild.channels.fetch(
          search.channelId,
          { force: true }
        );

        // Le salon existe : aucune modification.
        if (channel) continue;

        // Réponse vide : ne pas supposer une suppression.
        skipped++;
        continue;

      } catch (error) {
        // Discord 10003 = Unknown Channel.
        // C'est le seul cas qui autorise le nettoyage.
        if (error.code !== 10003) {
          console.warn(
            `[SURVEILLANCE] Vérification impossible : ${search.channelId}`,
            error.message
          );
          skipped++;
          continue;
        }
      }

      // Confirmer que la recherche existe toujours.
      const removed = await WatchSearch.findOneAndDelete({
        _id: search._id,
        guildId: search.guildId,
        channelId: search.channelId
      });

      if (!removed) continue;

      const result = await WatchNotification.deleteMany({
        searchId: search._id
      });

      deleted++;

      console.log(
        `[SURVEILLANCE] Recherche orpheline supprimée : ${search._id} ` +
        `(${result.deletedCount} notification(s)).`
      );

    } catch (error) {
      skipped++;

      console.error(
        `[SURVEILLANCE] Nettoyage impossible : ${search._id}`,
        error
      );
    }
  }

  console.log(
    `[SURVEILLANCE] Nettoyage terminé : ` +
    `${checked} vérification(s), ` +
    `${deleted} suppression(s), ` +
    `${skipped} ignorée(s).`
  );
}



function startWatchScheduler() {
  if (watchSchedulerStarted) return;

  watchSchedulerStarted = true;

  console.log(
    '[SURVEILLANCE] Moteur initialisé — intervalle : ' +
    `${WATCH_CONFIG.checkIntervalMs / 1000}s`
  );

  // Scanner les plateformes indépendamment des envois.
  const runScans = async () => {
    try {
      await watchScanAll();
    } catch (error) {
      console.error(
        '[SURVEILLANCE] Scanner :',
        error
      );
    }
  };

  // Traiter régulièrement les annonces en attente.
  const runDelivery = async () => {
    try {
      await watchDeliverPending();
    } catch (error) {
      console.error(
        '[SURVEILLANCE] Livraison Discord :',
        error
      );
    }
  };

  runScans();
  runDelivery();

  setInterval(
    runScans,
    WATCH_CONFIG.checkIntervalMs
  );

  setInterval(
    runDelivery,
    2000
  );
}



let watchDeliveryRunning = false;

async function watchDeliverPending() {
  if (watchDeliveryRunning) return;

  watchDeliveryRunning = true;

  try {
    const now = new Date();
    const pausedSearchIds = await WatchSearch.distinct(
  '_id',
  { paused: true }
);

    // Réinitialiser les envois interrompus.
    await WatchNotification.updateMany(
      {
        status: 'sending',
        lockedUntil: { $lte: now }
      },
      {
        $set: {
          status: 'pending',
          lockedUntil: null
        }
      }
    );

    for (let i = 0; i < 20; i++) {
      const notification =
        await WatchNotification.findOneAndUpdate(
          {
  status: 'pending',
  searchId: { $nin: pausedSearchIds },
  nextAttemptAt: { $lte: new Date() }
},
          {
            $set: {
              status: 'sending',
              lockedUntil: new Date(
                Date.now() + 120_000
              )
            }
          },
          {
            sort: { createdAt: 1 },
            new: true
          }
        );

      if (!notification) break;

      try {
        const search = await WatchSearch.findById(
          notification.searchId
        );

        if (!search) {
          await WatchNotification.deleteOne({
            _id: notification._id
          });
          continue;
        }

        if (search.paused) {
          await WatchNotification.updateOne(
            { _id: notification._id },
            {
              $set: {
                status: 'pending',
                lockedUntil: null,
                nextAttemptAt: new Date(
                  Date.now() + 60_000
                )
              }
            }
          );
          continue;
        }

        const guild = await client.guilds.fetch(
          notification.guildId
        );

        const channel = await guild.channels.fetch(
          notification.channelId
        );

        if (!channel?.isTextBased()) {
          throw new Error('Salon privé introuvable.');
        }

   
const deliveryStartedAt = Date.now();
          const message = await channel.send({
            components: [
              buildWatchListingCard(
                guild,
                notification.platform,
                notification.listing,
                search
              )
            ],
            flags: MessageFlags.IsComponentsV2,
            allowedMentions: { parse: [] }
          });

          console.log('[SURVEILLANCE] ANNONCE PUBLIÉE', {
  plateforme: notification.platform,
  recherche: String(notification.searchId),
  delaiEnvoiMs: Date.now() - deliveryStartedAt,
  attenteFileMs:
    Date.now() - new Date(notification.createdAt).getTime()
});



        await WatchNotification.updateOne(
          { _id: notification._id },
          {
            $set: {
              status: 'sent',
              messageId: message.id,
              sentAt: new Date(),
              lockedUntil: null,
              lastError: ''
            }
          }
        );

      } catch (error) {
        const attempts = notification.attempts + 1;


if (attempts >= 10) {
  await WatchNotification.updateOne(
    { _id: notification._id },
    {
      $set: {
        status: 'failed',
        attempts,
        lockedUntil: null,
        lastError: String(error.message).slice(0, 500)
      }
    }
  );

  console.error(
    `[SURVEILLANCE] Notification ${notification._id} ` +
    'abandonnée après 10 tentatives :',
    error.message
  );

  continue;
}


        const delay = Math.min(
          60 * 60 * 1000,
          30_000 * Math.pow(2, Math.min(attempts - 1, 7))
        );

        await WatchNotification.updateOne(
          { _id: notification._id },
          {
            $set: {
              status: 'pending',
              attempts,
              lockedUntil: null,
              nextAttemptAt: new Date(
                Date.now() + delay
              ),
              lastError: String(error.message).slice(0, 500)
            }
          }
        );

        console.error(
          '[SURVEILLANCE] Envoi échoué :',
          error
        );
      }
    }
  } catch (error) {
    console.error(
      '[SURVEILLANCE] File de notifications :',
      error
    );
  } finally {
    watchDeliveryRunning = false;
  }
}



function buildWatchListingCard(guild, platform, listing, search) {
  const platformName =
    WATCH_CONFIG.platforms[platform]?.name || platform;

  const emoji = getWatchEmoji(guild, platform);

  const clean = (value, max = 200) =>
    String(value ?? '')
      .replace(/@/g, '@\u200b')
      .replace(/([\\`*_~|>[\]()])/g, '\\$1')
      .slice(0, max);

  const price = Number.isFinite(listing.price)
    ? new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(listing.price)
    : 'Prix non renseigné';

  const title = clean(listing.title || 'Annonce sans titre', 180);

  const details = [];

  if (listing.brand) {
    details.push(clean(listing.brand, 60));
  }

  if (listing.size) {
    details.push(`Taille ${clean(listing.size, 30)}`);
  }

  if (listing.condition) {
    details.push(clean(listing.condition, 60));
  }


if (platform === 'leboncoin') {
  details.length = 0;

  const vehicle = listing.vehicleDetails || {};

  const firstLine = [
    vehicle.regdate,
    vehicle.mileage,
    vehicle.fuel
  ].filter(Boolean);

  const secondLine = [
    vehicle.gearbox
      ? `Boîte ${vehicle.gearbox.toLowerCase()}`
      : null,
    vehicle.doors
      ? `${vehicle.doors} portes`
      : null,
    vehicle.seats
      ? `${vehicle.seats} places`
      : null
  ].filter(Boolean);

  const ct = vehicle.vehicle_technical_inspection_valid;

  if (ct) {
    const valid = ['oui', 'true', '1'].includes(ct.toLowerCase());
    const invalid = ['non', 'false', '0'].includes(ct.toLowerCase());

    if (valid) secondLine.push('CT valide');
    else if (invalid) secondLine.push('CT non valide');
  }

  if (firstLine.length) details.push(firstLine.join(' · '));
  if (secondLine.length) details.push(secondLine.join(' · '));
}


  const location = listing.location
  ? clean(
      platform === 'leboncoin'
        ? String(listing.location)
            .replace(/\b\d{5}\b/g, '')
            .replace(/\s+/g, ' ')
            .trim()
        : listing.location,
      100
    )
  : null;

  const header =
    `### ${emoji ? emoji + ' ' : ''}${platformName.toUpperCase()}` +
    ` · NOUVELLE ANNONCE DÉTECTÉE`;

  
const info = [
  `### ${title}`,
  `# ${price}`,
  ...(platform === 'vinted'
    ? ['-# Prix incluant les frais de protection Vinted']
    : []),
  ...details.map(detail => `-# ${detail}`),
  ...(location
  ? [`-# ${location}`]
  : [])
].join('\n');


  const container = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(header)
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
    );

  let validImageUrl = null;

  if (listing.imageUrl) {
    try {
      const parsed = new URL(listing.imageUrl);

      if (
        parsed.protocol === 'https:' &&
        !parsed.username &&
        !parsed.password
      ) {
        validImageUrl = parsed.toString();
      }
    } catch {
      // URL invalide : fiche sans miniature.
    }
  }

  if (validImageUrl) {
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(info)
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(validImageUrl)
        )
    );
  } else {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(info)
    );
  }



container
  .addSeparatorComponents(
    new SeparatorBuilder()
  )
  .addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Ouvrir l'annonce")
        .setStyle(ButtonStyle.Link)
        .setURL(listing.url),

      new ButtonBuilder()
        .setCustomId(`watch_suspend_${search._id}`)
        .setLabel('Mettre en pause')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(Boolean(search.paused)),

      new ButtonBuilder()
        .setCustomId(`watch_resume_${search._id}`)
        .setLabel('Reprendre')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!search.paused),

      new ButtonBuilder()
        .setCustomId(`watch_delete_${search._id}`)
        .setLabel('Supprimer le salon')
        .setStyle(ButtonStyle.Secondary)
    )
  );



  return container;
}



const BOOKMAKERS_CATEGORY_ID = '1570174202055626813';



const BOOKMAKER_OFFERS = {
  
winamax: {
  title: 'Winamax',
  bonus: '20 €',
  url: 'https://www.winamax.fr/parrain?code=JEGIYZ',
  referralCode: 'JEGIYZ',
  officialUrl: 'https://www.winamax.fr/parrainage',
  notice: 'Offre réservée aux nouveaux joueurs majeurs. Le filleul dispose de 30 jours après son inscription pour valider son compte et effectuer un premier dépôt d’au moins 10 €. Maximum 5 filleuls par mois.',
  steps: [
  ['Inscris-toi', 'Utilise le code JEGIYZ ou le lien personnel.'],
  ['Valide ton compte', 'Sous 30 jours après inscription.'],
  ['Dépose 10 € minimum', 'Sous 30 jours après inscription.'],
  ['Reçois ton bonus', '10 € en Freebets + 10 € de bonus, sous conditions.']
]
},


  
betclic: {
  title: 'Betclic',
  bonus: '10 € en Freebets pour le filleul',
  url: 'https://betclic.onelink.me/2887093520/6c3132b8?af_sub5=JEGZXNG1',
  referralCode: 'JEGZXNG1',
  officialUrl: 'https://www.betclic.fr/scp-parrainage',
  notice: 'Parrain et filleul : 10 € chacun en Freebets. Le filleul doit effectuer un dépôt et valider son compte avec les justificatifs obligatoires. Crédits de jeu non retirables.',
  
steps: [
  ['Inscris-toi', 'Utilise le code JEGZXNG1 ou le lien personnel.'],
  ['Effectue un dépôt', 'Dépôt obligatoire, minimum non confirmé.'],
  ['Valide ton compte', 'Transmets les justificatifs demandés.'],
  ['Reçois 10 €', '10 € en Freebets pour le filleul et 10 € pour le parrain.']
]

},


  
unibet: {
  title: 'Unibet',
  bonus: "Jusqu'à 10 € en BonusBets pour le filleul",
  url: 'https://www.unibet.fr/inscription/?campaign=271026&parrain=69BD0125CCEBC6A',
  referralCode: null,
  officialUrl: 'https://www.unibet.fr/paris-sportifs/parrainage',
  notice: "Le parrain et le filleul peuvent recevoir chacun jusqu'à 10 € en BonusBets. Le montant dépend du dépôt du filleul et l'attribution intervient après validation de son compte.",
  
steps: [
  ['Inscris-toi', 'Utilise le lien personnel de parrainage.'],
  ['Valide ton compte', 'Transmets les justificatifs obligatoires.'],
  ['Effectue un dépôt', 'Le bonus dépend du montant déposé.'],
  ['Reçois ton bonus', "Jusqu'à 10 € en BonusBets pour chacun."]
]

},


  
pmu: {
  title: 'PMU PLAY',
  bonus: '5 € en ticket bonus pour le filleul',
  url: 'https://www.pmu.fr/turf/static/offre-parrainage/?codeParrainage=266757188',
  referralCode: '266757188',
  officialUrl: 'https://www.pmu.fr/turf/static/offre-parrainage/',
  notice: 'Offre valable jusqu’au 31/12/2026 inclus. Parrain : 10 € par filleul confirmé, maximum 5 filleuls par mois. Filleul : 5 €. Tickets non retirables et non sécables. Offre non cumulable avec une autre offre de parrainage.',
  
steps: [
  ['Inscris-toi', 'Crée ton compte PMU PLAY avec le code 266757188.'],
  ['Dépose 10 € minimum', "Le jour même de l'ouverture du compte."],
  ['Valide ton compte', 'Transmets les justificatifs obligatoires.'],
  ['Reçois 5 €', 'Ticket bonus attribué sous 10 jours ouvrés après confirmation du compte.']
]

},


  
betsson: {
  title: 'Betsson',
  bonus: '20 € de bonus par parrainage réussi',
  url: null,
  referralCode: null,
  officialUrl: 'https://www.betsson.fr/',
  notice: 'Le programme affiché annonce 20 € de bonus par parrainage réussi et jusqu’à 50 € de bonus. Le parrain doit valider son compte et effectuer un premier dépôt avant de pouvoir parrainer. Les conditions détaillées restent à vérifier.',
  
steps: [
  ['Crée ton compte', 'Inscris-toi sur Betsson via un lien de parrainage valide.'],
  ['Valide ton identité', 'Transmets les justificatifs demandés.'],
  ['Respecte les conditions', 'Effectue les actions exigées par le programme de parrainage.']
]

}
};



for (const [slug, data] of Object.entries(BOOKMAKER_OFFERS)) {
  addReferralOffer(slug, {
    ...data,
    category: 'bookmakers',
    verifiedAt: null,
    draft: false
  });
}



const REFERRAL_DEFAULT_STEPS = {
  banque: [
    ['Consulte l’offre de bienvenue', 'Vérifie les primes et conditions applicables.'],
    ['Vérifie ton éligibilité', 'Âge, résidence et première ouverture selon l’établissement.'],
    ['Effectue ton inscription', 'Suis les modalités officielles du parrainage.'],
    ['Respecte les conditions de récompense', 'Dépôts, paiements et délais éventuels à vérifier.']
  ],

  investissement: [
    ['Consulte le programme de bienvenue', 'Vérifie la récompense applicable.'],
    ['Vérifie ton éligibilité', 'Pays, âge et type de compte autorisé.'],
    ['Ouvre ton compte', 'Dépôt ou investissement éventuel selon les conditions.'],
    ['Vérifie les conditions de récompense', 'Montant, délai et risque de perte en capital.']
  ],

  crypto: [
    ['Consulte l’offre disponible', 'Vérifie son accessibilité en France.'],
    ['Crée et vérifie ton compte', 'Identification requise selon la plateforme.'],
    ['Réalise les opérations admissibles', 'Dépôt ou transaction éventuelle selon l’offre.'],
    ['Consulte les conditions de récompense', 'Montant, délai et risque de perte en capital.']
  ],

  cashback: [
    ['Consulte l’offre de bienvenue', 'Vérifie la prime de parrainage disponible.'],
    ['Inscris-toi selon les modalités prévues', 'Le suivi du parrainage doit être correctement activé.'],
    ['Effectue un achat éligible si nécessaire', 'Marchands, exclusions et seuils à vérifier.'],
    ['Attends la validation de la récompense', 'Les retours et annulations peuvent annuler le cashback.']
  ],

  aides: [
    ['Vérifie les conditions d’éligibilité', 'Âge, ressources et situation selon le dispositif.'],
    ['Prépare tes justificatifs', 'Documents demandés par l’organisme compétent.'],
    ['Dépose ta demande officielle', 'Utilise le portail de l’organisme concerné.'],
    ['Suis ton dossier', 'Montant, durée et décision selon ta situation.']
  ]
};

// Détails spécifiques déjà renseignés.
// Les autres fiches utilisent les étapes de leur catégorie.

const REFERRAL_DETAILS = {
  revolut: {
    bonus: null,
    notice: 'Prime généralement réservée au parrain ; montant variable selon la campagne.',
    officialUrl: 'https://www.revolut.com/fr-FR/legal/referrals-terms/',
    referralTermsUrl: 'https://www.revolut.com/fr-FR/legal/referrals-terms/',
    steps: [
      ['Ouvre ton premier compte Revolut', 'Inscription via une invitation éligible et vérification d’identité.'],
      ['Ajoute de l’argent sur ton compte', 'Approvisionnement selon les modalités de la campagne.'],
      ['Commande une carte physique', 'Commande requise selon les conditions de l’invitation.'],
      ['Effectue les achats éligibles', 'Nombre, montant et échéance précisés dans l’application du parrain.']
    ]
  },

  wise: {
    bonus: null,
    notice: 'Récompense variable selon le programme d’invitation.',
    officialUrl: 'https://wise.com/fr/help/',
    steps: [
      ['Consulte ton invitation Wise', 'L’avantage dépend du programme proposé.'],
      ['Crée ton compte', 'Inscription selon les modalités de l’invitation.'],
      ['Effectue les opérations requises', 'Transfert ou opération éligible selon la campagne.'],
      ['Vérifie ton avantage', 'Montant et délai indiqués dans les conditions du programme.']
    ]
  },

  'trade-republic': {
    bonus: null,
    notice: 'Offre personnelle soumise à conditions ; diffusion publique du lien à vérifier.',
    officialUrl: 'https://support.traderepublic.com/fr-fr/',
    steps: [
      ['Vérifie l’éligibilité de ton invitation', 'Le programme dépend des conditions de ton compte.'],
      ['Ouvre ton compte selon les modalités autorisées', 'Respecte les conditions d’inscription.'],
      ['Réalise les opérations demandées', 'Premier investissement ou autre condition selon la campagne.'],
      ['Vérifie la récompense', 'Montant et restrictions précisés dans l’offre personnelle.']
    ]
  }
};

// Génération des 46 fiches supplémentaires.

for (const [category, entries] of Object.entries(REFERRAL_CATALOG)) {
  for (const [slug, title] of entries) {
    if (REFERRAL_OFFERS[`┃${slug}`]) continue;
    const details = REFERRAL_DETAILS[slug] || {};

    addReferralOffer(slug, {
      title,
      category,
      bonus: details.bonus ?? null,
      notice: details.notice || (
        category === 'aides'
          ? 'Dispositif soumis à des conditions d’éligibilité.'
          : 'Conditions et récompenses à confirmer avant publication.'
      ),
      officialUrl: details.officialUrl || null,
      steps: details.steps || REFERRAL_DEFAULT_STEPS[category],
      draft: true
    });
  }
}




const REFERRAL_VERIFIED_UPDATES = {
  revolut: {
    bonus: null,
    notice:
      'Récompense variable, généralement réservée au parrain. ' +
      'Invitation personnelle uniquement ; diffusion de masse interdite.',
    officialUrl:
      'https://www.revolut.com/fr-FR/legal/referrals-terms/',
    steps: [
      [
        'Ouvre ton premier compte Revolut',
        'Utilise une invitation personnelle et vérifie ton identité.'
      ],
      [
        'Approvisionne ton compte',
        'Par carte ou virement admissible ; les transferts entre comptes Revolut sont exclus.'
      ],
      [
        'Commande une carte physique',
        'La commande doit être effectuée avant la date limite de la campagne.'
      ],
      [
        'Réalise les achats éligibles',
        'Nombre, montant minimum et délai indiqués dans l’application ; jeux d’argent et cartes cadeaux exclus.'
      ]
    ]
  },

  fortuneo: {
    bonus: '150 €',
    notice:
      'Offres bancaires du 01/11 au 30/11/2026. ' +
      'Primes non cumulables entre produits.',
    officialUrl: 'https://www.fortuneo.fr/parrainage',
    steps: [
      [
        'Choisis ton premier produit Fortuneo',
        '+80 € avec Fosfo ou +150 € avec Gold Mastercard pour le filleul.'
      ],
      [
        'Renseigne le code parrain à la souscription',
        'Le parrain doit détenir au moins 300 € d’encours global.'
      ],
      [
        'Verse 300 € dans les 6 jours suivant l’ouverture',
        'Condition applicable aux offres bancaires Fosfo et Gold.'
      ],
      [
        'Découvre les alternatives Bourse et assurance-vie',
        'Jusqu’à 80 € en Bourse ou 120 € en assurance-vie, avec 1 000 € de versement initial.'
      ]
    ]
  },

  'pass-culture': {
    bonus: '150 €',
    notice:
      'Crédit culturel selon l’âge : 50 € à 17 ans, 150 € à 18 ans, bonus possible de 50 €.',
    officialUrl:
      'https://pass.culture.fr/le-pass-culture-cest-quoi',
    steps: [
      [
        'Vérifie ton âge et ton éligibilité',
        'Crédit individuel à partir de 17 ans, sous conditions de résidence.'
      ],
      [
        'Crée ton compte pass Culture',
        'Inscription et vérification de ton identité dans l’application.'
      ],
      [
        'Profite de ton crédit culturel',
        '50 € à 17 ans ou 150 € à 18 ans pour les offres éligibles.'
      ],
      [
        'Vérifie ton droit au bonus supplémentaire',
        '+50 € possibles sous conditions de ressources ou de handicap.'
      ]
    ]
  },

  'aide-mobili-jeune': {
    bonus: '100 €/mois',
    notice:
      'Aide de 10 à 100 € par mois, plafonnée à 1 100 € par année de formation.',
    officialUrl:
      'https://www.actionlogement.fr/l-aide-mobili-jeune',
    steps: [
      [
        'Vérifie ton éligibilité',
        'Moins de 30 ans, alternance dans le privé non agricole et salaire brut jusqu’à 120 % du SMIC.'
      ],
      [
        'Vérifie les conditions liées au logement',
        'Loyer, distance et autres critères définis par Action Logement.'
      ],
      [
        'Dépose ton dossier auprès d’Action Logement',
        'Joins ton contrat, tes justificatifs de logement et les pièces demandées.'
      ],
      [
        'Obtiens une aide sur ton reste à charge',
        'De 10 à 100 € par mois après déduction des aides au logement, sous conditions.'
      ]
    ]
  }
};

for (const [slug, details] of Object.entries(
  REFERRAL_VERIFIED_UPDATES
)) {
  const offer = REFERRAL_OFFERS[`┃${slug}`];
  if (!offer) continue;

if (['boursobank', 'fortuneo', 'revolut'].includes(slug)) {
  continue;
}
  Object.assign(offer, {
    ...details,
    verifiedAt: '10/11/2026',
    draft: false
  });
}


const BANK_RESEARCH_UPDATES = {
  boursobank: {
    bonus: null,
    notice: 'Programme de parrainage soumis à des campagnes limitées. La dernière offre détaillée retrouvée a expiré le 04/11/2026.',
    officialUrl: 'https://www.boursobank.com/bon-plan/parrainage-boursobank',
    steps: [
      ['Vérifie la campagne en cours', 'Le montant dépend de la période et des conditions de ton invitation.'],
      ['Ouvre ton premier compte bancaire éligible', 'Utilise l’invitation et respecte les conditions de premier versement.'],
      ['Effectue les opérations demandées', 'Certaines campagnes prévoient des paiements par carte sur 3 mois.'],
      ['Vérifie les conditions EasyMove', 'La mobilité bancaire peut donner droit à une prime distincte ; une reprise des primes est possible en cas de clôture anticipée.']
    ]
  },

  fortuneo: {
    bonus: '150 €',
    notice: 'Montant maximal de la campagne bancaire renseignée pour novembre 2026 ; à confirmer avec le règlement de l’invitation.',
    officialUrl: 'https://www.fortuneo.fr/parrainage',
    steps: [
      ['Choisis une carte bancaire éligible', 'Fosfo : 80 € ; Gold Mastercard : jusqu’à 150 € selon la campagne.'],
      ['Saisis le code parrain pendant la souscription', 'Le code doit être renseigné dans le parcours de souscription.'],
      ['Effectue le versement demandé', 'Versement de 300 € dans les 6 jours suivant l’ouverture selon les conditions publiées.'],
      ['Respecte les conditions de conservation', 'Vérifie la durée minimale de détention et les éventuelles restrictions de cumul.']
    ]
  },

  revolut: {
    bonus: null,
    notice: 'Prime définie dans l’invitation personnelle. Parrainage réservé aux contacts consentants ; marketing de masse interdit.',
    officialUrl: 'https://www.revolut.com/fr-FR/legal/referrals-terms/',
    steps: [
      ['Reçois une invitation personnelle', 'Le parrain doit avoir reçu une campagne éligible dans son application.'],
      ['Ouvre ton premier compte Revolut', 'Inscription via le lien et vérification d’identité.'],
      ['Réalise les étapes indiquées dans la campagne', 'Approvisionnement, commande de carte et achats selon les exigences de l’invitation.'],
      ['Respecte la date limite', 'Les récompenses sont normalement versées sous 10 jours ouvrables après validation des étapes.']
    ]
  },

  
'hello-bank': {
  bonus: '130 €',
  notice: "Offre de parrainage Hello bank! : 80 € pour une première ouverture de compte éligible. Avec Hello Prime, 50 € supplémentaires sous réserve d'effectuer au moins 5 paiements ou retraits par mois pendant les 12 premiers mois entiers. Un avantage distinct de 200 € en bon d'achat peut être proposé pour la mobilité bancaire Hello Start+, selon les conditions de la campagne. Offre non garantie hors période de validité.",
  officialUrl: 'https://www.hellobank.fr/fr/parrainage/reglement-parrainage/',
  steps: [
    ['Reçois une invitation Hello bank!', 'Utilise le lien ou le QR code transmis par ton parrain.'],
    ['Ouvre ton premier compte éligible', '80 € de prime après validation définitive de l’ouverture.'],
    ['Choisis Hello Prime pour obtenir le complément', '50 € supplémentaires après 12 mois de conditions d’utilisation de la carte.'],
    ['Vérifie les avantages de mobilité bancaire', 'Un bon d’achat de 200 € peut être proposé séparément via Hello Start+, sous conditions.']
  ]
},


  monabanq: {
    bonus: '280 €',
    notice: 'Offre de bienvenue pouvant atteindre 280 € pour le filleul ; compte bancaire payant selon la formule choisie.',
    officialUrl: 'https://www.monabanq.com/fr/parrainage.html',
    steps: [
      ['Ouvre un premier compte Monabanq éligible', 'Choisis Pratiq+, Uniq ou Uniq+ via une invitation.'],
      ['Alimente ton compte de 300 €', '20 € à l’ouverture puis 60 € supplémentaires avec 300 € déposés dans le mois suivant l’ouverture.'],
      ['Effectue les opérations par carte prévues', 'Le bonus dépend du nombre de paiements et de la campagne appliquée.'],
      ['Vérifie les autres primes de bienvenue', 'Le total peut atteindre 280 € sous conditions ; le parrainage rapporte généralement 30 ou 50 € au parrain selon la formule.']
    ]
  },

  n26: {
    bonus: null,
    notice: 'Montant de la prime visible dans l’application N26 du parrain.',
    officialUrl: 'https://n26.com/fr-fr/invitez-vos-amis',
    steps: [
      ['Récupère le code de parrainage N26', 'Disponible dans la rubrique Invitez vos amis de l’application.'],
      ['Ouvre un compte avec le lien ou le code', 'Le filleul doit finaliser une inscription éligible.'],
      ['Effectue un achat qualifiant', 'Paiement admissible avec la Mastercard N26.'],
      ['Attends la validation du parrainage', 'La prime du parrain peut être versée sous 60 jours ouvrés.']
    ]
  },

  bunq: {
    bonus: null,
    notice: 'Récompenses variables selon l’onglet et l’invitation : carte, intérêts, trading ou mobilité bancaire.',
    officialUrl: 'https://help.bunq.com/fr-fr/articles/how-can-i-invite-my-friends-to-join-bunq',
    steps: [
      ['Choisis une récompense dans bunq', 'Les offres diffèrent entre les onglets Cartes, Épargne, Actions et autres.'],
      ['Invite un ami par SMS depuis l’application', 'Une invitation par type de récompense et par mois ; jusqu’à 5 invitations mensuelles.'],
      ['Finalise l’ouverture et la vérification du compte', 'Le filleul doit s’inscrire depuis l’invitation reçue.'],
      ['Réalise l’opération éligible', 'Par exemple un paiement unique de 50 € pour la carte personnalisée, ou une mobilité bancaire pour certaines primes.']
    ]
  },

'distingo-bank': {
  bonus: '80 €',
  notice: "Parrainage valable jusqu'au 30/11/2026 : demande du filleul avant 16h, code transmis avant 15h. Premier versement reçu au plus tard le 11/12/2026. Le filleul doit maintenir au moins 10 000 € d'encours pendant les 3 mois suivant l'ouverture. Prime de 80 € versée sous 7 jours après cette période, si le livret reste ouvert. Réservé aux nouveaux clients majeurs fiscalement domiciliés en France.",
  officialUrl: 'https://distingobank.fr/conditions-des-offres/',
  steps: [
    ['Obtiens un code de parrainage DISTINGO', 'Utilise le code personnel transmis par un client existant.'],
    ['Ouvre ton premier Livret DISTINGO', 'Demande en ligne avant le 30 novembre 2026 à 16h.'],
    ['Maintiens au moins 10 000 € pendant 3 mois', 'Encours cumulé du livret et des éventuels comptes à terme.'],
    ['Reçois ta prime de 80 €', 'Versement sous 7 jours après les 3 mois, sous réserve du respect des conditions.']
  ]
},

  nickel: {
    bonus: null,
displayStatus: 'suspended',
notice: "Aucune campagne de parrainage active confirmée au 12/11/2026. La dernière campagne officielle retrouvée s'est terminée le 02/03/2026. Les anciennes primes ne sont plus garanties.",
officialUrl: 'https://nickel.eu/fr/magazine/le-parrainage-nickel-est-de-retour',
    steps: [
      ['Vérifie si Nickel a relancé le parrainage', 'La campagne à 5 € par parrainage s’est terminée le 02/03/2026.'],
      ['Récupère ton code si une campagne est ouverte', 'Les codes peuvent être accessibles dans l’application ou par e-mail.'],
      ['Fais ouvrir un compte à un nouveau client', 'Inscription en ligne ou chez un buraliste partenaire.'],
      ['Vérifie les conditions de récompense', 'Le montant, le bénéficiaire et les dates dépendent du règlement de la campagne.']
    ]
  },

  sumeria: {
    bonus: null,
notice: "Le montant et la nature de la récompense dépendent de la campagne personnelle affichée dans l'application Sumeria. Seul le parrain est normalement récompensé, sauf disposition contraire. Le filleul doit accepter les conditions dans les 7 jours et accomplir les actions demandées avant l'échéance de l'offre.",
officialUrl: 'https://support.sumeria.eu/l/fr/article/iqxnyfz65u-le-parrainage-dans-l-application-lydia',
    steps: [
      ['Vérifie les offres proposées dans Sumeria', 'Une campagne personnelle peut différer des offres publiques.'],
      ['Consulte les conditions d’éligibilité', 'Vérifie le type de compte et les éventuelles restrictions.'],
      ['Effectue ton inscription selon les modalités officielles', 'Ne saisis un code que si une offre valide le prévoit.'],
      ['Contrôle la récompense annoncée', 'Montant, opérations nécessaires et date limite à confirmer.']
    ]
  },

  wise: {
    bonus: null,
notice: "Le filleul peut bénéficier d'une réduction de frais de transfert ou d'un avantage sur la carte Wise, selon le programme associé au lien d'invitation. La récompense du parrain et les opérations nécessaires varient également. Les conditions exactes sont consultables sur la page personnelle d'invitation.",
officialUrl: 'https://wise.com/fr/help/articles/77zvWSO4tKdGobXrgHIJAA/comment-fonctionne-le-programme-de-parrainage-standard',
    steps: [
      ['Consulte les conditions de ton invitation Wise', 'Les avantages et récompenses peuvent varier selon l’utilisateur.'],
      ['Ouvre ton compte depuis une invitation éligible', 'Respecte les conditions applicables au nouveau client.'],
      ['Effectue les opérations qualifiantes', 'Les transferts, montants et délais sont définis par la campagne.'],
      ['Vérifie l’attribution de la récompense', 'Le montant et la date limite figurent sur la page personnelle d’invitation.']
    ]
  },

  'la-banque-postale': {
    bonus: '70 €',
    notice: "Offre de parrainage « 20 ans de La Banque Postale » : jusqu'à 70 € pour le filleul, répartis en deux avantages de 50 € et 20 €, sous réserve des conditions propres à chacun. Ouverture d'une Formule de Compte éligible et utilisation du parcours de parrainage officiel. Offre limitée à 5 filleuls par parrain et par an.",
officialUrl: 'https://parrainage.labanquepostale.fr/',
    steps: [
      ['Vérifie ton éligibilité à l’offre anniversaire', 'Le parrain doit participer au programme de parrainage.'],
      ['Reçois une invitation d’un client La Banque Postale', 'Le parrain complète le formulaire dédié.'],
      ['Ouvre une Formule de Compte éligible', 'L’ouverture doit respecter le règlement du programme.'],
      ['Vérifie le versement des récompenses', 'Jusqu’à 70 € pour chacun selon les conditions de l’offre ; maximum de 5 filleuls par an pour le parrain.']
    ]
  }
};

for (const [slug, details] of Object.entries(BANK_RESEARCH_UPDATES)) {
  const offer = REFERRAL_OFFERS[`┃${slug}`];
  if (!offer) {
    console.warn(`Fiche bancaire introuvable : ${slug}`);
    continue;
  }
  if (['boursobank', 'fortuneo', 'revolut'].includes(slug)) {
  continue;
}

  Object.assign(offer, {
    ...details,
    verifiedAt: '10/11/2026',
    draft: ![
      'monabanq',
      'n26',
      'bunq',
      'revolut',
      'wise',
      'la-banque-postale'
    ].includes(slug)
  });
}


const INVESTMENT_RESEARCH_UPDATES = {
  'trade-republic': {
    bonus: '70 € en actions',
notice: "Le montant de la récompense et les conditions de participation sont personnalisés dans l'application Trade Republic. Le filleul doit utiliser le lien personnel, enregistrer son numéro de téléphone puis ouvrir son compte avec ce même numéro. Les opérations et délais nécessaires dépendent de l'offre affichée. Les liens diffusés publiquement peuvent être exclus du programme.",
officialUrl: 'https://support.traderepublic.com/fr-lu/463-Comment-puis-je-participer-au-programme-Parrainer-un-ami',

    steps: [
      [
        'Reçois une invitation personnelle',
        'Le parrain doit être éligible au programme ; le montant et les conditions figurent dans son application.'
      ],
      [
        'Inscris ton numéro de téléphone via le lien',
        'Utilise ensuite le même numéro pour ouvrir ton compte Trade Republic.'
      ],
      [
        'Ouvre ton compte et remplis les conditions',
        'Une première transaction ou un investissement programmé peut être demandé selon la campagne.'
      ],
      [
        'Vérifie la validation de la récompense',
        'Les conditions et échéances personnalisées sont disponibles dans l’application.'
      ]
    ]
  },

  trading212: {
    
bonus: null,
displayStatus: 'suspended',
notice: "La dernière campagne de parrainage officielle retrouvée s'est terminée le 03/11/2026. Elle proposait des fractions d'actions d'une valeur comprise entre 8 € et 100 €, sous conditions de vérification du compte et de dépôt. Aucune nouvelle campagne n'est confirmée à cette date.",
officialUrl: 'https://helpcentre.trading212.com/hc/en-us/articles/360007291258-Invite-Your-Friends-Get-Free-Fractional-Shares',
steps: [
      [
        'Vérifie si une nouvelle campagne est ouverte',
        'La dernière campagne identifiée allait du 21/09 au 03/11/2026.'
      ],
      [
        'Inscris-toi avec une invitation éligible',
        'Le pays de résidence et le type de compte doivent être acceptés.'
      ],
      [
        'Remplis les conditions de la campagne',
        'Lors de la dernière offre, les conditions devaient être satisfaites dans les 10 jours suivant la création du compte.'
      ],
      [
        'Reçois une action fractionnée si tu es éligible',
        'La précédente campagne attribuait des actions aléatoires de 8 à 100 €, avec un maximum de 5 récompenses par campagne.'
      ]
    ]
  },

  etoro: {
    
bonus: null,
notice: "Programme de parrainage eToro Europe : récompense de 50 à 500 USD réservée au parrain selon son solde éligible. Le filleul doit être un nouveau client, vérifier son compte, déposer au moins 100 USD et ouvrir des positions d'au moins 100 USD au total dans les 90 jours. Aucune prime directe pour le filleul n'est prévue dans ce règlement. Investir comporte un risque de perte en capital.",
officialUrl: 'https://www.etoro.com/customer-service/terms-conditions/',

    steps: [
      [
        'Vérifie l’éligibilité du programme eToro',
        'Le règlement européen inclut notamment les résidents français.'
      ],
      [
        'Invite un nouveau client avec ton lien',
        'Le filleul doit satisfaire aux conditions d’inscription et de qualification du programme.'
      ],
      [
        'Vérifie le palier de récompense du parrain',
        '50, 100, 200 ou 500 $ selon le solde éligible du parrain et les limites du règlement.'
      ],
      [
        'Attends la validation de la prime',
        'Le règlement prévoit un crédit au parrain sous 7 jours après satisfaction des conditions.'
      ]
    ]
  },

  shares: {
    
bonus: '5 ordres offerts',
notice: "Le filleul bénéficie de 5 ordres sans frais de transaction, sous réserve des exclusions prévues par Shares. Il doit être majeur, résider en France, ouvrir son premier compte via une invitation et déposer au moins 1 € dans les 7 jours. Avantage non convertible en espèces. Le règlement interdit la publication publique des liens et codes de parrainage.",
officialUrl: 'https://www.shares.io/fr/terms/referral-free-trades',

    steps: [
      [
        'Vérifie ton éligibilité au parrainage Shares',
        'Le parrain et le filleul doivent résider en France ; le filleul doit être majeur et nouveau client.'
      ],
      [
        'Inscris-toi via un lien ou un code personnel',
        'Utilise le lien sur le téléphone servant à télécharger l’application Shares.'
      ],
      [
        'Ouvre et vérifie ton compte',
        'Respecte les conditions d’identification et les exclusions prévues au règlement.'
      ],
      [
        'Vérifie les conditions de récompense',
        'Le parrain doit notamment avoir accepté le programme et réalisé son premier dépôt.'
      ]
    ]
  },

  yomoni: {
    
bonus: '500 €',
notice: "Offre du 08/09/2026 au 08/12/2026, réservée aux nouveaux clients éligibles. Prime de 100 € dès 5 000 € investis, 200 € dès 25 000 €, 300 € dès 50 000 € et 500 € dès 100 000 €. Première souscription ou transfert éligible en gestion sous mandat. Prime versée après 12 mois si les conditions de conservation sont respectées. Investissement comportant un risque de perte en capital. La publication publique du code peut exclure la prime du parrain.",
officialUrl: 'https://www.yomoni.fr/legal/parrainage',

    steps: [
      [
        'Ouvre ton premier contrat Yomoni éligible',
        'Assurance-vie, CTO, PEA ou PER en gestion sous mandat, avec code de parrainage valide.'
      ],
      [
        'Effectue ton versement initial',
        '5 000 € : 100 € ; 25 000 € : 200 € ; 50 000 € : 300 € ; 100 000 € : 500 €.'
      ],
      [
        'Respecte les conditions du contrat',
        'Dossier complet avant le 09/12/2026, supports éligibles et exposition minimale aux unités de compte ou OPC.'
      ],
      [
        'Conserve ton investissement pour recevoir la prime',
        'Versement prévu après 12 mois, sous réserve du maintien des conditions. Offre non cumulable.'
      ]
    ]
  },

  ramify: {
    
bonus: null,
displayStatus: 'suspended',
notice: "Le programme de parrainage Ramify affichait jusqu'à 500 € pour le parrain et le filleul, selon le montant investi. Toutefois, le règlement publié indique une fin de campagne au 31/10/2026. Les conditions d'une éventuelle nouvelle campagne doivent être confirmées avant activation. Les investissements comportent un risque de perte en capital.",
officialUrl: 'https://www.ramify.fr/parrainage',

    steps: [
      [
        'Vérifie l’existence d’une campagne active',
        'Le règlement détaillé consulté indiquait une validité du 19/08 au 31/10/2026.'
      ],
      [
        'Inscris-toi avec un code de parrainage',
        'Le code doit être renseigné pendant l’inscription et ne peut pas être ajouté ensuite.'
      ],
      [
        'Investis sur un produit éligible',
        'Le dernier règlement prévoyait un minimum de 1 000 € et une prime de 50 à 500 € selon le montant investi.'
      ],
      [
        'Respecte les délais et la conservation',
        'Le règlement prévoit 30 jours pour cumuler les investissements, puis 180 jours de conservation avant validation.'
      ]
    ]
  },

  finary: {
    bonus: '1 mois Premium',
notice: "Le programme officiel prévoit un mois de Finary Premium offert au parrain pour chaque filleul inscrit avec son lien ou code et ayant synchronisé deux établissements financiers distincts. Aucun avantage systématique pour le filleul n'est confirmé par ce règlement. Les mois offerts sont soumis aux conditions d'abonnement et de facturation.",
officialUrl: 'https://help.finary.com/fr/articles/8907933-le-programme-de-parrainage',

    steps: [
      [
        'Inscris-toi avec un lien ou code Finary',
        'Le parrainage doit être enregistré au moment de la création du compte.'
      ],
      [
        'Connecte deux établissements différents',
        'Deux établissements synchronisés sont nécessaires pour valider le parrainage.'
      ],
      [
        'Débloque ton mois de Premium',
        'Le filleul bénéficie d’un mois de Premium ; le parrain reçoit également un mois offert.'
      ],
      [
        'Vérifie l’application de la récompense',
        'Pour un abonnement Web existant, le mois offert peut prendre la forme d’une réduction. Les abonnements via les stores sont soumis à des restrictions.'
      ]
    ]
  }
};

for (const [slug, details] of Object.entries(
  INVESTMENT_RESEARCH_UPDATES
)) {
  const offer = REFERRAL_OFFERS[`┃${slug}`];

  if (!offer) {
    console.warn(`Fiche investissement introuvable : ${slug}`);
    continue;
  }
if (['boursobank', 'fortuneo', 'revolut'].includes(slug)) {
  continue;
}
  Object.assign(offer, {
    ...details,
    verifiedAt: '10/11/2026',
    draft: [
      'trading212',
      'shares',
      'ramify'
    ].includes(slug)
  });
}



const CRYPTO_RESEARCH_UPDATES = {
  coinbase: {
    bonus: null,
    notice: "Le montant du bonus dépend du pays et de l'offre personnelle de parrainage. Le filleul doit créer son premier compte Coinbase avec le lien d'invitation et effectuer un achat de cryptomonnaie éligible dans les 90 jours suivant la vérification de son identité. Les achats Coinbase Advanced et Coinbase Prime sont exclus. Récompense soumise aux conditions et à l'éligibilité de chaque participant.",
officialUrl: 'https://help.coinbase.com/fr/coinbase/getting-started/getting-started-with-coinbase/new-customer-incentive/simple-referral',
    steps: [
      [
        'Inscris-toi via un lien de parrainage Coinbase',
        'Crée ton premier compte et termine la vérification d’identité.'
      ],
      [
        'Vérifie les conditions de ton invitation',
        'Le montant de la prime et le minimum d’achat sont précisés dans l’offre.'
      ],
      [
        'Effectue un achat de cryptos éligible',
        'Achat sur Coinbase classique par carte ou virement, dans les 60 jours après vérification selon le programme EEE. Coinbase Advanced et les stablecoins sont exclus.'
      ],
      [
        'Reçois ta récompense après validation',
        'Prime en cryptomonnaie selon les conditions affichées. Le parrainage exclut certaines autres offres de bienvenue.'
      ]
    ]
  },

  swissborg: {
    
bonus: '50 €',
notice: "Jusqu'à 50 € en Bitcoin pour le parrain et le filleul. Le filleul doit être un nouvel utilisateur SwissBorg, créer son compte via l'invitation, confirmer le code de parrainage et terminer le défi affiché dans l'application. Le défi varie selon le pays et la récompense proposée. Une récompense fixe ou un coupon bonus peut être disponible. Les 50 € constituent un plafond, pas un gain garanti.",
officialUrl: 'https://help.swissborg.com/hc/fr-fr/articles/360010649897-Programme-de-parrainage-SwissBorg',

    steps: [
      [
        'Inscris-toi sur SwissBorg avec un code parrain',
        'Saisis et confirme le code pendant la création du compte, puis vérifie ton identité.'
      ],
      [
        'Réalise le défi de parrainage classique',
        'Effectue un premier échange de 100 € pour débloquer la récompense standard.'
      ],
      [
        'Participe à la campagne Bitcoin de fin d’année',
        'Achète au moins 250 € de cryptos avant le 31/12/2026 pour participer à la cagnotte collective.'
      ],
      [
        'Débloque les récompenses sous conditions',
        'Jusqu’à 50 € chacun via le programme classique. La cagnotte ajoute 20 € chacun seulement si 150 parrainages qualifiés sont atteints.'
      ]
    ]
  },

  bitvavo: {
    bonus: null,
    notice: "Le bonus du filleul dépend de la campagne disponible dans le Campaign Hub Bitvavo. Il peut être versé en euros ou en cryptomonnaies. Le filleul doit créer son premier compte avec le code de parrainage, vérifier son identité et son compte bancaire, puis effectuer les dépôts ou transactions demandés dans les délais. Le code ne peut pas être ajouté après l'inscription. Le bonus est normalement crédité sous 48 heures après validation des conditions.",
officialUrl: 'https://support.bitvavo.com/hc/fr/articles/4405239714577-Comment-fonctionne-le-Programme-de-parrainage-d-amis-Bitvavo',
    steps: [
      [
        'Vérifie la campagne disponible sur Bitvavo',
        'Le montant, les pays éligibles et les objectifs sont indiqués dans le Campaign Hub.'
      ],
      [
        'Crée ton premier compte avec un code parrain',
        'Réservé aux nouveaux clients majeurs, sous conditions de résidence et de vérification.'
      ],
      [
        'Effectue le dépôt et les transactions demandés',
        'Les dépôts en euros comptent ; les dépôts crypto et les transactions via API ne comptent pas.'
      ],
      [
        'Vérifie le versement et le blocage éventuel',
        'Les primes peuvent être bloquées au retrait pendant 180 jours, sauf disposition contraire de la campagne.'
      ]
    ]
  },

  kraken: {
    
bonus: '20 €',
notice: "Programme de parrainage Kraken accessible en France. Le filleul doit créer son premier compte via l'application Kraken avec le lien ou le code d'invitation, vérifier son identité, déposer des fonds éligibles et effectuer le volume de trading demandé dans les 30 jours. Le montant de référence est de 20 € pour une offre en euros, mais les conditions et la récompense exactes sont celles affichées dans l'application. Versement généralement sous 21 jours après validation.",
officialUrl: 'https://support.kraken.com/fr/articles/kraken-app-referral-program',

    steps: [
      [
        'Récupère une invitation depuis l’application Kraken',
        'Le parrain doit posséder un compte vérifié et être éligible au programme.'
      ],
      [
        'Crée ton premier compte via l’application',
        'Utilise le lien de parrainage ; les comptes existants ou multiples sont exclus.'
      ],
      [
        'Dépose de l’argent puis achète des cryptos',
        'Les montants minimaux de dépôt et de trading sont indiqués dans l’application.'
      ],
      [
        'Vérifie la récompense attribuée',
        'Parrain et filleul peuvent être récompensés après validation de toutes les conditions.'
      ]
    ]
  },

  bitpanda: {
    
bonus: '100 €',
notice: "Jusqu'à 100 € pour le filleul et 100 € pour le parrain, selon cinq paliers cumulables d'achats de cryptomonnaies ou de Bitpanda Crypto Indices. Premier bonus de 5 € dès 500 € d'achats éligibles, puis 15 € au total dès 1 000 €, 30 € dès 2 000 €, 60 € dès 5 000 € et 100 € dès 10 000 €. Les ventes, swaps et autres actifs ne comptent pas. Récompenses sous forme de bons d'achat crédités sur le portefeuille fiat. Risque de perte en capital.",
officialUrl: 'https://www.bitpanda.com/fr/tell-a-friend',

    steps: [
      [
        'Inscris-toi avec un lien Bitpanda',
        'Nouveau client uniquement ; termine la vérification et conserve les cookies nécessaires au suivi.'
      ],
      [
        'Atteins 500 € puis 1 000 € d’achats',
        '500 € : +5 € chacun ; 1 000 € : +10 € supplémentaires chacun.'
      ],
      [
        'Poursuis les paliers d’investissement',
        '2 000 € : +15 € ; 5 000 € : +30 € ; 10 000 € : +40 € supplémentaires chacun.'
      ],
      [
        'Reçois jusqu’à 100 € chacun',
        'Les primes sont créditées sous forme de bons dans le portefeuille fiat. Ventes, swaps et trading sur marge exclus.'
      ]
    ]
  },

  'crypto-com': {
    
bonus: '65 $',
notice: "Programme de parrainage de l'application Crypto.com pour les utilisateurs éligibles en France : jusqu'à 65 USD chacun pour le parrain et le filleul. Le filleul doit s'inscrire avec le code ou le lien, vérifier son identité et atteindre les paliers de volume de transactions dans les 30 jours suivant la validation KYC. Les récompenses dépendent du volume atteint. Le programme de bienvenue sans parrainage est distinct et non cumulable. Les cryptomonnaies comportent un risque de perte en capital.",
officialUrl: 'https://help.crypto.com/fr/collections/1802537-programme-de-parrainage',

    steps: [
      [
        'Choisis le programme Crypto.com adapté',
        'Les conditions diffèrent entre l’application Crypto.com et Crypto.com Exchange.'
      ],
      [
        'Inscris-toi avec un code de parrainage',
        'Saisis le code pendant l’inscription et effectue la vérification d’identité.'
      ],
      [
        'Vérifie les opérations nécessaires',
        'Les exigences et le montant dépendent du programme actif et de la région.'
      ],
      [
        'Choisis entre parrainage et bonus de bienvenue',
        'Les deux programmes ne sont pas cumulables pour un même nouveau compte. Vérifie la meilleure offre avant inscription.'
      ]
    ]
  }
};

for (const [slug, details] of Object.entries(
  CRYPTO_RESEARCH_UPDATES
)) {
  const offer = REFERRAL_OFFERS[`┃${slug}`];

  if (!offer) {
    console.warn(`Fiche crypto introuvable : ${slug}`);
    continue;
  }
if (['boursobank', 'fortuneo', 'revolut'].includes(slug)) {
  continue;
}
  Object.assign(offer, {
    ...details,
    verifiedAt: '10/11/2026',
    draft: false
  });
}




const CASHBACK_RESEARCH_UPDATES = {
  igraal: {
    
bonus: '5 €',
notice: "Un bonus de bienvenue de 5 € pour le filleul est annoncé dans les relevés récents, sous conditions d'achat éligible au cashback, mais son montant doit être confirmé sur la page d'invitation. Le parrain reçoit 3 € lorsque son filleul cumule au moins 1 € de cashback validé dans les 365 jours, ainsi que 10 % de ses cashbacks éligibles sur cette période.",
officialUrl: 'https://intercom-help.eu/fr-igraal/fr/articles/471530-quels-sont-les-avantages-lies-au-parrainage',
    draft: true,
    steps: [
      ['Vérifie le bonus de parrainage iGraal', 'Consulte les conditions affichées dans ton espace personnel avant de t’inscrire.'],
      ['Crée ton premier compte iGraal', 'Utilise une invitation éligible si un programme est disponible.'],
      ['Active un cashback chez un marchand partenaire', 'Lis les exclusions, les éventuels seuils d’achat et les conditions de suivi.'],
      ['Attends la validation de ton cashback', 'La récompense de parrainage éventuelle dépend des conditions du programme en vigueur.']
    ]
  },

  widilo: {
    bonus: '3 €',
notice: "Le guide officiel Widilo annonce 3 € de bienvenue pour le filleul, crédités après validation de son premier cashback, et 3 € pour le parrain. Des offres plus récentes peuvent proposer un montant différent : vérifier la prime affichée lors de l'inscription. Le filleul doit utiliser le lien dès la création du compte. Le programme de parrainage est réservé à un cadre privé entre connaissances, amis ou proches.",
officialUrl: 'https://www.widilo.fr/faq/le-parrainage/comment-fonctionne-le-parrainage',

    steps: [
      ['Inscris-toi avec le lien Widilo d’un proche', 'L’inscription doit impérativement être réalisée depuis le lien de parrainage.'],
      ['Active une offre de cashback', 'Choisis un marchand partenaire et respecte ses conditions.'],
      ['Effectue un premier achat éligible', 'La commande ne doit pas être annulée ou remboursée.'],
      ['Reçois ton bonus de 3 €', 'Le bonus du filleul et celui du parrain sont validés après le premier cashback confirmé.']
    ]
  },

  ebuyclub: {
    
bonus: '3 €',
notice: "Le filleul bénéficie de 3 € de bonus d'inscription, selon les conditions de l'offre. Le parrain reçoit 3 € après validation d'un premier cashback éligible du filleul : achat en ligne d'au moins 10 € HT, ou achat en magasin ou bon d'achat d'au moins 40 €. Le parrain perçoit également 10 % des gains cashback validés du filleul à vie.",
officialUrl: 'https://www.ebuyclub.com/parrainage',

    steps: [
      ['Inscris-toi sur eBuyClub via une invitation', 'Le parrainage doit être correctement associé à ton nouveau compte.'],
      ['Active un cashback ou achète un bon éligible', 'Les achats en ligne et certains bons d’achat ou achats en magasin sont admissibles.'],
      ['Respecte les seuils de qualification', '10 € HT pour un premier cashback en ligne ; 40 € pour certains achats de bons ou en magasin.'],
      ['Attends la validation des récompenses', 'Le parrain reçoit 3 € puis 10 % des cashbacks validés à vie ; le filleul bénéficie de son offre de bienvenue.']
    ]
  },

  joko: {
    
bonus: '5 €',
notice: "Le filleul reçoit 5 € de bonus après avoir collecté 5 € de cashback éligible. Le bonus doit être collecté dans l'application. Le parrain reçoit 10 € à la validation du parrainage, puis 10 % des cashbacks éligibles du filleul pendant un an. Le filleul doit saisir le code du parrain pendant son inscription : ouvrir simplement le lien ne suffit pas. Limite de 20 parrainages par parrain hors programme Ambassadeur.",
officialUrl: 'https://support.joko.com/fr/articles/200502-comment-fonctionne-le-parrainage',

    steps: [
      ['Installe Joko et saisis ton code parrain', 'Le code doit être renseigné pendant l’inscription ; le simple téléchargement ne suffit pas.'],
      ['Active les offres de cashback Joko', 'Utilise les offres en ligne, les offres liées à une carte ou les bons d’achat éligibles.'],
      ['Collecte au moins 5 € de cashback', 'Le seuil de 5 € déclenche la validation du parrainage.'],
      ['Récupère tes 5 € de bienvenue', 'Le parrain reçoit 10 € puis 10 % du cashback éligible pendant un an. Limite habituelle de 20 filleuls.']
    ]
  },

  rakuten: {
    
bonus: '7 € de réduction',
notice: "Le filleul reçoit un bon de réduction de 7 € après inscription et validation de son premier achat. Le bon est utilisable sur une commande d'au moins 20 € hors frais de port, pendant un an, et n'est pas cumulable avec d'autres promotions Rakuten. Le parrain reçoit également un bon de 7 €, utilisable dès 10 € d'achat. Réservé aux nouveaux membres éligibles, distincts du parrain et de son foyer.",
officialUrl: 'https://fr.shopping.rakuten.com/help/r_sponsorship/popup/true',

    steps: [
      ['Reçois une invitation Rakuten', 'Le filleul doit être nouveau membre et distinct du foyer du parrain.'],
      ['Inscris-toi depuis le lien de parrainage', 'Le suivi du parrainage doit être conservé, notamment grâce aux cookies.'],
      ['Effectue ton premier achat sur Rakuten', 'La relation de parrainage est validée après cette première commande.'],
      ['Utilise ton bon de réduction de 7 €', 'Minimum de 20 € d’achat pour le filleul, 10 € pour le parrain ; validité d’un an et non-cumul avec d’autres promotions.']
    ]
  },

  poulpeo: {
    
bonus: '5 €',
notice: "Le filleul reçoit 5 € de bienvenue lors de son inscription avec le code de parrainage. Le parrain reçoit 3 € après validation des premiers cashbacks du filleul, sur une commande totale de 20 € TTC ou un cashback issu d'une boutique de services. Il reçoit ensuite 10 % des gains cashback du filleul à vie, ou 15 % s'il est membre Poulpeo+.",
officialUrl: 'https://support.poulpeo.com/hc/fr/articles/4402777024401-Qu-est-ce-que-j-y-gagne-Quels-sont-les-avantages',

    steps: [
      ['Inscris-toi avec un code parrain Poulpeo', 'Vérifie que le code est correctement enregistré pendant ton inscription.'],
      ['Active ton premier cashback', 'Passe par Poulpeo pour effectuer une commande chez un marchand partenaire.'],
      ['Respecte les conditions de validation', 'Pour le bonus fixe du parrain : achat total de 20 € TTC minimum dans les 120 jours, ou cashback éligible d’un service.'],
      ['Profite de tes 5 € de bienvenue', 'Le parrain reçoit 3 € à la validation, puis 10 % de tes cashbacks à vie, ou 15 % avec Poulpeo+.']
    ]
  },

  shopmium: {
    
bonus: '2 €',
notice: "2 € de bonus Shopmium pour le filleul et le parrain après validation de la première demande de remboursement du filleul. Le filleul doit être un nouveau membre, majeur et résidant en France métropolitaine, puis saisir le code de parrainage lors de son inscription dans l'application mobile. Le bonus est crédité dans une cagnotte utilisable sur les remboursements Shopmium, et non versé directement en espèces. Le parrain et le filleul doivent utiliser des comptes bancaires ou PayPal distincts.",
officialUrl: 'https://support.shopmium.com/hc/fr-fr/articles/31923988168595-Comment-parrainer-un-ami',

    steps: [
      ['Télécharge l’application Shopmium', 'Le code de parrainage doit être saisi dans l’application mobile lors de l’inscription.'],
      ['Renseigne le code de ton parrain', 'Le parrain et le filleul ne doivent pas partager le même compte bancaire ou PayPal.'],
      ['Achète un produit éligible à une offre Shopmium', 'Conserve le justificatif demandé et effectue une demande de remboursement.'],
      ['Débloque 2 € de bonus chacun', 'Le premier remboursement doit être validé ; le bonus complète une demande de remboursement ultérieure.']
    ]
  },

  naomi: {
    
bonus: '3 €',
notice: "3 € offerts au filleul et 2 € au parrain après validation du parrainage. Le filleul doit s'inscrire avec le code personnel de son parrain, puis effectuer un premier achat éligible chez un partenaire Naomi. Le parrainage est validé lorsque le premier gain partenaire apparaît dans la cagnotte du filleul. Les récompenses sont créditées dans l'application Naomi.",
officialUrl: 'https://naomi.fr/comment-booster-ma-cagnotte/',

    steps: [
      ['Télécharge Naomi et crée ton compte', 'Renseigne le code de parrainage d’un proche lors de l’inscription.'],
      ['Accède aux bons d’achat disponibles', 'Choisis une enseigne partenaire proposant des bons d’achat.'],
      ['Achète un premier bon d’achat', 'Le programme ne précise pas de montant minimum pour cet achat.'],
      ['Reçois tes 3 € de récompense', 'Le bonus est attribué immédiatement après la commande ; le parrain reçoit 2 €. Comptes bancaires joints exclus.']
    ]
  },

  'capital-koala': {
    
bonus: '5 €',
notice: "5 € de bonus pour le filleul lors de son inscription via un lien de parrainage éligible. Le filleul doit créer son compte Capital Koala et enregistrer l'IBAN du livret d'épargne de son enfant dans la rubrique des bénéficiaires pour valider le parrainage. L'adhésion à une KOAlition familiale ne donne pas droit au bonus. Les sommes de parrainage ne sont pas directement encaissables en espèces : elles participent au dispositif d'épargne destiné aux bénéficiaires.",
officialUrl: 'https://new.capitalkoala.com/faq',

    draft: true,
    steps: [
      ['Inscris-toi sur Capital Koala', 'Crée ton compte et désigne un bénéficiaire pour l’épargne.'],
      ['Utilise une invitation personnelle', 'Le programme distingue les parrainages des invitations à rejoindre une KOAlition familiale.'],
      ['Enregistre l’IBAN du livret du bénéficiaire', 'Cette étape est nécessaire pour valider les bonus de parrainage.'],
      ['Accumule du cashback sur tes achats', 'Virement vers le livret à partir de 20 € de remboursements validés, sous conditions ; les bonus ne sont pas directement encaissables.']
    ]
  },

  topcashback: {
    

bonus: '10 €',
displayStatus: 'suspended',
notice: "La campagne de parrainage à 10 € du 11 au 12 novembre 2026 est arrivée à son terme. Une autre campagne est mentionnée dans les anciennes conditions enregistrées, mais son montant et sa validité doivent être confirmés avant réactivation.",
steps: [
  [
    'Consulte les conditions officielles',
    'Vérifie la campagne de parrainage actuellement applicable.'
  ],
  [
    'Vérifie le montant du bonus',
    'Le montant pour le filleul peut différer de celui du parrain.'
  ],
  [
    'Respecte les conditions de validation',
    'Les seuils de cashback et les délais dépendent de la campagne.'

  ]
],
  },

  wanteeed: {
    
bonus: '3 €',
notice: "3 € offerts au filleul dès son inscription via un lien de parrainage Wanteeed, crédités dans sa cagnotte sans achat préalable. Le parrain reçoit également 3 €, confirmés après validation du premier cashback du filleul. Retrait possible à partir de 20 € de cashback confirmé, par virement bancaire. Un seul compte autorisé par personne et auto-parrainage interdit.",
officialUrl: 'https://wanteeed.com/fr/info/mentions-legales',

    draft: true,
    
steps: [
  [
    'Inscris-toi avec un lien de parrainage Wanteeed',
    'Crée ton compte depuis le lien personnel du parrain.'
  ],
  [
    'Reçois 3 € dans ta cagnotte',
    'Le bonus de bienvenue est crédité dès ton inscription, sans achat.'
  ],
  [
    'Active le cashback lors de tes achats',
    'Installe l’extension ou utilise Wanteeed chez les marchands partenaires.'
  ],
  [
    'Retire tes gains à partir de 20 €',
    'Demande un virement bancaire après confirmation des cashbacks éligibles.'
  ]
],

  }
};

for (const [slug, details] of Object.entries(
  CASHBACK_RESEARCH_UPDATES
)) {
  const offer = REFERRAL_OFFERS[`┃${slug}`];

  if (!offer) {
    console.warn(`Fiche cashback introuvable : ${slug}`);
    continue;
  }
if (['boursobank', 'fortuneo', 'revolut'].includes(slug)) {
  continue;
}


Object.assign(offer, {
  ...details,
  verifiedAt: details.verifiedAt ?? null,
  draft: details.draft ?? true
});
}



const AID_RESEARCH_UPDATES = {
  'pass-culture': {
    bonus: '150 €',
    notice: 'Crédit culturel : 50 € à 17 ans, 150 € à 18 ans et 50 € supplémentaires possibles sous conditions. Ce n’est pas une somme retirable.',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F34959',
    steps: [
      ['Vérifie ton âge et ton éligibilité', 'Le dispositif individuel concerne principalement les jeunes de 17 et 18 ans.'],
      ['Crée ton compte pass Culture', 'Inscris-toi avec une pièce d’identité et les justificatifs de résidence demandés.'],
      ['Débloque ton crédit culturel', '50 € à 17 ans ou 150 € à 18 ans ; bonus de 50 € possible selon la situation.'],
      ['Réserve tes activités et achats éligibles', 'Crédit utilisable jusqu’à la veille des 21 ans, avec des restrictions selon les catégories.']
    ]
  },

  'prime-activité': {
    bonus: null,
    notice: 'Complément de revenus versé par la CAF ou la MSA. Montant variable selon les revenus et la composition du foyer.',
    officialUrl: 'https://www.caf.fr/',
    steps: [
      ['Vérifie ton droit à la prime d’activité', 'Tu dois notamment avoir au moins 18 ans, exercer une activité professionnelle et respecter les conditions de résidence.'],
      ['Effectue une simulation officielle', 'Renseigne tes revenus et ta situation familiale sur le simulateur CAF ou MSA.'],
      ['Dépose ta demande en ligne', 'Vérifie les ressources préremplies et complète les informations demandées.'],
      ['Actualise ta situation régulièrement', 'La prime est calculée selon tes ressources ; une déclaration trimestrielle reste nécessaire.']
    ]
  },

  'contrat-engagement-jeune': {
    bonus: '566,17 €/mois',
    notice: 'Allocation maximale pour certains majeurs, selon les ressources. Accompagnement intensif obligatoire.',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F32700',
    steps: [
      ['Vérifie ton éligibilité au CEJ', '16 à 25 ans, ou jusqu’à 29 ans en situation de handicap, avec des conditions de situation professionnelle.'],
      ['Contacte France Travail ou une Mission locale', 'Un conseiller étudie ton projet et les possibilités d’accompagnement.'],
      ['Signe ton contrat d’engagement', 'Participe aux activités, formations et démarches prévues dans ton parcours.'],
      ['Perçois une allocation si tu es éligible', 'Jusqu’à 566,17 € par mois pour certains majeurs ; les revenus et allocations peuvent réduire le montant.']
    ]
  },

  'rsa-jeune-actif': {
    bonus: '651,69 €/mois',
    notice: 'Montant forfaitaire de référence pour une personne seule, avant prise en compte des ressources et du logement.',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F286',
    steps: [
      ['Vérifie les conditions du RSA jeune actif', 'Pour les moins de 25 ans, il faut généralement justifier de 3 214 heures de travail sur les 3 dernières années.'],
      ['Effectue une simulation de tes droits', 'Le montant dépend de la composition du foyer, des ressources et des aides au logement.'],
      ['Dépose ta demande auprès de la CAF ou MSA', 'Prépare les justificatifs d’activité professionnelle et de ressources.'],
      ['Respecte les obligations de suivi', 'Déclaration trimestrielle, inscription à France Travail et contrat d’engagement selon les règles applicables.']
    ]
  },

  'aides-logement': {
    bonus: null,
    notice: 'APL, ALS ou ALF selon le logement, les ressources et la situation du foyer. Montant calculé individuellement.',
    officialUrl: 'https://www.caf.fr/',
    steps: [
      ['Vérifie si ton logement est éligible', 'Location, colocation, résidence étudiante ou autre logement admissible selon le dispositif.'],
      ['Simule tes droits auprès de la CAF', 'Le loyer, les ressources, la zone géographique et la composition du foyer sont pris en compte.'],
      ['Dépose ta demande d’aide au logement', 'Fournis ton bail, les informations du bailleur et les justificatifs nécessaires.'],
      ['Déclare tout changement de situation', 'Un déménagement, un changement de revenus ou de foyer peut modifier le montant.']
    ]
  },

  'aides-étudiantes': {
    bonus: '7 602 €/an',
    notice: 'Montant maximal de la bourse sur critères sociaux selon l’échelon. D’autres aides étudiantes peuvent s’ajouter.',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F32456',
    steps: [
      ['Vérifie ton éligibilité aux bourses', 'Les ressources familiales, la formation et la situation personnelle sont prises en compte.'],
      ['Constitue ton Dossier social étudiant', 'Effectue la demande auprès du CROUS dans le calendrier prévu.'],
      ['Explore les aides complémentaires', 'Aide au mérite, mobilité Parcoursup, aides d’urgence, restauration et logement selon ton profil.'],
      ['Transmets les justificatifs nécessaires', 'La décision et le montant dépendent de l’instruction du dossier et de ton échelon.']
    ]
  },

  'aide-mobili-jeune': {
    bonus: '100 €/mois',
    notice: 'De 10 à 100 € par mois, jusqu’à 1 100 € par année de formation, sur deux années maximum.',
    officialUrl: 'https://www.actionlogement.fr/l-aide-mobili-jeune',
    steps: [
      ['Vérifie ton éligibilité à MOBILI-JEUNE', 'Moins de 30 ans, contrat d’alternance éligible et conditions de salaire et de logement.'],
      ['Calcule ton reste à charge de loyer', 'L’aide tient compte du loyer et des aides au logement déjà perçues.'],
      ['Dépose ton dossier sur Action Logement', 'Transmets le contrat, les justificatifs de logement et les documents demandés.'],
      ['Déclenche les versements avec tes justificatifs', 'Le montant varie de 10 à 100 € par mois, dans la limite annuelle prévue.']
    ]
  },

  'fonds-aide-jeunes': {
    bonus: null,
    notice: 'Aide départementale destinée aux jeunes en difficulté. Montant, âge limite et critères variables selon le département.',
    officialUrl: 'https://www.service-public.gouv.fr/',
    steps: [
      ['Renseigne-toi sur le Fonds d’aide aux jeunes', 'Le dispositif est généralement destiné aux jeunes de 18 à 25 ans en difficulté.'],
      ['Contacte une Mission locale ou un service social', 'Les modalités dépendent du conseil départemental compétent.'],
      ['Présente ton besoin et tes ressources', 'Alimentation, mobilité, logement ou insertion peuvent être concernés selon le règlement local.'],
      ['Fais instruire ta demande', 'Le montant et la forme de l’aide dépendent de la décision de l’organisme compétent.']
    ]
  },

  'service-civique': {
    bonus: '619,83 €/mois',
    notice: 'Indemnité totale de référence en métropole : 504,98 € et prestation minimale de 114,85 €. Majoration sociale possible.',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F13278',
    steps: [
      ['Vérifie ton éligibilité au service civique', 'Accessible principalement de 16 à 25 ans, et jusqu’à 30 ans en situation de handicap.'],
      ['Recherche une mission d’intérêt général', 'Choisis une association ou un organisme agréé proposant une mission adaptée.'],
      ['Signe ton contrat de service civique', 'Mission de 6 à 12 mois avec une durée hebdomadaire minimale généralement fixée à 24 heures.'],
      ['Perçois ton indemnité mensuelle', '619,83 € au total en métropole, avec supplément possible de 114,95 € sous conditions sociales.']
    ]
  },

  'aides-mobilité': {
    bonus: null,
    notice: 'Aides aux déplacements, à la formation et à l’insertion. Montants variables selon l’organisme et la région.',
    officialUrl: 'https://www.francetravail.fr/',
    steps: [
      ['Identifie le motif de ton déplacement', 'Entretien, reprise d’emploi, formation ou déplacement lié aux études.'],
      ['Vérifie les aides de ton organisme', 'France Travail, région, Mission locale, établissement de formation ou employeur.'],
      ['Prépare tes justificatifs', 'Convocation, devis, billets de transport ou documents de formation selon le dispositif.'],
      ['Dépose ta demande dans les délais', 'Le remboursement ou la prise en charge dépend des critères et plafonds applicables.']
    ]
  },

  'aides-permis': {
    bonus: null,
    notice: 'Aides au financement du permis selon l’âge, le statut et le territoire. Certaines sont des prêts, pas des subventions.',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F38575',
    steps: [
      ['Identifie les dispositifs auxquels tu peux prétendre', 'Permis à un euro par jour, aides locales ou aides liées à l’insertion professionnelle.'],
      ['Vérifie les conditions de ton profil', 'Âge, revenus, statut professionnel et lieu de résidence peuvent être déterminants.'],
      ['Prépare ton devis d’auto-école', 'Les organismes peuvent demander un devis, un contrat ou des justificatifs de ressources.'],
      ['Demande le financement avant de t’engager', 'Vérifie si le dispositif est une subvention, un remboursement ou un prêt à rembourser.']
    ]
  },

  'autres-aides': {
    bonus: null,
    notice: 'Répertoire d’aides complémentaires selon la situation personnelle : santé, énergie, logement, formation et insertion.',
    officialUrl: 'https://www.mesdroitssociaux.gouv.fr/',
    steps: [
      ['Effectue un bilan de tes droits sociaux', 'Utilise le portail officiel Mes droits sociaux pour identifier les prestations possibles.'],
      ['Explore les aides nationales et locales', 'CAF, Assurance maladie, CROUS, collectivités et organismes spécialisés.'],
      ['Vérifie les conditions de chaque dispositif', 'Ressources, résidence, âge, situation professionnelle et règles de cumul.'],
      ['Dépose tes demandes auprès des organismes concernés', 'Chaque aide possède ses propres justificatifs, délais et modalités de versement.']
    ]
  }
};

for (const [slug, details] of Object.entries(AID_RESEARCH_UPDATES)) {
  const offer = REFERRAL_OFFERS[`┃${slug}`];

  if (!offer) {
    console.warn(`Fiche d’aide introuvable : ${slug}`);
    continue;
  }
  if (['boursobank', 'fortuneo', 'revolut'].includes(slug)) {
  continue;
}

  Object.assign(offer, {
    ...details,
    verifiedAt: '10/11/2026',
    draft: false
  });
}

// ==========================
// REVOLUT — CAMPAGNE NOVEMBRE 2026
// ==========================

Object.assign(REFERRAL_OFFERS['┃revolut'], {
  bonus: '60 € pour le filleul',
  verifiedAt: '10/11/2026',
  draft: false,

  notice:
    'Offre de partage de prime proposée par le parrain : ' +
    '50 € reversés au filleul après validation du parrainage, ' +
    'ou 60 € si le bonus Épargne est également obtenu. ' +
    'Ce versement est effectué par le parrain, et non par Revolut. ' +
    'Offre valable jusqu’au 17/11/2026 à 20h59 UTC, ' +
    'sous réserve des conditions de la campagne.',

  steps: [
    [
      'Inscris-toi sur Revolut avec le lien',
      'Crée ton compte et vérifie ton identité avant la date limite.'
    ],
    [
      'Ajoute de l’argent sur ton compte',
      'Effectue un approvisionnement par carte de débit ou virement bancaire.'
    ],
    [
      'Effectue 3 achats de 5 € minimum chacun',
      'Les jeux d’argent, cartes cadeaux et virements ne sont pas éligibles.'
    ],
    [
      'Commande une carte physique',
      'Ajoute-la à Apple Pay ou Google Pay. ' +
      'Une fois la prime de 100 € reçue par le parrain, ' +
      '50 € te sont reversés. Si tu ouvres également un compte Épargne ' +
      'et y déposes au moins 100 €, un bonus de 20 € peut être obtenu ' +
      'par le parrain, portant ton reversement total à 60 €.'
    ]
  ]
});



Object.assign(REFERRAL_OFFERS['┃trade-republic'], {
  bonus: '10 € en actions',
  verifiedAt: '10/11/2026',
  draft: false,
  notice: 'Le filleul reçoit un bonus de bienvenue dont le montant est précisé dans son invitation. Le parrain reçoit 10 € en actions lorsque les conditions sont remplies.',
  steps: [
    [
      'Accepte ton invitation Trade Republic',
      'Inscris-toi en utilisant notre lien de parrainage.'
    ],
    [
      'Ouvre et vérifie ton compte',
      'Finalise ton inscription et la vérification de ton identité.'
    ],
    [
      'Verse 100 € et réalise 3 investissements',
      'Ces deux conditions doivent être remplies dans les 21 premiers jours.'
    ],
    [
      'Reçois ton bonus de bienvenue',
      'Le montant de ta récompense est indiqué dans ton invitation. Le parrain reçoit 10 € en actions.'
    ]
  ]
});


Object.assign(REFERRAL_OFFERS['┃finary'], {
  bonus: '1 mois de Finary Premium',
  referralCode: 'MCK3YT',
  verifiedAt: '10/11/2026',
  draft: false,
  notice: 'Le filleul reçoit 1 mois de Finary Premium après inscription et synchronisation de 2 comptes. Le parrain bénéficie d’une prolongation de 1 mois de son abonnement, sous réserve d’éligibilité. Les abonnements souscrits via iOS ou Android ne sont pas éligibles aux mois gratuits.',
  steps: [
    [
      'Accepte ton invitation Finary',
      'Inscris-toi en utilisant notre lien de parrainage.'
    ],
    [
      'Crée ton compte gratuitement',
      'Termine ton inscription sur Finary.'
    ],
    [
      'Synchronise 2 comptes',
      'Connecte deux comptes financiers pour remplir les conditions du parrainage.'
    ],
    [
      'Profite de 1 mois de Premium offert',
      'Découvre les fonctionnalités Premium, notamment les analyses et les synchronisations illimitées.'
    ]
  ]
});


Object.assign(REFERRAL_OFFERS['┃coinbase'], {
  bonus: '20 € en bitcoin offerts',
  verifiedAt: '10/11/2026',
  draft: false,
  notice: 'Offre réservée aux nouveaux clients Coinbase résidant en France. Première transaction éligible de 20 € minimum. Le filleul et le parrain reçoivent chacun 20 € en BTC, sous réserve des conditions de Coinbase. Récompense annoncée environ 48 h après la transaction. Maximum 10 parrainages récompensés. Les cryptomonnaies présentent un risque de perte en capital.',
  steps: [
    [
      'Accepte ton invitation Coinbase',
      'Inscris-toi via notre lien de parrainage personnel.'
    ],
    [
      'Crée et vérifie ton compte',
      'Termine la vérification de ton identité. Offre réservée aux nouveaux clients résidant en France.'
    ],
    [
      'Effectue une transaction de 20 € minimum',
      'Achète une cryptomonnaie éligible sur Coinbase avec un moyen de paiement accepté.'
    ],
    [
      'Reçois 20 € en bitcoin',
      'Le filleul et le parrain reçoivent chacun 20 € en BTC, généralement sous environ 48 heures selon l’offre affichée.'
    ]
  ]
});


Object.assign(REFERRAL_OFFERS['┃swissborg'], {
  bonus: "Jusqu'à 50 € en BTC",
  referralCode: 'lucasaO6L7RAV9',
  verifiedAt: '10/11/2026',
  draft: false,
  notice: "Le parrain et le filleul peuvent recevoir chacun jusqu'à 50 € en BTC après un échange éligible de 100 € minimum. Montant variable, non garanti. Une campagne supplémentaire de 20 € chacun est proposée jusqu'au 31/12/2026 après 250 € d'achats éligibles, uniquement si la cagnotte collective atteint 150 parrainages qualifiés. Les crypto-actifs présentent un risque de perte en capital.",
  steps: [
    [
      'Accepte ton invitation SwissBorg',
      'Inscris-toi via notre lien et confirme le code de parrainage.'
    ],
    [
      'Crée et vérifie ton compte',
      "Termine l'inscription et la vérification de ton identité."
    ],
    [
      'Échange au moins 100 €',
      "Effectue un échange éligible de 100 € minimum, ou l'équivalent dans une devise acceptée."
    ],
    [
      'Débloque ta récompense en BTC',
      "Le parrain et le filleul reçoivent chacun un coupon bonus pouvant atteindre 50 € en bitcoin."
    ]
  ]
});


Object.assign(REFERRAL_OFFERS['┃igraal'], {
  bonus: '11 € offerts au filleul',
  verifiedAt: '11/11/2026',
  draft: false,
  notice: "Le filleul reçoit 11 € de bonus après inscription via le lien de parrainage et validation d'un achat éligible de 8,33 € minimum dans les 90 jours. Le parrain reçoit 11 € après validation de 1 € de cashback cumulé par le filleul, ainsi que 10 % du cashback de ce dernier pendant 365 jours. Offre soumise aux conditions iGraal.",
  steps: [
    [
      'Accepte ton invitation iGraal',
      'Inscris-toi gratuitement via notre lien de parrainage.'
    ],
    [
      'Effectue un achat chez un partenaire',
      "Réalise un achat éligible d'au moins 8,33 € dans les 90 jours suivant ton inscription."
    ],
    [
      'Cumule 1 € de cashback validé',
      'Attends la validation de ton cashback pour remplir les conditions de parrainage.'
    ],
    [
      'Débloque tes 11 € de bienvenue',
      'Profite de ton bonus de parrainage selon les conditions iGraal.'
    ]
  ]
});


Object.assign(REFERRAL_OFFERS['┃joko'], {
  bonus: '5 € offerts au filleul',
  referralCode: 'lorwfa',
  verifiedAt: '11/11/2026',
  draft: false,
  notice: "Le filleul reçoit 5 € après avoir cumulé 5 € de cashback éligible sur ses achats dans les 90 jours suivant son inscription. Les bonus ne comptent pas dans ce seuil. Le parrain reçoit 10 € et 10 % du cashback du filleul pendant un an. Le code LORWFA doit être saisi lors de l'inscription.",
  steps: [
    [
      'Télécharge Joko avec notre lien',
      "Ouvre le lien d'invitation pour installer l'application Joko."
    ],
    [
      'Inscris-toi avec le code LORWFA',
      "Saisis le code de parrainage pendant l'inscription et vérifie ton adresse e-mail."
    ],
    [
      'Cumule 5 € de cashback',
      "Effectue des achats éligibles et cumule 5 € de cashback dans les 90 jours. Les bonus ne sont pas comptabilisés."
    ],
    [
      'Récupère tes 5 € de bonus',
      "Une fois les conditions validées, collecte ta récompense dans l'application Joko."
    ]
  ]
});


Object.assign(REFERRAL_OFFERS['┃pass-culture'], {
  bonus: 'Jusqu’à 200 € de crédit culturel',
  verifiedAt: '11/11/2026',
  draft: false,
  notice: "Dispositif public gratuit, sans parrainage. Offres gratuites à 15-16 ans, 50 € à 17 ans et 150 € à 18 ans. Bonus supplémentaire de 50 € sous conditions. Les crédits sont cumulables et utilisables jusqu'à la veille des 21 ans. Activation du crédit dans les délais d'âge requis.",
  steps: [
    [
      'Vérifie ton éligibilité',
      "Tu dois notamment respecter les conditions d'âge et de résidence en France."
    ],
    [
      'Inscris-toi sur pass Culture',
      "Crée ton compte sur l'application ou le site officiel."
    ],
    [
      'Active ton crédit culturel',
      "Vérifie ton identité et débloque le crédit correspondant à ton âge."
    ],
    [
      'Réserve tes activités culturelles',
      "Utilise ton crédit pour des livres, des concerts, des séances de cinéma et d'autres offres éligibles."
    ]
  ]
});


/* ============================================================
   CATÉGORIE AIDES — 12 FICHES OFFICIELLES
   Vérification : 11/11/2026
   Aucun lien personnel, aucune commission, aucun parrainage
   ============================================================ */

const PUBLIC_AID_UPDATES = {

  // 01 — PASS CULTURE
  '┃pass-culture': {
    bonus: '200 €',
    officialUrl: 'https://pass.culture.fr/',
    notice: "Dispositif public gratuit, sans parrainage. Crédit de 50 € à 17 ans et de 150 € à 18 ans. Un bonus de 50 € peut porter le crédit de 18 ans à 200 €, sous conditions de ressources ou de handicap. Les montants ne sont pas garantis à tous les bénéficiaires. Conditions d'âge, de résidence et d'activation applicables.",
    steps: [
      [
        "Vérifie ton âge et ta résidence",
        "Consulte les critères d'accès au pass Culture."
      ],
      [
        "Crée ton compte",
        "Télécharge l'application officielle et inscris-toi."
      ],
      [
        "Vérifie ton identité",
        "Active le crédit correspondant à ton âge si tu es éligible."
      ],
      [
        "Réserve tes offres culturelles",
        "Profite des livres, concerts, spectacles, cinémas et autres activités éligibles."
      ]
    ]
  },

  // 02 — PRIME D'ACTIVITÉ
  '┃prime-activité': {
    bonus: 'Complément de revenus',
    officialUrl: 'https://www.caf.fr/',
    notice: "Aide versée par la CAF ou la MSA aux travailleurs éligibles de 18 ans ou plus. Le montant dépend des revenus, de la composition du foyer et de la situation personnelle. Les étudiants et apprentis sont soumis à des conditions spécifiques. Déclaration trimestrielle des ressources nécessaire.",
    steps: [
      [
        "Vérifie ton éligibilité",
        "Tu dois notamment avoir au moins 18 ans et exercer une activité professionnelle."
      ],
      [
        "Simule tes droits",
        "Utilise le simulateur de prime d'activité de la CAF ou de la MSA."
      ],
      [
        "Dépose ta demande",
        "Renseigne ta situation familiale, professionnelle et tes ressources."
      ],
      [
        "Actualise tes ressources",
        "Effectue les déclarations trimestrielles nécessaires au maintien de tes droits."
      ]
    ]
  },

  // 03 — CONTRAT D'ENGAGEMENT JEUNE
  '┃contrat-engagement-jeune': {
    bonus: '566,17 €/mois',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F32700',
    notice: "Allocation du Contrat d'engagement jeune (CEJ) : jusqu'à 566,17 € par mois pour un majeur fiscalement autonome ou rattaché à un foyer non imposable. Le montant dépend de l'âge, des ressources et de la situation fiscale. Le dispositif s'adresse aux jeunes de 16 à 25 ans, ou jusqu'à 29 ans en situation de handicap, sous conditions. Un engagement dans un parcours d'accompagnement est obligatoire.",
    steps: [
      [
        "Vérifie les conditions",
        "Consulte les critères d'âge, de formation et de situation professionnelle."
      ],
      [
        "Contacte un conseiller",
        "Adresse-toi à France Travail ou à ta Mission locale."
      ],
      [
        "Construis ton parcours",
        "Définis un programme personnalisé d'accompagnement vers l'emploi."
      ],
      [
        "Participe aux activités",
        "Respecte les engagements du parcours pour bénéficier de l'accompagnement et, si éligible, de l'allocation."
      ]
    ]
  },

  // 04 — RSA JEUNE ACTIF
  '┃rsa-jeune-actif': {
    bonus: 'Revenu minimum sous conditions',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F286',
    notice: "Le RSA jeune actif concerne certains jeunes de moins de 25 ans. Sauf exception, notamment pour les parents isolés, il faut justifier d'au moins 3 214 heures de travail au cours des 3 dernières années. Le montant dépend des ressources et du foyer. Les bénéficiaires sont soumis à des obligations d'accompagnement.",
    steps: [
      [
        "Vérifie ton activité passée",
        "Contrôle tes périodes travaillées et les exceptions éventuelles."
      ],
      [
        "Estime tes droits",
        "Utilise le simulateur RSA de la CAF ou de la MSA."
      ],
      [
        "Dépose ta demande",
        "Transmets les justificatifs de ressources et d'activité nécessaires."
      ],
      [
        "Respecte ton accompagnement",
        "Effectue tes déclarations et participe aux actions prévues par ton contrat d'engagement."
      ]
    ]
  },

  // 05 — AIDES AU LOGEMENT
  '┃aides-logement': {
    bonus: 'Réduction du loyer variable',
    officialUrl: 'https://www.caf.fr/',
    notice: "Les aides personnelles au logement comprennent l'APL, l'ALF et l'ALS. Elles ne sont pas cumulables entre elles. Leur attribution et leur montant dépendent notamment du logement, des ressources et de la composition du foyer. Certaines conditions particulières s'appliquent aux étudiants.",
    steps: [
      [
        "Vérifie ton logement",
        "Contrôle les conditions liées à ta location et à ta résidence."
      ],
      [
        "Simule ton aide",
        "Utilise le simulateur logement de la CAF ou de la MSA."
      ],
      [
        "Dépose ta demande",
        "Renseigne ton bail, ton loyer et tes ressources."
      ],
      [
        "Suis ton dossier",
        "Consulte les versements et déclare tout changement de situation."
      ]
    ]
  },

  // 06 — AIDES ÉTUDIANTES
  '┃aides-étudiantes': {
    bonus: '7 602 €/an',
    officialUrl: 'https://www.etudiant.gouv.fr/', 
notice: "Bourse CROUS sur critères sociaux : jusqu'à 6 335 € pour l'année universitaire 2026-2027 sur 10 mois, ou 7 602 € avec maintien pendant les grandes vacances pour les étudiants éligibles à l'échelon 7. Le montant dépend des ressources familiales, de la situation et de l'échelon attribué. Les autres aides étudiantes ont leurs propres conditions.",
    steps: [
      [
        "Identifie les aides disponibles",
        "Consulte les dispositifs proposés par le CROUS et les organismes compétents."
      ],
      [
        "Vérifie les critères",
        "Prends en compte tes ressources, ton cursus et ta situation familiale."
      ],
      [
        "Constitue ton dossier",
        "Complète ton Dossier social étudiant lorsque celui-ci est requis."
      ],
      [
        "Suis tes demandes",
        "Consulte les notifications et fournis les justificatifs complémentaires."
      ]
    ]
  },

  // 07 — MOBILI-JEUNE
  '┃aide-mobili-jeune': {
    bonus: '100 €/mois',
    officialUrl: 'https://www.actionlogement.fr/l-aide-mobili-jeune',
    notice: "Aide Action Logement destinée principalement aux alternants de moins de 30 ans du secteur privé non agricole, sous conditions de salaire et de logement. Montant de 10 à 100 € par mois, plafonné à 1 100 € par année de formation sur 11 mensualités. Calcul après déduction des aides au logement.",
    steps: [
      [
        "Vérifie ton alternance",
        "Contrôle ton âge, ton contrat, ton salaire et les conditions de mobilité."
      ],
      [
        "Vérifie ton logement",
        "Renseigne ton loyer et les aides au logement déjà perçues."
      ],
      [
        "Dépose ta demande",
        "Crée ton espace Action Logement et fournis les justificatifs."
      ],
      [
        "Transmets tes justificatifs",
        "Dépose tes quittances et bulletins de salaire pour obtenir les versements."
      ]
    ]
  },

  // 08 — FONDS D'AIDE AUX JEUNES
  '┃fonds-aide-jeunes': {
    bonus: '1 000 €',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F13609',
    notice: "Le Fonds d'aide aux jeunes (FAJ) accompagne les jeunes de 18 à 25 ans en difficulté. Le portail Mes aides de France Travail présente un montant pouvant atteindre 1 000 €. Ce plafond est indicatif : les montants, conditions et décisions d'attribution dépendent du département et du dossier. La demande s'effectue généralement avec un référent social ou une Mission locale.",
    steps: [
      [
        "Vérifie ton éligibilité",
        "Renseigne-toi sur les conditions du FAJ dans ton département."
      ],
      [
        "Contacte la Mission locale",
        "Explique ta situation et les dépenses pour lesquelles tu recherches une aide."
      ],
      [
        "Prépare les justificatifs",
        "Rassemble les documents demandés pour l'étude de ton dossier."
      ],
      [
        "Attends la décision",
        "Le montant et la forme de l'aide dépendent de l'évaluation locale."
      ]
    ]
  },

  // 09 — SERVICE CIVIQUE
  '┃service-civique': {
    bonus: '619,83 € / mois',
    officialUrl: 'https://www.service-civique.gouv.fr/',
    notice: "Le Service Civique est un engagement volontaire d'intérêt général, généralement accessible de 16 à 25 ans et jusqu'à 30 ans en situation de handicap. Une mission dure de 6 à 12 mois. Indemnisation de base totale de 619,83 € par mois, comprenant 504,98 € versés par l'État et 114,85 € apportés par l'organisme en argent ou en nature. Majoration possible sous conditions.",
    steps: [
      [
        "Recherche une mission",
        "Consulte les missions disponibles sur le site officiel du Service Civique."
      ],
      [
        "Dépose ta candidature",
        "Choisis une mission correspondant à tes intérêts et à ta disponibilité."
      ],
      [
        "Signe ton engagement",
        "Finalise ton dossier avec l'organisme d'accueil."
      ],
      [
        "Réalise ta mission",
        "Participe aux activités prévues et perçois ton indemnisation si ton dossier est validé."
      ]
    ]
  },

  // 10 — AIDES À LA MOBILITÉ
  '┃aides-mobilité': {
    bonus: '5 200 €/an',
    officialUrl: 'https://www.francetravail.fr/candidat/en-formation/les-dispositifs/jentre-en-formation---laide-au-d.html',
    notice: "Aide à la mobilité de France Travail : jusqu'à 5 200 € de remboursement sur 12 mois glissants, pour les frais éligibles de déplacement, repas et hébergement. Elle s'adresse principalement aux demandeurs d'emploi peu ou non indemnisés, sous conditions de distance et de situation. Les aides régionales et étudiantes sont distinctes et possèdent leurs propres plafonds.",
    steps: [
      [
        "Identifie ton besoin",
        "Précise s'il s'agit de transport, d'un entretien, d'une formation ou d'un déménagement."
      ],
      [
        "Recherche les dispositifs",
        "Consulte 1jeune1solution, France Travail et les aides de ta région."
      ],
      [
        "Vérifie les conditions",
        "Contrôle les plafonds, les justificatifs et les délais de demande."
      ],
      [
        "Dépose ton dossier",
        "Effectue la demande auprès de l'organisme compétent avant les dépenses si nécessaire."
      ]
    ]
  },

  // 11 — AIDES AU PERMIS
  '┃aides-permis': {
    bonus: '1 200 € de prêt à taux zéro',
    officialUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F13609',
    notice: "Le permis à 1 € par jour est un prêt à taux zéro, et non une prime gratuite, destiné sous conditions aux jeunes de 15 à 25 ans. Des aides locales et certains financements CPF peuvent également exister. Les anciennes aides nationales de 500 € pour les apprentis et de France Travail ont été supprimées en 2026.",
    steps: [
      [
        "Recherche les aides disponibles",
        "Consulte les dispositifs nationaux et ceux proposés dans ta commune ou ta région."
      ],
      [
        "Vérifie ton éligibilité",
        "Contrôle ton âge, ton projet de permis et les conditions de financement."
      ],
      [
        "Choisis une auto-école",
        "Demande un devis et vérifie les organismes partenaires du dispositif."
      ],
      [
        "Constitue ton dossier",
        "Dépose ta demande de financement auprès de l'organisme concerné."
      ]
    ]
  },

  // 12 — AUTRES AIDES
  '┃autres-aides': {
    bonus: null,
    officialUrl: 'https://www.1jeune1solution.gouv.fr/',
    notice: "Cette fiche regroupe les autres dispositifs susceptibles d'aider les jeunes : emploi, formation, santé, logement, alimentation, mobilité et accompagnement social. L'éligibilité, les montants et les démarches dépendent de chaque aide. Aucun versement n'est garanti.",
    steps: [
      [
        "Décris ta situation",
        "Précise ton âge, ton statut, tes ressources et tes besoins."
      ],
      [
        "Recherche tes droits",
        "Consulte les aides disponibles sur les plateformes officielles."
      ],
      [
        "Compare les conditions",
        "Vérifie les critères, les justificatifs et les possibilités de cumul."
      ],
      [
        "Effectue tes demandes",
        "Contacte les organismes compétents et suis l'avancement de tes dossiers."
      ]
    ]
  }

};

// Appliquer les 12 fiches aux offres existantes du catalogue.
for (const [key, update] of Object.entries(PUBLIC_AID_UPDATES)) {
  const offer = REFERRAL_OFFERS[key];

  if (!offer) {
    console.warn(`[AIDES] Offre introuvable : ${key}`);
    continue;
  }

  Object.assign(offer, {
    ...update,
    verifiedAt: '11/11/2026',
    draft: false,
    referralCode: null,
    signupUrl: null,
    url: null
  });
}

console.log('[AIDES] Configurations des 12 fiches chargées.');


Object.assign(REFERRAL_OFFERS['┃distingo-bank'], {
  signupUrl: 'https://distingobank.fr/ouvrir-livret-epargne/'
});

Object.assign(REFERRAL_OFFERS['┃sumeria'], {
  signupUrl: 'https://sumeria.eu/'
});



const REFERRAL_LOGO_NAMES = {
  pmu: 'pmu.png',
  'pass-culture': 'pass-culture.png'
};

function getReferralLogo(offer) {
  const filename =
    REFERRAL_LOGO_NAMES[offer.slug] ||
    `${offer.slug}.png`;

  const filePath = path.join(
    __dirname,
    'assets',
    'referrals',
    filename
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return {
    url: `attachment://${filename}`,
    file: new AttachmentBuilder(filePath, {
      name: filename
    })
  };
}




const REFERRAL_EMOJI_ALIASES = {
  'hello-bank': 'hellobank',
  'trade-republic': 'traderepublic',
  'la-banque-postale': 'labanquepostale',
  'distingo-bank': 'distingobank',
  'pass-culture': 'passculture',
  'crypto-com': 'cryptocom',
  'capital-koala': 'capitalkoala',

  // Aides de l'État
  'prime-activité': 'primeactivite',
  'contrat-engagement-jeune': 'contratengagementjeune',
  'rsa-jeune-actif': 'rsajeuneactif',
  'aides-logement': 'aideslogement',
  'aides-étudiantes': 'aidesetudiantes',
  'aide-mobili-jeune': 'aidemobilijeune',
  'fonds-aide-jeunes': 'fondsaidejeunes',
  'service-civique': 'servicecivique',
  'aides-mobilité': 'aidesmobilite',
  'aides-permis': 'aidespermis',
  'autres-aides': 'autresaides'
};

function normalizeReferralEmojiName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}

function getReferralEmoji(guild, offer) {
  const slug = offer.slug;

  const expectedName = normalizeReferralEmojiName(
    REFERRAL_EMOJI_ALIASES[slug] || slug
  );

  const emoji = guild.emojis.cache.find(
    e => normalizeReferralEmojiName(e.name) === expectedName
  );

  if (!emoji) {
    console.warn(
      `[PARRAINAGES] Emoji introuvable : ${slug} (${expectedName})`
    );
    return '';
  }

  return `${emoji.toString()} `;
}


const REFERRAL_CONFIRMED_AMOUNTS = {
  'rsa-jeune-actif': {
    bonus: '651,69 €/mois',
    notice: 'Montant forfaitaire de référence pour une personne seule, avant déduction des ressources et du forfait logement. Conditions spécifiques aux jeunes actifs.'
  },
  'service-civique': {
    bonus: '619,83 €/mois',
    notice: 'Indemnité et prestation mensuelles de base en métropole. Une majoration est possible sous conditions sociales.'
  }
};

for (const [slug, update] of Object.entries(REFERRAL_CONFIRMED_AMOUNTS)) {
  const offer = REFERRAL_OFFERS[`┃${slug}`];
  if (!offer) continue;

  Object.assign(offer, update);
  offer.verifiedAt = '12/11/2026';
  offer.draft = false;
}




function getReferralTitle(offer) {
  const name = String(offer.title || '').trim();
  const bonus = String(offer.bonus ?? '').trim();

  if (!bonus) return name;

  const normalized = bonus.replace(/\s+/g, ' ').trim();

    if (offer.category === 'aides') {
    return `${name} — ${normalized}`;
  }

  // Conserver les précisions indispensables.
  const specialBonus =
    /réduction|remise|bon d'achat|freebets|bonusbets|ticket bonus|prêt|crédit culturel|reversés|pour le filleul|en actions|en bitcoin|en BTC/i;

  if (specialBonus.test(normalized)) {
    return `${name} — ${normalized}`;
  }

  // Ne pas transformer les avantages variables en montants.
  if (!/\d/.test(normalized)) {
    return `${name} — ${normalized}`;
  }

  // Montant simple en euros, éventuellement mensuel ou annuel.
  const match = normalized.match(
    /^(\d[\d\s\u00a0\u202f.,]*)\s*€\s*(\/\s*(?:mois|an))?$/i
  );

  if (match) {
    const amount = Number(
      match[1]
        .replace(/[\s\u00a0\u202f]/g, '')
        .replace(',', '.')
    );

    if (Number.isFinite(amount)) {
      const unit = match[2]
        ? match[2].replace(/\s/g, '').toLowerCase()
        : '';

      return `${name} — Jusqu'à ${amount.toLocaleString('fr-FR')} €${unit}`;
    }
  }

  // Préserver le libellé d'origine lorsqu'il est plus précis.
  return `${name} — ${normalized}`;
}





function buildReferralContainer(offer) {
  const container = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR);

  const separator = () =>
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Small);

  const isAid = offer.category === 'aides';
  const emoji = offer.emojiText || '';

  const isPending =
    offer.displayStatus === 'coming_soon' ||
    offer.displayStatus === 'suspended';

  if (isPending) {
    const label = offer.displayStatus === 'suspended'
      ? 'Offre temporairement suspendue'
      : 'L\'offre est temporairement suspendue ou indisponible, réessaie plus tard !';

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# ${emoji}${offer.title}`
      )
    );

    container.addSeparatorComponents(separator());

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${label}`)
    );

    return container;
  }

  const lines = [
    `# ${emoji}${getReferralTitle(offer)}`
  ];

  if (offer.draft) {
    lines.push('-# Informations non vérifiées');
  } else if (offer.verifiedAt) {
    lines.push(`-# Offre vérifiée le ${offer.verifiedAt}`);
  }

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(lines.join('\n'))
  );

  const steps = (offer.steps || [])
    .filter(([title, detail]) => title || detail);

  if (steps.length) {
    container.addSeparatorComponents(separator());

    steps.forEach(([title, detail], index) => {
      const instruction = String(title || '').trim();
      const description = String(detail || '').trim();

      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          [
            `**${instruction}**`,
            description ? `-# ${description}` : ''
          ].filter(Boolean).join('\n')
        )
      );

      if (index < steps.length - 1) {
        container.addSeparatorComponents(separator());
      }
    });
  }

  if (!isAid && offer.referralCode) {
    container.addSeparatorComponents(separator());
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Code de parrainage :** \`${offer.referralCode}\``
      )
    );
  }

  if (offer.notice && !offer.draft) {
    container.addSeparatorComponents(separator());
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# ${offer.notice}`
      )
    );
  }

  const buttons = [];

  const personalUrl = !isAid
    ? (offer.url || offer.signupUrl)
    : null;

  const mainUrl = personalUrl ||
    (isAid ? offer.officialUrl : null);

  if (mainUrl && !offer.draft) {
    buttons.push(
      new ButtonBuilder()
        .setLabel(isAid ? 'Faire ma demande' : 'Lien de parrainage')
        .setStyle(ButtonStyle.Link)
        .setURL(mainUrl)
    );
  }

  if (offer.referralTermsUrl) {
    buttons.push(
      new ButtonBuilder()
        .setLabel('Conditions du parrainage')
        .setStyle(ButtonStyle.Link)
        .setURL(offer.referralTermsUrl)
    );
  }

  
if (!isAid && offer.officialUrl && !offer.referralTermsUrl) {
  buttons.push(
    new ButtonBuilder()
      .setLabel('Conditions générales')
      .setStyle(ButtonStyle.Link)
      .setURL(offer.officialUrl)
  );
}


  buttons.push(
    new ButtonBuilder()
      .setLabel("Besoin d'aide ?")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`open_referral_ticket_${offer.slug}`)
  );

  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(...buttons)
  );

  return container;
}


const referralSyncLocks = new Map();

async function syncReferralPanels(guild) {

  if (referralSyncLocks.has(guild.id)) {
    return referralSyncLocks.get(guild.id);
  }

  const syncPromise = performReferralPanelSync(guild);
  referralSyncLocks.set(guild.id, syncPromise);

  try {
    return await syncPromise;
  } finally {
    referralSyncLocks.delete(guild.id);
  }
}
async function performReferralPanelSync(guild) {
  await guild.emojis.fetch().catch(error => {
  console.warn(
    '[PARRAINAGES] Impossible d’actualiser les emojis :',
    error.message
  );
});
  const configKey = 'referralPanelMessages';
  const saved = await getConfigValue(configKey, {});
  const messageIds = { ...saved };
  const savedLinks = await getConfigValue('referralCustomLinks', {});
  const savedCodes = await getConfigValue('referralCustomCodes', {});


  for (const [channelName, baseOffer] of Object.entries(REFERRAL_OFFERS)) {
    
const isAid = baseOffer.category === 'aides';


const offer = {
  ...baseOffer,
  draft: baseOffer.draft,
  url: isAid
    ? null
    : (savedLinks[channelName] || baseOffer.url),
  referralCode: isAid
    ? null
    : (savedCodes[channelName] || baseOffer.referralCode)
};


const hasPersonalOffer = Boolean(
  offer.url || offer.referralCode
);


const campaignEndDates = {
  'trading212': '2026-11-03T23:59:59+01:00',
  'ramify': '2026-10-31T23:59:59+01:00',
  'topcashback': '2026-11-12T23:59:59+01:00'
};

const campaignEnd = campaignEndDates[offer.slug];

const campaignExpired =
  campaignEnd &&
  Date.now() > new Date(campaignEnd).getTime();




offer.displayStatus =
  baseOffer.displayStatus === 'suspended'
    ? 'suspended'
    : baseOffer.displayStatus === 'coming_soon'
      ? 'coming_soon'
      : baseOffer.draft === true
        ? 'coming_soon'
        : baseOffer.displayStatus === 'available'
          ? 'available'
          : !isAid && !hasPersonalOffer
            ? 'coming_soon'
            : 'available';



          offer.emojiText = getReferralEmoji(guild, offer);


    const channel = guild.channels.cache.find(
      ch => ch.name === channelName && ch.type === ChannelType.GuildText
    );

    if (!channel) {
      console.warn(`Salon de parrainage introuvable : ${channelName}`);
      continue;
    }

    if (
      baseOffer.category === 'bookmakers' &&
      channel.parentId !== BOOKMAKERS_CATEGORY_ID
    ) {
      console.warn(
        `Salon bookmaker hors catégorie : ${channelName}`
      );
      continue;
    }


    try {
      
const payload = {
  components: [buildReferralContainer(offer)],
  flags: MessageFlags.IsComponentsV2,
  allowedMentions: { parse: [] }
};


      let message = null;

      if (messageIds[channel.id]) {
        message = await channel.messages
          .fetch(messageIds[channel.id])
          .catch(() => null);
      }




      if (!message || message.author.id !== client.user.id) {
        const recentMessages = await channel.messages
          .fetch({ limit: 100 })
          .catch(() => null);

        if (recentMessages) {
          const hasTicketButton = (components = []) =>
            components.some(component =>
              component.customId ===
                `open_referral_ticket_${offer.slug}` ||
              hasTicketButton(component.components || [])
            );

          message = recentMessages.find(msg =>
            msg.author.id === client.user.id &&
            msg.flags.has(MessageFlags.IsComponentsV2) &&
            hasTicketButton(msg.components)
          ) || null;
        }
      }


      if (message && message.author.id === client.user.id) {
        
await message.edit({
  components: payload.components,
  attachments: [],
  allowedMentions: payload.allowedMentions
});

      } else {
        message = await channel.send(payload);
      }

      messageIds[channel.id] = message.id;
      await setConfigValue(configKey, messageIds);

      console.log(`✅ Fiche synchronisée : ${channelName}`);
    } catch (error) {
      console.error(`❌ Erreur fiche ${channelName}:`, error);
    }
  }
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
  onboarding: 'attachment://onboarding.png',
};


// Charger uniquement les joueurs visibles : les stats restent indépendantes du cache,
// mais les rôles de rang doivent être récupérés depuis Discord.
async function fetchLeaderboardPageMembers(guild, sorted, page = 0) {
  if (!guild) return;
  const ids = sorted.slice(Math.max(0, page) * 10, (Math.max(0, page) + 1) * 10)
    .map(([id]) => id);
  await Promise.all(ids.map(async id => {
    if (guild.members.cache.has(id)) return;
    await guild.members.fetch(id).catch(err => {
      console.warn(`⚠️ Rang indisponible pour ${id} : ${err.message}`);
    });
  }));
}

// ── Embed Leaderboard ──
function buildLeaderboardContainer({
  sorted,
  totalInvitesPerMember,
  guildMembersCache,
  playerCount,
  seasonLabel = 'Saison 1',
  page = 0,
  ephemeralPagination = false
}) {

  if (!sorted.length) {
    return new ContainerBuilder()
      .setAccentColor(EMBED_COLOR)

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:VIDE:1493046347337699499> LEADERBOARD\n` +
          `-# ᴄᴀʟᴄᴜʟ ᴇɴ ᴄᴏᴜʀꜱ…`
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

  const maxRR = Math.max(
  1,
  ...sorted.map(([, player]) => Math.max(0, player.rr || 0))
);
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
  (Math.max(0, Number(data.rr) || 0) / maxRR) * barLength;

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

    const positionDisplay =
  globalIndex === 0
    ? '<:TopLeaderboard:1465709888729776296>'
    : `#${globalIndex + 1}`;

  return (
  `### ${positionDisplay} <@${id}> ` +
  `${rankEmoji ? rankEmoji : ''} ` +
  `**${data.rr || 0}**<:VIDE:1541125087384829962> ` +
  `**${invites}**<:VIDE:1472667823875559708>  ` +
  `${bar}\u00A0\u00A0\u00A0\u00A0\u2063`
);
});

  const container = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
  new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## <:VIDE:1493046347337699499> LEADERBOARD ${getLeaderboardMonthLabel()}\n` +
        `-# ᴅᴇʀɴɪᴇʀᴇ ᴍɪꜱᴇ ᴀ ᴊᴏᴜʀ : <t:${Math.floor(Date.now() / 1000)}:R>\n` +
        `-# ᴊᴏᴜᴇᴜʀꜱ ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛꜱ : \`${playerCount}\`\n` +
        `-# ᴄᴀꜱʜᴘʀɪᴢᴇ ᴅᴜ ᴍᴏɪꜱ : <:VIDE:1469100224289968242> ᴀ ᴅᴇꜰɪɴɪʀ`

      )
    )
    .setThumbnailAccessory(
  new ThumbnailBuilder()
    .setURL('attachment://leaderboard-icon.png')
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

  const openLeaderboardRow = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId('leaderboard_stats')
      .setLabel('Mon tracker')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('leaderboard_open')
      .setLabel('Classement complet')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('leaderboard_invites')
      .setLabel('Invitations')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('leaderboard_clips')
      .setLabel('Clips du mois')
      .setStyle(ButtonStyle.Secondary)

  );

  container.addActionRowComponents(openLeaderboardRow);

if (ephemeralPagination && totalPages > 1) {
  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('leaderboard_page_1')
        .setEmoji({ id: '1543638348248121538' })
        .setStyle(ButtonStyle.Secondary)
    )
  );
}

} else if (ephemeralPagination) {

  const paginationRow = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId(`leaderboard_page_${page - 1}`)
      .setEmoji({ id: '1543638363125588098' })
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page <= 0),

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

function buildInvitationsLeaderboardContainer({
  invitesData,
  guildMembersCache
}) {

  const sortedInvites = Object.entries(invitesData)
    .filter(([id]) => {
      const member = guildMembersCache.get(id);

      return (
  member &&
  !member.user.bot &&
  Number(invitesData[id]?.invites || 0) > 0
);
    })
    .sort(
      ([, a], [, b]) =>
        (b.invites || 0) - (a.invites || 0)
    )
    .slice(0, 10);

  const monthLabel =
    new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      month: 'long'
    })
      .format(new Date())
      .toUpperCase();

      const smallMonthLabel =
  toSmallCaps(monthLabel);

  const participantCount =
  Object.entries(invitesData).filter(
    ([id, data]) => {
      const member =
        guildMembersCache.get(id);

      return (
        member &&
        !member.user.bot &&
        (data.invites || 0) > 0
      );
    }
  ).length;


const lines = sortedInvites.map(
  ([id, data], index) => {

    const position =
      index === 0
        ? '<:TopInviter:1465747415670984862>'
        : `#${index + 1}`;

    const invites =
      data.invites || 0;

    return (
      `### ${position} <@${id}>  ` +
      `**${invites} invitation${invites > 1 ? 's' : ''}**`
    );
  }
);

const headerSection =
  new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## <:VIDE:1493046347337699499> TOP INVITATIONS ${smallMonthLabel}\n` +
        `-# ᴅᴇʀɴɪᴇʀᴇ ᴍɪꜱᴇ ᴀ ᴊᴏᴜʀ : <t:${Math.floor(Date.now() / 1000)}:R>\n` +
        `-# ᴊᴏᴜᴇᴜʀꜱ ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛꜱ : \`${participantCount}\`\n` +
        `-# ᴄᴀꜱʜᴘʀɪᴢᴇ ᴅᴜ ᴍᴏɪꜱ : <:VIDE:1469100224289968242> ᴀ ᴅᴇꜰɪɴɪʀ`
      )
    )
    .setThumbnailAccessory(
      new ThumbnailBuilder()
        .setURL(
          'attachment://leaderboard-icon.png'
        )
    );

const container =
  new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)
    .addSectionComponents(headerSection)
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(
          SeparatorSpacingSize.Large
        )
    );

if (!lines.length) {

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      '-# Aucune invitation enregistrée ce mois-ci'
    )
  );

} else {

  for (let i = 0; i < lines.length; i++) {

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        lines[i]
      )
    );

    if (i < lines.length - 1) {
      container.addSeparatorComponents(
        new SeparatorBuilder()
          .setSpacing(
            SeparatorSpacingSize.Large
          )
      );
    }
  }
}

return container;
}
async function buildClipsLeaderboardContainer(guild) {

  const monthKey =
    getParisMonthKey();

  const monthLabel =
    getParisMonthLabel();

    const smallMonthLabel =
  toSmallCaps(monthLabel);

  const clips =
    await Clip.find({
      guildId: guild.id,
      monthKey
    }).lean();

    const participantCount =
  new Set(
    clips.map(
      clip => clip.authorId
    )
  ).size;


  const sortedClips =
    clips
      .sort(
        (a, b) =>
          (b.likes?.length || 0) -
          (a.likes?.length || 0)
      )
      .slice(0, 10);

  const lines = sortedClips.map(
  (clip, index) => {

    const position =
      index === 0
        ? '<:ClipDuMois:1548985872786137138>'
        : `#${index + 1}`;

    const likes =
      clip.likes?.length || 0;

    const clipUrl =
      `https://discord.com/channels/` +
      `${clip.guildId}/` +
      `${clip.channelId}/` +
      `${clip.messageId}`;

    const isPhoto =
      clip.mediaType?.startsWith('image/');

    const mediaLabel =
      isPhoto
        ? 'Voir la photo'
        : 'Voir le clip';

    return (
  `### ${position} <@${clip.authorId}>  ` +
  `<:VIDE:1493650946583040000> **${likes} like${likes > 1 ? 's' : ''}**  ` +
  `[${mediaLabel} ↗](${clipUrl})`
);
  }
);
const headerSection =
  new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## <:VIDE:1493046347337699499> CLIPS DU MOIS ${smallMonthLabel}\n` +
        `-# ᴅᴇʀɴɪᴇʀᴇ ᴍɪꜱᴇ ᴀ ᴊᴏᴜʀ : <t:${Math.floor(Date.now() / 1000)}:R>\n` +
        `-# ᴊᴏᴜᴇᴜʀꜱ ᴘᴀʀᴛɪᴄɪᴘᴀɴᴛꜱ : \`${participantCount}\`\n` +
        `-# ᴄᴀꜱʜᴘʀɪᴢᴇ ᴅᴜ ᴍᴏɪꜱ : <:VIDE:1469100224289968242> ᴀ ᴅᴇꜰɪɴɪʀ`
      )
    )
    .setThumbnailAccessory(
      new ThumbnailBuilder()
        .setURL(
          'attachment://leaderboard-icon.png'
        )
    );
const container =
  new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)
    .addSectionComponents(headerSection)

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
    );

if (!lines.length) {

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      '-# Aucun clip ou photo enregistré ce mois-ci'
    )
  );

} else {

  for (let i = 0; i < lines.length; i++) {

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        lines[i]
      )
    );

    if (i < lines.length - 1) {
      container.addSeparatorComponents(
        new SeparatorBuilder()
          .setSpacing(
            SeparatorSpacingSize.Large
          )
      );
    }
  }
}

return container;
}

// ===== Slash Commands =====
const commands = [

  

{
  name: 'parrainage',
  description: 'Gérer les liens et codes de parrainage',
  default_member_permissions:
    PermissionFlagsBits.Administrator.toString(),

  options: [
    {
      name: 'lien',
      description: 'Modifier le lien personnel d’une enseigne',
      type: 1,
      options: [
        {
  name: 'enseigne',
  description: 'Rechercher une enseigne parmi les 48 fiches',
  type: 3,
  required: true,
  autocomplete: true
},
        {
          name: 'url',
          description: 'Lien personnel HTTPS',
          type: 3,
          required: true
        }
      ]
    },
    
    {
      name: 'code',
      description: 'Modifier le code parrain d’une enseigne',
      type: 1,
      options: [
        {
          name: 'enseigne',
          description: 'Rechercher une enseigne parmi les 48 fiches',
          type: 3,
          required: true,
          autocomplete: true
        },
        {
          name: 'code',
          description: 'Code parrain à afficher',
          type: 3,
          required: true
        }
      ]
    },
    {
      name: 'audit',
      description: 'Auditer les 48 fiches et leurs liens',
      type: 1
    }
  ]
},



  {
  name: 'closemonth',
  description: 'Rattraper une clôture mensuelle manquée',
  default_member_permissions:
    PermissionFlagsBits.Administrator.toString(),
  options: [
    {
      name: 'confirmation',
      description: 'Écrire CONFIRMER pour clôturer le mois précédent',
      type: 3,
      required: true
    }
  ]
},
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
  {
  name: 'resetseason',
  description: 'Réinitialiser les statistiques de la saison',
  default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  options: [
    {
      name: 'confirmation',
      description: 'Écrire CONFIRMER pour réinitialiser',
      type: 3,
      required: true
    }
  ]
},
  {
    name: 'surveillance',
    description: 'Créer et gérer mes recherches d’annonces'
  },
  { name: 'pp', description: 'Créer une partie personnalisée' },
  { name: 'leaderboard', description: 'Afficher le leaderboard', default_member_permissions: PermissionFlagsBits.Administrator.toString() },
  { name: 'manage', description: 'Gérer les données', default_member_permissions: PermissionFlagsBits.Administrator.toString(), options: [{ name: 'joueur', description: 'Joueur', type: 6, required: true }] },
  { name: 'onboarding', description: 'Afficher l’onboarding', default_member_permissions: PermissionFlagsBits.Administrator.toString() }
];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('✅ Slash commands enregistrées'))
  .catch(console.error);

async function cleanupOrphanClips(guild) {
  try {
    const monthKey = getParisMonthKey();

    const clips = await Clip.find({
      guildId: guild.id,
      monthKey
    });

    let deletedCount = 0;

    for (const clip of clips) {
      let channel;

      try {
        channel =
          guild.channels.cache.get(clip.channelId) ||
          await guild.channels.fetch(clip.channelId);
      } catch (err) {
        console.warn(
          `⚠️ Salon inaccessible pour le clip ${clip._id}:`,
          err.message
        );
        continue;
      }

      if (!channel?.isTextBased()) continue;

      try {
        await channel.messages.fetch(clip.messageId);
        continue;
      } catch (err) {
        // 10008 = message définitivement introuvable.
        // Toute autre erreur : on conserve les données.
        if (err.code !== 10008) {
          console.warn(
            `⚠️ Vérification impossible pour le clip ${clip._id}:`,
            err.message
          );
          continue;
        }
      }

      if (clip.botMessageId) {
        try {
          const botMessage =
            await channel.messages.fetch(clip.botMessageId);

          if (botMessage.deletable) {
            await botMessage.delete();
          }
        } catch (err) {
          console.warn(
            `⚠️ Nettoyage du message bot impossible : ${err.message}`
          );
        }
      }

      await Clip.deleteOne({ _id: clip._id });
      deletedCount++;
    }

    console.log(
      `🧹 Nettoyage clips terminé : ${deletedCount} supprimé(s)`
    );
  } catch (err) {
    console.error('❌ Erreur cleanupOrphanClips :', err);
  }
}

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

  const avatar = await getPermanentAvatar(member.user);

  const tagEnabledContainer = new ContainerBuilder()
    .setAccentColor(0x242429)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## <:tag:1497390943928586300> TAG DU SERVEUR ACTIVÉ\n` +
            `-# **${member.user.tag}** (<@${member.id}>)\n` +
            `-# Utilise désormais le tag du serveur et bénéficie du **bonus associé**`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            avatar.url
          )
        )
    );

  await sendActivityMessage(guild, {
    components: [tagEnabledContainer],
    ...(avatar.file ? { files: [avatar.file] } : {}),
    flags: MessageFlags.IsComponentsV2
  });
}

if (!hasServerTag && hasRole) {
  await member.roles.remove(
    SERVER_TAG_ROLE_ID,
    'Tag serveur retiré'
  );

  const avatar = await getPermanentAvatar(member.user);

  const tagRemovedContainer = new ContainerBuilder()
    .setAccentColor(0x242429)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## <:tag:1543303374974357695> TAG DU SERVEUR RETIRÉ\n` +
            `-# **${member.user.tag}** (<@${member.id}>)\n` +
            `-# N'utilise plus le tag du serveur et a perdu le **bonus associé**`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            avatar.url
          )
        )
    );

  await sendActivityMessage(guild, {
    components: [tagRemovedContainer],
    ...(avatar.file ? { files: [avatar.file] } : {}),
    flags: MessageFlags.IsComponentsV2
  });
}

  } catch (err) {
    console.error('Erreur syncServerTagRole :', err);
  }
}

async function getMonthlyAnnouncementStatus(monthKey) {
  return await getConfigValue(
    `monthlyAnnouncements_${monthKey}`,
    {
      rr: null,
      invites: null,
      clip: null
    }
  );
}

async function markMonthlyAnnouncementSent(
  monthKey,
  category,
  message
) {
  const key = `monthlyAnnouncements_${monthKey}`;

  await Config.updateOne(
    { key },
    {
      $set: {
        [`value.${category}`]: {
          messageId: message.id,
          channelId: message.channelId,
          sentAt: new Date().toISOString()
        }
      }
    },
    { upsert: true }
  );
}


async function saveMonthlySnapshot(guild, monthKey) {

    const activeMonth =
    (await getConfigValue('leaderboardData', {})).monthKey;

  if (!activeMonth || activeMonth !== monthKey) {
    throw new Error(
      `Snapshot refusé : période active ${activeMonth || 'inconnue'}, ` +
      `période demandée ${monthKey}`
    );
  }
  const key = `monthlySnapshot_${monthKey}`;

  const existing = await getConfigValue(key, null);

  // Ne jamais écraser une sauvegarde déjà figée.
  if (existing) return existing;

  const [players, invitations, clips] = await Promise.all([
    Points.find({}).lean(),
    Invite.find({}).lean(),
    Clip.find({
      guildId: guild.id,
      monthKey
    }).lean()
  ]);

  const snapshot = {
    monthKey,
    guildId: guild.id,
    createdAt: new Date().toISOString(),

    players: players.map(p => ({
      userId: p.userId,
      rr: p.rr ?? 0,
      games: p.games ?? 0,
      wins: p.wins ?? 0,
      timeouts: p.timeouts ?? 0
    })),

    invitations: invitations.map(i => ({
      inviterId: i.inviterId,
      invites: i.invites ?? 0,
      members: i.members ?? []
    })),

    clips: clips.map(c => ({
      clipId: String(c._id),
      authorId: c.authorId,
      guildId: c.guildId,
      channelId: c.channelId,
      messageId: c.messageId,
      mediaType: c.mediaType,
      likes: c.likes ?? []
    }))
  };

  if (
  !Array.isArray(snapshot.players) ||
  !Array.isArray(snapshot.invitations) ||
  !Array.isArray(snapshot.clips)
) {
  throw new Error(
    `Snapshot mensuel invalide : ${monthKey}`
  );
}

  // Création sans écrasement, même si deux appels arrivent ensemble.
  await Config.updateOne(
    { key },
    {
      $setOnInsert: {
        key,
        value: snapshot
      }
    },
    { upsert: true }
  );

  console.log(`💾 Snapshot mensuel enregistré : ${monthKey}`);

  return await getConfigValue(key);
}

let monthlyWinnersRunning = false;

async function getPendingMonthlyClosure() {
  const leaderboardData =
    await getConfigValue('leaderboardData', {});

  const currentMonth = getParisMonthKey();

  if (!leaderboardData.monthKey) {
    return null;
  }

  if (leaderboardData.monthKey >= currentMonth) {
    return null;
  }

  const lastAnnouncement =
    await getConfigValue(
      'monthlyWinnersLastAnnouncement',
      null
    );

  if (lastAnnouncement === leaderboardData.monthKey) {
    return null;
  }

  return {
    monthKey: leaderboardData.monthKey,
    currentMonth
  };
}

async function announceMonthlyWinners(
  guild,
  forcedMonthKey = null
) {
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

    // Dernier jour du mois
    const lastDayOfMonth =
      new Date(Date.UTC(year, month, 0)).getUTCDate();

    // Fenêtre d'annonce : dernière minute du dernier jour du mois
if (
  day === lastDayOfMonth &&
  hour === 23 &&
  minute === 59
) {
  console.log(
    `🏆 Fenêtre de clôture mensuelle atteinte : ${year}-${String(month).padStart(2, '0')}`
  );
}

    if (!forcedMonthKey && (
      day !== lastDayOfMonth ||
      hour !== 23 ||
      minute !== 59
    )) {
      return;
    }

    monthlyWinnersRunning = true;

    const monthKey = forcedMonthKey ||
      `${year}-${String(month).padStart(2, '0')}`;

    // Sécurité : empêche une double annonce
    const lastAnnouncement =
      await getConfigValue('monthlyWinnersLastAnnouncement', null);

      const leaderboardData =
  await getConfigValue('leaderboardData', {});

if (
  leaderboardData.monthKey &&
  leaderboardData.monthKey !== monthKey
) {
  console.warn(
    `⚠️ Annonce refusée : classement ${leaderboardData.monthKey}, ` +
    `période attendue ${monthKey}`
  );
  return;
}

    if (lastAnnouncement === monthKey) {
      return;
    }

        const monthlySnapshot =
      await saveMonthlySnapshot(guild, monthKey);

    if (!monthlySnapshot) {
      throw new Error(
        `Snapshot mensuel introuvable : ${monthKey}`
      );
    }

        const announcementStatus =
      await getMonthlyAnnouncementStatus(monthKey);


    // ==============================
    // LEADERBOARD
    // ==============================

const pointsData = Object.fromEntries(
  monthlySnapshot.players.map(player => [
    player.userId,
    {
      rr: player.rr,
      games: player.games,
      wins: player.wins,
      timeouts: player.timeouts
    }
  ])
);

const invitesData = Object.fromEntries(
  monthlySnapshot.invitations.map(invite => [
    invite.inviterId,
    {
      invites: invite.invites,
      members: invite.members
    }
  ])
);

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

    const leaderboardWinner =
  sorted.find(([, player]) =>
    (player.rr ?? 0) > 0 &&
    (player.games ?? 0) > 0
  ) || null;

      if (!leaderboardWinner) {
      console.log(
        `ℹ️ Aucun joueur éligible au titre RR pour ${monthKey}`
      );
    }

    // ==============================
// CLIP DU MOIS
// ==============================

const monthlyClips =
  monthlySnapshot.clips;

const clipWinner =
  monthlyClips
    .filter(
      clip =>
        guild.members.cache.has(clip.authorId) &&
        (clip.likes?.length || 0) > 0
    )
    .sort(
      (a, b) =>
        (b.likes?.length || 0) -
        (a.likes?.length || 0)
    )[0] || null;

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

    const [seasonYear, seasonMonth] =
      monthKey.split('-').map(Number);

    const monthLabel = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      month: 'long',
      year: 'numeric'
    }).format(
      new Date(Date.UTC(seasonYear, seasonMonth - 1, 15))
    );

    // ==============================
    // MESSAGE TOP LEADERBOARD
    // ==============================

    if (leaderboardWinner && !announcementStatus.rr) {
      const [winnerId, winnerData] = leaderboardWinner;

      const winnerMember =
  guild.members.cache.get(winnerId) ||
  await guild.members.fetch(winnerId).catch(() => null);

const winnerUser =
  winnerMember?.user ||
  await client.users.fetch(winnerId).catch(() => null);

        const winnerAvatar = winnerUser
  ? await getPermanentAvatar(winnerUser)
  : null;
  
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
                  `## ${BADGES.TOP1} VAINQUEUR DU MOIS\n` +
`-# **${winnerUser?.tag || 'Utilisateur inconnu'}** (<@${winnerId}>)\n` +
`-# Termine la saison à la **1re place** avec **${winnerData.rr || 0}<:Roles:1541125087384829962>**`
                )
              )

              .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    winnerAvatar?.url ||
    guild.iconURL({
      size: 256
    })
  )
)
          );

      const leaderboardWinnerMessage = await sendActivityMessage(guild, {
  components: [leaderboardWinnerContainer],
  ...(winnerAvatar?.file ? { files: [winnerAvatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});


if (!leaderboardWinnerMessage) {
  throw new Error('Impossible d’envoyer l’annonce du vainqueur mensuel');
}

await markMonthlyAnnouncementSent(
  monthKey,
  'rr',
  leaderboardWinnerMessage
);

    }

    // ==============================
    // MESSAGE TOP INVITEUR
    // ==============================

        if (
      topInviterId &&
      maxInvites > 0 &&
      !announcementStatus.invites
    ) {
      const inviterMember =
        guild.members.cache.get(topInviterId);

        const inviterAvatar = inviterMember
  ? await getPermanentAvatar(inviterMember.user)
  : null;

      const invitationWinnerContainer =
        new ContainerBuilder()
          .setAccentColor(EMBED_COLOR)

          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `## ${BADGES.TOP_INVITER} TOP INVITATIONS\n` +
`-# **${inviterMember?.user.tag || 'Utilisateur inconnu'}** (<@${topInviterId}>)\n` +
`-# Termine la saison en tête avec **${maxInvites} invitation${maxInvites > 1 ? 's' : ''}**`
                )
              )

              .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    inviterAvatar?.url ||
    guild.iconURL({
      size: 256
    })
  )
)
          );

      const invitationWinnerMessage = await sendActivityMessage(guild, {
  components: [invitationWinnerContainer],
  ...(inviterAvatar?.file ? { files: [inviterAvatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});

if (!invitationWinnerMessage) {
  throw new Error('Impossible d’envoyer l’annonce du top invitations');
}
await markMonthlyAnnouncementSent(
  monthKey,
  'invites',
  invitationWinnerMessage
);

}

// ==============================
// MESSAGE CLIP DU MOIS
// ==============================

if (clipWinner && !announcementStatus.clip) {

  const clipMember =
    guild.members.cache.get(
      clipWinner.authorId
    );

  const clipAvatar =
    clipMember
      ? await getPermanentAvatar(
          clipMember.user
        )
      : null;

  const likes =
    clipWinner.likes?.length || 0;

  const isImage =
    clipWinner.mediaType?.startsWith(
      'image/'
    );

  const mediaType =
    isImage
      ? 'IMAGE'
      : 'CLIP';

  const mediaUrl =
    `https://discord.com/channels/` +
    `${clipWinner.guildId}/` +
    `${clipWinner.channelId}/` +
    `${clipWinner.messageId}`;

  const clipWinnerContainer =
    new ContainerBuilder()
      .setAccentColor(EMBED_COLOR)

      .addSectionComponents(
        new SectionBuilder()

          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(
                `## <:ClipDuMois:1548985872786137138> ${mediaType} DU MOIS\n` +
                `-# **${clipMember?.user.tag || 'Utilisateur inconnu'}** (<@${clipWinner.authorId}>)\n` +
                `-# Termine le mois avec **${likes} like${likes > 1 ? 's' : ''}**`
              )
          )

          .setThumbnailAccessory(
            new ThumbnailBuilder()
              .setURL(
                clipAvatar?.url ||
                guild.iconURL({
                  size: 256
                })
              )
          )
      )

      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel(
                isImage
                  ? 'Voir la photo'
                  : 'Voir le clip'
              )
              .setStyle(
                ButtonStyle.Link
              )
              .setURL(
                mediaUrl
              )
          )
      );

  const clipWinnerMessage =
    await sendActivityMessage(
      guild,
      {
        components: [
          clipWinnerContainer
        ],

        ...(clipAvatar?.file
          ? {
              files: [
                clipAvatar.file
              ]
            }
          : {}),

        flags:
          MessageFlags.IsComponentsV2
      }
    );

  if (!clipWinnerMessage) {
    throw new Error(
      'Impossible d’envoyer l’annonce du clip du mois'
    );
  }

    await markMonthlyAnnouncementSent(
    monthKey,
    'clip',
    clipWinnerMessage
  );



    }
    if (
  !leaderboardWinner &&
  !(topInviterId && maxInvites > 0) &&
  !clipWinner
) {
  console.log(
    `ℹ️ Aucun gagnant éligible pour ${monthKey} — clôture autorisée`
  );
}
    const finalStatus =
      await getMonthlyAnnouncementStatus(monthKey);

    const allSent =
      (!leaderboardWinner || !!finalStatus.rr) &&
      (!(topInviterId && maxInvites > 0) || !!finalStatus.invites) &&
      (!clipWinner || !!finalStatus.clip);

    if (!allSent) {
      console.warn(
        `⚠️ Annonces incomplètes pour ${monthKey}. ` +
        'Une nouvelle tentative sera nécessaire.'
      );
      return;
    }

    await setConfigValue(
      'monthlyWinnersLastAnnouncement',
      monthKey
    );

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

await watchCleanupMissingChannels();

startWatchScheduler();


gamesData.games = await getAllGames();
  console.log(`✅ ${gamesData.games.length} parties chargées depuis MongoDB`);
} catch (err) {
  console.error('❌ Impossible de démarrer MongoDB :', err);
  return;
}

try {
  const pendingClosure = await getPendingMonthlyClosure();

  if (pendingClosure) {
    console.warn(
      `⚠️ Clôture mensuelle en attente : ` +
      `${pendingClosure.monthKey} → ${pendingClosure.currentMonth}`
    );

await announceMonthlyWinners(
  guild,
  pendingClosure.monthKey
);

await checkMonthlyLeaderboardRollover(guild);

  }
} catch (err) {
  console.error(
    '❌ Vérification de clôture impossible :',
    err
  );
}



    const guildInvites = await guild.invites.fetch().catch(err => {
  console.error('❌ Initialisation des invitations impossible :', err);
  return null;
});

const allInvites = new Map();

if (!guildInvites) {
  console.warn(
    '⚠️ Cache invitations non initialisé : attribution suspendue.'
  );
}

if (guildInvites) {
  guildInvites.forEach(inv => {
    allInvites.set(inv.code, {
      code: inv.code,
      inviter: inv.inviter || null,
      uses: inv.uses ?? 0,
      maxAge: inv.maxAge,
      temporary: inv.temporary
    });
  });
}


  if (guildInvites) {
  invitesCache.set(guild.id, allInvites);
} else {
  invitesCache.delete(guild.id);
}


const initialVanityUses = await fetchVanityUses(guild);

if (initialVanityUses !== null) {
  vanityCache.set(guild.id, initialVanityUses);

  console.log(
    `🔗 Lien public valorant-pp initialisé : ${initialVanityUses} utilisations`
  );
} else {
  vanityCache.delete(guild.id);
}


  console.log(`${colors.green}✅ Invites initialisées en cache (y compris temporaires)${colors.reset}`);
  console.log(`${colors.green}✅ ${colors.bright}${client.user.tag}${colors.reset}${colors.green} est maintenant en ligne !${colors.reset}`);
  console.log(`${colors.blue}✅ Connecté sur le serveur: ${colors.bright}${guild.name}${colors.reset}`);
  console.log(`${colors.blue}✅ ${colors.bright}${guild.memberCount}${colors.reset}${colors.blue} membres${colors.reset}`);

  client.user.setPresence({
    activities: [{ name: 'by @jegouzão', type: 1, url: 'https://www.twitch.tv/jegouzao' }],
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

    let ticketCategory = await guild.channels
  .fetch('1569390219063463986')
  .catch(() => null);

if (!ticketCategory || ticketCategory.type !== ChannelType.GuildCategory) {
  throw new Error('Catégorie TICKETS EN COURS introuvable ou invalide.');
}

    const configFile = path.join(__dirname, 'data', 'config.json');
    const config = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile, 'utf8')) : {};
    config.ticketCategoryId = ticketCategory.id;
    config.staffRoleId = staffRole.id;
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error(`${colors.red}❌ Erreur lors de la création automatique:${colors.reset}`, error);
  }
await syncReferralPanels(guild);
await updateleaderboardEmbed();

console.log(
  `${colors.yellow}🚀 Leaderboard initialisé au démarrage${colors.reset}`
);
let monthlyCheckRunning = false;
// Vérifie régulièrement pendant la dernière minute du mois.
// Le verrou mensuel empêche toute double annonce.
setInterval(async () => {
  if (monthlyCheckRunning) return;
  monthlyCheckRunning = true;

  try {
    
const pendingClosure = await getPendingMonthlyClosure();

if (pendingClosure) {
  await announceMonthlyWinners(
    guild,
    pendingClosure.monthKey
  );
} else {
  await announceMonthlyWinners(guild);
}

await checkMonthlyLeaderboardRollover(guild);

  } catch (err) {
    console.error('❌ Erreur vérification mensuelle :', err);
  } finally {
    monthlyCheckRunning = false;
  }
}, 15000);

// await checkMonthlyLeaderboardRollover(guild);

console.log(
  `${colors.green}✅ Annonce mensuelle des gagnants activée${colors.reset}`
);
});

client.on(Events.UserUpdate, async (oldUser, newUser) => {
  await syncServerTagRole(newUser.id, newUser);
});

function sortLeaderboardPlayers(pointsData, totalInvitesPerMember, guildMembersCache) {
  return Object.entries(pointsData)
    // Les joueurs sont issus de MongoDB, pas du cache Discord incomplet.
    // Les comptes sans partie (dont le bot) ne figurent pas au classement RR.
    .filter(([, data]) => Number(data.games || 0) > 0)
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
const timeoutDiff =
  (a.timeouts || 0) - (b.timeouts || 0);

if (timeoutDiff !== 0) return timeoutDiff;

// 5. Ordre stable en cas d'égalité parfaite
return idA.localeCompare(idB);
    });
}


async function getMonthlyRolloverState(monthKey) {
  return await getConfigValue(
    `leaderboardRollover_${monthKey}`,
    null
  );
}

async function saveMonthlyRolloverState(monthKey, state) {
  const key = `leaderboardRollover_${monthKey}`;

  await Config.updateOne(
    { key },
    {
      $set: {
        value: {
          ...state,
          monthKey,
          updatedAt: new Date().toISOString()
        }
      }
    },
    { upsert: true }
  );
}

let leaderboardRolloverRunning = false;

async function checkMonthlyLeaderboardRollover(guild) {
  if (leaderboardRolloverRunning) return;
  leaderboardRolloverRunning = true;

  try {
    const monthKey = getParisMonthKey();
    const data = await getConfigValue('leaderboardData', {});

    if (!data?.channelId || !data?.messageId) return;

    if (!data.monthKey) {
      await setConfigValue('leaderboardData', {
        ...data,
        monthKey
      });

      console.log(`📅 Leaderboard associé à ${monthKey}`);
      return;
    }

    if (data.monthKey === monthKey) return;

    if (data.monthKey > monthKey) {
      throw new Error('Mois du leaderboard situé dans le futur');
    }

    const sourceMonth = data.monthKey;

    const winnersMonth = await getConfigValue(
      'monthlyWinnersLastAnnouncement',
      null
    );

    if (winnersMonth !== sourceMonth) {
      console.warn(
        `⚠️ Rotation suspendue : gagnants de ${sourceMonth} non annoncés`
      );
      return;
    }

    const channel =
      guild.channels.cache.get(data.channelId) ||
      await guild.channels.fetch(data.channelId).catch(() => null);

    if (!channel?.isTextBased() || !channel.messages?.fetch) {
      throw new Error('Salon leaderboard inaccessible');
    }

    const backupKey = `leaderboardBackup_${sourceMonth}`;
    const marker = `rotation:${guild.id}:${sourceMonth}:${monthKey}`;
    const stateKey = `leaderboardRollover_${sourceMonth}`;

    let state = await getMonthlyRolloverState(sourceMonth);

    if (
      state &&
      (
        state.targetMonth !== monthKey ||
        (state.marker && state.marker !== marker)
      )
    ) {
      throw new Error('Rotation déjà préparée pour une autre destination');
    }

    if (state?.status === 'manual_review') {
      throw new Error('Rotation bloquée : vérification manuelle nécessaire');
    }

    
await withPointsLock(async () => {

  // 1. Sauvegarde des statistiques avant réinitialisation.
  const playersBackup = await Points.find({}).lean();


    await Config.updateOne(
      { key: backupKey },
      {
        $setOnInsert: {
          key: backupKey,
          value: {
            monthKey: sourceMonth,
            createdAt: new Date().toISOString(),
            players: playersBackup.map(p => ({
              userId: p.userId,
              rr: p.rr || 0,
              games: p.games || 0,
              wins: p.wins || 0,
              timeouts: p.timeouts || 0
            }))
          }
        }
      },
      { upsert: true }
    );

    const backup = await getConfigValue(backupKey);

    if (
      !backup ||
      backup.monthKey !== sourceMonth ||
      !Array.isArray(backup.players)
    ) {
      throw new Error('Sauvegarde mensuelle invalide');
    }


const normalizePlayers = players =>
  players
    .map(p => ({
      userId: String(p.userId),
      rr: p.rr ?? 0,
      games: p.games ?? 0,
      wins: p.wins ?? 0,
      timeouts: p.timeouts ?? 0
    }))
    .sort((a, b) => a.userId.localeCompare(b.userId));

const savedPlayers = normalizePlayers(backup.players);
const currentPlayers = normalizePlayers(playersBackup);

if (JSON.stringify(savedPlayers) !== JSON.stringify(currentPlayers)) {
  await saveMonthlyRolloverState(sourceMonth, {
    ...(state || {}),
    status: 'manual_review',
    targetMonth: monthKey,
    backupKey,
    marker,
    reason: 'backup_mismatch'
  });

  throw new Error(
    `Rotation ${sourceMonth} suspendue : ` +
    'sauvegarde différente des statistiques actuelles.'
  );
}

console.log(
  `✅ Sauvegarde ${sourceMonth} vérifiée : ` +
  `${savedPlayers.length} joueurs`
);





    // 2. Journal de rotation.
    if (!state) {
      state = {
        status: 'pending',
        targetMonth: monthKey,
        backupKey,
        previousMessageId: data.messageId,
        marker,
        channelId: channel.id
      };

      await saveMonthlyRolloverState(sourceMonth, state);
    }

    // 3. Retrouver le message Discord en cas de reprise.
    let msg = null;

    if (state.messageId) {
      msg = await channel.messages.fetch(state.messageId)
        .catch(() => null);

      if (!msg) {
        throw new Error(
          'Message de rotation enregistré mais introuvable'
        );
      }
    } else {
      const history = await channel.messages.fetch({
        limit: 100
      });

      msg = history.find(m =>
        m.author?.id === client.user.id &&
        JSON.stringify(m.components || []).includes(marker)
      ) || null;

      if (!msg && state.status !== 'pending') {
        throw new Error(
          'Publication Discord incertaine : vérification manuelle requise'
        );
      }

      if (!msg) {
        state = {
          ...state,
          status: 'sending'
        };

        await saveMonthlyRolloverState(sourceMonth, state);

        const container = buildLeaderboardContainer({
          sorted: [],
          totalInvitesPerMember: {},
          guildMembersCache: guild.members.cache,
          playerCount: 0
        });

        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`-# ${marker}`)
        );

        msg = await channel.send({
          components: [container],
          files: [{
            attachment: path.join(
              __dirname,
              'assets',
              'images',
              'leaderboard-icon.png'
            ),
            name: 'leaderboard-icon.png'
          }],
          flags: MessageFlags.IsComponentsV2
        });
      }

      state = {
        ...state,
        status: 'published',
        messageId: msg.id
      };

      await saveMonthlyRolloverState(sourceMonth, state);
    }

    
// 4. Transaction MongoDB : remise à zéro + nouveau mois.

const session = await mongoose.startSession();


  try {
    await session.withTransaction(async () => {

        const configDoc = await Config.findOne({
          key: 'leaderboardData'
        }).session(session);

        if (
          !configDoc ||
          configDoc.value?.monthKey !== sourceMonth ||
          configDoc.value?.messageId !== data.messageId
        ) {
          throw new Error(
            'Leaderboard modifié pendant la rotation'
          );
        }

        await Points.updateMany(
          {},
          {
            $set: {
              rr: 0,
              games: 0,
              wins: 0,
              timeouts: 0
            }
          },
          { session }
        );

        configDoc.value = {
          channelId: channel.id,
          messageId: msg.id,
          monthKey
        };

        configDoc.markModified('value');

        await configDoc.save({ session });

        await Config.updateOne(
          { key: stateKey },
          {
            $set: {
              value: {
                ...state,
                status: 'completed',
                messageId: msg.id,
                updatedAt: new Date().toISOString(),
                monthKey: sourceMonth
              }
            }
          },
          { session }
        );
      });
    
  } finally {
    await session.endSession();
  }
});

await updateleaderboardEmbed();


    console.log(
      `✅ Rotation ${sourceMonth} → ${monthKey} terminée`
    );

  } catch (err) {
    console.error(
      '❌ Rotation mensuelle suspendue :',
      err
    );
  } finally {
    leaderboardRolloverRunning = false;
  }
}


async function updateleaderboardEmbed() {
  try {
    console.log('🔎 LEADERBOARD — Entrée dans la fonction');
    const leaderboardData = await getConfigValue('leaderboardData', {});

    const currentMonth = getParisMonthKey();

    if (
      leaderboardData.monthKey &&
      leaderboardData.monthKey !== currentMonth
    ) {
      console.warn(
        `⚠️ Leaderboard ${leaderboardData.monthKey} : ` +
        `actualisation suspendue, mois courant ${currentMonth}.`
      );
      return;
    }

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

const sorted = sortLeaderboardPlayers(
  pointsData,
  totalInvitesPerMember,
  guild.members.cache
);

    const playerCount = Object.entries(pointsData)
  .filter(([id, data]) =>
    (data.games || 0) > 0
  )
  .length;
console.log('🔎 LEADERBOARD — Avant récupération des membres');
    await fetchLeaderboardPageMembers(guild, sorted, 0);
    console.log('✅ LEADERBOARD ÉTAPE 1 terminée');
console.log('🔎 LEADERBOARD ÉTAPE 2 — Construction du container');
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
  files: [
    {
      attachment: path.join(__dirname, 'assets', 'images', 'leaderboard-icon.png'),
      name: 'leaderboard-icon.png'
    }
  ],
  flags: MessageFlags.IsComponentsV2
});

      await setConfigValue('leaderboardData', {
  messageId: newMsg.id,
  channelId: channel.id,
  monthKey: leaderboardData.monthKey || getParisMonthKey()
});

      await msg.delete().catch(() => {});

      console.log('✅ Leaderboard recréé en Components V2');
      return;
    }

console.log('🔎 LEADERBOARD ÉTAPE 3 — Modification du message Discord');

    
const leaderboardIconName = 'leaderboard-icon.png';

const existingAttachments = [...msg.attachments.values()];

const hasLeaderboardIcon = existingAttachments.some(
  file => file.name === leaderboardIconName
);

const editPayload = {
  components: [container],
  attachments: existingAttachments.map(file => ({
    id: file.id
  }))
};

if (!hasLeaderboardIcon) {
  const iconPath = path.join(
    __dirname,
    'assets',
    'images',
    leaderboardIconName
  );

editPayload.files = [
  new AttachmentBuilder(iconPath, {
    name: leaderboardIconName
  })
];
}




await msg.edit(editPayload);



    console.log('✅ Leaderboard mis à jour');

  } catch (err) {
    console.error('❌ ERREUR UPDATE LEADERBOARD :', err);
  }
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
            `## <:VIDE:1493046347337699499> <#${waitingVCId}> \`${code}\` ${mapName || ''}\n` +
            `-# Partie organisée par **${organisateur}** — <@&${ROLE_NOTIF_PP}>\n` +
            `-# \`${remaining}\` place${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''} — Trouve un last ici : <#734895135019761733>\n` +
            `-# \`${votes}/${needed}\` votes pour changer la map ${mapName}`
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
          .setURL(`attachment://${mapImage}`)
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
            `## <:VIDE:1493046347337699499> RÉSULTATS ${toSmallCaps(winnerText)}\n` +
            `-# Partie validée par **${validatedBy}**\n` +
            `-# Victoire des **${winnerText}**\n` +
            `-# Le calcul prend en compte les avantages <:tag:1497390943928586300> et <:boost:1492125876437913641> de serveur`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(`attachment://${mapImage}`)
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

  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Voir le classement')
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/channels/${guild.id}/1468789000419409950`
        ),

      new ButtonBuilder()
        .setCustomId('pp_relaunch')
        .setLabel('Relancer une partie')
        .setStyle(ButtonStyle.Secondary)
    )
  );

  return container;
}

function buildPPCreateModal() {
  const modal = new ModalBuilder()
    .setCustomId('pp_create_modal')
    .setTitle('Créer une partie personnalisée');

  const codeInput = new TextInputBuilder()
    .setCustomId('valorant_code')
    .setLabel('Code de groupe Valorant')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(6)
    .setMaxLength(6);

  modal.addComponents(
    new ActionRowBuilder().addComponents(codeInput)
  );

  return modal;}

// ===== Interaction Handler =====
client.on('interactionCreate', async (interaction) => {
  try {


// ============================================================
// SURVEILLANCE — INTERACTIONS DISCORD
// ============================================================


// ============================================================
// SURVEILLANCE — APERÇU DU DESIGN COMPACT
// ============================================================

if (
  interaction.isButton() &&
  /^watch_preview_[a-f0-9]{24}$/.test(interaction.customId)
) {
  if (!interaction.inGuild()) return;

  const searchId = interaction.customId.replace(
    'watch_preview_', ''
  );

  const search = await WatchSearch.findById(searchId);

  if (
    !search ||
    search.guildId !== interaction.guildId ||
    search.channelId !== interaction.channelId
  ) {
    return interaction.reply({
      content: 'Recherche introuvable.',
      flags: MessageFlags.Ephemeral
    });
  }

  if (
    search.userId !== interaction.user.id &&
    !interaction.memberPermissions?.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return interaction.reply({
      content: 'Cette recherche ne t’appartient pas.',
      flags: MessageFlags.Ephemeral
    });
  }

  try {
    
const previewImages = {
  vinted: 'https://placehold.co/300x400/png?text=Vinted',
  leboncoin: 'https://placehold.co/300x400/png?text=Leboncoin',
  ebay: 'https://placehold.co/300x400/png?text=eBay'
};

const listing = {
  id: 'watch-design-preview',
  title: 'Manteau vintage — Aperçu de la fiche',
  url: search.searchUrl ||
    `https://${search.platform === 'ebay'
      ? 'www.ebay.fr'
      : search.platform === 'leboncoin'
        ? 'www.leboncoin.fr'
        : 'www.vinted.fr'}`,
  price: 45,
  imageUrl: previewImages[search.platform] || null,
  brand: 'Vintage',
  size: 'M',
  condition: 'Très bon état',
  location: 'Paris, France'
};



const card = buildWatchListingCard(
  interaction.guild,
  search.platform,
  listing,
  search
);


    return interaction.reply({
      components: [card],
      flags:
        MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [] }
    });

  } catch (error) {
    console.error(
      '[SURVEILLANCE] Erreur aperçu design :',
      error
    );

    return interaction.reply({
      content: 'Impossible de générer l’aperçu.',
      flags: MessageFlags.Ephemeral
    });
  }
}


// ============================================================
// SURVEILLANCE — TEST D'UNE ANNONCE FICTIVE
// ============================================================


// ============================================================
// SURVEILLANCE — DIAGNOSTIC URL VINTED
// ============================================================

if (
  interaction.isButton() &&
  /^watch_vinted_url_[a-f0-9]{24}$/.test(interaction.customId)
) {
  if (
    !interaction.inGuild() ||
    !interaction.memberPermissions?.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return interaction.reply({
      content: 'Diagnostic réservé aux administrateurs.',
      flags: MessageFlags.Ephemeral
    });
  }

  const searchId = interaction.customId.replace(
    'watch_vinted_url_', ''
  );

  const search = await WatchSearch.findOne({
    _id: searchId,
    guildId: interaction.guildId,
    channelId: interaction.channelId,
    platform: 'vinted'
  });

  if (!search) {
    return interaction.reply({
      content: 'Recherche Vinted introuvable.',
      flags: MessageFlags.Ephemeral
    });
  }


  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  try {
    const filters = parseVintedSearchFilters(
      search.searchUrl
    );

    const network = await diagnoseVintedAccess(
      search.searchUrl
    );


    const formatValues = values =>
      values.length ? values.join(', ') : 'Aucun';

    const report = [
      '## 🔍 DIAGNOSTIC URL VINTED',
      '',
      '**Analyse du lien :** réussie',
      `**Mots-clés :** ${filters.keywords || 'Aucun'}`,
      `**Tri :** ${filters.order}`,
      `**Prix minimum :** ${filters.minPrice ?? 'Aucun'}`,
      `**Prix maximum :** ${filters.maxPrice ?? 'Aucun'}`,
            `**Catégories :** ${formatValues(filters.catalogs)}`,
      `**Marques :** ${formatValues(filters.brands)}`,
      `**Tailles :** ${formatValues(filters.sizes)}`,
      `**États :** ${formatValues(filters.conditions)}`,
      `**Couleurs :** ${formatValues(filters.colors)}`,
      `**Matières :** ${formatValues(filters.materials)}`,
      '',
      '### 🌐 CONNEXION VINTED',
      `**Connexion :** ${network.success ? 'Réussie' : 'Échec'}`,
      `**Code HTTP :** ${network.status ?? 'Indisponible'}`,
      `**Durée :** ${network.durationMs} ms`,
      `**Type de contenu :** ${network.contentType || 'Inconnu'}`,
      `**Taille HTML :** ${network.htmlLength ?? 0} caractères`,
      `**Titre de page :** ${network.title || 'Inconnu'}`,
      '',
      '### 📦 DONNÉES D’ANNONCES',
      `**Liens d'annonces :** ${network.indicators?.itemLinks ?? 0}`,
      `**Identifiants détectés :** ${network.indicators?.itemIds ?? 0}`,
      `**Tableaux d'annonces :** ${network.indicators?.itemObjects ?? 0}`,
      '',
      '### 🔗 EXEMPLES D’ANNONCES',
      ...(network.sampleLinks?.length
        ? network.sampleLinks.slice(0, 2).map(
            (link, index) => `${index + 1}. ${link}`
          )
        : ['Aucun lien exploitable détecté']),
      '',
      '### 🧪 EXTRACTION HTML',
      ...(network.htmlSamples?.length
        ? network.htmlSamples.slice(0, 3).flatMap(
            (item, index) => [
              `**Annonce ${index + 1}**`,
              `Titre : ${item.title || 'Introuvable'}`,
              `Image : ${item.image ? 'Détectée' : 'Introuvable'}`,
              `Images voisines : ${JSON.stringify(item.imageAttributes || [])}`,
              `Texte : ${item.text || 'Aucun'}`
            ]
          )
        : ['Aucune annonce extraite']),
      ...(network.error ? [`**Erreur :** ${network.error}`] : []),
      '',
      '-# Test de connexion uniquement. Aucune notification envoyée.'
    ].join('\n');

    return interaction.editReply({
      content: report.slice(0, 1900),
      flags: MessageFlags.SuppressEmbeds,
      allowedMentions: { parse: [] }
    });

  } catch (error) {
    return interaction.editReply({
      content:
        '❌ **Diagnostic Vinted échoué**\n' +
        String(error.message).slice(0, 1500)
    });
  }
}

if (
  interaction.isButton() &&
  /^watch_leboncoin_url_[a-f0-9]{24}$/.test(interaction.customId)
) {
  if (
    !interaction.inGuild() ||
    !interaction.memberPermissions?.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return interaction.reply({
      content: 'Diagnostic réservé aux administrateurs.',
      flags: MessageFlags.Ephemeral
    });
  }

  const searchId = interaction.customId.replace(
    'watch_leboncoin_url_', ''
  );

  const search = await WatchSearch.findOne({
    _id: searchId,
    guildId: interaction.guildId,
    channelId: interaction.channelId,
    platform: 'leboncoin'
  });

  if (!search) {
    return interaction.reply({
      content: 'Recherche Leboncoin introuvable.',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  try {
    const result = await diagnoseLeboncoinAccess(
      search.searchUrl
    );
const apiTest = await testLeboncoinApiSearch();
    const report = [
      '**DIAGNOSTIC LE BON COIN**',
      '',
            '**TEST LEBONCOIN-API-SEARCH**',
      `Succès : ${apiTest.success ? 'Oui' : 'Non'}`,
      `Durée : ${apiTest.durationMs} ms`,
      `Annonces : ${apiTest.count ?? 0}`,
      `Type de réponse : ${apiTest.responseType || 'Inconnu'}`,
      `Clés : ${apiTest.keys?.join(', ') || 'Aucune'}`,
`Réponse brute : ${apiTest.responsePreview || 'Aucune'}`,
`Attributs véhicule : ${JSON.stringify(apiTest.examples?.[0]?.attributes || []).slice(0, 2500)}`,
`Erreur : ${apiTest.error || 'Aucune'}`,
      ...apiTest.examples?.map(
        item => `${item.title} — ${item.price} €`
      ) || [],
      '',
      `HTTP : ${result.status ?? 'Erreur réseau'}`,
      `Succès HTTP : ${result.success ? 'Oui' : 'Non'}`,
      `Durée : ${result.durationMs} ms`,
      `Taille HTML : ${result.htmlLength ?? 0} caractères`,
      `Type : ${result.contentType || 'Inconnu'}`,
            `Titre : ${result.title || 'Inconnu'}`,
      `Serveur : ${result.server || 'Inconnu'}`,
      `Request ID : ${result.requestId || 'Aucun'}`,
      `Réponse : ${result.bodyPreview || 'Vide'}`,
      '',
      `Liens annonces : ${result.indicators?.listingLinks ?? 0}`,
      `Scripts JSON-LD : ${result.indicators?.jsonLdScripts ?? 0}`,
      `Next Data : ${result.indicators?.nextData ? 'Oui' : 'Non'}`,
      `Blocage possible : ${result.indicators?.blocked ? 'Oui' : 'Non'}`,
      '',
      '**Exemples de liens :**',
      ...(result.sampleLinks?.length
        ? result.sampleLinks.map(link => `<${link}>`)
        : ['Aucun lien détecté']),
      '',
      result.error
        ? `Erreur : ${result.error}`
        : ''
    ].join('\n');

    await interaction.editReply({
      content: report.slice(0, 1900),
      allowedMentions: { parse: [] }
    });

  } catch (error) {
    await interaction.editReply({
      content: `Diagnostic impossible : ${error.message}`
    });
  }

  return;
}

// ============================================================
// SURVEILLANCE — DIAGNOSTIC API EBAY
// ============================================================

if (
  interaction.isButton() &&
  /^watch_ebay_api_[a-f0-9]{24}$/.test(interaction.customId)
) {
  if (
    !interaction.inGuild() ||
    !interaction.memberPermissions?.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return interaction.reply({
      content: 'Diagnostic réservé aux administrateurs.',
      flags: MessageFlags.Ephemeral
    });
  }

  const searchId = interaction.customId.replace(
    'watch_ebay_api_', ''
  );

  const search = await WatchSearch.findOne({
    _id: searchId,
    guildId: interaction.guildId,
    channelId: interaction.channelId,
    platform: 'ebay'
  });

  if (!search) {
    return interaction.reply({
      content: 'Recherche eBay introuvable.',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  try {
    const startedAt = Date.now();

    const filters = parseEbaySearchFilters(
      search.searchUrl
    );

    const listings = await fetchEbayListings(
      search.searchUrl
    );

    const duration = Date.now() - startedAt;

    // Valider le format avec le normaliseur du moteur.
    const normalized = listings.map(item =>
      normalizeWatchListing('ebay', item)
    );

    const unique = new Map(
      normalized.map(item => [
        watchListingKey('ebay', item),
        item
      ])
    );

    const items = [...unique.values()];

    const priceRange = [
      filters.minPrice ?? 'aucun',
      filters.maxPrice ?? 'aucun'
    ].join(' € → ') + ' €';

    const preview = items.slice(0, 3).map(
      (item, index) => {
        const price = item.price == null
          ? 'Non renseigné'
          : `${item.price} €`;

        return (
          `**${index + 1}. ${item.title.slice(0, 100)}**\n` +
          `Prix : ${price}\n` +
          `Identifiant : \`${item.id}\`\n` +
          `${item.url}`
        );
      }
    ).join('\n\n');

    const report = [
      '## 🔍 DIAGNOSTIC API EBAY',
      '',
      '**Connexion :** réussie',
      `**Durée :** ${duration} ms`,
      `**Annonces récupérées :** ${listings.length}`,
      `**Annonces uniques :** ${items.length}`,
      `**Mots-clés :** ${filters.keywords}`,
      `**Fourchette de prix :** ${priceRange}`,
      '',
      '**Aperçu des 3 premières annonces :**',
      preview || 'Aucune annonce trouvée.',
      '',
      'Aucune annonce envoyée dans le salon.'
    ].join('\n');

    await interaction.editReply({
      content: report.slice(0, 1900),
      allowedMentions: { parse: [] }
    });

  } catch (error) {
    console.error(
      '[SURVEILLANCE] Diagnostic eBay :',
      error
    );

    await interaction.editReply({
      content:
        '❌ **Diagnostic eBay échoué**\n' +
        `\`\`\`${String(error.message).slice(0, 1400)}\`\`\``
    });

  }
}

// ============================================================
// SURVEILLANCE — TEST D'UNE ANNONCE FICTIVE
// ============================================================

if (
  interaction.isButton() &&
  /^watch_test_[a-f0-9]{24}$/.test(interaction.customId)
) {
  if (!interaction.inGuild()) return;

  const searchId = interaction.customId.replace(
    'watch_test_', ''
  );

  const search = await WatchSearch.findById(searchId);


  if (!search || search.guildId !== interaction.guildId || search.channelId !== interaction.channelId) {
    return interaction.reply({
      content: 'Recherche introuvable.',
      flags: MessageFlags.Ephemeral
    });
  }

  if (search.userId !== interaction.user.id) {
    return interaction.reply({
      content: 'Cette recherche ne t’appartient pas.',
      flags: MessageFlags.Ephemeral
    });
  }



  if (search.paused) {
    return interaction.reply({
      content: 'Reprends la surveillance avant de lancer le test.',
      flags: MessageFlags.Ephemeral
    });
  }

  if (!search.searchUrl) {
    return interaction.reply({
      content: 'Cette recherche ne possède pas de lien valide.',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  try {
    // Identifiant fixe : deux clics ne doivent pas
    // créer deux notifications identiques.
    const listing = {
      id: 'watch-test-annonce-v1',
      title: 'ANNONCE FICTIVE — Test de surveillance',
      url: search.searchUrl,
      price: 45,
      imageUrl: null,
      location: 'Paris, France',
      publishedAt: new Date().toISOString()
    };

    await watchQueueListing(search, listing, true);

    // Déclencher immédiatement le traitement
    // sans attendre le prochain passage automatique.
    await watchDeliverPending();

    const notification = await WatchNotification.findOne({
      searchId: search._id,
      listingKey: watchListingKey(
        search.platform,
        listing
      )
    });

    if (notification?.status === 'sent') {
      return interaction.editReply(
        '✅ Annonce fictive envoyée dans ce salon.\n' +
        `Message Discord : ${notification.messageId}\n\n` +
        'Clique à nouveau pour vérifier que le système ' +
        'ne crée pas de doublon.'
      );
    }

    if (notification?.status === 'sending') {
      return interaction.editReply(
        '⏳ Notification en cours de traitement. ' +
        'Vérifie le salon dans quelques instants.'
      );
    }

    return interaction.editReply(
      '⚠️ Notification enregistrée mais pas encore envoyée.\n' +
      `Statut : ${notification?.status || 'introuvable'}\n` +
      `Erreur : ${notification?.lastError || 'aucune'}\n\n` +
      'Consulte les logs du bot.'
    );

  } catch (error) {
    console.error(
      '[SURVEILLANCE] Erreur du test :',
      error
    );

    return interaction.editReply(
      '❌ Le test a échoué : ' + error.message
    );
  }
}


if (interaction.inGuild()) {

  // Commande principale
  
if (
  interaction.isChatInputCommand() &&
  interaction.commandName === 'surveillance'
) {
  if (
    !interaction.memberPermissions?.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return interaction.reply({
      content: 'Seuls les administrateurs peuvent publier ou actualiser le panneau de surveillance.',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  const message = await publishWatchPublicPanel(
    interaction.guild
  );

  return interaction.editReply(
    `Panneau public de surveillance installé ou actualisé : ${message.url}`
  );
}


  // Sélection de la plateforme
  if (
    interaction.isButton() &&
    interaction.customId === 'watch_create'
  ) {
    const count = await WatchSearch.countDocuments({
      guildId: interaction.guildId,
      userId: interaction.user.id
    });

    if (count >= WATCH_CONFIG.maxSearchesPerMember) {
      return interaction.reply({
        content: 'Tu as déjà 5 recherches. Supprime une recherche pour en créer une autre.',
        flags: MessageFlags.Ephemeral
      });
    }

    const container = new ContainerBuilder()
      .setAccentColor(EMBED_COLOR)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '# CRÉER UNE RECHERCHE\n' +
          'Sélectionne la plateforme à surveiller.'
        )
      )
      .addActionRowComponents(
        new ActionRowBuilder().addComponents(
          ...Object.entries(WATCH_CONFIG.platforms).map(
            ([key, platform]) => {
              const button = new ButtonBuilder()
                .setCustomId(`watch_platform_${key}`)
                .setLabel(platform.name)
                .setStyle(ButtonStyle.Secondary);

              const emoji = interaction.guild.emojis.cache.find(
                e => e.name?.toLowerCase() === platform.emojiName
              );

              if (emoji) button.setEmoji(emoji.id);
              return button;
            }
          )
        )
      );

    return interaction.reply({
      components: [container],
      flags:
        MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2
    });
  }


// ============================================================
// SURVEILLANCE — FORMULAIRE URL + NOM PERSONNALISÉ
// ============================================================

if (
  interaction.isButton() &&
  interaction.customId.startsWith('watch_platform_')
) {
  const platform = interaction.customId.replace(
    'watch_platform_', ''
  );

  if (!WATCH_CONFIG.platforms[platform]) return;

  const count = await WatchSearch.countDocuments({
    guildId: interaction.guildId,
    userId: interaction.user.id
  });

  if (count >= WATCH_CONFIG.maxSearchesPerMember) {
    return interaction.reply({
      content: 'Tu as atteint la limite de 5 recherches.',
      flags: MessageFlags.Ephemeral
    });
  }

  const modal = new ModalBuilder()
    .setCustomId(`watch_modal_${platform}`)
    .setTitle(
      `Recherche ${WATCH_CONFIG.platforms[platform].name}`
    );

  const urlInput = new TextInputBuilder()
    .setCustomId('search_url')
    .setLabel('URL (tri : plus récent en premier)')
    .setPlaceholder('Colle le lien de ta recherche')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(3000);

  const nameInput = new TextInputBuilder()
    .setCustomId('custom_name')
    .setLabel('Nom personnalisé du salon')
    .setPlaceholder('Ex. vestes-carhartt')
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setMaxLength(50);

  modal.addComponents(
    new ActionRowBuilder().addComponents(urlInput),
    new ActionRowBuilder().addComponents(nameInput)
  );

  return interaction.showModal(modal);
}



  // ============================================================
  // SURVEILLANCE — CRÉATION DEPUIS UNE URL
  // ============================================================

  if (
    interaction.isModalSubmit() &&
    interaction.customId.startsWith('watch_modal_')
  ) {
    const platform = interaction.customId.replace(
      'watch_modal_', ''
    );

    if (!WATCH_CONFIG.platforms[platform]) return;

    let searchUrl;

    try {
      searchUrl = validateWatchSearchUrl(
        platform,
        interaction.fields.getTextInputValue('search_url')
      );
    } catch (error) {
      return interaction.reply({
        content: error.message,
        flags: MessageFlags.Ephemeral
      });
    }

    const customName = interaction.fields
      .getTextInputValue('custom_name')
      .trim();

    const safeName = watchSafeChannelName(customName);

    if (customName && !safeName) {
      return interaction.reply({
        content: 'Le nom du salon doit contenir au moins une lettre ou un chiffre.',
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    const count = await WatchSearch.countDocuments({
      guildId: interaction.guildId,
      userId: interaction.user.id
    });

    if (count >= WATCH_CONFIG.maxSearchesPerMember) {
      return interaction.editReply(
        'Tu as atteint la limite de 5 recherches.'
      );
    }

    const guild = interaction.guild;

    const category = await guild.channels
      .fetch(WATCH_CATEGORY_ID)
      .catch(() => null);

    if (!category || category.type !== ChannelType.GuildCategory) {
      return interaction.editReply(
        'Catégorie de surveillance introuvable.'
      );
    }

    const channelName = safeName
      ? `${platform}-${safeName}`
      : `${platform}-recherche-${count + 1}`;

    let channel = null;
    let search = null;

    try {
      channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: WATCH_CATEGORY_ID,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ReadMessageHistory
            ]
          },
          {
            id: client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.EmbedLinks
            ]
          }
        ],
        reason: `Recherche privée de ${interaction.user.id}`
      });

      search = await WatchSearch.create({
        guildId: guild.id,
        userId: interaction.user.id,
        channelId: channel.id,
        platform,
        searchUrl,
        customName: customName || '',
        keywords: '',
        mentions: false,
        paused: false,
        seenListingIds: []
      });

      const message = await channel.send({
        components: [
          buildWatchManagementPanel(guild, search)
        ],
        flags: MessageFlags.IsComponentsV2,
        allowedMentions: { parse: [] }
      });

      search.managementMessageId = message.id;
      await search.save();

    } catch (error) {
      console.error(
        'Erreur création surveillance :',
        error
      );

      if (search) {
        await WatchSearch.deleteOne({
          _id: search._id
        }).catch(() => {});
      }

      if (channel) {
        await channel.delete().catch(() => {});
      }

      return interaction.editReply(
        'Impossible de créer la recherche. Consulte les logs du bot.'
      );
    }

    return interaction.editReply(
      `Recherche créée : ${channel}\n` +
      'Le lien est enregistré. La récupération automatique des annonces sera activée après installation du connecteur.'
    );
  }




  // Liste des recherches
  if (
    interaction.isButton() &&
    interaction.customId === 'watch_list'
  ) {
    const searches = await WatchSearch.find({
      guildId: interaction.guildId,
      userId: interaction.user.id
    }).sort({ createdAt: -1 }).lean();

    const lines = searches.map(search => {
      const emoji = getWatchEmoji(
        interaction.guild, search.platform
      );

      return (
        `${emoji} <#${search.channelId}> — ` +
        `${search.paused ? 'Suspendue' : 'Active'}`
      );
    });

    return interaction.reply({
      content: lines.length
        ? `**Mes recherches (${lines.length}/5)**\n\n${lines.join('\n')}`
        : 'Tu ne possèdes aucune recherche.',
      flags: MessageFlags.Ephemeral
    });
  }

  // Gestion d'une recherche existante
  if (
    interaction.isButton() &&
    /^watch_(suspend|resume|delete)_/.test(interaction.customId)
  ) {
    const match = interaction.customId.match(
      /^watch_(suspend|resume|delete)_([a-f0-9]{24})$/
    );

    if (!match) return;

    const [, action, searchId] = match;

    const search = await WatchSearch.findById(searchId);

    if (
      !search ||
      search.guildId !== interaction.guildId ||
      search.channelId !== interaction.channelId
    ) {
      return interaction.reply({
        content: 'Recherche introuvable.',
        flags: MessageFlags.Ephemeral
      });
    }

    if (
      search.userId !== interaction.user.id &&
      !interaction.memberPermissions?.has(
        PermissionFlagsBits.Administrator
      )
    ) {
      return interaction.reply({
        content: 'Cette recherche ne t’appartient pas.',
        flags: MessageFlags.Ephemeral
      });
    }

    
if (action === 'delete') {
  const confirmation = new ContainerBuilder()
    .setAccentColor(0xB63B3B)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        getWatchTitle(
          interaction.guild,
          search.platform,
          'CONFIRMATION DE SUPPRESSION'
        ) +
        '\n\n' +
        `**Recherche :** ${search.customName || search.keywords || 'Sans nom'}\n\n` +
        'Es-tu sûr de vouloir supprimer cette recherche ?\n' +
        '-# Le salon privé et ses messages seront définitivement supprimés.'
      )
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
    )
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`watch_confirm_${search._id}`)
          .setLabel('Confirmer')
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId('watch_cancel_delete')
          .setLabel('Annuler')
          .setStyle(ButtonStyle.Secondary)
      )
    );

  return interaction.reply({
    components: [confirmation],
    flags:
      MessageFlags.Ephemeral |
      MessageFlags.IsComponentsV2
  });
}


    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });


if (action === 'suspend') {
  if (search.paused) {
    return interaction.reply({
      content: 'Cette recherche est déjà suspendue.',
      flags: MessageFlags.Ephemeral
    });
  }

  search.paused = true;
}

if (action === 'resume') {
  if (!search.paused) {
    return interaction.reply({
      content: 'Cette recherche est déjà active.',
      flags: MessageFlags.Ephemeral
    });
  }

  search.paused = false;
}


    await search.save();
    await updateWatchManagementPanel(
      interaction.guild, search
    );

    return interaction.editReply(
      'Paramètres de la recherche mis à jour.'
    );
  }

  if (
  interaction.isButton() &&
  interaction.customId === 'watch_cancel_delete'
) {
  return interaction.update({
    components: [
      buildSimpleContainer('Suppression annulée.')
    ],
    flags: MessageFlags.IsComponentsV2
  });
}

  // Suppression confirmée
  if (
    interaction.isButton() &&
    interaction.customId.startsWith('watch_confirm_')
  ) {
    const searchId = interaction.customId.replace(
      'watch_confirm_', ''
    );

    if (!/^[a-f0-9]{24}$/.test(searchId)) return;

    const search = await WatchSearch.findById(searchId);

    if (
      !search ||
      search.guildId !== interaction.guildId ||
      search.channelId !== interaction.channelId
    ) {
      return interaction.reply({
        content: 'Recherche introuvable.',
        flags: MessageFlags.Ephemeral
      });
    }

    if (
      search.userId !== interaction.user.id &&
      !interaction.memberPermissions?.has(
        PermissionFlagsBits.Administrator
      )
    ) {
      return interaction.reply({
        content: 'Action non autorisée.',
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    const channel = await interaction.guild.channels
      .fetch(search.channelId)
      .catch(() => null);

      await WatchNotification.deleteMany({
  searchId: search._id
});

    await WatchSearch.deleteOne({ _id: search._id });


    await interaction.editReply(
      'Recherche supprimée. Une place est maintenant disponible.'
    ).catch(console.error);

    if (channel) {
      await channel.delete(
        'Recherche de surveillance supprimée'
      ).catch(console.error);
    }

    return;

  }
}



    // Autocomplétion de toutes les enseignes de parrainage
    if (
      interaction.isAutocomplete() &&
      interaction.commandName === 'parrainage'
    ) {
      const focused = interaction.options.getFocused(true);

      if (focused.name !== 'enseigne') {
        return interaction.respond([]);
      }

      const search = String(focused.value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const results = Object.entries(REFERRAL_OFFERS)
        .filter(([key, offer]) => {
          const label = `${offer.title} ${offer.slug} ${offer.category}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

          return label.includes(search);
        })
        .sort((a, b) =>
          a[1].title.localeCompare(b[1].title, 'fr')
        )
        .slice(0, 25)
        .map(([key, offer]) => ({
          name: offer.title.slice(0, 100),
          value: key
        }));

      return interaction.respond(results);
    }




    const MOD_ROLE_ID = '1461348856100028439';
    const VERIFIED_ROLE_ID = '1461354176931041312';

    const isMod = interaction.member?.roles?.cache?.has(MOD_ROLE_ID);
    const isVerified = interaction.member?.roles?.cache?.has(VERIFIED_ROLE_ID);

    
if (
  interaction.isChatInputCommand() &&
  interaction.commandName === 'parrainage'
) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: 'Commande réservée aux administrateurs.',
      flags: MessageFlags.Ephemeral
    });
  }

  
const action = interaction.options.getSubcommand(true);

if (action === 'audit') {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  const savedLinks = await getConfigValue('referralCustomLinks', {});
  const savedCodes = await getConfigValue('referralCustomCodes', {});

  const stats = {
    total: 0,
    liensPerso: 0,
    codes: 0,
    inscriptions: 0,
    officiels: 0,
    boutonsGrises: 0,
    conditionsManquantes: 0
  };

  const problems = [];
  const fallbacks = [];

  for (const [key, offer] of Object.entries(REFERRAL_OFFERS)) {
    stats.total++;

    const isAid = offer.category === 'aides';
    const personalUrl = isAid ? null : (savedLinks[key] || offer.url);
    const code = isAid ? null : (savedCodes[key] || offer.referralCode);

    if (personalUrl) stats.liensPerso++;
    if (code) stats.codes++;

    if (!isAid && !personalUrl && offer.signupUrl) {
      stats.inscriptions++;
    }

    if (offer.officialUrl) stats.officiels++;

    const mainUrl = isAid
      ? offer.officialUrl
      : (personalUrl || offer.signupUrl || offer.officialUrl);

    if (!mainUrl) {
      stats.boutonsGrises++;
      problems.push(`🔴 ${offer.title} : bouton principal désactivé`);
    } else if (!isAid && !personalUrl && !offer.signupUrl) {
      fallbacks.push(`🟡 ${offer.title} : utilise la page officielle`);
    }

    if (!offer.officialUrl) {
      stats.conditionsManquantes++;
      problems.push(`🔴 ${offer.title} : conditions officielles absentes`);
    }
  }

  const lines = [
    '## 🔎 AUDIT DES PARRAINAGES',
    '',
    `**Fiches analysées :** ${stats.total}`,
    `**Liens personnels :** ${stats.liensPerso}`,
    `**Codes parrain :** ${stats.codes}`,
    `**Liens d'inscription de secours :** ${stats.inscriptions}`,
    `**Liens officiels :** ${stats.officiels}`,
    `**Boutons principaux désactivés :** ${stats.boutonsGrises}`,
    `**Conditions officielles manquantes :** ${stats.conditionsManquantes}`,
    '',
    '### ❌ Problèmes détectés',
    problems.length ? problems.join('\n') : 'Aucun problème détecté.',
    '',
    '### ⚠️ Liens de secours',
    fallbacks.length ? fallbacks.join('\n') : 'Aucun.',
    '',
    '-# Audit en lecture seule : aucune donnée modifiée.'
  ];

  const report = lines.join('\n');

  if (report.length <= 1900) {
    return interaction.editReply({ content: report });
  }

  const attachment = Buffer.from(report, 'utf8');

  return interaction.editReply({
    content: '📋 Rapport complet de l’audit :',
    files: [{
      attachment,
      name: 'audit-parrainages.txt'
    }]
  });
}

const enseigne = interaction.options.getString('enseigne', true);


  if (!REFERRAL_OFFERS[enseigne]) {
    return interaction.reply({
      content: 'Enseigne non configurée.',
      flags: MessageFlags.Ephemeral
    });
  }

  if (action === 'code') {
    const code = interaction.options.getString('code', true).trim();

    if (!/^[a-zA-Z0-9_-]{2,80}$/.test(code)) {
      return interaction.reply({
        content: 'Code invalide : 2 à 80 caractères (lettres, chiffres, _ ou -).',
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    const codes = await getConfigValue('referralCustomCodes', {});
    codes[enseigne] = code;

    await setConfigValue('referralCustomCodes', codes);
    await syncReferralPanels(interaction.guild);

    return interaction.editReply({
      content: `Code enregistré et panneaux synchronisés pour ${enseigne}.`
    });
  }

  const rawUrl = interaction.options.getString('url', true).trim();

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {}


const REFERRAL_ALLOWED_DOMAINS = {
  '┃boursobank': ['boursobank.com', 'bour.so'],
  '┃fortuneo': ['fortuneo.fr'],
  '┃revolut': ['revolut.com'],
  '┃hello-bank': ['hellobank.fr'],
  '┃monabanq': ['monabanq.com'],
  '┃n26': ['n26.com'],
  '┃bunq': ['bunq.com'],
  '┃distingo-bank': ['distingobank.fr'],
  '┃nickel': ['nickel.eu'],
  '┃sumeria': ['sumeria.eu', 'lydia-app.com'],
  '┃wise': ['wise.com'],
  '┃la-banque-postale': ['labanquepostale.fr'],

  '┃trade-republic': ['traderepublic.com', 'trade.re'],
  '┃trading212': ['trading212.com'],
  '┃etoro': ['etoro.com'],
  '┃shares': ['shares.io'],
  '┃yomoni': ['yomoni.fr'],
  '┃ramify': ['ramify.fr'],
  '┃finary': ['finary.com'],

  '┃coinbase': ['coinbase.com'],
  '┃swissborg': ['swissborg.com'],
  '┃bitvavo': ['bitvavo.com'],
  '┃kraken': ['kraken.com'],
  '┃bitpanda': ['bitpanda.com'],
  '┃crypto-com': ['crypto.com'],

  '┃igraal': ['igraal.com', 'igraal.fr'],
  '┃widilo': ['widilo.fr'],
  '┃ebuyclub': ['ebuyclub.com'],
  '┃joko': ['hellojoko.app.link'],
  '┃rakuten': ['rakuten.com', 'rakuten.fr'],
  '┃poulpeo': ['poulpeo.com'],
  '┃shopmium': ['shopmium.com'],
  '┃naomi': ['naomi.fr'],
  '┃capital-koala': ['capitalkoala.com'],
  '┃topcashback': ['topcashback.fr'],
  '┃wanteeed': ['wanteeed.com'],


  '┃winamax': ['winamax.fr'],
  '┃betclic': ['betclic.fr', 'betclic.onelink.me'],
  '┃unibet': ['unibet.fr'],
  '┃pmu': ['pmu.fr'],
  '┃betsson': ['betsson.fr']

};

const hostname = parsed?.hostname?.toLowerCase();

const allowedDomains = REFERRAL_ALLOWED_DOMAINS[enseigne] || [];

const validDomain = allowedDomains.some(domain =>
  hostname === domain ||
  hostname?.endsWith(`.${domain}`)
);


  if (
    parsed?.protocol !== 'https:' ||
    !validDomain ||
    rawUrl.length > 1500 ||
    parsed.username ||
    parsed.password
  ) {
    return interaction.reply({
      content: `Lien invalide : utilise une URL HTTPS officielle correspondant à ${enseigne}.`,
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  const links = await getConfigValue('referralCustomLinks', {});
  links[enseigne] = rawUrl;

  await setConfigValue('referralCustomLinks', links);
  await syncReferralPanels(interaction.guild);

  return interaction.editReply({
    content: `Lien enregistré et synchronisation lancée pour ${enseigne}.`
  });
}


    // --------------------------------------
// BOUTON RIOT
// --------------------------------------
if (interaction.isButton() && interaction.customId === 'verify_riot') {
  if (interaction.replied || interaction.deferred) return;

  if (!memberHasSelectedRank(interaction.member)) {
  return simpleReply(
    interaction,
    '❌ Tu dois d’abord sélectionner ton **peak rank** avant de pouvoir te renommer'
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
      if (interaction.isStringSelectMenu() && interaction.customId?.startsWith('spectate_select_')) {
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
    files: [
      {
        attachment: path.join(__dirname, 'assets', 'images', 'onboarding.png'),
        name: 'onboarding.png'
      }
    ],
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
    '❌ Aucun rang actuel détecté'
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
    '❌ Tu ne peux sélectionner qu’un rang supérieur à ton rang actuel'
  );
}
await interaction.deferUpdate();

  const oldRoleId = RANK_ROLES[currentRank];
const newRoleId = RANK_ROLES[selectedRank];

await interaction.member.roles.remove(oldRoleId).catch(() => {});
await interaction.member.roles.add(newRoleId).catch(() => {});

const newRankLabel = RANK_LABELS[selectedRank];
const newRankEmoji = rankEmojis[newRankLabel] || rankEmojis.Unranked;

const avatar = await getPermanentAvatar(
  interaction.user
);

const rankUpActivityContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${newRankEmoji} RANK UP\n` +
          `-# **${interaction.user.tag}** (<@${interaction.user.id}>)\n` +
`-# Est passé de **${RANK_LABELS[currentRank]}** à **${newRankLabel}**`
        )
      )
      .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
  );

await sendActivityMessage(interaction.guild, {
  components: [rankUpActivityContainer],
  ...(avatar.file ? { files: [avatar.file] } : {}),
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


      if (
  interaction.customId ===
  'leaderboard_clips'
) {

  const isEphemeral =
    interaction.message?.flags?.has(
      MessageFlags.Ephemeral
    );

  if (isEphemeral) {

    await interaction.deferUpdate();

  } else {

    await interaction.reply({
      components: [
        buildSimpleContainer(
          '⏳ Chargement du Top Clips...'
        )
      ],
      flags:
        MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2
    });

  }

  const container =
    await buildClipsLeaderboardContainer(
      interaction.guild
    );

return interaction.editReply({
  components: [container],
  files: [
    {
      attachment: path.join(
        __dirname,
        'assets',
        'images',
        'leaderboard-icon.png'
      ),
      name: 'leaderboard-icon.png'
    }
  ]
});
}

if (
  interaction.customId?.startsWith(
    'clip_like_'
  )
) {

  await interaction.deferUpdate();

  const clipId =
    interaction.customId.replace(
      'clip_like_',
      ''
    );

  const clip =
    await Clip.findById(clipId).lean();

if (!clip || clip.guildId !== interaction.guildId) {
  return interaction.followUp({
    components: [
      buildSimpleContainer(
        '❌ Ce clip est introuvable ou indisponible.'
      )
    ],
    flags:
      MessageFlags.Ephemeral |
      MessageFlags.IsComponentsV2
  });
}

  // Impossible de liker son propre média
  if (
    interaction.user.id === clip.authorId
  ) {
    return interaction.followUp({
      components: [
        buildSimpleContainer(
          '❌ Tu ne peux pas liker ton propre clip'
        )
      ],
      flags:
        MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2
    });
  }

  const userId = interaction.user.id;

// Tentative de retrait si le like existe encore.
let updatedClip = await Clip.findOneAndUpdate(
  {
    _id: clipId,
    guildId: interaction.guildId,
    likes: userId
  },
  {
    $pull: { likes: userId }
  },
  { new: true }
);

if (!updatedClip) {
  // Ajout uniquement si le like n'existe pas.
  updatedClip = await Clip.findOneAndUpdate(
    {
      _id: clipId,
      guildId: interaction.guildId,
      likes: { $ne: userId }
    },
    {
      $addToSet: { likes: userId }
    },
    { new: true }
  );
}

if (!updatedClip) {
  return interaction.followUp({
    components: [
      buildSimpleContainer(
        '❌ Le clip a changé entre-temps. Réessaie.'
      )
    ],
    flags:
      MessageFlags.Ephemeral |
      MessageFlags.IsComponentsV2
  });
}
  return interaction.editReply({
    components: [buildClipLikeContainer(updatedClip)]
  });
}

}

      if (interaction.customId === 'leaderboard_stats') {
  return showPlayerStats(interaction);
}

if (
  interaction.customId ===
  'leaderboard_invites'
) {

  if (!interaction.replied) {

    await interaction.reply({
      components: [
        buildSimpleContainer(
          '⏳ Chargement du classement des invitations...'
        )
      ],
      flags:
        MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2
    });

  } else {

    await interaction.deferUpdate();

  }

  try {
  await interaction.guild.members.fetch();
} catch (err) {
  console.error(
    '❌ Chargement des membres impossible :',
    err
  );

  return simpleEditReply(
    interaction,
    '❌ Impossible de charger le classement des invitations.'
  );
}

  const invitesData =
    await getAllInvites();

  const container =
    buildInvitationsLeaderboardContainer({
      invitesData,
      guildMembersCache:
        interaction.guild.members.cache
    });

return interaction.editReply({
  components: [container],
  files: [
    {
      attachment: path.join(
        __dirname,
        'assets',
        'images',
        'leaderboard-icon.png'
      ),
      name: 'leaderboard-icon.png'
    }
  ]
});
}

if (
  interaction.customId === 'leaderboard_open' ||
  interaction.customId?.startsWith('leaderboard_page_')
) {
  const isOpen =
    interaction.customId === 'leaderboard_open';

  if (isOpen) {
    await interaction.reply({
      components: [
        buildSimpleContainer(
          '⏳ Chargement du classement...'
        )
      ],
      flags:
        MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2
    });
  } else {
    await interaction.deferUpdate();
  }

  const page = isOpen
    ? 0
    : parseInt(
        interaction.customId.replace(
          'leaderboard_page_',
          ''
        ),
        10
      );

  if (isNaN(page) || page < 0) return;

  const guild = interaction.guild;

  const invitesData = await getAllInvites();
  const totalInvitesPerMember = {};

  for (const inviterId in invitesData) {
    totalInvitesPerMember[inviterId] =
      invitesData[inviterId].invites || 0;
  }

  const pointsData = await getAllPoints();

  const sorted = sortLeaderboardPlayers(
    pointsData,
    totalInvitesPerMember,
    guild.members.cache
  );

  const playerCount = Object.entries(pointsData)
    .filter(([id, data]) =>
      (data.games || 0) > 0
    )
    .length;

  await fetchLeaderboardPageMembers(guild, sorted, page);

  const container = buildLeaderboardContainer({
    sorted,
    totalInvitesPerMember,
    guildMembersCache: guild.members.cache,
    playerCount,
    page,
    ephemeralPagination: true
  });

return interaction.editReply({
  components: [container],

  ...(isOpen
    ? {
        files: [
          {
            attachment: path.join(
              __dirname,
              'assets',
              'images',
              'leaderboard-icon.png'
            ),
            name: 'leaderboard-icon.png'
          }
        ]
      }
    : {}),

  allowedMentions: {
    parse: []
  }
});
}



if (interaction.customId === 'rank_up') {
  const currentRank = getMemberRankKey(interaction.member);

  if (!currentRank) {
  return simpleReply(
    interaction,
    '❌ Aucun rang actuel détecté'
  );
}

  const currentIndex = RANK_UP_ORDER.indexOf(currentRank);

  const availableRanks = RANK_UP_ORDER
  .slice(currentIndex + 1)
  .reverse();

  if (!availableRanks.length) {
  return simpleReply(
    interaction,
    '👑 Tu es déjà au rang maximum : **Radiant**'
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
`-# Sélectionne ton nouveau peak rank`
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
      '❌ Tu es déjà Organisateur de parties'
    );
  }

  const organizerInfoContainer = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)

  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## <:EMOJI_ORGA:1493046347337699499> DEVENIR ORGANISATEUR — VALORANT PP\n` +
      `-# Crée, lance et encadre les parties personnalisées du serveur`
    )
  )

  .addSeparatorComponents(
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
  )

  .addTextDisplayComponents(
  new TextDisplayBuilder().setContent(
    `## <:EMOJI_ROLE:1493378253446975619> TON RÔLE\n` +
    `-# Créer des PP lorsque des joueurs sont disponibles\n` +
    `-# Envoyer un message dans <#734895135019761733> pour trouver des joueurs\n` +
    `-# Lancer l'équilibrage intelligent <@1461409614108168425>\n` +
    `-# Vérifier les réglages de la partie (Map, Win by two, Replay activé) ainsi que les équipes\n` +
    `-# Lancer la partie\n` +
    `-# Enfin, sélectionner l'équipe gagnante à la fin de la partie, pour l'attribution des points`
  )
)

  .addSeparatorComponents(
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
  )

  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## <:EMOJI_PP:1466470377327825028> CRÉER UNE PARTIE\n` +
      `-# Dans le salon <#1461346832591360173>, utilise \`/pp\`, renseigne le code de groupe et <@1461409614108168425> s'occupe du reste`
    )
  )

  .addSeparatorComponents(
    new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
  )

  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## <:EMOJI_CHECK:1493378334326001816> PROFIL RECHERCHÉ\n` +
      `-# Être **actif, fiable et disponible**\n` +
      `-# Être à l'aise pour encadrer une PP\n` +
      `-# Chaque candidature sera examinée par l'équipe`
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
          '❌ Tu es déjà Organisateur de parties'
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

    const avatar = await getPermanentAvatar(
  interaction.user
);

  const applicationContainer = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## ${BADGES.ORGANIZER} CANDIDATURE ORGANISATEUR DE PARTIES\n` +
`-# **${interaction.user.tag}** (<@${interaction.user.id}>)\n` +
`-# Souhaite devenir **Organisateur de parties**`
          )
        )

        .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
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
  ...(avatar.file ? { files: [avatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});

  return interaction.update({
    components: [
      buildSimpleContainer(
        '✅ Ta candidature a été envoyée'
      )
    ]
  });
}


// ── ANNULER LA CANDIDATURE ORGANISATEUR ──
if (interaction.customId === 'organizer_apply_cancel') {
  return interaction.update({
    components: [
      buildSimpleContainer(
        '❌ Candidature annulée'
      )
    ]
  });
}

if (
  interaction.customId?.startsWith('organizer_accept_') ||
  interaction.customId?.startsWith('organizer_refuse_')
) {
  if (interaction.user.id !== BOT_OWNER_ID) {
    return simpleReply(
      interaction,
      '❌ Seul le propriétaire peut traiter cette candidature'
    );
  }

  const accepted =
    interaction.customId?.startsWith('organizer_accept_');

  const userId = interaction.customId
    .replace('organizer_accept_', '')
    .replace('organizer_refuse_', '');

  const member = await interaction.guild.members
    .fetch(userId)
    .catch(() => null);

  if (!member) {
    return simpleReply(
      interaction,
      '❌ Membre introuvable'
    );
  }

  if (accepted) {
    await member.roles.add(
      ORGANIZER_ROLE_ID,
      'Candidature Organisateur acceptée'
    );
  }

  const resultContainer = new ContainerBuilder()
    .setAccentColor(0x242429)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            accepted
              ? `## ${BADGES.ORGANIZER} CANDIDATURE ACCEPTÉE\n` +
                `-# **${member.user.tag}** (<@${member.id}>)\n` +
                `-# Est désormais **Organisateur de parties**`
              : `## ${BADGES.ORGANIZER} CANDIDATURE REFUSÉE\n` +
                `-# **${member.user.tag}** (<@${member.id}>)\n` +
                `-# Sa candidature au rôle **Organisateur de parties** a été refusée`
          )
        )
       .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    `attachment://avatar-${member.id}.png`
  )
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




if (
  interaction.isButton() &&
  interaction.customId.startsWith('open_referral_ticket_')
) {
  const slug = interaction.customId.replace(
    'open_referral_ticket_', ''
  );

  const offer = REFERRAL_OFFERS[`┃${slug}`];

  if (!offer) {
    return interaction.reply({
      content: '❌ Cette fiche n’est plus disponible.',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  try {
    const guild = interaction.guild;
    const member = await guild.members.fetch(
      interaction.user.id
    );

    const category = await guild.channels
      .fetch('1569390219063463986')
      .catch(() => null);

    if (
      !category ||
      category.type !== ChannelType.GuildCategory
    ) {
      return interaction.editReply({
        content: '❌ Catégorie des tickets introuvable.'
      });
    }

    const staffRole = guild.roles.cache.find(
      role => role.name === 'Administrateur'
    );

    if (!staffRole) {
      return interaction.editReply({
        content: '❌ Rôle Administrateur introuvable.'
      });
    }

    await guild.channels.fetch();

    // Un seul ticket ouvert par membre.
    const existing = guild.channels.cache.find(ch =>
      ch.parentId === category.id &&
      ch.type === ChannelType.GuildText &&
      ch.permissionOverwrites.cache.has(member.id) &&
      (
        ch.name.startsWith('┃ticket-') ||
        Object.keys(REFERRAL_OFFERS).some(name =>
          ch.name.startsWith(`${name}-`)
        )
      )
    );

    if (existing) {
      return interaction.editReply({
        content:
          `❌ Tu as déjà un ticket ouvert : <#${existing.id}>`
      });
    }

    const username = member.user.username
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 35) || member.id;

    // Discord limite les noms de salons à 100 caractères.
    const ticketName =
      `┃${slug}-${username}`.slice(0, 100);

    const ticketChannel = await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: category.id,
      topic:
        `${offer.category === 'aides' ? 'Aide' : 'Parrainage'} ` +
        `${offer.title} | Membre : ${member.id}`,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [
            PermissionsBitField.Flags.ViewChannel
          ]
        },
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

    
const enseigneEmoji = getReferralEmoji(guild, offer);

const container = new ContainerBuilder()
  .setAccentColor(EMBED_COLOR)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `# ${enseigneEmoji}TICKET ${offer.title}\n` +
          `-# Ouvert par <@${member.id}>`
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
      .setSpacing(SeparatorSpacingSize.Small)
  )
  .addActionRowComponents(
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`close_ticket_${member.id}`)
        .setLabel('Clôturer la discussion')
        .setStyle(ButtonStyle.Secondary)
    )
  );


    await ticketChannel.send({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [] }
    });

    return interaction.editReply({
      content:
        `✅ Ton ticket ${offer.title} a été créé : ` +
        `<#${ticketChannel.id}>`
    });

  } catch (error) {
    console.error(
      `❌ Ticket ${offer.title} :`,
      error
    );

    return interaction.editReply({
      content:
        '❌ Impossible de créer le ticket. Réessaie plus tard.'
    });
  }
}


      if (interaction.customId === 'open_ticket') {
        const modal = new ModalBuilder().setCustomId('ticket_reason_modal').setTitle('Ouvrir un ticket');
        const reasonInput = new TextInputBuilder()
  .setCustomId('ticket_reason')
  .setLabel('Objet du ticket')
  .setPlaceholder('Signalement, rank-up, question…')
  .setStyle(TextInputStyle.Short)
  .setRequired(false);
        modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
        return interaction.showModal(modal);
      }

      if (interaction.customId?.startsWith('close_ticket_')) {
  const ticketOwnerId = interaction.customId.replace('close_ticket_', '');

const staffRole = interaction.guild.roles.cache.find(
  r => r.name === 'Administrateur'
);

const isBotOwner = interaction.user.id === BOT_OWNER_ID;

const isAdministrator =
  staffRole &&
  interaction.member.roles.cache.has(staffRole.id);

if (!isBotOwner && !isAdministrator) {
  return simpleReply(
    interaction,
    '❌ Seule l’équipe peut clôturer ce ticket'
  );
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

  
  const configFile = path.join(__dirname, 'data', 'config.json');

  let moderationCategoryId = null;

  if (fs.existsSync(configFile)) {
    const config = JSON.parse(
      fs.readFileSync(configFile, 'utf8')
    );
    moderationCategoryId = config.ticketCategoryId;
  }

  const referralCategoryId = '1569390219063463986';

  const isReferralTicket =
    ch.parentId === referralCategoryId &&
    ch.name.startsWith('┃') &&
    ch.topic?.includes(`Membre : ${ticketOwnerId}`);

  const isModerationTicket =
    ch.parentId === moderationCategoryId &&
    ch.name.startsWith('┃ticket-') &&
    ch.permissionOverwrites.cache.has(ticketOwnerId);

  if (!isReferralTicket && !isModerationTicket) {
    return interaction.editReply({
      content: '❌ Ce salon ne correspond pas à un ticket valide.'
    });
  }

  try {
    await ch.delete(
      `Ticket clôturé par ${interaction.user.username}`
    );
  } catch (error) {
    console.error('❌ Erreur clôture ticket :', error);

    return interaction.editReply({
      content: '❌ Impossible de clôturer ce ticket.'
    });
  }

  return;

}



      if (interaction.customId?.startsWith('manage_add_') || interaction.customId?.startsWith('manage_remove_')) {
        const isAdd = interaction.customId?.startsWith('manage_add_');
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

      if (interaction.customId?.startsWith('manage_reset_')) {
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
        if (!member.voice.channelId) {
  throw new Error(
    `Le membre ${member.id} n'est connecté à aucun vocal.`
  );
}

await member.voice.setChannel(vc);
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

    if (
  interaction.isChatInputCommand() &&
  interaction.commandName === 'closemonth'
) {
  if (
    !interaction.memberPermissions?.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return simpleReply(
      interaction,
      '❌ Commande réservée aux administrateurs.'
    );
  }

  if (
    interaction.options.getString('confirmation') !== 'CONFIRMER'
  ) {
    return simpleReply(
      interaction,
      '❌ Écris exactement CONFIRMER.'
    );
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  try {
    const guild = interaction.guild;

    if (!guild) {
      return interaction.editReply(
        '❌ Serveur introuvable.'
      );
    }

    const data = await getConfigValue(
      'leaderboardData',
      {}
    );

    const currentMonth = getParisMonthKey();

    if (!data.monthKey) {
      return interaction.editReply(
        '❌ Aucun mois associé au leaderboard.'
      );
    }

    if (data.monthKey >= currentMonth) {
      return interaction.editReply(
        'ℹ️ Aucune clôture en retard.'
      );
    }

    const closingMonth = data.monthKey;

    // Sauvegarder les données avant toute annonce.
    const snapshot = await saveMonthlySnapshot(
      guild,
      closingMonth
    );

    if (!snapshot) {
      throw new Error('Snapshot introuvable');
    }

    // Publier les gagnants manquants.
    await announceMonthlyWinners(
      guild,
      closingMonth
    );

    // Vérifier que les annonces sont terminées.
    const announcedMonth = await getConfigValue(
      'monthlyWinnersLastAnnouncement',
      null
    );

    if (announcedMonth !== closingMonth) {
      return interaction.editReply(
        '⚠️ Clôture incomplète. ' +
        'Les statistiques sont conservées. ' +
        'Vérifie les logs avant de réessayer.'
      );
    }

    // Créer le classement du nouveau mois.
    await checkMonthlyLeaderboardRollover(guild);

    const updatedData = await getConfigValue(
      'leaderboardData',
      {}
    );

    if (updatedData.monthKey !== currentMonth) {
      return interaction.editReply(
        '⚠️ Gagnants annoncés, mais création ' +
        'du nouveau classement non confirmée. ' +
        'Vérifie les logs.'
      );
    }

    return interaction.editReply(
      `✅ Clôture de ${closingMonth} terminée.\n` +
      `🏆 Annonces traitées.\n` +
      `📊 Leaderboard ${currentMonth} initialisé.`
    );

  } catch (err) {
    console.error('❌ Erreur closemonth :', err);

    return interaction.editReply(
      '❌ Erreur pendant la clôture. ' +
      'Vérifie les logs avant de relancer.'
    );
  }
}

    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === 'resetseason'
    ) {
      if (
        !interaction.memberPermissions?.has(
          PermissionFlagsBits.Administrator
        )
      ) {
        return simpleReply(
          interaction,
          '❌ Commande réservée aux administrateurs.'
        );
      }
      if (
        interaction.options.getString('confirmation') !== 'CONFIRMER'
      ) {
        return simpleReply(
          interaction,
          '❌ Réinitialisation annulée. Écris exactement CONFIRMER.'
        );
      }
      await interaction.deferReply({
  flags:
    MessageFlags.Ephemeral |
    MessageFlags.IsComponentsV2
});

      try {
        const result = await withPointsLock(async () => {
        const backupKey = `manualResetBackup_${Date.now()}`;

const playersBackup = await Points.find({}).lean();

await setConfigValue(backupKey, {
  createdAt: new Date().toISOString(),
  players: playersBackup.map(player => ({
    userId: player.userId,
    rr: player.rr ?? 0,
    games: player.games ?? 0,
    wins: player.wins ?? 0,
    timeouts: player.timeouts ?? 0
  }))
});

const savedBackup = await getConfigValue(backupKey);

if (
  !savedBackup ||
  !Array.isArray(savedBackup.players) ||
  savedBackup.players.length !== playersBackup.length
) {
  throw new Error('Sauvegarde non vérifiée : reset annulé');
}

const result = await Points.updateMany(
  {},
  {
    $set: {
      rr: 0,
      games: 0,
      wins: 0,
      timeouts: 0
    }
  }
);

console.log(`💾 Sauvegarde du reset : ${backupKey}`);

const leaderboardData =
  await getConfigValue('leaderboardData', {});


await setConfigValue('leaderboardData', {
  ...leaderboardData,
  monthKey: getParisMonthKey()
});

return result;
});

await updateleaderboardEmbed();


        return simpleEditReply(
  interaction,
  `✅ Nouvelle saison initialisée\n` +
`Joueurs réinitialisés : **${result.modifiedCount ?? 0}**`
);
      } catch (err) {
        console.error('Erreur resetseason :', err);
        return simpleEditReply(
  interaction,
  '❌ Impossible de réinitialiser la saison'
);
      }
    }

    // ── RELANCE : demander un NOUVEAU code, sans réutiliser l'ancien ──
if (interaction.isButton() && interaction.customId === 'pp_relaunch') {
  const authorized = interaction.user.id === BOT_OWNER_ID ||
    interaction.member?.roles?.cache?.has(ORGANIZER_ROLE_ID);
  if (!authorized) return simpleReply(interaction, '⛔ Seuls les organisateurs peuvent relancer une partie.');
  return interaction.showModal(
    new ModalBuilder()
      .setCustomId('pp_relaunch_modal')
      .setTitle('Relancer une partie')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('valorant_code')
            .setLabel('Nouveau code de groupe Valorant')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMinLength(6)
            .setMaxLength(6)
        )
      )
  );
}

    // ── MODAL SUBMIT ──
if (
  interaction.isModalSubmit() &&
  (interaction.customId === 'pp_create_modal' || interaction.customId === 'pp_relaunch_modal')
) {
  const isRelaunch = interaction.customId === 'pp_relaunch_modal';
  if (isRelaunch) {
    const authorized = interaction.user.id === BOT_OWNER_ID ||
      interaction.member?.roles?.cache?.has(ORGANIZER_ROLE_ID);
    if (!authorized) return simpleReply(interaction, '⛔ Seuls les organisateurs peuvent relancer une partie.');
  }

  if (interaction.replied || interaction.deferred) return;

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
  });

  const valorantCode = interaction.fields.getTextInputValue('valorant_code').trim();
  if (valorantCode.length !== 6) {
    return simpleEditReply(interaction, '❌ Le code de groupe doit contenir 6 caractères.');
  }

const verifiedRole = interaction.guild.roles.cache.get(
  ROLE_VERIFIE
);

  if (!verifiedRole) {
  return simpleEditReply(
    interaction,
    "⚠️ Le rôle Vérifié n'existe pas"
  );
}

  // Empêche deux créations simultanées par le même organisateur.
  const creationKey = `${interaction.guildId}:${interaction.user.id}`;
  if (ppCreationLocks.has(creationKey)) {
    return simpleEditReply(interaction, '⏳ Une création de partie est déjà en cours.');
  }
  ppCreationLocks.add(creationKey);
  let createdCategory = null;
  let createdMessage = null;
  let gamePersisted = false;
  try {
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

      createdCategory = category;

      const communityCategory = interaction.guild.channels.cache.get(COMMUNITY_CATEGORY_ID)
        || await interaction.guild.channels.fetch(COMMUNITY_CATEGORY_ID).catch(() => null);

      if (communityCategory) {
        await category.setPosition(communityCategory.position + 1).catch(console.error);
      }

      const waitingVC = await interaction.guild.channels.create({
        name: `┃préparation`,
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

      if (!Array.isArray(maps) || maps.length === 0) {
  return simpleEditReply(
    interaction,
    '❌ Impossible de créer la partie : aucune map configurée.'
  );
}

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
  files: [{
    attachment: `./assets/maps/${map.image}`,
    name: map.image
  }],
  flags: MessageFlags.IsComponentsV2
});

      createdMessage = msg;

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

// Enregistrer immédiatement avant toute opération lente ou événement vocal.
await saveGame(newGame);
await setConfigValue(`ppTest_${newGame.id}`, TEST_MODE);
gamePersisted = true;
gamesData.games.push(newGame);

// Un membre peut déjà être dans le salon : ne charger que ses occupants.
newGame.players = [...waitingVC.members.values()]
  .filter(member => !member.user.bot)
  .slice(0, 10)
  .map(member => member.id);

if (newGame.players.length) {
  await saveGame(newGame);
}

// Répondre à /pp avant la mise à jour cosmétique du container.
await simpleEditReply(interaction, '✅ Partie créée.');
updateRegistrationEmbed(interaction.guild, newGame).catch(err =>
  console.error('Erreur mise à jour annonce PP :', err)
);
return;
  } catch (err) {
    console.error('Erreur création PP :', err);
    if (!gamePersisted) {
      // Ne laisser ni annonce orpheline ni catégorie vide après un échec.
      if (createdMessage) await createdMessage.delete().catch(() => {});
      if (createdCategory) {
        const children = interaction.guild.channels.cache.filter(ch => ch.parentId === createdCategory.id);
        for (const child of children.values()) await child.delete().catch(() => {});
        await createdCategory.delete().catch(() => {});
      }
    }
    if (interaction.deferred && !interaction.replied) {
      await simpleEditReply(interaction, '❌ Création impossible. Vérifie les logs du bot.').catch(() => {});
    }
    return;
  } finally {
    ppCreationLocks.delete(creationKey);
  }
    }

// ── SELECT MENU OBSERVER ──
if (
  interaction.isStringSelectMenu() &&
  interaction.customId?.startsWith('spectate_select_')
) {

  await interaction.deferUpdate();

  if (!isVerified) {
    return simpleEditReply(
      interaction,
      '⛔ Seuls les Vérifiés peuvent observer.'
    );
  }

  if (!game) {
    return simpleEditReply(
      interaction,
      "❌ Cette partie n'existe plus."
    );
  }


    const isPlayerInGame =
    game.players?.includes(interaction.user.id) ||
    game.attackers?.some(p => p.id === interaction.user.id) ||
    game.defenders?.some(p => p.id === interaction.user.id);

  if (isPlayerInGame) {
    return simpleEditReply(
      interaction,
      '⛔ Tu participes à cette partie : impossible de passer spectateur.'
    );
  }

  const choice = interaction.values[0];
  if (!['attack', 'defense'].includes(choice)) {
  return simpleEditReply(
    interaction,
    '❌ Choix de spectateur invalide.'
  );
}

  const att =
    interaction.guild.channels.cache.get(game.attVC);

  const def =
    interaction.guild.channels.cache.get(game.defVC);

  const vc =
    choice === 'attack' ? att : def;

  if (!vc) {
    return simpleEditReply(
      interaction,
      '❌ Aucun salon disponible'
    );
  }

if (!game.spectators) {
  game.spectators = {};
}

// Le spectateur doit être enregistré AVANT le déplacement vocal.
game.spectators[interaction.user.id] = choice;

await markAsSpectator(interaction.member);

try {
  await moveVerifiedToVC(interaction.member, vc);
} catch (err) {
  delete game.spectators[interaction.user.id];

  await restoreSpectatorNickname(interaction.member);

  console.error(
    `❌ Déplacement spectateur impossible : ${interaction.user.id}`,
    err
  );

  return simpleEditReply(
    interaction,
    '❌ Impossible de rejoindre le vocal spectateur.'
  );
}

game.spectators[
  interaction.user.id
] = choice;

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
if (game.attackers?.length || game.defenders?.length) {
  return simpleReply(
    interaction,
    '⛔ Cette partie a déjà commencé. Inscriptions fermées.'
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

try {
  await interaction.member.voice.setChannel(prepVC);
} catch (err) {
  console.error(
    `❌ Impossible de déplacer ${interaction.user.id} :`,
    err
  );

  return simpleReply(
    interaction,
    '❌ Impossible de rejoindre le vocal de préparation.'
  );
}

return simpleReply(
  interaction,
  '✅ Tu as rejoint le vocal de préparation.'
);
}

        case 'change_map': {
          if (!game) {
if (game.attackers?.length || game.defenders?.length) {
  return simpleReply(
    interaction,
    '⛔ La partie est déjà lancée. Impossible de changer la map.'
  );
}
  return simpleReply(
    interaction,
    "❌ Cette partie n'existe plus."
  );
}

          const voterId = interaction.user.id;
          if (!game.players.includes(voterId)) {
  return simpleReply(
    interaction,
    '⛔ Tu dois participer à cette partie pour voter.'
  );
}
          if (!game.players.includes(voterId)) {
  return simpleReply(
    interaction,
    '⛔ Seuls les joueurs inscrits peuvent voter pour changer la map.'
  );
}
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
            if (!Array.isArray(maps) || maps.length === 0) {
  return simpleReply(
    interaction,
    '❌ Aucune map disponible dans la configuration.'
  );
}

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
  console.warn(
    `⚠️ Salon d'attente introuvable lors de l'annulation de ${game.id}`
  );
}
          

          if (game.players?.length) {
            await Promise.all(game.players.map(async (id) => {
              const member = interaction.guild.members.cache.get(id) || null;
              if (member?.voice?.channel) {
  await member.voice.setChannel(lobbyVC || null)
    .catch(err => {
      console.error(
        `❌ Déplacement impossible pour ${member.id} :`,
        err
      );
    });
}
            }));
          }

          if (game.spectators) {
            await Promise.all(Object.keys(game.spectators).map(async (id) => {
              const member = interaction.guild.members.cache.get(id) || null;
              if (member?.voice?.channel) {
  await member.voice.setChannel(lobbyVC || null)
    .catch(err => {
      console.error(
        `❌ Déplacement impossible pour ${member.id} :`,
        err
      );
    });
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
          if (!game) {
  return simpleReply(
    interaction,
    "❌ Cette partie n'existe plus."
  );
}

if (game.attackers?.length || game.defenders?.length) {
  return simpleReply(
    interaction,
    '⛔ Les équipes de cette partie ont déjà été créées.'
  );
}

          if (game.attackers?.length || game.defenders?.length) {
  return simpleReply(
    interaction,
    '⛔ Cette partie a déjà été lancée.'
  );
}
  await simpleReply(
    interaction,
    '⏳ Lancement de la partie...'
  );

          const verifiedRole =
  interaction.guild.roles.cache.get(ROLE_VERIFIE);
          if (!verifiedRole) {
  return simpleEditReply(
    interaction,
    '⚠️ Rôle Vérifié introuvable.'
  );
}

          if (!TEST_MODE && game.players.length !== 10) {
  return simpleEditReply(
    interaction,
    `❌ La partie doit obligatoirement être lancée en **5v5**\n` +
`Actuellement : **${game.players.length}/10 joueurs**`
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

  players = [...players].sort(
  (a, b) => b.rankValue - a.rankValue
);

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
  ? Math.max(
      0,
      ...member.roles.cache.map(
        role => RANK_VALUES_BY_ID[role.id] || 0
      )
    )
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

                   // Déplacement progressif des joueurs et spectateurs
          const membersToMove = new Map();

          for (const p of game.attackers) {
            membersToMove.set(p.id, attVC);
          }

          for (const p of game.defenders) {
            membersToMove.set(p.id, defVC);
          }

          if (game.spectators) {
            for (const [id, choice] of Object.entries(game.spectators)) {
              if (!membersToMove.has(id)) {
                membersToMove.set(
                  id,
                  choice === 'attack' ? attVC : defVC
                );
              }
            }
          }

          // Déplacement séquentiel : vérifie le salon réel et retente une fois
          // en cas d'échec Discord, sans modifier les équipes calculées.
          async function movePPMember(member, destination) {
            if (!member?.voice?.channelId || !destination) return false;
            for (let attempt = 0; attempt < 2; attempt++) {
              try {
                if (member.voice.channelId === destination.id) return true;
                await member.voice.setChannel(destination, 'Répartition vocale PP');
                const refreshed = await interaction.guild.members.fetch({ user: member.id, force: true });
                if (refreshed.voice.channelId === destination.id) return true;
              } catch (err) {
                if (attempt === 1) console.error(`❌ Déplacement vocal PP ${member.id} :`, err);
              }
            }
            return false;
          }

          for (const [id, destination] of membersToMove) {
            try {
              const member =
                interaction.guild.members.cache.get(id) ||
                await interaction.guild.members.fetch(id).catch(() => null);

              if (!member?.voice?.channelId) continue;
              if (member.voice.channelId === destination.id) continue;

              await movePPMember(member, destination);

            } catch (err) {
              console.error(
                `❌ Déplacement PP impossible pour ${id} :`,
                err
              );
            }
          }

          const prepVC = interaction.guild.channels.cache.get(game.waitingVC);

          if (prepVC) {
            // Récupère les membres encore présents
            const remainingMembers = [...prepVC.members.values()];

            // Nouvelle tentative de déplacement
            for (const member of remainingMembers) {
              const isAttacker = game.attackers.some(
                p => p.id === member.id
              );

              const isDefender = game.defenders.some(
                p => p.id === member.id
              );

              const spectatorChoice = game.spectators?.[member.id];

              const destination = isAttacker
                ? attVC
                : isDefender
                  ? defVC
                  : spectatorChoice === 'attack'
                    ? attVC
                    : spectatorChoice === 'defense'
                      ? defVC
                      : null;

              if (!destination) continue;

              try {
                await movePPMember(member, destination);
              } catch (err) {
                console.error(
                  `❌ Déplacement impossible pour ${member.id} :`,
                  err
                );
              }
            }

            // Actualise les états vocaux avant de supprimer le salon.
            await interaction.guild.members.fetch({ withPresences: false }).catch(() => {});
            // Ne supprime le vocal que lorsqu'il est vide
            const updatedPrepVC =
              await interaction.guild.channels.fetch(game.waitingVC)
                .catch(() => null);

            if (updatedPrepVC && updatedPrepVC.members.size === 0) {
              await updatedPrepVC.delete().catch(err =>
                console.error('Erreur suppression vocal préparation :', err)
              );
            }
          }

          const sortTeamByRank = (team) => {
            let data = [];
            for (const player of team) {
              const member = interaction.guild.members.cache.get(player.id) || null;
              if (!member) continue;
              const rankRole = member.roles.cache
  .filter(role => RANK_ORDER[role.name] !== undefined)
  .sort((a, b) => RANK_ORDER[a.name] - RANK_ORDER[b.name])
  .first();
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
  files: [{
    attachment: `./assets/maps/${game.mapImage}`,
    name: game.mapImage
  }],
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

          if (!game || !game.attVC || !game.defVC) {
  return simpleReply(
    interaction,
    "❌ Cette partie n'est plus disponible."
  );
}
  if (!interaction.member.roles.cache.has(ROLE_VERIFIE)) {
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
              console.warn("⚠️ Lobby principal introuvable : nettoyage sans déplacement.");
            }


            // Le statut test reste associé à cette partie même après un redémarrage.
            // Une ancienne partie créée en mode test est également reconnue tant
            // que TEST_MODE=true (utile pour annuler la partie bloquée).
            const isTestGame = TEST_MODE ||
              (await getConfigValue(`ppTest_${game.id}`, false)) === true;

            const attChannel = interaction.guild.channels.cache.get(game.attVC);
            const defChannel = interaction.guild.channels.cache.get(game.defVC);

            if (
  interaction.customId !== 'cancel_game' &&
  (!Array.isArray(game.attackers) ||
   !Array.isArray(game.defenders) ||
   (!isTestGame && (game.attackers.length !== 5 || game.defenders.length !== 5)))
) {
  console.error(
    `❌ Résultat refusé : équipes invalides pour ${game.id}`
  );
  return;
}

const attackers =
  (game.attackers || []).map(p => p.id);

const defenders =
  (game.defenders || []).map(p => p.id);

const allPlayers = [
  ...attackers,
  ...defenders
];

if (
  interaction.customId !== 'cancel_game' &&
  (new Set(allPlayers).size !== allPlayers.length ||
   (!isTestGame && allPlayers.length !== 10))
) {
  console.error(
    `❌ Résultat refusé : joueurs dupliqués pour ${game.id}`
  );
  return;
}

const membersToMove = new Map();

if (attChannel) {
  for (
    const [id, member]
    of attChannel.members
  ) {
    membersToMove.set(
      id,
      member
    );
  }
}

if (defChannel) {
  for (
    const [id, member]
    of defChannel.members
  ) {
    membersToMove.set(
      id,
      member
    );
  }
}

// Déplacements progressifs pour éviter les rafales
// de requêtes Discord et vérifier chaque transfert.
for (const member of membersToMove.values()) {
  try {
    if (
      member.voice.channelId === game.attVC ||
      member.voice.channelId === game.defVC
    ) {
      if (waitingVC) await member.voice.setChannel(waitingVC);
    }
  } catch (err) {
    console.error(
      `❌ Déplacement vocal impossible pour ${member.id} :`,
      err
    );
  }
}

// Deuxième passage : récupère les membres encore présents,
// y compris les spectateurs non répertoriés.
for (const channelId of [game.attVC, game.defVC, game.waitingVC]) {
  const channel =
    interaction.guild.channels.cache.get(channelId);

  if (!channel) continue;

  for (const member of channel.members.values()) {
    try {
      if (waitingVC) await member.voice.setChannel(waitingVC);
    } catch (err) {
      console.error(
        `❌ Membre resté dans ${channelId} : ${member.id}`,
        err
      );
    }
  }
}

   

if (interaction.customId === 'cancel_game') {
  // Annulation toujours possible, même en mode test avec un seul joueur.
  // Nettoie également le salon de préparation s'il existe encore.
  for (const id of [game.attVC, game.defVC, game.waitingVC]) {
    const ch = interaction.guild.channels.cache.get(id);
    if (!ch) continue;

    if (ch.members.size > 0) {
      console.warn(`⚠️ Vocal ${id} conservé : encore occupé.`);
      continue;
    }

    await ch.delete().catch(console.error);
  }

  if (game.categoryId) {
    const category = interaction.guild.channels.cache.get(game.categoryId);

    if (
      category &&
      !interaction.guild.channels.cache.some(
        ch => ch.parentId === category.id
      )
    ) {
      await category.delete().catch(console.error);
    }
  }

  gamesData.games = gamesData.games.filter(
    g => g.id !== game.id
  );

  await deleteGame(game.id);

if (game.manageMessageId) {
  const manageMsg = await interaction.channel.messages.fetch(game.manageMessageId).catch(() => null);
  if (manageMsg?.deletable) await manageMsg.delete().catch(() => {});
}

await setConfigValue(`ppTest_${game.id}`, false);
  await interaction.followUp({
    content: '✅ Partie annulée. Les salons vides ont été supprimés.',
    flags: MessageFlags.Ephemeral
  }).catch(console.error);
  break;
}

            const winningSide = interaction.customId === 'attack_win' ? 'attack' : 'defense';

const matchRR = {};
const pointsUpdates = [];

for (const playerId of allPlayers) {
  if (isTestGame) {
    matchRR[playerId] = 0;
    continue;
  }

  const member =
    interaction.guild.members.cache.get(playerId) ||
    await interaction.guild.members.fetch(playerId).catch(() => null);

  const isWinner =
    (winningSide === 'attack' && attackers.includes(playerId)) ||
    (winningSide === 'defense' && defenders.includes(playerId));

  const delta = getPlayerRRDelta(member, isWinner);

  pointsUpdates.push({
    userId: playerId,
    delta,
    isWinner
  });

  matchRR[playerId] = delta;
}

// Une seule opération collective pour tous les joueurs.
if (!isTestGame) {
  const pointsApplied = await applyMatchPoints(
    game.id,
    pointsUpdates
  );

  if (!pointsApplied) {
    console.warn(
      `⚠️ RR déjà attribués pour la partie ${game.id}`
    );
  }
}


if (!isTestGame) await updateleaderboardEmbed().catch(err =>
  console.error('Erreur update leaderboard après partie :', err)
);

// Supprime les vocaux Attaquants / Défenseurs puis la catégorie
for (const id of [game.attVC, game.defVC, game.waitingVC]) {
  const ch = interaction.guild.channels.cache.get(id);
  if (!ch) continue;

  // Ne jamais supprimer un salon s'il reste des membres.
  if (ch.members.size > 0) {
    console.warn(
      `⚠️ Salon ${id} conservé : ${ch.members.size} membre(s) encore présents.`
    );
    continue;
  }

  await ch.delete().catch(err =>
    console.error(`Erreur suppression salon ${id} :`, err)
  );
}

if (game.categoryId) {
  const category = interaction.guild.channels.cache.get(game.categoryId);

  if (category) {
    const hasRemainingChannels = interaction.guild.channels.cache.some(
      channel => channel.parentId === category.id
    );

    if (!hasRemainingChannels) {
      await category.delete().catch(err =>
        console.error('Erreur suppression catégorie PP :', err)
      );
    }
  }
}



  

            const formatResultPlayers = async (ids) => {
  const data = [];

  for (const id of ids) {
    const member =
      interaction.guild.members.cache.get(id) ||
      await interaction.guild.members.fetch(id).catch(() => null);

    if (!member) continue;

    const rankRole = member.roles?.cache
  ?.filter(role => RANK_ORDER[role.name] !== undefined)
  .sort((a, b) => RANK_ORDER[a.name] - RANK_ORDER[b.name])
  .first();

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


const finishedMessage = await interaction.channel.send({
  components: [resultContainer],
  files: [{
    attachment: `./assets/maps/${game.mapImage}`,
    name: game.mapImage
  }],
  flags: MessageFlags.IsComponentsV2
});

// Supprimer le panneau de gestion uniquement après
// la publication réussie du résultat Discord.
if (game.manageMessageId) {
  const manageMsg = await interaction.channel.messages.fetch(game.manageMessageId).catch(() => null);
  if (manageMsg?.deletable) await manageMsg.delete().catch(() => {});
}

gamesData.games = gamesData.games.filter(
  g => g.id !== game.id
);

await deleteGame(game.id);
await setConfigValue(`ppTest_${game.id}`, false);
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
      '❌ La clé doit être au format **AAAA-MM** — exemple : `2026-08`'
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
        new ButtonBuilder().setCustomId(`manage_reset_${targetUser.id}`).setLabel('🔄 Réinitialiser').setStyle(ButtonStyle.Secondary)
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
      `## PEAK RANK DÉFINI\n` +
`-# **${role?.name || selectedRank}** sélectionné\n` +
`-# Il ne te reste plus qu'à renseigner ton **pseudo VALORANT** pour terminer la vérification`
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
      `-# Clique sur le bouton ci-dessous puis renseigne ton **pseudo VALORANT**, sans le #TAG`
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

      await simpleReply(
  interaction,
  '⏳ Vérification en cours…'
);

await interaction.deleteReply().catch(() => {});

const thread = interaction.channel;

if (thread?.isThread?.()) {
  await thread.sendTyping();
  await new Promise(resolve => setTimeout(resolve, 700));
}

const verificationDoneContainer = new ContainerBuilder()
  .setAccentColor(0x242429)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ✅ VÉRIFICATION TERMINÉE\n` +
`-# Ton pseudo VALORANT a été défini sur **${pseudo}**\n` +
`-# Tes salons seront débloqués dans quelques secondes`
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
      `## ✅ ACCÈS DÉBLOQUÉ\n` +
`-# Bienvenue sur **VALORANT PP**, amuse-toi bien`
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
  files: [
    {
      attachment: path.join(__dirname, 'assets', 'images', 'leaderboard-icon.png'),
      name: 'leaderboard-icon.png'
    }
  ],
  flags: MessageFlags.IsComponentsV2
});

  await setConfigValue('leaderboardData', {
  messageId: msg.id,
  channelId: interaction.channel.id,
  monthKey: getParisMonthKey()
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
    if (interaction.isModalSubmit() && interaction.customId?.startsWith('manage_modal_')) {
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


const newRR = await withPointsLock(async () => {
  const currentStats = await getPlayerPoints(userId);

  if (type === 'add') {
    currentStats.rr += amount;
  } else if (type === 'remove') {
    currentStats.rr = Math.max(0, currentStats.rr - amount);
  } else {
    throw new Error('Type de modification RR invalide');
  }

  // Écriture directe : ne pas appeler setPlayerPoints()
  // car cette fonction possède déjà son propre verrou.
  await Points.updateOne(
    { userId },
    {
      $set: {
        rr: currentStats.rr,
        games: currentStats.games,
        wins: currentStats.wins,
        timeouts: currentStats.timeouts
      }
    },
    { upsert: true }
  );

  return currentStats.rr;
});

      await updateleaderboardEmbed();

      const actionText = type === 'add' ? 'ajouté' : 'retiré';

return simpleEditReply(
  interaction,
  `✅ ${amount} ʀʀ ${actionText} pour <@${userId}>. Nouveau total : **${newRR} ʀʀ**`
);
}

} catch (err) {
  console.error(err);
}
});



client.on('voiceStateUpdate', async (oldState, newState) => {
  const guild = newState.guild || oldState.guild;
  if (!guild) return;

  // Empêche un joueur de rejoindre le vocal adverse.
  if (
    newState.channelId &&
    oldState.channelId !== newState.channelId
  ) {
    const game = gamesData.games.find(g =>
      g.attVC === newState.channelId ||
      g.defVC === newState.channelId
    );

    if (game) {
      const userId = newState.id;

      const isAttacker = game.attackers?.some(
        p => p.id === userId
      );

      const isDefender = game.defenders?.some(
        p => p.id === userId
      );

      const isSpectator = Boolean(
  game.spectators &&
  Object.prototype.hasOwnProperty.call(
    game.spectators,
    userId
  )
);

const forbidden =
  (isAttacker && newState.channelId === game.defVC) ||
  (isDefender && newState.channelId === game.attVC) ||
  (!isAttacker && !isDefender && !isSpectator);

      if (forbidden) {
        const ownVC = guild.channels.cache.get(
          isAttacker ? game.attVC : game.defVC
        );

        await newState.member.voice
          .setChannel(ownVC || null)
          .catch(err =>
            console.error('Erreur anti-espionnage PP :', err)
          );

        return;
      }
    }
  }


  const spectatorGame =
  gamesData.games.find(game =>
    game.spectators?.[oldState.member.id] &&
    (
      oldState.channelId === game.attVC ||
      oldState.channelId === game.defVC
    )
  );

if (
  spectatorGame &&
  oldState.channelId !== newState.channelId &&
  newState.channelId !== spectatorGame.attVC &&
  newState.channelId !== spectatorGame.defVC
) {

  await restoreSpectatorNickname(
    oldState.member
  );

  delete spectatorGame.spectators[
    oldState.member.id
  ];

  saveGameDebounced(
    spectatorGame
  );
}

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
      affectedGame.players = affectedGame.players.filter(
  id => id !== oldState.member.id
);

affectedGame.changeMapVotes = (
  affectedGame.changeMapVotes || []
).filter(id => id !== oldState.member.id);

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


async function startMemberOnboarding(member) {
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
            `-# Pour débloquer l'accès au serveur, nous avons besoin de quelques informations\n` +
`-# Commence par sélectionner le **plus haut rank que tu as atteint sur VALORANT**`
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
  const cachedInvites = invitesCache.get(guild.id);

 const guildInvites = await guild.invites.fetch().catch(err => {
  console.error('❌ Invitations indisponibles :', err);
  return null;
});

if (!guildInvites) {
  console.warn(
    `⚠️ Invitation inconnue pour ${member.id}, accueil maintenu.`
  );
}

const newInvites = new Map();

  if (guildInvites) guildInvites.forEach(inv => {
    newInvites.set(inv.code, {
      code: inv.code,
      inviter: inv.inviter || null,
      uses: inv.uses,
      maxAge: inv.maxAge,
      temporary: inv.temporary
    });
  });

  
let usedInvite = null;


if (cachedInvites && guildInvites) {
  const changedInvites = [];

  for (const [code, invite] of newInvites.entries()) {
    const oldUses = cachedInvites.get(code)?.uses;

    if (oldUses === undefined) continue;

    const difference = (invite.uses ?? 0) - oldUses;

    if (difference > 0) {
      changedInvites.push({
        ...invite,
        difference
      });
    }
  }

  if (
    changedInvites.length === 1 &&
    changedInvites[0].difference === 1
  ) {
    usedInvite = changedInvites[0];
  } else if (changedInvites.length > 0) {
    console.warn(
      `⚠️ Attribution ambiguë pour ${member.id} :`,
      changedInvites.map(inv => ({
        code: inv.code,
        nouvellesUtilisations: inv.difference
      }))
    );
  }
}

// Actualisation après chaque récupération réussie.
if (guildInvites) {
  invitesCache.set(guild.id, newInvites);
}



let joinedViaVanity = false;

const previousVanityUses = vanityCache.get(guild.id);
const currentVanityUses = await fetchVanityUses(guild);

if (currentVanityUses !== null) {
  if (previousVanityUses !== undefined) {
    const vanityDifference =
      currentVanityUses - previousVanityUses;

    const classicInviteChanged =
      guildInvites && cachedInvites
        ? [...newInvites.entries()].some(([code, invite]) => {
            const previous = cachedInvites.get(code)?.uses;
            return previous !== undefined &&
              invite.uses > previous;
          })
        : false;

    if (
      vanityDifference === 1 &&
      !classicInviteChanged &&
      guildInvites &&
      cachedInvites
    ) {
      joinedViaVanity = true;
      usedInvite = null;

      console.log(
        `🔗 Arrivée probablement via discord.gg/valorant-pp : ${member.id}`
      );
    } else if (vanityDifference > 0) {
      usedInvite = null;

      console.warn(
        `⚠️ Plusieurs utilisations ou sources possibles pour ${member.id}`
      );
    }
  }

  vanityCache.set(guild.id, currentVanityUses);
}


  const accountAge = formatAccountAge(member.user.createdAt);

  const welcomeChannel =
  guild.channels.cache.get(WELCOME_CHANNEL_ID) ||
  await guild.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);


if (!welcomeChannel?.isTextBased()) {
  console.error(
    `❌ Salon système introuvable ou non textuel pour ${member.id}`
  );
  return;
}


let inviterText = '-# Provenance : **non déterminée**';

if (joinedViaVanity) {
  inviterText = '-# Invité via **discord.gg/valorant-pp**';
} else if (usedInvite?.inviter?.id) {
  const inviterName =
    usedInvite.inviter.displayName ||
    usedInvite.inviter.globalName ||
    usedInvite.inviter.username ||
    usedInvite.inviter.tag;

  inviterText = `-# Invité par **${inviterName}**`;
}

if (
  !usedInvite &&
  !joinedViaVanity &&
  inviterText === '-# Provenance : **non déterminée**' &&
  guild.features.includes('DISCOVERABLE')
) {
  inviterText = '-# Provenance : **Découverte de serveurs**';
}


const avatar = await getPermanentAvatar(member.user)
  .catch(err => {
    console.error('Erreur récupération avatar :', err);

    return {
      url: member.user.displayAvatarURL({
        extension: 'png',
        size: 256
      }),
      file: null
    };
  });


  const welcomeContainer = new ContainerBuilder()
    .setAccentColor(0x242429)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## <:Roles:1493046347337699499> NOUVEAU MEMBRE\n` +
`-# **${member.user.tag}** (<@${member.id}>)\n` +
`-# Compte Discord créé il y a **${accountAge}**\n` +
inviterText
          )
        )
        .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
    );

try {
  await welcomeChannel.send({
    components: [welcomeContainer],
    ...(avatar.file ? { files: [avatar.file] } : {}),
    flags: MessageFlags.IsComponentsV2
  });
} catch (err) {
  console.error(
    `❌ Message de bienvenue impossible pour ${member.id} :`,
    err
  );
}


if (usedInvite?.inviter?.id) {
  try {
    await incrementInvite(
      usedInvite.inviter.id,
      member.id
    );

    console.log(
      `✅ Invitation enregistrée : ${member.user.tag} ` +
      `via ${usedInvite.code}`
    );
  } catch (err) {
    console.error(
      `❌ Erreur comptage invitation pour ${member.id} :`,
      err
    );
  }
}

}


client.on('guildMemberAdd', async member => {
  console.log(`Nouveau membre détecté : ${member.displayName}`);

  try {
    await queueMemberJoin(member, processMemberJoin);
  } catch (err) {
    console.error(
      `❌ Erreur traitement arrivée ${member.id} :`,
      err
    );
  }
});

async function processMemberJoin(member) {


const accountAgeDays = Math.floor(
  (Date.now() - member.user.createdAt) / (1000 * 60 * 60 * 24)
);

const accountAgeText = formatAccountAge(member.user.createdAt);

if (accountAgeDays < MIN_ACCOUNT_AGE_DAYS) {
  const welcomeChannel =
    member.guild.channels.cache.get(WELCOME_CHANNEL_ID) ||
    await member.guild.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);

  if (welcomeChannel) {

    const avatar = await getPermanentAvatar(
  member.user
);

    const restrictedContainer = new ContainerBuilder()
      .setAccentColor(0x242429)

      .addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `## <:Roles:1493073492856406156> COMPTE RESTREINT\n` +
              `-# **${member.user.tag}** (<@${member.id}>)\n` +
              `-# Compte créé il y a seulement **${accountAgeText}**`
            )
          )
          .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
      )

      .addActionRowComponents(
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`restricted_allow_${member.id}`)
            .setLabel('Autoriser')
            .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
            .setCustomId(`restricted_ban_${member.id}`)
            .setLabel('Bannir')
            .setStyle(ButtonStyle.Danger)
        )
      );


    await welcomeChannel.send({
      components: [restrictedContainer],
      ...(avatar.file ? { files: [avatar.file] } : {}),
      flags: MessageFlags.IsComponentsV2
    }).catch(err => {
      console.error(
        `❌ Erreur annonce compte restreint ${member.id} :`,
        err
      );
    });
  }

  // Actualiser les compteurs même pour un compte restreint.
  try {
    const guild = member.guild;
    const latestInvites = await guild.invites.fetch();

    const updatedCache = new Map();

    latestInvites.forEach(inv => {
      updatedCache.set(inv.code, {
        code: inv.code,
        inviter: inv.inviter || null,
        uses: inv.uses ?? 0,
        maxAge: inv.maxAge,
        temporary: inv.temporary
      });
    });

    invitesCache.set(guild.id, updatedCache);

    console.log(
      `✅ Cache invitations actualisé après compte restreint : ${member.id}`
    );
  } catch (err) {
    console.error(
      `❌ Actualisation invitations impossible pour ${member.id} :`,
      err
    );
  }

  
  // Synchronisation du lien public après une arrivée restreinte.
  try {
    const latestVanityUses = await fetchVanityUses(member.guild);

    if (latestVanityUses === null) {
  vanityCache.delete(member.guild.id);
} else {
  vanityCache.set(member.guild.id, latestVanityUses);

      console.log(
        `🔗 Compteur vanity actualisé après arrivée restreinte : ${member.id}`
      );
    }
  } catch (err) {
    console.error(
      `❌ Synchronisation vanity impossible pour ${member.id} :`,
      err
    );
  }


  return;
}


try {
  await startMemberOnboarding(member);
} catch (err) {
  console.error(
    `❌ Erreur arrivée membre ${member.id} :`,
    err
  );
}

}

client.on('guildMemberRemove', async member => {
  try {
    console.log(
      `👋 Départ détecté : ${member.user.tag} (${member.id})`
    );

    // Petit délai pour laisser les Audit Logs Discord se mettre à jour
    await new Promise(resolve => setTimeout(resolve, 1000));

    let wasBanned = false;

    try {
      const logs = await member.guild.fetchAuditLogs({
        type: 22,
        limit: 5
      });

      const banEntry = logs.entries.find(entry =>
        entry.target?.id === member.id &&
        Date.now() - entry.createdTimestamp < 5000
      );

      wasBanned = Boolean(banEntry);

    } catch (err) {
      console.error(
        '❌ Erreur vérification ban lors du départ :',
        err
      );
    }

    // Le guildBanAdd possède déjà son propre message système.
    if (wasBanned) {
      console.log(
        `⛔ Départ ignoré car bannissement détecté : ${member.user.tag}`
      );
      return;
    }

    function formatServerDuration(joinedAt) {
  if (!joinedAt) return 'une durée inconnue';

  const diffMs = Date.now() - joinedAt.getTime();

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (totalMinutes < 60) {
    return `${Math.max(1, totalMinutes)} minute${totalMinutes > 1 ? 's' : ''}`;
  }

  if (totalHours < 24) {
    return `${totalHours} heure${totalHours > 1 ? 's' : ''}`;
  }

  if (totalDays < 30) {
    return `${totalDays} jour${totalDays > 1 ? 's' : ''}`;
  }

  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  if (years > 0) {
    if (months > 0) {
      return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
    }

    return `${years} an${years > 1 ? 's' : ''}`;
  }

  if (months > 0) {
    if (days > 0) {
      return `${months} mois et ${days} jour${days > 1 ? 's' : ''}`;
    }

    return `${months} mois`;
  }

  return `${totalDays} jours`;
}

    const serverDuration =
      formatServerDuration(member.joinedAt);

      const avatar = await getPermanentAvatar(
  member.user
);

    const leaveContainer = new ContainerBuilder()
      .setAccentColor(0x242429)
      .addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `## <:Roles:1493073492856406156> DÉPART DU SERVEUR\n` +
`-# **${member.user.tag}** (<@${member.id}>)\n` +
`-# A quitté le serveur après **${serverDuration}**`
            )
          )
          .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
      );

const sent = await sendActivityMessage(member.guild, {
  components: [leaveContainer],
  ...(avatar.file ? { files: [avatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});

    if (sent) {
      console.log(
        `✅ Message de départ envoyé : ${member.user.tag}`
      );
    } else {
      console.error(
        `❌ Impossible d'envoyer le message de départ : ${member.user.tag}`
      );
    }

  } catch (err) {
    console.error(
      '❌ Erreur guildMemberRemove :',
      err
    );
  }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  try {

    const hadOGRole =
  oldMember.roles.cache.has(OG_ROLE_ID);

const hasOGRole =
  newMember.roles.cache.has(OG_ROLE_ID);

if (!hadOGRole && hasOGRole) {

  const avatar = await getPermanentAvatar(
    newMember.user
  );

  const ogAddedContainer = new ContainerBuilder()
    .setAccentColor(EMBED_COLOR)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## ${BADGES.OG} NOUVEAU MEMBRE OG\n` +
            `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
            `-# A obtenu le statut **OG** en remerciement de sa présence depuis les débuts de **VALORANT PP**`
          )
        )

        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            avatar.url
          )
        )
    );

  await sendActivityMessage(newMember.guild, {
    components: [ogAddedContainer],
    ...(avatar.file ? { files: [avatar.file] } : {}),
    flags: MessageFlags.IsComponentsV2
  });
}

    const hadOrganizerRole =
  oldMember.roles.cache.has(ORGANIZER_ROLE_ID);

const hasOrganizerRole =
  newMember.roles.cache.has(ORGANIZER_ROLE_ID);

if (!hadOrganizerRole && hasOrganizerRole) {

  const avatar = await getPermanentAvatar(
    newMember.user
  );

  const organizerAddedContainer = new ContainerBuilder()
    .setAccentColor(0x242429)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## ${BADGES.ORGANIZER} NOUVEL ORGANISATEUR DE PARTIES\n` +
            `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
            `-# Est devenu **Organisateur de parties**`
          )
        )

        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            avatar.url
          )
        )
    );

  await sendActivityMessage(newMember.guild, {
    components: [organizerAddedContainer],
    ...(avatar.file ? { files: [avatar.file] } : {}),
    flags: MessageFlags.IsComponentsV2
  });
}

if (hadOrganizerRole && !hasOrganizerRole) {

  const avatar = await getPermanentAvatar(
    newMember.user
  );

  const organizerRemovedContainer = new ContainerBuilder()
    .setAccentColor(0x242429)

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## ${BADGES.ORGANIZER} RÔLE ORGANISATEUR RETIRÉ\n` +
            `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
            `-# N'est plus **Organisateur de parties**`
          )
        )

        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            avatar.url
          )
        )
    );

  await sendActivityMessage(newMember.guild, {
    components: [organizerRemovedContainer],
    ...(avatar.file ? { files: [avatar.file] } : {}),
    flags: MessageFlags.IsComponentsV2
  });
}


    const wasBooster = oldMember.roles.cache.has(BOOSTER_ROLE_ID);
    const isBooster = newMember.roles.cache.has(BOOSTER_ROLE_ID);

if (!wasBooster && isBooster) {

  const avatar = await getPermanentAvatar(
    newMember.user
  );

  const boostContainer = new ContainerBuilder()
    .setAccentColor(0x242429)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## <:Bonus20:1492125876437913641> NOUVEAU BOOST\n` +
            `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
            `-# A boosté le serveur et bénéficie désormais du **bonus associé**`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            avatar.url
          )
        )
    );

  await sendActivityMessage(newMember.guild, {
    components: [boostContainer],
    ...(avatar.file ? { files: [avatar.file] } : {}),
    flags: MessageFlags.IsComponentsV2
  });
}

if (wasBooster && !isBooster) {

  const avatar = await getPermanentAvatar(
    newMember.user
  );

  const boostExpiredContainer = new ContainerBuilder()
    .setAccentColor(0x242429)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## <:Bonus20:1543305540594045068> BOOST EXPIRÉ\n` +
            `-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
            `-# Ne booste plus le serveur et a perdu le **bonus associé**`
          )
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            avatar.url
          )
        )
    );

  await sendActivityMessage(newMember.guild, {
    components: [boostExpiredContainer],
    ...(avatar.file ? { files: [avatar.file] } : {}),
    flags: MessageFlags.IsComponentsV2
  });
}

    const oldTimeoutTs =
  oldMember.communicationDisabledUntilTimestamp ?? 0;

const newTimeoutTs =
  newMember.communicationDisabledUntilTimestamp ?? 0;

const now = Date.now();

const timeoutApplied =
  newTimeoutTs > now &&
  oldTimeoutTs <= now;

if (timeoutApplied) {
  await incrementPlayerTimeouts(newMember.id)
    .catch(err =>
      console.error('Erreur incrementPlayerTimeouts :', err)
    );

  await updateleaderboardEmbed()
    .catch(err =>
      console.error('Erreur update leaderboard après timeout :', err)
    );

  let reason = null;
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

  const moderatorMember = moderator
  ? newMember.guild.members.cache.get(moderator.id)
  : null;

const moderatorText = moderator
  ? `Appliquée par **${moderatorMember?.displayName || moderator.globalName || moderator.username}**`
  : 'Appliquée par **Administrateur inconnu**';


  const avatar = await getPermanentAvatar(
  newMember.user
);

const timeoutContainer = new ContainerBuilder()
  .setAccentColor(0x242429)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
  `## <:Roles:1493073492856406156> EXCLUSION TEMPORAIRE\n` +
`-# **${newMember.user.tag}** (<@${newMember.id}>)\n` +
`-# L'exclusion prendra fin <t:${endUnix}:R>\n` +
`-# ${moderatorText}${reason ? ` pour **${reason}**` : ' sans raison précisée'}`
)
      )
      .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
  );

await sendActivityMessage(newMember.guild, {
  components: [timeoutContainer],
  ...(avatar.file ? { files: [avatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});

} // fin timeoutApplied

} catch (err) {
  console.error('Erreur guildMemberUpdate activité :', err);
}
}); // fin guildMemberUpdate

client.on('voiceStateUpdate', async (oldState, newState) => {
  try {
    const member = newState.member || oldState.member;

    if (!member) return;

    const wasMuted = oldState.serverMute;
    const isMuted = newState.serverMute;

    const wasDeafened = oldState.serverDeaf;
    const isDeafened = newState.serverDeaf;


    // ─────────────────────────────────────────────
    // RÉCUPÉRATION DE L'ADMIN
    // ─────────────────────────────────────────────

    async function getVoiceModerator(changeKey) {
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
        const logs = await member.guild.fetchAuditLogs({
          type: 24,
          limit: 10
        });

        const entry = logs.entries.find(entry =>
          entry.target?.id === member.id &&
          Date.now() - entry.createdTimestamp < 15000 &&
          entry.changes?.some(change => change.key === changeKey)
        );

        return entry?.executor || null;

      } catch (err) {
        console.error('Erreur audit logs vocal :', err);
        return null;
      }
    }


    // ─────────────────────────────────────────────
    // MEMBRE RENDU MUET
    // ─────────────────────────────────────────────

    if (!wasMuted && isMuted) {

      const moderator = await getVoiceModerator('mute');

      const moderatorText = getModeratorName(member.guild, moderator);

      const avatar = await getPermanentAvatar(
  member.user
);


      const serverMuteContainer = new ContainerBuilder()
        .setAccentColor(0x242429)
        .addSectionComponents(
          new SectionBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `## <:Roles:1544460218669465833> MEMBRE RENDU MUET\n` +
`-# **${member.user.tag}** (<@${member.id}>)\n` +
`-# A été rendu muet sur le serveur\n` +
`-# Appliqué par ${moderatorText}`
              )
            )
            .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
        );


      await sendActivityMessage(member.guild, {
  components: [serverMuteContainer],
  ...(avatar.file ? { files: [avatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});
    }


    // ─────────────────────────────────────────────
    // MUTE SERVEUR RETIRÉ
    // ─────────────────────────────────────────────

    if (wasMuted && !isMuted) {

      const moderator = await getVoiceModerator('mute');

      const moderatorText = getModeratorName(member.guild, moderator);

      const avatar = await getPermanentAvatar(
  member.user
);


      const serverUnmuteContainer = new ContainerBuilder()
        .setAccentColor(0x242429)
        .addSectionComponents(
          new SectionBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `## <:Roles:1544460226693177435> MEMBRE DÉMUTÉ\n` +
`-# **${member.user.tag}** (<@${member.id}>)\n` +
`-# Le mute serveur a été retiré\n` +
`-# Retiré par ${moderatorText}`
              )
            )
            .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
        );


      await sendActivityMessage(member.guild, {
  components: [serverUnmuteContainer],
  ...(avatar.file ? { files: [avatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});
    }


    // ─────────────────────────────────────────────
    // MEMBRE MIS EN SOURDINE
    // ─────────────────────────────────────────────

    if (!wasDeafened && isDeafened) {

      const moderator = await getVoiceModerator('deaf');

      const moderatorText = getModeratorName(member.guild, moderator);

      const avatar = await getPermanentAvatar(
  member.user
);


      const serverDeafContainer = new ContainerBuilder()
        .setAccentColor(0x242429)
        .addSectionComponents(
          new SectionBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `## <:Roles:1544460207701364856> MEMBRE MIS EN SOURDINE\n` +
`-# **${member.user.tag}** (<@${member.id}>)\n` +
`-# A été mis en sourdine sur le serveur\n` +
`-# Appliquée par ${moderatorText}`
              )
            )
            .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
        );


      await sendActivityMessage(member.guild, {
  components: [serverDeafContainer],
  ...(avatar.file ? { files: [avatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});
    }


    // ─────────────────────────────────────────────
    // SOURDINE SERVEUR RETIRÉE
    // ─────────────────────────────────────────────

    if (wasDeafened && !isDeafened) {

      const moderator = await getVoiceModerator('deaf');

      const moderatorText = getModeratorName(member.guild, moderator);

      const avatar = await getPermanentAvatar(
  member.user
);


      const serverUndeafContainer = new ContainerBuilder()
        .setAccentColor(0x242429)
        .addSectionComponents(
          new SectionBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `## <:Roles:1544460236327354498> SOURDINE RETIRÉE\n` +
`-# **${member.user.tag}** (<@${member.id}>)\n` +
`-# La sourdine serveur a été retirée\n` +
`-# Retirée par ${moderatorText}`
              )
            )
            .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
        );


      await sendActivityMessage(member.guild, {
  components: [serverUndeafContainer],
  ...(avatar.file ? { files: [avatar.file] } : {}),
  flags: MessageFlags.IsComponentsV2
});
    }

  } catch (err) {
    console.error('Erreur voiceStateUpdate activité :', err);
  }
});


client.on('guildBanAdd', async (ban) => {
  try {
    const guild = ban.guild;
    const user = ban.user;

    let reason = null;
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

    const moderatorMember = moderator
  ? guild.members.cache.get(moderator.id)
  : null;

const moderatorText = moderator
  ? `Appliqué par **${moderatorMember?.displayName || moderator.globalName || moderator.username}**`
  : 'Appliqué par **Administrateur inconnu**';


  const avatar = await getPermanentAvatar(
  user
);


const banContainer = new ContainerBuilder()
  .setAccentColor(0x242429)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## <:Roles:1493073492856406156> BANNISSEMENT\n` +
`-# **${user.tag}** (<@${user.id}>)\n` +
`-# A été définitivement exclu du serveur\n` +
`-# ${moderatorText}${reason ? ` pour **${reason}**` : ' sans raison précisée'}`
        )
      )
      .setThumbnailAccessory(
  new ThumbnailBuilder().setURL(
    avatar.url
  )
)
  );

await sendActivityMessage(guild, {
  components: [banContainer],
  ...(avatar.file ? { files: [avatar.file] } : {}),
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
  .setAccentColor(0x242429)
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

client.on('messageDelete', async (message) => {
  try {
    if (message.channelId !== CLIPFARMING_CHANNEL_ID) {
      return;
    }

    const clips = await Clip.find({
      messageId: message.id
    });

    if (!clips.length) {
      return;
    }

    console.log(
      `🗑️ Suppression de ${clips.length} média(s) du clipfarming : ${message.id}`
    );

    for (const clip of clips) {
      if (!clip.botMessageId) continue;

      const channel =
        client.channels.cache.get(clip.channelId) ||
        await client.channels
          .fetch(clip.channelId)
          .catch(() => null);

      if (!channel?.isTextBased()) continue;

      const botMessage =
        await channel.messages
          .fetch(clip.botMessageId)
          .catch(() => null);

      if (botMessage?.deletable) {
        await botMessage
          .delete()
          .catch(() => {});
      }
    }

    await Clip.deleteMany({
      messageId: message.id
    });

    console.log(
      `✅ Média supprimé du classement Clips du mois`
    );

  } catch (err) {
    console.error(
      'Erreur suppression clip #clipfarming :',
      err
    );
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
  .setAccentColor(0x242429)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `## ⛔ SPAM DÉTECTÉ\n` +
`-# **${message.author.tag}** (<@${message.author.id}>)\n` +
`-# Exclu temporairement **${penalty.label}** pour spam dans <#${CLIPFARMING_CHANNEL_ID}>`
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

    const hasBlockedGif =
  messageContainsBlockedGif(message);

const hasSticker =
  message.stickers.size > 0;

const hasAttachment =
  message.attachments.size > 0;

const hasRealText =
  containsRealText(message.content);

const isEmojiOnly =
  message.content.trim().length > 0 &&
  !hasRealText &&
  !hasAttachment;


// GIFS + AUTOCOLLANTS
if (hasBlockedGif || hasSticker) {

  await new Promise(
    resolve => setTimeout(resolve, 1500)
  );

  await message.delete().catch(() => {});

  const blockedWarningContainer =
    new ContainerBuilder()
      .setAccentColor(0x242429)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${message.author}, contenu interdit dans ce salon.\n` +
          `-# Les **GIFs** et **autocollants** ne sont pas autorisés.`
        )
      );

  const warning =
    await message.channel.send({
      components: [
        blockedWarningContainer
      ],
      flags:
        MessageFlags.IsComponentsV2
    }).catch(() => null);

  if (warning) {
    setTimeout(
      () =>
        warning.delete().catch(() => {}),
      5000
    );
  }

  return;
}


// EMOJI SEUL
if (isEmojiOnly) {

  await new Promise(
    resolve => setTimeout(resolve, 1500)
  );

  await message.delete().catch(() => {});

  const emojiWarningContainer =
    new ContainerBuilder()
      .setAccentColor(0x242429)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${message.author}, ajoute du **texte** à ton message.\n` +
          `-# Les messages contenant uniquement des **emojis** ne sont pas autorisés.`
        )
      );

  const warning =
    await message.channel.send({
      components: [
        emojiWarningContainer
      ],
      flags:
        MessageFlags.IsComponentsV2
    }).catch(() => null);

  if (warning) {
    setTimeout(
      () =>
        warning.delete().catch(() => {}),
      5000
    );
  }

  return;
}


const medias = [
  ...message.attachments.values()
].filter(attachment => {

  const type =
    attachment.contentType || '';

  return (
    type.startsWith('video/') ||
    type.startsWith('image/')
  );
});

if (!medias.length) {
  return;
}

const monthKey =
  getParisMonthKey(
    message.createdAt
  );

for (
  let index = 0;
  index < medias.length;
  index++
) {

  const media = medias[index];

  const existingClip =
    await Clip.findOne({
      messageId: message.id,
      mediaIndex: index
    });

  if (existingClip) {
    continue;
  }

  const clip =
    await Clip.create({
      guildId: message.guild.id,
      channelId: message.channel.id,
      messageId: message.id,
      authorId: message.author.id,
      mediaIndex: index,
      mediaUrl: media.url,
      mediaType:
        media.contentType || 'unknown',
      monthKey
    });

  const clipMessage =
    await message.channel.send({
      components: [
        buildClipLikeContainer(clip)
      ],
      flags:
        MessageFlags.IsComponentsV2
    });

  clip.botMessageId =
    clipMessage.id;

  await clip.save();
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

client.on('shardReady', (id, unavailableGuilds) => {
  console.log(
    `✅ Shard ${id} ready` +
    `${unavailableGuilds?.size ? ` — ${unavailableGuilds.size} guild(s) indisponible(s)` : ''}`
  );
});

client.on('shardDisconnect', (event, id) => {
  console.error(
    `❌ Shard ${id} disconnected`,
    {
      code: event?.code,
      reason: event?.reason || 'Aucune raison',
      wasClean: event?.wasClean
    }
  );
});

client.on('shardError', (error, id) => {
  console.error(`❌ Shard ${id} error :`, error);
});

client.on('shardReconnecting', (id) => {
  console.warn(`🔄 Shard ${id} reconnecting...`);
});

client.on('shardResume', (id, replayedEvents) => {
  console.log(
    `♻️ Shard ${id} resumed — ${replayedEvents} événement(s) rejoué(s)`
  );
});

console.log("Tentative de connexion Discord...");

client.login(token)
  .then(() => console.log("✅ client.login réussi"))
  .catch((err) => console.error("❌ client.login échoué :", err));
