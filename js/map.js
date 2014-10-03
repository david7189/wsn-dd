function initialize() {
	var distanceRight = (screen.width - jQuery('#container').css('width').substring(0, jQuery('#container').css('width').length - 2))/2;
	distanceRight = (distanceRight - jQuery('#language').css('width').substring(0, jQuery('#language').css('width').length - 2))/2 - 10;
	jQuery('#language').css({'right': distanceRight, 'display': 'block'});
	jQuery('#place-div').val('');
	var options = {
		//center: new google.maps.LatLng(4.606487, -74.067147),
		center: new google.maps.LatLng(48.85837, 2.294481),
		zoom: 19,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.SATELLITE, //TERRAIN or SATELLITE seem fine to me...
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
			position: google.maps.ControlPosition.TOP_RIGHT,
			mapTypeIds: [
				google.maps.MapTypeId.SATELLITE,
				google.maps.MapTypeId.TERRAIN,
				google.maps.MapTypeId.HYBRID,
				google.maps.MapTypeId.ROADMAP		
			]
		},	
		scaleControl: true,
		streetViewControl: false, //To disable pegman (street view control)
		streetViewControlOptions: {
			position: google.maps.ControlPosition.TOP_LEFT
		},
		panControl: true,
		panControlOptions: {
			position: google.maps.ControlPosition.TOP_LEFT
		},
		zoomControl: true,
		zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
		  position: google.maps.ControlPosition.TOP_LEFT
        },
		keyboardShortcuts: true,
		disableDoubleClickZoom: false,
		draggable: true,
		scrolwheel: true,
		backgroundColor: '#e8e8e8',
		draggableCursor: 'move'
	};
	window.map = new google.maps.Map(jQuery('#map')[0], options);
	var clearAll = document.createElement('div');
	var clearAllText = document.createTextNode("Clear All");
	clearAll.id = 'clear-all';	
	clearAll.appendChild(clearAllText);
	jQuery(clearAll).css({'background-color': '#d7d7d7', 'font-family': 'Roboto', 'padding': '0 11px 0 13px', 'font-size': '15px', 'font-weight': '400'});
	jQuery(clearAll).css({'border': '2px solid #3f3f3f', 'width': '100px', 'text-align': 'center', 'box-shadow': '0 2px 6px rgba(0, 0, 0, 0.3)','cursor': 'pointer'});
	jQuery(clearAll).css({'margin-bottom': '16px', 'height': '30px', 'line-height': '30px', 'border-radius': '8px', 'box-shadow': 'inset 1px 1px 8px #a8a8a8', 'color': '#3f3f3f'});	
	jQuery(clearAll).css({'-webkit-touch-callout': 'none', '-webkit-user-select': 'none', '-khtml-user-select': 'none', '-moz-user-select': 'none', '-ms-user-select': 'none', 'user-select': 'none'});	
	jQuery(clearAll).hover(function() {
		jQuery(this).css({'box-shadow': 'inset -1px -1px 8px #a8a8a8'});
	}, function() {
		jQuery(this).css({'box-shadow': 'inset 1px 1px 8px #a8a8a8'});
	});
	jQuery(clearAll).mousedown(function() {
		jQuery(this).css({'background-color': '#ffffff'});
	});
	jQuery(clearAll).mouseup(function() {
		jQuery(this).css({'background-color': '#d7d7d7'});
	});
	jQuery(clearAll).mouseout(function() {
		jQuery(this).css({'background-color': '#d7d7d7'});
	});
	jQuery(clearAll).click(function() {
		for (var i = 0; i < window.markers.length; i++) {
			window.markers[i].setMap(null);
		}
		for (var i = 0; i < window.blockMarkers.length; i++) {
			for (var j = 0; j< window.blockMarkers[i].length; j++) {
				window.blockMarkers[i][j].setMap(null);
			}
		}
		for (var i = 0; i < window.lines.length; i++) {
			window.lines[i].setMap(null);
		}
		for (var i = 0; i < window.circles.length; i++) {
			window.circles[i].setMap(null);
		}
		for (var i = 0; i < window.polygons.length; i++) {
			window.polygons[i].setMap(null);
		}
		initializeVariables();
	});
	map.controls[google.maps.ControlPosition.BOTTOM].push(clearAll);
	jQuery('.button').on('focusout', function(event) {
  		event.stopImmediatePropagation();
   }).on('focusin', function(event) {
  		event.stopImmediatePropagation();
  	}).on('mouseleave', function(event) {
  		event.stopImmediatePropagation();
   }).on('mouseenter', function(event) {
  		event.stopImmediatePropagation();
   }).tooltip({
		content: function() {
			return optionDescriptions[window.lang][currentOption] + '<span style="font-weight: bold;">' + window.optionNames[window.lang][currentOption] + '</span><br /><br />' +
			'<span style="position:absolute;top:0;right:0;cursor:pointer;" class="tooltipClose ui-icon ui-icon-closethick"></span>' +
			'<span style="position:absolute;bottom:0;left:0;cursor:pointer;font-weight:bold;" class="nextprev Previous">< Previous</span>' +
			'<span style="position:absolute;bottom:0;right:0;cursor:pointer;font-weight:bold;" class="nextprev Next">Next ></span>';
		},
		position: {
			my: 'bottom',
			at: 'center top',
			using: function( position, feedback ) {
				jQuery(this).css(position);
				jQuery('<div>').addClass('arrow').addClass(feedback.vertical).addClass(feedback.horizontal).appendTo(this);
			}
		}, open: function(event, ui) {
			jQuery('.tooltipClose').click(function() {
				jQuery('#' + window.options[currentOption]).tooltip('close');
			});
			nextPrev();
		}			
	}).on('click', function() {
		if(jQuery(this).attr('id') == window.options[currentOption])
  			jQuery('#' + window.options[currentOption]).tooltip('open');
   }).click();
	var input = /** @type {HTMLInputElement} */(document.getElementById('place-div'));
	map.controls[google.maps.ControlPosition.TOP].push(input);
	var searchBox = new google.maps.places.SearchBox(/** @type {HTMLInputElement} */(input));
   google.maps.event.addListener(searchBox, 'places_changed', function() {
   	var places = searchBox.getPlaces();
   	if (places.length == 0) {
      	return;
    	}
    	var bounds = new google.maps.LatLngBounds();
    		for (var i = 0, place; place = places[i]; i++) {
      		var image = {
        		url: place.icon,
        		size: new google.maps.Size(71, 71),
        		origin: new google.maps.Point(0, 0),
        		anchor: new google.maps.Point(17, 34),
        		scaledSize: new google.maps.Size(25, 25)
      	};
      	bounds.extend(place.geometry.location);
      }
      map.fitBounds(bounds);
   });
   google.maps.event.addListener(map, 'bounds_changed', function() {
   	var bounds = map.getBounds();
   	searchBox.setBounds(bounds);
  	});
  	jQuery(input).css({'display': 'block'});
  	languageSel();
}

