 $(document).ready(function() {
 	// body...
 	$('[data-toggle="fullscreentips"]').tooltip();
 });

 function enterfullscreen() {
   	var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    document.getElementById("fullscreen").src = "../img/fullscreen-exit.png";
}

function exitfullscreen() { //退出全屏
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    document.getElementById("fullscreen").src = "../img/fullscreen.png";
}

function fullscreen() {
	// body...
	var imgSource = document.getElementById("fullscreen").src;
	console.log(imgSource);
	if (imgSource == 'file:///C:/Users/Dream/Desktop/Visualization/img/fullscreen.png') {
		enterfullscreen();
	}else{
		exitfullscreen();
	}
}