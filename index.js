import { text, intro, outro, spinner, confirm, select  } from '@clack/prompts';
import fs from 'fs';
import https from 'https';


let minecraftJson = {
    "name": `net.labymod:${jsonLabyName}`,
    "url":"https://releases.r2.labymod.net/libraries/",
    "rules": [
    ],
};


intro('LabyMod Downloader');

const s = spinner();

let labyVersions = await select({
    message: 'Select the Branch you want to download.',
    options: [
      { value: 'snapshot', label: 'Snapshot' },
      { value: 'production', label: 'Release' },
    ],
    required: true,
});

// populating versions
let downloadString = `https://laby-releases.s3.de.io.cloud.ovh.net/api/v1/download/labymod4/${labyVersions.toString()}/`;
let version = await text({
    message: 'What version of LabyMod do you want to download?',
    placeholder: 'e.g. 49206d8e',
    validate(value) {
        if (value.length === 0)
            return `Value is required!`;
        if (value === 'none')
            return `Value is required!`;
    },
});

downloadString = downloadString.toString() + version.toString() + ".jar";
let downloadPath = await text({
    message: 'Now enter the path to your MultiMC/Prism Instance Folder',
    placeholder: 'e.g. C:/Users/Admin/AppData/Roaming/PrismLauncher/instances/LabyMod-4-1.19.4',
    validate(value) {
        value.trim();
        if (value.length === 0)
            return `Value is required!`;
        if (value === 'none')
            return `Value is required!`;
        // convert \ to /
        value = value.replace(/\\/g, "/");
    },
});

function checkIfFileExists(path) {
    try {
        if (fs.existsSync(path)) {
            return true;
        }
    } catch (err) {
        console.error(err);
    }
}
async function downloadFile(url, targetFile, filename) {
    s.message('Downloading ' + filename);
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            if (response.statusCode === 200) {
                const file = fs.createWriteStream(targetFile);
                response.pipe(file);
                file.on('finish', () => {
                    file.close(() => {
                        resolve(true);
                        s.message('Finished Downloading ' + filename);
                    });
                });
            } else {
                reject(new Error('Error while downloading ' + filename));
                s.message('Error while downloading ' + filename);
            }
        }).on('error', error => {
            reject(error);
            s.message('Error while downloading ' + filename);
        });
    });
}

let manifest = await new Promise((resolve, reject) => {
    // get manifest from url
    https.get(`https://laby-releases.s3.de.io.cloud.ovh.net/api/v1/manifest/${labyVersions.toString()}/latest.json`, response => {
        if (response.statusCode === 200) {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(JSON.parse(data));
            });
        } else {
            reject(false);
            s.message('Error while downloading manifest')
        }
    }).on('error', error => {
        reject(error);
        s.message('Error while downloading manifest')
    });
});

let versions = [];
for (let i = 0; i < manifest.minecraftVersions.length; i++) {
    versions.push({ value: manifest.minecraftVersions[i].version, label: manifest.minecraftVersions[i].tag });
}

let mcVersions = await select({
    message: 'Select additional tools.',
    options: JSON.parse(JSON.stringify(versions)),
    required: true,
  });

  downloadPath = downloadPath.toString() + "/";
  // remove \\ and replace with /
  downloadPath = downloadPath.replace(/\\/g, "/");
  
s.start('Processing Minecraft JSON');

try {
    await processMinecraftJson();
    s.message('Processed Minecraft JSON');
} catch (error) {
    s.message('Error while processing Minecraft JSON');
    console.error(error);
    process.exit(1);
}

s.message('Checking if LabyMod-4.jar exists');
if (checkIfFileExists(downloadPath.toString() + "libraries/LabyMod-4.jar") == true) {
    // delete file
    const shouldContinue = await confirm({
        message: 'Do you want to backup the old LabyMod-4.jar?',
    });
    if (shouldContinue) {
        await fs.renameSync(downloadPath.toString() + "/libraries/LabyMod-4.jar", downloadPath.toString() + "/libraries/LabyMod-4.jar.old");
    }
    s.message('Renamed LabyMod-4.jar to LabyMod-4.jar.old');
}

s.message('LabyMod-4.jar does not exist');
// if folder does not exist create it
if (!fs.existsSync(downloadPath.toString() + "libraries")) {
    fs.mkdirSync(downloadPath.toString() + "libraries");
    s.message('Created libraries folder');
}
//await downloadFile(downloadString, downloadPath.toString() + "/libraries/LabyMod-4.jar", "LabyMod-4.jar");
s.stop();

outro('LabyMod Downloader complete!');
