import {Location} from "react-router-dom";
import {isNavKey, NavKey, NavPage, NavRecord} from "./constants";

export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ")
}

export const getCurrent = (location: Location, navigation: NavRecord) => {
  let path = location.pathname
  let indices: Array<number> = []

  for (let i = 0; i < path.length; i++) {
    if (path[i] === "/") indices.push(i)
  }
  let derivedPath = location.pathname.substring(indices[0] + 1, indices[1]) as NavKey

  return isNavKey(derivedPath) ? navigation[derivedPath] : NavPage.DASHBOARD
}
