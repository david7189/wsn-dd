function initialize() {
	jQuery('.lang').css({'cursor': 'pointer', 'text-decoration': 'none', 'text-transform': 'lowercase'});
	jQuery('.lang:hover').css({'text-decoration': 'underline'});
	jQuery('#' + window.lang).css({'text-transform': 'uppercase', 'text-decoration': 'underline', 'cursor': 'default'});
	languageSel();
	jQuery('.lang').click(function() {
		if(jQuery(this).prop('id') != window.lang) {
			var pag = window.location.href;
			if(window.location.href.indexOf('?lang=') > -1) {
				pag = window.location.href.substr(0, window.location.href.indexOf('?lang='));
			}
			window.location.href = pag + '?lang=' + jQuery(this).prop('id');
		}
	});
	jQuery('#node-search-sel').on('change', function() {
		if(jQuery('#node-search-sel option:selected').val() != '0') {
			map.panTo(window.markers[jQuery('#node-search-sel option:selected').val()-1].getPosition());
			jQuery('#node-search-sel option[value="0"]').prop('selected', true);
		}
	});
	jQuery('.cur-dep-name').text(window.curDep[window.lang] + ':');
	jQuery('#node-searcher-title').text(window.nodesSearch[window.lang]);
	jQuery('#budget-d1-title').text(window.budgetRem[window.lang][0]);
	jQuery('#budget-d2-title').text(window.budgetRem[window.lang][1]);
	jQuery('#budget-d3-title').text(window.budgetRem[window.lang][2]);
	var distanceRight = (screen.width - jQuery('#container').css('width').substring(0, jQuery('#container').css('width').length - 2))/2;
	distanceRight = (distanceRight - jQuery('#language').css('width').substring(0, jQuery('#language').css('width').length - 2))/2 - 10;
	jQuery('#language').css({'right': distanceRight, 'display': 'block'});
	jQuery('#user-info').css({'left': distanceRight, 'display': 'block'});
	jQuery('#node-searcher').css({'left': distanceRight});
	jQuery('#budget-d').css({'left': distanceRight});
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
	jQuery('.nextprev').click(function() {
		nextPrev(this);
	});
	jQuery('#place-div').val('');
	var options = {
		center: new google.maps.LatLng(window.coordinates[0], window.coordinates[1]),
		zoom: window.coordinates[2],
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
	google.maps.event.addListenerOnce(map, 'idle', function(){
		jQuery('input:radio[name=ini-option]').prop('disabled', false);
		window.mapLoaded = true;
	});
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
		jQuery('#clear-all-div-p').text(window.menuText[window.lang][4]);
		window.delT.dialog('open');
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
	}).on('mouseover', function(event) {
  		event.stopImmediatePropagation();
	}).on('mouseout', function(event) {
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
		if(jQuery(this).prop('id') == window.options[currentOption])
  			jQuery('#' + window.options[currentOption]).tooltip('open');
   });//.click();
	var input = /** @type {HTMLInputElement} */(document.getElementById('place-div'));
	//var input = document.getElementById('place-div');
	map.controls[google.maps.ControlPosition.TOP].push(input);
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(FullScreenControl(map, window.fullscreen[window.lang][0], window.fullscreen[window.lang][1]));
	var searchBox = new google.maps.places.SearchBox(/** @type {HTMLInputElement} */(input));
	//var searchBox = new google.maps.places.SearchBox('input');
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

