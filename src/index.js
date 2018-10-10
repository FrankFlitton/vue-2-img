import imageCapture from './imageCapture.js'
// function plugin (Vue) {
//   Vue.component('hello', Hello)
//   Vue.component('hello-jsx', HelloJsx)
// }

// Install by default if using the script tag
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(plugin)
// }

window.imageCapture = imageCapture

export default imageCapture
const version = '__VERSION__'
// Export all components too
export {
  version,
  imageCapture
}