function languageSel() {
	var title = {'eng': 'Wireless Sensor Network Deployment Design', 'esp': 'Diseño de Despliegue de Redes Inalámbricas de Sensores'};
	var tabName = {'eng': 'Wireless Sensor Network Deployment Design', 'esp': 'Diseño de Despliegue de Redes Inalámbricas de Sensores'};
	jQuery('.lang').click(function() {
		if(jQuery(this).attr('id') != window.lang) {
			jQuery('.lang').css({'cursor': 'pointer', 'text-decoration': 'none', 'text-transform': 'lowercase'});
			jQuery('.lang:hover').css({'text-decoration': 'underline'});
			jQuery(this).css({'text-transform': 'uppercase', 'text-decoration': 'underline', 'cursor': 'default'});
			jQuery('#title').text(title[jQuery(this).attr('id')]);
			document.title = tabName[jQuery(this).attr('id')];
			if(jQuery('#selectObstacles').length != 0) {
				jQuery('#selectObstacles').html(jQuery('#selectObstacles').html().replace(new RegExp(window.obsName[window.lang], 'g'), window.obsName[jQuery(this).attr('id')]));
				jQuery('#createObstacle').text(window.newObs[jQuery(this).attr('id')]);			
			}
			jQuery('#clear-all').text(window.clearText[jQuery(this).attr('id')]);
			jQuery('.menu-mark').html(menuText[jQuery(this).attr('id')]);
			for(i = 0; i < window.options.length; ++i) {
				jQuery('#' + window.options[i]).text(window.optionNames[jQuery(this).attr('id')][i]);
			}
			window.lang = jQuery(this).attr('id');
			jQuery('#' + window.options[currentOption]).tooltip('close').tooltip('open');
		}
	});
}

