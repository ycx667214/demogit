/**
 * Created by zlz on 16/12/1.
 */
window.onload = function () {
    var pic = document.getElementsByClassName('pics')[0];
    pic.style.backgroundImage='url(images/1.jpg)';
};

var changePic = function (ali) {
    var theli = ali.id;
    var pic = document.getElementsByClassName('pics')[0];
    console.log(theli);
    if (theli=='li1'){
        pic.style.backgroundImage='url(images/1.jpg)';
    }
    if (theli=='li2'){
        pic.style.backgroundImage='url(images/2.jpg)';
    }
    if (theli=='li3'){
        pic.style.backgroundImage='url(images/3.jpg)';
    }
};

