const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  mainWindow.webContents.session.on(
    "select-hid-device",
    (event, details, callback) => {
      event.preventDefault();
      console.log("select-hid-device event:", event);
      console.log("select-hid-device details:", details);
      if (details.deviceList && details.deviceList.length > 0) {
        callback(details.deviceList[0].deviceId);
      }
    }
  );

  mainWindow.webContents.session.on("hid-device-added", (event, device) => {
    console.log("hid-device-added FIRED WITH", device);
  });

  mainWindow.webContents.session.on("hid-device-removed", (event, device) => {
    console.log("hid-device-removed FIRED WITH", device);
  });

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "hid" && details.securityOrigin === "file:///") {
        return true;
      }
    }
  );

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "hid" && details.origin === "file://") {
      return true;
    }
  });

  mainWindow.loadFile(path.resolve("dist/index.html"));

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.commandLine.appendSwitch("disable-hid-blocklist");

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
