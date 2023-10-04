const { exec } = require("child_process");

export function FixManifest(Manifest) {
  // read manifest as json
  let ManifestJSON = JSON.parse(Manifest); // get all versions
}


async function fixDownloads(ManifestJSON) {
  ManifestJSON.downloads.forEach(download => {
    // if download isnt "client", remove the entry
    if (download.name != "client") {
      ManifestJSON.downloads.splice(ManifestJSON.downloads.indexOf(download), 1);
    }
  });
  return ManifestJSON;
}
