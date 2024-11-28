import { ElectronAPI } from "@electron-toolkit/preload";

const api = {
  selectFolder: () => ipcRenderer.send("dialog:openDirectory"),
  fs: {
    readFileSync: (filePath: string, encoding: BufferEncoding) =>
      fs.readFileSync(filePath, encoding),
    writeFileSync: (filePath: string, text: string) => fs.writeFileSync(filePath, text)
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
