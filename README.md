# Badge Scanner

Example Web App which connects to a RoomOS device and displays badge scans

![WebApp Screenshot](/images/screenshot1.png)

## Overview

This Web App connected directly to a RoomOS device via a WebSocket connection and monitors badge scans from an Identification Badge scanner connected to the RoomOS Device.

Many USB Badge Scanners support keyboard emulation and generate keystrokes for the scanned badge. The Web App monitors and collects these keystrokes via the xAPI Event [xEvent UserInterface InputDevice Key Action](https://roomos.cisco.com/xapi/Event.UserInterface.InputDevice.Key.Action/) to build an identification string.

Once the identification string had been collected, it is displayed as a pop-up modal alert for the Web App operator to easily copy and paste into their identification tools.



## Setup

### Prerequisites & Dependencies: 

- Is this dependant on having another repo
- Insert pre-requisites in bullets
- Insert pre-requisite here  Also state any assumptions that you may have made about the user.
- Limit nested bullets


<!-- GETTING STARTED -->

### Installation Steps:
1.  Include step one here
    ```sh
    insert line of code here if applicable
    ```
2.  Insert step two here
    Insert screenshot, if applicable
    
    
    
## Demo

<!-- Keep the following statement -->
*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).




## License

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer

Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex usecases, but are not Official Cisco Webex Branded demos.


## Questions
Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=badge-scanner) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team. 