function computeDistance(a, b) {
	var distance = google.maps.geometry.spherical.computeDistanceBetween(a, b);
	if(distance <= 50.0 && !crossesPolygon(a, b, a)) {
		return true;
	}
	return false;
}

function crossesPolygon(a, b, c) {
	var steps = 50;
	var distLat = (b.lat() - a.lat())/steps;
	var distLng = (b.lng() - a.lng())/steps;
	for (var i = 0; i < window.polygons.length; i++) {
		a = new google.maps.LatLng(c.lat(), c.lng());
		for(var j = 0; j <= steps; j++) {
			if(window.polygons[i].containsLatLng(new google.maps.LatLng(a.lat(), a.lng()))) {
				return true;
			}
			a = new google.maps.LatLng(a.lat() + distLat, a.lng() + distLng);
		}
	}
	return false;
}

function createLines() {
	for(var i = 0; i < window.lines.length; i++) {
		window.lines[i].setMap(null);
	}
	window.lines = [];
	for(i = 0; i < window.markers.length - 1; i++) {
		for(j = i + 1; j < window.markers.length; j++) {
			var distance = computeDistance(new google.maps.LatLng(window.markers[i].getPosition().lat(), window.markers[i].getPosition().lng()),
				new google.maps.LatLng(window.markers[j].getPosition().lat(), window.markers[j].getPosition().lng()));
			if(distance) {
				var coordinates = [new google.maps.LatLng(window.markers[i].getPosition().lat(), window.markers[i].getPosition().lng()),
					new google.maps.LatLng(window.markers[j].getPosition().lat(), window.markers[j].getPosition().lng())];
				var line = new google.maps.Polyline({
					path: coordinates,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2,
					zIndex: 2
				});
				line.setMap(map);
				window.lines.push(line);
			}
		}
	}
}

function deleteMarker(i) {
	window.markers[i-1].setMap(null);
	window.circles[i-1].setMap(null);
	for(var j = i; j < window.markers.length; j++) {
		window.markers[j].id--;
		window.circles[j].id--;
		window.markers[j].setIcon('http://gmaps-samples.googlecode.com/svn/trunk/markers/red/marker' + window.circles[j].id + '.png');
	}
	window.counter--;
	window.markers.splice(i-1, 1);
	window.circles.splice(i-1, 1);
	createLines();
}

function deleteBlockMarker(i) {
	var val1 = i.substr(0, i.indexOf(','));
	var val2 = i.substr(i.indexOf(',')+1);
	window.blockMarkers[val1][val2].setMap(null);
	for(var j = (Number(val2)+1); j < window.blockMarkers[val1].length; j++) {
		window.blockMarkers[val1][j].id = (val1 + ',' + (j-1));
		window.blockMarkers[val1][j].setIcon('http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/marker' + j + '.png');
	}
	window.blockMarkers[val1].splice(val2, 1);
	createBlocks();
}

function staticOptions() {
	window.map.setOptions({
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: false,
		panControl: false,
		zoomControl: false,
		keyboardShortcuts: false,
		disableDoubleClickZoom: true,
		draggable: false,
		scrolwheel: false,
		draggableCursor: 'default'
	});
	jQuery('#place-div').css('display', 'none');
	jQuery('#clear-all').css('display', 'none');
}

