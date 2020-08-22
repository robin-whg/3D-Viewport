import {
    Vector2
} from 'three';
import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
    CopyShader
} from 'three/examples/jsm/shaders/CopyShader.js';
import {
    OutlinePass
} from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {
    FXAAShader
} from 'three/examples/jsm/shaders/FXAAShader.js';

const createPostProcessing = (renderer, scene, camera) => {
    const size = renderer.getDrawingBufferSize(new Vector2());
    // create EffectComposer to add post processing effects to
    const composer = new EffectComposer(renderer);
    // create RenderPass to render scene for passing it to the effects
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // create OutlinePass to highlight selected objects with an outline
    const outlinePass = new OutlinePass(new Vector2(size.width, size.height), scene, camera)
    outlinePass.edgeStrength = 5;
    outlinePass.edgeThickness = 1;
    outlinePass.edgeGlow = 0.25;
    outlinePass.visibleEdgeColor.set('#EBEBEB');
    outlinePass.hiddenEdgeColor.set('#525252');
    composer.addPass(outlinePass);
    // shader pass for anitaliasing as the regular one is applied before the postprocessing
    const fxaaShader = new ShaderPass(FXAAShader);
    composer.addPass(fxaaShader);

    return {
        renderComposer: () => {
            composer.render(scene, camera);
        },
        resizeComposer: (width, height) => {
            composer.setSize(width, height, false);
            fxaaShader.uniforms['resolution'].value.set(1 / width, 1 / height);
        },
        showOutlines: (objects) => {
            outlinePass.selectedObjects = objects;
        },
        hideOutlines: () => {
            outlinePass.selectedObjects = [];
        }
    }
}

export default createPostProcessing