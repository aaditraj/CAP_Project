//this file creates an electron window that displays the quiz application

const electron = require("electron");

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const globalShortcut = electron.globalShortcut

const path = require("path");

const isDev = require("electron-is-dev");

let mainWindow;


function createWindow() {
  //specifying window properties
  mainWindow = new BrowserWindow({width: 900, height: 680, backgroundColor: "#FFFFFF", webPreferences: {contextIsolation: true}});

  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`)

  mainWindow.on("closed", () => (mainWindow = null));
  
  globalShortcut.register('CommandOrControl+R', function() {
		mainWindow.reload()
	})
}

app.on("ready", createWindow);

//if window is closed, quit the application
app.on(
  "window-all-closed",
  () => process.platform !== "darwin" && app.quit() // "darwin" targets macOS only.
);

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
})