function initializeVariables() {
	window.markers = [];
	window.blockMarkers = [[]];
	window.lines = [];
	window.circles = [];
	window.counter = 1;
	window.lang = 'eng';
	window.polygons = [];
	window.options = ['Area', 'Nodes', 'Obstacles'];
	window.obsName = {'eng': 'Obstacle ', 'esp': 'Obstáculo '};
	window.menuText = {'eng': 'Delete Node', 'esp': 'Borrar Nodo'};
	window.newObs = {'eng': 'New Obstacle', 'esp': 'Nuevo Obstáculo'};
	window.clearText = {'eng': 'Clear All', 'esp': 'Borrar Todo'};
	window.optionNames = {'eng': ['Select Area', 'Place Nodes', 'Define Obstacles'], 'esp': ['Elegir Área', 'Ubicar Nodos', 'Definir Obstáculos']};
	window.optionDescriptions = {'eng': ['This is the first stage of the <span style="font-weight:bold;">"Wireless Sensor Network Deployment Design"</span> tool.<br /><br /> \
		Choose the Area you want to work in and once you\'re comfortable, click on <span style="font-weight:bold;">Next</span>.<br /><br />To open back this \
		Tooltip in case you close it, click on ',
		'Once selected the work area, this step allows you to place the nodes and select the type of sensor in each one according to the available budget \
		previously defined.<br /><br />To open back this Tooltip in case you close it, click on ',
		'This step allows you to define the obstacles in the area. You can define as many as you want through the "obstacle selector" option in the upper \
		right border of the map.<br /><br />To open back this Tooltip in case you close it, click on '],
		'esp': ['Ésta es la primera etapa de la herramienta de <span style="font-weight:bold;">"Diseño de Despliegue de Redes Inalámbricas de Sensores"</span>.<br /><br /> \
		Elija el área en la que quiere trabajar y una vez esté cómodo, haga click en <span style="font-weight:bold;">Siguiente</span>.<br /><br />Para volver a abrir esta \
		Ayuda en caso de que la cierre, haga click en ',
		'Una vez elegido el área de trabajo, este paso le permite ubicar los nodos y seleccionar el tipo de sensor en cada uno de acuerdo al presupuesto disponible \
		anteriormente definido.<br /><br />Para volver a abrir esta Ayuda en caso de que la cierre, haga click en ',
		'Este paso le permite definir los obstáculos en el área. Puede definir tantos como quiera a través de la opción "selector de obstáculos" en el borde superior \
		derecho del mapa.<br /><br />Para volver a abrir esta Ayuda en caso de que la cierre, haga click en ']};
	window.currentOption = 0;
}

function createBlocks() {
	for(var i = 0; i < window.blockMarkers.length; i++) {
		if(window.blockMarkers[i].length != 0 && jQuery('#selectObstacles option[value="' + (i+1) + '"]').length == 0) {
			jQuery('#createObstacle').prop('disabled', false);
			jQuery('#createObstacle').css({'cursor': 'pointer', 'background-color': '#f8f8f8', 'color': '#181818'});
		} else if(window.blockMarkers[i].length == 0) {
			for(var j = (i+1); j < window.blockMarkers.length; j++) {
				window.blockMarkers[j-1] = window.blockMarkers[j];
				for(var k = 0; k < window.blockMarkers[j-1].length; k++) {
					var val1 = window.blockMarkers[j-1][k].id.substr(0, window.blockMarkers[j-1][k].id.indexOf(','));
					var val2 = window.blockMarkers[j-1][k].id.substr(window.blockMarkers[j-1][k].id.indexOf(',')+1);
					window.blockMarkers[j-1][k].id = ((val1-1) + ',' + val2);
				}
			}
			if (jQuery('#selectObstacles option:last').prop('value') != '0') {
				window.blockMarkers.splice(window.blockMarkers.length-1, 1);
				if(jQuery('#selectObstacles option:last').prop('selected') == true)
					jQuery('#selectObstacles option[value="' + (jQuery('#selectObstacles option:last').prop('value') - 1) + '"]').prop('selected', true);
				jQuery('#selectObstacles option:last').remove();
			} else {
				jQuery('#createObstacle').prop('disabled', true);
				jQuery('#createObstacle').css({'cursor': 'default', 'background-color': '#dfdfdf', 'color': '#c6c6c6'});
			}
			selectedBlock();
		}
	}
	var coords = [];
	for(var j = 0; j < window.polygons.length; j++) {
		window.polygons[j].setMap(null);
	}
	window.polygons = [];
	for(var i = 0; i < window.blockMarkers.length; i++) {
		for(var j = 0; j < window.blockMarkers[i].length; j++) {
			coords.push([]);
			coords[i].push(new google.maps.LatLng(window.blockMarkers[i][j].getPosition().lat(), window.blockMarkers[i][j].getPosition().lng()));
		}
	}
	for(var i = 0; i < coords.length; i++) {
		var polygon = new google.maps.Polygon({
			paths: coords[i],
			strokeColor: '#003D99',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#003D99',
			fillOpacity: 0.35,
			zIndex: 3,
			clickable: false
		});
		window.polygons.push(polygon);
		createLines();
		polygon.setMap(map);
	}
}

