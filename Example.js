import * as Gluon from '@gluon-framework/gluon';
import { createWebSocketStream } from 'ws';

const Window = await Gluon.open('./Web/index.html');

Window.ipc.store.config = {
    labypath: "none"
};

Window.ipc.download = (path) => {
    console.log(path);
        Window.ipc.store.config.labypath = path;

};

Window.ipc.on('get good', (event, arg) => {
    console.log("ARF");
    return Window.ipc.store.config.labypath;
});

Window.ipc.on('get good2', (event, arg) => {
    console.log("ARF2");
    Window.ipc.store.config.labypath = "wuffwuff";
    console.log(Window.ipc.store.config.labypath);
    console.log(Window.ipc.store.config);
    return Window.ipc.store.config.labypath;
});

console.log(Window.ipc.store.config);

async function initWindow() {
    await Window.page.loaded;
}

initWindow();
