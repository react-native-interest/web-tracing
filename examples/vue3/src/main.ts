import { createApp } from 'vue'
import App from './App.vue'

import { add } from '@web-tracing/core/index'
import { pad } from '@web-tracing/utils'

console.log('add', add)
console.log('pad', pad)

createApp(App).mount('#app')