function selectedBlock() {
	for(var i = 0; i < window.blockMarkers.length; i++) {
		for(var j = 0; j < window.blockMarkers[i].length; j++) {
			if(i != jQuery('#selectObstacles option:selected').val() || jQuery('#selectObstacles').css('display') == 'none') {
				window.blockMarkers[i][j].setMap(null);
			} else {
				window.blockMarkers[i][j].setMap(map);
			}
		}
	}
}

function obsSelector(div) {
	var selectList = document.createElement('select');
	selectList.id = 'selectObstacles';
	div.appendChild(selectList);
	jQuery(div).css('padding', '5px');
	jQuery(selectList).css({'width': '100px', 'padding': '0px', 'font-size': '11px', 'height': '20px', 'font-weight': '500', 'font-family': 'Roboto,Arial,sans-serif'});
	jQuery(selectList).css({'background-clip': 'padding-box', 'cursor': 'pointer', 'text-align': 'left', 'color': '#181818', 'background-color': '#f8f8f8', 'border': '0', 'display': 'inline-block'});
	for(var i = 0; i <= window.polygons.length; i++) {
		var option = document.createElement('option');
		option.value = i;
		option.text = window.obsName[window.lang] + (i + 1);
		selectList.appendChild(option);
	}
	jQuery(selectList).on('change', function() {
		selectedBlock();
	});
}

function createObstacle(div) {
	var createObs = document.createElement('button');
	createObs.id = 'createObstacle';
	jQuery(createObs).text(window.newObs[window.lang]);
	jQuery(createObs).attr('disabled', 'disabled');
	div.appendChild(createObs);
	jQuery(div).css('padding', '5px');
	jQuery(createObs).css({'width': '100px', 'padding': '0px', 'font-size': '11px', 'height': '20px', 'font-weight': '500', 'font-family': 'Roboto,Arial,sans-serif'});
	jQuery(createObs).css({'background-clip': 'padding-box', 'cursor': 'default', 'color': '#c6c6c6', 'background-color': '#dfdfdf', 'display': 'inline-block'});
	jQuery(createObs).on('click', function() {
		jQuery('#selectObstacles').append('<option value="' + parseInt(parseInt(jQuery('#selectObstacles option:last').attr('value')) + 1) + '">' + window.obsName[window.lang] + parseInt(parseInt(jQuery('#selectObstacles option:last').attr('value')) + 2) + '</option>');
		window.blockMarkers.push([]);
		jQuery('#selectObstacles option:last').prop('selected', true);
		selectedBlock();
		jQuery('#createObstacle').prop('disabled', true);
		jQuery('#createObstacle').css({'cursor': 'default', 'background-color': '#dfdfdf', 'color': '#c6c6c6'});
	});
}

function callMenu(marker) {
	var boxText = document.createElement('div');
    jQuery(boxText).addClass('menu-mark-container');
	var delMark = document.createElement('div');
	jQuery(delMark).addClass('menu-mark');
	jQuery(delMark).hover(function() {
			jQuery(this).css({'color': '#3f3f3f', 'background-color': '#dadada', 'border': '1px solid #3f3f3f', 'padding': '1px'});
		},
		function() {
			jQuery(this).css({'color': '#3c3c3c', 'background-color': '#c6c6c6', 'border': '0', 'padding': '2px'});
		});
	jQuery(delMark).html(window.menuText[window.lang]);
	boxText.appendChild(delMark);
	var options = {
		content: boxText,
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(15, -42),
		zIndex: null,
		boxStyle: {
			opacity: 0.9,
			width: '140px'
		},
		closeBoxMargin: '12px 4px 4px 4px',
		closeBoxURL: 'http://www.google.com/intl/en_us/mapfiles/close.gif',
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: 'floatPane',
		enableEventPropagation: false
	};
	var ib = new InfoBox(options);
	ib.open(map, marker);
	jQuery(boxText).click(function() {
		ib.close();
		deleteMarker(marker.id);
	});
}

