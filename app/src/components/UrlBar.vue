<template>
<div class="border-b border-sys-7">
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
        id="urlBar"
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
    <div class="no-drag edit select-none flex items-center">
      <button 
        @click="$emit('toggleFullWindow')"
        class="bg-sys-6 w-6 h-6 flex justify-center items-center rounded-full text-sys-1 focus:outline-none focus:shadow-outline" 
        :class="fullWindow ? 'text-sm' : 'text-xs'"
      >
        <icon class="icon" :icon="fullWindow ? 'mobile' : 'desktop'" />
      </button>
      <div v-click-outside="() => state.configMenu = false" class="relative">
        <button 
          @click="() => state.configMenu = !state.configMenu"
          class="ml-2 bg-sys-6 w-6 h-6 flex justify-center items-center rounded-full text-sys-1 focus:outline-none focus:shadow-outline" 
        >
          <icon class="icon" icon="cog" />
        </button>
        <div class="absolute mt-1 right-0 w-64 bg-sys-6 border border-sys-3 rounded shadow-md" v-if="state.configMenu">
          <Config :selected="namespace.name" @changeNamespace="changeNamespace" />
        </div>
      </div>
    </div>
  </header>
  <aside v-if="!fullWindow" class="w-screen overflow-x-scroll flex bg-sys-5 border-t border-sys-3">
    <button 
      tabindex="-1"
      class="flex-1 py-1 leading-none border-r border-sys-3 text-sm text-sys-1 cursor-default hover:text-sys-text focus:outline-none"
      :class="{
        'border-none': index === widthOptions.length - 1,
        'text-sys-teal font-semibold': active === width
      }"
      v-for="(width, index) in widthOptions" 
      :key="`width-${width}-${index}`"
      @click="$emit('active', width)"
    >
      {{ width }}
    </button>
  </aside>
</div>
</template>

<script>
import _ from 'lodash'
import { ipcRenderer, remote } from 'electron'
import TextInput from '@/components/ui/TextInput.vue'
import Config from '@/components/Config.vue'
import { defineComponent, reactive, onMounted, computed } from '@vue/composition-api'
const UrlBar = defineComponent({
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
    },
    active: {
      type: String,
      default: ''
    },
    namespace: {
      type: Object,
      default: () => ({
        name: 'empty',
        widths: ['375', '768']
      })
    }
  },
  components: {
    TextInput,
    Config,
  },
  setup(props, { emit }) {

    const widthOptions = computed(() => ['all', ...props.namespace.widths])
    const state = reactive({
      tlds: require('@/assets/tlds.json')['tlds'],
      configMenu: false
    })

    function ignore(e) {
      if(e.target.tagName === 'HEADER')
      e.preventDefault()
    }

    function expand(e) {
      e.preventDefault()
      if(e.target.tagName === 'HEADER')
      ipcRenderer.send('stretchWindow')
    }

    function changeSync() {
      emit('changeSync', !props.sync)
    }

    function changeUrl(val) {
      if(val.startsWith('http://') || val.startsWith('https://')) 
        emit('changeUrl', val)
      else if(!val.startsWith('http') && state.tlds.some(tld => val.includes(tld)))
        emit('changeUrl', `http://${val}`)
      else {
        const search = val.split(/\s+/g).join('+')
        emit('changeUrl', `https://www.google.com/search?q=${search}`)
      }
    }

    function changeNamespace(namespace) {
      emit('changeNamespace', namespace)
    }
    
    onMounted(() => {
      const listener = (e) => {
        if(e.metaKey && ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(e.key)) {
          if(Number(e.key) <= widthOptions.value.length) {
            emit('active', widthOptions.value[e.key === '0' ? 10 : Number(e.key) - 1])
          }
        } else if (e.metaKey && (e.key === 'r' || e.key === 'R')) {
          emit('reloadAll')
        } else if (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I' || e.key === 'Dead')) {
          remote.getCurrentWindow().webContents.openDevTools()
        } else if (e.metaKey && e.key === 'ArrowLeft') {
          emit('previous')
        } else if (e.metaKey && e.key === 'ArrowRight') {
          emit('next')
        } else if (e.metaKey && (e.key === 'l' || e.key === 'L')) {
          document.getElementById('urlBar').focus()
        }
      }
      window.addEventListener('keydown', _.debounce(listener, 100));
    })

    return {
      state,
      ignore,
      expand,
      changeSync,
      changeUrl,
      changeNamespace,
      widthOptions
    }
  }
})
export default UrlBar
</script>

<style lang="postcss" scoped>
header {
  -webkit-app-region: drag;
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