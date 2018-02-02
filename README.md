# README

This project is meant to be the native application for "https://github.com/nextgenappsllc/location_share_api".

Using this project with the api you can share your location and view shared locations using websocket connections to update.

## Setup

Complete setup at "https://github.com/nextgenappsllc/location_share_api"

`git clone https://github.com/nextgenappsllc/LocationShare.git`

`cd LocationShare`

`npm i`
(You may need to link packages as well)

`open ios/LocationShare.xcodeproj`

Change the BaseURL in App.js to the IP of your machine with port of the api (usually 3000) followed by a slash.

Install in simulator and on your ios device. (Requires a developer account)


## Instructions
* Open on your device and in the simulator.

* Share your location on your device.

* The location will now appear in the simulator, click it.

* Move your device around and watch it change in the simulator.


## Pending
* Tests!

* Use shared websocket for all subscriptions even between scenes

* Add callbacks for navigation actions

* Store security token in local storage once implemented


## Known problems
* Screen locking closes the web socket and thus deletes the shared location.

* Home screen does not refresh when navigating back to it.