import vue2img from './vue2img.js'
import './vue2img.scss'
// function plugin (Vue) {
//   Vue.component('hello', Hello)
//   Vue.component('hello-jsx', HelloJsx)
// }

// Install by default if using the script tag
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(plugin)
// }

window.vue2img = vue2img

export default vue2img
const version = '__VERSION__'
// Export all components too
export {
  version,
  vue2img
}
