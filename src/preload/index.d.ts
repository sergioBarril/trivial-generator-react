import { ElectronAPI } from "@electron-toolkit/preload";
import { shell } from "electron";
import { dirname, basename } from "path";

const api = {
  selectFolder: () => ipcRenderer.send("dialog:openDirectory"),
  fs: {
    readFileSync: (filePath: string, encoding: BufferEncoding) =>
      fs.readFileSync(filePath, encoding),
    writeFileSync: (filePath: string, text: string) => fs.writeFileSync(filePath, text)
  },
  path: {
    basename,
    dirname
  },
  shell: {
    openPath: shell.openPath
  }
};

declare global {
  interface Window {
    electron: ElectronAPI;
    api: typeof api;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
