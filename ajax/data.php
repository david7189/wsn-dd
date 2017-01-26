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
	} else if(isset($_POST['action']) && $_POST['action'] == 'name_exists_2') {
		$query = "SELECT count(*) x from users_deployments a join deployments b on (a.id_deployments = b.id) " .
			"where a.id_users=\"" . $_SESSION['user_id'] . "\" and b.name = \"" . $_POST['name'] . "\" and b.id <> " . $_POST['notthis'];
		$name_exists = mysqli_query($connection, $query);
		while($row = $name_exists->fetch_assoc()) {
			echo $row['x'];
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'insert_name') {
		$query = "insert into deployments(name, defnode, budget, budremain, budtype, step, zoom, centerlat, centerlng, last_used_by, last_date) " .
		"values('" . $_POST['name'] . "', '" . $_POST['type'] . "', '" . $_POST['budget'] . "', '" . $_POST['budget'] . "', '" . $_POST['budtype'] . "', 0, " . $_POST['zoom'] . ", '" . $_POST['centerlat'] . "', '" . $_POST['centerlng'] . "', '" . $_SESSION['user_id'] . "', sysdate())";
		$query2 = "insert into users_deployments(id_users, id_deployments) values (\"" . $_SESSION['user_id'] . "\", LAST_INSERT_ID())";
		mysqli_query($connection, $query);
		$insert_id = mysqli_insert_id($connection);
		mysqli_query($connection, $query2);
		echo 'y-' . $insert_id;
	} else if(isset($_POST['action']) && $_POST['action'] == 'search_deployments') {
		$query = "SELECT b.id, b.name, b.defnode, b.budget, b.budremain, b.budtype, b.step, ifnull(b.zoom, 19) \"zoom\", ifnull(b.centerlat, 48.85837) \"centerlat\", ifnull(b.centerlng, 2.294481) \"centerlng\", ifnull(b.type, \"satellite\") \"type\", " .
		"case when TIMESTAMPDIFF(second, b.last_date, sysdate()) > 10 then '-' else (select case when x.name = '' or x.name is null then x.id else x.name end from google_users x where x.id = b.last_used_by) end last_y " .
		"from users_deployments a join deployments b on (a.id_deployments = b.id) where a.id_users=\"" . $_SESSION['user_id'] . "\"";
		$search_deployments = mysqli_query($connection, $query);
		if($search_deployments->num_rows > 0) {
			echo '[';
			while($row = $search_deployments->fetch_assoc()) {
				echo '[' . $row['id']. ',"' . $row['name'] . '",' . $row['defnode'] . ',' . $row['budget'] . ',';
				echo $row['budremain'] . ',"' . $row['budtype'] . '",' . $row['step'] . ', ' . $row['zoom'] . ', ' . $row['centerlat'] . ', ' . $row['centerlng'] . ', "' . $row['type'] . '", "' . $row['last_y'] . '"],';
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
	} else if(isset($_POST['action']) && $_POST['action'] == 'unshare_deployments') {
		for($i = 0; $i < count($_POST['deployments']); ++$i) {
			for($j = 0; $j < count($_POST['users']); ++$j) {
				$query = "select count(*) a from users_deployments where id_users = \"" . $_POST['users'][$j] . "\" and id_deployments = " . $_POST['deployments'][$i];
				$search_count = mysqli_query($connection, $query);
				$count = $search_count->fetch_assoc();
				if($count['a'] > '0') {
					$query = "delete from users_deployments where id_users = \"" . $_POST['users'][$j] . "\" and id_deployments = " . $_POST['deployments'][$i];
					echo $query;
					mysqli_query($connection, $query);
				}
			}
		}
		echo 'OK';
	} else if(isset($_POST['action']) && $_POST['action'] == 'delete_deployments') {
		for($i = 0; $i < count($_POST['deployments']); ++$i) {
			$query = "delete from deployments where id = " . $_POST['deployments'][$i];
			mysqli_query($connection, $query);
			$query = "delete from streams where id_dep = " . $_POST['deployments'][$i];
			mysqli_query($connection, $query);
		}
		echo 'OK';
	} else if(isset($_POST['action']) && $_POST['action'] == 'update_depl') {
		$query = "update deployments set name = '" . $_POST['name'] . "', budget = " . $_POST['budget'] . ", budremain = " . $_POST['remain'] . ", defnode = " . $_POST['type'] . ", budtype = '" . $_POST['budtype'] . "' where id = " . $_POST['id'];
		mysqli_query($connection, $query);
		echo 'OK';
	} else if(isset($_POST['action']) && $_POST['action'] == 'search_info_depl') {
		$query = mysqli_query($connection, "select name, defnode, budtype, budget, budget-budremain budremain from deployments where id = " . $_POST['deployment']);
		if($query->num_rows > 0) {
			while($row = $query->fetch_assoc()) {
				echo '["' . $row['name']. '",' . $row['defnode'] . ',"' . $row['budtype'] . '",' . $row['budget'] . ',' . $row['budremain'] . ']';
			}
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'insert_all') {
		$lat = explode(',', substr($_POST['lat'], 0, -1));
		$lng = explode(',', substr($_POST['lng'], 0, -1));
		$type = explode(',', substr($_POST['type'], 0, -1));
		$gateway = explode(',', substr($_POST['gate'], 0, -1));
		$blocklat = explode(',', substr($_POST['block-lat'], 0, -1));
		$blocklng = explode(',', substr($_POST['block-lng'], 0, -1));
		$streams = explode(',', substr($_POST['streams'], 0, -1));
		$nodes_streams = explode(',', substr($_POST['nodes_streams'], 0, -1));
		for($i = 0; $i < count($blocklat); ++$i) {
			$blocklat[$i] = explode('-', $blocklat[$i]);
		}
		for($i = 0; $i < count($streams); ++$i) {
			$streams[$i] = explode('-', $streams[$i]);
		}
		for($i = 0; $i < count($nodes_streams); ++$i) {
			$nodes_streams[$i] = explode('-', $nodes_streams[$i]);
		}
		$center = explode(',', $_POST['center']);
		$query = "delete from nodes_streams where id_dep = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		$query = "delete from sensors_streams where id_dep = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		$query = "delete from nodes where deployment = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		$query = "delete from streams where id_dep = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		$query = "delete from obstacles where deployment = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		$query = "update deployments set budremain = " . $_POST['budremain'] . ", zoom = " . $_POST['zoom'] . ", type = \"" . $_POST['maptype'] . "\", centerlat = \"" . $center[0] . "\", centerlng = \"" . $center[1] . "\", step = " . $_POST['step'] . " where id = " . $_POST['id-deploy'];
		mysqli_query($connection, $query);
		for($i = 0; $i < count($lat); ++$i) {
			if($lat[$i] != '') {
				$query = "insert into nodes (id, deployment, lat, lng, type_, gateway) values (" . ($i+1) . ", " . $_POST['id-deploy'] . ", \"" . $lat[$i] . "\", \"" . $lng[$i] . "\", " . $type[$i] . ", " . $gateway[$i] . ")";
				mysqli_query($connection, $query);
			}
		}
		for($i = 0; $i < count($blocklat); ++$i) {
			if($blocklat[$i][0] != '') {
				$query = "insert into obstacles (id, deployment, lat, lng, obs) values (" . ($i+1) . ", " . $_POST['id-deploy'] . ", \"" . $blocklat[$i][1] . "\", \"" . $blocklng[$i] . "\", " . $blocklat[$i][0] . ")";
				mysqli_query($connection, $query);
			}
		}
		$deja = '';
		$j = 1;
		for($i = 0; $i < count($streams); ++$i) {
			if($streams[$i][0] != '') {
				if($streams[$i][0] != $deja) {
					$deja = $streams[$i][0];
					$query = "insert into streams (id, id_dep, name) values (" . $j . ", " . $_POST['id-deploy'] . ", \"" . $streams[$i][0] . "\")";
					$j++;
					mysqli_query($connection, $query);
				}
				if($streams[$i][1] != '') {
					$query = "insert into sensors_streams (id_sensor, id_stream, id_dep) values (" . ($streams[$i][1]+1) . ", " . ($j-1) . ", " . $_POST['id-deploy'] . ")";
					mysqli_query($connection, $query);
				}
			}
		}
		for($i = 0; $i < count($nodes_streams); ++$i) {
			if($nodes_streams[$i][0] != '') {
				$query = "insert into nodes_streams (id_stream, id_node, id_dep) values (" . $nodes_streams[$i][1] . ", " . $nodes_streams[$i][0] . ", " . $_POST['id-deploy'] . ")";
				mysqli_query($connection, $query);
			}
		}
		echo 'OK';
	} else if(isset($_POST['action']) && $_POST['action'] == 'load_nodes') {
		$query = mysqli_query($connection, "select a.lat, a.lng, a.type_, a.gateway, b.range_, a.gateway, group_concat(ifnull(c.id_stream, '') order by c.id_stream separator '-') " .
			"streams FROM nodes a join hw_platforms b on (a.type_ = b.id) left join (select id_stream, id_node from nodes_streams where id_dep = " . $_POST['deploy'] . ") c " .
			"on a.id = c.id_node where a.deployment = " . $_POST['deploy'] . " group by a.lat, a.lng, a.type_, a.gateway, b.range_ order by a.id");
		if($query->num_rows > 0) {
			echo '[';
			while($row = $query->fetch_assoc()) {
				echo '[' . $row['lat'] . ',' . $row['lng'] .',' . $row['type_'] . ',' . $row['range_'] . ',' . $row['gateway'] . ',"' . $row['streams'] . '"],';
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
	} else if(isset($_POST['action']) && $_POST['action'] == 'load_sensors') {
		$query = mysqli_query($connection, "select concat('\"', name_eng, '\"'), concat('\"', name_spa, '\"') name_spa from sensors order by id");
		if($query->num_rows > 0) {
			echo '[';
			while($row = $query->fetch_assoc()) {
				echo '[' . implode(',', $row) . '],';
			}
		}
		else {
			echo '[,';	
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'load_streams') {
		$query = mysqli_query($connection, "select concat('\"', a.name, '\"') name, concat('\"', group_concat(ifnull(b.id_sensor-1, 'x') order by b.id_sensor separator '-'), '\"') sensors " .
			"from streams a left join (select id_sensor, id_stream from sensors_streams where id_dep = " . $_POST['deploy'] . ") b " .
			"on (a.id = b.id_stream) where a.id_dep = " . $_POST['deploy'] . " group by a.name order by a.id");
		if($query->num_rows > 0) {
			echo '[';
			while($row = $query->fetch_assoc()) {
				echo '[' . implode(',', $row) . '],';
			}
		}
		else {
			echo '[,';	
		}
	} else if(isset($_POST['action']) && $_POST['action'] == 'update_last_date') {
		$last_used_by = '';
		$last_date = '';
		$query = mysqli_query($connection, "select last_used_by, TIMESTAMPDIFF(second, last_date, sysdate()) last_date from deployments where id = '" . $_POST['id_deploy'] . "'");
		if($query->num_rows > 0) {
			while($row = $query->fetch_assoc()) {
				$last_used_by = $row['last_used_by'];
				$last_date = $row['last_date'];
			}
		}
		if($last_used_by == $_SESSION['user_id'] || (int)$last_date > 10) {
			$query = "update deployments set last_date = sysdate(), last_used_by = '" . $_SESSION['user_id'] . "' where id = '" . $_POST['id_deploy'] . "'";
			if(!mysqli_query($connection, $query)) {
				echo mysqli_error($connection);
			} else {
				echo 'OK';
			}
		} else {
			echo 'Last used by someone different';
		}
	}
	mysqli_close($connection);
?>