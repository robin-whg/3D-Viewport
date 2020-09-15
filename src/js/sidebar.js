import {
    isVisible,
    hideObject,
    showObject
} from './viewport.js'
import {
    showOutline,
    clearOutlines
} from './postProcessing.js'

function createSidebar(objects) {
    const btn = document.getElementById("sidebar-btn")
    btn.addEventListener('click', sidebarToggle)
    objects.forEach(x => createObjBtn(x))
    //for some reason you can't add the eventlistener in createObjBtn. Maybe the buttons aren't created yet?
    const children = [...document.getElementById('sidebar-inner').children]
    children.forEach((x, i) => createEventListener(x, objects[i]))
}

function sidebarToggle() {
    const sidebar = document.getElementById("sidebar")
    sidebar.classList.contains('sidebar-active') ? sidebar.classList.remove('sidebar-active') : sidebar.classList.add('sidebar-active')
}

function createObjBtn(obj) {
    document.getElementById('sidebar-inner').innerHTML += getObjBtnBoilerplate(obj)
}

function createEventListener(btn, obj) {
    btn.addEventListener('click', function () {
        const icon = this.children[1]
        if (isVisible(obj)) {
            hideObject(obj)
            icon.innerHTML = getEyeSlashIcon()
        } else {
            showObject(obj)
            icon.innerHTML = getEyeIcon()
        }
    })
    btn.addEventListener('mouseenter', function() {
        showOutline(obj)
    })
    btn.addEventListener('mouseleave', function() {
        clearOutlines()
    })
}

function getObjBtnBoilerplate(obj) {
    return `
            <div id="${obj.uuid}" class="obj-btn">
                <span>${obj.name}</span>
                <div>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye icon" fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z" />
                        <path fill-rule="evenodd"
                            d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                    </svg>
                </div>
            </div>`
}

function getEyeSlashIcon() {
    return `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye-slash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
    <path fill-rule="evenodd" d="M13.646 14.354l-12-12 .708-.708 12 12-.708.708z"/>
  </svg>`
}

function getEyeIcon() {
    return `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"/>
    <path fill-rule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
  </svg>`
}

export default createSidebar