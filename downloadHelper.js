import fs from 'fs';
import https from 'https';

export async function downloadFile(url, targetFile, s) {
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

  export async function makeHttpRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            resolve(JSON.parse(data));
          });
        } else {
          reject(new Error('Error while downloading manifest'));
        }
      }).on('error', (error) => {
        reject(error);
      });
    });
  }
  
  export async function downloadLabyVersions() {
    return await makeHttpRequest('https://releases.r2.labymod.net/api/v1/channels.json');
  }
  
  export async function downloadSpecificMC(channel) {
    return await makeHttpRequest(`https://laby-releases.s3.de.io.cloud.ovh.net/api/v1/manifest/${channel}/latest.json`);
  }

  export async function downloadAssets(channel, commitReference, name, checksum, s, targetFile) {
    s.message('Downloading LabyMod-4.jar');
    return await new Promise((resolve, reject) => {
      https
        .get(`https://releases.r2.labymod.net/api/v1/download/assets/labymod4/${channel}/${commitReference}/${name}/${checksum}.jar`, (response) => {
          if (response.statusCode === 200) {
            const file = fs.createWriteStream(targetFile);
            response.pipe(file);
            file.on('finish', () => {
              file.close(() => {
                resolve(true);
                s.message(`Finished downloading ${name}`);
              });
            });
          } else {
            reject(false);
            s.message(`Finished downloading ${name}`);
          }
        })
        .on('error', (error) => {
          reject(error);
          s.message(`Error while downloading ${name}`);
        });s
    });
  }