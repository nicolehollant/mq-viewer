<template>
<div class="h-screen overflow-hidden flex flex-col">
  <UrlBar 
    v-model="val"
    :sync="sync"
    :fullWindow="fullWindow"
    @changeUrl="(e) => url = e"
    @toggleFullWindow="toggleFullWindow"
    @reloadAll="$refs['browsers'].reloadAll()"
    @changeSync="(e) => sync = e"
  />
  <Browsers 
    :url="url"
    :val="val"
    :sync="sync"
    :fullWindow="fullWindow"
    :widths="widths"
    @changeVal="(e) => val = e"
    ref="browsers"
  />
</div>
</template>

<script>
// NOTE: should consider [browser view](https://www.electronjs.org/docs/api/browser-view)
import Browsers from '@/components/Browsers.vue'
import UrlBar from '@/components/UrlBar.vue'
export default {
  components: {
    UrlBar,
    Browsers
  },
  data() {
    return {
      url: 'https://sproj.colehollant.com',
      widths: ['375', '768', '1024'],
      val: 'https://sproj.colehollant.com',
      clicks: 0,
      timer: null,
      delay: 300,
      sync: false,
      fullWindow: false
    }
  },
  methods: {
    toggleFullWindow() {
      this.fullWindow = !this.fullWindow
      if(!this.fullWindow) this.url = this.val
    },
  }
}
</script>

<style lang="postcss">
header {
  -webkit-app-region: drag;
  border-bottom: 0.25px solid var(--system-gray-6);
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.icon-button {
  width: 0.8rem;
  height: 0.8rem;
  font-size: 0.6rem;
}
</style>