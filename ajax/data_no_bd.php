<?php
	//set_time_limit(180);
	session_start();
	if(isset($_POST['action']) && $_POST['action'] == 'curr_conv2') {
		$amount = $_POST['amount'];
		$from = $_POST['from'];
		$to = $_POST['to'];
		$url = 'http://www.x-rates.com/calculator/?from=' . $from . '&to=' . $to . '&amount=' . $amount;
		$ch = curl_init();
		$timeout = 99;
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
		$data = curl_exec($ch);
		if(!curl_errno($ch)){ 
			$get = explode('<span class="ccOutputRslt">', $data);
			$get = $get[1];
			$get = explode('<span', $get);
			echo str_replace(',', '', $get[0]);
		} else {
			echo 'Curl error: ' . curl_error($ch); 
		}
		curl_close($ch);
	} else if(isset($_POST['action']) && $_POST['action'] == 'save_xmls') {
		$query = $_POST['query'];
		$topology = $_POST['topology'];
		$query_parameters = $_POST['query_parameters'];
		$physical_schema = $_POST['physical_schema'];
		$logical_schema = $_POST['logical_schema'];
		$nodes = $_POST['nodes'];
		file_put_contents('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-query.xml', $query);
		file_put_contents('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-topology.xml', $topology);
		file_put_contents('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-query-parameters.xml', $query_parameters);
		file_put_contents('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-physical-schema.xml', $physical_schema);
		file_put_contents('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-logical-schema.xml', $logical_schema);
		file_put_contents('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-nodes.xml', $nodes);
		chmod('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-query.xml', 0777);
		chmod('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-topology.xml', 0777);
		chmod('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-query-parameters.xml', 0777);
		chmod('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-physical-schema.xml', 0777);
		chmod('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-logical-schema.xml', 0777);
		chmod('../XMLs/' . $_SESSION['user_id'] . '_wsn-dd-nodes.xml', 0777);
		//$sortie = shell_exec('../shells/snee_new.sh ' . $_SESSION['user_id']);
		$sortie = exec('../shells/snee_new.sh ' . $_SESSION['user_id']);
		$file = getenv('SNEEROOT') . '/' . $_SESSION['user_id'] . '_output/';
		$file2 = $_SESSION['user_id'] . '_snee_files.rar';
		if(strpos($sortie, '*O*K*') !== false && file_exists($file . $file2)) {
			if(!copy($file . $file2, '../downloads/' . $file2) ||
				!copy($file . 'query1/query-plan/query1-DAF-1.png', '../downloads/' . $_SESSION['user_id'] . '_query1-DAF-1.png') ||
				!copy($file . 'query1/query-plan/query1-DLAF-1.png', '../downloads/' . $_SESSION['user_id'] . '_query1-DLAF-1.png') ||
				!copy($file . 'query1/query-plan/query1-LAF-1.png', '../downloads/' . $_SESSION['user_id'] . '_query1-LAF-1.png') ||
				!copy($file . 'query1/query-plan/query1-LAF\'-1.png', '../downloads/' . $_SESSION['user_id'] . '_query1-LAF\'-1.png') ||
				!copy($file . 'query1/query-plan/query1-PAF-1.png', '../downloads/' . $_SESSION['user_id'] . '_query1-PAF-1.png') ||
				!copy($file . 'query1/query-plan/query1-RT-1.png', '../downloads/' . $_SESSION['user_id'] . '_query1-RT-1.png')) {
				echo "error!";
			} else {
				$sortie2 = shell_exec('../shells/snee_2.sh ' . $_SESSION['user_id']);
				$fp = fopen('../downloads/' . $_SESSION['user_id'] . '_images.html', 'w');
				fwrite($fp, '<!DOCTYPE html><html><head><title>Wireless Sensor Network Deployment Design</title>');
				fwrite($fp, '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><link rel="icon" href="../images/favicon/favicon.ico" />');
				fwrite($fp, '<style>img { float: left; }</style>');
				fwrite($fp, '</head><body><img src="' . $_SESSION['user_id'] . '_query1-LAF-1.png" /><img src="' . $_SESSION['user_id'] . '_query1-LAF\'-1.png" />');
				fwrite($fp, '<img src="' . $_SESSION['user_id'] . '_query1-PAF-1.png" /><p style="clear: both;" /><img src="' . $_SESSION['user_id'] . '_query1-RT-1.png" />');
				fwrite($fp, '<img src="' . $_SESSION['user_id'] . '_query1-DAF-1.png" /><img src="' . $_SESSION['user_id'] . '_query1-DLAF-1.png" />');
				fwrite($fp, '</body></html>');
				fclose($fp);
			}
		}
		echo strpos($sortie, '*O*K*') !== false ? '*O*K*' . $_SESSION['user_id'] : $sortie;
	}
?>
