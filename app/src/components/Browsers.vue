<template>
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
</template>

<script>
export default {
  props: {
    val: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    widths: {
      type: Array,
      default: () => ['375', '768']
    },
    fullWindow: {
      type: Boolean,
      default: false
    },
    sync: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    reloadAll() {
      if(!this.fullWindow) {
        const browsers = this.widths.map((_, i) => this.$refs[`iframe-${i}`][0])
        for(const browser of browsers) {
          browser.reloadIgnoringCache()
        }
      } else {
        this.$refs['iframe-full'][0].reloadIgnoringCache()
      }
    },
    handleNav(e) {
      if((this.sync || this.fullWindow) && e.url !== this.val) this.updateBrowsers(e.url)
    },
    updateBrowsers(url) {
      this.$emit('changeVal', url)
      if(!this.fullWindow) {
        const browsers = this.widths.map((_, i) => this.$refs[`iframe-${i}`][0])
        for(const browser of browsers) {
          browser.loadURL(url).catch(err => console.log({err}))
        }
      }
    },
    checkWebview(index) {
      console.log("Index is", index)
      console.log(this.$refs)
      const webv = this.$refs[`iframe-${index}`][0]
      if(webv.src !== this.val) this.updateBrowsers(webv.src)
    }
  },
}
</script>

<style lang="scss" scoped>

</style>