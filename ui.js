import * as Gluon from '@gluon-framework/gluon';
import { createWebSocketStream } from 'ws';
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
    console.log("NANI");
    Window.ipc.store.config.selectedVersion = channel;
    Window.ipc.store.config.labyVersions = await downloadSpecificMC(channel);
};

Window.ipc.getLabyBuild = () => {
    console.log("ARF");
    //console.log(Window.ipc.store.config.labyBuild);
    return Window.ipc.store.config.labyBuild;
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

Window.ipc.on('get good2', (event, arg) => {
    console.log("ARF2");
    Window.ipc.store.config.labypath = "wuffwuff";
    console.log(Window.ipc.store.config.labypath);
    console.log(Window.ipc.store.config);
    return Window.ipc.store.config.labypath;
});


async function initWindow() {
    await Window.page.loaded;
}

initWindow();
