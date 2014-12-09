<?php
	require_once '../auth/db_config.php';
 	session_start();
	if(isset($_POST['action']) && $_POST['action'] == 'hw_types') {
		$hw_types = mysqli_query($connection, "SELECT id, name, range_, rate, voltage, frequency, ram, flash, energy, rx, cost FROM hw_platforms");
		if($hw_types->num_rows > 0) {
			while($row = $hw_types->fetch_assoc()) {
				echo implode(',', $row) . '||';
			}
		}
		else {
			echo 'ERROR';	
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'name_exists') {
		$query = "SELECT count(*) x from users_deployments a join deployments b on (a.id_deployments = b.id) " .
			"where a.id_users=\"" . $_SESSION['user_id'] . "\" and b.name = \"" . $_POST['name'] . "\"";
		$name_exists = mysqli_query($connection, $query);
		while($row = $name_exists->fetch_assoc()) {
			echo $row['x'];
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'insert_name') {
		$query = "insert into deployments(name, defnode, budget, budremain, budtype, step) values('" . $_POST['name'] . "', '" . $_POST['type'] . "', '" . $_POST['budget'] . "', '" . $_POST['budget'] . "', '" . $_POST['budtype'] . "', 0)";
		$query2 = "insert into users_deployments(id_users, id_deployments) values (\"" . $_SESSION['user_id'] . "\", LAST_INSERT_ID())";
		mysqli_query($connection, $query);
		$insert_id = mysqli_insert_id($connection);
		mysqli_query($connection, $query2);
		echo 'y-' . $insert_id;
	} else if(isset($_POST['action']) && $_POST['action'] == 'search_deployments') {
		$query = "SELECT b.id, b.name, b.defnode, b.budget, b.budremain, b.budtype, b.step, ifnull(b.zoom, 19) \"zoom\", ifnull(b.centerlat, 48.85837) \"centerlat\", ifnull(b.centerlng, 2.294481) \"centerlng\", ifnull(b.type, \"satellite\") \"type\" ".
		"from users_deployments a join deployments b on (a.id_deployments = b.id) where a.id_users=\"" . $_SESSION['user_id'] . "\"";
		$search_deployments = mysqli_query($connection, $query);
		if($search_deployments->num_rows > 0) {
			echo '[';
			while($row = $search_deployments->fetch_assoc()) {
				echo '[' . $row['id']. ',"' . $row['name'] . '",' . $row['defnode'] . ',' . $row['budget'] . ',';
				echo $row['budremain'] . ',"' . $row['budtype'] . '",' . $row['step'] . ', ' . $row['zoom'] . ', ' . $row['centerlat'] . ', ' . $row['centerlng'] . ', "' . $row['type'] . '"],';
			}
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'search_users') {
		$query = "SELECT id, case name when '' then concat('(User: ', id, ')') else name end \"name\" from google_users where id <> \"" . $_SESSION['user_id'] . "\"";
		$search_deployments = mysqli_query($connection, $query);
		if($search_deployments->num_rows > 0) {
			echo '[';
			while($row = $search_deployments->fetch_assoc()) {
				echo '["' . $row['id']. '","' . $row['name'] . '"],';
			}
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'search_deployments_share') {
		$query = "SELECT b.id, b.name from users_deployments a join deployments b on (a.id_deployments = b.id) where a.id_users=\"" . $_SESSION['user_id'] . "\"";
		$search_deployments = mysqli_query($connection, $query);
		if($search_deployments->num_rows > 0) {
			echo '[';
			while($row = $search_deployments->fetch_assoc()) {
				echo '[' . $row['id']. ',"' . $row['name'] . '"],';
			}
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'share_deployments') {
		for($i = 0; $i < count($_POST['deployments']); ++$i) {
			for($j = 0; $j < count($_POST['users']); ++$j) {
				$query = "select count(*) a from users_deployments where id_users = \"" . $_POST['users'][$j] . "\" and id_deployments = " . $_POST['deployments'][$i];
				$search_count = mysqli_query($connection, $query);
				$count = $search_count->fetch_assoc();
				if($count['a'] == '0') {
					$query = "insert into users_deployments(id_users, id_deployments) values (\"" . $_POST['users'][$j] . "\", " . $_POST['deployments'][$i] . ")";
					mysqli_query($connection, $query);
				}
			}
		}
		echo 'OK';
	} else if(isset($_POST['action']) && $_POST['action'] == 'insert_nodes') {
		$lat = explode(',', substr($_POST['lat'], 0, -1));
		$lng = explode(',', substr($_POST['lng'], 0, -1));
		$type = explode(',', substr($_POST['type'], 0, -1));
		$gateway = explode(',', substr($_POST['gate'], 0, -1));
		$radius = explode(',', substr($_POST['radius'], 0, -1));
		$blocklat = explode(',', substr($_POST['block-lat'], 0, -1));
		$blocklng = explode(',', substr($_POST['block-lng'], 0, -1));
		$sensors = explode(',', substr($_POST['sensors'], 0, -1));
		for($i = 0; $i < count($blocklat); ++$i) {
			$blocklat[$i] = explode('-', $blocklat[$i]);
		}
		$center = explode(',', $_POST['center']);
		$query = "delete from nodes where deployment = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		$query = "delete from obstacles where deployment = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		$query = "update deployments set budremain = " . $_POST['budremain'] . ", zoom = " . $_POST['zoom'] . ", type = \"" . $_POST['maptype'] . "\", centerlat = \"" . $center[0] . "\", centerlng = \"" . $center[1] . "\", step = " . $_POST['step'] . " where id = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		for($i = 0; $i < count($lat); ++$i) {
			if($lat[$i] != '') {
				$query = "insert into nodes (deployment, lat, lng, type, radius, gateway, sensors) values (" . $_POST['id-deploy'] . ", \"" . $lat[$i] . "\", \"" . $lng[$i] . "\", " . $type[$i] . ", \"" . $radius[$i] . "\", " . $gateway[$i] . ", \"" . $sensors[$i] . "\")";
				mysqli_query($connection, $query);
			}
		}
		for($i = 0; $i < count($blocklat); ++$i) {
			if($blocklat[$i][0] != '') {
				$query = "insert into obstacles (deployment, lat, lng, obs) values (" . $_POST['id-deploy'] . ", \"" . $blocklat[$i][1] . "\", \"" . $blocklng[$i] . "\", " . $blocklat[$i][0] . ")";
				mysqli_query($connection, $query);
			}
		}
		echo 'OK';
	} else if(isset($_POST['action']) && $_POST['action'] == 'load_nodes') {
		$query = mysqli_query($connection, "select lat, lng, type, radius, gateway, sensors FROM nodes where deployment = " . $_POST['deploy']);
		if($query->num_rows > 0) {
			echo '[';
			while($row = $query->fetch_assoc()) {
				echo '[' . $row['lat'] . ',' . $row['lng'] .',' . $row['type'] . ',' . $row['radius'] . ',' . $row['gateway'] . ',"' . $row['sensors'] . '"],';
			}
		}
		else {
			echo '[,';	
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'load_obstacles') {
		$query = mysqli_query($connection, "select lat, lng, obs FROM obstacles where deployment = " . $_POST['deploy'] . " order by obs");
		if($query->num_rows > 0) {
			echo '[';
			while($row = $query->fetch_assoc()) {
				echo '[' . implode(',', $row) . '],';
			}
		}
		else {
			echo '[,';	
		}
	}
	
	mysqli_close($connection);
?>