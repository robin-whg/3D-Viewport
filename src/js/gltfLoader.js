import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader';

import {
    sortByName
} from './utils'

// loader support drace compressed gltf files but not .drc files
export default function loadGLTF(scene, gltf) {
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
                    const progress = Math.floor(xhr.loaded / xhr.total * 100)
                    console.log(`Model ${progress}% loaded`);
                    //emit event with the current loading progress
                    const event = new CustomEvent('loadingProgress', {
                        detail: {
                            progress
                        }
                    })
                    window.dispatchEvent(event)
                },
                err => {
                    reject(new Error(err));
                }
            );

    })
}