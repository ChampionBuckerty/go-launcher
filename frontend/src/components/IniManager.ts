// import fs from 'fs'
// import { remote } from 'electron'

// const rootPath =
//   process.env.NODE_ENV === 'production'
//     ? remote.app.getAppPath() + '/../../..'
//     : remote.app.getAppPath()
// const iniPath = `${rootPath}/nostalgia.ini`
// const optionIniPath = `${rootPath}/option.ini`

// const iniToObject = (iniType: 'option' | 'main') => {
//   const selectedIni = iniType === 'option' ? optionIniPath : iniPath
//   const readFile = fs.readFileSync(selectedIni, 'utf8')
//   const splitFile = readFile.split('\n')
//   const finalObject: { [name: string]: { [name: string]: string } } = {}
//   let currentTopLevel: string | undefined

//   // TODO: Decide if we need to worry about order here

//   splitFile.forEach((line) => {
//     if (line.startsWith('[')) {
//       currentTopLevel = line.slice(1, line.length - 1)
//       finalObject[currentTopLevel] = {}
//       return
//     }

//     if (line.trim().length === 0) {
//       currentTopLevel = undefined
//       return
//     }

//     if (typeof currentTopLevel === 'undefined') {
//       console.log(`option.ini is malformed, cant adjust settings`)
//       return
//     }

//     const [key, value] = line.split('=')
//     finalObject[currentTopLevel][key] = value
//   })

//   return finalObject
// }

// const objectToIniFile = (
//   iniObject: { [name: string]: { [name: string]: string } } = {},
//   iniType: 'option' | 'main',
// ): void => {
//   let final = ''

//   for (let [topKey, params] of Object.entries(iniObject)) {
//     final += `[${topKey}]\n`
//     for (let [key, value] of Object.entries(params)) {
//       final += `${key}=${value}\n`
//     }
//     final += '\n'
//   }

//   const selectedIni = iniType === 'option' ? optionIniPath : iniPath

//   fs.writeFileSync(selectedIni, final)
// }

// const fetchGameVersion = (): number | undefined => {
//   const readFile = fs.readFileSync(iniPath, 'utf8')
//   const versionRegex = /(?<=VERSION=).*/
//   const results = versionRegex.exec(readFile)

//   if (results) {
//     return parseInt(results[0])
//   }
// }

// const updateGameVersion = (newVersion: number) => {
//   const fileText = `[ARES]
// VERSION=${newVersion}

// [NOSTALGIA]
// VERSION=${newVersion}

// `
//   fs.writeFile(iniPath, fileText, (err) => {
//     if (err) {
//       console.log('An error ocurred updating the file' + err.message)
//       console.log(err)
//       return
//     }

//     console.log('The file has been successfully saved')
//   })
// }

// export default {
//   fetchGameVersion,
//   updateGameVersion,
//   iniToObject,
//   objectToIniFile,
// }

export {}
