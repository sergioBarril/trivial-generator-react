import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

import * as fs from "fs";

// Custom APIs for renderer
const api = {
  selectFolder: () => ipcRenderer.send("dialog:openDirectory"),
  fs: {
    readFileSync: (filePath: string, encoding: BufferEncoding) =>
      fs.readFileSync(filePath, encoding),
    writeFileSync: (filePath: string, text: string) => fs.writeFileSync(filePath, text)
  }
};

export type RendererAPI = typeof api;

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
