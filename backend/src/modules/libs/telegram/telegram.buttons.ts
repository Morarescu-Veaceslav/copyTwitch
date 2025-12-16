import { Markup } from "telegraf";

export const BUTTONS = {
  authSuccess: Markup.inlineKeyboard([
    [
      Markup.button.callback('👥 Subscriber', 'follows'),
      Markup.button.callback('👤 Vezi profilul', 'me')
    ],
    [Markup.button.url('🌐 Deschide pe site', 'https://twitchtest.app/dashboard/settings')]
  ]),

  profile: Markup.inlineKeyboard([
    [
      Markup.button.url('⚙️ Setări cont', 'https://twitchtest.app/dashboard/settings')
    ],
    [
      Markup.button.url('🏠 Mergi la TwitchTest', 'https://twitchtest.app')
    ]
  ])
};
