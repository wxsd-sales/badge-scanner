/********************************************************
*
* Macro Author:      	William Mills
*                    	Technical Solutions Specialist
*                    	wimills@cisco.com
*                    	Cisco Systems
*
* Version: 1-0-0
* Released: 05/28/24
*
* This is an example macro which captures Key Action events
* from USB RFID card reader and sends the data as a 
*
* Full Readme, source code and license agreement available on Github:
* https://github.com/wxsd-sales/badge-scanner
*
********************************************************/

import xapi from 'xapi';

let keyCombo = []; // Buffer for storing key combos: eg. Shift + A
let keySequence = []; // Buffer for storing key sequence until an 'Enter' key is received

// Enable USB keyboard input support
xapi.Config.Peripherals.InputDevice.Mode.set('On');

// Subscribe to Key Action Events and Process them
xapi.Event.UserInterface.InputDevice.Key.Action.on(processKeyAction);


// Process Key Action events from RFID Scanner Keyboard Emulation key press sequences 
function processKeyAction(event) {
  console.debug(event)

  const key = event.Key.split('_').pop().toLowerCase();

  // Store all new keys except an 'enter' key to the keyCombo array
  if (event.Type == 'Pressed' && key != 'enter') {
    keyCombo.push(key)
    return
  }

  // Transfer keyCombos to KeySequence and handle uppercasing
  if (event.Type == 'Released' && key != 'enter') {
    if (keyCombo.length == 2 && keyCombo[0].endsWith('shift')) {
      console.log('Storing Key:', key)
      keySequence.push(keyCombo.pop().toUpperCase());
      keyCombo = [];
    } else {
      console.log('Adding to sequence Key:', keyCombo)
      keySequence.push(keyCombo.pop());
    }
    return
  }

  // Once 'enter' released detected, output the collected key sequence and reset buffer
  if (event.Type == 'Released' && key == 'enter') {
    const keyCode = keySequence.join('')
    sendScan(keyCode)
    //alert('Key Sequence: ' + keyCode)
    keySequence = [];

  }
}

// Logs and displays alerts to the devices UI
function notification() {
  console.log(text);
  xapi.Command.UserInterface.Message.Alert.Display(
    { Duration: 10, Text: text, Title: 'RFID Scanner Alert' });
}

async function sendScan(keyCode) {
  const call = await xapi.Status.Call.get();
  const inCall = call?.[0]?.Status == 'Connected'
  xapi.Command.Audio.Sound.Play({ Sound: 'Announcement' });
  if (!inCall) {
    console.log('Not in call - not sending badge scan');
    return
  }

  xapi.Command.Call.FarEndMessage.Send({ CallId: call.id, Text: keyCode, Type: 'badgescan' })
    .then(() => notification)
    .catch(error => console.log('FarEndMessage Send Not Available'))
}