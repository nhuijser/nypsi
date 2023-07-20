import { ColorResolvable } from "discord.js";

const products = new Map<string, { name: string; cost: number }>();

products.set("platinum", { name: "platinum", cost: 7 });
products.set("gold", { name: "gold", cost: 3 });
products.set("silver", { name: "silver", cost: 2.5 });
products.set("bronze", { name: "bronze", cost: 1 });
products.set("dfcfa66092", { name: "basic_crate", cost: 1 });
products.set("595ba15808", { name: "69420_crate", cost: 0 });
products.set("5569964b90", { name: "nypsi_crate", cost: 3.99 });
products.set("1e62c44770", { name: "workers_crate", cost: 2.99 });
products.set("4b1d3a70b2", { name: "boosters_crate", cost: 2.99 });
products.set("4ec1ebe6b4", { name: "gem_crate", cost: 14.99 });
products.set("d18331a5bb", { name: "gem_shard", cost: 0 });

export default {
  redis: {
    cooldown: {
      AUCTION_WATCH: "cd:auctionwatch",
      GUILD_CREATE: "cd:guildcreate",
      ROB_RADIO: "cd:rob-radio",
      SEX_CHASTITY: "cd:sex-chastity",
      SUPPORT: "cd:support",
    },
    cache: {
      minecraft: {
        UUID: "cache:minecraft:uuid",
        NAME_HISTORY: "cache:minecraft:namehistory",
      },
      SUPPORT: "cache:support",
      premium: {
        ALIASES: "cache:premium:aliases",
        LEVEL: "cache:premium:level",
        BOOSTER: "cache:premium:booster",
      },
      user: {
        BLACKLIST: "cache:user:blacklist",
        DM_SETTINGS: "cache:user:dmsettings",
        PREFERENCES: "cache:user:preferences",
        EXISTS: "cache:user:exists",
        KARMA: "cache:user:karma",
        LAST_COMMAND: "cache:user:lastcmd",
        LASTFM: "cache:user:lastfm",
        TRACKING: "cache:user:tracking",
        ADMIN_LEVEL: "cache:user:adminlvl",
      },
      guild: {
        EXISTS: "cache:guild:exists",
        LOGS: "cache:guild:logs",
        MODLOGS: "cache:guild:modlogs",
        PERCENT_MATCH: "cache:guild:percentmatch",
        PREFIX: "cache:guild:prefix",
        REACTION_ROLES: "cache:guild:reactionroles",
        SLASH_ONLY: "cache:guild:slashonly",
      },
      moderation: {
        EXISTS: "cache:moderation:exists",
      },
      chatReaction: {
        EXISTS: "cache:chatreaction:exists",
      },
      economy: {
        AUTO_SELL: "cache:economy:autosell",
        AUCTION_AVG: "cache:economy:auctionavg",
        OFFER_AVG: "cache:economy:offeravg",
        AUCTION_ITEM_GRAPH_DATA: "cache:economy:auction:historydata",
        BAKERY_UPGRADES: "cache:economy:bakery:upgrades",
        BALANCE: "cache:economy:balance",
        BANNED: "cache:economy:banned",
        BOOSTERS: "cache:economy:boosters",
        DEFAULT_BET: "cache:economy:defaultbet",
        EXISTS: "cache:economy:exists",
        GUILD_LEVEL: "cache:economy:guild:level",
        GUILD_REQUIREMENTS: "cache:economy:guild:requirements",
        GUILD_USER: "cache:economy:guild:user",
        GUILD_UPGRADES: "cache:economy:guild:upgrades",
        INVENTORY: "cache:economy:inventory",
        NETWORTH: "cache:economy:networth",
        PADLOCK: "cache:economy:padlock",
        PASSIVE: "cache:economy:passive",
        PRESTIGE: "cache:economy:prestige",
        VOTE: "cache:economy:vote",
        XP: "cache:economy:xp",
      },
    },
    nypsi: {
      MENTION_QUEUE: "nypsi:mention:queue",
      MENTION_DELAY: "nypsi:mention:delay",
      MENTION_MAX: "nypsi:mention:max",
      MENTION_DM_TEKOH_THRESHOLD: "nypsi:mention:warn",
      CAPTCHA_VERIFIED: "nypsi:captcha_verified",
      DM_QUEUE: "nypsi:dmqueue",
      GEM_GIVEN: "nypsi:gemgiven",
      GUILD_LOG_QUEUE: "nypsi:guild:logs:queue",
      HOURLY_DB_REPORT: "nypsi:hourlydbreport",
      LOCKED_OUT: "nypsi:requirescaptcha",
      MILF_QUEUE: "nypsi:milf:queue",
      NEWS_SEEN: "nypsi:news:seen",
      NEWS: "nypsi:news",
      PRESENCE: "nypsi:presence",
      RESTART: "nypsi:restarting",
      STEVE_EARNED: "nypsi:steveearned",
      TAX: "nypsi:tax",
      TOP_COMMANDS_USER: "nypsi:topcommands:user",
      TOP_COMMANDS: "nypsi:topcommands",
      USERS_PLAYING: "nypsi:users:playing",
      VOTE_REMINDER_RECEIVED: "nypsi:vote_reminder:received",
      FORCE_LOSE: "nypsi:forcelose",
      KARMA_SHOP_OPEN: "nypsi:ks:open",
      KARMA_LAST_OPEN: "nypsi:ks:lastopen",
      KARMA_NEXT_OPEN: "nypsi:ks:nextopen",
      KARMA_SHOP_ITEMS: "nypsi:ks:items",
      KARMA_SHOP_BUYING: "nypsi:ks:buying",
      AUTO_SELL_ITEMS: "nypsi:autosell:items",
      AUTO_SELL_ITEMS_MEMBERS: "nypsi:autosell:items:members",
      AUTO_SELL_PROCESS: "nypsi:autosell:process",
      OFFER_PROCESS: "nypsi:offer:process",
      RICKROLL: "nypsi:rickroll",
      COMMAND_WATCH: "nypsi:cmdwatch",
    },
  },
  ADMIN_IDS: ["672793821850894347", "449774710469689355"],
  BOOST_ROLE_ID: "747066190530347089",
  BOT_USER_ID: "678711738845102087",
  BRONZE_ROLE_ID: "819870590718181391",
  COLOUR_REGEX: /^#([A-Fa-f0-9]{6})$/,
  MENTION_REGEX: /<@!*&*[0-9]+>/,
  EMBED_FAIL_COLOR: "#e31e3b" as ColorResolvable,
  EMBED_SUCCESS_COLOR: "#68f78c" as ColorResolvable,
  EMOJI_REGEX: /(<:[A-z]+:[0-9]+>)/,
  GOLD_ROLE_ID: "819870846536646666",
  KOFI_PRODUCTS: products,
  LOTTERY_TICKETS_MAX: 250,
  MAX_AUCTION_PER_ITEM: 35_000_000,
  MAX_GUILD_LEVEL: 69,
  NYPSI_SERVER_ID: "747056029795221513",
  PLATINUM_ROLE_ID: "819870959325413387",
  SILVER_ROLE_ID: "819870727834566696",
  TEKOH_ID: "672793821850894347",
  TRANSPARENT_EMBED_COLOR: "#2c2d31" as ColorResolvable,
  VOTE_CRATE_PROGRESSION: [1, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5],
  SEASON_START: new Date("06/01/2023"),
  SEASON_NUMBER: 6,
  SNOWFLAKE_REGEX: /^\d{17,19}$/,
  LUCKY_CHEESE_CHANCE: 0.07,
  BADGES: ["owner", "staff", "highroller", "contributor", "season_winner", "og"],
};
