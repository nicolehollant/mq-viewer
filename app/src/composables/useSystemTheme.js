import { ipcRenderer } from 'electron'
import { ref, onMounted } from '@vue/composition-api'
function useSystemTheme () {
  // originally data properties
  const theme = ref('dark')

  // originally computed property
  function toggleTheme() {
    if (theme.value === 'dark') {
      theme.value = 'light'
    } else {
      theme.value = 'dark'
    }
  }

  onMounted(() => {
    ipcRenderer.send('checkCurrentTheme')
    ipcRenderer.on('themeUpdated', () => {
      ipcRenderer.send('checkCurrentTheme')
    })
    ipcRenderer.on('currentTheme', (event, sysTheme) => {
      theme.value = sysTheme
      document.getElementsByTagName('html')[0].style.backgroundColor = sysTheme === 'dark' ? 'rgb(44,  44,  46)' : 'rgb(229, 229, 234)';
    });
  })

  return { theme, toggleTheme }
}
export default useSystemTheme;