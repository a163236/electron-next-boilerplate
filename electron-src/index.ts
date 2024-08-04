// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, dialog } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

async function handleFileOpen(){
  const { canceled, filePaths } = await dialog.showOpenDialog({}); 
  if (!canceled){
    return filePaths[0]
  }
}

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
});

app.whenReady().then(() => {
  // listen the channel `message` and resend the received message to the renderer process
  ipcMain.on("message", (event: IpcMainEvent, message: any) => {
    console.log("Hi from electron");
    setTimeout(() => event.sender.send("message", message), 500);
  });

  ipcMain.handle('dialog:openFile', handleFileOpen)
})

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
