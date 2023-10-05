import * as Gluon from '@gluon-framework/gluon';
import fs from 'fs';
import {
  downloadLabyVersions,
  downloadSpecificMC,
  downloadFile,
  downloadAssetsGUI,
  checkIfFileExists,
} from './downloadHelper.js';
import crypto from 'crypto';

const Window = await Gluon.open('index.html', {
  windowSize: [700, 500],
});

Window.ipc.store.config = {
  labypath: 'none',
  labyBuild: [],
  labyVersions: [],
  selectedVersion: '',
  commitReference: '',
  assets: [],
  status: 'idle',
};

Window.ipc.determineVersions = async (channel) => {
  var arr = [];
  Window.ipc.store.config.selectedVersion = channel;
  Window.ipc.store.config.labyVersions = await downloadSpecificMC(channel).then(
    (result) => {
      for (let i = 0; i < result.minecraftVersions.length; i++) {
        arr.push(result.minecraftVersions[i].version);
      }
      Window.ipc.store.config.commitReference = result.commitReference;
      Window.ipc.store.config.assets = result.assets;
    }
  );
  Window.ipc.store.config.labyVersions = arr;
};

Window.ipc.getLabyBuild = () => {
  return Window.ipc.store.config.labyBuild;
};

Window.ipc.updateLog = (message) => {
  Window.ipc.store.config.status = message;
};

Window.ipc.getLog = () => {
  return Window.ipc.store.config.status;
};

Window.ipc.getMCBuild = () => {
  return Window.ipc.store.config.labyVersions;
};

Window.ipc.on('yeet', (event, arg) => {
  return Window.ipc.store.config;
});

Window.ipc.download = (path, version) => {
  Window.ipc.store.config.labypath = path;
  try {
    checkIfFileExists(path);
  } catch (err) {
    console.error(err);
    return 'Error, path does not exist!';
  }

  var downloadPath = path.replace(/\\/g, '/');
  let labyDownloadPath = path.toString() + '/libraries/';

  if (!fs.existsSync(labyDownloadPath)) {
    fs.mkdirSync(labyDownloadPath, {
      recursive: true,
    });
  }

  let assetPath = downloadPath.toString() + '/.minecraft/labymod-neo/assets/';
  let commit = Window.ipc.store.config.commitReference;
  let channel = Window.ipc.store.config.selectedVersion;
  let assets = Window.ipc.store.config.assets;

  let downloadString = `https://laby-releases.s3.de.io.cloud.ovh.net/api/v1/download/labymod4/${channel}/${commit}.jar`;

  Window.ipc.store.config.status = 'Downloading LabyMod-4.jar...';

  downloadFile(
    downloadString,
    labyDownloadPath.toString() + 'LabyMod-4.jar'
  ).then((result) => {
    Window.ipc.store.config.status = 'Downloading Assets...';
    for (const asset in assets) {
      if (assets.hasOwnProperty(asset)) {
        const checksum = assets[asset];
        const assetFilePath = assetPath.toString() + asset + '.jar';

        if (checkIfFileExists(assetFilePath)) {
          fs.readFile(assetFilePath, function (err, data) {
            if (err) {
              console.error('Error reading file: ' + err);
              return;
            }
            const hash = crypto.createHash('sha1').update(data).digest('hex');

            if (hash === checksum) {
              return;
            } else {
              fs.unlinkSync(assetFilePath);
              downloadAssetsGUI(
                channel,
                commit,
                asset,
                checksum,
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
          downloadAssetsGUI(channel, commit, asset, checksum, assetFilePath);
        }
      }
    }
    result = true;
    Window.ipc.store.config.status = 'Done!';
  });
};

Window.ipc.on('populate', (event, arg) => {
  Window.ipc.store.config.labyBuild = downloadLabyVersions();
  return 'Succies';
});

Window.ipc.on('populateMC', (event, arg) => {
  Window.ipc.store.config.labyVersions = arr;
  return 'Succies';
});

async function initWindow() {
  await Window.page.loaded;
}

initWindow();
