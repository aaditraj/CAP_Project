const electron = require("electron");

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const globalShortcut = electron.globalShortcut

const path = require("path");

const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680, backgroundColor: "#151b21", webPreferences: {contextIsolation: true}});


  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`)


  mainWindow.on("closed", () => (mainWindow = null));
  
  globalShortcut.register('CommandOrControl+R', function() {
		console.log('CommandOrControl+R is pressed')
		mainWindow.reload()
	})
}

app.on("ready", createWindow);

app.on(
  "window-all-closed",
  () => process.platform !== "darwin" && app.quit() // "darwin" targets macOS only.
);


app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
})
