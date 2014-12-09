function initialize() {
	window.lang = 'en';
	if(window.location.href.indexOf('?lang=') > -1) {
		window.lang = window.location.href.substr(window.location.href.indexOf('?lang=') + 6, window.location.href.indexOf('?lang=') + 8);
	}
	jQuery('.lang').css({'cursor': 'pointer', 'text-decoration': 'none', 'text-transform': 'lowercase'});
	jQuery('.lang:hover').css({'text-decoration': 'underline'});
	jQuery('#' + window.lang).css({'text-transform': 'uppercase', 'text-decoration': 'underline', 'cursor': 'default'});
	languageSel();
	jQuery('.lang').click(function() {
		if(jQuery(this).attr('id') != window.lang) {
			var pag = window.location.href;
			if(window.location.href.indexOf('?lang=') > -1) {
				pag = window.location.href.substr(0, window.location.href.indexOf('?lang='));
			}
			window.location.href = pag + '?lang=' + jQuery(this).attr('id');
		}
	});
	var distanceRight = (screen.width - jQuery('#container').css('width').substring(0, jQuery('#container').css('width').length - 2))/2;
	distanceRight = (distanceRight - jQuery('#language').css('width').substring(0, jQuery('#language').css('width').length - 2))/2 - 10;
	jQuery('#language').css({'right': distanceRight, 'display': 'block'});
	jQuery('#user-info').css({'left': distanceRight, 'display': 'block'});
	jQuery('#menu').css({'right': distanceRight, 'display': 'block'});
	saveState();
	loadState();
	jQuery('.stateButton').mousedown(function() {
		jQuery(this).css({'background-color': '#e4e4e4'});
	});
	jQuery('.stateButton').mouseup(function() {
		jQuery(this).css({'background-color': '#d7d7d7'});
	});
	jQuery('.stateButton').mouseout(function() {
		jQuery(this).css({'background-color': '#d7d7d7'});
	});
	//nextPrev();
	jQuery('.nextprev').click(function() {
		nextPrev(this);
	});
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
	window.map.setTilt(0);
	var clearAll = document.createElement('div');
	var clearAllText = document.createTextNode(window.clearText[window.lang]);
	clearAll.id = 'clear-all';	
	clearAll.appendChild(clearAllText);
	jQuery(clearAll).css({'background-color': '#d7d7d7', 'font-family': 'Roboto', 'padding': '0 11px 0 13px', 'font-size': '15px', 'font-weight': '400'});
	jQuery(clearAll).css({'border': '2px solid #3f3f3f', 'width': '100px', 'text-align': 'center', 'box-shadow': '0 2px 6px rgba(0, 0, 0, 0.3)','cursor': 'pointer'});
	jQuery(clearAll).css({'margin-bottom': '16px', 'height': '30px', 'line-height': '30px', 'border-radius': '8px', 'box-shadow': 'inset 1px 1px 8px #a8a8a8', 'color': '#3f3f3f'});	
	jQuery(clearAll).css({'-webkit-touch-callout': 'none', '-webkit-user-select': 'none', '-khtml-user-select': 'none', '-moz-user-select': 'none', '-ms-user-select': 'none', 'user-select': 'none'});	
	jQuery(clearAll).hover(function() {
		jQuery(this).css({'box-shadow': 'inset -1px -1px 8px #a8a8a8', 'background-color': '#dcdcdc'});
	}, function() {
		jQuery(this).css({'box-shadow': 'inset 1px 1px 8px #a8a8a8', 'background-color': '#d7d7d7'});
	});
	jQuery(clearAll).mousedown(function() {
		jQuery(this).css({'background-color': '#e4e4e4'});
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
		window.markers = [];
		window.blockMarkers = [[]];
		window.lines = [];
		window.circles = [];
		window.polygons = [];
		window.counter = 1;
		if(jQuery('#selectObstacles').length > 0) {
			map.controls[google.maps.ControlPosition.RIGHT].clear();
		}
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
			'<span style="position:absolute;top:0;right:0;cursor:pointer;" class="tooltipClose ui-icon ui-icon-closethick"></span>';
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
		}			
	}).on('click', function() {
		if(jQuery(this).attr('id') == window.options[currentOption])
  			jQuery('#' + window.options[currentOption]).tooltip('open');
   });//.click();
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
  	setTimeout(function() {jQuery(input).css({'display': 'block'});}, 500);
	clickable();
	initialForm();
}

function changeVals(d, to) {
	window.change.push(d);
	if(window.change.length == window.hw.length-2) {
		window.loading.dialog('close');
		for(i = 0; i < window.change.length; ++i) {
			ch = JSON.parse('[' + window.change[i] + ']');
			window.hw[ch[1]][10] = ch[0];
			var chain = jQuery('#ini-opt-deftype option:eq(' + ch[1] + ')').text(); 
			var last = chain.lastIndexOf('|');
			chain = chain.substr(0, last + 2);
			jQuery('#ini-opt-deftype option:eq(' + ch[1] + ')').text(chain + ch[0]);
		}
		var chain = jQuery('#ini-opt-deftype option:eq(0)').text(); 
		var last = chain.lastIndexOf('(');
		chain = chain.substr(0, last + 1);
		jQuery('#ini-opt-deftype option:eq(0)').text(chain + jQuery('#ini-opt-budtype option:selected').text() + ')')
		window.change = [];
	}
}

