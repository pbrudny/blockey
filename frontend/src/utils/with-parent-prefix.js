export default function (prefix, routes) {
  return Object.keys(routes).reduce((accumulator, key) => ({
    ...accumulator,
    [key]: `${prefix}${routes[key]}`
  }), {
    ROOT: prefix
  })
}