function clearAllB() {
	window.loading.dialog('open');
	window.budget = window.budgetT;
	for (var i = 0; i < window.markers.length; ++i) {
		window.markers[i].setMap(null);
	}
	for (var i = 0; i < window.dispImg.length; ++i) {
		window.dispImg[i].setMap(null);
	}
	for (var i = 0; i < window.disX.length; ++i) {
		window.disX[i].setMap(null);
	}
	for (var i = 0; i < window.blockMarkers.length; ++i) {
		for (var j = 0; j< window.blockMarkers[i].length; ++j) {
			window.blockMarkers[i][j].setMap(null);
		}
	}
	for (var i = 0; i < window.lines.length; ++i) {
		window.lines[i].setMap(null);
	}
	for (var i = 0; i < window.circles.length; ++i) {
		window.circles[i].setMap(null);
	}
	for (var i = 0; i < window.polygons.length; ++i) {
		window.polygons[i].setMap(null);
	}
	jQuery('#bud-amnt').text(window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	jQuery('#budget-d1-value').text(window.budType + ' ' + window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	jQuery('#budget-d2-value').text(window.budType + ' ' + (window.budgetT-window.budget).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	jQuery('#node-search-sel').find('option:not(:first)').remove();
	window.streams = {};
	window.nodesStreams = {};
	jQuery('#manage-str-d').html('&nbsp;');
	window.x = [];
	window.disX = [];
	window.imgs = [];
	window.dispImg = [];
	window.markers = [];
	window.blockMarkers = [[]];
	window.lines = [];
	window.circles = [];
	window.polygons = [];
	window.counter = 1;
	if(jQuery('#selectObstacles').length > 0) map.controls[google.maps.ControlPosition.RIGHT].clear();
	jQuery('#manage-str-d').html('');
	window.loading.dialog('close');
}

function updateLastDate2() {
	jQuery.ajax({
		type: 'post',
		url: 'ajax/data.php',
		data: {'id_deploy': window.idDeploy, 'action': 'update_last_date'},
		success: function(data){
			if(data != 'OK') {
				//console.log(data);
				location.reload();
			}
		}
	});
}

function updateLastDate() {
	updateLastDate2();
	setInterval(function(){
		updateLastDate2();
	}, 5000);
}

function checkLoaded() {
	if(window.loaded1 && window.loaded2 && window.loaded3 && window.loaded4 && window.loaded5) {
		updateLastDate();
		window.loading.dialog('close');
		map.setCenter(window.centerMap);
		if(window.currentOption == 5) {
			jQuery.each(window.markers, function(index, value) {
				value.setOptions({draggable: false});
				google.maps.event.clearListeners(value, 'rightclick');
			});
			testConnectivity();
		}
		loadStreams();
		jQuery('#' + window.options[currentOption]).click();
	}
}

function changeVals(d) {
	window.change.push(d);
	if(window.change.length == window.hw.length-2) {
		if(parseInt(jQuery('input:radio[name=ini-option]:checked').val()) == 2) {
			window.loaded1 = true;
			checkLoaded();
		} else {
			window.loading.dialog('close');
		}
		for(i = 0; i < window.change.length; ++i) {
			try {
				ch = JSON.parse('[' + window.change[i] + ']');
				window.hw[ch[1]][10] = parseFloat(ch[0]).toFixed(2);
				var chain = jQuery('#ini-opt-deftype option:eq(' + ch[1] + ')').text(); 
				var last = chain.lastIndexOf('|');
				chain = chain.substr(0, last + 2);
				jQuery('#ini-opt-deftype option:eq(' + ch[1] + ')').text(chain + String(parseFloat(ch[0]).toFixed(2)));
			} catch(err) {
				location.reload();
			}
		}
		var chain = jQuery('#ini-opt-deftype option:eq(0)').text(); 
		var last = chain.lastIndexOf('(');
		chain = chain.substr(0, last + 1);
		jQuery('#ini-opt-deftype option:eq(0)').text(chain + jQuery('#ini-opt-budtype option:selected').text() + ')')
		window.change = [];
	}
}

function shareDeployment() {
	jQuery('.ini-opt-class').remove();
	jQuery('.ini-opt-class-2').remove();
	jQuery('#man-deployment').append('<table class="ini-opt-class"><tr><td>' + window.iniForm[window.lang][13] + '</td><td><select multiple id="ini-share-d"></select></td></tr>\
	<tr><td>' + window.iniForm[window.lang][14] + '</td><td><select multiple id="ini-share2-d"></select></td></tr>\
	<tr><td /><td><div id="submit-share-d">' + window.iniForm[window.lang][7] + '</div></td></tr></table>');
	window.loading.dialog('open');
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
					window.loading.dialog('close');
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
							jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][15]);
							window.designV.dialog('open');
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
									jQuery('#design-valid-p').html('<span style="font-weight: bold;">Info:</span><br /><br />' + window.iniForm[window.lang][16]);
									window.designV.dialog('open');
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

function unShareDeployment() {
	jQuery('.ini-opt-class').remove();
	jQuery('.ini-opt-class-2').remove();
	jQuery('#man-deployment').append('<table class="ini-opt-class"><tr><td>' + window.unshare[window.lang][0] + '</td><td><select multiple id="ini-share-d"></select></td></tr>\
	<tr><td>' + window.unshare[window.lang][1] + '</td><td><select multiple id="ini-share2-d"></select></td></tr>\
	<tr><td /><td><div id="submit-unshare-d">' + window.iniForm[window.lang][7] + '</div></td></tr></table>');
	window.loading.dialog('open');
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
					window.loading.dialog('close');
					if(data.length != 0) {
						var users = JSON.parse(data.substring(0, data.length-1) + ']');
						var select = '';
						for(i = 0; i < users.length; ++i) {
							select += '<option value="' + i + '">' + users[i][1] + '</option>';
						}
						jQuery('#ini-share2-d').html(select);
					}
					jQuery('#submit-unshare-d').click(function() {
						if(jQuery('#ini-share-d').val() == null || jQuery('#ini-share2-d').val() == null) {
							jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][15]);
							window.designV.dialog('open');
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
								data: {'action': 'unshare_deployments', 'deployments': depl, 'users': usr},
								success: function(data) {
									jQuery('#design-valid-p').html('<span style="font-weight: bold;">Info:</span><br /><br />' + window.unshare[window.lang][2]);
									window.designV.dialog('open');
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

function deleteDeployment() {
	jQuery('.ini-opt-class').remove();
	jQuery('.ini-opt-class-2').remove();
	jQuery('#man-deployment').append('<table class="ini-opt-class"><tr><td>' + window.deply[window.lang][3] + '</td><td><select multiple id="ini-del-d"></select></td></tr>\
	<tr><td /><td><div id="submit-del-d">' + window.iniForm[window.lang][7] + '</div></td></tr></table>');
	window.loading.dialog('open');
	jQuery.ajax({
		type: 'post',
		url: 'ajax/data.php',
		data: {'action': 'search_deployments_share'},
		success: function(data) {
			window.loading.dialog('close');	
			jQuery('#submit-del-d').click(function() {
				if(jQuery('#ini-del-d').val() == null) {
					jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.deply[window.lang][4]);
					window.designV.dialog('open');
				} else {
					var depl = [];
					for(var i = 0; i < jQuery('#ini-del-d').val().length; ++i) {
						depl.push(deploym[jQuery('#ini-del-d').val()[i]][0]);
					}
					jQuery.ajax({
						type: 'post',
						url: 'ajax/data.php',
						data: {'action': 'delete_deployments', 'deployments': depl},
						success: function(data) {
							jQuery('#design-valid-p').html('<span style="font-weight: bold;">Info:</span><br /><br />' + window.deply[window.lang][5]);
							window.designV.dialog('open');
							window.loading.dialog('open');
							jQuery.ajax({
								type: 'post',
								url: 'ajax/data.php',
								data: {'action': 'search_deployments_share'},
								success: function(data) {
									window.loading.dialog('close');
									if(data.length != 0) {
										var deploym = JSON.parse(data.substring(0, data.length-1) + ']');
										var select = '';
										for(i = 0; i < deploym.length; ++i) {
											select += '<option value="' + i + '">' + deploym[i][1] + '</option>';
										}
										jQuery('#ini-del-d').html(select);
									} else { jQuery('#ini-del-d').html(''); }
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
				jQuery('#ini-del-d').html(select);
			}
		}
	});
}

function modifyDeployment() {
	jQuery('.ini-opt-class').remove();
	jQuery('.ini-opt-class-2').remove();
	jQuery('#man-deployment').append('<table class="ini-opt-class-2"><tr><td>' + window.deply[window.lang][6] + '</td><td><select id="ini-mod-d"></select></td></tr></table>');
	window.loading.dialog('open');
	jQuery.ajax({
		type: 'post',
		url: 'ajax/data.php',
		data: {'action': 'search_deployments_share'},
		success: function(data) {
			window.loading.dialog('close');
			jQuery('#ini-mod-d').change(function() {
				jQuery('.ini-opt-class').remove();
				if(jQuery(this).val() != '-1') {
					window.loading.dialog('open');
					jQuery.ajax({
						type: 'post',
						url: 'ajax/data.php',
						data: {'action': 'search_info_depl', 'deployment': deploym[jQuery(this).val()][0]},
						success: function(data) {
							//window.loading.dialog('close');
							var datos = JSON.parse(data);
							createDeployment(false, datos);
							window.loading.dialog('close');
							jQuery('#submit-mod-d').click(function() {
								if(jQuery('#ini-opt-name').prop('value') == '' || jQuery('#ini-opt-budget').prop('value') == '') {
									jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][8]);
									window.designV.dialog('open');
								} else if(parseFloat(window.hw[parseInt(jQuery('#ini-opt-deftype option:selected').prop('value')) + 1][10]) > jQuery('#ini-opt-budget').prop('value')) {
									jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][9]);
									window.designV.dialog('open');
								} else if(parseFloat(jQuery('#ini-opt-budget').prop('value')) < parseFloat(datos[4])) {
									jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][17]);
									window.designV.dialog('open');
								} else {
									jQuery.ajax({
										type: 'post',
										url: 'ajax/data.php',
										data: {'action': 'name_exists_2', 'name': jQuery('#ini-opt-name').prop('value'), 'notthis': deploym[jQuery('#ini-mod-d').prop('value')][0]},
										success: function(data) {
											if(data == '0') {
												jQuery.ajax({
													type: 'post',
													url: 'ajax/data.php',
													data: {'action': 'update_depl', 'name': jQuery('#ini-opt-name').prop('value'), 'budget': jQuery('#ini-opt-budget').prop('value'), 'remain': (jQuery('#ini-opt-budget').prop('value')-datos[4]), 'type': jQuery('#ini-opt-deftype option:selected').prop('value'), 'budtype': jQuery('#ini-opt-budtype option:selected').text(), 'id': deploym[jQuery('#ini-mod-d').prop('value')][0]},
													success: function(data) {
														jQuery('#design-valid-p').html('<span style="font-weight: bold;">Info:</span><br /><br />' + window.iniForm[window.lang][18]);
														window.designV.dialog('open');
														modifyDeployment();
													}
												});
											} else {
												jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][10]);
												window.designV.dialog('open');
											}
										}
									});
								}
							});
						}
					});
				}
			});
			if(data.length != 0) {
				var deploym = JSON.parse(data.substring(0, data.length-1) + ']');
				var select = '<option value="-1">------------------------------------</option>';
				for(i = 0; i < deploym.length; ++i) {
					select += '<option value="' + i + '">' + deploym[i][1] + '</option>';
				}
				jQuery('#ini-mod-d').html(select);
			}
		}
	});
}

function createDeployment(n, array) {
	if(typeof(n) === 'undefined') n = true;
	if(typeof(array) === 'undefined') array = [];
	if(n) {
		jQuery('#load-deployment').html('');
		jQuery('#man-deployment').html('');
		jQuery('#new-deployment').html('');
		var where = jQuery('#new-deployment');
		var conti = '<tr><td /><td><div id="submit-new-d">' + window.iniForm[window.lang][7] + '</div></td></tr>';
	} else {
		var where = jQuery('#man-deployment');
		var conti = '<tr><td /><td><div id="submit-mod-d">' + window.iniForm[window.lang][7] + '</div></td></tr>';
	}
	jQuery(where).append('<table class="ini-opt-class"><tr><td>' + window.iniForm[window.lang][4] + '</td><td><input type="text" id="ini-opt-name" value="' + (array.length > 0 ? array[0] : '') + '" /></td></tr>\
	<tr><td>' + window.iniForm[window.lang][5] + '</td><td><select id="ini-opt-deftype"></select></td></tr>\
	<tr><td>' + window.iniForm[window.lang][6] + '</td><td><input type="text" id="ini-opt-budget" value="' + (array.length > 0 ? array[3] : '') + '" /><select id="ini-opt-budtype"><option value="GBP" ' + (array.length > 0 && array[2] == 'GBP' ? 'selected="selected"' : '') + '>GBP</option>\
	<option value="COP" ' + (array.length > 0 && array[2] == 'COP' ? 'selected="selected"' : '') + '>COP</option><option value="USD" ' + (array.length > 0 && array[2] == 'USD' ? 'selected="selected"' : '') + '>USD</option><option value="EUR" ' + (array.length > 0 && array[2] == 'EUR' ? 'selected="selected"' : '') + '>EUR</option></select></td></tr>' + conti + '</table>');
	window.loading.dialog('open');
	jQuery.ajax({
		url: 'ajax/data.php',
		type: 'post',
		data: {'action': 'hw_types'},
		success: function(data, status) {
			if(n) window.loading.dialog('close');
			window.hw = data.substr(0, data.length-2).split('||');
			for(var i = 0; i < window.hw.length; ++i) {
				window.hw[i] = window.hw[i].split(',');
			}
			window.hw.unshift([0, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']);
			window.hw.unshift([-1, window.hwLang[window.lang][0], window.hwLang[window.lang][1], window.hwLang[window.lang][2], window.hwLang[window.lang][3], window.hwLang[window.lang][4], window.hwLang[window.lang][5], window.hwLang[window.lang][6], window.hwLang[window.lang][7], window.hwLang[window.lang][8], window.hwLang[window.lang][9] + jQuery('#ini-opt-budtype option:selected').text() + ')']);
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
				chain += 'value="' + window.hw[i][0] + '" ' + (array.length > 0 && array[1] == window.hw[i][0] ? 'selected="selected"' : '') + '>';
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
			if(jQuery('#ini-opt-budtype option:selected').text() != window.defaultCurrency) {
				jQuery.ajax({
					type: 'post',
					url: 'ajax/data_no_bd.php',
					data: {'amount': window.scale, 'from': window.defaultCurrency, 'to': jQuery('#ini-opt-budtype option:selected').text(), 'action': 'curr_conv2'},
					success: function(data){
						for(i = 2; i < window.hw.length; ++i) {
							changeVals(String(parseFloat(window.hw[i][10])*parseFloat(data)/window.scale)+ ', ' + i);
						}
					}
				});
			}
			var prevbudtype = jQuery('#ini-opt-budtype option:selected').text();
			jQuery('#ini-opt-budtype').change(function() {
				window.loading.dialog('open');
				jQuery.ajax({
					type: 'post',
					url: 'ajax/data_no_bd.php',
					data: {'amount': window.scale, 'from': prevbudtype, 'to': jQuery('#ini-opt-budtype option:selected').text(), 'action': 'curr_conv2'},
					success: function(data){
						if(jQuery('#ini-opt-budget').val() != '') {
							jQuery('#ini-opt-budget').val((parseFloat(jQuery('#ini-opt-budget').val())*parseFloat(data)/window.scale).toFixed(2));
						}
						if(array.length > 0) {
							array[4] = (parseFloat(array[4])*parseFloat(data)/window.scale).toFixed(2);
						}
						for(i = 2; i < window.hw.length; ++i) {
							changeVals(String(parseFloat(window.hw[i][10])*parseFloat(data)/window.scale)+ ', ' + i);
						}
					}
				});
				prevbudtype = jQuery('#ini-opt-budtype option:selected').text();
			});
			jQuery('#submit-new-d').click(function() {
				window.defaultType = jQuery('#ini-opt-deftype option:selected').val();
				window.budget = parseFloat(jQuery('#ini-opt-budget').val());
				window.budgetT = parseFloat(jQuery('#ini-opt-budget').val());
				window.optName = jQuery('#ini-opt-name').val();
				window.budType = jQuery('#ini-opt-budtype option:selected').text();
				if(window.optName == '' || window.budget == '') {
					jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][8]);
					window.designV.dialog('open');	
				} else if(parseFloat(window.hw[parseInt(window.defaultType) + 1][10]) > window.budget) {
					jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][9]);
					window.designV.dialog('open');
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
									data: {'action': 'insert_name', 'name': window.optName, 'budget': window.budget, 'type': window.defaultType, 'budtype': window.budType, 'zoom': window.coordinates[2], 'centerlat': window.coordinates[0], 'centerlng': window.coordinates[1]},
									success: function(data) {
										if(data.substring(0, 1) == 'y') {
											window.idDeploy = data.substring(2);
											jQuery('#language').css('zIndex', 99);
											jQuery('#user-info').css('zIndex', 99);
											window.optionsIni.dialog('close');
											jQuery('#node-searcher').css('zIndex', 99);
											jQuery('#budget-d').css('zIndex', 99);
											jQuery('#menu').css('zIndex', 99);
											jQuery('.dep-name').text(window.optName);
											jQuery('#node-searcher').css({'display': 'block'});
											jQuery('#budget-d').css({'display': 'block'});
											window.loading.dialog('open');
											jQuery.ajax({
												type: 'post',
												url: 'ajax/data.php',
												data: {'action': 'load_sensors'},
												success: function(data) {
													console.log('sensores: ' + data);
													window.loading.dialog('close');
													var sensors = JSON.parse(data.substring(0, data.length-1) + ']');
													jQuery.each(sensors, function(index, value) {
														window.sensors['en'].push(value[0]);
														window.sensors['es'].push(value[1]);
													});
													createBudgetDisplay();
													updateLastDate();
												}
											});
										}
									}
								});
							} else {
								jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.iniForm[window.lang][10]);
								window.designV.dialog('open');
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
}

function loadDeployment() {
	jQuery('#new-deployment').html('');
	jQuery('#man-deployment').html('');
	jQuery('#load-deployment').html('<table class="ini-opt-class"><tr><td>' + window.iniForm[window.lang][11] + '</td><td><select id="ini-load-d"></select></td></tr>\
	<tr><td /><td><div style="display: none;" id="submit-load-d">' + window.iniForm[window.lang][7] + '</div></td></tr></table>');
	window.loading.dialog('open');
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
			window.hw.unshift([-1, window.hwLang[window.lang][0], window.hwLang[window.lang][1], window.hwLang[window.lang][2], window.hwLang[window.lang][3], window.hwLang[window.lang][4], window.hwLang[window.lang][5], window.hwLang[window.lang][6], window.hwLang[window.lang][7], window.hwLang[window.lang][8], window.hwLang[window.lang][9] + jQuery('#ini-opt-budtype option:selected').text() + ')']);
			jQuery.ajax({
				type: 'post',
				url: 'ajax/data.php',
				data: {'action': 'search_deployments'},
				success: function(data) {
					window.loading.dialog('close');
					if(data.length != 0) {
						var loaded = JSON.parse(data.substring(0, data.length-1) + ']');
						var select = '<option value="-1">------------------------------------</option>';
						for(i = 0; i < loaded.length; ++i) {
							console.log(loaded[i][11]);
							select += '<option value="' + i + (loaded[i][11] != '-' ? '" disabled="disabled"' : '"') + '>' + loaded[i][1] + (loaded[i][11] != '-' ? ' (locked by ' + loaded[i][11] + ')' : '') + '</option>';
						}
						jQuery('#ini-load-d').html(select);
						jQuery('#ini-load-d').change(function() {
							if(jQuery(this).val() == '-1') jQuery('#submit-load-d').hide();
							else jQuery('#submit-load-d').show();
						});
						jQuery('#submit-load-d').click(function() {
							if(jQuery('#ini-load-d option:selected').val() == '-1') {
								alert('asd');
							} else {
								window.idDeploy = loaded[jQuery('#ini-load-d option:selected').val()][0];
								window.defaultType = loaded[jQuery('#ini-load-d option:selected').val()][2];
								window.budgetT = loaded[jQuery('#ini-load-d option:selected').val()][3];
								window.budget = loaded[jQuery('#ini-load-d option:selected').val()][4];
								window.optName = loaded[jQuery('#ini-load-d option:selected').val()][1];
								window.budType = loaded[jQuery('#ini-load-d option:selected').val()][5];
								window.centerMap = new google.maps.LatLng(loaded[jQuery('#ini-load-d option:selected').val()][8], loaded[jQuery('#ini-load-d option:selected').val()][9]);
								eval('map.setMapTypeId(google.maps.MapTypeId.' + loaded[jQuery('#ini-load-d option:selected').val()][10].toUpperCase() + ')');
								map.setCenter(window.centerMap);
								map.setZoom(loaded[jQuery('#ini-load-d option:selected').val()][7]);
								window.loaded1 = false;
								window.loaded2 = false;
								window.loaded3 = false;
								window.loaded4 = false;
								window.loaded5 = false;
								window.loading.dialog('open');
								window.hw[0][10] = window.hwLang[window.lang][9] + window.budType + ')';
								jQuery.ajax({
									type: 'post',
									url: 'ajax/data_no_bd.php',
									data: {'amount': window.scale, 'from': window.defaultCurrency, 'to': window.budType, 'action': 'curr_conv2'},
									success: function(data){
										for(i = 2; i < window.hw.length; ++i) {
											changeVals(String(parseFloat(window.hw[i][10])*parseFloat(data)/window.scale)+ ', ' + i);
										}
									}
								});
								jQuery.ajax({
									type: 'post',
									url: 'ajax/data.php',
									data: {'action': 'load_nodes', 'deploy': window.idDeploy},
									success: function(data) {
										window.loaded2 = true;
										checkLoaded();
										var nodes = JSON.parse(data.substring(0, data.length-1) + ']');
										for(var i = 0; i < nodes.length; ++i) {
											createMarker(new google.maps.LatLng(nodes[i][0], nodes[i][1]), false, nodes[i][3], false, nodes[i][4], nodes[i][5], nodes[i][2]);
										}
										createLines();
									}
								});
								jQuery.ajax({
									type: 'post',
									url: 'ajax/data.php',
									data: {'action': 'load_obstacles', 'deploy': window.idDeploy},
									success: function(data) {
										window.loaded3 = true;
										checkLoaded();
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
												jQuery('#selectObstacles').append('<option value="' + parseInt(parseInt(jQuery('#selectObstacles option:last').prop('value')) + 1) + '">' + window.obsName[window.lang] + parseInt(parseInt(jQuery('#selectObstacles option:last').prop('value')) + 2) + '</option>');
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
								jQuery.ajax({
									type: 'post',
									url: 'ajax/data.php',
									data: {'action': 'load_sensors'},
									success: function(data) {
										console.log('sensores: ' + data);
										window.loaded4 = true;
										checkLoaded();
										var sensors = JSON.parse(data.substring(0, data.length-1) + ']');
										jQuery.each(sensors, function(index, value) {
											window.sensors['en'].push(value[0]);
											window.sensors['es'].push(value[1]);
										});
									}
								});
								jQuery.ajax({
									type: 'post',
									url: 'ajax/data.php',
									data: {'action': 'load_streams', 'deploy': window.idDeploy},
									success: function(data) {
										var streams = JSON.parse(data.substring(0, data.length-1) + ']');
										jQuery.each(streams, function(index, value) {
											window.streams[value[0]] = value[1] == "x" ? [] : value[1].split('-');
										});
										window.loaded5 = true;
										checkLoaded();
									}
								});
								window.optionsIni.dialog('close');
								jQuery('.dep-name').text(window.optName);
								jQuery('#node-searcher').css({'display': 'block'});
								jQuery('#budget-d').css({'display': 'block'});
								jQuery('#language').css('zIndex', 99);
								jQuery('#user-info').css('zIndex', 99);
								jQuery('#node-searcher').css('zIndex', 99);
								jQuery('#budget-d').css('zIndex', 99);
								jQuery('#menu').css('zIndex', 99);
								window.currentOption = loaded[jQuery('#ini-load-d option:selected').val()][6];
								buttons(window.options[window.currentOption]);
								clickable();
							}
						});
					} else {
						jQuery('.ini-opt-class').html('<tr><td>' + window.iniForm[window.lang][12] + '</td></tr>');
					}
				}
			});
		},	error: function(xhr, desc, err) {
			console.log(xhr);
			console.log("Details: " + desc + "\nError:" + err);
		}
	});
}

function initialForm() {
	jQuery('#options-dialog').html('<p class="ini-opt-class-tit">' + window.iniForm[window.lang][0] + '</p><hr />\
	<p class="ini-opt-class-sub"><input type="radio" ' + (!window.mapLoaded ? 'disabled="true"' : '') + ' name="ini-option" value="1" />' + window.iniForm[window.lang][1] + '</p>\
	<div id="new-deployment" />\
	<p class="ini-opt-class-sub"><input type="radio" ' + (!window.mapLoaded ? 'disabled="true"' : '') + ' name="ini-option" value="2" />' + window.iniForm[window.lang][2] + '</p>\
	<div id="load-deployment" />\
	<p class="ini-opt-class-sub"><input type="radio" ' + (!window.mapLoaded ? 'disabled="true"' : '') + ' name="ini-option" value="3" />' + window.iniForm[window.lang][3] + '</p>\
	<div id="man-deployment" />');
	window.optionsIni.dialog('open');
	jQuery('input:radio[name=ini-option]').change(function() {
		if(parseInt(jQuery('input:radio[name=ini-option]:checked').val()) == 1) {
			createDeployment();
		} else if(parseInt(jQuery('input:radio[name=ini-option]:checked').val()) == 2) {
			loadDeployment();
		} else {
			jQuery('#new-deployment').html('');
			jQuery('#load-deployment').html('');
			jQuery('#man-deployment').html('<table id="options-depl"><tr><td><input type="radio" value="1" name="manage-deploy" checked="checked" />' + window.deply[window.lang][0] + '</td><td><input type="radio" value="2" name="manage-deploy" />' + window.deply[window.lang][7] + '</td><td><input type="radio" value="3" name="manage-deploy" />' + window.deply[window.lang][1] + '</td><td><input type="radio" value="4" name="manage-deploy" />' + window.deply[window.lang][2] + '</td></tr></table>');
			shareDeployment();
			jQuery('input[type=radio][name="manage-deploy"]').change(function() {
				if(jQuery(this).val() == '1') {
					shareDeployment();
				} else if(jQuery(this).val() == '2') {
					unShareDeployment();
				} else if(jQuery(this).val() == '3') {
					modifyDeployment();
				} else if(jQuery(this).val() == '4') {
					deleteDeployment();
				}
			});
		}
	});
}

function saveState() {
	jQuery('#saveState').click(function() {
		window.loading.dialog('open');
		var markersLat = '';
		var markersLng = '';
		var markersType = '';
		var markersGate = '';
		var blockMarkersLat = '';
		var blockMarkersLng = '';
		var streams = '';
		var nodesStreams = '';
		jQuery.each(Object.keys(window.streams), function(index, value) {
			if(window.streams[value].length == 0) {
				streams += value + '-,';
			}
			jQuery.each(window.streams[value], function(index2, value2) {
				streams += value + '-' + value2 + ',';
			});
		});
		jQuery.each(Object.keys(window.nodesStreams), function(index, value) {
			jQuery.each(window.nodesStreams[value], function(index2, value2) {
				nodesStreams += value + '-' + value2 + ',';
			});
		});
		for(var i = 0; i < window.markers.length; ++i) {
			markersLat += window.markers[i].position.lat() + ',';
			markersLng += window.markers[i].position.lng() + ',';
			markersType += window.markers[i].get('type') + ',';
			markersGate += window.markers[i].get('gateway') + ',';
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
			data: {'action': 'insert_all', 'lat': markersLat, 'lng': markersLng, 'id-deploy': window.idDeploy, 'type': markersType, 'gate': markersGate,
				'zoom': map.getZoom(), 'maptype': map.getMapTypeId(), 'center': map.getCenter().lat() + ',' + map.getCenter().lng(), 'step': window.currentOption,
				'block-lat': blockMarkersLat, 'block-lng': blockMarkersLng, 'budremain': window.budget, 'streams': streams, 'nodes_streams': nodesStreams},
			success: function(data) {
				jQuery('#state-text').text(window.confirmStates[window.lang][0]);
				window.loading.dialog('close');
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
			jQuery('#' + window.options[i]).removeClass('nextpr Previous Next');
			jQuery('#' + window.options[i]).addClass('nextpr Previous');
		} else if(window.currentOption == (i-1)) {
			jQuery('#' + window.options[i]).css({'background-color': '#7A995C', 'cursor': 'pointer'});
			jQuery('#' + window.options[i]).removeClass('nextpr Previous Next');
			jQuery('#' + window.options[i]).addClass('nextpr Next');
		} else if(window.currentOption == i) {
			jQuery('#' + window.options[i]).css({'background': '#29331F', 'cursor': 'default'});
			jQuery('#' + window.options[i]).removeClass('nextpr Previous Next');
			jQuery('#' + window.options[i]).on()
		} else {
			jQuery('#' + window.options[i]).css({'background-color': '#D3DEC8', 'cursor': 'default'});
			jQuery('#' + window.options[i]).removeClass('nextpr Previous Next');
		}
	}
	jQuery('.nextpr').on('click.nextprev', function() { nextPrev(this); });
}

function languageSel() {
	jQuery('#title').html(window.title[window.lang]);
	document.title = window.tabName[window.lang];
	jQuery('.nextprev.Previous').text(window.arrows[window.lang][0]);
	jQuery('.nextprev.Next').text(window.arrows[window.lang][1]);
	jQuery('#saveState').text(window.states[window.lang][0]);
	jQuery('#loadState').text(window.states[window.lang][1]);
	jQuery('#hello').text(window.hello[window.lang]);
	jQuery('#logout').text(window.logout[window.lang]);
	jQuery('#place-div').prop('placeholder', window.placeDiv[window.lang]);
	for(i = 0; i < window.options.length; ++i) {
		jQuery('#' + window.options[i]).html('<span class="buttons-t">' + window.optionNames[window.lang][i] + '</span>');
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

function deleteMarker(i) {
	window.budget = window.budget + parseFloat(window.hw[parseInt(window.markers[i-1].get('type')) + 1][10]) > window.budgetT ? window.budgetT : window.budget + parseFloat(window.hw[parseInt(window.markers[i-1].get('type')) + 1][10]);
	jQuery('#bud-amnt').text(window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	jQuery('#budget-d1-value').text(window.budType + ' ' + window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	jQuery('#budget-d2-value').text(window.budType + ' ' + (window.budgetT-window.budget).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	window.markers[i-1].setMap(null);
	window.circles[i-1].setMap(null);
	window.dispImg[i-1].close();
	window.disX[i-1].close();
	for(var j = i; j < window.markers.length; ++j) {
		window.markers[j].id--;
		window.circles[j].id--;
		var color = (window.markers[j].get('gateway') == '1') ? 'orange' : 'red';
		window.markers[j].setIcon('images/markers/' + color + '/marker' + window.circles[j].id + '.png');
		window.nodesStreams[j] = window.nodesStreams[j+1];
	}
	delete window.nodesStreams[Object.keys(window.nodesStreams)[Object.keys(window.nodesStreams).length-1]];
	window.counter--;
	window.markers.splice(i-1, 1);
	window.circles.splice(i-1, 1);
	window.dispImg.splice(i-1, 1);
	window.disX.splice(i-1, 1);
	window.imgs.splice(i-1, 1);
	window.x.splice(i-1, 1);
	createLines();
	jQuery('#node-search-sel').find('option:not(:first)').remove();
	jQuery.each(window.markers, function(index, value) {
		jQuery('#node-search-sel').append('<option value="' + value.id + '">' + window.nodeFile[window.lang][3] + value.id + '</option>');
	});
}

function deleteBlockMarker(i) {
	var val1 = i.substr(0, i.indexOf(','));
	var val2 = i.substr(i.indexOf(',')+1);
	window.blockMarkers[val1][val2].setMap(null);
	for(var j = (Number(val2)+1); j < window.blockMarkers[val1].length; ++j) {
		window.blockMarkers[val1][j].id = (val1 + ',' + (j-1));
		window.blockMarkers[val1][j].setIcon('images/markers/blue/marker' + j + '.png');
	}
	window.blockMarkers[val1].splice(val2, 1);
	createBlocks();
}

function deleteBlock() {
	var i = jQuery('#del-block-p2').text();
	var val1 = i.substr(0, i.indexOf(','));
	for(var j = window.blockMarkers[val1].length-1; j >= 0 ; --j) {
		deleteBlockMarker(val1 + ',' + j);
	}
}

function staticOptions() {
	window.map.setOptions({
		scaleControl: true,
		streetViewControl: false,
		panControl: false,
		//zoomControl: false,
		keyboardShortcuts: false,
		disableDoubleClickZoom: true,
		scrolwheel: false,
		draggableCursor: 'default'
	});
	jQuery('#place-div').css('display', 'none');
	jQuery('#clear-all').css('display', 'none');
}

function initializeVariables() {
	window.coordinates = [48.85837, 2.294481, 19];
	window.change = [];
	window.markers = [];
	window.blockMarkers = [[]];
	window.lines = [];
	window.circles = [];
	window.circlesRNG = [];
	window.linesRng = [];
	window.nodesConRng = {};
	window.counter = 1;
	window.scale = 100000;
	window.defaultCurrency = 'GBP';
	window.lang = 'en';
	window.xmlQu = '';
	window.fullScreenState = false;
	window.mapLoaded = false;
	window.curDep = {'en': 'Current Deployment', 'es': 'Despliegue Actual'};
	window.nodesSearch = {'en': 'Search Node:', 'es': 'Buscar Nodo:'};
	if(window.location.href.indexOf('?lang=') > -1) {
		window.lang = window.location.href.substr(window.location.href.indexOf('?lang=') + 6, window.location.href.indexOf('?lang=') + 8);
	}
	window.unshare = {'en': ['Select the deployments to retake', 'Select the users to retake them from', 'Deployments retaken successfully'],
		'es': ['Seleccione los despliegues para retomar', 'Seleccione los usuarios de quienes quiere retomarlos', 'Los despliegues han sido retomados exitosamente']};
	window.streamsLang = {'en': ['Manage Streams', 'New', 'Delete', 'The name of the stream cannot be empty', 'There cannot be two streams with the same name'],
		'es': ['Administrar Streams', 'Nuevo', 'Borrar', 'El nombre del stream no puede estar vac\u00EDo', 'No puede haber dos streams con el mismo nombre']};
	window.hwLang = {'en': ['Name', 'Range (m)', 'Rate (Kbps)', 'Voltage', 'Frequency', 'RAM (Kb)', 'Flash mem. (Kb)', 'Energy (J)', 'Rx (mA)', 'Cost ('],
		'es': ['Nombre', 'Rango (m)', 'Tasa (Kbps)', 'Voltaje', 'Frecuencia', 'RAM (Kb)', 'Mem. Flash (Kb)', 'Energ\u00EDa (J)', 'Rx (mA)', 'Costo (']}
	window.budgetRem = {'en': ['Budget Remaining:', 'Budget Used:', 'Total Budget:'],
		'es': ['Presupuesto Restante:', 'Presupuesto Usado:', 'Presupuesto Total:']};
	window.streams = {};
	window.nodesStreams = {};
	window.sensors = {'en': [], 'es': []};
	window.loaded1 = false;
	window.loaded2 = false;
	window.loaded3 = false;
	window.loaded4 = false;
	window.loaded5 = false;
	window.polygons = [];
	window.imgs = [];
	window.dispImg = [];
	window.x = [];
	window.disX	= [];
	window.subNets = [];
	window.dejaSub = [];
	window.closestSub = [];
	window.nodeFileCoords = [];
	window.designAlert = '';
	window.streamErrTxt = {'en': 'You must create at least one stream and each stream must have at least one attribute', 'es': 'Debe crear al menos un stream y cada stream debe tener al menos un atributo'};
	window.deply = {'en': ['Share', 'Modify', 'Delete', 'Select the deployments to delete', 'Please select at least one of the box', 'Deployments deleted succesfully', 'Select the deployment to modify', 'Unshare'],
		'es': ['Compartir', 'Modificar', 'Borrar', 'Seleccione los despliegues para borrar', 'Por favor elija al menos uno del cuadro', 'Los depliegues han sido borrados exitosamente', 'Seleccione el despliegue para modificar', 'Descompartir']};
	window.xmls = {'en': ['Query', 'Query Parameters', 'Logical Schema', 'Topology', 'Physical Schema', 'Nodes'],
		'es': ['Consulta', 'Par\u00E1metros de Consulta', 'Esquema L\u00F3gico', 'Topolog\u00EDa', 'Esquema F\u00EDsico', 'Nodos']};
	window.fullscreen = {'en': ['Full Screen', 'Exit Full Screen'], 'es': ['Pantalla Completa', 'Salir Pantalla Completa']};
	window.xmls2 = {'en': ['Delivery Time', 'Acquisition Interval', 'Max. Acquisition Interval', '(Write your query here)', 'Min value cannot be higher than max value', 'Please select a topology', 'Query is empty', 'The query you wrote is malformed'],
		'es': ['Tiempo de Entrega', 'Intervalo de Adquisici\u00F3n', 'Intervalo Adquisici\u00F3n Max.', '(Escriba su consulta aqu\u00ED)', 'El valor m\u00EDnimo no puede ser mayor que el valor m\u00E1ximo', 'Por favor elija una topolog\u00EDa', 'El Query est\u00E1 vac\u00EDo', 'El query que escribi\u00F3 est\u00E1 malformado']};
	window.nodeFile = {'en': ['Upload File', 'Only plain text files are supported', 'The following nodes will be created:', 'Node ', 'Confirm', 'Cancel'],
		'es': ['Subir Archivo', 'S\u00F3lo los archivos de texto planos son soportados', 'Los siguientes nodos ser\u00E1n creados:', 'Nodo ', 'Confirmar', 'Cancelar']};
	window.topoCon = {'en': ['Delaunay Triangulation', 'Relative Neighborhood Graph', 'Minimum Spanning Tree', 'Apply', 'None'],
		'es': ['Triangulaci\u00F3n Delaunay', 'Grafo de Vecino Relativo', '\u00E1rbol de Envergadura M\u00EDnima', 'Aplicar', 'Ninguna']};
	window.testCon = {'en': ['Connectivity', 'Bottleneck', 'Single point of failure', 'Validate', 'There are no gateways in the deployment',
		'Node ', 'Nodes ', ' is disconnected', ' are disconnected', ' has no path to a gateway', ' have no path to a gateway', 'All tests passed', 'Threshold'],
		'es': ['Conectividad', 'Cuellos de botella', 'Punto \u00FAnico de fallo', 'Validar', 'No hay gateways en el despliegue',
		'El nodo ', 'Los nodos ', ' est\u00E1 desconectado', ' est\u00E1n desconectados', ' no tiene una ruta hacia el gateway', ' no tienen una ruta hacia el gateway', 'Todas las pruebas pasaron', 'Umbral']};
	window.testBot = {'en': ['Node ', 'Nodes ', ' is a bottleneck', ' are bottlenecks'],
		'es': ['El nodo ', 'Los nodos ', ' es un cuello de botella', ' son cuellos de botella']};
	window.testSing = {'en': ['Node ', 'Nodes ', ' is a single point of failure', ' are single points of failure'],
		'es': ['El nodo ', 'Los nodos ', ' es un punto \u00FAnico de fallo', ' son puntos \u00FAnicos de fallo']};
	window.nodeMenu = {'en': ['Gateway Node', 'Pressure', 'Temperature', 'Light', 'Humidity', 'Magnetic Field', 'GPS'],
		'es': ['Nodo Gateway', 'Presi\u00F3n', 'Temperatura', 'Luz', 'Humedad', 'Campo Magn\u00E9tico', 'GPS']};
	window.placeDiv = {'en': 'Search Box', 'es': 'B\u00FAsqueda'}
	window.title = {'en': 'Wireless Sensor Network Deployment Design', 'es': 'Dise&ntilde;o de Despliegue de Redes Inal&aacute;mbricas de Sensores'};
	window.tabName = {'en': 'Wireless Sensor Network Deployment Design', 'es': 'Dise\u00F1o de Despliegue de Redes Inal\u00E1mbricas de Sensores'};
	window.arrows = {'en': ['< Previous', 'Next >'], 'es': ['< Anterior', 'Siguiente >']};
	window.states = {'en': ['Save State', 'Load State'], 'es': ['Guardar Estado', 'Cargar Estado']};
	window.options = ['Area', 'Obstacles', 'Streams', 'Nodes', 'Design', 'Topology', 'Snee'];
	window.obsName = {'en': 'Obstacle ', 'es': 'Obst\u00E1culo '};
	window.menuText = {'en': ['Delete Node', 'Delete Point', 'Delete Obstacle', 'Please confirm that you want to delete the obstacle', 'Please confirm that you want to delete everything in the deployment'], 'es': ['Borrar Nodo', 'Borrar Punto', 'Borrar Obst\u00E1culo', 'Por favor confirme que desea borrar el obst\u00E1culo', 'Por favor confirme que desea borrarlo todo en el despliegue']};
	window.newObs = {'en': 'New Obstacle', 'es': 'Nuevo Obst\u00E1culo'};
	window.clearText = {'en': 'Clear All', 'es': 'Borrar Todo'};
	window.hello = {'en': 'Hello ', 'es': 'Hola '};
	window.logout = {'en': 'Logout', 'es': 'Salir'};
	window.noMasNodos = {'en': 'There is no more budget for this node', 'es': 'No hay m\u00E1s presupuesto para este nodo'};
	window.iniForm = {'en': ['What would you like to do?', 'Create a new deployment', 'Load a pre-existing deployment', 'Manage deployments', 
		'Please select a name for the deployment', 'Please select a default node type', 'Please select available budget', 'Submit',
		'Please define all fields', 'Budget is too low', 'Name already exists', 'Select a deployment to load', 'No deployments to load',
		'Select the deployments to share', 'Select the users to share to', 'Please select at least one of each box', 'Deployments shared successfully', 'Actual cost of the deployment is higher than the budget', 'Deployment updated successfully'],
		'es': ['Qu&eacute; desea hacer?', 'Crear un nuevo despliegue', 'cargar un despliegue pre-existente',
		'Administrar despliegues', 'Seleccione un nombre para el despliegue', 'Seleccione un tipo de nodo por defecto',
		'Seleccione el presupuesto disponible', 'Enviar', 'Por favor defina todos los campos', 'El presupuesto es muy bajo', 'El nombre ya existe',
		'Seleccione el despliegue a cargar', 'No hay depliegues para cargar', 'Seleccione los despliegues para compartir', 'Seleccione los usuarios a qui\u00E9nes compartir',
		'Por favor elija al menos uno de cada cuadro', 'Los depliegues han sido compartidos exitosammente', 'El costo actual del despliegue es mayor al presupuesto actual', 'El depliegue ha sido actualizado exitosamente']};
	window.confirmStates = {'en': ['State Saved', 'State Loaded', 'No Previous Data'], 'es': ['Estado Guardado', 'Estado Cargado', 'No Hay Datos Previos']};
	window.optionNames = {'en': ['Select Area', 'Define Obstacles', 'Create Streams', 'Place Nodes', 'Validate Design', 'Apply Topology Control', 'SNEE'], 'es': ['Elegir \u00E1rea', 'Definir Obst\u00E1culos', 'Crear Streams', 'Ubicar Nodos', 'Validar Dise\u00F1o', 'Aplicar Topolog\u00EDa', 'SNEE']};
	window.optionDescriptions = {'en': ['This is the first step of the <span style="font-weight:bold;">"Wireless Sensor Network Deployment Design"</span> tool.<br /><br /> \
		Choose the Area you want to work in and once you\'re comfortable, click on <span style="font-weight:bold;">Next</span>.<br />You can also click on <span style="font-weight:bold;">"Clear All"</span> to delete all nodes and obstacles previously created.<br /><br />To open back this \
		Tooltip in case you close it, click on ',
		'This step allows you to define the obstacles in the area. Every click you make is a new edge to the current obstacle.<br /><br />You can define as many obstacles as you want through the <span style="font-weight:bold;">"obstacle selector"</span> option in the upper \
		right border of the map.<br /><br />To open back this Tooltip in case you close it, click on ', 'Once the obstacles are defined, this step allows you to create the Streams (logical containers of physical variables). You must create at least one to be able to continue<br /><br />To open back this Tooltip in case you close it, click on ',
		'This step allows you to place the nodes. By right-clicking on each node, you can access a menu which allows you to select the type of sensor for each node, the previously defined streams it will have and define if this node is a gateway; everything according to the available budget. \
		<br /><br />On the upper right corner of the map you can upload a file with a set of GPS coordinates to help you place nodes massively.<br /><br />To open back this Tooltip in case you close it, click on ',
		'Once the network is created, this tool helps you validate the design for connectivity issues, bottlenecks and single points of failure. You just have to click on the <span style="font-weight:bold;">Validate</span> button.<br /><br />Remember that the only validation that is mandatory to continue is the connectivity. \
		The other ones serve only as warnings.<br /><br />If you have a design issue, you can hover over the crossmarks or admiration signs located on the menu at the upper right corner of the map to remember which nodes are causing the problem.<br /><br />To open back this Tooltip in case you close it, click on ',
		'The <span style="font-weight:bold;">Apply Topology Control</span> step allows you to choose from four available algorithms to stablish the final topology of the deployment.<br /><br />Click on <span style="font-weight:bold;">Apply</span> to select the algorithm and preview the new topology on the map<br /><br />To open back this Tooltip in case you close it, click on ',
		'The <span style="font-weight:bold;">SNEE</span> step is the last step. Here you can visualize the XMLs created as a result of the previous steps, write your Snee query and, when ready, click on <span style="font-weight:bold;">GO TO SNEE</span>, which will let you download the result files.<br /><br />To open back this Tooltip in case you close it, click on '],
		'es': ['\u00E9ste es el primer paso de la herramienta de <span style="font-weight:bold;">"Dise\u00F1o de Despliegue de Redes Inal\u00E1mbricas de Sensores"</span> tool.<br /><br /> \
		Elija el \u00E1rea en el cual desea trabajar y una vez est\u00E9 c\u00F3modo, haga click en <span style="font-weight:bold;">Siguiente</span>.<br />Tambi\u00E9n puede hacer click en <span style="font-weight:bold;">"Borrar Todo"</span> para borrar todos los nodos y obst\u00E1culos previamente creados.<br /><br />Para abrir de nuevo \
		este Tooltip en caso de que lo cierre, haga click en ',
		'Este paso le permite definir los obst\u00E1culos en el \u00E1rea. Cada click que haga es un nuevo arista en el obst\u00E1culo actual.<br /><br />Puede definir tantos obst\u00E1culos como quiera a trav\u00E9s de la opci\u00F3n <span style="font-weight:bold;">"selector de obst\u00E1culos"</span> en la esquina \
		superior derecha del mapa.<br /><br />Para abrir este Tooltip en caso de que lo cierre, haga click en ', 'Una vez los obst\u00E1culos est\u00E1n definidos, este paso le permite crear los Streams (contenedores l\u00F3gicos de variables f\u00EDsicas). Debe crear al menos uno para poder continuar<br /><br />Para abrir de nuevo este Tooltip en caso de que lo cierre, haga click en ',
		'Este paso le permite ubicar los nodos. Al hacer click-derecho en cada nodo, usted puede acceder a un men\u00FA que le permite seleccionar el tipo de sensor para cada nodo, los streams previamente definidos que tendr\u00E1 y definir si es un gateway; todo de acuerdo al presupuesto disponible. \
		<br /><br />En la esquina superior derecha puede subir un archivo con un conjunto de coordenadas GPS para ayudarle a ubicar nodos masivamente.<br /><br />Para abrir este Tooltip en caso de que lo cierre, haga click en ',
		'Una vez la red est\u00E1 creada, esta herramiente le permite validar el dise\u00F1o por problemas de conectividad, cuellos de botella y puntos \u00FAnicos de fallo. Solamente tiene que hacer click en el bot\u00F3n <span style="font-weight:bold;">Validar</span>.<br /><br />Recuerde que la \u00FAnica validaci\u00F3n que es obligatoria para continuar es la conectividad. \
		Los otros s\u00F3lo sirven como advertencias.<br /><br />Si usted tiene un problema de dise\u00F1o, puede pasar el mouse sobre las X o los signos de admiraci\u00F3n ubicados en el men\u00FA en la esquina superior derecha del mapa para recordar cu\u00E1les nodos est\u00E1n causando el problema.<br /><br />Para abrir de nuevo este Tooltip en caso de que lo cierre, haga click en ',
		'El paso <span style="font-weight:bold;">Aplicar Topolog\u00EDa</span> le permite elegir uno de cuatro algoritmos disponibles para establecer la topolog\u00EDa final del despliegue.<br /><br />Haga click en <span style="font-weight:bold;">Aplicar</span> para elegir el algoritmo y tener una vista previa de la nueva topolog\u00EDa en el mapa<br /><br />Para abrir de nuevo este Tooltip en caso de que lo cierre, haga click en ',
		'El paso <span style="font-weight:bold;">SNEE</span> es el \u00FAltimo paso. Aqu\u00ED usted puede visualizar los XMLs creados como resultado de los pasos anteriores, escribir su consulta de Snee y, cuando est\u00E9 listo, hacer click en <span style="font-weight:bold;">IR A SNEE</span>, el cual le permitir\u00E1 descargar los archivos de resultados.<br /><br />Para abrir de nuevo este Tooltip en caso de que lo cierre, haga click en ']};
	window.streamsDel = {'en': ['There are nodes using the Stream that you\'re going to delete.<br /><br />\u00BFAre you sure that you want to continue?'], 'es': ['Hay nodos que est\u00E1n usando el Stream que va a borrar.<br /><br />\u00BFEst\u00E1 seguro que desea continuar?']};
	window.goToSnee_Name = {'en': 'GO TO SNEE', 'es': 'IR A SNEE'};
	window.currentOption = 0;
	window.dialog = jQuery('#confirm-state').dialog({
		autoOpen: false,
		height: 66,
		width: 200,
		resizable: false,
		closeOnEscape: false,
		modal: true
	});
	window.designV = jQuery('#design-valid').dialog({
		autoOpen: false,
		height: 150,
		width: 350,
		resizable: false,
		closeOnEscape: false,
		modal: true
	});
	var buttonsS = {};
	buttonsS[window.nodeFile[window.lang][4]] = function() {
		fileNodesConfirmed();
		jQuery(this).dialog('close');
	};
	buttonsS[window.nodeFile[window.lang][5]] = function() {
		jQuery(this).dialog('close');
	};
	var buttonsB = {};
	buttonsB[window.nodeFile[window.lang][4]] = function() {
		deleteBlock();
		jQuery(this).dialog('close');
	};
	buttonsB[window.nodeFile[window.lang][5]] = function() {
		jQuery(this).dialog('close');
	};
	var buttonsC = {};
	buttonsC[window.nodeFile[window.lang][4]] = function() {
		clearAllB();
		jQuery(this).dialog('close');
	};
	buttonsC[window.nodeFile[window.lang][5]] = function() {
		jQuery(this).dialog('close');
	};
	var buttonsStreams = {};
	buttonsStreams[window.nodeFile[window.lang][4]] = function() {
		deleteStream();
		jQuery(this).dialog('close');
	};
	buttonsStreams[window.nodeFile[window.lang][5]] = function() {
		jQuery(this).dialog('close');
	};
	window.streamsR = jQuery('#streams-deja').dialog({
		autoOpen: false,
		height: 190,
		width: 360,
		modal: true,
		closeOnEscape: false,
		resizable: false,
		buttons: buttonsStreams
	});
	window.nodesF = jQuery('#nodes-file').dialog({
		autoOpen: false,
		height: 300,
		width: 320,
		modal: true,
		closeOnEscape: false,
		resizable: false,
		buttons: buttonsS
	});
	window.delB = jQuery('#del-block').dialog({
		autoOpen: false,
		height: 160,
		width: 240,
		modal: true,
		resizable: false,
		closeOnEscape: false,
		buttons: buttonsB
	});
	window.delT = jQuery('#clear-all-div').dialog({
		autoOpen: false,
		height: 160,
		width: 300,
		modal: true,
		resizable: false,
		closeOnEscape: false,
		buttons: buttonsC
	});
	window.manS = jQuery('#manage-str-div').dialog({
		autoOpen: false,
		height: 300,
		width: 394,
		resizable: false,
		closeOnEscape: false,
		modal: true
	});
	window.optionsIni = jQuery('#options-dialog').dialog({
		autoOpen: false,
		height: 629,
		position: {my: 'top left', at: 'top left', of: jQuery('#container')},
		width: 846,
		resizable: false,
		closeOnEscape: false,
		modal: true
	});
	window.optionsSnee = jQuery('#snee-dialog').dialog({
		autoOpen: false,
		height: 629,
		position: {my: 'top left', at: 'top left', of: jQuery('#container')},
		width: 846,
		resizable: false,
		closeOnEscape: false,
		modal: true
	});
	jQuery('.state-close').click(function() {
		window.dialog.dialog('close');
	});
	jQuery('.design-close').click(function() {
		window.designV.dialog('close');
	});
	jQuery('.file-close').click(function() {
		window.nodesF.dialog('close');
	});
	jQuery('.streams-deja-x').click(function() {
		window.streamsR.dialog('close');
	});
	jQuery('.del-block-close').click(function() {
		window.delB.dialog('close');
	});
	jQuery('.clear-all-close').click(function() {
		window.delT.dialog('close');
	});
	jQuery('.snee-close').click(function() {
		if(jQuery('.xml_divs_sel:first').prop('id') == 'xml_0') window.xmlQu = jQuery('#xml_area').val();
		jQuery('#iamp').click();
		window.optionsSnee.dialog('close');
	});
	jQuery(window).resize(function() {
		window.optionsIni.dialog({
			position: {my: 'top left', at: 'top left', of: jQuery('#container')}
		});
		window.optionsSnee.dialog({
			position: {my: 'top left', at: 'top left', of: jQuery('#container')}
		});
	});
	window.loading = jQuery('#loading-dialog').dialog({
		autoOpen: false,
		height: 100,
		width: 100,
		modal: true,
		resizable: false,
		closeOnEscape: false,
		dialogClass: 'loading-dia'
	});
	window.dialog.css('zIndex', '200');
	window.streamsR.css('zIndex', '200');
	window.nodesF.css('zIndex', '200');
	window.delB.css('zIndex', '200');
	window.delT.css('zIndex', '200');
	window.manS.css('zIndex', '200');
	window.optionsIni.css('zIndex', '200');
	window.optionsSnee.css('zIndex', '200');
	window.loading.css('zIndex', '200');
	window.designV.css('zIndex', '200');
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
	jQuery(selectList).css({'margin': '5px', 'width': '120px', 'padding': '0px', 'font-size': '11px', 'height': '20px', 'font-weight': '500', 'font-family': 'Roboto,Arial,sans-serif'});
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
	jQuery(createObs).prop('disabled', 'disabled');
	div.appendChild(createObs);
	jQuery(createObs).css({'margin': '5px', 'width': '120px', 'padding': '0px', 'font-size': '11px', 'height': '20px', 'font-weight': '500', 'font-family': 'Roboto,Arial,sans-serif'});
	jQuery(createObs).css({'background-clip': 'padding-box', 'cursor': 'default', 'color': '#c6c6c6', 'background-color': '#dfdfdf', 'display': 'inline-block'});
	jQuery(createObs).on('click', function() {
		jQuery('#selectObstacles').append('<option value="' + parseInt(parseInt(jQuery('#selectObstacles option:last').prop('value')) + 1) + '">' + window.obsName[window.lang] + parseInt(parseInt(jQuery('#selectObstacles option:last').prop('value')) + 2) + '</option>');
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
	jQuery.each(Object.keys(window.streams), function(index, value) {
		jQuery(boxSensors).append('<input type="checkbox" name="sens" value="' + (index+1) + '" ' + (jQuery(window.imgs[marker.id-1]).html().indexOf(index+1) >= 0 ? 'checked' : '') + ' /> ' + value + '<br />');
	});
	if(Object.keys(window.streams).length == 0) {
		jQuery(boxSensors).hide();
	} else {
		jQuery(boxSensors).show();
	}
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
	var markTab = document.createElement('table');
	for(var i = 2; i < window.hw.length; ++i) {
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		var input = document.createElement('input');
		input.type = 'radio';
		input.name = 'rad' + id;
		input.value = (i-1);
		if(jQuery(input).val() == marker.get('type')) jQuery(input).prop('checked', true);
		var text = document.createTextNode(window.hw[i][1]);
		jQuery(td).append(input);
		jQuery(td).append(text);
		var td2 = document.createElement('td');
		var span = document.createElement('span');
		jQuery(span).addClass('hw_quest hw_quest_' + i);
		var text3 = window.hw[0][1] + ': ' + window.hw[i][1] + '|';
		text3 += window.hw[0][2] + ': ' + window.hw[i][2] + '|';
		text3 += window.hw[0][3] + ': ' + window.hw[i][3] + '|';
		text3 += window.hw[0][4] + ': ' + window.hw[i][4] + '|';
		text3 += window.hw[0][5] + ': ' + window.hw[i][5] + '|';
		text3 += window.hw[0][6] + ': ' + window.hw[i][6] + '|';
		text3 += window.hw[0][7] + ': ' + window.hw[i][7] + '|';
		text3 += window.hw[0][8] + ': ' + window.hw[i][8] + '|';
		text3 += window.hw[0][9] + ': ' + window.hw[i][9] + '|';
		text3 += window.hw[0][10] + ': ' + window.hw[i][10];
		span.title = text3;
		jQuery(span).tooltip({
			content: function() {
				return jQuery(this).prop('title').replace(/\|/g, '<br />');
			}
		});
		var text2 = document.createTextNode('[?]');
		jQuery(span).append(text2);
		jQuery(td2).append(span);
		jQuery(tr).append(td);
		jQuery(tr).append(td2);
		jQuery(markTab).append(tr);
	}
	jQuery(gateNode).html('<input type="checkbox" name="gate" value="1" /> ' + window.nodeMenu[window.lang][0]);
	jQuery(typeSel).append(markTab);
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
			width: '330px'
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
		deleteMarker(marker.id);
		ib.close();
	});
	jQuery(typeSel).change(function() {
		var newVal = parseFloat(window.hw[parseInt(jQuery('input:radio[name=rad' + id + ']:checked').val()) + 1][10]) - parseFloat(window.hw[parseInt(marker.get('type')) + 1][10]);
		if(newVal <= window.budget) {
			window.budget -= newVal;
			jQuery('#bud-amnt').text(window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			jQuery('#budget-d1-value').text(window.budType + ' ' + window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			jQuery('#budget-d2-value').text(window.budType + ' ' + (window.budgetT-window.budget).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			marker.set('type', parseInt(jQuery('input:radio[name=rad' + id + ']:checked').val()));
			window.circles[marker.id-1].setRadius(parseFloat(window.hw[parseInt(marker.get('type')) + 1][2]));
			createLines();
		} else {
			jQuery(typeSel).children().filter('[value="' + marker.get('type') + '"]').prop('checked', true);
			jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.noMasNodos[window.lang]);
			window.designV.dialog('open');
		}
	});
	jQuery(gateNode).change(function() {
		if(jQuery('input:checkbox[name=gate]:checked').val() == '1') {
			marker.setIcon('images/markers/orange/marker' + marker.id + '.png');
			marker.set('gateway', 1);
		} else {
			marker.setIcon('images/markers/red/marker' + marker.id + '.png');
			marker.set('gateway', 0);
		}
	});
	jQuery(boxSensors).change(function() {
		var searchIds = jQuery('input:checkbox[name=sens]:checked').map(function(){
			return $(this).val();
		}).get();
		var searchText = '';
		window.nodesStreams[marker.id] = [];
		for(var i = 0; i < searchIds.length; ++i) {
			window.nodesStreams[marker.id].push(parseInt(searchIds[i]));
			searchText += '<img src="images/sensors-img/' + searchIds[i] + '.png" /><br />';
		}
		jQuery(window.imgs[marker.id-1]).html(searchText);
	});
}

function callBlockMenu(block) {
	var boxText = document.createElement('div');
    jQuery(boxText).addClass('menu-mark-container');
	var delMark = document.createElement('div');
	var delObs = document.createElement('div');
	jQuery(delMark).add(delObs).addClass('menu-mark-block');
	jQuery(delMark).add(delObs).hover(function() {
			jQuery(this).css({'color': '#3f3f3f', 'background-color': '#dadada', 'border': '1px solid #3f3f3f', 'padding': '1px'});
		},
		function() {
			jQuery(this).css({'color': '#3c3c3c', 'background-color': '#c6c6c6', 'border': '0', 'padding': '2px'});
		});
	jQuery(delMark).html(window.menuText[window.lang][1]);
	jQuery(delObs).html(window.menuText[window.lang][2]);
	boxText.appendChild(delMark);
	boxText.appendChild(delObs);
	var options = {
		content: boxText,
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(15, -42),
		zIndex: null,
		boxStyle: {
			opacity: 0.9,
			width: '174px'
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
	});	jQuery(delObs).mouseup(function() {
		jQuery('#del-block-p').html('<span id="del-block-p2" style="display: none;">' + block.id + '</span>' + window.menuText[window.lang][3]);
		window.delB.dialog('open');
		ib.close();
	});
}

function createMarker(e, lines, r, decrease, gateway, sensors, type) {
	if(typeof(r) === 'undefined') r = parseFloat(window.hw[parseInt(window.defaultType) + 1][2]);
	if(typeof(decrease) === 'undefined') decrease = true;
	if(typeof(gateway) === 'undefined') gateway = 0;
	if(typeof(sensors) === 'undefined') sensors = '';
	if(typeof(type) === 'undefined') type = window.defaultType;
	var color = (gateway == 0) ? 'red' : 'orange';
	window.nodesStreams[window.counter] = [];
	if(!decrease || window.budget >= parseFloat(window.hw[parseInt(window.defaultType) + 1][10])) {
		if(decrease) window.budget -= parseFloat(window.hw[parseInt(window.defaultType) + 1][10]);
		jQuery('#bud-amnt').text(window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		jQuery('#budget-d1-value').text(window.budType + ' ' + window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		jQuery('#budget-d2-value').text(window.budType + ' ' + (window.budgetT-window.budget).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		var marker = new google.maps.Marker({
			position: e,
			map: map,
			id: window.counter,
			draggable:true,
			icon: 'images/markers/' + color + '/marker' + window.counter + '.png'
		});
		marker.set('type', type);
		marker.set('gateway', gateway);
		jQuery('#node-search-sel').append('<option value="' + marker.id + '">Node ' + marker.id + '</option>');
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
		var vimgs = document.createElement('div');
		if(sensors != '') {
			jQuery.each(sensors.split('-'), function(index, value) {
				window.nodesStreams[marker.id].push(parseInt(value));
				jQuery(vimgs).append('<img src="images/sensors-img/' + value + '.png" /><br />');
			});
		}
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
		var v_x = document.createElement('div');
		jQuery(v_x).html('');
		jQuery(vimgs).addClass('class-x');
		var optionsX = {
			content: v_x,
			disableAutoPan: false,
			maxWidth: 0,
			pixelOffset: new google.maps.Size(6, -32),
			zIndex: null,
			closeBoxURL: '',
			boxStyle: {
				opacity: 1,
				width: '30px'
			},
			infoBoxClearance: new google.maps.Size(1, 1),
			isHidden: false,
			pane: 'floatPane',
			enableEventPropagation: false
		};
		var disp_x = new InfoBox(optionsX);
		disp_x.open(map, marker);
		window.x.push(v_x);
		window.disX.push(disp_x);
	} else {
		jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.noMasNodos[window.lang]);
		window.designV.dialog('open');
	}
}

function createBlockMarker(e, valor, blocks) {
	var blockMarker = new google.maps.Marker({
		position: e,
		map: map,
		id: (valor + ',' + (window.blockMarkers[valor].length)),
		draggable: true,
		icon: 'images/markers/blue/marker' + (window.blockMarkers[valor].length + 1) +'.png'
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
	jQuery(budgetDisplayDiv).hide();
	jQuery(budgetDisplayDiv).html('<span id="bud-type">' + window.budgetRem[window.lang][0] + ' ' + window.budType + ' </span><span id="bud-amnt">' + window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span>');
	map.controls[google.maps.ControlPosition.TOP].push(budgetDisplayDiv);
	jQuery('#budget-d1-value').text(window.budType + ' ' + window.budget.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	jQuery('#budget-d3-value').text(window.budType + ' ' + window.budgetT.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	jQuery('#budget-d2-value').text(window.budType + ' ' + (window.budgetT-window.budget).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

function designValDiv() {
	var desValDiv = document.createElement('div');
	desValDiv.id = 'desValidation';
	jQuery(desValDiv).addClass('design-val');
	jQuery(desValDiv).html('<table id="dsgn-tbl"><tr><td height="38">' + window.testCon[window.lang][0] + '</td><td class="connec" height="38" /></tr><tr><td height="38">' + window.testCon[window.lang][1] + '<br />' + window.testCon[window.lang][12] + ': <input type="number" name="thresh" id="thresh" min="1" max="100" step="1" value="4"></td><td class="bottle" height="38" /></tr><tr><td height="38">' + window.testCon[window.lang][2] + '</td><td class="singlep" height="38" /></tr><tr><td colspan="2"><div id="submit-design">' + window.testCon[window.lang][3] + '</div></td></tr></table>');
	jQuery(desValDiv).keydown(function (e) {
		e.preventDefault();
	});
	map.controls[google.maps.ControlPosition.RIGHT].push(desValDiv);
	jQuery('.bottle').tooltip();
	jQuery('.connec').tooltip();
	jQuery('.singlep').tooltip();
	jQuery('#submit-design').on('click', function() {
		window.designAlert = '';
		var a = testConnectivity();
		var b = testBottleneck();
		var c = testSPF();
		if(a && b && c) {
			jQuery('#state-text').html(window.testCon[window.lang][11]);
			window.dialog.dialog('open');
		} else {
			jQuery('#design-valid-p').html(window.designAlert);
			window.designV.dialog('open');
		}
	});
}

function testSPF() {
	spofNodes = [];
	for(var j = 0; j < window.markers.length; ++j) {
		for(var i = 0; i < window.markers.length; ++i) {
			if(i != j && window.nodesWithNoPath.indexOf(i) == -1 && !hasPath(i, window.nodesCon, true, j)) {
				spofNodes.push(j);
				break;
			}
		}
	}
	if(spofNodes.length > 0) {
		var text1 = (spofNodes.length == 1) ? window.testSing[window.lang][0] : window.testSing[window.lang][1];
		var text2 = (spofNodes.length == 1) ? window.testSing[window.lang][2] : window.testSing[window.lang][3];
		for(var i = 0; i < spofNodes.length; ++i) {
			if(jQuery(window.x[spofNodes[i]]).html() == '') {
				jQuery(window.x[spofNodes[i]]).html('<img src="images/sensors-img/purple_alert.png" />');
			}
			text1 += (spofNodes[i]+1) + ', ';
		}
		text1 = text1.substr(0, text1.length-2) + text2;
		window.designAlert.length == 0 ? window.designAlert += text1 : window.designAlert += '<br />' + text1;
		jQuery('.singlep').html('<img height="16" width="16" src="images/sensors-img/purple_alert.png" title="' + text1 + '" />');
		return false;
	}
	jQuery('.singlep').html('<img src="images/sensors-img/green_check.png" />');
	return true;
}

function testBottleneck() {
	var bottleneckNodes = [];
	var threshold = jQuery('#thresh').val();
	for(var i = 0; i < window.markers.length; ++i) {
		if(window.nodesCon[i].length > threshold) {
			bottleneckNodes.push(i);
		}
	}
	if(bottleneckNodes.length > 0) {
		var text1 = (bottleneckNodes.length == 1) ? window.testBot[window.lang][0] : window.testBot[window.lang][1];
		var text2 = (bottleneckNodes.length == 1) ? window.testBot[window.lang][2] : window.testBot[window.lang][3];
		for(var i = 0; i < bottleneckNodes.length; ++i) {
			if(jQuery(window.x[bottleneckNodes[i]]).html() == '') {
				jQuery(window.x[bottleneckNodes[i]]).html('<img src="images/sensors-img/yellow_alert.png" />');
			}
			text1 += (bottleneckNodes[i]+1) + ', ';
		}
		text1 = text1.substr(0, text1.length-2) + text2;
		window.designAlert.length == 0 ? window.designAlert += text1 : window.designAlert += '<br />' + text1;
		jQuery('.bottle').html('<img height="16" width="16" src="images/sensors-img/yellow_alert.png" title="' + text1 + '" />');
		return false;
	}
	jQuery('.bottle').html('<img src="images/sensors-img/green_check.png" />');
	return true;
}

function hasPath(i, nodesCon, state, proh) {
	if(typeof(proh) === 'undefined') proh = -1;
	if(state) window.deja = [];
	if(window.markers[i].get('gateway') == 1) {
		return true;
	} else {
		if(proh == i) return false;
		window.deja.push(i);
		for(var j = 0; j < nodesCon[i].length; ++j) {
			if(window.deja.indexOf(nodesCon[i][j]) < 0 && hasPath(nodesCon[i][j], nodesCon, false, proh)) {
				return true;
			}
		}
		return false;
	}
}

function testConnectivity() {
	window.deja = [];
	var baseStationExists = false;
	badConnectivityNodes = [];
	window.nodesWithNoPath = [];
	window.nodesCon = {};
	for(var i = 0; i < window.markers.length; ++i) {
		nodesCon[i] = [];
		for(var j = 0; j < window.markers.length; ++j) {
			if(i != j) {
				if(computeDistance(new google.maps.LatLng(window.markers[i].getPosition().lat(), window.markers[i].getPosition().lng()),
					new google.maps.LatLng(window.markers[j].getPosition().lat(), window.markers[j].getPosition().lng()), i, j)) {
					nodesCon[i].push(j);
				}
			}
		}
		if(window.markers[i].get('gateway') == 1) {
			baseStationExists = true;
		} else if(nodesCon[i].length == 0) {
			badConnectivityNodes.push(i);
		}
	}
	if(!baseStationExists) {
		jQuery('.connec').html('<img height="16" width="16" src="images/sensors-img/purple_x.png" title="' + window.testCon[window.lang][4] + '" />');
		window.designAlert.length == 0 ? window.designAlert += window.testCon[window.lang][4] : window.designAlert += '<br />' + window.testCon[window.lang][4];
		return false;
	} else {
		jQuery('.connec').html('<img src="images/sensors-img/green_check.png" />');
		for(var i = 0; i < window.markers.length; ++i) {
			jQuery(window.x[i]).html('');
			if(!hasPath(i, nodesCon, true)) {
				nodesWithNoPath.push(i);
			}
		}
		if(badConnectivityNodes.length > 0) {
			text1 = (badConnectivityNodes.length == 1) ? window.testCon[window.lang][5] : window.testCon[window.lang][6];
			text2 = (badConnectivityNodes.length == 1) ? window.testCon[window.lang][7] : window.testCon[window.lang][8];
			var text = text1;
			for(var i = 0; i < badConnectivityNodes.length; ++i) {
				text += (badConnectivityNodes[i]+1) + ', ';
				jQuery(window.x[badConnectivityNodes[i]]).html('<img src="images/sensors-img/purple_x.png" />');
			}
			text = text.substr(0, text.length-2) + text2;
			jQuery('.connec').html('<img height="16" width="16" src="images/sensors-img/purple_x.png" title="' + text + '" />');
			window.designAlert.length == 0 ? window.designAlert += text : window.designAlert += '<br />' + text;
			return false;
		}
		if(nodesWithNoPath.length > 0) {
			text1 = (nodesWithNoPath.length == 1) ? window.testCon[window.lang][5] : window.testCon[window.lang][6];
			text2 = (nodesWithNoPath.length == 1) ? window.testCon[window.lang][9] : window.testCon[window.lang][10];
			var text = text1;
			for(var i = 0; i < nodesWithNoPath.length; ++i) {
				text += (nodesWithNoPath[i]+1) + ', ';
				jQuery(window.x[nodesWithNoPath[i]]).html('<img src="images/sensors-img/purple_x.png" />');
			}
			text = text.substr(0, text.length-2) + text2;
			jQuery('.connec').html('<img height="16" width="16" src="images/sensors-img/purple_x.png" title="' + text + '" />');
			window.designAlert.length == 0 ? window.designAlert += text : window.designAlert += '<br />' + text;
			return false;
		}
	}
	return true;
}

function delTemp() {
	for(var i = 0; i < window.circles.length; ++i) {
		window.circles[i].setMap(null);
	}
	for(var i = 0; i < window.lines.length; ++i) {
		window.lines[i].setMap(null);
	}
	for(var i = 0; i < window.circlesRNG.length; ++i) {
		window.circlesRNG[i].setMap(null);
	}
	for(var i = 0; i < window.linesRng.length; ++i) {
		window.linesRng[i].setMap(null);
	}
	window.circlesRNG = [];
	window.linesRng = [];
	window.nodesConRng = {};
	if(Object.keys(window.nodesCon).length == 0) testConnectivity();
}

function showTopo() {
	for(var i = 0; i < window.circles.length; ++i) {
		window.circles[i].setMap(map);
	}
	for(var i = 0; i < window.lines.length; ++i) {
		window.lines[i].setMap(map);
	}
	for(var i = 0; i < window.circlesRNG.length; ++i) {
		window.circlesRNG[i].setMap(null);
	}
	for(var i = 0; i < window.linesRng.length; ++i) {
		window.linesRng[i].setMap(null);
	}
	window.circlesRNG = [];
	window.linesRng = [];
	window.nodesConRng = {};
}

function RNG() {
	delTemp();
	var rngCircles = [];
	var asd = [0, 1];
	var dejaRNG = [];
	for(var i = 0; i < window.markers.length; ++i) {
		dejaRNG.push(i);
		window.nodesConRng[i] = [];
		for(var j = 0; j < window.nodesCon[i].length; ++j) {
			window.nodesConRng[i].push(window.nodesCon[i][j]);
			if(dejaRNG.indexOf(window.nodesCon[i][j]) > -1) {
				if(!window.nodesCon[i][j] in window.nodesConRng || window.nodesConRng[window.nodesCon[i][j]].indexOf(i) == -1) {
					window.nodesConRng[i].pop();
				}
				continue;
			}
			var coordI = window.markers[i].getPosition();
			var coordJ = window.markers[window.nodesCon[i][j]].getPosition();
			var coordinates = [coordI, coordJ];
			var line = new google.maps.Polyline({
				path: coordinates,
				geodesic: true,
				strokeColor: '#009ACD',
				strokeOpacity: 1.0,
				strokeWeight: 2,
				zIndex: 2
			});
			line.setMap(map);
			window.linesRng.push(line);
			var distance = google.maps.geometry.spherical.computeDistanceBetween(coordI, coordJ);
			var circleOptions1 = {
				strokeColor: '#FFFFFF',
				strokeOpacity: 0.5,
				strokeWeight: 2,
				fillColor: '#FFFFFF',
				fillOpacity: 0.25,
				map: map,
				center: coordI,
				radius: distance,
				clickable: false,
				zIndex: 1
			};
			var circleOptions2 = {
				strokeColor: '#FFFFFF',
				strokeOpacity: 0.5,
				strokeWeight: 2,
				fillColor: '#FFFFFF',
				fillOpacity: 0.25,
				map: map,
				center: coordJ,
				radius: distance,
				clickable: false,
				zIndex: 1
			};
			window.circlesRNG.push(new google.maps.Circle(circleOptions1));
			window.circlesRNG.push(new google.maps.Circle(circleOptions2));
			for(var k = 0; k < window.markers.length; ++k) {
				if(window.nodesCon[i].indexOf(k) == -1 || window.nodesCon[window.nodesCon[i][j]].indexOf(k) == -1) continue;
				var dist1 = google.maps.geometry.spherical.computeDistanceBetween(coordI, window.markers[k].getPosition());
				var dist2 = google.maps.geometry.spherical.computeDistanceBetween(coordJ, window.markers[k].getPosition());
				var coordK = window.markers[k].getPosition();
				if(dist1 < distance && dist2 < distance && k != i && k != window.nodesCon[i][j]) {
					window.circlesRNG[window.circlesRNG.length-1].setMap(null);
					window.circlesRNG[window.circlesRNG.length-2].setMap(null);
					window.circlesRNG.pop();
					window.circlesRNG.pop();
					window.nodesConRng[i].pop();
					line = window.linesRng.pop();
					line.setMap(null);
					break;
				}
			}
		}
	}
}

function drawCircleDel(a, b, c) {
	var pixelA = map.getProjection().fromLatLngToPoint(a.getPosition());
	var pixelB = map.getProjection().fromLatLngToPoint(b.getPosition());
	var pixelC = map.getProjection().fromLatLngToPoint(c.getPosition());
	var a_x = pixelA.x;
	var a_y = pixelA.y;
	var b_x = pixelB.x;
	var b_y = pixelB.y;
	var c_x = pixelC.x;
	var c_y = pixelC.y;
	var aSlope = (b_y - a_y)/(b_x - a_x);
    var bSlope = (c_y - b_y)/(c_x - b_x);
	var center_x = (aSlope*bSlope*(a_y - c_y) + bSlope*(a_x + b_x) - aSlope*(b_x + c_x))/(2*(bSlope - aSlope));
	var center_y = -1*(center_x - (a_x + b_x)/2)/aSlope + (a_y + b_y)/2;
	var center = map.getProjection().fromPointToLatLng(new google.maps.Point(center_x, center_y));
	var distance = google.maps.geometry.spherical.computeDistanceBetween(center, a.getPosition());
	var circleOptions = {
		strokeColor: '#FFFFFF',
		strokeOpacity: 0.5,
		strokeWeight: 2,
		fillColor: '#FFFFFF',
		fillOpacity: 0.25,
		map: map,
		center: center,
		radius: distance,
		clickable: false,
		zIndex: 1
	};
	window.circlesRNG.push(new google.maps.Circle(circleOptions));
}

function Delaunay() {
	if(window.markers.length > 2) {
		delTemp();
		var dejaRNG = [];
		var circRng = [];
		var theRest = true;
		for(var i = 0; i < window.markers.length; ++i) {
			for(var j = 0; j < window.nodesCon[i].length; ++j) {
				for(var k = 0; k < window.markers.length; ++k) {
					if(k != i && k != window.nodesCon[i][j]) {
						theRest = true;
						for(var m = 0; m < dejaRNG.length; ++m) {
							if(jQuery(dejaRNG[m]).not([i, nodesCon[i][j], k]).length == 0 && jQuery([i, nodesCon[i][j], k]).not(dejaRNG[m]).length == 0) {
								theRest = false;
								break;
							}
						}
						if(theRest) {
							dejaRNG.push([i, nodesCon[i][j], k]);
							circRng.push([i, nodesCon[i][j], k]);
							drawCircleDel(window.markers[i], window.markers[window.nodesCon[i][j]], window.markers[k]);
							for(var l = 0; l < window.markers.length; ++l) {
								if(l != i && l != window.nodesCon[i][j] && l != k && google.maps.geometry.spherical.computeDistanceBetween(window.circlesRNG[window.circlesRNG.length-1].getCenter(), window.markers[l].getPosition()) < window.circlesRNG[window.circlesRNG.length-1].getRadius()) {
									var circle = window.circlesRNG.pop();
									circRng.pop();
									circle.setMap(null);
									break;
								}
							}
						}
					}
				}
			}
		}
		for(var i = 0; i < window.markers.length; ++i) {
			window.nodesConRng[i] = [];
		}
		for(var i = 0; i < circRng.length; ++i) {
			if(window.nodesCon[circRng[i][0]].indexOf(circRng[i][1]) > -1 && window.nodesConRng[circRng[i][0]].indexOf(circRng[i][1]) == -1) window.nodesConRng[circRng[i][0]].push(circRng[i][1]);
			if(window.nodesCon[circRng[i][0]].indexOf(circRng[i][2]) > -1 && window.nodesConRng[circRng[i][0]].indexOf(circRng[i][2]) == -1) window.nodesConRng[circRng[i][0]].push(circRng[i][2]);
			if(window.nodesCon[circRng[i][1]].indexOf(circRng[i][0]) > -1 && window.nodesConRng[circRng[i][1]].indexOf(circRng[i][0]) == -1) window.nodesConRng[circRng[i][1]].push(circRng[i][0]);
			if(window.nodesCon[circRng[i][1]].indexOf(circRng[i][2]) > -1 && window.nodesConRng[circRng[i][1]].indexOf(circRng[i][2]) == -1) window.nodesConRng[circRng[i][1]].push(circRng[i][2]);
			if(window.nodesCon[circRng[i][2]].indexOf(circRng[i][0]) > -1 && window.nodesConRng[circRng[i][2]].indexOf(circRng[i][0]) == -1) window.nodesConRng[circRng[i][2]].push(circRng[i][0]);
			if(window.nodesCon[circRng[i][2]].indexOf(circRng[i][1]) > -1 && window.nodesConRng[circRng[i][2]].indexOf(circRng[i][1]) == -1) window.nodesConRng[circRng[i][2]].push(circRng[i][1]);
		}
		var dejaRNG = [];
		for(var i = 0; i < window.markers.length; ++i) {
			dejaRNG.push(i);
			for(var j = 0; j < window.nodesConRng[i].length; ++j) {
				if(dejaRNG.indexOf(window.nodesConRng[i][j]) > -1) continue;
				var coordinates = [window.markers[i].getPosition(), window.markers[window.nodesConRng[i][j]].getPosition()];
				var line = new google.maps.Polyline({
					path: coordinates,
					geodesic: true,
					strokeColor: '#009ACD',
					strokeOpacity: 1.0,
					strokeWeight: 2,
					zIndex: 2
				});
				line.setMap(map);
				window.linesRng.push(line);
			}
		}
	} else {
		RNG();
	}
}

function findSubNetworksRec(a, string) {
	for(var i = 0; i < window.nodesConRng[a].length; ++i) {
		if(window.dejaSub.indexOf(window.nodesConRng[a][i]) == -1) {
			window.dejaSub.push(window.nodesConRng[a][i]);
			string = string + window.nodesConRng[a][i] + ',';
			string = findSubNetworksRec(window.nodesConRng[a][i], string);
		}
	}
	return string;
}

function findClosestSub(a, b) {
	var dist = -1;
	var distance = 0;
	var nodA = 0;
	var nodB = 0;
	var gateA = false;
	var gateB = false;
	for(var i = 0; i < window.subNets[a].length; ++i) {
		if(window.markers[window.subNets[a][i]].get('gateway') == 1) gateA = true;
		for(var j = 0; j < window.subNets[b].length; ++j) {
			if(window.markers[window.subNets[b][j]].get('gateway') == 1) gateB = true;
			distance = google.maps.geometry.spherical.computeDistanceBetween(window.markers[window.subNets[a][i]].getPosition(), window.markers[window.subNets[b][j]].getPosition());
			if(window.nodesCon[window.subNets[a][i]].indexOf(parseInt(window.subNets[b][j])) > -1 && (dist == -1 || dist > distance)) {
				dist = distance;
				nodA = window.subNets[a][i];
				nodB = window.subNets[b][j];
			}
		}
	}
	if(gateA == true && gateB == true) return [0, 0, -1];
	return [nodA, nodB, dist]; 
}

function findSubNetworks() {
	window.dejaSub = [];
	window.subNets = [];
	window.closestSub = [];
	var string = '';
	var distTemp = [];
	for(var i = 0; i < window.markers.length; ++i) {
		if(dejaSub.indexOf(i) > -1) continue;
		window.dejaSub.push(i);
		string = i + ',';
		string = findSubNetworksRec(i, string);
		window.subNets.push(string.substr(0, string.length-1).split(','));
	}
	if(window.subNets.length == 1) return;
	for(var i = 0; i < window.subNets.length-1; ++i) {
		for(var j = i+1; j < window.subNets.length; ++j) {
			distTemp = findClosestSub(i, j);
			if(distTemp[2] != -1) window.closestSub.push(distTemp);
		}
	}
	var clos = -1;
	var j = 0;
	for(var i = 0; i < window.closestSub.length; ++i) {
		if(clos == -1 || clos > window.closestSub[i][2]) {
			clos = window.closestSub[i][2];
			j = i;
		}
	}
	window.nodesConRng[window.closestSub[j][0]].push(parseInt(window.closestSub[j][1]));
	window.nodesConRng[window.closestSub[j][1]].push(parseInt(window.closestSub[j][0]));
	var coordinates = [window.markers[window.closestSub[j][0]].getPosition(), window.markers[window.closestSub[j][1]].getPosition()];
	var lineSymbol = {
		path: 'M 0,-1 0,1',
		strokeOpacity: 1,
		scale: 4
	};
	var line = new google.maps.Polyline({
		path: coordinates,
		geodesic: true,
		strokeColor: '#009ACD',
		strokeOpacity: 1.0,
		strokeWeight: 2,
		zIndex: 2
	});
	line.setMap(map);
	window.linesRng.push(line);
	if(window.closestSub.length == 1) return;
	findSubNetworks();
}

function MST() {
	if(window.markers.length > 1) {
		delTemp();
		var distMst = -1;
		var distance = 0;
		var nodC = -1;
		for(var i = 0; i < window.markers.length; ++i) {
			window.nodesConRng[i] = [];
		}
		for(var i = 0; i < window.markers.length; ++i) {
			distMst = -1;
			for(var j = 0; j < window.nodesCon[i].length; ++j) {
				distance = google.maps.geometry.spherical.computeDistanceBetween(window.markers[i].getPosition(), window.markers[window.nodesCon[i][j]].getPosition());
				if(distMst == -1 || distMst > distance) {
					distMst = distance;
					nodC = nodesCon[i][j];
				}
			}
			if(window.nodesConRng[i].indexOf(nodC) == -1) window.nodesConRng[i].push(nodC);
			if(window.nodesConRng[nodC].indexOf(i) == -1) window.nodesConRng[nodC].push(i);
			var center = window.markers[i].getPosition();
			var distance = google.maps.geometry.spherical.computeDistanceBetween(window.markers[i].getPosition(), window.markers[nodC].getPosition());
			var circleOptions = {
				strokeColor: '#FFFFFF',
				strokeOpacity: 0.5,
				strokeWeight: 2,
				fillColor: '#FFFFFF',
				fillOpacity: 0.25,
				map: map,
				center: center,
				radius: distance,
				clickable: false,
				zIndex: 1
			};
			window.circlesRNG.push(new google.maps.Circle(circleOptions));
		}
		var dejaRNG = [];
		for(var i = 0; i < window.markers.length; ++i) {
			dejaRNG.push(i);
			for(var j = 0; j < window.nodesConRng[i].length; ++j) {
				if(dejaRNG.indexOf(window.nodesConRng[i][j]) > -1) continue;
				var coordinates = [window.markers[i].getPosition(), window.markers[window.nodesConRng[i][j]].getPosition()];
				var line = new google.maps.Polyline({
					path: coordinates,
					geodesic: true,
					strokeColor: '#009ACD',
					strokeOpacity: 1.0,
					strokeWeight: 2,
					zIndex: 2
				});
				line.setMap(map);
				window.linesRng.push(line);
			}
		}
		findSubNetworks();
	} else {
		RNG();
	}
}

function noTopo() {
	delTemp();
	for(var key in window.nodesCon) window.nodesConRng[key] = window.nodesCon[key].slice();
	jQuery.each(window.lines, function(index, value) {
		var path = value.getPath();
		var line = new google.maps.Polyline({
			path: path,
			geodesic: true,
			strokeColor: '#009ACD',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			zIndex: 2
		});
		line.setMap(map);
		window.linesRng.push(line);
	});
	jQuery.each(window.circles, function(index, value) {
		var center = value.getCenter();
		var radius = value.getRadius();
		var circleOptions = {
			strokeColor: '#FFFFFF',
			strokeOpacity: 0.5,
			strokeWeight: 2,
			fillColor: '#FFFFFF',
			fillOpacity: 0.25,
			map: map,
			center: center,
			radius: radius,
			clickable: false,
			zIndex: 1
		};
		window.circlesRNG.push(new google.maps.Circle(circleOptions));
	});
}

function fileNodesConfirmed() {
	jQuery.each(window.nodeFileCoords, function(index, value) {
		createMarker(value);
	});
}

function createNodesFromFile(string) {
	var chain = string.split('\r\n').join(' ').split('\n').join(' ').split('\r').join(' ').split(' ');
	var lat = 0;
	var lng = 0;
	var j = window.markers.length + 1;
	window.nodeFileCoords = [];
	var text = '<span style="font-weight: bold;">' + window.nodeFile[window.lang][2] + '</span><br /><br />';
	text += '<div style="height: 120px; max-height: 120px; overflow-y: auto;">';
	for(var i = 0; i < chain.length - Math.floor(chain.length % 4); i += 4) {
		lat = chain[i].slice(0, 1) == 'N' ? parseFloat(chain[i].slice(1)) + chain[i+1]/60 : -1*(parseFloat(chain[i].slice(1)) + chain[i+1]/60);
		lng = chain[i+2].slice(0, 1) == 'E' ? parseFloat(chain[i+2].slice(1)) + chain[i+3]/60 : -1*(parseFloat(chain[i+2].slice(1)) + chain[i+3]/60);
		window.nodeFileCoords.push(new google.maps.LatLng(lat, lng));
		text += '<span style="font-weight: bold;">' + window.nodeFile[window.lang][3] + j + ': </span>' + chain[i] + ' ' + chain[i+1] + ' ' + chain[i+2] + ' ' + chain[i+3] + '<br />';
		j += 1;
	}
	text += '</div>';
	jQuery('#nodes-file-p').html(text);
	window.nodesF.dialog('open');
}

function handleFileSelect(evt) {
	var files = evt.target.files;
	var textType = /text.*/;
	for(var i = 0, f; f = files[i]; i++) {
		if (f.type.match(textType)) {
			var reader = new FileReader();
			reader.readAsText(f);
			reader.onload = (function(theFile) {
				return function(e) {
					createNodesFromFile(e.target.result);
				};
			})(f);
		} else {
			jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.nodeFile[window.lang][1]);
			window.designV.dialog('open');
		}
    }
}

function uploadNodeFile() {
	var nodeUp = document.createElement('button');
	nodeUp.id = 'nodeUpload';
	jQuery(nodeUp).text(window.nodeFile[window.lang][0]);
	map.controls[google.maps.ControlPosition.RIGHT].push(nodeUp);
	var input = document.createElement('input');
	input.id = 'filesNod';
	input.type = 'file';
	jQuery(input).hide();
	map.controls[google.maps.ControlPosition.RIGHT].push(input);
	jQuery(nodeUp).click(function() { jQuery(input).click(); });
	document.getElementById('filesNod').addEventListener('change', handleFileSelect, false);
}

function changeStream(div) {
	jQuery('input[name="sensors"]:radio').each(function(index, value) {
		jQuery(value).parent().css({'background-color': '#ffffff', 'color': '#000000', 'font-weight': 'normal', 'text-shadow': 'none'});
	});
	jQuery(div).parent().css({'background-color': '#FFB733', 'color': '#ffffff', 'font-weight': 'bold', 'text-shadow': '1px 1px #996300'});
	jQuery('input[name="sensor-type"]:checkbox').prop('checked', false).parent().css({'background-color': '#ffffff', 'color': '#000000', 'font-weight': 'normal', 'text-shadow': 'none'});
	jQuery.each(window.streams[jQuery(div).parent().text()], function(index, value) {
		jQuery('input[name="sensor-type"][value="' + value + '"]:checkbox').prop('checked', true).parent().css({'background-color': '#FFB733', 'color': '#ffffff', 'font-weight': 'bold', 'text-shadow': '1px 1px #996300'});
	});
}

function loadStreams() {
	jQuery('#str-divs-r').html('');
	jQuery.each(window.sensors[window.lang], function(index, value) {
		var i = document.createElement('div');
		jQuery(i).addClass('str-divs-sens');
		var a = document.createElement('input');
		jQuery(a).prop('disabled', true);
		a.type = 'checkbox'
		a.name = 'sensor-type';
		a.value = index;
		jQuery(a).hide();
		jQuery(i).click(function() {
			if(Object.keys(window.streams).length > 0) {
				if(jQuery(a).is(':checked')) {
					jQuery(a).prop('checked', false);
				} else {
					jQuery(a).prop('checked', true);
				}
				if(jQuery(a).is(':checked')) {
					jQuery(a).parent().css({'background-color': '#FFB733', 'color': '#ffffff', 'font-weight': 'bold', 'text-shadow': '1px 1px #996300'});
					window.streams[jQuery('input[name="sensors"]:checked').parent().text()].push(a.value);
				} else {
					jQuery(a).parent().css({'background-color': '#ffffff', 'color': '#000000', 'font-weight': 'normal', 'text-shadow': 'none'});
					var index = window.streams[jQuery('input[name="sensors"]:checked').parent().text()].indexOf(a.value);
					window.streams[jQuery('input[name="sensors"]:checked').parent().text()].splice(index, 1);
				}
			}
		});
		jQuery(i).append(a);
		jQuery(i).append(value);
		jQuery('#str-divs-r').append(i);
	});
	jQuery.each(Object.keys(window.streams), function(index, value) {
		var m = document.createElement('div');
		jQuery(m).addClass('str-divs-sens');		
		var t = document.createElement('input');
		t.type = 'radio';
		t.name = 'sensors';
		jQuery(t).hide();
		jQuery(t).val(jQuery('#str-divs-l div').length+1);
		jQuery(m).append(t);
		var u = document.createTextNode(value);
		jQuery(m).append(u);
		jQuery(m).append('<img style="margin-left: 20px;" src="images/sensors-img/' + (jQuery('#str-divs-l div').length+1) + '.png" />');
		jQuery('#str-divs-l').append(m);
		jQuery('#createS').prop('disabled', false);
		jQuery('#createS').css({'color': '#181818', 'background-color': '#f8f8f8'});
		jQuery('#deleteS').prop('disabled', false);
		jQuery('#deleteS').css({'color': '#181818', 'background-color': '#f8f8f8'});
		jQuery('input[name="sensor-type"]').each(function(index, value) {
			jQuery(value).prop('disabled', false);
		});
		if(jQuery('#str-divs-l .str-divs-sens').length == 1) {
			jQuery(m).css({'background-color': '#FFB733', 'color': '#ffffff', 'font-weight': 'bold', 'text-shadow': '1px 1px #996300'});
		}
		jQuery(m).click(function() {
			jQuery(t).prop('checked', true);
			changeStream(t);
		});
		if(jQuery(t).val() == 1) {
			jQuery(t).prop('checked', true);
			changeStream(t);
		}
	});
}

function deleteStream() {
	var i = jQuery('input[name="sensors"]:checked').val();
	delete window.streams[jQuery('input[name="sensors"]:checked').parent().text()];
	jQuery.each(window.nodesStreams, function(index, value) {
		jQuery.each(value, function(index2, value2) {
			if(value2 == i) window.nodesStreams[index].pop(index2);
			if(value2 > i) window.nodesStreams[index][index2] = window.nodesStreams[index][index2]-1;
		});
	});
	jQuery('#str-divs-l .str-divs-sens').each(function() {
		if(jQuery(this).find('input').val() == i) {
			jQuery(this).remove();
		} else if(jQuery(this).find('input').val() > i) {
			jQuery(this).find('input').val(jQuery(this).find('input').val()-1);
			jQuery(this).find('img').prop('src', 'images/sensors-img/' + (parseInt(jQuery(this).find('img').prop('src').substr(-5, 1))-1) + '.png');
		}
	});
	if(jQuery('#str-divs-l div').length == 0) {
		jQuery(deleteS).prop('disabled', 'disabled');
		jQuery('input[name="sensor-type"]:checkbox').prop('checked', false).parent().css({'background-color': '#ffffff', 'color': '#000000', 'font-weight': 'normal', 'text-shadow': 'none'});
		jQuery(deleteS).css({'color': '#c6c6c6', 'background-color': '#dfdfdf'});
		jQuery('input[name="sensor-type"]').each(function(index, value) {
			jQuery(value).prop('disabled', true);
		});
	} else {
		jQuery('input[name="sensors"]:first').prop('checked', 'checked');
		changeStream(jQuery('input[name="sensors"]:first'));
		jQuery('input[name="sensors"]:radio').each(function(index, value) {
			jQuery(value).parent().css({'background-color': '#ffffff', 'color': '#000000', 'font-weight': 'normal', 'text-shadow': 'none'});
		});
		jQuery('input[name="sensors"]:checked').parent().css({'background-color': '#FFB733', 'color': '#ffffff', 'font-weight': 'bold', 'text-shadow': '1px 1px #996300'});
	}
	jQuery.each(window.imgs, function(index, value) {
		jQuery(value).find('img[src$="' + i + '.png"]').next().remove();
		jQuery(value).find('img[src$="' + i + '.png"]').remove();
		jQuery(value).children('img').map(function() {
			var j = parseInt(jQuery(this).prop('src').substr(-5, 1));
			if(j > i) {
				jQuery(this).prop('src', jQuery(this).prop('src').replace(j, (j-1)));
			}
		});
	});
}

function manageStreams() {
	var divLeftC = document.createElement('div');
	var divLeft = document.createElement('div');
	jQuery(divLeft).addClass('str-divs');
	divLeft.id = 'str-divs-l';
	jQuery(divLeftC).addClass('str-divs-c');
	var divRight = document.createElement('div');
	divRight.id = 'str-divs-r';
	jQuery(divRight).addClass('str-divs');
	var createS = document.createElement('button');
	var deleteS = document.createElement('button');
	createS.id = 'createS';
	deleteS.id = 'deleteS';
	jQuery(createS).addClass('buttons-str');
	jQuery(deleteS).addClass('buttons-str');
	jQuery(deleteS).prop('disabled', 'disabled');
	jQuery(deleteS).css({'color': '#c6c6c6', 'background-color': '#dfdfdf'});
	jQuery(createS).text(window.streamsLang[window.lang][1]);
	jQuery(deleteS).text(window.streamsLang[window.lang][2]);
	jQuery(createS).click(function() {
		var j = document.createElement('div');
		jQuery(j).addClass('str-divs-sens');
		var k = document.createElement('input');
		k.type = 'text';
		jQuery(k).prop('maxlength', '10');
		jQuery(k).addClass('input-str-text');
		jQuery(j).append(k);
		var l = document.createElement('button');
		jQuery(l).addClass('buttons-str');
		jQuery(l).css({'height': '24px', 'width': '20px', 'line-height': '10px'});
		jQuery(l).html('<span style="font-size:16px">&crarr;</span>');
		jQuery(j).append(l);
		jQuery(l).click(function() {
			var cont = true;
			if(jQuery('.input-str-text').val() != '') {
				jQuery('#str-divs-l .str-divs-sens:not(:last)').each(function() {
					if(jQuery('.input-str-text').val() == jQuery(this).text()) {
						cont = false;
						jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.streamsLang[window.lang][4]);
						window.designV.dialog('open');
						//alert(window.streamsLang[window.lang][4]);
					}
				});
				if(cont) {
					window.streams[jQuery('.input-str-text').val()] = [];
					var m = document.createElement('div');
					jQuery(m).addClass('str-divs-sens');
					var t = document.createElement('input');
					t.type = 'radio';
					t.name = 'sensors';
					jQuery(t).hide();
					if(jQuery('#str-divs-l div').length == 1) jQuery(t).prop('checked', true);
					jQuery(t).val(jQuery('#str-divs-l div').length);
					jQuery(m).append(t);
					var u = document.createTextNode(jQuery('.input-str-text').val());
					jQuery(m).append(u);
					jQuery(m).append('<img style="margin-left: 20px;" src="images/sensors-img/' + jQuery('#str-divs-l div').length + '.png" />');
					jQuery('#str-divs-l .str-divs-sens:last').remove();
					jQuery(divLeft).append(m);
					jQuery(createS).prop('disabled', false);
					jQuery(createS).css({'color': '#181818', 'background-color': '#f8f8f8'});
					jQuery(deleteS).prop('disabled', false);
					jQuery(deleteS).css({'color': '#181818', 'background-color': '#f8f8f8'});
					jQuery('input[name="sensor-type"]').each(function(index, value) {
						jQuery(value).prop('disabled', false);
					});
					if(jQuery('#str-divs-l .str-divs-sens').length == 1) {
						jQuery(m).css({'background-color': '#FFB733', 'color': '#ffffff', 'font-weight': 'bold', 'text-shadow': '1px 1px #996300'});
					}
					jQuery(m).click(function() {
						jQuery(t).prop('checked', true);
						changeStream(t);
					});
					jQuery(t).prop('checked', true);
					changeStream(t);
				}
			} else {
				jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.streamsLang[window.lang][3]);
				window.designV.dialog('open');
				//alert(window.streamsLang[window.lang][3]);
			}
		});
		jQuery(k).keydown(function(event) {
			if(event.keyCode == 13) {
				jQuery(l).click();
				return false;
			}
		});
		jQuery(this).prop('disabled', true);
		jQuery(this).css({'color': '#c6c6c6', 'background-color': '#dfdfdf'});
		jQuery(deleteS).prop('disabled', true);
		jQuery(deleteS).css({'color': '#c6c6c6', 'background-color': '#dfdfdf'});
		jQuery(divLeft).append(j);
	});
	jQuery(deleteS).click(function() {
		var ilya = false;
		jQuery.each(Object.keys(window.nodesStreams), function(index, value) {
			if(window.nodesStreams[value].indexOf(parseInt(jQuery('input[name="sensors"]:checked').val())) > -1) ilya = true;
		});
		if(ilya) {
			jQuery('#streams-deja-p').html(window.streamsDel[window.lang][0]);
			window.streamsR.dialog('open');
		} else {
			deleteStream();
		}	
	});
	jQuery(divLeftC).append(divLeft);
	jQuery(divLeftC).append(createS);
	jQuery(divLeftC).append(deleteS);
	jQuery('#manage-str-d').append(divLeftC);
	jQuery('#manage-str-d').append(divRight);
	loadStreams();
}

function xmlTopology(n) {
	if(typeof(n) === 'undefined') n = true;
	var deja = [];
	var text = '<?xml version="1.0"?>\n';
	text += '<network-topology\n';
	text += 'xmlns="http://snee.cs.manchester.ac.uk"\n';
	text += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
	text += 'xsi:schemaLocation="http://snee.cs.manchester.ac.uk network-topology.xsd">\n\n';
	text += '\t<units>\n';
	text += '\t\t<energy>MILLIJOULES</energy>\n';
	text += '\t\t<memory>BYTES</memory>\n';
	text += '\t\t<time>MILLISECONDS</time>\n';
	text += '\t</units>\n\n';
	text += '\t<radio-links>\n';
	jQuery(Object.keys(window.nodesConRng)).each(function(index, value) {
		jQuery(window.nodesConRng[value]).each(function(index2, value2) {
			if(deja.indexOf(value2) < 0) {
				text += '\t\t<radio-link source="' + (parseInt(value)+1) + '" dest="' + (value2+1) + '" bidirectional="true" energy="';
				var num_ene = parseFloat(299792458.0 / Math.pow(parseFloat(window.hw[window.markers[value].get('type')+1][5]), 2));
				var num_ene = num_ene / Math.pow(google.maps.geometry.spherical.computeDistanceBetween(window.markers[value].getPosition(), window.markers[value2].getPosition()), 2);
				text += num_ene.toFixed(4);
				text += '" time="';
				text += google.maps.geometry.spherical.computeDistanceBetween(window.markers[value].getPosition(), window.markers[value2].getPosition()).toFixed(4);
				text += '" radio-loss="0" />\n';
			}
		});
		deja.push(parseInt(value));
	});
	text += '\t</radio-links>\n\n';
	text += '</network-topology>';
	if(n) {
		jQuery('#query_area').hide();
		jQuery('#xml_area').css({'height': '440px'}).prop('readonly', true).val(text);
	}
	return text;
}

function xmlPhysical(n) {
	if(typeof(n) === 'undefined') n = true;
	var text = '<?xml version="1.0" encoding="UTF-8"?>\n';
	text += '<source xmlns="http://snee.cs.man.ac.uk/namespace/physical-schema"\n';
	text += '\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
	text += '\txsi:schemaLocation="http://snee.cs.man.ac.uk/namespace/physical-schema ../schema/physical-schema.xsd ">\n\n';
	text += '\t<sensor_network name="' + window.optName + '">\n';
	text += '\t\t<topology>etc/wsn-dd-topology.xml</topology>\n';
	text += '\t\t<site-resources>etc/wsn-dd-nodes.xml</site-resources>\n';
	var xa = '\t\t<gateways>';
	jQuery.each(window.markers, function(index, value) {
		if(value.get('gateway') == 1) {
			xa += (index+1) + ',';
		}
	});
	text += xa.substring(0, xa.length - 1) + '</gateways>\n';
	text += '\t\t<extents>\n';
	jQuery.each(Object.keys(window.streams), function(index, value) {
		text += '\t\t\t<extent name="' + value + '">\n';
		var xx = '\t\t\t\t<sites>'
		jQuery.each(Object.keys(window.nodesStreams), function(indexA, valueA) {
			jQuery.each(window.nodesStreams[valueA], function(index2A, value2A) {
				if((index+1) == value2A) {
					xx += valueA + ',';
				}
			});
		});
		text += (xx.substring(xx.length-1) == '>' ? xx : xx.substring(0, xx.length - 1)) + '</sites>\n';
		text += '\t\t\t\t<sensorTypes>\n';
		jQuery.each(window.streams[value], function(index2, value2) {
			text += '\t\t\t\t\t<attribute name="' + window.sensors['en'][parseInt(value2)] + '" sensorType="' + window.sensors['en'][parseInt(value2)] + '" />\n';
		});
		text += '\t\t\t\t</sensorTypes>\n';
		text += '\t\t\t</extent>\n';
	});
	text += '\t\t</extents>\n';
	text += '\t</sensor_network>\n\n';
	text += '</source>';
	if(n) {
		jQuery('#query_area').hide();
		jQuery('#xml_area').css({'height': '440px'}).prop('readonly', true).val(text);
	}
	return text;
}

function xmlLogical(n) {
	if(typeof(n) === 'undefined') n = true;
	var text = '<?xml version="1.0" encoding="UTF-8"?>\n\n';
	text += '<schema xmlns="http://snee.cs.man.ac.uk/namespace/logical-schema"\n';
	text += '\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
	text += '\txsi:schemaLocation="http://snee.cs.man.ac.uk/namespace/logical-schema ../schema/logical-schema.xsd ">\n\n';
	
	jQuery.each(Object.keys(window.streams), function(index, value) {
		text += '\t<stream name="' + value + '" type="pull">\n';
		jQuery.each(window.streams[value], function(index2, value2) {
			text += '\t\t<column name="' + window.sensors['en'][parseInt(value2)] + '">\n';
			text += '\t\t\t<type class="integer" />\n';
			text += '\t\t</column>\n';
		});
		text += '\t</stream>\n\n';
	});
	
	text += '</schema>';
	if(n) {
		jQuery('#query_area').hide();
		jQuery('#xml_area').css({'height': '440px'}).prop('readonly', true).val(text);
	}
	return text;
}

function xmlNodes(n) {
	if(typeof(n) === 'undefined') n = true;
	var text = '<?xml version="1.0"?>\n\n';
	text += '<site-resources\n';
	text += 'xmlns="http://snee.cs.manchester.ac.uk"\n';
	text += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
	text += 'xsi:schemaLocation="http://snee.cs.manchester.ac.uk site-resources.xsd">\n\n';
	text += '<units>\n';
	text += '\t<energy>JOULES</energy>\n';
	text += '\t<memory>KILOBYTES</memory>\n';
	text += '</units>\n\n';
	text += '<sites>\n';
	text += '\t<default>\n';
	text += '\t\t<energy-stock>' + window.hw[window.defaultType+1][8] + '</energy-stock>\n';
	text += '\t\t<ram>' + window.hw[window.defaultType+1][6] + '</ram>\n';
	text += '\t\t<flash-memory>' + window.hw[window.defaultType+1][7] + '</flash-memory>\n';
	text += '\t</default>\n\n';
	jQuery.each(window.markers, function(index, value) {
		if(value.get('type') != window.defaultType) {
			text += '\t<site id="' + (index+1) + '">\n';
			text += '\t\t<energy-stock>' + window.hw[value.get('type')+1][8] + '</energy-stock>\n';
			text += '\t\t<ram>' + window.hw[value.get('type')+1][6] + '</ram>\n';
			text += '\t\t<flash-memory>' + window.hw[value.get('type')+1][7] + '</flash-memory>\n';
			text += '\t</site>\n\n';
		}
	});	
	text += '</sites>\n\n';
	text += '</site-resources>';
	if(n) {
		jQuery('#query_area').hide();
		jQuery('#xml_area').css({'height': '440px'}).prop('readonly', true).val(text);
	}
	return text;
}

function xmlQuery2(n) {
	if(typeof(n) === 'undefined') n = true;
	var text = '<?xml version="1.0"?>\n';
	text += '<query-parameters\n';
	text += 'xmlns="http://snee.cs.manchester.ac.uk"\n';
	text += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
	text += 'xsi:schemaLocation="http://snee.cs.manchester.ac.uk query-parameters.xsd">\n\n';
	text += '\t<qos-expectations>\n\n';
	text += '\t\t<optimization-goal>\n';
	text += '\t\t\t<type>NONE</type>\n';
	text += '\t\t\t<variable>NONE</variable>\n';
	text += '\t\t\t<weighting>1</weighting>\n';
	text += '\t\t</optimization-goal>\n\n';
	text += '\t\t<acquisition-interval>\n';
	text += '\t\t\t<units>SECONDS</units>\n';
	text += '\t\t\t<constraint>\n';
	text += '\t\t\t\t<range>\n';
	text += '\t\t\t\t\t<min-val>' + jQuery('#min-inter').val() + '</min-val>\n';
	text += '\t\t\t\t\t<max-val>' + jQuery('#min-inter').val() + '</max-val>\n';
	text += '\t\t\t\t</range>\n';
	text += '\t\t\t</constraint>\n';
	text += '\t\t\t<weighting>1</weighting>\n';
	text += '\t\t</acquisition-interval>\n\n';
	text += '\t\t<buffering-factor>\n';
	text += '\t\t\t<constraint>\n';
	text += '\t\t\t\t<range>\n';
	text += '\t\t\t\t\t<min-val>1</min-val>\n';
	text += '\t\t\t\t\t<max-val>9999</max-val>\n';
	text += '\t\t\t\t</range>\n';
	text += '\t\t\t</constraint>\n';
	text += '\t\t\t<weighting>1</weighting>\n';
	text += '\t\t</buffering-factor>\n\n';
	text += '\t\t<delivery-time>\n';
	text += '\t\t\t<units>SECONDS</units>\n';
	text += '\t\t\t<constraint>\n';
	text += '\t\t\t\t<less-equals>' + jQuery('#deli-time').val() + '</less-equals>\n';
	text += '\t\t\t</constraint>\n';
	text += '\t\t\t<weighting>2</weighting>\n';
	text += '\t\t</delivery-time>\n\n';
	text += '\t</qos-expectations>\n\n';
	text += '</query-parameters>';
	if(n) jQuery('#xml_area').css({'height': '380px'}).prop('readonly', true).val(text);
	return text;
}

function xmlQuery() {
	jQuery('#query_area').show();
	xmlQuery2();
	jQuery('.chQuery').on('change', function() {
		xmlQuery2();
	});
}

function xmlQ() {
	if(window.xmlQu == '') {
		window.xmlQu = window.xmls2[window.lang][3];
	}
	jQuery('#query_area').hide();
	jQuery('#xml_area').css({'height': '440px'}).prop('readonly', false).val(window.xmlQu);
}

function goToSnee() {
	var query = '';
	var topology = '';
	var query_parameters = '';
	var physical_schema = '';
	var logical_schema = '';
	var nodes = '';
	if(jQuery('.xml_divs_sel:first').prop('id') == 'xml_0' && (jQuery('#xml_area').val() == '' || jQuery('#xml_area').val() == window.xmls2[window.lang][3])) {
		jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.xmls2[window.lang][6]);
		window.designV.dialog('open');
	} else if(jQuery('.xml_divs_sel:first').prop('id') != 'xml_0' && (window.xmlQu == '' || window.xmlQu == window.xmls2[window.lang][3])) {
		jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.xmls2[window.lang][6]);
		window.designV.dialog('open');
	} else {
		window.loading.dialog('open');
		jQuery('.xml_divs_sel:first').prop('id') == 'xml_0' ? query = jQuery('#xml_area').val() : query = window.xmlQu;
		topology = xmlTopology(false);
		query_parameters = xmlQuery2(false);
		physical_schema = xmlPhysical(false);
		logical_schema = xmlLogical(false);
		nodes = xmlNodes(false);
		jQuery.ajax({
			type: 'post',
			url: 'ajax/data_no_bd.php',
			data: {'query': query, 'topology': topology, 'query_parameters': query_parameters, 'physical_schema': physical_schema, 'logical_schema': logical_schema, 'nodes': nodes, 'action': 'save_xmls'},
			success: function(data){
				window.loading.dialog('close');
				if(data.indexOf('QUERY') > -1 && data.length == 6) {
					jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.xmls2[window.lang][7]);
					window.designV.dialog('open');
				} else if(data.indexOf('*O*K*') <= -1) {
					alert(data);
				} else {
					jQuery('.download_snee').each(function() {
						jQuery(this).remove();
					});
					var a = document.createElement('a');
					a.className = 'download_snee';
					a.href = 'downloads/' + data.substring(5) + '_snee_files.rar';
					a.download = 'snee_files.rar';
					jQuery('#snee-dialog').append(a);
					jQuery(a)[0].click();
					window.open('downloads/' + data.substring(5) + '_images.html', '_blank');
				}
			}
		});
	}
}

function XMLs() {
	var tit = document.createElement('p');
	jQuery(tit).addClass('ini-opt-class-tit');
	var title = document.createTextNode('XMLs');
	jQuery(tit).append(title);
	jQuery('#snee-text').html('').append(tit).append('<hr />');
	var tab = document.createElement('table');
	jQuery(tab).css({'width': '100%'});
	var tr = document.createElement('tr');
	jQuery(tab).append(tr);
	var td1 = document.createElement('td');
	jQuery(tr).append(td1);
	jQuery(td1).css({'width': '80%'});
	jQuery(td1).addClass('td_snee_1');
	var td2 = document.createElement('td');
	jQuery(tr).append(td2);
	jQuery(td2).css({'width': '20%'});
	jQuery(td2).addClass('td_snee_2');
	jQuery('#snee-text').append(tab);
	jQuery(tab).css({'font-weight': 'normal'});
	var p_choices = document.createElement('p');
	jQuery(p_choices).css({'font-weight': 'normal'});
	jQuery.each(window.xmls[window.lang], function(index, value) {
		jQuery('.td_snee_1').append('<div class="xmls_divs' + (index == 0 ? ' xml_divs_sel' : '') + '" id="xml_' + index + '"><span>' + value + '</span></div>');
	});
	var goToSneeDiv = document.createElement('div');
	jQuery(goToSneeDiv).addClass('goToSneeDiv');
	jQuery(goToSneeDiv).append(window.goToSnee_Name[window.lang]);
	jQuery('.td_snee_2').append(goToSneeDiv);
	jQuery(goToSneeDiv).click(function() {
		goToSnee();
	});
	jQuery('#snee-text').append(p_choices);
	var xml_area = document.createElement('textarea');
	jQuery(xml_area).prop('wrap', 'off');
	xml_area.id = 'xml_area';
	jQuery(xml_area).css({'resize': 'none', 'background-color': '#eeefff', 'width': '780px', 'max-width': '780px', 'overflow-x': 'auto', 'height': '420px', 'max-height': '420px', 'overflow-y': 'auto', 'font-family': 'monospace', 'padding': '4px', 'color': '#800000'});
	jQuery(xml_area).on('click keydown', function() {
		if(jQuery(this).val() == window.xmls2[window.lang][3]) {
			jQuery(this).val('');
		}
	});
	jQuery(xml_area).on('mouseout', function() {
		if(jQuery(this).val() == '') {
			jQuery(this).val(window.xmls2[window.lang][3]);
		}
	});
	var divOpt = document.createElement('p');
	jQuery(divOpt).css({'font-weight': 'normal'});
	divOpt.id = 'query_area';
	jQuery(divOpt).html(window.xmls2[window.lang][0] + ': <input class="chQuery" style="width: 60px;" id="deli-time" type="number" value="600" step="1" max="10000" min="1" name="deli-time">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
	window.xmls2[window.lang][1] + ': <input class="chQuery" style="width: 50px;" id="min-inter" type="number" value="10" step="1" max="1000" min="1" name="min-time">');
	jQuery(divOpt).children().keydown(function (e) { e.preventDefault(); });
	jQuery(divOpt).css({'width': '780px'});
	jQuery('#snee-text').append(divOpt);
	jQuery('#snee-text').append(xml_area);
	jQuery('.xmls_divs').on('click', function() {
		if(!jQuery(this).hasClass('xml_divs_sel')) {
			jQuery('.xml_divs_sel:first').each(function(index, value) {
				jQuery(this).removeClass('xml_divs_sel');
				if(jQuery(this).prop('id') == 'xml_0') window.xmlQu = jQuery('#xml_area').val();
			});
			jQuery(this).addClass('xml_divs_sel');
			if(jQuery(this).prop('id') == 'xml_0') {
				xmlQ();
			} else if(jQuery(this).prop('id') == 'xml_1') {
				xmlQuery();
			} else if(jQuery(this).prop('id') == 'xml_2') {
				xmlLogical();
			} else if(jQuery(this).prop('id') == 'xml_3') {
				xmlTopology();
			} else if(jQuery(this).prop('id') == 'xml_4') {
				xmlPhysical();
			} else if(jQuery(this).prop('id') == 'xml_5') {
				xmlNodes();
			}
		}
	});
	xmlQ();
}

function validateStreams() {
	var sError = false;
	jQuery('#Nodes').one('click', function(e) {
		jQuery(Object.keys(window.streams)).each(function(index, value) {
			if(window.streams[value].length == 0) sError = true;
		});
		if(Object.keys(window.streams).length == 0) sError = true;
		if(!sError) {
			(!window.fullScreenState) ? jQuery('.button').css({'z-index': ''}) : jQuery('.button').css({'z-index': '100'});
			window.streamError = false;
			window.manS.dialog('close');
		} else {
			window.streamError = true;
			jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + streamErrTxt[window.lang]);
			window.designV.dialog('open');
		}
	});
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
		jQuery('#desValidation').hide();
		if(jQuery('#budgetDisplay').length == 0) createBudgetDisplay();
		selectedBlock();
		jQuery('#place-div').css('display', 'block');
		jQuery('#clear-all').css('display', 'block');
		google.maps.event.removeListener(window.lis);
	} else if(opt == 'Obstacles') {
		(!window.fullScreenState) ? jQuery('.button').css({'z-index': ''}) : jQuery('.button').css({'z-index': '100'});
		window.manS.dialog('close');
		google.maps.event.removeListener(window.lis);
		staticOptions();
		if(jQuery('#budgetDisplay').length == 0) createBudgetDisplay();
		jQuery('#desValidation').hide();
		jQuery('#nodeUpload').hide();
		if(jQuery('#list').length > 0) jQuery('#list').text('');
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
	} else if(opt == 'Streams') {
		google.maps.event.removeListener(window.lis);
		jQuery('#desValidation').hide();
		jQuery('#topControl').hide();
		jQuery('#dsgn-tbl').hide();
		jQuery('#selectObstacles').hide();
		jQuery('#createObstacle').hide();
		jQuery('#nodeUpload').hide();
		selectedBlock();
		if(jQuery('#manage-str-d').is(':empty')) manageStreams();
		if(!window.manS.dialog('isOpen')) window.manS.dialog('open');
		jQuery('.button').css({'z-index': '101'});
		validateStreams();
	} else if(opt == 'Nodes') {
		if(window.streamError) {
			jQuery('#iamp').click();
		} else {
			window.manS.dialog('close');
			google.maps.event.removeListener(window.lis);
			staticOptions();
			jQuery('#desValidation').hide();
			jQuery('#topControl').hide();
			jQuery('#dsgn-tbl').hide();
			if(jQuery('#nodeUpload').length == 0) {
				uploadNodeFile();
			} else {
				jQuery('#nodeUpload').show();
			}
			for(var i = 0; i < window.x.length; ++i) {
				jQuery(window.x[i]).html('');
			}
			jQuery('#selectObstacles').hide();
			jQuery('#createObstacle').hide();
			if(jQuery('#budgetDisplay').length == 0) createBudgetDisplay();
			window.lis = google.maps.event.addListener(map, 'click', function(event) {
				createMarker(event.latLng, true);
			});
		}
	} else if(opt == 'Design') {
		google.maps.event.removeListener(window.lis);
		staticOptions();
		showTopo();
		if(jQuery('#list').length > 0) jQuery('#list').text('');
		jQuery.each(window.markers, function(index, value) {
			value.setOptions({draggable: true});
			google.maps.event.clearListeners(value, 'rightclick');
			google.maps.event.addListener(value, 'rightclick', function(mark) {
				callMenu(value);
			});
		});
		if(jQuery('#budgetDisplay').length == 0) createBudgetDisplay();
		jQuery('#nodeUpload').hide();
		jQuery('#selectObstacles').hide();
		jQuery('#createObstacle').hide();
		jQuery('#topControl').hide();
		jQuery('#nodeUpload').hide();
		if(jQuery('#desValidation').length == 0) {
			designValDiv();
		} else {
			jQuery('#desValidation').show();
			jQuery('#dsgn-tbl').show();
		}
	} else if(opt == 'Topology') {
		if(jQuery('#desValidation').length == 0) designValDiv();
		staticOptions();
		if(jQuery('#budgetDisplay').length == 0) createBudgetDisplay();
		jQuery('#dsgn-tbl').hide();
		window.designAlert = '<span style="font-weight: bold;">Error:</span><br />';
		if(!testConnectivity() && !window.loading.dialog('isOpen')) {
			jQuery('#iamp').click();
			jQuery('#design-valid-p').html(window.designAlert);
			window.designV.dialog('open');
		} else {
			jQuery.each(window.markers, function(index, value) {
				value.setOptions({draggable: false});
				google.maps.event.clearListeners(value, 'rightclick');
			});
			if(jQuery('#topControl').length == 0) {
				jQuery('#desValidation').append('<table id="topControl"><tr><td height="38">' + window.topoCon[window.lang][0] + '</td><td height="38"><input type="radio" name="topol" value="del" checked="checked" /></td></tr><tr><td height="38">' + window.topoCon[window.lang][1] + '</td><td height="38"><input type="radio" name="topol" value="rng" /></td></tr><tr><td height="38">' + window.topoCon[window.lang][2] + '</td><td height="38"><input type="radio" name="topol" value="mst" /></td></tr><tr><td height="38">' + window.topoCon[window.lang][4] + '</td><td height="38"><input type="radio" name="topol" value="non" /></td></tr><tr><td colspan="2"><div id="submit-topo">' + window.topoCon[window.lang][3] + '</div></td></tr></table>');
				jQuery('#submit-topo').click(function() {
					if(jQuery('input[name="topol"]:checked').val() == 'rng') {
						RNG();
					} else if(jQuery('input[name="topol"]:checked').val() == 'del') {
						Delaunay();
					} else if(jQuery('input[name="topol"]:checked').val() == 'mst') {
						MST();
					} else if(jQuery('input[name="topol"]:checked').val() == 'non') {
						noTopo();
					}
				});
			} else {
				jQuery('#topControl').show();
			}
		}
	} else if(opt == 'Snee') {
		if(Object.keys(window.nodesConRng).length == 0) {
			jQuery('#iamp').click();
			jQuery('#design-valid-p').html('<span style="font-weight: bold;">Error:</span><br /><br />' + window.xmls2[window.lang][5]);
			window.designV.dialog('open');
			
		} else {
			XMLs();
			window.optionsSnee.dialog('open');
		}
	}
}

function nextPrev(el) {
	if(jQuery(el).prop('class').indexOf('Next') > -1 && currentOption < options.length-1) {
		jQuery('img[src="http://www.google.com/intl/en_us/mapfiles/close.gif"]').each(function(value) {
			jQuery(this).click();
		});
		jQuery('#' + options[currentOption]).tooltip('close');
		window.currentOption += 1;
		buttons(options[currentOption]);
		if(jQuery('.ui-tooltip').length != 0) {
			jQuery('#' + options[currentOption]).tooltip('open');
		}
		clickable();
	} else if(jQuery(el).prop('class').indexOf('Previous') > -1 && currentOption > 0) {
		jQuery('img[src="http://www.google.com/intl/en_us/mapfiles/close.gif"]').each(function(value) {
			jQuery(this).click();
		});
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
