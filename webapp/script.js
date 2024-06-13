const ipAddress = document.getElementById("ipAddress");
const username = document.getElementById("username");
const password = document.getElementById("password");
const cardTitle = document.getElementById("cardTitle");
const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");
const cancelButton = document.getElementById("cancelButton");
const buttonGroup = document.getElementById("buttonGroup");
const waitingText = document.getElementById("waitingText");
const scanModal = document.getElementById("scanModal");
const connectModal = document.getElementById("connectModal");
const badgeText = document.getElementById("badgeText");
const connectionStatus = document.getElementById("connectionStatus");
const historyBody = document.getElementById("historyBody");

let creds;
let xapi;
let keySequence = [];
let keyCombo = [];

const restored = localStorage.getItem("checkpointCreds");
if (restored) creds = JSON.parse(atob(restored));
if (creds) {
  connect();
} else {
  showDisconnected();
}

console.log("creds", creds);

function connect() {
  if (!creds) creds = getInputs();

  if (!creds) {
    console.log("No Credes");
    return;
  }

  console.log("Connecting:", creds);

  jsxapi
    .connect("wss://" + creds.ipAddress, {
      username: creds.username,
      password: creds.password,
    })
    .on("error", console.error)
    .on("ready", async (connection) => {
      xapi = connection;
      localStorage.setItem("checkpointCreds", btoa(JSON.stringify(creds)));
      updateBadgeScanTable();
      console.log("Connected");
      closeAllModals();
      const deviceName = await xapi.Status.UserInterface.ContactInfo.Name.get();
      showConnected(deviceName);

      // Subscribe to Key Action Events and Process them
      xapi.Event.UserInterface.InputDevice.Key.Action.on(processKeyEvents);

      xapi.Event.FarEndMessage.Receive.on(processFarEndMessage);
    });
}

function processFarEndMessage(event){

    // event = { MSG: string, Type: string}

    const type = event?.Type;
    const keyCode = event?.Msg;

    if(type != 'badgescan') return
    displayScan(keyCode);
    storeBadgeScan(keyCode);
    updateBadgeScanTable();
}

async function processKeyEvents(event) {
  console.debug(event);

  const key = event.Key.split("_").pop().toLowerCase();

  // Store all new keys except an 'enter' key to the keyCombo array
  if (event.Type == "Pressed" && key != "enter") {
    keyCombo.push(key);
    return;
  }

  // Transfer keyCombos to KeySequence and handle uppercasing
  if (event.Type == "Released" && key != "enter") {
    if (keyCombo.length == 2 && keyCombo[0].endsWith("shift")) {
      console.log("Storing Key:", key);
      keySequence.push(keyCombo.pop().toUpperCase());
      keyCombo = [];
    } else {
      console.log("Adding to sequence Key:", keyCombo);
      keySequence.push(keyCombo.pop());
    }
    return;
  }

  // Once 'enter' released detected, output the collected key sequence and reset buffer
  if (event.Type == "Released" && key == "enter") {
    const keyCode = keySequence.join("");
    console.log('New Badge Scan Received:', keyCode)
    const inCall = await checkIfInCall();
    if(inCall){
        console.log('Currently in call - displaying scan alert')
        displayScan(keyCode);
        storeBadgeScan(keyCode);
        updateBadgeScanTable();
    } else {
        console.log('Not currently in call - not displaying scan alert')
    }
    keySequence = [];
  }
}

async function checkIfInCall(){
    if(!xapi) return
    const call = await xapi.Status.Call.get();
    return call?.[0]?.Status == 'Connected';
}

function disconnect() {
  if (creds) {
    console.log("Signing Out");
    localStorage.removeItem("checkpointCreds");
    window.location.reload();
    clearBadgeScans();
  }
}

function cancelConnect() {
  clearInputs();
  closeAllModals();
}

function getInputs() {
  return {
    ipAddress: ipAddress.value,
    username: username.value,
    password: password.value,
  };
}

function clearInputs() {
  ipAddress.value = "";
  username.value = "";
  password.value = "";
}

function hideElement(element) {
  element.style.visibility = "hidden";
  element.style.display = "none";
}

function showElement(element) {
  element.style.visibility = "visible";
  element.style.display = "block";
}

function displayScan(code) {
  badgeText.value = code;
  openModal(scanModal);
}

function showDisconnected() {
  connectionStatus.innerHTML = "Not Connected";
  hideElement(buttonGroup);
  hideElement(waitingText);
  showElement(connectButton);
}

function showConnected(workspaceName) {
  hideElement(connectButton);
  showElement(waitingText);
  showElement(buttonGroup);
  console.log("Device Name", workspaceName);
  connectionStatus.innerHTML = "Connected:</br>" + workspaceName;
}

function storeBadgeScan(scan) {
  const localTimestamp = new Date().toLocaleString(window.navigator.language);
  const newRecord = { timestamp: localTimestamp, scan };
  const recoveredScans = localStorage.getItem("previousScans");
  if (recoveredScans) {
    const scans = JSON.parse(atob(recoveredScans));
    
    //scans.unsift(newRecord);
    const newScans = [newRecord, ...scans]
    console.log('newScans',newScans)
    if (newScans.length > 10) newScans.pop();
    localStorage.setItem("previousScans", btoa(JSON.stringify(newScans)));
  } else {
    const scans = [newRecord];
    localStorage.setItem("previousScans", btoa(JSON.stringify(scans)));
  }
}

function loadBadgeScans() {
  const recoveredScans = localStorage.getItem("previousScans");
  if (recoveredScans) return JSON.parse(atob(recoveredScans));
}

function clearBadgeScans() {
  localStorage.removeItem("previousScans");
}

function updateBadgeScanTable() {
  historyBody.innerHTML = "";
  const scans = loadBadgeScans();
  console.log('scans', scans)
  if (!scans) return;
  const rows = scans.map((record) => {
    const tr = document.createElement("tr");
    const timestamp = document.createElement("td");
    timestamp.innerHTML = record.timestamp;
    const code = document.createElement("td");
    code.innerHTML = record.scan;
    tr.appendChild(timestamp);
    tr.appendChild(code);
    return tr
  });
  console.log(rows)

  historyBody.append(...rows);
  
}

function copyToClipboard() {
  const currentValue = badgeText.value;
  navigator.clipboard.writeText(currentValue);
  console.log("Copied to Clipboard", currentValue);
}

// Functions to open and close a modal
function openModal($el) {
  $el.classList.add("is-active");
}

function closeModal($el) {
  $el.classList.remove("is-active");
}

function closeAllModals() {
  (document.querySelectorAll(".modal") || []).forEach(($modal) => {
    closeModal($modal);
  });
}

// Add a click event on buttons to open a specific modal
(document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
  const modal = $trigger.dataset.target;
  const $target = document.getElementById(modal);

  $trigger.addEventListener("click", () => {
    openModal($target);
  });
});

// Add a click event on various child elements to close the parent modal
(
  document.querySelectorAll(
    ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
  ) || []
).forEach(($close) => {
  const $target = $close.closest(".modal");

  $close.addEventListener("click", () => {
    closeModal($target);
  });
});

// Add a keyboard event to close all modals
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllModals();
  }
});
