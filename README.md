
# Rust Download Folder Monitor

One of by biggest pet peeves as a server owner is working with developers and getting version after version fired at me to upload to servers. 

If you're untidy like myself you end up with `PluginName (1).cs` and to be honest having to delete the original and rename the duplicate annoyed the everloving hell out of me.

We solved this in this script by monitoring the downloads folder for new files, upon seeing a new file of `.json` or `.cs` type we'll move the original version to a new folder created in Downloads.

NOTE: This will only keep 2 versions - The Latest and the Previous.

# Possible Future Updates

- Full Backups of every version of your files organised into folders with dates/times.
- Ability to monitor for any filetypes specified in config

## Features

- Generates Password 12-128 depending on  input
- Copies to Clipboard




## Installation

Ensure Node.js is installed on the local machine

Install Packages using
```
npm i
```
Run the Bot using
```
node index.js
```
    
I wholeheartedly suggest you install this with NSSM so you don't need to run it when using it.
