import 'regenerator-runtime/runtime';
import './scss/main.scss';

import {
    createViewport
} from './js/viewport.js';

import rgbe from './assets/studio_small_03_1k.hdr'
import model from './assets/test.glb'

const main = () => {
    const canvas = document.querySelector('#canvas')
    const v = createViewport(canvas, rgbe, model);
    v.init();
}

main();