import 'regenerator-runtime/runtime';
import './scss/main.scss';

import createViewport from './js/viewport.js';
import createSidebar from './js/sidebar.js'

import hdr from './assets/studio_small_03_1k.hdr'
import model from './assets/test.glb'

const main = async () => {
    const canvas = document.querySelector('#canvas')
    const v = await createViewport(canvas, hdr, model)
    const objects = await v.loadModel(model)
    createSidebar()
 const e =   $('#sidebar')
 console.log(e)
 $("#btn-sidebar").on("click", () => console.log('test'))
}

main();