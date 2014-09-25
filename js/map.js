function initialize() {
	jQuery('#place-div').val('');
	var options = {
		center: new google.maps.LatLng(4.606487, -74.067147),
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
	jQuery(clearAll).css({'background-color': '#a8a8a8', 'font-family': 'Roboto', 'padding': '0 11px 0 13px', 'font-size': '15px', 'font-weight': '600'});
	jQuery(clearAll).css({'border': '2px solid #545454', 'width': '100px', 'text-align': 'center', 'box-shadow': '0 2px 6px rgba(0, 0, 0, 0.3)','cursor': 'pointer'});
	jQuery(clearAll).css({'margin-bottom': '10px', 'height': '30px', 'line-height': '30px', 'border-radius': '4px', 'box-shadow': 'inset 1px 1px 4px #545454', 'color': '#fff', 'text-shadow': '1px 1px 2px #545454'});	
	jQuery(clearAll).hover(function() {
		jQuery(this).css({'text-shadow': '-1px -1px 2px #545454', 'box-shadow': 'inset -1px -1px 4px #545454'});
	}, function() {
		jQuery(this).css({'text-shadow': '1px 1px 2px #545454', 'box-shadow': 'inset 1px 1px 4px #545454'});
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
	window.polygons = [];
	window.options = ['Area', 'Nodes', 'Obstacles'];
	window.optionNames = ['Select Area', 'Place Nodes', 'Define Obstacles'];
	window.currentOption = 0;
}

function createBlocks() {
	for(var i = 0; i < window.blockMarkers.length; i++) {
		if(window.blockMarkers[i].length != 0 && jQuery('#selectObstacles option[value="' + (i+1) + '"]').length == 0) {
			jQuery('#selectObstacles').append('<option value="' + (i+1) + '">Obstacle ' + (i+2) + '</option>');
			window.blockMarkers.push([]);
		} else if(window.blockMarkers[i].length == 0 && i < (window.blockMarkers.length-1)) {
			for(var j = (i+1); j < window.blockMarkers.length; j++) {
				window.blockMarkers[j-1] = window.blockMarkers[j];
				for(var k = 0; k < window.blockMarkers[j-1].length; k++) {
					var val1 = window.blockMarkers[j-1][k].id.substr(0, window.blockMarkers[j-1][k].id.indexOf(','));
					var val2 = window.blockMarkers[j-1][k].id.substr(window.blockMarkers[j-1][k].id.indexOf(',')+1);
					window.blockMarkers[j-1][k].id = ((val1-1) + ',' + val2);
				}
			}
			window.blockMarkers.splice(window.blockMarkers.length-1, 1);
			jQuery('#selectObstacles option:last').remove();
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
	selectedBlock();
	var borrar = [];
	for(var j = 0; j < window.polygons.length; j++) {
		for(var i = 0; i < window.markers.length; i++) {
			if(window.polygons[j].containsLatLng(new google.maps.LatLng(window.markers[i].getPosition().lat(), window.markers[i].getPosition().lng()))) {
				borrar.push(window.markers[i].id - borrar.length);
			}
		}
	}
	for(var k = 0; k < borrar.length; k++) {
		deleteMarker(borrar[k]);
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
	jQuery(selectList).css('width', '85px');
	jQuery(selectList).css('padding', '0px');
	jQuery(selectList).css('font-size', '11px');
	jQuery(selectList).css('height', '20px');
	jQuery(selectList).css('font-weight', '500');
	jQuery(selectList).css('font-family', 'Roboto,Arial,sans-serif');
	jQuery(selectList).css('background-clip', 'padding-box');
	jQuery(selectList).css('cursor', 'pointer');
	jQuery(selectList).css('text-align', 'left');
	jQuery(selectList).css('color', '#181818');
	jQuery(selectList).css('background-color', '#f8f8f8');
	jQuery(selectList).css('border', '0');
	jQuery(selectList).css('display', 'inline-block');
	for(var i = 0; i <= window.polygons.length; i++) {
		var option = document.createElement('option');
		option.value = i;
		option.text = 'Obstacle ' + (i + 1);
		selectList.appendChild(option);
	}
	jQuery(selectList).on('change', function() {
		selectedBlock();
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
		map.controls[google.maps.ControlPosition.RIGHT].clear();
		jQuery('#place-div').css('display', 'block');
		jQuery('#clear-all').css('display', 'block');
		google.maps.event.removeListener(window.lis);
	}
	if(opt == 'Nodes') {
		google.maps.event.removeListener(window.lis);
		staticOptions();
		jQuery('#selectObstacles').hide();
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
					deleteMarker(marker.id);
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
		} else {
			jQuery('#selectObstacles').show();
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
		if(jQuery(this).attr('id') == 'Next' && currentOption < options.length-1) {
			currentOption += 1;
			buttons(options[currentOption]);
			jQuery('#cur').animate({opacity: 0.0}, 300, function() {
				jQuery(this).text(optionNames[currentOption]);
				jQuery(this).animate({opacity: 1.0}, 300);			
			});
		} else if(jQuery(this).attr('id') == 'Previous' && currentOption > 0) {
			currentOption -= 1;
			buttons(options[currentOption]);
			jQuery('#cur').animate({opacity: 0.0}, 300, function() {
				jQuery(this).text(optionNames[currentOption]);
				jQuery(this).animate({opacity: 1.0}, 300);			
			});
		}
	});
}

jQuery(document).ready(function() {
	initializeVariables();
	initialize();
	nextPrev();
});