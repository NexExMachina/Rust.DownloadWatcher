const config = require('./config/config.json')
const chokidar = require('chokidar');
const fs = require("fs");

let watcher = null;

//Check Folder to move old plugins exists if not create it
function checkStorageExists() {
    let storageExists = false;

    try{
        const dir = `${config.downloadDirectory}\\Old Files`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        storageExists = true;
    } catch (error) {
        console.warn('Error occurred validating storage', error);
    }

    return storageExists;
}

//Monitor Downloads
async function monitorDownloads() {
    try {
        watcher.on('add', async function (path, event) {
            const fileName = pathStrip(path);

            if (validateType(fileName) && validateDuplicates(fileName)) {
                //wait for first rename
                await fs.rename(`${config.downloadDirectory}\\${originalFile(fileName)}`, `${config.downloadDirectory}\\Old Files\\${originalFile(fileName)}`, async function (error) {
                    if (error) {
                        console.warn('Failed to rename file at directory', `${config.downloadDirectory}\\${originalFile(fileName)}`, error);
                        return;
                    }

                    console.info('Successfully moved old version to folder');

                    //on first success wait for second rename
                    await fs.rename(`${config.downloadDirectory}\\${fileName}`, `${config.downloadDirectory}\\${originalFile(fileName)}`, function (error) {
                        if (error) {
                            console.warn('Failed to rename file at directory', `${config.downloadDirectory}\\${originalFile(fileName)}`, error);
                            return;
                        }

                        console.info('Successfully updated new version name');
                    })
                });
            }
        });
    } catch (error) {
        console.warn('Error occurred during monitor process', error);
    }
}

//Find Original Filename
function originalFile(fileName){
    const regEx = / \([0-9]{1,10}\)/gm
    return fileName.replace(regEx, "")
}

//Strip Filename
function pathStrip(path) {
    return path.replace(config.downloadDirectory, "").replace("\\", "")
}

//Only want to check our specified filetypes
function validateType(fileName) {
    let toReturn = false;

    try {
        if (config.checkForCS === true) {
            if (fileName.endsWith(".cs")) {
                toReturn = true;
            }
        }

        if (!toReturn) {
            if (config.checkForJSON === true) {
                if (fileName.endsWith(".json")) {
                    toReturn = true;
                }
            }
        }

        if (!toReturn) {
            console.warn('File checked is not an associated file type', fileName);
        }

    } catch (error) {
        console.error('Error occurred when checking file type', fileName, error);
    }

    return toReturn;
}

//Check for Dupes
function validateDuplicates(fileName) {
    let toReturn = false;

    try{
        const regEx = / \([0-9]{1,10}\)/gm

        if(fileName.match(regEx)){
            toReturn = true;
        }
    } catch (error) {
        console.log('Failed to validate duplicates', error);
    }

    return toReturn;
}

//start function service to initialize storage, watcher and parameters
async function startService() {
    let storageExists = checkStorageExists();

    if (storageExists) {
        console.log('Directories validated, starting monitor');

        //https://medium.com/@ashusingh584/chokidar-11290855e2cb
        //Initialize the water here with some parameters
        //Introducing the stability threshhold ensures file size of
        //detected files must remain constant for atleast the provided time
        watcher = chokidar.watch(config.downloadDirectory, {
            awaitWriteFinish: {
                stabilityThreshold: 1000,
                pollInterval: 100
            }
        });

        monitorDownloads();
    }
}

startService();