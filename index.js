const { app, Menu, Tray, BrowserWindow } = require("electron");
const path = require('path')
Menu.setApplicationMenu(false)


function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 600,
    frame: true,
    resizable: true,
    icon:'icon.png',
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation : false,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
    },
  });
  win.loadFile("mainpage.html");

  win.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  win.on("browser-window-created", function (e, window) {
    Menu.setApplicationMenu(false)
  });
}

process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  }
);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(createWindow);
