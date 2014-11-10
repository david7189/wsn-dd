<?php
	session_start();

	require_once 'google-api-php-client-master/src/Google/Client.php';
	require_once 'google-api-php-client-master/src/Google/Service/Oauth2.php';
	require_once 'db_config.php';
	require_once 'google_config.php';
 
	$client = new Google_Client();
	$client -> setScopes(array(
		"https://www.googleapis.com/auth/plus.me",
		"https://www.googleapis.com/auth/userinfo.email"
	));
	
	$google_oauthV2 = new Google_Service_Oauth2($client);
	$client -> setRedirectUri($RedirectUri);
	$client -> setClientId($ClientId);
	$client -> setClientSecret($ClientSecret);
	$client -> setApplicationName($ApplicationName);
	
	if(isset($_REQUEST['code'])) {
		$client -> authenticate($_GET['code']);
		$user = $google_oauthV2 -> userinfo -> get();
		$_SESSION['user_id'] = $user -> id;
		$_SESSION['user_name'] = $user -> name;
		$_SESSION['email'] = $user -> email;
		$_SESSION['profile_pic_url'] = $user -> picture;
	
		$google_users = mysqli_query($connection, "SELECT * FROM google_users WHERE id = '" . $user -> id . "'");
		if(mysqli_num_rows($google_users) == 0) {
			mysqli_query($connection, "INSERT INTO google_users VALUES ('" . $user -> id . "', '" . $user -> name . "', '" . $user -> email . "', '" . $user -> picture . "')");
		}
		header('Location: ../index.php');
	} else {
		if(isset($_REQUEST['error'])) {
			header('Location: ../index.php?error_code=1');
		} else {
			$authUrl = $client -> createAuthUrl();
			header('Location: ' . $authUrl);
		}
	}
?>