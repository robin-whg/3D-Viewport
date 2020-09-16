import 'regenerator-runtime/runtime';
import './scss/main.scss';

import {
    createViewport
} from './js/viewport.js';
import createSidebar from './js/sidebar.js'

import hdr from './assets/studio_small_03_1k.hdr' // hdr from https://hdriheaven.com
import model from './assets/test.glb'

const main = async () => {
    displayProgress('loading-progress')
    const canvas = document.querySelector('#canvas')
    canvasListeners(canvas)
    const v = await createViewport(canvas, hdr)
    const objects = await v.loadModel(model)
    createSidebar(objects)
    deleteLoadingScreen('loading-screen')
}

function canvasListeners(elem) {
    elem.addEventListener('mousedown', () => {
        elem.style.cursor = 'grabbing'
    })
    elem.addEventListener('mouseup', () => {
        elem.style.cursor = 'grab'
    })
}

function displayProgress(elem) {
    // catch event emitted in gltfLoader.js to display the loading progress
    const loadingProgess = document.getElementById(elem)
    window.addEventListener('loadingProgress', (e) => {
        loadingProgess.innerText = e.detail.progress + '%'
    })
}

function deleteLoadingScreen(elem) {
    // delete loading screen after fade out
    const loadingScreen = document.getElementById('loading-screen')
    setTimeout(() => {
        loadingScreen.classList.add('loading-screen-inactive')
    }, 1000)
    setTimeout(() => {
        loadingScreen.remove()
    }, 2000)
}

main();