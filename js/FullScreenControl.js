/// <reference path="../typings/google.maps.d.ts" />
function FullScreenControl(map, enterFull, exitFull) {
    if (enterFull === void 0) { enterFull = null; }
    if (exitFull === void 0) { exitFull = null; }
    if (enterFull == null) {
        enterFull = "Full screen";
    }
    if (exitFull == null) {
        exitFull = "Exit full screen";
    }
    var controlDiv = document.createElement("div");
    controlDiv.className = "fullScreen";
    controlDiv.index = 1;
    controlDiv.style.padding = "5px";
    // Set CSS for the control border.
    var controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "white";
    controlUI.style.borderStyle = "solid";
    controlUI.style.borderWidth = "1px";
    controlUI.style.borderColor = "#717b87";
    controlUI.style.cursor = "pointer";
    controlUI.style.textAlign = "center";
    controlUI.style.boxShadow = "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px";
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    var controlText = document.createElement("div");
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "11px";
    controlText.style.fontWeight = "400";
    controlText.style.paddingTop = "1px";
    controlText.style.paddingBottom = "1px";
    controlText.style.paddingLeft = "6px";
    controlText.style.paddingRight = "6px";
    controlText.innerHTML = "<strong>" + enterFull + "</strong>";
    controlUI.appendChild(controlText);
    // set print CSS so the control is hidden
    var head = document.getElementsByTagName("head")[0];
    var newStyle = document.createElement("style");
    newStyle.setAttribute("type", "text/css");
    newStyle.setAttribute("media", "print");
    var cssText = ".fullScreen { display: none;}";
    var texNode = document.createTextNode(cssText);
    try {
        newStyle.appendChild(texNode);
    }
    catch (e) {
        // IE8 hack
        newStyle.styleSheet.cssText = cssText;
    }
    head.appendChild(newStyle);
    var interval;
    var mapDiv = map.getDiv();
    var divStyle = mapDiv.style;
    if (mapDiv.runtimeStyle) {
        divStyle = mapDiv.runtimeStyle;
    }
    var originalPos = divStyle.position;
    var originalWidth = divStyle.width;
    var originalHeight = divStyle.height;
    // IE8 hack
    if (originalWidth === "") {
        originalWidth = mapDiv.style.width;
    }
    if (originalHeight === "") {
        originalHeight = mapDiv.style.height;
    }
    var originalTop = divStyle.top;
    var originalLeft = divStyle.left;
    var originalZIndex = divStyle.zIndex;
    var bodyStyle = document.body.style;
    if (document.body.runtimeStyle) {
        bodyStyle = document.body.runtimeStyle;
    }
    var originalOverflow = bodyStyle.overflow;
    controlDiv.goFullScreen = function () {
		jQuery('#budgetDisplay').show();
		jQuery('.button').css({'z-index': '100'});
		jQuery('#contButtons').css({'position': 'absolute', 'bottom': '0'});
		jQuery('#Area').css({'border-radius': '8px 0 0 0'});
		jQuery('#Snee').css({'border-radius': '0 8px 0 0'});
		jQuery('#clear-all').css({'margin-bottom': '50px'});
		jQuery('#' + options[currentOption]).tooltip('close');
        var center = map.getCenter();
        document.body.style.overflow = "hidden";
        mapDiv.style.position = "fixed";
        mapDiv.style.width = "100%";
        mapDiv.style.height = "100%";
        mapDiv.style.top = "0";
        mapDiv.style.left = "-26px";
        mapDiv.style.zIndex = "100";
        controlText.innerHTML = "<strong>" + exitFull + "</strong>";
        window.fullScreenState = true;
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
        // this works around street view causing the map to disappear, which is caused by Google Maps setting the 
        // CSS position back to relative. There is no event triggered when Street View is shown hence the use of setInterval
        interval = setInterval(function () {
            if (mapDiv.style.position !== "fixed") {
                mapDiv.style.position = "fixed";
                google.maps.event.trigger(map, "fixed");
            }
        }, 100);
    };
    controlDiv.exitFullScreen = function () {
        var center = map.getCenter();
        if (originalPos === "") {
            mapDiv.style.position = "relative";
        }
        else {
            mapDiv.style.position = originalPos;
        }
		jQuery('#budgetDisplay').hide();
		jQuery('.button').css({'z-index': ''});
		jQuery('#contButtons').css({'position': '', 'bottom': ''});
		jQuery('#Area').css({'border-radius': '0 0 0 8px'});
		jQuery('#Snee').css({'border-radius': '0 0 8px 0'});
		jQuery('#clear-all').css({'margin-bottom': '16px'});
		jQuery('#' + options[currentOption]).tooltip('close');
        mapDiv.style.width = originalWidth;
        mapDiv.style.height = originalHeight;
        mapDiv.style.top = originalTop;
        mapDiv.style.left = originalLeft;
        mapDiv.style.zIndex = originalZIndex;
        document.body.style.overflow = originalOverflow;
        controlText.innerHTML = "<strong>" + enterFull + "</strong>";
        window.fullScreenState = false;
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
        clearInterval(interval);
    };
    // Setup the click event listener
    google.maps.event.addDomListener(controlUI, "click", function () {
        if (!window.fullScreenState) {
            controlDiv.goFullScreen();
        }
        else {
            controlDiv.exitFullScreen();
        }
    });
    return controlDiv;
}