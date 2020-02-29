<template>
<header 
  @mousedown="ignore" 
  @dblclick="expand" 
  class="flex justify-between text-gray-400 px-2 bg-sys-5"
>
  <div class="max-w-md pl-16 mx-auto w-0 flex-grow flex items-center">
    <TextInput 
      :value="value" 
      @input="(e) => $emit('input', e)" 
      @submit="changeUrl" 
      class="no-drag w-0 flex-grow block ml-1 mr-4"
    >
      <template v-slot:icon>
        <icon icon="globe-americas" />
      </template>
      <template v-slot:trailing>
        <button 
          @click="$emit('reloadAll')" 
          class="no-drag ml-1 w-5 h-5 flex items-center justify-center text-sm rounded-full focus:outline-none focus:shadow-outline hover:bg-sys-4"
        >
          <icon icon="redo" class="icon-button" />
        </button>
      </template>
    </TextInput>
    <button 
      @click="changeSync" 
      class="no-drag mr-4 flex items-center text-sm rounded focus:outline-none focus:shadow-outline"
      :class="{ 'text-red-500 hover:text-red-400': sync, 'text-green-500 hover:text-green-400': !sync }"
    >
      <icon icon="sync-alt" class="icon-button mr-1" />
      <p class="leading-none">sync</p>
    </button>
  </div>
  <div class="no-drag edit select-none flex">
    <button 
      @click="$emit('toggleFullWindow')"
      class="bg-sys-6 w-6 h-6 flex justify-center items-center rounded-full text-sys-1 focus:outline-none focus:shadow-outline" 
      :class="fullWindow ? 'text-sm' : 'text-xs'"
    >
      <icon class="icon" :icon="fullWindow ? 'mobile' : 'desktop'" />
    </button>
    <p class="ml-2">Add more breakpoints</p>
  </div>
</header>
</template>

<script>
import { ipcRenderer } from 'electron'
import TextInput from '@/components/ui/TextInput.vue'
export default {
  props: {
    value: {
      type: String,
      default: ''
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
  components: {
    TextInput,
  },
  data() {
    return {
      tlds: require('@/assets/tlds.json')['tlds']
    }
  },
  methods: {
    ignore(e) {
      if(e.target.tagName === 'HEADER')
      e.preventDefault()
    },
    expand(e) {
      e.preventDefault()
      if(e.target.tagName === 'HEADER')
      ipcRenderer.send('stretchWindow')
    },
    changeSync() {
      this.$emit('changeSync', !this.sync)
    },
    changeUrl(val) {
      if(val.startsWith('http://') || val.startsWith('https://')) 
        this.$emit('changeUrl', val)
      else if(!val.startsWith('http') && this.tlds.some(tld => val.includes(tld)))
        this.$emit('changeUrl', `http://${val}`)
      else {
        const search = val.split(/\s+/g).join('+')
        this.$emit('changeUrl', `https://www.google.com/search?q=${search}`)
      }
    },
  },
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
</style>