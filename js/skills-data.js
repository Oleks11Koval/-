/**
 * skills-data.js — content for the skills widget, one list per role.
 * Pure data + a few SVG icon helpers; edit text here, not in the widget code.
 */
(function (App) {
  'use strict';

  const STROKE = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

  /** Wrap SVG paths into a 24×24 outline icon. */
  function icon(paths) {
    return '<svg viewBox="0 0 24 24" ' + STROKE + ' stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">' + paths + '</svg>';
  }

  /** Small bold caption drawn inside an icon. */
  function label(text, size) {
    return '<text x="12" y="' + (size > 8 ? 15.5 : 14.5) + '" font-size="' + size +
      '" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="Geist,sans-serif">' + text + '</text>';
  }

  const PYTHON_HALF = '<path d="M7 11V6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3a2 2 0 0 1-2 2H7z"/><circle cx="10.5" cy="6" r=".8" fill="currentColor"/>';
  const CHIP = '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>';

  const it = [
    { name: 'Python', text: 'Базово володію Python.', icon: icon(PYTHON_HALF + '<g transform="rotate(180 12 12)">' + PYTHON_HALF + '</g>') },
    { name: 'HTML', text: 'Базово володію HTML та вебверсткою.', icon: icon('<path d="M4 3h16l-1.5 16L12 21l-6.5-2z"/>' + label('5', 9)) },
    { name: 'MongoDB', text: 'Вмію працювати з MongoDB.', icon: icon('<path d="M12 2c3.5 4 5 7.5 4.5 11-.4 3-2.4 5-4.5 7-2.1-2-4.1-4-4.5-7C7 9.5 8.5 6 12 2z"/><path d="M12 8v14"/>') },
    { name: 'Docker', text: 'Вмію працювати з Docker.', icon: icon('<rect x="6" y="9" width="3" height="3"/><rect x="10" y="9" width="3" height="3"/><rect x="14" y="9" width="3" height="3"/><rect x="10" y="5.5" width="3" height="3"/><path d="M2 13h17c1-.2 2-1 2.5-2 1 .3 1.5 1 1.5 2-.5 4-4 7-9 7-5 0-9-2.5-12-7z"/>') },
    { name: 'Локальні моделі ШІ', text: 'Впевнено працюю з локальними моделями ШІ: на них зроблені мій Telegram-бот новин і аналізатор логів сервера.', icon: icon(CHIP + label('AI', 6.5)) },
    { name: 'Нейромережі', text: 'Добре розбираюся в нейромережах.', icon: icon('<path d="M5 6l7 2M5 6l7 8M5 12l7-4M5 12l7 4M5 18l7-10M5 18l7-2M12 8l7 4M12 16l7-4"/><g fill="currentColor"><circle cx="5" cy="6" r="1.6"/><circle cx="5" cy="12" r="1.6"/><circle cx="5" cy="18" r="1.6"/><circle cx="12" cy="8" r="1.6"/><circle cx="12" cy="16" r="1.6"/><circle cx="19" cy="12" r="1.6"/></g>') },
    { name: 'Telegram-боти', text: 'Маю досвід роботи з Telegram-ботами, зокрема розробив бота новин на локальному ШІ.', icon: icon('<path d="M21.5 3.5L2.5 11l5.5 2 2 6 3-4 5 3.5z"/><path d="M8 13l8-6"/>') },
  ];

  const ct = [
    { name: 'Ідеї', text: 'Люблю генерувати ідеї й швидко відсіювати слабкі, щоб лишалися найкращі.', icon: icon('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>') },
    { name: 'Комунікація', text: 'Впевнено спілкуюся з незнайомими людьми, що потрібно для листування й дзвінків із партнерами.', icon: icon('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>') },
    { name: 'Планування', text: 'Вмію розкладати задачі на етапи й будувати реалістичний таймінг.', icon: icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>') },
    { name: 'Нетворкінг', text: 'Швидко знаходжу контакти та вмію переконати людину допомогти хакатону.', icon: icon('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 1.5 6 5.5"/>') },
    { name: 'Оцінювання', text: 'Розумію, як із чітких критеріїв зробити прозору систему балів.', icon: icon('<path d="M12 4v16M6 20h12M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>') },
    { name: 'Notion/Sheets', text: 'Вмію вести документацію, таблиці та трекери в Notion і Google Sheets.', icon: icon('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>') },
    { name: 'AI-інструменти', text: 'Впевнено використовую ШІ для брейнсторму, чернеток текстів і перевірки формулювань.', icon: icon(CHIP + label('AI', 6.5)) },
  ];

  App.skillsData = { it, ct };
})((window.App = window.App || {}));
