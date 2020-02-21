<template>
<div class="h-screen overflow-hidden flex flex-col">
  <header @mousedown="ignore" @dblclick="expand" class="flex justify-between text-gray-400 px-2 bg-sys-5">
    <div class="button__row w-16">
      <!-- <button class="bg-red-500"><icon class="icon" icon="times" /></button>
      <button class="bg-yellow-500"><icon class="icon" icon="minus" /></button>
      <button class="bg-green-500" @click="fullscreen"><icon class="icon" icon="expand-alt" /></button> -->
    </div>
    <div class="max-w-md mx-auto w-0 flex-grow flex items-center">
      <TextInput v-model="val" @submit="changeUrl" class="no-drag w-0 flex-grow block ml-1 mr-4">
        <template v-slot:icon>
          <icon icon="globe-americas" />
        </template>
      </TextInput>
      <button 
        @click="changeSync" 
        class="no-drag mr-4 flex items-center cursor-default text-sm rounded focus:outline-none focus:shadow-outline"
        :class="{ 'text-red-500 hover:text-red-400': sync, 'text-green-500 hover:text-green-400': !sync }"
      >
        <icon icon="sync-alt" class="icon-button mr-1" />
        <p class="leading-none">sync</p>
      </button>
    </div>
    <div class="no-drag edit select-none flex">
      <button 
        class="bg-sys-6 w-6 h-6 flex justify-center items-center rounded-full text-sys-1" 
        @click="toggleFullWindow"
        :class="fullWindow ? 'text-sm' : 'text-xs'"
      >
        <icon class="icon" :icon="fullWindow ? 'mobile' : 'desktop'" />
      </button>
      <p class="ml-2">Add more breakpoints</p>
    </div>
  </header>

  <main class="inline-flex h-0 flex-grow w-screen overflow-x-scroll" v-if="!fullWindow">
    <div 
      class="window__wrapper flex flex-col h-full"
      v-for="(width, index) of widths" :key="width"
    >
      <h3 class="text-center text-sm font-medium my-2 text-sys-2">{{width}}px</h3>
      <button @click="() => checkWebview(index)">ahhh</button>
      <webview 
        class="inline-flex mx-4 pb-2 h-0 flex-grow"
        :src="url" 
        frameborder="0"
        @did-navigate="handleNav"
        @did-navigate-in-page="handleNav"
        :ref="`iframe-${index}`"
        :style="`width: ${width}px;`"
      />
      <!-- 
        can add these if u wanna sync with nav
        @did-navigate="handleNav"
        @did-navigate-in-page="handleNavInPage"
        sandbox="allow-scripts allow-top-navigation	allow-same-origin"
       -->
    </div>
  </main>
  <main class="inline-flex h-0 flex-grow w-screen overflow-x-scroll" v-else>
    <webview 
      class="h-0 flex-grow w-full h-full"
      :src="url" 
      frameborder="0"
      @did-navigate="handleNav"
      @did-navigate-in-page="handleNav"
      :ref="`iframe-full`"
    />
  </main>
</div>
</template>

<script>
// NOTE: should consider [browser view](https://www.electronjs.org/docs/api/browser-view)
import { ipcRenderer } from 'electron'
import TextInput from '@/components/ui/TextInput.vue'
export default {
  components: {
    TextInput,
  },
  data() {
    return {
      url: 'http://localhost:8081',
      widths: ['375', '768', '1024'],
      val: 'http://localhost:8081',
      clicks: 0,
      timer: null,
      delay: 300,
      sync: false,
      fullWindow: false,
      tlds: require('@/assets/tlds.json')['tlds']
    }
  },
  methods: {
    toggleFullWindow() {
      this.fullWindow = !this.fullWindow
      if(!this.fullWindow) this.url = this.val
    },
    changeSync() {
      this.sync = !this.sync
    },
    changeUrl(val) {
      if(val.startsWith('http://') || val.startsWith('https://')) 
      this.url = val
      else if(!val.startsWith('http') && this.tlds.some(tld => val.includes(tld)))
      this.url = `http://${val}`
      else {
        const search = val.split(/\s+/g).join('+')
        this.url = `https://www.google.com/search?q=${search}`
      }
    },
    handleNav(e) {
      if((this.sync || this.fullWindow) && e.url !== this.val) this.updateBrowsers(e.url)
    },
    updateBrowsers(url) {
      this.val = url
      if(!this.fullWindow) {
        const browsers = this.widths.map((_, i) => this.$refs[`iframe-${i}`][0])
        for(const browser of browsers) {
          browser.loadURL(this.val).catch(err => console.log({err}))
        }
      }
    },
    checkWebview(index) {
      const webv = this.$refs[`iframe-${index}`][0]
      // if(webv.src !== this.url) this.url = webv.src
      if(webv.src !== this.val) this.updateBrowsers(webv.src)
    },
    ignore(e) {
      if(e.target.tagName === 'HEADER')
      e.preventDefault()
    },
    expand(e) {
      e.preventDefault()
      if(e.target.tagName === 'HEADER')
      ipcRenderer.send('stretchWindow')
    },
    fullscreen() {
      if(!document.fullscreen) document.getElementById("app").requestFullscreen()
      else if(document.exitFullscreen) document.exitFullscreen()
    }
  }
}
</script>

<style lang="postcss" scoped>
header {
  -webkit-app-region: drag;
  border-bottom: 0.25px solid var(--system-gray-6);
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.button__row {
  @apply text-sys-4 h-full flex items-center
}
.icon-button {
  width: 0.8rem;
  height: 0.8rem;
  font-size: 0.6rem;
}
.button__row button {
  @apply flex items-center justify-center mx-1 rounded-full icon-button no-drag
}
.button__row button:focus {
  @apply outline-none shadow-outline
}
.button__row .icon {
  @apply opacity-0;
}
.button__row:hover .icon {
  @apply opacity-100;
}
</style>