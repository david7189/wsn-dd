<?php
	//define('DB_SERVER', 'localhost');
	//define('DB_USERNAME', 'root');
	//define('DB_PASSWORD', '');
	//define('DB_DATABASE', 'wsn-dd');
	define('DB_SERVER', 'mysql2.000webhost.com');
	define('DB_USERNAME', 'a5789866_admin');
	define('DB_PASSWORD', 'Dc26d89e7f');
	define('DB_DATABASE', 'a5789866_users');
	$connection = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE) or die('Unable to connect');
?>