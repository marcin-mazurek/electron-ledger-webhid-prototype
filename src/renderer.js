const { listen } = require("@ledgerhq/logs");
const {
  Ada: AppAda,
  utils,
} = require("@cardano-foundation/ledgerjs-hw-app-cardano");
const { default: TransportWebHID } = require("@ledgerhq/hw-transport-webhid");

const initial =
  "<p>Connect your Nano and open the Cardano app. Click the button below to start...</p>";
const $main = document.getElementById("main");
$main.innerHTML = initial;

document.getElementById("connect").addEventListener("click", async () => {
  $main.innerHTML = initial;

  try {
    const transport = await TransportWebHID.create(1000 * 5);

    listen((log) => console.log(log));

    const appAda = new AppAda(transport);

    console.log(await appAda.getVersion());

    const { publicKeyHex } = await appAda.getExtendedPublicKey({
      path: utils.str_to_path("1852'/1815'/0'"),
    });

    const h2 = document.createElement("h2");
    h2.textContent = publicKeyHex;
    $main.innerHTML = "<h2>Your first Cardano address:</h2>";
    $main.appendChild(h2);
  } catch (e) {
    console.error(e);
    const $err = document.createElement("code");
    $err.style.color = "#f66";
    $err.textContent = String(e.message || e);
    $main.appendChild($err);
  }
});

document.getElementById("test-web-hid").addEventListener("click", async () => {
  const grantedDevices = await navigator.hid.getDevices();
  console.log(grantedDevices);
  let grantedDeviceList = "";
  grantedDevices.forEach((device) => {
    grantedDeviceList += `<hr>${device.productName}</hr>`;
  });
  document.getElementById("granted-devices").innerHTML = grantedDeviceList;
  const grantedDevices2 = await navigator.hid.requestDevice({
    filters: [],
  });
  console.log(grantedDevices2);

  grantedDeviceList = "";
  grantedDevices2.forEach((device) => {
    grantedDeviceList += `<hr>${device.productName}</hr>`;
  });
  document.getElementById("granted-devices2").innerHTML = grantedDeviceList;
});
