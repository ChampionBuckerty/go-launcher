import Logo from './assets/images/goldLogoShadow.png'
import './App.css'
import XMark from './components/XMark'
import Patch from './components/Patch'

function App() {
  return (
    <div className="MainWindow">
      <div className="Background_Overlay" />
      <XMark />
      <img className="Logo" src={Logo} />
      <Patch />
    </div>
  )
}

export default App
