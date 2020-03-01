<template>
<div class="px-4 py-4 h-full overflow-scroll" style="max-height: 500px;">
  <div class="flex justify-between items-center">
    <h2 class="text-base font-semibold text-sys-2">
      Config
    </h2>
    <button 
      @click="toggleEditing"
      class="text-sm leading-none text-sys-1 font-semibold rounded hover:text-sys-green focus:outline-none focus:shadow-outline"
    >
      <span v-if="state.editing">cancel</span>
      <span v-else>edit</span>
    </button>
  </div>
  <div class="mt-4">
    <h3 class="text-base text-sys-1 font-semibold mb-2">Namespaces</h3>
    <div class="relative">
      <div class="inline-block w-full">
        <select 
          class="block appearance-none w-full bg-sys-4 border border-sys-3 hover:border-border-sys-2 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          :key="state.selectKey"
          v-model="state.selected"
        >
          <option v-for="namespace of Object.keys(state.updatedConfig)" :key="namespace" :value="namespace">{{namespace}}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center my-2">
      <input 
        type="text" 
        class="w-full px-2 mx-2 bg-sys-6 border-b border-sys-5 font-medium text-sys-1 placeholder-sys-2 focus:outline-none focus:border-sys-blue focus:text-sys-text" 
        placeholder="add namespace"
        v-model="state.newNamespace" 
        v-on:keyup.enter="addNamespace"
      />
      <button 
        @click="addNamespace"
        class="flex-shrink-0 flex justify-center items-center w-5 h-5 text-xs text-sys-1 bg-sys-4 border border-sys-3 rounded-full hover:text-sys-green focus:outline-none focus:shadow-outline"
      >
        <icon icon="plus" />
      </button>
    </div>
  </div>
  <div class="mt-4">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-base text-sys-1 font-semibold">Breakpoints</h3>
    </div>

    <div v-if="state.editing">
      <div v-for="(breakpoint, index) in state.updatedConfig[state.selected]" :key="`breakpoint-${index}`" class="mb-6 flex items-center">
        <div>
          <div class="flex mb-1 items-baseline">
            <p class="mr-2 flex-shrink-0 w-10 text-xs text-sys-2 text-right leading-none font-semibold tracking-wider uppercase">name</p>
            <input 
              type="text" 
              class="w-full bg-sys-5 border border-sys-4 px-2 font-medium text-sys-1 rounded focus:outline-none focus:border-sys-blue focus:text-sys-text" 
              v-model="state.updatedConfig[state.selected][index].name" 
            />
          </div>
          <div class="flex items-baseline">
            <p class="mr-2 flex-shrink-0 w-10 text-xs text-sys-2 text-right leading-none font-semibold tracking-wider uppercase">size</p>
            <input 
              type="number" 
              class="w-full bg-sys-5 border border-sys-4 px-2 font-medium text-sys-1 rounded focus:outline-none focus:border-sys-blue focus:text-sys-text" 
              v-model="state.updatedConfig[state.selected][index].size" 
            />
          </div>
        </div>
        <button class="border-transparent w-5 h-5 flex justify-center items-center ml-2 -mr-2" @click="() => removeBreakpoint(index)">
          <icon class="text-sm text-sys-orange cursor-pointer" icon="times" />
        </button>
      </div>
      <div class="flex justify-between items-center mt-4">
        <button 
          @click="addBreakpoint"
          class="text-sm leading-none text-sys-1 font-semibold rounded hover:text-sys-green focus:outline-none focus:shadow-outline"
        >
          Add Breakpoint
        </button>
        <button 
          class="py-1 px-2 text-sm leading-none text-sys-1 font-semibold bg-sys-4 border border-sys-3 rounded hover:text-sys-green focus:outline-none focus:shadow-outline"
          @click="submit"
        >
          Submit
        </button>
      </div>
    </div>
    <div v-else>
      <div v-for="breakpoint in config[state.selected]" :key="breakpoint.name" class="mb-2">
        <div class="text-xs text-sys-2 leading-none font-bold tracking-wider uppercase">{{ breakpoint.name }}</div>
        <div class="text-base text-sys-text font-medium">{{ breakpoint.size }}px</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useAppData } from '@/composables'
import TextInput from '@/components/ui/TextInput.vue'
import { defineComponent, reactive, watch } from '@vue/composition-api'
const Config = defineComponent({
  props: {
    selected: {
      type: String,
      default: 'default'
    }
  },
  components: {
    TextInput,
  },
  setup(props, { emit }) {
    
    const {config, writeConfig } = useAppData()

    const state = reactive({
      selected: props.selected,
      editing: false,
      updatedConfig: null,
      newNamespace: '',
      selectKey: 0
    })

    function toggleEditing() {
      state.editing = !state.editing
      state.updatedConfig = JSON.parse(JSON.stringify(config.value))
    }

    function addBreakpoint() {
      state.updatedConfig[state.selected].push({
        'name': '',
        'size': ''
      })
    }

    function removeBreakpoint(index) {
      state.updatedConfig[state.selected].splice(index, 1)
    }

    function addNamespace() {
      if(!(state.newNamespace in state.updatedConfig) && state.newNamespace !== '') {
        state.updatedConfig[state.newNamespace] = [{
          name: 'default',
          size: '400'
        }]
        state.selected = state.newNamespace
        state.newNamespace = ''
        state.editing = true
        state.selectKey++
      } else {
        console.log('invalid name')
      }
    }

    function updateNamespace() {
      const vals = config.value[state.selected]
        ? config.value[state.selected].map(breakpoint => breakpoint.size)
        : null
      if(vals) {
        emit('changeNamespace', {
          name: state.selected,
          widths: vals
        })
      }
    }

    function submit() {
      const cleanConfig = []
      for(const breakpoint of state.updatedConfig[state.selected]) {
        if (breakpoint.name !== '') cleanConfig.push({
          name: breakpoint.name,
          size: Math.abs(breakpoint.size).toString(),
        })
      }
      config.value[state.selected] = cleanConfig
      writeConfig(config.value)
      updateNamespace()
      state.editing = false
    }

    watch(() => config.value,
      (newConf) => {
        state.updatedConfig = newConf
    })

    watch(() => state.selected, () => { updateNamespace() })

    return {
      state,
      config,
      toggleEditing,
      addBreakpoint,
      removeBreakpoint,
      submit,
      addNamespace,

    }
  }
})
export default Config
</script>

<style lang="scss" scoped>

</style>