export enum NavKey {
  DASHBOARD = "dashboard",
  MARKET = "market",
  PORTFOLIO = "portfolio",
  ASSETS = "assets",
  ORDER_CREATION = "order-creation",
  ORDER_MATCHING = "order-matching"
}

export const isNavKey = (x: any) => Object.values(NavKey).includes(x)

export enum NavPage {
  DASHBOARD = "Dashboard",
  MARKET = "Market",
  PORTFOLIO = "Portfolio",
  ASSETS = "Assets",
  ORDER_CREATION = "Order Creation",
  ORDER_MATCHING = "Order Matching"
}

export type NavRecord = Record<NavKey, NavPage>

export const Navigation: NavRecord = {
  [NavKey.DASHBOARD]: NavPage.DASHBOARD,
  [NavKey.MARKET]: NavPage.MARKET,
  [NavKey.PORTFOLIO]: NavPage.PORTFOLIO,
  [NavKey.ASSETS]: NavPage.ASSETS,
  [NavKey.ORDER_CREATION]: NavPage.ORDER_CREATION,
  [NavKey.ORDER_MATCHING]: NavPage.ORDER_MATCHING,
}