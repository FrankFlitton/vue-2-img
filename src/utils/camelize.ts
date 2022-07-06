export const camelize = (str: string) => {
  return str.replace(/\-(\w)/g, function (_, letter) {
    return letter.toUpperCase()
  })
}
