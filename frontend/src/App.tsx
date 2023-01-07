import { useState } from 'react'
import Logo from './assets/images/goldLogoShadow.png'
import './App.css'
import { Greet } from '../wailsjs/go/main/App'
import XMark from './components/XMark'
import Patch from './components/Patch'

function App() {
  const [resultText, setResultText] = useState(
    'Please enter your name below bruh 👇',
  )
  const [name, setName] = useState('')
  const updateName = (e: any) => setName(e.target.value)
  const updateResultText = (result: string) => setResultText(result)

  function greet() {
    Greet(name).then(updateResultText)
  }

  return (
    <div className="MainWindow">
      <div className="Background_Overlay" />
      <XMark />
      <img className="Logo" src={Logo} />
      <Patch />
      <button
        // onClick={() => ipcRenderer.invoke("settingsWindow:show")}
        className="Settings"
      >
        Settings
      </button>
    </div>
  )
}

export default App
