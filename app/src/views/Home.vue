<template>
<div class="h-screen overflow-hidden flex flex-col" v-if="!!state.namespace">
  <UrlBar 
    v-model="state.val"
    :sync="state.sync"
    :fullWindow="state.fullWindow"
    :namespace="state.namespace"
    :active="state.active"
    @changeNamespace="changeNamespace"
    @changeUrl="(e) => state.url = e"
    @toggleFullWindow="toggleFullWindow"
    @reloadAll="$refs['browsers'].reloadAll()"
    @changeSync="(e) => state.sync = e"
    @active="(e) => state.active = e"
    @previous="previous"
    @next="next"
  />
  <!-- <p class="bg-red-300">{{ state.active }}</p> -->
  <Browsers 
    :url="state.url"
    :val="state.val"
    :sync="state.sync"
    :fullWindow="state.fullWindow"
    :namespace="state.namespace"
    :active="state.active"
    @changeVal="(e) => {state.val = e; state.url = e; }"
    ref="browsers"
  />
</div>
<div v-else></div>
</template>

<script>
// NOTE: should consider [browser view](https://www.electronjs.org/docs/api/browser-view)
import Browsers from '@/components/Browsers.vue'
import UrlBar from '@/components/UrlBar.vue'
import { useAppData } from '@/composables'
import { defineComponent, reactive, onMounted, computed } from '@vue/composition-api'
const Home = defineComponent({
  components: {
    UrlBar,
    Browsers
  },
  setup() {

    const { readUpdate } = useAppData()

    const state = reactive({
      url: 'https://colehollant.com',
      namespace: null,
      val: 'https://colehollant.com',
      clicks: 0,
      timer: null,
      delay: 300,
      sync: false,
      fullWindow: false,
      active: 'all'
    })

    function changeNamespace(namespace) {
      state.namespace = namespace
      state.active = 'all'
    }

    function toggleFullWindow() {
      state.fullWindow = !state.fullWindow
      if(!state.fullWindow) state.url = state.val
    }

    const widthOptions = computed(() => ['all', ...state.namespace.widths])

    function previous() {
      const currentInd = widthOptions.value.indexOf(state.active)
      const newInd = currentInd === 0 ? widthOptions.value.length - 1 : currentInd - 1
      state.active = widthOptions.value[newInd]
    }

    function next() {
      const currentInd = widthOptions.value.indexOf(state.active)
      const newInd = currentInd === widthOptions.value.length - 1 ? 0 : currentInd + 1
      state.active = widthOptions.value[newInd]
    }

    onMounted(() => {
      readUpdate((e) => {
        state.namespace = {
          name: 'default',
          widths: e.default.map(breakpoint => breakpoint.size)
        }
      })
    })

    return {
      state,
      changeNamespace,
      toggleFullWindow,
      previous,
      next
    }
  }
})
export default Home
/**
export default {
  components: {
    UrlBar,
    Browsers
  },
  data() {
    return {
      url: 'https://sproj.colehollant.com',
      namespace: null,
      val: 'https://sproj.colehollant.com',
      clicks: 0,
      timer: null,
      delay: 300,
      sync: false,
      fullWindow: false,
      active: 'all'
    }
  },
  methods: {
    changeNamespace(namespace) {
      this.namespace = namespace
    },
    toggleFullWindow() {
      this.fullWindow = !this.fullWindow
      if(!this.fullWindow) this.url = this.val
    },
  }
}
 */
</script>

<style lang="postcss">

</style>