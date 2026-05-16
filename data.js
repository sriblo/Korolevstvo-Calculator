// ═══════════════════════════════════════════════════════════════════════════════
// data.js — единый источник данных для items_base.html и stats_calc.html
// Все изменения предметов, статов, качеств — только здесь.
// ═══════════════════════════════════════════════════════════════════════════════

// ── КАЧЕСТВО ──────────────────────────────────────────────────────────────────
const QUALITIES = [
  { id:'white',       label:'Обычный',           color:'#bbb' },
  { id:'green',       label:'Редкий',            color:'#8acc60' },
  { id:'blue',        label:'Элитный',           color:'#78aae0' },
  { id:'purple',      label:'Героический',       color:'#b888ee' },
  { id:'purple_plus', label:'Усил. героический', color:'#d898f8' },
  { id:'red',         label:'Легендарный',       color:'#ee5050' },
  { id:'orange',      label:'Эпический',         color:'#f0a040' },
];

const QUALITY_ORDER = ['white','green','blue','purple','purple_plus','red','orange'];

const QUALITY_LEVEL = {
  white:10, green:11, blue:12, purple:13, purple_plus:13, red:14, orange:15,
};

const QUALITY_FRAME = {
  white:       'frames/border_none.png',
  green:       'frames/border_low.png',
  blue:        'frames/border_medium.png',
  purple:      'frames/border_high.png',
  purple_plus: 'frames/border_high.png',
  red:         'frames/border_exclusive.png',
  orange:      'frames/border_special.png',
};

function sortByQuality(arr) {
  return [...arr].sort((a, b) => QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality));
}

// ── КЛАССЫ ────────────────────────────────────────────────────────────────────
const CLASS_NAMES = {
  warrior:'Воин', rogue:'Головорез', monk:'Монах',
  paladin:'Паладин', mage:'Маг', archer:'Лучник',
};

const CLASS_ICON_FILE = {
  warrior:'warrior.png', rogue:'rogue.png', monk:'cleric.png',
  paladin:'paladin.png', mage:'mage.png',   archer:'shooter.png',
};

// Названия сетов по классу и качеству
const CLASS_SET_NAMES = {
  warrior: { white:'Решимости',  green:'Отваги', blue:'Разрушителя', purple:'Непримиримости', purple_plus:'Непримиримости', red:'Доблести',   orange:'' },
  paladin: { white:'Праведника', green:'Веры',   blue:'Благочестия', purple:'Истины',          purple_plus:'Истины',         red:'Избранного', orange:'' },
  rogue:   {},
  monk:    {},
  mage:    {},
  archer:  {},
};

// Слот → имя файла в пути к картинке
const CLASS_SLOTS = {
  warrior: { weapon:'sword',  offhand:'shield', helm:'helm', chest:'chest', shoulders:'shoulders', pants:'pants', gloves:'gloves', belt:'belt', boots:'boots' },
  paladin: { weapon:'hammer', offhand:'relic',  helm:'helm', chest:'chest', shoulders:'shoulders', pants:'pants', gloves:'gloves', belt:'belt', boots:'boots' },
};

// Отображаемое название предмета по классу и слоту
const CLASS_ITEM_NAMES = {
  warrior: { weapon:'Меч',    offhand:'Щит',      helm:'Шлем', chest:'Кираса',    shoulders:'Наплечники', pants:'Штаны', gloves:'Перчатки', belt:'Пояс', boots:'Сапоги' },
  rogue:   { weapon:'Кинжал', offhand:'Кинжал',   helm:'Шлем', chest:'Нагрудник', shoulders:'Наплечники', pants:'Штаны', gloves:'Перчатки', belt:'Пояс', boots:'Сапоги' },
  monk:    { weapon:'Посох',  offhand:'Орб',      helm:'Шлем', chest:'Нагрудник', shoulders:'Наплечники', pants:'Штаны', gloves:'Перчатки', belt:'Пояс', boots:'Сапоги' },
  paladin: { weapon:'Молот',  offhand:'Реликвия', helm:'Шлем', chest:'Нагрудник', shoulders:'Наплечники', pants:'Штаны', gloves:'Перчатки', belt:'Пояс', boots:'Сапоги' },
  mage:    { weapon:'Посох',  offhand:'Орб',      helm:'Шлем', chest:'Нагрудник', shoulders:'Наплечники', pants:'Штаны', gloves:'Перчатки', belt:'Пояс', boots:'Сапоги' },
  archer:  { weapon:'Лук',    offhand:'Колчан',   helm:'Шлем', chest:'Нагрудник', shoulders:'Наплечники', pants:'Штаны', gloves:'Перчатки', belt:'Пояс', boots:'Сапоги' },
};

