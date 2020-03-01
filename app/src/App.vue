<template>
  <div id="app" :class="state.theme">
    <router-view/>
  </div>
</template>

<script>
import { useSystemTheme } from '@/composables'
import { reactive } from '@vue/composition-api'

export default {
  setup() {
    const { theme } = useSystemTheme()

    const state = reactive({ theme })

    return {
      state
    }
  }
}
</script>

<style lang='postcss'>
.dark, .light {
  transition-property: background-color, color !important;
  @apply ease-slow;
}
.light {
  --system-text: rgb(28,  28,  30);
  --system-gray-1: rgb(142, 142, 147);
  --system-gray-2: rgb(174, 174, 178);
  --system-gray-3: rgb(199, 199, 204);
  --system-gray-4: rgb(209, 209, 214);
  --system-gray-5: rgb(229, 229, 234);
  --system-gray-6: rgb(242, 242, 247);
  --system-gray-7: rgb(253, 253, 255);
  --system-blue: rgb(0, 122, 255);
  --system-green: rgb(52, 199, 89);
  --system-indigo: rgb(88, 86, 214);
  --system-orange: rgb(255, 149, 0);
  --system-pink: rgb(255, 45, 85);
  --system-purple: rgb(175, 82, 222);
  --system-red: rgb(255, 59, 48);
  --system-teal: rgb(90, 200, 250);
  --system-yellow: rgb(255, 204, 0);
}
.dark {
  --system-text: rgb(242, 242, 247);
  --system-gray-1: rgb(142, 142, 147);
  --system-gray-2: rgb(99,  99,  102);
  --system-gray-3: rgb(72,  72,  74);
  --system-gray-4: rgb(58,  58,  60);
  --system-gray-5: rgb(44,  44,  46);
  --system-gray-6: rgb(28,  28,  30);
  --system-gray-7: rgb(16, 16, 17);
  --system-blue: rgb(10, 132, 255);
  --system-green: rgb(48, 209, 88);
  --system-indigo: rgb(94, 92, 230);
  --system-orange: rgb(255, 159, 10);
  --system-pink: rgb(255, 55, 95);
  --system-purple: rgb(191, 90, 242);
  --system-red: rgb(255, 69, 58);
  --system-teal: rgb(100, 210, 255);
  --system-yellow: rgb(255, 214, 10);
}
html, body {
  margin: 0;
  padding: 0;
  background-color: rgb(28,  28,  30);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  @apply bg-sys-6;
}
</style>
