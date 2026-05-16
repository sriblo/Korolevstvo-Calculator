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
  { key:'speed_out',   label:'Скорость вне боя',        pct:true },
  { key:'speed_in',    label:'Скорость в бою',           pct:true },
  { key:'charisma',          label:'Харизма' },
  { key:'crit_fatal',        label:'Шанс смерт. удара',             pct:true },
  { key:'crit_def',          label:'Защита от крит. удара',         pct:true },
  { key:'hp_pct',            label:'Запас здоровья',                pct:true },
  { key:'dmg_out',           label:'Исходящий урон',                pct:true },
  { key:'exp_gain',          label:'Получение опыта',                pct:true, combat:false },
  { key:'rep_guard',         label:'Репутация Королевской Гвардии', pct:true, combat:false },
  { key:'rep_gladiator',     label:'Репутация Гладиатора',          pct:true, combat:false },
  { key:'rep_conqueror',     label:'Репутация Завоевателя',         pct:true, combat:false },
  { key:'rep_lord',          label:'Репутация Властителя земель',   pct:true, combat:false },
  { key:'rep_hunter',        label:'Репутация Охотника на демонов', pct:true, combat:false },
  { key:'rep_witch',         label:'Репутация Ведьмака',            pct:true, combat:false },
  { key:'rep_archaeologist', label:'Репутация Археолога',           pct:true, combat:false },
  { key:'rep_tamer',         label:'Репутация Дрессировщика',       pct:true, combat:false },
];

// ── БАЗОВЫЕ ХАРАКТЕРИСТИКИ (голый персонаж без шмота и бафов) ────────────────
const BASE_STATS = {
  warrior: { hp:1155, def:13.65, atk:15.75, mana:125, crit_chance:0, crit_dmg:1.5 },
};

