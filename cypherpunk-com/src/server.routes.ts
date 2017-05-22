/**
 * Server-side routes. Only the listed routes support html5pushstate.
 * Has to match client side routes.
 *
 * Index (/) route does not have to be listed here.
 *
 * @example
 * export const routes: string[] = [
 * 'home', 'about'
 * ];
 **/
export const routes: string[] = [
  'home',
  'account',
  'account/billing',
  'account/upgrade',
  'account/setup',
  'account/reset',
  'pricing',
  'login',
  'recover',
  'download/*',
  'confirm',
  'why-use-a-vpn',
  'features',
  'network',
  'privacy-policy',
  'about-us',
  'terms-of-service',
  'blog',
  'blog/post/*',
  '404',
  'apps',
  'apps/browser',
  'apps/mac',
  'apps/windows',
  'apps/ios',
  'apps/android',
  'apps/linux',
  'apps/routers',
  'feedback',
  'bounty',
  'whats-my-ip-address',
  'signup',
  'press',
  'reset',
  'support',
  'support/articles/*',
  'support/tutorials/*',
  'support/windows',
  'support/macos',
  'support/linux',
  'support/articles',
  'support/tutorials'
];
