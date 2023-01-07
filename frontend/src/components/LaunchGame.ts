// import { spawn } from 'child_process'
// import { remote } from 'electron'

// const parameters = ['!RepentLauncher~#']

// const buildPaths = () => {
//   const rootPath =
//     process.env.NODE_ENV === 'production'
//       ? remote.app.getAppPath() + '/../../..'
//       : remote.app.getAppPath()
//   const exeName = 'Nostalgia.exe'
//   const fullPath = `${rootPath}/${exeName}`

//   return {
//     rootPath,
//     fullPath,
//   }
// }

// const LaunchGame = (currentWindow: Electron.BrowserWindow) => {
//   const { fullPath, rootPath } = buildPaths()
//   spawn(fullPath, parameters, { cwd: rootPath, detached: true })
//   currentWindow.close()
// }

// export default LaunchGame

export {}
