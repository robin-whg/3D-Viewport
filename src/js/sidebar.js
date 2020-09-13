import {v} from '../main.js'
function createSidebar(objects) {
    const btn = document.getElementById("sidebar-btn")
    btn.addEventListener('click', onClick)
    objects.forEach(x => createObjBtn(x))

}

function onClick() {
    const sidebar = document.getElementById("sidebar")
    sidebar.classList.contains('sidebar-active') ? sidebar.classList.remove('sidebar-active') : sidebar.classList.add('sidebar-active')
}

function createObjBtn(obj) {
    document.getElementById('sidebar-inner').innerHTML += getObjBtnBoilerplate(obj)
    console.log(document.getElementById(obj.uuid))
    createEventListener(obj)
    //only the last btn is working
}

function createEventListener(obj) {
    document.getElementById(obj.uuid).addEventListener('click', () => toggleVisibility(obj))
}

function getObjBtnBoilerplate(obj) {
    return `
            <div id="${obj.uuid}" class="obj-btn">
                <span>${obj.name}</span>
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z" />
                    <path fill-rule="evenodd"
                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
            </div>`
}

function toggleVisibility(obj) {
    console.log('toggle')
    v.isVisible(obj) ? v.hideObject(obj) : v.showObject(obj)
}

export default createSidebar