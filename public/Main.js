const { BrowserWindow, app } = require('electron')

// const winURL = process.env.NODE_ENV === 'Aadit'
//   ? `http://localhost:3000`
//   : `http://www.google.com`

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#2e2c29', //hexadecimal
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true
    }

  })
  // win.loadURL('public/index.html')
  win.loadURL("http://localhost:3000")

  // win.loadURL(winURL)

}

app.whenReady().then(createWindow)
