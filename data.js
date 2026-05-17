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
  { key:'dmg_taken_red',     label:'Снижение входящего урона',      pct:true, combat:false },
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
  rogue:   { hp:1155, def:13.65, atk:15.75, mana:125, crit_chance:0, crit_dmg:1.5 },
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
  rogue: {
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
];

// ── БАФЫ ──────────────────────────────────────────────────────────────────────
const BUFF_CATS = [
  { id:'class', name:'Классовые', hint:'групповые баффы класса' },
  { id:'rep',   name:'Репутации', hint:'награды репутаций' },
  { id:'food',  name:'Еда',       hint:'эффекты от еды' },
];

const BUFFS = [
  // ── Еда Флоринга (ур. 3, white) ─────────────────────────────────────────────
  { id:'food_floring_breakfast', cat:'food', group:'Еда Флоринга',               level:3, quality:'white',  name:'Завтрак Флоринга',                icon:'stats_calculator/buffs/dishes_buff/Баф1_рыба.png',   stats:{hp:50, heal_eff:1, atk:1} },
  { id:'food_floring_shashlik',  cat:'food', group:'Еда Флоринга',               level:3, quality:'white',  name:'Шашлык Флоринга',                 icon:'stats_calculator/buffs/dishes_buff/Баф2_шашлык.png', stats:{atk:1, dmg_out:1.5, crit_chance:2, crit_dmg:2} },
  { id:'food_floring_uha',       cat:'food', group:'Еда Флоринга',               level:3, quality:'white',  name:'Уха Флоринга',                    icon:'stats_calculator/buffs/dishes_buff/Баф3_уха.png',    stats:{hp:50, dmg_taken_red:1.5, hp_regen:25} },
  { id:'food_floring_lunch',     cat:'food', group:'Еда Флоринга',               level:3, quality:'white',  name:'Обед Флоринга',                   icon:'stats_calculator/buffs/dishes_buff/Баф4_обед.png',   stats:{atk:1, dmg_out:0.5, dmg_taken_red:0.5, heal_eff:0.5, crit_chance:2, crit_dmg:2} },
  // ── Еда Кохилльского Архипелага (ур. 4, white) ──────────────────────────────
  { id:'food_kohill_breakfast',  cat:'food', group:'Еда Кохилльского Архипелага', level:4, quality:'white',  name:'Завтрак Кохилльского Архипелага', icon:'stats_calculator/buffs/dishes_buff/Баф1_рыба.png',   stats:{hp:100, heal_eff:1.5, atk:2} },
  { id:'food_kohill_shashlik',   cat:'food', group:'Еда Кохилльского Архипелага', level:4, quality:'white',  name:'Шашлык Кохилльского Архипелага', icon:'stats_calculator/buffs/dishes_buff/Баф2_шашлык.png', stats:{atk:2, dmg_out:2.5, crit_chance:3, crit_dmg:3} },
  { id:'food_kohill_uha',        cat:'food', group:'Еда Кохилльского Архипелага', level:4, quality:'white',  name:'Уха Кохилльского Архипелага',    icon:'stats_calculator/buffs/dishes_buff/Баф3_уха.png',    stats:{hp:100, dmg_taken_red:2.5, hp_regen:50} },
  { id:'food_kohill_lunch',      cat:'food', group:'Еда Кохилльского Архипелага', level:4, quality:'white',  name:'Обед Кохилльского Архипелага',   icon:'stats_calculator/buffs/dishes_buff/Баф4_обед.png',   stats:{atk:2, dmg_out:1.5, dmg_taken_red:1.5, heal_eff:1, crit_chance:3, crit_dmg:3} },
  // ── Еда Гайны (ур. 5, green) ────────────────────────────────────────────────
  { id:'food_gaina_breakfast',   cat:'food', group:'Еда Гайны',                  level:5, quality:'green',  name:'Завтрак Гайны',                   icon:'stats_calculator/buffs/dishes_buff/Баф1_рыба.png',   stats:{hp:150, heal_eff:2, atk:3} },
  { id:'food_gaina_shashlik',    cat:'food', group:'Еда Гайны',                  level:5, quality:'green',  name:'Шашлык Гайны',                    icon:'stats_calculator/buffs/dishes_buff/Баф2_шашлык.png', stats:{atk:3, dmg_out:3.5, crit_chance:4, crit_dmg:4} },
  { id:'food_gaina_uha',         cat:'food', group:'Еда Гайны',                  level:5, quality:'green',  name:'Уха Гайны',                       icon:'stats_calculator/buffs/dishes_buff/Баф3_уха.png',    stats:{hp:150, dmg_taken_red:3.5, hp_regen:75} },
  { id:'food_gaina_lunch',       cat:'food', group:'Еда Гайны',                  level:5, quality:'green',  name:'Обед Гайны',                      icon:'stats_calculator/buffs/dishes_buff/Баф4_обед.png',   stats:{atk:3, dmg_out:2.5, dmg_taken_red:2.5, heal_eff:1.5, crit_chance:4, crit_dmg:4} },
  // ── Еда Весеннего Берега (ур. 6, blue) ──────────────────────────────────────
  { id:'food_spring_breakfast',  cat:'food', group:'Еда Весеннего Берега',       level:6, quality:'blue',   name:'Завтрак Весеннего Берега',         icon:'stats_calculator/buffs/dishes_buff/Баф1_рыба.png',   stats:{hp:200, heal_eff:2.5, atk:4} },
  { id:'food_spring_shashlik',   cat:'food', group:'Еда Весеннего Берега',       level:6, quality:'blue',   name:'Шашлык Весеннего Берега',          icon:'stats_calculator/buffs/dishes_buff/Баф2_шашлык.png', stats:{atk:4, dmg_out:4.5, crit_chance:5, crit_dmg:5} },
  { id:'food_spring_uha',        cat:'food', group:'Еда Весеннего Берега',       level:6, quality:'blue',   name:'Уха Весеннего Берега',             icon:'stats_calculator/buffs/dishes_buff/Баф3_уха.png',    stats:{hp:200, dmg_taken_red:4.5, hp_regen:100} },
  { id:'food_spring_lunch',      cat:'food', group:'Еда Весеннего Берега',       level:6, quality:'blue',   name:'Обед Весеннего Берега',            icon:'stats_calculator/buffs/dishes_buff/Баф4_обед.png',   stats:{atk:4, dmg_out:3.5, dmg_taken_red:3.5, heal_eff:2, crit_chance:5, crit_dmg:5} },
  // ── Еда Хирна (ур. 7, purple) ───────────────────────────────────────────────
  { id:'food_hirn_breakfast',    cat:'food', group:'Еда Хирна',                  level:7, quality:'purple', name:'Завтрак Хирна',                    icon:'stats_calculator/buffs/dishes_buff/Баф1_рыба.png',   stats:{hp:250, heal_eff:3, atk:5} },
  { id:'food_hirn_shashlik',     cat:'food', group:'Еда Хирна',                  level:7, quality:'purple', name:'Шашлык Хирна',                     icon:'stats_calculator/buffs/dishes_buff/Баф2_шашлык.png', stats:{atk:5, dmg_out:5.5, crit_chance:6, crit_dmg:6} },
  { id:'food_hirn_uha',          cat:'food', group:'Еда Хирна',                  level:7, quality:'purple', name:'Уха Хирна',                        icon:'stats_calculator/buffs/dishes_buff/Баф3_уха.png',    stats:{hp:250, dmg_taken_red:5.5, hp_regen:125} },
  { id:'food_hirn_lunch',        cat:'food', group:'Еда Хирна',                  level:7, quality:'purple', name:'Обед Хирна',                       icon:'stats_calculator/buffs/dishes_buff/Баф4_обед.png',   stats:{atk:5, dmg_out:4.5, dmg_taken_red:4.5, heal_eff:2.5, crit_chance:6, crit_dmg:6} },
  // ── Еда Южного Фьорла (ур. 8, red) ─────────────────────────────────────────
  { id:'food_south_breakfast',   cat:'food', group:'Еда Южного Фьорла',          level:8, quality:'red',    name:'Завтрак Южного Фьорла',            icon:'stats_calculator/buffs/dishes_buff/Баф1_рыба.png',   stats:{hp:300, heal_eff:3.5, atk:6} },
  { id:'food_south_shashlik',    cat:'food', group:'Еда Южного Фьорла',          level:8, quality:'red',    name:'Шашлык Южного Фьорла',             icon:'stats_calculator/buffs/dishes_buff/Баф2_шашлык.png', stats:{atk:6, dmg_out:6.5, crit_chance:7, crit_dmg:7} },
  { id:'food_south_uha',         cat:'food', group:'Еда Южного Фьорла',          level:8, quality:'red',    name:'Уха Южного Фьорла',                icon:'stats_calculator/buffs/dishes_buff/Баф3_уха.png',    stats:{hp:300, dmg_taken_red:6.5, hp_regen:150} },
  { id:'food_south_lunch',       cat:'food', group:'Еда Южного Фьорла',          level:8, quality:'red',    name:'Обед Южного Фьорла',               icon:'stats_calculator/buffs/dishes_buff/Баф4_обед.png',   stats:{atk:6, dmg_out:5.5, dmg_taken_red:5.5, heal_eff:3, crit_chance:7, crit_dmg:7} },
  // ── Еда Северного Фьорла (ур. 9, orange) ────────────────────────────────────
  { id:'food_north_breakfast',   cat:'food', group:'Еда Северного Фьорла',       level:9, quality:'orange', name:'Завтрак Северного Фьорла',         icon:'stats_calculator/buffs/dishes_buff/Баф1_рыба.png',   stats:{hp:350, heal_eff:4, atk:7} },
  { id:'food_north_shashlik',    cat:'food', group:'Еда Северного Фьорла',       level:9, quality:'orange', name:'Шашлык Северного Фьорла',          icon:'stats_calculator/buffs/dishes_buff/Баф2_шашлык.png', stats:{atk:7, dmg_out:7.5, crit_chance:8, crit_dmg:8} },
  { id:'food_north_uha',         cat:'food', group:'Еда Северного Фьорла',       level:9, quality:'orange', name:'Уха Северного Фьорла',             icon:'stats_calculator/buffs/dishes_buff/Баф3_уха.png',    stats:{hp:350, dmg_taken_red:7.5, hp_regen:175} },
  { id:'food_north_lunch',       cat:'food', group:'Еда Северного Фьорла',       level:9, quality:'orange', name:'Обед Северного Фьорла',            icon:'stats_calculator/buffs/dishes_buff/Баф4_обед.png',   stats:{atk:7, dmg_out:6.5, dmg_taken_red:6.5, heal_eff:3.5, crit_chance:8, crit_dmg:8} },
];

