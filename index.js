import { text, intro, outro, spinner, confirm, select } from '@clack/prompts';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';
import {
  downloadLabyVersions,
  downloadSpecificMC,
  downloadFile,
  downloadAssets,
} from './downloadHelper.js';

// https://releases.r2.labymod.net/api/v1/channels.json

// https://releases.r2.labymod.net/api/v1/download/assets/labymod4/

// String channel, String commitReference, String name, String checksum
// /%s/%s/%s/%s.jar

const s = spinner();

intro('LabyMod Downloader');

let labyProdChannel = await downloadLabyVersions(s);

let labyVersions = [];
for (let i = 0; i < labyProdChannel.length; i++) {
  // if not production or snapshot, skip
  if (labyProdChannel[i] != 'production' && labyProdChannel[i] != 'snapshot') {
    continue;
  } else {
    labyVersions.push({
      value: labyProdChannel[i],
      label: labyProdChannel[i],
    });
  }
}

let releaseChannel = await select({
  message: 'Which release channel do you want to download?',
  // only include snapshot and production
  options: JSON.parse(JSON.stringify(labyVersions)),
  required: true,
});

let labyMCVersions = await downloadSpecificMC(releaseChannel);
let mcversions = [];
for (let i = 0; i < labyMCVersions.minecraftVersions.length; i++) {
  mcversions.push({
    value: labyMCVersions.minecraftVersions[i].version,
    label: labyMCVersions.minecraftVersions[i].version,
  });
}

let version = await select({
  message: 'What version of LabyMod do you want to download?',
  // only include snapshot and production
  options: JSON.parse(JSON.stringify(mcversions)),
  required: true,
});

let downloadPath = await text({
  message: 'Now enter the path to your MultiMC/Prism Instance Folder',
  placeholder:
    'e.g. C:/Users/Admin/AppData/Roaming/PrismLauncher/instances/LabyMod-4-1.19.4',
  validate(value) {
    value.trim();
    if (value.length === 0) return `Value is required!`;
    if (value === 'none') return `Value is required!`;
    // convert \ to /
    value = value.replace(/\\/g, '/');
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

// remove \\ and replace with /
downloadPath = downloadPath.replace(/\\/g, '/');
let labyDownloadPath = downloadPath.toString() + '/libraries/';
// check if path exists, if not, create it
if (!fs.existsSync(labyDownloadPath)) {
  fs.mkdirSync(labyDownloadPath, {
    recursive: true,
  });
}
if (checkIfFileExists(labyDownloadPath.toString() + 'LabyMod-4.jar') == true) {
  // delete file
  const shouldContinue = await confirm({
    message: 'Do you want to backup the old LabyMod-4.jar?',
  });
  if (shouldContinue) {
    await fs.renameSync(
      labyDownloadPath.toString() + 'LabyMod-4.jar',
      labyDownloadPath.toString() + 'LabyMod-4.jar.old'
    );
  }
}

s.message('LabyMod-4.jar does not exist');
let downloadString = `https://laby-releases.s3.de.io.cloud.ovh.net/api/v1/download/labymod4/${releaseChannel}/${labyMCVersions.commitReference}.jar`;
await downloadFile(
  downloadString,
  labyDownloadPath.toString() + 'LabyMod-4.jar',
  s
);
s.message('Now downloading Assets');

let assets = labyMCVersions.assets; // Assuming labyMCVersions.assets is the object you provided

let themeChannel = await select({
  message: 'Which theme channel do you want to download?',
  // only include snapshot and production
  options: [
    {
      value: '1',
      label: 'fancy',
    },
    {
      value: '2',
      label: 'vanilla',
    },
  ],
  required: true,
});

if (themeChannel == '1') {
  // remove vanilla-theme from assets object
  delete assets['vanilla-theme'];
} else if (themeChannel == '2') {
  // remove fancy-theme from assets object
  delete assets['fancy-theme'];
}

let assetPath = downloadPath.toString() + '/.minecraft/labymod-neo/assets/';

for (const asset in assets) {
  if (assets.hasOwnProperty(asset)) {
    s.message('Processing asset: ' + asset);
    const checksum = assets[asset];
    const assetFilePath = assetPath.toString() + asset + '.jar';

    if (checkIfFileExists(assetFilePath)) {
      s.message('Asset ' + asset + ' already exists');
      fs.readFile(assetFilePath, function (err, data) {
        if (err) {
          console.error('Error reading file: ' + err);
          return;
        }
        const hash = crypto.createHash('sha1').update(data).digest('hex');

        if (hash === checksum) {
          s.message('Asset ' + asset + ' already exists and is valid');
        } else {
          s.message('Downloading Asset ' + asset);
          fs.unlinkSync(assetFilePath);
          s.message('Deleted old Asset ' + asset);
          downloadAssets(
            releaseChannel,
            labyMCVersions.commitReference,
            asset,
            checksum,
            s,
            assetFilePath
          );
        }
      });
    } else {
      if (!fs.existsSync(assetPath)) {
        fs.mkdirSync(assetPath, {
          recursive: true,
        });
      }
      s.message('Downloading Asset ' + asset);
      downloadAssets(
        releaseChannel,
        labyMCVersions.commitReference,
        asset,
        checksum,
        s,
        assetFilePath
      );
    }
  }
}

outro('LabyMod Downloader complete!');
