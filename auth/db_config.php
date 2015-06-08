<?php
	define('DB_SERVER', 'localhost');
	define('DB_USERNAME', 'ENTER YOUR DB USERNAME');
	define('DB_PASSWORD', 'ENTER YOUR DB PASSWORD');
	define('DB_DATABASE', 'wsn-dd');
	$connection = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE) or die('Unable to connect');
	$connection->set_charset("utf8");
?>
