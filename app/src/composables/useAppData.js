import fs from 'fs'
import { ipcRenderer } from 'electron'
import { ref, onMounted } from '@vue/composition-api'

export function useAppData () {
  // originally data properties
  const datapath = ref('')
  const config = ref({})

  const defaultVal = { "default": [{"name":"small","size":"300"},{"name":"medium","size":"750"},{"name":"large","size":"1000"}] }

  // originally computed property
  function writeConfig(update) {
    ipcRenderer.send('checkDataPath')
    ipcRenderer.on('datapath', (event, appDataPath) => {
      config.value = update
      fs.writeFileSync(appDataPath, JSON.stringify(update))
    });
  }

  function readConfig() {
    ipcRenderer.send('checkDataPath')
    ipcRenderer.on('datapath', (event, appDataPath) => {
      datapath.value = appDataPath
      const dataContents = fs.readFileSync(appDataPath)
      const data = dataContents.length === 0 
        ? defaultVal : JSON.parse(dataContents)
      config.value = data
    });
  }
  function readUpdate(callback) {
    let hasOccured = false
    ipcRenderer.send('checkDataPath')
    ipcRenderer.on('datapath', (event, appDataPath) => {
      datapath.value = appDataPath
      const dataContents = fs.readFileSync(appDataPath)
      const data = dataContents.length === 0 
        ? defaultVal : JSON.parse(dataContents)
      config.value = data
      if(!hasOccured) {
        callback(data)
        hasOccured = true
      }
    });
  }

  onMounted(() => {
    readConfig()
  })

  return { 
    config,
    datapath,
    readConfig,
    writeConfig,
    readUpdate,
  }
}