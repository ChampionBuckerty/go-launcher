import Logo from './assets/images/goldLogoShadow.png'
import './App.css'
import XMark from './components/XMark'
import Patch from './components/Patch'
import { useState } from 'react'
import { Settings } from './components/Settings'

export enum Pages {
  home = 'home',
  settings = 'settings',
}

const Page: React.FC = () => {
  const [activePage, setActivePage] = useState<Pages>(Pages.home)

  switch (activePage) {
    case Pages.home:
      return <Patch setActivePage={setActivePage} />
    case Pages.settings:
      return <Settings setActivePage={setActivePage} />
    default:
      return <Patch setActivePage={setActivePage} />
  }
}

function App() {
  return (
    <div className="MainWindow">
      <div className="Background_Overlay" />
      <XMark />
      <img className="Logo" src={Logo} />
      <Page />
    </div>
  )
}

export default App
