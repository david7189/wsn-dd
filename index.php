<!DOCTYPE html>
<html>
	<head>
		<title>Wireless Sensor Network Deployment Design</title>
    	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<link rel="icon" href="images/favicon/favicon.ico" />
		<link href='http://fonts.googleapis.com/css?family=Montserrat+Alternates' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css" />
		<link type="text/css" href="css/style.css" rel="stylesheet" media="all" />
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=<?php
		require_once 'auth/google_config.php';
		echo $GoogleMapsAPIKey;
		?>&libraries=geometry,places&sensor=false&language=<?php
			$lang = "en";
			if(isset($_GET['lang'])) $lang = $_GET['lang'];
			echo $lang;
		?>"></script>
		<script type="text/javascript" src="js/infobox.js"></script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
		<?php
			session_start();
			if(isset($_GET['anonymous'])) {
				$_SESSION['user_id'] = rand(1000000, 9999999);
				$_SESSION['user_name'] = 'Anonymous';
				$_SESSION['profile_pic_url'] = 'images/unknown_user.jpg';
			}
			if(isset($_GET['logout'])) {
				unset($_SESSION['user_id']);
				unset($_SESSION['user_name']);
				unset($_SESSION['email']);
				unset($_SESSION['profile_pic_url']);
		?>
				<img style="visibility: hidden;" src="https://mail.google.com/mail/u/0/?logout&hl=en" />
		<?php
			}
			if(isset($_SESSION['user_id'])) {
		?>
				<script type="text/javascript" src="js/maps.google.polygon.containsLatLng.js"></script>
				<script type="text/javascript" src="js/map.js"></script>
				<script type="text/javascript" src="js/FullScreenControl.js"></script>
		<?php
			}
		?>
  	</head>
  	<body>
		<?php
			if(isset($_SESSION['user_id'])) {
				echo '<div id="user-info">';
					echo '<span id="hello">Hello </span><span>' . $_SESSION['user_name'] . '</span><p class="clear" />';
					echo '<span><img class="circ" src="' . $_SESSION['profile_pic_url'] . '" /></span><p class="clear" />';
					echo '<span class="cur-dep-name">&nbsp;</span><p class="clear" />';
					echo '<span class="dep-name">-</span><p class="clear" />';
					echo '<span>( <a id="logout" href="index.php?logout">Logout</a> )</span>';
				echo '</div>';
		?>
				<div id="node-searcher">
					<span id="node-searcher-title">&nbsp;</span><p class="clear" />
					<span id="node-searcher-sel">
						<select id="node-search-sel">
							<option value="0">-----</option>
						</select>
					</span>
				</div>
				<div id="budget-d">
					<span id="budget-d1-title">&nbsp;</span><p class="clear" />
					<div id="budget-d1-value" class="moreVisible">&nbsp;</div><p class="clear" />
					<span id="budget-d2-title">&nbsp;</span><p class="clear" />
					<div id="budget-d2-value" class="moreVisible">&nbsp;</div><p class="clear" />
					<span id="budget-d3-title">&nbsp;</span><p class="clear" />
					<div id="budget-d3-value" class="moreVisible">&nbsp;</div><p class="clear" />
				</div>
				<div id="container">
					<div id="divTitle">
						<span id="title">&nbsp;</span>
					</div>
					<input id="place-div" type="text" placeholder="Search Box" />
					<div id="map"></div>
					<div id="contButtons">
						<div id="Area" class="button" title="Area">&nbsp;</div>
						<div id="Obstacles" class="button" title="Obstacles">&nbsp;</div>
						<div id="Streams" class="button" title="Streams">&nbsp;</div>
						<div id="Nodes" class="button" title="Nodes">&nbsp;</div>
						<div id="Design" class="button" title="Design">&nbsp;</div>
						<div id="Topology" class="button" title="Topology">&nbsp;</div>
						<div id="Snee" class="button" title="Snee">&nbsp;</div><p class="clear" />
					</div>
					<div id="move-prog"><span class="nextprev Previous">&nbsp;</span>  |  <span class="nextprev Next">&nbsp;</span></div>
				</div>
				<div id="language">
					<span id="en" class="lang">English</span>  |  <span id="es" class="lang">Español</span>
				</div>
				<div id="menu">
					<span id="iamp" class="nextprev Previous">&nbsp;</span>  |  <span id="iamn" class="nextprev Next">&nbsp;</span>
					<div id="saveState" class="stateButton">&nbsp;</div>
					<div id="loadState" class="stateButton">&nbsp;</div>
				</div>
				<div id="confirm-state" title="State">
					<p id="state-text">&nbsp;</p>
					<span class="state-close ui-icon ui-icon-closethick"></span>
				</div>
				<div id="design-valid" title="Design">
					<p id="design-valid-p">&nbsp;</p>
					<span class="design-close ui-icon ui-icon-closethick"></span>
				</div>
				<div id="nodes-file" title="Design">
					<p id="nodes-file-p">&nbsp;</p>
					<span class="file-close ui-icon ui-icon-closethick"></span>
				</div>
				<div id="streams-deja" title="Streams">
					<p id="streams-deja-p">&nbsp;</p>
					<span class="streams-deja-x ui-icon ui-icon-closethick"></span>
				</div>
				<div id="del-block" title="DelBlock">
					<p id="del-block-p">&nbsp;</p>
					<span class="del-block-close ui-icon ui-icon-closethick"></span>
				</div>
				<div id="clear-all-div" title="DelBlock">
					<p id="clear-all-div-p">&nbsp;</p>
					<span class="clear-all-close ui-icon ui-icon-closethick"></span>
				</div>
				<div id="manage-str-div" style="padding-left: 8px;" title="ManStreams">
					<div id="manage-str-d" style="height: 100%;"></div>
				</div>
				<div id="options-dialog" title="Options" />
				<div id="snee-dialog" title="Snee">
					<div id="snee-text">&nbsp;</div>
					<span class="snee-close ui-icon ui-icon-closethick" />
				</div>
				<div id="loading-dialog">
					<img src="images/ajax-loader.gif" />
				</div>
		<?php
			} else {
		?>
				<div id="container-log">
					<p>Please Connect Using your Google Account</p>
					<p><a href="auth/auth.php"><img src="images/google-login-button.png" /></a></p>
					<p><a class="anonymous" href="index.php?anonymous">Anonymous login</a></p>
				</div>
		<?php
			}
		?>
	</body>
</html>
