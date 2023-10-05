import * as Gluon from '@gluon-framework/gluon';
import { downloadLabyVersions, downloadSpecificMC } from './downloadHelper.js';

const Window = await Gluon.open('./Web/index.html', {
    windowSize: [ 700, 500 ],
});

Window.ipc.store.config = {
    labypath: "none",
    labyBuild: [],
    labyVersions: [],
    selectedVersion: "",
};

Window.ipc.determineVersions = async (channel) => {
    var arr = [];
    Window.ipc.store.config.selectedVersion = channel;
    Window.ipc.store.config.labyVersions = await downloadSpecificMC(channel).then((result) => {
        for (let i = 0; i < result.minecraftVersions.length; i++) {
            arr.push("'" + result.minecraftVersions[i].version + "'");
        }
    });
    Window.ipc.store.config.labyVersions = arr;
};

Window.ipc.getLabyBuild = () => {
    return Window.ipc.store.config.labyBuild;
}

Window.ipc.getMCBuild = () => {
    return Window.ipc.store.config.labyVersions;
}

Window.ipc.on('yeet', (event, arg) => {
    console.log(Window.ipc.store.config);
    return Window.ipc.store.config;
});

Window.ipc.download = (path) => {
    console.log(path);
    Window.ipc.store.config.labypath = path;
};

Window.ipc.on('populate', (event, arg) => {
    console.log("Populating");
    Window.ipc.store.config.labyBuild = downloadLabyVersions();
    console.log(Window.ipc.store.config.labyBuild);
    return "Succies";
});

async function initWindow() {
    await Window.page.loaded;
}

initWindow();