// ── ПУТИ К КАРТИНКАМ ──────────────────────────────────────────────────────────
function getClassSetPath(cls, quality) {
  if (cls === 'warrior') return `stats_calculator/classes/warrior/warrior/warrior_sets/${quality}_set/elf`;
  if (cls === 'paladin') return `stats_calculator/classes/paladin/palladin_sets/${quality}_set/elf`;
  return `stats_calculator/classes/${cls}/${cls}_sets/${quality}_set/elf`;
}

function getItemImg(cls, slotId, quality) {
  const slotMap = CLASS_SLOTS[cls];
  if (!slotMap) return null;
  const slotFile = slotMap[slotId];
  if (!slotFile) return null;
  const lvl = QUALITY_LEVEL[quality];
  if (!lvl) return null;
  return `${getClassSetPath(cls, quality)}/${cls}_${slotFile}_${lvl}_elf.png`;
}

// ── ХАРАКТЕРИСТИКИ ────────────────────────────────────────────────────────────
const STAT_LABELS = [
  { key:'atk',         label:'Атака' },
  { key:'def',         label:'Защита' },
  { key:'hp',          label:'Запас здоровья' },
  { key:'mana',        label:'Запас маны' },
  { key:'heal_eff',    label:'Эффект. лечения',  pct:true },
  { key:'hp_regen',    label:'Восст. жизни' },
  { key:'crit_dmg',    label:'Сила крита',        pct:true },
  { key:'crit_chance', label:'Шанс крита',        pct:true },
  { key:'wind_res',    label:'Сопр. ветра',       pct:true },
  { key:'fire_res',    label:'Сопр. огня',        pct:true },
  { key:'light_res',   label:'Сопр. света',       pct:true },
  { key:'elem_def',    label:'Защита стихий' },
  { key:'def_eff',     label:'Эффект. защиты',    pct:true },
  { key:'atk_eff',     label:'Эффект. атаки',     pct:true },
  { key:'speed',       label:'Скорость',           pct:true },
];

// ── СТАТЫ ЭКИПИРОВКИ ──────────────────────────────────────────────────────────
const STATS = {
  warrior: {
    red: {
      helm:      { atk:40.23, def:3.81,  hp:1662, mana:900, heal_eff:5, hp_regen:60, crit_dmg:6, wind_res:0.80, elem_def:193, atk_eff:22 },
      shoulders: { atk:21.56, def:3.13,  hp:800,  mana:210, heal_eff:5, hp_regen:60, crit_dmg:6, wind_res:0.80, elem_def:146, atk_eff:2 },
      chest:     { atk:22.43, def:2.43,  hp:831,  mana:230,  heal_eff:5, hp_regen:60, crit_dmg:6, wind_res:0.80, elem_def:169, atk_eff:2 },
      gloves:    { atk:20.81, def:4.14,  hp:769,  mana:190,  heal_eff:5, hp_regen:60, crit_dmg:6, wind_res:0.80, elem_def:124, atk_eff:2 },
      weapon:    { atk:12.72, def:37.85, hp:694,  mana:80,   heal_eff:5, hp_regen:50, crit_dmg:5, wind_res:0.80, elem_def:35,  atk_eff:2 },
      offhand:   { atk:50.15, def:1.53,  hp:4299, mana:1260, heal_eff:5, hp_regen:90, crit_dmg:6, wind_res:0.80,               atk_eff:7 },
      pants:     { atk:14.53, def:15.03, hp:713,  mana:120,  heal_eff:5, hp_regen:50, crit_dmg:5, wind_res:0.80, elem_def:53,  atk_eff:2 },
      belt:      { atk:15.56, def:8.56,  hp:725,  mana:150,  heal_eff:5, hp_regen:50, crit_dmg:5, wind_res:0.80, elem_def:72,  atk_eff:2 },
      boots:     { atk:20.04, def:5.65,  hp:750,  mana:170,  heal_eff:5, hp_regen:50, crit_dmg:5, wind_res:0.80, elem_def:92,  atk_eff:2 },
    },
  },
  paladin: {
    green: {
      weapon:    { atk:5.70,  def:28.47, hp:450,  mana:15, fire_res:0.50 },
      pants:     { atk:6.75,  def:14.23, hp:465,  mana:24, fire_res:0.50 },
      belt:      { atk:7.20,  def:8.59,  hp:485,  mana:30, fire_res:0.50 },
      boots:     { atk:9.70,  def:5.61,  hp:510,  mana:36, fire_res:0.50 },
      gloves:    { atk:10.75, def:3.94,  hp:530,  mana:42, fire_res:0.50 },
    },
    red: {
      weapon:    { atk:10.18, def:37.83, hp:949,  mana:80,  heal_eff:5, hp_regen:50, crit_dmg:5, fire_res:0.80, elem_def:35,  atk_eff:2 },
      pants:     { atk:11.64, def:17.84, hp:954,  mana:120, heal_eff:5, hp_regen:50, crit_dmg:5, fire_res:0.80, elem_def:53,  atk_eff:2 },
      belt:      { atk:12.41, def:10.32, hp:985,  mana:150, heal_eff:5, hp_regen:50, crit_dmg:5, fire_res:0.80, elem_def:72,  atk_eff:2 },
      boots:     { atk:16.57, def:6.63,  hp:1023, mana:170, heal_eff:5, hp_regen:50, crit_dmg:5, fire_res:0.80, elem_def:92,  atk_eff:2 },
    },
    purple_plus: {
      gloves:    { atk:16.30, def:4.78,  hp:855,  mana:170, heal_eff:5, fire_res:0.80, elem_def:124 },
    },
  },
};

