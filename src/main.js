import 'regenerator-runtime/runtime';
import './scss/main.scss';
import $ from "jquery";

import createViewport from './js/viewport.js';

import hdr from './assets/studio_small_03_1k.hdr'
import model from './assets/test.glb'

const main = async () => {
    const canvas = document.querySelector('#canvas')
    const v = await createViewport(canvas, hdr, model)
    const objects = await v.loadModel(model)
}

main();