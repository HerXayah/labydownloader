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

export async function downloadLabyVersions() {
    let file = await new Promise((resolve, reject) => {
        // get manifest from url
        https.get(`https://releases.r2.labymod.net/api/v1/channels.json`, response => {
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
    return file;
}

export async function downloadSpecificMC(channel) {
    let file = await new Promise((resolve, reject) => {
        // get manifest from url
        https.get(`https://laby-releases.s3.de.io.cloud.ovh.net/api/v1/manifest/${channel}/latest.json`, response => {
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
    return file;
}