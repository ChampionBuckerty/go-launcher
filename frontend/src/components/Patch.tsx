// import axios from "axios";
import * as React from 'react'
import { useState, useCallback } from 'react'
import { LaunchGame } from '../../wailsjs/go/main/App'
import './Patch.css'
import ProgressBar from './ProgressBar'
// import AdmZip from "adm-zip";
// import fs from "fs";
// import { ipcRenderer, remote } from 'electron'
// import request from "request";
// import IniManager from './IniManager'
// import LaunchGame from './LaunchGame'
// import * as Sentry from "@sentry/electron";

const Patch: React.FunctionComponent = () => {
  const [percentage, setPercentage] = useState<number>(0)
  // const [availablePatches, setAvailablePatches] = useState<string[] | null>(
  //   null,
  // )
  const [fullyPatched, setFullyPatched] = useState<boolean>(false)
  const [launching, setLaunching] = useState<boolean>(false)
  const [currentAction, setCurrentAction] = useState<string>('')
  // const [lastPatchLength, setLastPatchLength] = useState<number>()
  // const [totalPatchLength, setTotalPatchLength] = useState<number>()
  const [bypassClickCounter, setBypassClickCounter] = useState<number>(0)
  // const currentVersion = IniManager.fetchGameVersion()

  const launchGame = useCallback(() => {
    if (launching) return

    if (fullyPatched) {
      setLaunching(true)
      LaunchGame()
    }
  }, [fullyPatched, setLaunching, launching])

  // const downloadAndUnzipPatch = async () => {
  //   const eachFileMaxPercent = 100.0 / totalPatchLength;
  //   const rootPath =
  //     process.env.NODE_ENV === "production"
  //       ? remote.app.getAppPath() + "/../../.."
  //       : remote.app.getAppPath();
  //   let currentFileNumber = totalPatchLength - lastPatchLength;

  //   const localPatches = availablePatches;
  //   let patchUrl = localPatches.shift();
  //   setAvailablePatches(localPatches);

  //   const splitPatchUrl = patchUrl.split("/");
  //   let fileName = splitPatchUrl[splitPatchUrl.length - 1];

  //   if (fileName === "file") {
  //     // Lets remove that crap and fix the rest
  //     splitPatchUrl.pop();
  //     fileName = splitPatchUrl[splitPatchUrl.length - 1];
  //     patchUrl = splitPatchUrl.join("/");
  //   }

  //   const fullFilePath = `${rootPath}/${fileName}`;
  //   const patchVersion = fileName.split("-")[1].split(".")[0];
  //   const patchNumber = patchVersion.substring(1);
  //   let progress: number;

  //   setCurrentAction(`Downloading Patch ${patchNumber}`);

  //   // Save variable to know progress
  //   let received_bytes = 0;
  //   let total_bytes = 0;

  //   const saveZIPFile = async () => {
  //     return new Promise((resolve) => {
  //       let req = request({
  //         method: "GET",
  //         uri: patchUrl,
  //       });

  //       let out = fs.createWriteStream(fullFilePath);
  //       req.pipe(out);

  //       req.on("response", (data) => {
  //         // Change the total bytes value to get progress later.
  //         total_bytes = parseInt(data.headers["content-length"]);
  //       });

  //       req.on("data", (chunk) => {
  //         // Update the received bytes
  //         received_bytes += chunk.length;

  //         const singleFilePercent = received_bytes / total_bytes;

  //         const basePercent = currentFileNumber * eachFileMaxPercent;

  //         progress = Math.round(
  //           basePercent + singleFilePercent * eachFileMaxPercent
  //         );

  //         setPercentage(progress);
  //       });

  //       req.on("end", () => {
  //         // Wait a second after completion of download to start trying to unzip
  //         setTimeout(() => {
  //           resolve(true);
  //         }, 1000);
  //       });
  //     });
  //   };

  //   await saveZIPFile();

  //   setCurrentAction(`Unzipping Patch ${patchNumber}`);

  //   setTimeout(() => {
  //     try {
  //       const zip = new AdmZip(fullFilePath);
  //       let extractPath = rootPath;

  //       if (process.env.NODE_ENV !== "production") {
  //         extractPath = extractPath + "/tmp";
  //       }

  //       const entries = zip.getEntries();
  //       const entryNames = entries.map((entry) => entry.entryName);

  //       zip.extractAllTo(extractPath, true);
  //       IniManager.updateGameVersion(parseInt(patchNumber));

  //       if (fs.existsSync(fullFilePath)) {
  //         fs.unlink(fullFilePath, (err) => {
  //           if (err) {
  //             alert("An error occurred deleting the file" + err.message);
  //             Sentry.captureException(err);
  //             return;
  //           }
  //           console.log("File succesfully deleted");
  //         });
  //       }

  //       // Here, we've updated the ini to this patch number already and fully patched
  //       // Restarting the launcher will be safe, so we should not "finish" and instead exit and run updater
  //       if (entryNames.includes("Launcher.zip")) {
  //         ipcRenderer.invoke("mainWindow:launchUpdater");
  //       }

  //       currentFileNumber++;
  //       setLastPatchLength(availablePatches.length);
  //       if (progress === 100) {
  //         setFullyPatched(true);
  //         setCurrentAction("All patches installed!");
  //       }
  //     } catch (e) {
  //       Sentry.captureException(e);
  //       alert(e);
  //     }
  //   }, 20);
  // };

  // // If we've got any available patches, download and install them
  // useEffect(() => {
  //   if (
  //     availablePatches === [] ||
  //     availablePatches === null ||
  //     !totalPatchLength ||
  //     lastPatchLength === 0
  //   ) {
  //     return;
  //   }

  //   if (availablePatches?.length == lastPatchLength) {
  //     downloadAndUnzipPatch();
  //   }
  // }, [availablePatches, lastPatchLength, totalPatchLength]);

  // // Fetch all available patches based on users current version
  // useEffect(() => {
  //   axios({
  //     url: `https://api.nos.tw/updates?version=${currentVersion}`,
  //   }).then((response) => {
  //     setAvailablePatches(response.data.patches);
  //     setLastPatchLength(response.data.patches.length);
  //     setTotalPatchLength(response.data.patches.length);
  //     if (response.data.patches.length < 1) {
  //       setPercentage(100);
  //       setFullyPatched(true);
  //       setCurrentAction("All patches already installed!");
  //     }
  //   });
  // }, []);

  return (
    <div className="Patch">
      <div
        className="ProgressContainer"
        onClick={() => {
          setBypassClickCounter((count) => count + 1)
          if (bypassClickCounter > 5) {
            setFullyPatched(true)
            setPercentage(100)
            setCurrentAction(
              "Patch bypass used! Make sure you don't miss any patches!",
            )
          }
        }}
      >
        <ProgressBar percentage={percentage} />
        <div className="ProgressActionText">{currentAction}</div>
      </div>
      <div className="LaunchContainer">
        <button
          onClick={launchGame}
          className={`Launch ${fullyPatched ? '' : 'disabled'}`}
        >
          Launch Game
        </button>
        <div>
          <button
            // onClick={() => ipcRenderer.invoke("settingsWindow:show")}
            className="Settings"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Patch
