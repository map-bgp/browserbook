
// TODO Fix bad typings
export const getCurrent = (location: any, navigation: any[]) => {
  let path = location.pathname

  var indices: number[] = [];
  for(var i=0; i<path.length;i++) {
    if (path[i] === "/") indices.push(i);
  }

  path = location.pathname.substring(indices[0] + 1, indices[1])
  let current = "Dashboard"

  for (let i = 0; i < navigation.length; i++) {
    if (navigation[i].key === path) {
      current = navigation[i].name
    }
  }

  return current
}