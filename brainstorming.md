# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Telemetry

Using docker to read the error messages when the server crashed I saw that the emulator was passing out bad JSON with addded closing braces. In order to prevent this from crashing the server I added a try.. catch and moved the JSON over websocket send into the try, this prevented bad JSON from being sent to the frontend, and the error catch prints out the error message.
## Cloud