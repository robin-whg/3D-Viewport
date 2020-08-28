function createSidebar() {
    console.log('1')
    
    $("#sidebar").toggleClass("sidebar-active")
}

function sidebarClick () {
    console.log('2')
    $("#sidebar").toggleClass("sidebar-active")
}

export default createSidebar