<!DOCTYPE html>
<html>
	<head>
   	<title>Wireless Sensor Network Deployment Design</title>
    	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<link rel="icon" href="images/favicon/favicon.ico" />
		<link href='http://fonts.googleapis.com/css?family=Montserrat+Alternates' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css" />
		<link type="text/css" href="css/style.css" rel="stylesheet" media="all" />
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=geometry,places&sensor=false&language=<?php
			$lang = "en";
			if(isset($_GET['lang'])) $lang = $_GET['lang'];
			echo $lang;
		?>"></script>
		<script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js"></script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
		<?php
			session_start();
			if(isset($_GET['logout'])) {
				unset($_SESSION['user_id']);
				unset($_SESSION['user_name']);
				unset($_SESSION['email']);
				unset($_SESSION['profile_pic_url']);
			}
			if(isset($_SESSION['user_id'])) {
		?>
				<script type="text/javascript" src="js/maps.google.polygon.containsLatLng.js"></script>
				<script type="text/javascript" src="js/map.js"></script>
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
					echo '<span>( <a id="logout" href="index.php?logout">Logout</a> )</span>';
				echo '</div>';
		?>
		
				<div id="user-info">
					<span>&nbsp;</span>
				</div>
				<div id="container">
					<div id="divTitle">
						<span id="title">&nbsp;</span>
					</div>
					<input id="place-div" type="text" placeholder="Search Box" />
					<div id="map"></div>
					<div id="Area" class="button" title="Area">&nbsp;</div>
					<div id="Obstacles" class="button" title="Obstacles">&nbsp;</div>
					<div id="Nodes" class="button" title="Nodes">&nbsp;</div>
					<div class="button">other</div>
					<div class="button">other</div>
					<div id="last" class="button">other</div><p class="clear" />
					<div id="move-prog"><span class="nextprev Previous">&nbsp;</span>  |  <span class="nextprev Next">&nbsp;</span></div>
				</div>
				<div id="language">
					<span id="en" class="lang">English</span>  |  <span id="es" class="lang">Español</span>
				</div>
				<div id="menu">
					<span class="nextprev Previous">&nbsp;</span>  |  <span class="nextprev Next">&nbsp;</span>
					<div id="saveState" class="stateButton">&nbsp;</div>
					<div id="loadState" class="stateButton">&nbsp;</div>
				</div>
				<div id="confirm-state" title="State">
					<p id="state-text">&nbsp;</p>
					<span class="state-close ui-icon ui-icon-closethick"></span>
				</div>
				<div id="options-dialog" title="Hello">
					<p id="options-dtext">&nbsp;</p>
				</div>
		<?php
			} else {
		?>
				<div id="container-log">
					<p>Please Connect Using your Google Account</p>
					<p><a href="auth/auth.php"><img src="images/google-login-button.png"></p>
				</div>
		<?php
			}
		?>
	</body>
</html>