import {
    UnsignedByteType,
    PMREMGenerator
} from 'three';

import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader';

export default function loadHDR(renderer, scene, hdr) {
    return new Promise((resolve, reject) => {

        new RGBELoader()
        .setDataType(UnsignedByteType)
        .load(
            hdr,
            texture => {
                const pmremGenerator = new PMREMGenerator(renderer);
                pmremGenerator.compileEquirectangularShader();
                const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                scene.environment = envMap;
                texture.dispose();
                pmremGenerator.dispose();
                resolve();
            },
            xhr => {
                console.log(`HDR ${Math.floor( xhr.loaded / xhr.total * 100 )}% loaded`);
            },
            err => {
                reject(new Error(err));
            }
        );  
        
    })
}