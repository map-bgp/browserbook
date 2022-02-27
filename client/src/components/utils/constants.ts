export enum NavKey {
  DASHBOARD = 'dashboard',
  TOKEN_ADMINISTRATION = 'token-administration',
  TRADE = 'trade',
  ORDER_BOOK = 'order-book',
  ORDER_VALIDATION = 'order-validation',
  HOW_IT_WORKS = 'how-it-works',
}

export const isNavKey = (x: any) => Object.values(NavKey).includes(x)

export enum NavPage {
  DASHBOARD = 'Dashboard',
  TOKEN_ADMINISTRATION = 'Token Administration',
  TRADE = 'Trade',
  ORDER_BOOK = 'Order Book',
  ORDER_VALIDATION = 'Order Validation',
  HOW_IT_WORKS = 'How it Works',
}

export type NavRecord = Record<NavKey, NavPage>

export const Navigation: NavRecord = {
  [NavKey.DASHBOARD]: NavPage.DASHBOARD,
  [NavKey.TOKEN_ADMINISTRATION]: NavPage.TOKEN_ADMINISTRATION,
  [NavKey.TRADE]: NavPage.TRADE,
  [NavKey.ORDER_BOOK]: NavPage.ORDER_BOOK,
  [NavKey.ORDER_VALIDATION]: NavPage.ORDER_VALIDATION,
  [NavKey.HOW_IT_WORKS]: NavPage.HOW_IT_WORKS,
}
