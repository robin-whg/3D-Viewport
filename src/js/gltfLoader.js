import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader';

import { sortByName } from './utils'

export default function initGLTF(scene, gltf) {
    return new Promise((resolve, reject) => {

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

        new GLTFLoader()
            .setDRACOLoader(dracoLoader)
            .load(
                gltf,
                data => {
                    const root = data.scene;
                    scene.add(root);
                    const objects = root.children;
                    sortByName(objects);
                    console.log(objects);
                    resolve(objects);
                },
                xhr => {
                    console.log(`Scene ${Math.floor( xhr.loaded / xhr.total * 100 )}% loaded`);
                },
                err => {
                    reject(new Error(err));
                }
            );

    })
}