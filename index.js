import { text, intro, outro, spinner, confirm } from '@clack/prompts';
import fs from 'fs';
import https from 'https';
import { downloadLabyVersions } from './downloadHelper';

const s = spinner();

intro('LabyMod Downloader');

let labyProdChannel = await downloadLabyVersions();

let labyVersions = [];
for (let i = 0; i < labyProdChannel.length; i++) {
  if (
    labyProdChannel[i].name != 'snapshot' &&
    labyProdChannel[i].name != 'production'
  ) {
    continue;
  } else {
    labyVersions.push({
      value: labyProdChannel[i].name,
      label: labyProdChannel[i].name,
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
    'e.g. C:/Users/Admin/AppData/Roaming/PrismLauncher/instances/LabyMod-4-1.19.4/libraries',
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
async function downloadFile(url, targetFile) {
  s.message('Downloading LabyMod-4.jar');
  return await new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(targetFile);
          response.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              resolve(true);
              s.message('Finished Downloaded LabyMod-4.jar');
            });
          });
        } else {
          reject(false);
          s.message('Finished Downloaded LabyMod-4.jar');
        }
      })
      .on('error', (error) => {
        reject(error);
        s.message('Error while downloading LabyMod-4.jar');
      });
  });
}

s.start('Checking if LabyMod-4.jar exists');
downloadPath = downloadPath.toString() + '/';
// remove \\ and replace with /
downloadPath = downloadPath.replace(/\\/g, '/');
if (checkIfFileExists(downloadPath.toString() + 'LabyMod-4.jar') == true) {
  // delete file
  const shouldContinue = await confirm({
    message: 'Do you want to backup the old LabyMod-4.jar?',
  });
  if (shouldContinue) {
    await fs.renameSync(
      downloadPath.toString() + 'LabyMod-4.jar',
      downloadPath.toString() + 'LabyMod-4.jar.old'
    );
  }
  s.message('Renamed LabyMod-4.jar to LabyMod-4.jar.old');
}

s.message('LabyMod-4.jar does not exist');
let downloadString = `https://laby-releases.s3.de.io.cloud.ovh.net/api/v1/download/labymod4/${releaseChannel}/${version}.jar`;
await downloadFile(downloadString, downloadPath.toString() + 'LabyMod-4.jar');
s.stop();

outro('LabyMod Downloader complete!');
