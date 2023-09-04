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

async function determinOS() {
  let OS = "";
  if (process.platform === "win32") {
    OS = "windows";
  } else if (process.platform === "linux") {
    OS = "linux";
  } else if (process.platform === "darwin") {
    OS = "macos";
  } else {
    console.log("Unsupported OS");
  }
  return OS;    
}

async function libHelper()