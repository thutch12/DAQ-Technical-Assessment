# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Telemetry

1) 
My first thought was to run the server through docker to check the output. Reading the error messages when the server crashed I saw that the emulator was passing out bad JSON with addded closing braces. In order to prevent this from crashing the server I added a try.. catch block and moved the websocket client.send into the try block, this filtered out the bad JSON from coming from the data emulator and prevented the incorrect JSON from being fowarded to the frontend. 

Possible Improvements:
Assuming the issue of extra closing braces causing incorrect JSON was a common issue, a slice could be used to remove the brace and fix the structure. This would be inside of an additional try.. catch block to ensure that there are no additional errors after the slice. However I did not implement this, as in a real world application hard-coding a solution to an improper data structure would be an ineffective long-term solution compared to addressing the improper structure at the source.

2) 
I decided to use an array which would hold the timestamps of the temps exceeding the range. After a value is added to the array it is then filtered to remove values exceeding 5000ms or 5 seconds old using the current timestamp to compare. If the value of this array exceeds the limit of 3 an error is printed along with the timestamp. This task was fairly straightfoward and I didnt run into any issues during the implementation.

Possible Improvements:
If the dataset was larger and required more efficient data-handling a different solution such as a hash-map could be implemented to improve the performance. However, this would increase the memory load and would likely not be the most optimal solution for tracking smaller temperature datasets coming from the car battery.

3) 
It had been awhile since I had interacted with CSS so when first approaching this I thought I would have to input colour codes however I was pleasantly suprised to find I could just use if statements and pass through the names of the colours and the framework would handle the rest. For my improvements to the style I thought that leaving everything simple would make the system easier to use when in the field, so I brainstormed and decided that a light mode could be beneficial. I had issues with the size of the html elements not covering the entire page and leaving part of the page black, but eventually I found a way to set the minimum height of the app to 100 which solved the issue. In order to implement this I utilised some generative AI to assist as my CSS skills are rusty.

Possible Improvements: 
When in light mode it is difficult to read the yellow text on the white background, a way to fix this could be changing the colour of the text or keeping a dark box behind the temperature text to improve readability.


## Cloud