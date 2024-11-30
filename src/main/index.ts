import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

import { renderTemplate } from "./trivial-generator/template-render";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      webSecurity: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pongo"));

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("dialog:openDirectory", async (event) => {
  {
    const mainWindow = BrowserWindow.fromWebContents(event.sender)!;
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"]
    });
    if (!canceled) {
      mainWindow.webContents.send("dialog:outputDirectory", { path: filePaths[0] });
    }
  }
});

ipcMain.on("dialog:saveAs", async (event) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender)!;

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    filters: [
      {
        name: "JSON (*.json)",
        extensions: ["json"]
      }
    ]
  });

  if (!canceled) {
    mainWindow.webContents.send("dialog:listTargetPath", { path: filePath });
  }
});

export type AnimeSong = {
  anime: string;
  oped: "Opening" | "Ending" | "OST";
  band: string;
  name: string;
  difficulty: "easy" | "normal" | "hard";
  link: string;
};

export type SongWithId = AnimeSong & { id: string };

export type ListFileContent = {
  author: string;
  songs: AnimeSong[];
};

export type GenerateTrivialBody = {
  embeddableMap: Map<string, boolean>;
  listFileContent: ListFileContent;
  outputDir: string;
};

ipcMain.on("generate:trivial", async (_, body: GenerateTrivialBody) => {
  console.log("Starting trivial generation backend");
  const { listFileContent, outputDir, embeddableMap } = body;

  const songs: SongWithId[] = listFileContent.songs.map((song) => ({
    ...song,
    id: song.link.split("/").at(-1)!
  }));

  await renderTemplate({ songs, author: listFileContent.author, outputDir, embeddableMap });
});
