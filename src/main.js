import 'regenerator-runtime/runtime';
import './scss/main.scss';
import $ from "jquery";

import createViewport from './js/viewport.js';

import rgbe from './assets/studio_small_03_1k.hdr'
import model from './assets/test.glb'

const main = async () => {
    const canvas = document.querySelector('#canvas')
    const v = createViewport(canvas, rgbe, model);
    const objects = await v.init();
    v.showOutline(objects[2])
    v.hideObject(objects[1])
    console.log(v.isVisible(objects[1]))
}

//change all factory functions to easier synatx!!!

main();