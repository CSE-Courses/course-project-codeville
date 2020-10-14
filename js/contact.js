function setHeight() {
    var elmnt = document.getElementById("myTopnav");
    var height=elmnt.offsetHeight;
    height = height;
    var elmnt = document.getElementById("container");
    elmnt.style.setProperty('--header-height',height+'px');
}