// ── АРТЕФАКТЫ ─────────────────────────────────────────────────────────────────
// slotId — к какому слоту калькулятора статов относится артефакт
// group  — группа для отображения в базе предметов
const ARTIFACTS = [
  { slotId:'stone_travel',  name:'Камень Путешествий',                    quality:'red',    img:'stats_calculator/artefacts/artefact_stone_fire.png',   stats:{ def_eff:2, atk_eff:4 } },
  { slotId:'stone_contest', name:'Камень Состязаний',                     quality:'red',    img:'stats_calculator/artefacts/artefact_stone_light.png',  stats:{ atk:2, mana:100, atk_eff:2 } },
  { slotId:'stone_greed',   name:'Артефакт Алчности',                     quality:'red',    img:'stats_calculator/artefacts/artefact_stone_rubin.png',  stats:{ atk:3, mana:100, heal_eff:2, def_eff:3, hp:300, def:1, atk_eff:3, speed:1 } },
  { slotId:'stone_witch',   group:'Камень Ведьмака', name:'Камень Ведьмака',             quality:'red',    img:'stats_calculator/artefacts/artefact_stone_earth.png',  stats:{ heal_eff:2, hp:150, def:2 } },
  { slotId:'stone_witch',   group:'Камень Ведьмака', name:'Магическая карта Ведьмака',   quality:'orange', img:'stats_calculator/artefacts/green_demonic_card.png',     stats:{ hp:500, def:4, mana:200, def_eff:8, heal_eff:8 } },
  { slotId:'stone_luck',    group:'Камень Удачи',    name:'Камень Удачи',                quality:'red',    img:'stats_calculator/artefacts/artefact_stone_gold.png',    stats:{ atk:2, mana:100, heal_eff:1, def_eff:2, hp:100, atk_eff:2, speed:1 } },
  { slotId:'stone_luck',    group:'Камень Удачи',    name:'Магическая карта Удачи',      quality:'orange', img:'stats_calculator/artefacts/yellow_demonic_card.png',    stats:{ atk:6, hp:400, def:3, mana:200, def_eff:4, atk_eff:5, heal_eff:5, speed:3 } },
  { slotId:'stone_lost',    group:'Камень Потерянных Земель', name:'Камень Потерянных Земель', quality:'green',  img:'stats_calculator/artefacts/artefact_stone_air.png', stats:{ atk:2, mana:100, def_eff:2, atk_eff:3 } },
  { slotId:'stone_lost',    group:'Камень Потерянных Земель', name:'Камень Потерянных Земель', quality:'blue',   img:'stats_calculator/artefacts/artefact_stone_air.png', stats:{ atk:3, mana:150, def_eff:3, atk_eff:4, crit_chance:1 } },
  { slotId:'stone_lost',    group:'Камень Потерянных Земель', name:'Камень Потерянных Земель', quality:'purple', img:'stats_calculator/artefacts/artefact_stone_air.png', stats:{ atk:4, mana:200, def_eff:4, atk_eff:5, crit_chance:2 } },
  { slotId:'stone_lost',    group:'Камень Потерянных Земель', name:'Магическая карта Потерянных земель', quality:'orange', img:'stats_calculator/artefacts/blue_demonic_card.png', stats:{ atk:10, mana:200, def_eff:6, atk_eff:8, crit_chance:4 } },
  { slotId:'stone_labor',   group:'Камень Труда', name:'Камень Труда',   quality:'green',  img:'stats_calculator/artefacts/artefact_stone_water.png',  stats:{ atk:1, heal_eff:1, hp:50,  atk_eff:1 } },
  { slotId:'stone_labor',   group:'Камень Труда', name:'Камень Труда',   quality:'blue',   img:'stats_calculator/artefacts/artefact_stone_water.png',  stats:{ atk:2, heal_eff:2, hp:150, def:1, atk_eff:2 } },
  { slotId:'stone_labor',   group:'Камень Труда', name:'Камень Труда',   quality:'purple', img:'stats_calculator/artefacts/artefact_stone_water.png',  stats:{ atk:4, heal_eff:3, hp:300, def:2, atk_eff:3, crit_chance:2 } },
  { slotId:'stone_labor',   group:'Камень Труда', name:'Магическая карта Труда',          quality:'orange', img:'stats_calculator/artefacts/red_demonic_card.png',       stats:{ atk:10, hp:600, def:4, mana:200, atk_eff:8, crit_chance:4, heal_eff:6 } },
  { slotId:'stone_friend',  group:'Камень Дружбы', name:'Камень Дружбы', quality:'white',  img:'stats_calculator/artefacts/artefact_stone_dark.png',   stats:{ atk:1,  hp:50,       speed:1 } },
  { slotId:'stone_friend',  group:'Камень Дружбы', name:'Камень Дружбы', quality:'green',  img:'stats_calculator/artefacts/artefact_stone_dark.png',   stats:{ atk:3,  hp:100, def:1, speed:2 } },
  { slotId:'stone_friend',  group:'Камень Дружбы', name:'Камень Дружбы', quality:'blue',   img:'stats_calculator/artefacts/artefact_stone_dark.png',   stats:{ atk:5,  hp:200, def:3, speed:3 } },
  { slotId:'stone_friend',  group:'Камень Дружбы', name:'Камень Дружбы', quality:'purple', img:'stats_calculator/artefacts/artefact_stone_dark.png',   stats:{ atk:7,  hp:300, def:5, speed:3 } },
  { slotId:'stone_friend',  group:'Камень Дружбы', name:'Камень Дружбы', quality:'red',    img:'stats_calculator/artefacts/artefact_stone_dark.png',   stats:{ atk:10, hp:500, def:7, speed:3 } },
  { slotId:'stone_friend',  group:'Камень Дружбы', name:'Камень Дружбы', quality:'orange', img:'stats_calculator/artefacts/artefact_stone_dark.png',   stats:{ atk:13, hp:700, def:7, speed:4 } },
  { slotId:'stone_blood',   group:'Камень Крови',  name:'Камень Крови',  quality:'green',  img:'stats_calculator/artefacts/artefact_stone_blood.png',  stats:{ atk:1, mana:100, heal_eff:1, hp:100 } },
  { slotId:'stone_blood',   group:'Камень Крови',  name:'Камень Крови',  quality:'blue',   img:'stats_calculator/artefacts/artefact_stone_blood.png',  stats:{ atk:3, mana:200, heal_eff:2, hp:200, crit_chance:1 } },
  // ── КОЛЬЦА (бижа) ── slotId:'ring' → ring1 и ring2 в калькуляторе
  { slotId:'ring', group:'Кольцо сквайра',  name:'Кольцо сквайра',           quality:'blue',   img:'stats_calculator/bizha/rings/warrior_ring_10.png' },
  { slotId:'ring', group:'Кольцо сквайра',  name:'Усиленное кольцо сквайра', quality:'blue',   img:'stats_calculator/bizha/rings/warrior_ring_10.png' },
  { slotId:'ring', group:'Кольцо рыцаря',   name:'Кольцо рыцаря',            quality:'purple', img:'stats_calculator/bizha/rings/rogue_ring_11.png' },
  { slotId:'ring', group:'Кольцо рыцаря',   name:'Усиленное кольцо рыцаря',  quality:'purple', img:'stats_calculator/bizha/rings/rogue_ring_11.png' },
  { slotId:'ring', group:'Кольцо лорда',    name:'Кольцо лорда',             quality:'red',    img:'stats_calculator/bizha/rings/cleric_ring_12.png' },
  { slotId:'ring', group:'Кольцо лорда',    name:'Усиленное кольцо лорда',   quality:'red',    img:'stats_calculator/bizha/rings/cleric_ring_12.png' },
  { slotId:'ring', group:'Кольцо барона',   name:'Кольцо барона',            quality:'orange', img:'stats_calculator/bizha/rings/ring_blood_moon_10.png' },
  { slotId:'ring', group:'Кольцо барона',   name:'Усиленное кольцо барона',  quality:'orange', img:'stats_calculator/bizha/rings/ring_blood_moon_10.png' },
  { slotId:'ring', name:'Кольцо милосердия Фалькона', quality:'purple', img:'stats_calculator/bizha/rings/fair_defense_ring.png' },
  { slotId:'ring', name:'Кольцо лезвий Фалькона',     quality:'purple', img:'stats_calculator/bizha/rings/fair_attack_ring.png' },
  { slotId:'ring', name:'Кольцо власти Фалькона',     quality:'red',    img:'stats_calculator/bizha/rings/big_fucking_ring.png' },
];
