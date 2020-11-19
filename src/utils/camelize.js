export function camelize (str) {
  return str.replace(/\-(\w)/g, function (str, letter) {
    return letter.toUpperCase()
  })
}
