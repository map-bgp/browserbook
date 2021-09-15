
// TODO Fix bad typings
export const getCurrent = (location: any, navigation: any[]) => {
  let path = location.pathname
  let current = "Dashboard"

  for (let i = 0; i < navigation.length; i++) {
    if (navigation[i].key === path.replace("/", "")) {
      current = navigation[i].name
    }
  }

  return current
}