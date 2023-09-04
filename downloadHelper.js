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