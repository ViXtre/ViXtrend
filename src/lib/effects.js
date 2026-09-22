/**
 * Централизирана Библиотека за Анимационни Ефекти (ViXtrend Effects Library)
 * 
 * Тук се дефинират всички визуални ефекти за поява на картите/секциите на продуктите.
 * Добавянето на нов ефект тук автоматично го прави достъпен в Admin панела и в сайта.
 */

export const EFFECTS = [
  {
    id: 'fade-up',
    name_bg: 'Плавна Поява (Fade Up)',
    name_en: 'Smooth Fade Up',
    desc_bg: 'Плавна и елегантна поява с леко издигане нагоре.',
    desc_en: 'Smooth elegant reveal with subtle upward movement.',
    badge: 'Класически',
    cardClass: 'effect-fade-up',
  },
  {
    id: 'slide-split',
    name_bg: 'Разделено Плъзгане (Slide Split)',
    name_en: 'Split Slide',
    desc_bg: 'Снимките се плъзгат отляво, а текстовете и детайлите - отдясно.',
    desc_en: 'Images slide from left while details slide from right.',
    badge: 'Динамичен',
    cardClass: 'effect-slide-split',
  },
  {
    id: 'zoom-glow',
    name_bg: 'Неоново Мащабиране (Zoom Glow)',
    name_en: 'Zoom & Neon Glow',
    desc_bg: 'Мащабиране с неонов пулсиращ контур и дълбочина.',
    desc_en: 'Zoom effect with neon border glow and backdrop depth.',
    badge: 'Cyberpunk',
    cardClass: 'effect-zoom-glow',
  },
  {
    id: 'tilt-3d',
    name_bg: '3D Перспектива (3D Tilt)',
    name_en: '3D Tilt & Angle',
    desc_bg: 'Модерно 3D завъртане на секцията с пространствен обем.',
    desc_en: 'Modern 3D tilt with spatial perspective.',
    badge: '3D Поглед',
    cardClass: 'effect-tilt-3d',
  },
  {
    id: 'neon-sweep',
    name_bg: 'Лазерен Лъч (Neon Sweep)',
    name_en: 'Laser Sweep',
    desc_bg: 'Светлинен лъч преминава през продукта и разкрива съдържанието.',
    desc_en: 'Luminous laser line sweeps across revealing content.',
    badge: 'Futuristic',
    cardClass: 'effect-neon-sweep',
  },
];

export const getEffectById = (id) => {
  return EFFECTS.find((e) => e.id === id) || EFFECTS[0];
};

export const getDefaultEffect = () => EFFECTS[0];