function buttons(opt) {
	if(opt == 'Area') {
		window.map.setOptions({
			mapTypeControl: true,
			scaleControl: true,
			streetViewControl: false,
			panControl: true,
			zoomControl: true,
			keyboardShortcuts: true,
			disableDoubleClickZoom: false,
			draggable: true,
			scrolwheel: true,
			draggableCursor: 'move'
		});
		jQuery('#selectObstacles').hide();
		jQuery('#createObstacle').hide();		
		jQuery('#place-div').css('display', 'block');
		jQuery('#clear-all').css('display', 'block');
		google.maps.event.removeListener(window.lis);
	}
	if(opt == 'Nodes') {
		google.maps.event.removeListener(window.lis);
		staticOptions();
		jQuery('#selectObstacles').hide();
		jQuery('#createObstacle').hide();
		selectedBlock();
		window.lis = google.maps.event.addListener(map, 'click', function(event) {
			var createMark = true;
			for(var j = 0; j < window.polygons.length; j++) {	
				if(window.polygons[j].containsLatLng(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()))) {
					createMark = false;
				}	
			}
			if(createMark) {
				var marker = new google.maps.Marker({
					position: event.latLng,
					map: map,
					id: window.counter,
					icon: 'http://gmaps-samples.googlecode.com/svn/trunk/markers/red/marker' + window.counter + '.png'
				});
				google.maps.event.addListener(marker, 'rightclick', function() {
					callMenu(marker);
					//deleteMarker(marker.id);
				});
				window.markers.push(marker);	
				var circleOptions = {
					strokeColor: '#ADFF2F',
					strokeOpacity: 0.5,
					strokeWeight: 2,
					fillColor: '#ADFF2F',
					fillOpacity: 0.25,
					map: map,
					center: event.latLng,
					radius: 50,
					clickable: false,
					id: window.counter,
					zIndex: 1
				};
				var circle = new google.maps.Circle(circleOptions);
				window.circles.push(circle);
				window.counter++;
				createLines();
			}
		});
	}
	if(opt == 'Obstacles') {
		google.maps.event.removeListener(window.lis);
		staticOptions();
		if(jQuery('#selectObstacles').length == 0) {
			var obstacleSelectorDiv = document.createElement('div');
			var obstacleSelector = new obsSelector(obstacleSelectorDiv);
			map.controls[google.maps.ControlPosition.RIGHT].push(obstacleSelectorDiv);
			var createObstacleDiv = document.createElement('div');
			var createObs = new createObstacle(createObstacleDiv);
			map.controls[google.maps.ControlPosition.RIGHT].push(createObstacleDiv);
		} else {
			jQuery('#selectObstacles').show();
			jQuery('#createObstacle').show();
		}
		selectedBlock();
		window.lis = google.maps.event.addListener(map, 'click', function(event) {
			var blockMarker = new google.maps.Marker({
				position: event.latLng,
				map: map,
				id: (jQuery('#selectObstacles option:selected').val() + ',' + (window.blockMarkers[jQuery('#selectObstacles option:selected').val()].length)),
				draggable: true,
				icon: 'http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/marker' + (window.blockMarkers[jQuery('#selectObstacles option:selected').val()].length + 1) +'.png'
			});
			google.maps.event.addListener(blockMarker, 'rightclick', function() {
				deleteBlockMarker(blockMarker.id);
			});
			google.maps.event.addListener(blockMarker, 'dragend', function() {
				createBlocks();
			});
			window.blockMarkers[jQuery('#selectObstacles option:selected').val()].push(blockMarker);
			createBlocks();
		});
	}
}

function nextPrev() {
	jQuery('.nextprev').click(function() {
		if(jQuery(this).attr('class').indexOf('Next') > -1 && currentOption < options.length-1) {
			jQuery('#' + options[currentOption]).tooltip('close');
			jQuery('#' + options[currentOption]).css('background', '#7A995C');
			currentOption += 1;
			buttons(options[currentOption]);
			jQuery('#' + options[currentOption]).css('background', '#29331F');
			jQuery('#' + options[currentOption]).tooltip('open');
		} else if(jQuery(this).attr('class').indexOf('Previous') > -1 && currentOption > 0) {
			jQuery('#' + options[currentOption]).tooltip('close');
			jQuery('#' + options[currentOption]).css('background', '#7A995C');
			currentOption -= 1;
			buttons(options[currentOption]);
			jQuery('#' + options[currentOption]).css('background', '#29331F');
			jQuery('#' + options[currentOption]).tooltip('open');
		}
	});
}

jQuery(document).ready(function() {
	initializeVariables();
	initialize();
});