// ── СТАТЫ ЭКИПИРОВКИ ──────────────────────────────────────────────────────────
const STATS = {
  warrior: {
    white: {
      weapon: { atk:4.75, def:20.18, hp:220, mana:5,  wind_res:0.40 },
    },
    green: {
      pants:  { atk:8.45, def:12.88, hp:350, mana:24, wind_res:0.50 },
      belt:   { atk:9.00, def:7.91,  hp:360, mana:30, wind_res:0.50 },
    },
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
  // ── ИВЕНТОВЫЕ ШЛЕМЫ ───────────────────────────────────────────────────────────
  { slotId:'helm', group:'Сушеная тыква', name:'Сушеная тыква', quality:'white',  img:'stats_calculator/event%20items/equipment/pumpking_helmet.png' },
  { slotId:'helm', group:'Сушеная тыква', name:'Сушеная тыква', quality:'green',  img:'stats_calculator/event%20items/equipment/pumpking_helmet.png' },
  { slotId:'helm', group:'Сушеная тыква', name:'Сушеная тыква', quality:'blue',   img:'stats_calculator/event%20items/equipment/pumpking_helmet.png', stats:{ atk:25, def:2.8, hp:800,  mana:800,  atk_eff:14 } },
  { slotId:'helm', group:'Сушеная тыква', name:'Сушеная тыква', quality:'purple', img:'stats_calculator/event%20items/equipment/pumpking_helmet.png', stats:{ atk:28, def:3.2, hp:900,  mana:900,  atk_eff:16 } },
  { slotId:'helm', group:'Сушеная тыква', name:'Сушеная тыква', quality:'red',    img:'stats_calculator/event%20items/equipment/pumpking_helmet.png', stats:{ atk:31, def:3.2, hp:1000, mana:1000, atk_eff:18 } },
  { slotId:'helm', group:'Сушеная тыква', name:'Сушеная тыква', quality:'orange', img:'stats_calculator/event%20items/equipment/pumpking_helmet.png', stats:{ atk:34, def:3.4, hp:1100, mana:1000, atk_eff:20 } },
  { slotId:'helm', name:'Волшебная сушеная тыква',               quality:'orange', img:'stats_calculator/event%20items/equipment/pumpking_helmet.png' },
  // ── АМУЛЕТЫ ───────────────────────────────────────────────────────────────────
  { slotId:'amulet', group:'Купидонский амулет', name:'Купидонский амулет', quality:'white',  event:true, img:'stats_calculator/event%20items/equipment/valentin_amulet_3.png' },
  { slotId:'amulet', group:'Купидонский амулет', name:'Купидонский амулет', quality:'green',  event:true, img:'stats_calculator/event%20items/equipment/valentin_amulet_3.png' },
  { slotId:'amulet', group:'Купидонский амулет', name:'Купидонский амулет', quality:'blue',   event:true, img:'stats_calculator/event%20items/equipment/valentin_amulet_3.png' },
  { slotId:'amulet', group:'Купидонский амулет', name:'Купидонский амулет', quality:'red',    event:true, img:'stats_calculator/event%20items/equipment/valentin_amulet_3.png' },
  { slotId:'amulet', group:'Купидонский амулет', name:'Купидонский амулет', quality:'orange', event:true, img:'stats_calculator/event%20items/equipment/valentin_amulet_3.png' },
  { slotId:'amulet', name:'Амулет Аррана',                                   quality:'orange', img:'stats_calculator/event%20items/equipment/valentin_amulet_4.png' },
  // ── БРАСЛЕТЫ ──────────────────────────────────────────────────────────────────
  { slotId:'bracelet', name:'Браслет Лёгкого шага',          quality:'orange', img:'stats_calculator/bizha/bracelet/bracelet_speed.png', stats:{ speed_out:8, mana:15 } },
  { slotId:'bracelet', name:'Браслет Спасительной верткости', quality:'orange', img:'stats_calculator/bizha/bracelet/bracelet_speed.png', stats:{ hp:735, speed_out:8, mana:25 } },
  { slotId:'bracelet', name:'Браслет Гончей',                 quality:'orange', img:'stats_calculator/bizha/bracelet/bracelet_speed.png', stats:{ atk:12.75, hp:735, speed_out:8, mana:35 } },
  { slotId:'bracelet', name:'Браслет Необычайной лёгкости',   quality:'orange', img:'stats_calculator/bizha/bracelet/bracelet_speed.png', stats:{ speed_out:8, speed_in:8, mana:45 } },
  { slotId:'bracelet', name:'Браслет Фантома',                quality:'orange', img:'stats_calculator/bizha/bracelet/bracelet_speed.png', stats:{ hp:735, speed_out:8, speed_in:8, mana:45 } },
  { slotId:'bracelet', name:'Браслет Сорвиголовы',            quality:'orange', img:'stats_calculator/bizha/bracelet/bracelet_speed.png', stats:{ atk:12.75, hp:735, speed_out:8, speed_in:8, mana:55 } },
  { slotId:'bracelet', name:'Браслет Тайфуна',                quality:'orange', img:'stats_calculator/bizha/bracelet/bracelet_speed.png', stats:{ atk:12.75, def:4.6, speed_out:8, speed_in:12, mana:55 } },
  { slotId:'bracelet', name:'Браслет Высшей силы',            quality:'orange', img:'stats_calculator/bizha/bracelet/bracelet_speed.png', stats:{ atk:12.75, hp:735, speed_out:8, speed_in:12, mana:55 } },
  // ── КОЛЬЦА (бижа) ── slotId:'ring' → ring1 и ring2 в калькуляторе
  { slotId:'ring', group:'Кольцо сквайра',  name:'Кольцо сквайра',           quality:'blue',   img:'stats_calculator/bizha/rings/warrior_ring_10.png',   stats:{ hp:80,  atk:2.86, def:1.14 } },
  { slotId:'ring', group:'Кольцо сквайра',  name:'Усиленное кольцо сквайра', quality:'blue',   img:'stats_calculator/bizha/rings/warrior_ring_10.png',   stats:{ hp:180, atk:2.86, def:2.14, atk_eff:2 } },
  { slotId:'ring', group:'Кольцо рыцаря',   name:'Кольцо рыцаря',            quality:'purple', img:'stats_calculator/bizha/rings/rogue_ring_11.png',     stats:{ hp:120, atk:3.74, def:1.5 } },
  { slotId:'ring', group:'Кольцо рыцаря',   name:'Усиленное кольцо рыцаря',  quality:'purple', img:'stats_calculator/bizha/rings/rogue_ring_11.png',     stats:{ hp:220, atk:3.74, def:2.5,  atk_eff:2 } },
  { slotId:'ring', group:'Кольцо лорда',    name:'Кольцо лорда',             quality:'red',    img:'stats_calculator/bizha/rings/cleric_ring_12.png',    stats:{ hp:200, atk:5.28, def:2.11, heal_eff:1 } },
  { slotId:'ring', group:'Кольцо лорда',    name:'Усиленное кольцо лорда',   quality:'red',    img:'stats_calculator/bizha/rings/cleric_ring_12.png',    stats:{ hp:300, atk:5.28, def:3.11, heal_eff:1, atk_eff:2 } },
  { slotId:'ring', group:'Кольцо барона',   name:'Кольцо барона',            quality:'orange', img:'stats_calculator/bizha/rings/ring_blood_moon_10.png', stats:{ hp:320, atk:6.82, def:2.9,  heal_eff:1, atk_eff:2 } },
  { slotId:'ring', group:'Кольцо барона',   name:'Усиленное кольцо барона',  quality:'orange', img:'stats_calculator/bizha/rings/ring_blood_moon_10.png', stats:{ hp:420, atk:6.82, def:3.9,  heal_eff:1, atk_eff:3 } },
  { slotId:'ring', group:'Кольца Фалькона', name:'Кольцо милосердия Фалькона', quality:'purple', img:'stats_calculator/bizha/rings/fair_defense_ring.png', stats:{ hp:485, def:6.75, speed_in:5, speed_out:5, def_eff:8, heal_eff:8, fire_res:5, wind_res:5, light_res:5, charisma:100, crit_fatal:0.1 } },
  { slotId:'ring', group:'Кольца Фалькона', name:'Кольцо лезвий Фалькона',     quality:'purple', img:'stats_calculator/bizha/rings/fair_attack_ring.png',  stats:{ atk:17.37, speed_in:5, speed_out:5, atk_eff:8, fire_res:5, wind_res:5, light_res:5, charisma:100, crit_fatal:0.1 } },
  { slotId:'ring', group:'Кольца Фалькона', name:'Кольцо власти Фалькона',     quality:'red',    img:'stats_calculator/bizha/rings/big_fucking_ring.png',  stats:{ atk:19, def:7, hp:500, mana:200, speed_in:5, speed_out:5, atk_eff:8, def_eff:8, heal_eff:8, fire_res:5, wind_res:5, light_res:5, charisma:100, crit_fatal:0.1 } },
  // ── ЖЕТОНЫ ────────────────────────────────────────────────────────────────────
  { slotId:'badge', group:'Номерной жетон', name:'Номерной жетон', quality:'green',  event:true, img:'stats_calculator/buffs/event_buff/numbered_token.png' },
  { slotId:'badge', group:'Номерной жетон', name:'Номерной жетон', quality:'blue',   event:true, img:'stats_calculator/buffs/event_buff/numbered_token.png' },
  { slotId:'badge', group:'Номерной жетон', name:'Номерной жетон', quality:'purple', event:true, img:'stats_calculator/buffs/event_buff/numbered_token.png' },
  { slotId:'badge', group:'Номерной жетон', name:'Номерной жетон', quality:'red',    event:true, img:'stats_calculator/buffs/event_buff/numbered_token.png' },
];

// ── ИВЕНТОВЫЕ БАФЫ ────────────────────────────────────────────────────────────
// Расходники/бафы — не слоты экипировки, только для базы предметов
const EVENT_BUFFS = [
  { group:'Скрипящие кости',          name:'Скрипящие кости',          quality:'blue',   img:'stats_calculator/buffs/event_buff/creaking_bones.png' },
  { group:'Скрипящие кости',          name:'Скрипящие кости',          quality:'purple', img:'stats_calculator/buffs/event_buff/creaking_bones.png' },
  { group:'Скрипящие кости',          name:'Скрипящие кости',          quality:'red',    img:'stats_calculator/buffs/event_buff/creaking_bones.png' },
  { group:'Скрипящие кости',          name:'Скрипящие кости',          quality:'orange', img:'stats_calculator/buffs/event_buff/creaking_bones.png' },
  { group:'Медовый хмель',            name:'Медовый хмель',            quality:'blue',   img:'stats_calculator/buffs/event_buff/elixir_attackmagic_11.png' },
  { group:'Медовый хмель',            name:'Медовый хмель',            quality:'purple', img:'stats_calculator/buffs/event_buff/elixir_attackmagic_11.png' },
  { group:'Медовый хмель',            name:'Медовый хмель',            quality:'red',    img:'stats_calculator/buffs/event_buff/elixir_attackmagic_11.png' },
  { group:'Медовый хмель',            name:'Медовый хмель',            quality:'orange', img:'stats_calculator/buffs/event_buff/elixir_attackmagic_11.png' },
  { group:'Знак экспедиции',          name:'Знак экспедиции',          quality:'green',  img:'stats_calculator/buffs/event_buff/zeppelin_badge.png' },
  { group:'Знак экспедиции',          name:'Знак экспедиции',          quality:'blue',   img:'stats_calculator/buffs/event_buff/zeppelin_badge.png' },
  { group:'Знак экспедиции',          name:'Знак экспедиции',          quality:'purple', img:'stats_calculator/buffs/event_buff/zeppelin_badge.png' },
  { group:'Знак экспедиции',          name:'Знак экспедиции',          quality:'red',    img:'stats_calculator/buffs/event_buff/zeppelin_badge.png' },
  { group:'Знак экспедиции',          name:'Знак экспедиции',          quality:'orange', img:'stats_calculator/buffs/event_buff/zeppelin_badge.png' },
  { group:'Кубок с Ледяных островов', name:'Кубок с Ледяных островов', quality:'green',  img:'stats_calculator/buffs/event_buff/expedition_ice_boul.png' },
  { group:'Кубок с Ледяных островов', name:'Кубок с Ледяных островов', quality:'blue',   img:'stats_calculator/buffs/event_buff/expedition_ice_boul.png' },
  { group:'Кубок с Ледяных островов', name:'Кубок с Ледяных островов', quality:'purple', img:'stats_calculator/buffs/event_buff/expedition_ice_boul.png' },
  { group:'Кубок с Ледяных островов', name:'Кубок с Ледяных островов', quality:'red',    img:'stats_calculator/buffs/event_buff/expedition_ice_boul.png' },
  { group:'Кубок с Ледяных островов', name:'Кубок с Ледяных островов', quality:'orange', img:'stats_calculator/buffs/event_buff/expedition_ice_boul.png' },
  { group:'Свиток редких драконьих техник', name:'Свиток редких драконьих техник', quality:'blue',   img:'stats_calculator/buffs/event_buff/big_scroll_fire.png', note:'Усиливает баф питомца. Отдельно не применяется.' },
  { group:'Свиток редких драконьих техник', name:'Свиток редких драконьих техник', quality:'purple', img:'stats_calculator/buffs/event_buff/big_scroll_fire.png', note:'Усиливает баф питомца. Отдельно не применяется.', stats:{ hp_pct:23, dmg_out:28, speed_in:5 } },
  { group:'Свиток редких драконьих техник', name:'Свиток редких драконьих техник', quality:'red',    img:'stats_calculator/buffs/event_buff/big_scroll_fire.png', note:'Усиливает баф питомца. Отдельно не применяется.', stats:{ hp_pct:25, dmg_out:32, speed_in:5 } },
  { group:'Свиток редких драконьих техник', name:'Свиток редких драконьих техник', quality:'orange', img:'stats_calculator/buffs/event_buff/big_scroll_fire.png', note:'Усиливает баф питомца. Отдельно не применяется.', stats:{ hp_pct:25, dmg_out:36, speed_in:5 } },
];