function initialForm() {
	jQuery('#options-dialog').html('<p class="ini-opt-class-tit">' + window.iniForm[window.lang][0] + '</p><hr />\
	<p class="ini-opt-class-sub"><input type="radio" name="ini-option" value="1" />' + window.iniForm[window.lang][1] + '</p>\
	<div id="new-deployment" />\
	<p class="ini-opt-class-sub"><input type="radio" name="ini-option" value="2" />' + window.iniForm[window.lang][2] + '</p>\
	<div id="load-deployment" />\
	<p class="ini-opt-class-sub"><input type="radio" name="ini-option" value="3" />' + window.iniForm[window.lang][3] + '</p>\
	<div id="man-deployment" />');
	window.optionsIni.dialog('open');
	jQuery('input:radio[name=ini-option]').change(function() {
		if(parseInt(jQuery('input:radio[name=ini-option]:checked').val()) == 1) {
			jQuery('#load-deployment').html('');
			jQuery('#man-deployment').html('');
			jQuery('#new-deployment').html('<table class="ini-opt-class"><tr><td>' + window.iniForm[window.lang][4] + '</td><td><input type="text" id="ini-opt-name" /></td></tr>\
			<tr><td>' + window.iniForm[window.lang][5] + '</td><td><select id="ini-opt-deftype"></select></td></tr>\
			<tr><td>' + window.iniForm[window.lang][6] + '</td><td><input type="text" id="ini-opt-budget" /><select id="ini-opt-budtype"><option value="GBP">GBP</option>\
			<option value="COP">COP</option><option value="USD">USD</option><option value="EUR">EUR</option></select></td></tr>\
			<tr><td /><td><div id="submit-new-d">' + window.iniForm[window.lang][7] + '</div></td></tr></table>');
			jQuery.ajax({
				url: 'ajax/data.php',
				type: 'post',
				data: {'action': 'hw_types'},
				success: function(data, status) {
					window.hw = data.substr(0, data.length-2).split('||');
					for(var i = 0; i < window.hw.length; ++i) {
						window.hw[i] = window.hw[i].split(',');
					}
					window.hw.unshift([0, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']);
					window.hw.unshift([-1, 'Name', 'Range (m)', 'Rate (Kbps)', 'Voltage', 'Frequency', 'RAM (Kb)', 'Flash mem. (Kb)', 'Energy (J)', 'Rx (mA)', 'Cost (' + jQuery('#ini-opt-budtype option:selected').text() + ')']);
					var values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					for(var i = 0; i < window.hw.length; ++i) {
						for(var j = 1; j < window.hw[i].length; ++j) {
							if(window.hw[i][j].length > values[j-1])
								values[j-1] = window.hw[i][j].length;
						}
					}
					var data2 = [];
					var chain = '';
					for(var i = 0; i < window.hw.length; ++i) {
						data2[i] = window.hw[i].slice();
						chain += '<option ';
						if(i == 0 || i == 1) {
							chain += 'disabled="disabled" ';
						}
						chain += 'value="' + window.hw[i][0] + '">';
						for(var j = 1; j < window.hw[i].length; ++j) {
							for(var k = 0; k < values[j-1] - window.hw[i][j].length; ++k) {
								if(i == 1) 
									data2[i][j] += '-';
								else
									data2[i][j] += '&nbsp;';
							}
							chain = chain + data2[i][j] + ' | ';
						}
						chain = chain.substr(0, chain.length - 3) + '</option>';
					}
					jQuery('#ini-opt-deftype').html(chain);
					var prevbudtype = jQuery('#ini-opt-budtype option:selected').text();
					jQuery('#ini-opt-budtype').change(function() {
						window.loading.dialog('open');
						if(jQuery('#ini-opt-budget').val() != '') {
							jQuery.ajax({
								type: 'post',
								url: 'ajax/data_no_bd.php',
								data: {'amount': jQuery('#ini-opt-budget').val(), 'from': prevbudtype, 'to': jQuery('#ini-opt-budtype option:selected').text(), 'action': 'curr_conv'},
								success: function(data){
									jQuery('#ini-opt-budget').val(data);
								}
							});
						}
						for(i = 2; i < window.hw.length; ++i) {
							jQuery.ajax({
								type: 'post',
								url: 'ajax/data_no_bd.php',
								data: {'it': i, 'amount': window.hw[i][10], 'from': prevbudtype, 'to': jQuery('#ini-opt-budtype option:selected').text(), 'action': 'curr_conv'},
								success: function(data) {
									changeVals(data);
								}
							});
						}
						prevbudtype = jQuery('#ini-opt-budtype option:selected').text();
					});
					jQuery('#submit-new-d').click(function() {
						window.defaultType = jQuery('#ini-opt-deftype option:selected').val();
						window.budget = jQuery('#ini-opt-budget').val();
						window.optName = jQuery('#ini-opt-name').val();
						window.budType = jQuery('#ini-opt-budtype option:selected').text();
						if(window.optName == '' || window.budget == '')
							alert(window.iniForm[window.lang][8]);
						else if(parseFloat(window.hw[parseInt(window.defaultType) + 1][10]) > window.budget) {
							alert(window.iniForm[window.lang][9]);
						} else {
							jQuery.ajax({
								type: 'post',
								url: 'ajax/data.php',
								data: {'action': 'name_exists', 'name': window.optName},
								success: function(data) {
									if(data == '0') {
										jQuery.ajax({
											type: 'post',
											url: 'ajax/data.php',
											data: {'action': 'insert_name', 'name': window.optName, 'budget': window.budget, 'type': window.defaultType, 'budtype': window.budType},
											success: function(data) {
												if(data.substring(0, 1) == 'y') {
													window.idDeploy = data.substring(2);
													jQuery('#language').css('zIndex', 99);
													window.optionsIni.dialog('close');
												}
											}
										});
									} else {
										alert(window.iniForm[window.lang][10]);
									}
								}
							});
						}
					});
				}, error: function(xhr, desc, err) {
					console.log(xhr);
					console.log("Details: " + desc + "\nError:" + err);
				}
			});
			jQuery("#ini-opt-budget").keydown(function (e) {
				if (jQuery.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
						 return;
				}
				if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
					e.preventDefault();
				}
			});
		} else if(parseInt(jQuery('input:radio[name=ini-option]:checked').val()) == 2) {
			jQuery('#new-deployment').html('');
			jQuery('#man-deployment').html('');
			jQuery('#load-deployment').html('<table class="ini-opt-class"><tr><td>' + window.iniForm[window.lang][11] + '</td><td><select id="ini-load-d"></select></td></tr>\
			<tr><td /><td><div id="submit-load-d">' + window.iniForm[window.lang][7] + '</div></td></tr></table>');
			jQuery.ajax({
				url: 'ajax/data.php',
				type: 'post',
				data: {'action': 'hw_types'},
				success: function(data, status) {
					window.hw = data.substr(0, data.length-2).split('||');
					for(var i = 0; i < window.hw.length; ++i) {
						window.hw[i] = window.hw[i].split(',');
					}
					window.hw.unshift([0, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']);
					window.hw.unshift([-1, 'Name', 'Range (m)', 'Rate (Kbps)', 'Voltage', 'Frequency', 'RAM (Kb)', 'Flash mem. (Kb)', 'Energy (J)', 'Rx (mA)', 'Cost (' + jQuery('#ini-opt-budtype option:selected').text() + ')']);
				},	error: function(xhr, desc, err) {
					console.log(xhr);
					console.log("Details: " + desc + "\nError:" + err);
				}
			});
			jQuery.ajax({
				type: 'post',
				url: 'ajax/data.php',
				data: {'action': 'search_deployments'},
				success: function(data) {
					if(data.length != 0) {
						var loaded = JSON.parse(data.substring(0, data.length-1) + ']');
						var select = '';
						for(i = 0; i < loaded.length; ++i) {
							select += '<option value="' + i + '">' + loaded[i][1] + '</option>';
						}
						jQuery('#ini-load-d').html(select);
						jQuery('#submit-load-d').click(function() {
							window.idDeploy = loaded[jQuery('#ini-load-d option:selected').val()][0];
							window.defaultType = loaded[jQuery('#ini-load-d option:selected').val()][2];
							window.budget = loaded[jQuery('#ini-load-d option:selected').val()][4];
							window.optName = loaded[jQuery('#ini-load-d option:selected').val()][1];
							window.budType = loaded[jQuery('#ini-load-d option:selected').val()][5];
							eval('map.setMapTypeId(google.maps.MapTypeId.' + loaded[jQuery('#ini-load-d option:selected').val()][10].toUpperCase() + ')');
							map.setCenter(new google.maps.LatLng(loaded[jQuery('#ini-load-d option:selected').val()][8], loaded[jQuery('#ini-load-d option:selected').val()][9]));
							map.setZoom(loaded[jQuery('#ini-load-d option:selected').val()][7]);
							window.loading.dialog('open');
							for(i = 2; i < window.hw.length; ++i) {
								jQuery.ajax({
									type: 'post',
									url: 'ajax/data_no_bd.php',
									data: {'it': i, 'amount': window.hw[i][10], 'from': 'GBP', 'to': window.budType, 'action': 'curr_conv'},
									success: function(data) {
										changeVals(data);
									}
								});
							}
							jQuery.ajax({
								type: 'post',
								url: 'ajax/data.php',
								data: {'action': 'load_nodes', 'deploy': window.idDeploy},
								success: function(data) {
									var nodes = JSON.parse(data.substring(0, data.length-1) + ']');
									for(var i = 0; i < nodes.length; ++i) {
										createMarker(new google.maps.LatLng(nodes[i][0], nodes[i][1]), false, nodes[i][3], false, nodes[i][4], nodes[i][5]);
										window.markers[i].set('type', nodes[i][2]);
									}
									createLines();
								}
							});
							jQuery.ajax({
								type: 'post',
								url: 'ajax/data.php',
								data: {'action': 'load_obstacles', 'deploy': window.idDeploy},
								success: function(data) {
									var obstacles = JSON.parse(data.substring(0, data.length-1) + ']');
									if(jQuery('#selectObstacles').length == 0) {
										var obstacleSelectorDiv = document.createElement('div');
										var obstacleSelector = new obsSelector(obstacleSelectorDiv);
										map.controls[google.maps.ControlPosition.RIGHT].push(obstacleSelectorDiv);
										var createObstacleDiv = document.createElement('div');
										var createObs = new createObstacle(createObstacleDiv);
										map.controls[google.maps.ControlPosition.RIGHT].push(createObstacleDiv);
										jQuery('#selectObstacles').hide();
										jQuery('#createObstacle').hide();
									}
									var j = 0;
									for(var i = 0; i < obstacles.length; ++i) {
										if(j != obstacles[i][2]) {
											jQuery('#selectObstacles').append('<option value="' + parseInt(parseInt(jQuery('#selectObstacles option:last').attr('value')) + 1) + '">' + window.obsName[window.lang] + parseInt(parseInt(jQuery('#selectObstacles option:last').attr('value')) + 2) + '</option>');
											window.blockMarkers.push([]);
										}
										createBlockMarker(new google.maps.LatLng(obstacles[i][0], obstacles[i][1]), obstacles[i][2], true);
										j = obstacles[i][2];
									}
									if(window.blockMarkers[jQuery('#selectObstacles option:last').val()].length == 0) {
										jQuery('#createObstacle').prop('disabled', true);
										jQuery('#createObstacle').css({'cursor': 'default', 'background-color': '#dfdfdf', 'color': '#c6c6c6'});
									}
									jQuery('#selectObstacles option:last').prop('selected', true);
									selectedBlock();
									createBlocks();
									
								}
							});
							jQuery('#language').css('zIndex', 99);
							jQuery('#user-info').css('zIndex', 99);
							window.optionsIni.dialog('close');
							window.currentOption = loaded[jQuery('#ini-load-d option:selected').val()][6];
							buttons(window.options[window.currentOption]);
							clickable();
						});
					} else {
						jQuery('.ini-opt-class').html('<tr><td>' + window.iniForm[window.lang][12] + '</td></tr>');
					}
				}
			});
		} else {
			jQuery('#new-deployment').html('');
			jQuery('#load-deployment').html('');
			jQuery('#man-deployment').html('<table class="ini-opt-class"><tr><td>' + window.iniForm[window.lang][13] + '</td><td><select multiple id="ini-share-d"></select></td></tr>\
			<tr><td>' + window.iniForm[window.lang][14] + '</td><td><select multiple id="ini-share2-d"></select></td></tr>\
			<tr><td /><td><div id="submit-share-d">' + window.iniForm[window.lang][7] + '</div></td></tr></table>');
			jQuery.ajax({
				type: 'post',
				url: 'ajax/data.php',
				data: {'action': 'search_deployments_share'},
				success: function(data) {
					jQuery.ajax({
						type: 'post',
						url: 'ajax/data.php',
						data: {'action': 'search_users'},
						success: function(data) {
							if(data.length != 0) {
								var users = JSON.parse(data.substring(0, data.length-1) + ']');
								var select = '';
								for(i = 0; i < users.length; ++i) {
									select += '<option value="' + i + '">' + users[i][1] + '</option>';
								}
								jQuery('#ini-share2-d').html(select);
							}
							jQuery('#submit-share-d').click(function() {
								if(jQuery('#ini-share-d').val() == null || jQuery('#ini-share2-d').val() == null) {
									alert(window.iniForm[window.lang][15]);
								} else {
									var depl = [];
									var usr = [];
									for(var i = 0; i < jQuery('#ini-share-d').val().length; ++i) {
										depl.push(deploym[jQuery('#ini-share-d').val()[i]][0]);
									}
									for(var j = 0; j < jQuery('#ini-share2-d').val().length; ++j) {
										usr.push(users[jQuery('#ini-share2-d').val()[j]][0]);
									}
									jQuery.ajax({
										type: 'post',
										url: 'ajax/data.php',
										data: {'action': 'share_deployments', 'deployments': depl, 'users': usr},
										success: function(data) {
											alert(window.iniForm[window.lang][16]);
										}
									});
								}
							});
						}
					});
					if(data.length != 0) {
						var deploym = JSON.parse(data.substring(0, data.length-1) + ']');
						var select = '';
						for(i = 0; i < deploym.length; ++i) {
							select += '<option value="' + i + '">' + deploym[i][1] + '</option>';
						}
						jQuery('#ini-share-d').html(select);
					}
				}
			});
		}
	});
}

function saveState() {
	jQuery('#saveState').click(function() {
		var markersLat = '';
		var markersLng = '';
		var markersType = '';
		var markersGate = '';
		var circlesRad = '';
		var blockMarkersLat = '';
		var blockMarkersLng = '';
		var sensors = '';
		for(var i = 0; i < window.markers.length; ++i) {
			markersLat += window.markers[i].position.lat() + ',';
			markersLng += window.markers[i].position.lng() + ',';
			markersType += window.markers[i].get('type') + ',';
			markersGate += window.markers[i].get('gateway') + ',';
			circlesRad += window.circles[i].getRadius() + ',';
			sensors += jQuery(window.imgs[i]).html().replace(/"/g, '\'') + ',';
		}
		for(var i = 0; i < window.blockMarkers.length; ++i) {
			for(var j = 0; j < window.blockMarkers[i].length; ++j) {
				blockMarkersLat += i + '-' + window.blockMarkers[i][j].position.lat() + ',';
				blockMarkersLng += window.blockMarkers[i][j].position.lng() + ',';
			}
		}
		jQuery.ajax({
			type: 'post',
			url: 'ajax/data.php',
			data: {'action': 'insert_nodes', 'lat': markersLat, 'lng': markersLng, 'id-deploy': window.idDeploy, 'type': markersType, 'gate': markersGate, 'radius': circlesRad,
				'zoom': map.getZoom(), 'maptype': map.getMapTypeId(), 'center': map.getCenter().lat() + ',' + map.getCenter().lng(), 'step': window.currentOption,
				'block-lat': blockMarkersLat, 'block-lng': blockMarkersLng, 'budremain': window.budget, 'sensors': sensors},
			success: function(data) {
				jQuery('#state-text').text(window.confirmStates[window.lang][0]);
				window.dialog.dialog('open');
			}
		});
	});
}

function loadState() {
	jQuery('#loadState').click(function() {	
		window.open('./','_blank');
	});
}

function clickable() {
	for(i = 0; i < window.options.length; ++i) {
		jQuery('#' + window.options[i]).off('click.nextprev');

		if(window.currentOption == (i+1)) {
			jQuery('#' + window.options[i]).css({'background-color': '#7A995C', 'cursor': 'pointer'});
			jQuery('#' + window.options[i]).addClass('nextpr Previous');
		} else if(window.currentOption == (i-1)) {
			jQuery('#' + window.options[i]).css({'background-color': '#7A995C', 'cursor': 'pointer'});
			jQuery('#' + window.options[i]).addClass('nextpr Next');
		} else if(window.currentOption == i) {
			jQuery('#' + window.options[i]).css({'background': '#29331F', 'cursor': 'default'});
			jQuery('#' + window.options[i]).removeClass('nextpr Next');
			jQuery('#' + window.options[i]).on()
		} else {
			jQuery('#' + window.options[i]).css({'background-color': '#D3DEC8', 'cursor': 'default'});
			jQuery('#' + window.options[i]).removeClass('nextpr Next');
		}
	}
	jQuery('.nextpr').on('click.nextprev', function() { nextPrev(this); });
}

function languageSel() {
	jQuery('#title').text(window.title[window.lang]);
	document.title = window.tabName[window.lang];
	jQuery('.nextprev.Previous').text(window.arrows[window.lang][0]);
	jQuery('.nextprev.Next').text(window.arrows[window.lang][1]);
	jQuery('#saveState').text(window.states[window.lang][0]);
	jQuery('#loadState').text(window.states[window.lang][1]);
	jQuery('#hello').text(window.hello[window.lang]);
	jQuery('#logout').text(window.logout[window.lang]);
	jQuery('#place-div').prop('placeholder', window.placeDiv[window.lang]);
	for(i = 0; i < window.options.length; ++i) {
		jQuery('#' + window.options[i]).text(window.optionNames[window.lang][i]);
	}
}

function computeDistance(a, b, i, j) {
	var distance = google.maps.geometry.spherical.computeDistanceBetween(a, b);
	if(distance <= Math.min(window.circles[i].getRadius(), window.circles[j].getRadius()) && !crossesPolygon(a, b, a)) {
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
				new google.maps.LatLng(window.markers[j].getPosition().lat(), window.markers[j].getPosition().lng()), i, j);
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

function deleteMarker(i, type) {
	window.budget += parseFloat(window.hw[parseInt(type) + 1][10]);
	jQuery('#bud-amnt').text(window.budget);
	window.markers[i-1].setMap(null);
	window.circles[i-1].setMap(null);
	window.dispImg[i-1].close();
	for(var j = i; j < window.markers.length; j++) {
		window.markers[j].id--;
		window.circles[j].id--;
		var color = (window.markers[j].get('gateway') == '1') ? 'orange' : 'red';
		window.markers[j].setIcon('http://gmaps-samples.googlecode.com/svn/trunk/markers/' + color + '/marker' + window.circles[j].id + '.png');
	}
	window.counter--;
	window.markers.splice(i-1, 1);
	window.circles.splice(i-1, 1);
	window.dispImg.splice(i-1, 1);
	window.imgs.splice(i-1, 1);
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
		scaleControl: true,
		streetViewControl: false,
		panControl: false,
		zoomControl: false,
		keyboardShortcuts: false,
		disableDoubleClickZoom: true,
		scrolwheel: false,
		draggableCursor: 'default'
	});
	jQuery('#place-div').css('display', 'none');
	jQuery('#clear-all').css('display', 'none');
}

function initializeVariables() {
	window.change = [];
	window.markers = [];
	window.blockMarkers = [[]];
	window.lines = [];
	window.circles = [];
	window.counter = 1;
	window.lang = 'en';
	window.polygons = [];
	window.imgs = [];
	window.dispImg = [];
	window.placeDiv = {'en': 'Search Box', 'es': 'Búsqueda'}
	window.title = {'en': 'Wireless Sensor Network Deployment Design', 'es': 'Diseño de Despliegue de Redes Inalámbricas de Sensores'};
	window.tabName = {'en': 'Wireless Sensor Network Deployment Design', 'es': 'Diseño de Despliegue de Redes Inalámbricas de Sensores'};
	window.arrows = {'en': ['< Previous', 'Next >'], 'es': ['< Anterior', 'Siguiente >']};
	window.states = {'en': ['Save State', 'Load State'], 'es': ['Guardar Estado', 'Cargar Estado']};
	window.options = ['Area', 'Obstacles', 'Nodes'];
	window.obsName = {'en': 'Obstacle ', 'es': 'Obstáculo '};
	window.menuText = {'en': ['Delete Node', 'Delete Obstacle'], 'es': ['Borrar Nodo', 'Borrar Obstáculo']};
	window.newObs = {'en': 'New Obstacle', 'es': 'Nuevo Obstáculo'};
	window.clearText = {'en': 'Clear All', 'es': 'Borrar Todo'};
	window.hello = {'en': 'Hello ', 'es': 'Hola '};
	window.logout = {'en': 'Logout', 'es': 'Salir'};
	window.noMasNodos = {'en': 'There is no more budget for this node', 'es': 'No hay más presupuesto para este nodo'};
	window.iniForm = {'en': ['What would you like to do?', 'Create a new deployment', 'Load a pre-existing deployment', 'Manage deployments', 
		'Please select a name for the deployment', 'Please select a default node type', 'Please select available budget', 'Submit',
		'Please define all fields', 'Budget is too low', 'Name already exists', 'Select a deployment to load', 'No deployments to load',
		'Select the deployments to share', 'Select the users to share to', 'Please select at least one of each box', 'Deployments shared successfully'],
		'es': ['Qué desea hacer?', 'Crear un nuevo despliegue', 'cargar un despliegue pre-existente',
		'Administrar despliegues', 'Seleccione un nombre para el despliegue', 'Seleccione un tipo de nodo por defecto',
		'Seleccione el presupuesto disponible', 'Enviar', 'Por favor defina todos los campos', 'El presupuesto es muy bajo', 'El nombre ya existe',
		'Seleccione el despliegue a cargar', 'No hay depliegues para cargar', 'Seleccione los despliegues para compartir', 'Seleccione los usuarios a quiénes compartir',
		'Por favor elija al menos uno de cada cuadro', 'Los depliegues han sido compartidos exitosammente']};
	window.confirmStates = {'en': ['State Saved', 'State Loaded', 'No Previous Data'], 'es': ['Estado Guardado', 'Estado Cargado', 'No Hay Datos Previos']};
	window.optionNames = {'en': ['Select Area', 'Define Obstcles', 'Place Nodes'], 'es': ['Elegir Área', 'Definir Obstáculos', 'Ubicar Nodos']};
	window.optionDescriptions = {'en': ['This is the first stage of the <span style="font-weight:bold;">"Wireless Sensor Network Deployment Design"</span> tool.<br /><br /> \
		Choose the Area you want to work in and once you\'re comfortable, click on <span style="font-weight:bold;">Next</span>.<br /><br />To open back this \
		Tooltip in case you close it, click on ',
		'This step allows you to define the obstacles in the area. You can define as many as you want through the "obstacle selector" option in the upper \
		right border of the map.<br /><br />To open back this Tooltip in case you close it, click on ',
		'Once the obstacles are defined, this step allows you to place the nodes and select the type of sensor in each one according to the available budget \
		previously defined.<br /><br />To open back this Tooltip in case you close it, click on '],
		'es': ['Ésta es la primera etapa de la herramienta de <span style="font-weight:bold;">"Diseño de Despliegue de Redes Inalámbricas de Sensores"</span>.<br /><br /> \
		Elija el área en la que quiere trabajar y una vez esté cómodo, haga click en <span style="font-weight:bold;">Siguiente</span>.<br /><br />Para volver a abrir esta \
		Ayuda en caso de que la cierre, haga click en ',
		'Este paso le permite definir los obstáculos en el área. Puede definir tantos como quiera a través de la opción "selector de obstáculos" en el borde superior \
		derecho del mapa.<br /><br />Para volver a abrir esta Ayuda en caso de que la cierre, haga click en ',
		'Una vez hayan sido definidos los obstáculos, este paso le permite ubicar los nodos y seleccionar el tipo de sensor en cada uno de acuerdo al presupuesto disponible \
		anteriormente definido.<br /><br />Para volver a abrir esta Ayuda en caso de que la cierre, haga click en '	]};
	window.currentOption = 0;
	window.dialog = jQuery('#confirm-state').dialog({
		autoOpen: false,
		height: 60,
		width: 200,
		modal: true
	});
	window.optionsIni = jQuery('#options-dialog').dialog({
		autoOpen: false,
		height: 624,
		position: {my: 'top left', at: 'top left', of: jQuery('#container')},
		width: 846,
		modal: true
	});
	jQuery('.state-close').click(function() {
		window.dialog.dialog('close');
	});
	jQuery(window).resize(function() {
		window.optionsIni.dialog({
			position: {my: 'top left', at: 'top left', of: jQuery('#container')}
		});
	});
	window.loading = jQuery('#loading-dialog').dialog({
		autoOpen: false,
		height: 100,
		width: 100,
		modal: true,
		dialogClass: 'loading-dia'
	});
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

function obsSelectorCall() {
	var obstacleSelectorDiv = document.createElement('div');
	var obstacleSelector = new obsSelector(obstacleSelectorDiv);
	map.controls[google.maps.ControlPosition.RIGHT].push(obstacleSelectorDiv);
	var createObstacleDiv = document.createElement('div');
	var createObs = new createObstacle(createObstacleDiv);
	map.controls[google.maps.ControlPosition.RIGHT].push(createObstacleDiv);
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
	var boxSensors = document.createElement('div');
    jQuery(boxSensors).addClass('menu-sensors');
	var boxText = document.createElement('div');
    jQuery(boxText).addClass('menu-mark-container');
	jQuery(boxSensors).html('<input type="checkbox" name="sens" value="1" ' + (jQuery(window.imgs[marker.id-1]).html().indexOf('1') >= 0 ? 'checked' : '') + ' /> Pressure<br /> \
		<input type="checkbox" name="sens" value="2" ' + (jQuery(window.imgs[marker.id-1]).html().indexOf('2') >= 0 ? 'checked' : '') + ' /> Temperature<br /> \
		<input type="checkbox" name="sens" value="3" ' + (jQuery(window.imgs[marker.id-1]).html().indexOf('3') >= 0 ? 'checked' : '') + ' /> Light<br /> \
		<input type="checkbox" name="sens" value="4" ' + (jQuery(window.imgs[marker.id-1]).html().indexOf('4') >= 0 ? 'checked' : '') + ' /> Humidity<br /> \
		<input type="checkbox" name="sens" value="5" ' + (jQuery(window.imgs[marker.id-1]).html().indexOf('5') >= 0 ? 'checked' : '') + ' /> Magnetic Field<br /> \
		<input type="checkbox" name="sens" value="6" ' + (jQuery(window.imgs[marker.id-1]).html().indexOf('6') >= 0 ? 'checked' : '') + ' /> GPS');
	var delMark = document.createElement('div');
	var typeSel = document.createElement('div');
	var gateNode = document.createElement('div');
	jQuery(delMark).addClass('menu-mark');
	jQuery(gateNode).addClass('gate-mark');
	jQuery(typeSel).addClass('type-mark');
	jQuery(delMark).add(typeSel).add(gateNode).add(boxSensors).hover(function() {
			jQuery(this).css({'color': '#3f3f3f', 'background-color': '#dadada', 'border': '1px solid #3f3f3f', 'padding': '1px'});
		},
		function() {
			jQuery(this).css({'color': '#3c3c3c', 'background-color': '#c6c6c6', 'border': '0', 'padding': '2px'});
		});
	jQuery(delMark).html(window.menuText[window.lang][0]);
	var id = marker.id - 1;
	var typeSelHtml = '';
	for(var i = 2; i < window.hw.length; ++i) {
		typeSelHtml += '<input type="radio" name="rad' + id + '" value="' + (i - 1) + '" />' + window.hw[i][1] + '<br />';
	}
	jQuery(gateNode).html('<input type="checkbox" name="gate" value="1" /> Gateway Node');
	jQuery(typeSel).html(typeSelHtml);
	var tableText = document.createElement('table');
	tableTr = tableText.insertRow(0);
	tableTd1 = tableTr.insertCell(0);
	jQuery(tableTd1).css({'vertical-align': 'top'});
	tableTd1.appendChild(delMark);
	tableTd1.appendChild(gateNode);
	tableTd1.appendChild(boxSensors);
	tableTd2 = tableTr.insertCell(1);
	jQuery(tableTd2).css({'vertical-align': 'top'});
	tableTd2.appendChild(typeSel);
	boxText.appendChild(tableText);
	var options = {
		content: boxText,
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(15, -42),
		zIndex: null,
		boxStyle: {
			opacity: 0.9,
			width: '302px'
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
	jQuery(typeSel).children().filter('[value="' + marker.get('type') + '"]').prop('checked', true);
	if(marker.get('gateway') == '1')
		jQuery(gateNode).children().filter('[value="1"]').prop('checked', true);
	jQuery(delMark).mouseup(function() {
		deleteMarker(marker.id, marker.get('type'));
		ib.close();
	});
	jQuery(typeSel).change(function() {
		var newVal = parseFloat(window.hw[parseInt(jQuery('input:radio[name=rad' + id + ']:checked').val()) + 1][10]) - parseFloat(window.hw[parseInt(marker.get('type')) + 1][10]);
		if(newVal <= window.budget) {
			window.budget -= newVal;
			jQuery('#bud-amnt').text(window.budget);
			marker.set('type', jQuery('input:radio[name=rad' + id + ']:checked').val());
			window.circles[marker.id-1].setRadius(parseFloat(window.hw[parseInt(marker.get('type')) + 1][2]));
			createLines();
		} else {
			jQuery(typeSel).children().filter('[value="' + marker.get('type') + '"]').prop('checked', true);
			alert(window.noMasNodos[window.lang]);
		}
	});
	jQuery(gateNode).change(function() {
		if(jQuery('input:checkbox[name=gate]:checked').val() == '1') {
			marker.setIcon('http://gmaps-samples.googlecode.com/svn/trunk/markers/orange/marker' + marker.id + '.png');
			marker.set('gateway', 1);
		} else {
			marker.setIcon('http://gmaps-samples.googlecode.com/svn/trunk/markers/red/marker' + marker.id + '.png');
			marker.set('gateway', 0);
		}
	});
	jQuery(boxSensors).change(function() {
		var searchIds = jQuery('input:checkbox[name=sens]:checked').map(function(){
			return $(this).val();
		}).get();
		var searchText = '';
		for(var i = 0; i < searchIds.length; ++i) {
			searchText += '<img src="images/sensors-img/' + searchIds[i] + '.png" /><br />';
		}
		jQuery(window.imgs[marker.id-1]).html(searchText);
	});
}

function callBlockMenu(block) {
	var boxText = document.createElement('div');
    jQuery(boxText).addClass('menu-mark-container');
	var delMark = document.createElement('div');
	jQuery(delMark).addClass('menu-mark-block');
	jQuery(delMark).hover(function() {
			jQuery(this).css({'color': '#3f3f3f', 'background-color': '#dadada', 'border': '1px solid #3f3f3f', 'padding': '1px'});
		},
		function() {
			jQuery(this).css({'color': '#3c3c3c', 'background-color': '#c6c6c6', 'border': '0', 'padding': '2px'});
		});
	jQuery(delMark).html(window.menuText[window.lang][1]);
	boxText.appendChild(delMark);
	var options = {
		content: boxText,
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(15, -42),
		zIndex: null,
		boxStyle: {
			opacity: 0.9,
			width: '160px'
		},
		closeBoxMargin: '12px 4px 4px 4px',
		closeBoxURL: 'http://www.google.com/intl/en_us/mapfiles/close.gif',
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: 'floatPane',
		enableEventPropagation: false
	};
	var ib = new InfoBox(options);
	ib.open(map, block);
	jQuery(delMark).mouseup(function() {
		deleteBlockMarker(block.id);
		ib.close();
	});
}

function createMarker(e, lines, r, decrease, gateway, sensors) {
	if(typeof(r) === 'undefined') r = parseFloat(window.hw[parseInt(window.defaultType) + 1][2]);
	if(typeof(decrease) === 'undefined') decrease = true;
	if(typeof(gateway) === 'undefined') gateway = 0;
	if(typeof(sensors) === 'undefined') sensors = '';
	var color = (gateway == 0) ? 'red' : 'orange';
	if(window.budget > parseFloat(window.hw[parseInt(window.defaultType) + 1][10])) {
		if(decrease == true)
			window.budget -= parseFloat(window.hw[parseInt(window.defaultType) + 1][10]);
		jQuery('#bud-amnt').text(window.budget);
		var marker = new google.maps.Marker({
			position: e,
			map: map,
			id: window.counter,
			draggable:true,
			icon: 'http://gmaps-samples.googlecode.com/svn/trunk/markers/' + color + '/marker' + window.counter + '.png'
		});
		marker.set('type', window.defaultType);
		marker.set('gateway', gateway);
		google.maps.event.addListener(marker, 'rightclick', function() {
			callMenu(marker);
		});
		google.maps.event.addListener(marker, 'dragstart', function() {
			for(var i = 0; i < window.lines.length; i++) {
				if((window.lines[i].getPath().getAt(0).lat() == marker.getPosition().lat() && window.lines[i].getPath().getAt(0).lng() == marker.getPosition().lng()) ||
				(window.lines[i].getPath().getAt(1).lat() == marker.getPosition().lat() && window.lines[i].getPath().getAt(1).lng() == marker.getPosition().lng()))
					window.lines[i].setMap(null);
			}
			window.circles[marker.id-1].setMap(null);
		});
		google.maps.event.addListener(marker, 'dragend', function() {
			window.circles[marker.id-1].setMap(map);
			window.circles[marker.id-1].setCenter(new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng()));
			createLines();
		});
		window.markers.push(marker);
		var circleOptions = {
			strokeColor: '#ADFF2F',
			strokeOpacity: 0.5,
			strokeWeight: 2,
			fillColor: '#ADFF2F',
			fillOpacity: 0.25,
			map: map,
			center: e,
			radius: r,
			clickable: false,
			id: window.counter,
			zIndex: 1
		};
		var circle = new google.maps.Circle(circleOptions);
		window.circles.push(circle);
		window.counter++;
		if(lines) {
			createLines();
		}
	} else {
		alert(window.noMasNodos[window.lang]);
	}
	var vimgs = document.createElement('div');
	jQuery(vimgs).html(sensors);
	jQuery(vimgs).addClass('class-imgs');
	var optionsImgs = {
		content: vimgs,
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(-28, -45),
		zIndex: null,
		closeBoxURL: '',
		boxStyle: {
			opacity: 1,
			width: '20px'
		},
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: 'floatPane',
		enableEventPropagation: false
	};
	var dispImgs = new InfoBox(optionsImgs);
	dispImgs.open(map, marker);
	window.imgs.push(vimgs);
	window.dispImg.push(dispImgs);
}

function createBlockMarker(e, valor, blocks) {
	var blockMarker = new google.maps.Marker({
		position: e,
		map: map,
		id: (valor + ',' + (window.blockMarkers[valor].length)),
		draggable: true,
		icon: 'http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/marker' + (window.blockMarkers[valor].length + 1) +'.png'
	});
	google.maps.event.addListener(blockMarker, 'rightclick', function() {
		callBlockMenu(blockMarker);
	});
	google.maps.event.addListener(blockMarker, 'dragstart', function() {
		window.polygons[jQuery('#selectObstacles option:selected').val()].setMap(null);
	});
	google.maps.event.addListener(blockMarker, 'dragend', function() {
		createBlocks();
	});
	window.blockMarkers[valor].push(blockMarker);
	if(blocks) {
		createBlocks();
	}
}

function createBudgetDisplay() {
	var budgetDisplayDiv = document.createElement('div');
	budgetDisplayDiv.id = 'budgetDisplay';
	jQuery(budgetDisplayDiv).html('<span id="bud-type">' + window.budType + ' </span><span id="bud-amnt">' + window.budget + '</span>');
	map.controls[google.maps.ControlPosition.TOP].push(budgetDisplayDiv);
}

function buttons(opt) {
	if(opt == 'Area') {
		window.map.setOptions({
			scaleControl: true,
			streetViewControl: false,
			panControl: true,
			zoomControl: true,
			keyboardShortcuts: true,
			disableDoubleClickZoom: false,
			scrolwheel: true,
			draggableCursor: 'move'
		});
		jQuery('#selectObstacles').hide();
		jQuery('#createObstacle').hide();
		jQuery('#budgetDisplay').hide();
		selectedBlock();
		jQuery('#place-div').css('display', 'block');
		jQuery('#clear-all').css('display', 'block');
		google.maps.event.removeListener(window.lis);
	}
	if(opt == 'Nodes') {
		google.maps.event.removeListener(window.lis);
		staticOptions();
		jQuery('#selectObstacles').hide();
		jQuery('#createObstacle').hide();
		if(jQuery('#budgetDisplay').length == 0) {
			createBudgetDisplay();
		} else {
			jQuery('#budgetDisplay').show();
		}
		selectedBlock();
		window.lis = google.maps.event.addListener(map, 'click', function(event) {
			createMarker(event.latLng, true);
		});
	}
	if(opt == 'Obstacles') {
		google.maps.event.removeListener(window.lis);
		staticOptions();
		jQuery('#budgetDisplay').hide();
		if(jQuery('#selectObstacles').length == 0) {
			obsSelectorCall();
		} else {
			jQuery('#selectObstacles').show();
			jQuery('#createObstacle').show();
		}
		selectedBlock();
		window.lis = google.maps.event.addListener(map, 'click', function(event) {
			createBlockMarker(event.latLng, jQuery('#selectObstacles option:selected').val(), true);
		});
	}
}

function nextPrev(el) {
	if(jQuery(el).attr('class').indexOf('Next') > -1 && currentOption < options.length-1) {
		jQuery('#' + options[currentOption]).tooltip('close');
		window.currentOption += 1;
		buttons(options[currentOption]);
		if(jQuery('.ui-tooltip').length != 0) {
			jQuery('#' + options[currentOption]).tooltip('open');
		}
		clickable();
	} else if(jQuery(el).attr('class').indexOf('Previous') > -1 && currentOption > 0) {
		jQuery('#' + options[currentOption]).tooltip('close');
		window.currentOption -= 1;
		buttons(options[currentOption]);
		if(jQuery('.ui-tooltip').length != 0) {
			jQuery('#' + options[currentOption]).tooltip('open');
		}
		clickable();
	}
}

jQuery(document).ready(function() {
	initializeVariables();
	initialize();
});