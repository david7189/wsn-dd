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
		$id_usuario = 'x' . $_SESSION['user_id'];
		file_put_contents('../XMLs/' . $id_usuario . '_wsn-dd-query.xml', $query);
		file_put_contents('../XMLs/' . $id_usuario . '_wsn-dd-topology.xml', $topology);
		file_put_contents('../XMLs/' . $id_usuario . '_wsn-dd-query-parameters.xml', $query_parameters);
		file_put_contents('../XMLs/' . $id_usuario . '_wsn-dd-physical-schema.xml', $physical_schema);
		file_put_contents('../XMLs/' . $id_usuario . '_wsn-dd-logical-schema.xml', $logical_schema);
		file_put_contents('../XMLs/' . $id_usuario . '_wsn-dd-nodes.xml', $nodes);
		chmod('../XMLs/' . $id_usuario . '_wsn-dd-query.xml', 0777);
		chmod('../XMLs/' . $id_usuario . '_wsn-dd-topology.xml', 0777);
		chmod('../XMLs/' . $id_usuario . '_wsn-dd-query-parameters.xml', 0777);
		chmod('../XMLs/' . $id_usuario . '_wsn-dd-physical-schema.xml', 0777);
		chmod('../XMLs/' . $id_usuario . '_wsn-dd-logical-schema.xml', 0777);
		chmod('../XMLs/' . $id_usuario . '_wsn-dd-nodes.xml', 0777);
		#putenv('SNEEROOT=XXXX');
		putenv('CLASSPATH=' . getenv('SNEEROOT') . ':' . getenv('SNEEROOT') . '/lib/antlr-2.7.5.jar:' . getenv('SNEEROOT') . '/lib/aopalliance-1.0.jar:' . getenv('SNEEROOT') . '/lib/asm-2.2.3.jar:' . getenv('SNEEROOT') . '/lib/commons-lang-2.4.jar:' . getenv('SNEEROOT') . '/lib/commons-logging-1.1.1.jar:' . getenv('SNEEROOT') . '/lib/cxf-api-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-common-schemas-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-common-utilities-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-bindings-soap-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-bindings-xml-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-core-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-databinding-jaxb-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-frontend-jaxws-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-frontend-simple-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-transports-http-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-ws-addr-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-tools-common-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/data-source-core-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/data-source-pull-stream-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/data-source-wsdair-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/geronimo-activation_1.1_spec-1.0.2.jar:' . getenv('SNEEROOT') . '/lib/geronimo-annotation_1.0_spec-1.1.1.jar:' . getenv('SNEEROOT') . '/lib/geronimo-javamail_1.4_spec-1.6.jar:' . getenv('SNEEROOT') . '/lib/geronimo-jaxws_2.1_spec-1.0.jar:' . getenv('SNEEROOT') . '/lib/geronimo-stax-api_1.0_spec-1.0.1.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-frontend-simple-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-transports-http-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-rt-ws-addr-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/cxf-tools-common-2.2.8.jar:' . getenv('SNEEROOT') . '/lib/data-source-core-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/data-source-pull-stream-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/data-source-wsdair-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/geronimo-activation_1.1_spec-1.0.2.jar:' . getenv('SNEEROOT') . '/lib/geronimo-annotation_1.0_spec-1.1.1.jar:' . getenv('SNEEROOT') . '/lib/geronimo-javamail_1.4_spec-1.6.jar:' . getenv('SNEEROOT') . '/lib/geronimo-jaxws_2.1_spec-1.0.jar:' . getenv('SNEEROOT') . '/lib/geronimo-stax-api_1.0_spec-1.0.1.jar:' . getenv('SNEEROOT') . '/lib/geronimo-ws-metadata_2.0_spec-1.1.2.jar:' . getenv('SNEEROOT') . '/lib/jaxb-api-2.1.jar:' . getenv('SNEEROOT') . '/lib/jaxb-impl-2.1.12.jar:' . getenv('SNEEROOT') . '/lib/log4j-1.2.12.jar:' . getenv('SNEEROOT') . '/lib/neethi-2.0.4.jar:' . getenv('SNEEROOT') . '/lib/saaj-api-1.3.jar:' . getenv('SNEEROOT') . '/lib/saaj-impl-1.3.2.jar:' . getenv('SNEEROOT') . '/lib/sds-wsdl-0.1.1.jar:' . getenv('SNEEROOT') . '/lib/snee-api-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/snee-compiler-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/snee-core-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/snee-sncb-1.6.4-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/spring-beans-2.5.6.jar:' . getenv('SNEEROOT') . '/lib/spring-context-2.5.6.jar:' . getenv('SNEEROOT') . '/lib/spring-core-2.5.6.jar:' . getenv('SNEEROOT') . '/lib/spring-web-2.5.6.jar:' . getenv('SNEEROOT') . '/lib/tinyos-2.1.jar:' . getenv('SNEEROOT') . '/lib/:' . getenv('SNEEROOT') . '/lib/wsdair-wsdl-0.0.1-SNAPSHOT.jar:' . getenv('SNEEROOT') . '/lib/wsdl4j-1.6.2.jar:' . getenv('SNEEROOT') . '/lib/wstx-asl-3.2.9.jar:' . getenv('SNEEROOT') . '/lib/xml-resolver-1.2.jar:' . getenv('SNEEROOT') . '/lib/XmlSchema-1.4.5.jar:.');
		//$sortie = shell_exec('../shells/snee_new.sh ' . $id_usuario);
		$sortie = exec('../shells/snee_new.sh ' . $id_usuario);
		//echo getenv('CLASSPATH');
		$file = getenv('SNEEROOT') . '/' . $id_usuario . '_output/';
		$file2 = $id_usuario . '_snee_files.tar.gz';
		if(strpos($sortie, '*O*K*') !== false && file_exists($file . $file2)) {
			if(!copy($file . $file2, '../downloads/snee_files.tar.gz') ||
				!copy($file . 'query1/query-plan/query1-DAF-1.png', '../downloads/' . $id_usuario . '_query1-DAF-1.png') ||
				!copy($file . 'query1/query-plan/query1-DLAF-1.png', '../downloads/' . $id_usuario . '_query1-DLAF-1.png') ||
				!copy($file . 'query1/query-plan/query1-LAF-1.png', '../downloads/' . $id_usuario . '_query1-LAF-1.png') ||
				!copy($file . 'query1/query-plan/query1-LAF\'-1.png', '../downloads/' . $id_usuario . '_query1-LAF\'-1.png') ||
				!copy($file . 'query1/query-plan/query1-PAF-1.png', '../downloads/' . $id_usuario . '_query1-PAF-1.png') ||
				!copy($file . 'query1/query-plan/query1-RT-1.png', '../downloads/' . $id_usuario . '_query1-RT-1.png') ||
				!copy($file . 'query1/query-plan/query1-Agenda-32.png', '../downloads/' . $id_usuario . '_query1-Agenda.png') ||
				!copy($file . 'query1/qos-metrics.json', '../downloads/' . $id_usuario . '_qos-metrics.json')) {
				echo "error!";
			} else {
				$sortie2 = shell_exec('../shells/snee_2.sh ' . $id_usuario);
				$json = file_get_contents('../downloads/' . $id_usuario . '_qos-metrics.json');
				$data = json_decode($json);
				$json_dscr = ['Acquisition interval (ms):', 'Buffering factor:', 'Delivery time (ms):', 'Total energy consumption (J):', 'Lifetime (days):'];
				$i = 0;
				$fp = fopen('../downloads/' . $id_usuario . '_images.html', 'w');
				$query = file_get_contents(getenv('SNEEROOT') . '/etc/' . $id_usuario . '_wsn-dd-query.xml');
				fwrite($fp, '<!DOCTYPE html>
				<html>
					<head>
					<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
					<script type="text/javascript" src="../js/data_no_bd.js"></script>
					<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"> 
					<title>Wireless Sensor Network Deployment Design</title>
					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
					<link rel="icon" href="../images/favicon/favicon.ico" />
					<style>
					  #cuerpo {
						background-color: #CCFF99;
					  }
					  #tabla_img {
						border-radius: 4px;
						margin: auto;
						width: 50%;
						border: 1px solid #AAAAAA;
						padding: 10px;
						background-color: #FFFFFF;
						width: 1000px;
						text-align: center;
					  }
					  #tabla_img td {
						text-align: center;
						padding: 10px;
					  }
					  #tabla_img span {
						font-family: Verdana,Arial,sans-serif;
						font-size: 14px;
						font-weight: bold;
						line-height: 10px;
					  }
					  #tabla_img div {
						margin: auto;
					  }
					  #tabla_img img {
						margin: auto;
					  }
					  #tabla_img .txt_normal {
						font-weight: normal;
					  }
					  #tabla_img .codigo {
						font-family: Unicode;
					  }
					  .boton {
						box-shadow: inset -1px -1px 8px #a8a8a8;
						background-color: #dcdcdc;
						margin: 0;
						text-shadow: none;
						font-family: Roboto;
						font-size: 15px;
						font-weight: 400;
						border: 2px solid #3f3f3f;
						width: 240px;
						text-align: center;
						height: 30px;
						line-height: 30px;
						border-radius: 8px;
						padding: 0 11px 0 13px;
						cursor: pointer;
						color: #3f3f3f;
						}
					  </style>
					</head>
					<body id="cuerpo">
					  <table id="tabla_img">
						<tr>
						  <td colspan="2">
							<div class="boton" id="download_src">DOWNLOAD SOURCE CODE</div>
						  </td>
						</tr>
					    <tr>
						  <td colspan="2">
							<span>SQL QUERY:</span>
						  </td>
						</tr>
						<tr>
						  <td colspan="2">
							<span class="txt_normal codigo">' . $query . '</span>
						  </td>
						</tr>
					    <tr>
						  <td colspan="2">
							<span>QoS PARAMETERS:</span>
						  </td>
						</tr>');
			    foreach ($data as $stand) {
				  fwrite($fp, '<tr>
						  <td><span class="txt_normal">' . $json_dscr[$i] . '</span></td>
						  <td><span class="txt_normal">' . ($i == 4 ? round($stand, 1) : round($stand)) . '</span></td>
					    <tr>');
				  $i++;
				}
				fwrite($fp, '<tr>
						  <td colspan="2">
							<span>LOGICAL ALGEBRAIC FORM (AFTER TRANSLATION):</span>
						  </td>
						</tr>
					    <tr>
						  <td colspan="2">
							<img src="' . $id_usuario . '_query1-LAF-1.png" />
						  </td>
						</tr>
						<tr>
						  <td colspan="2">
							<span>LOGICAL ALGEBRAIC FORM (AFTER REWRITING):</span>
						  </td>
						<tr>
						  <td colspan="2">
							<img src="' . $id_usuario . '_query1-LAF\'-1.png" />
						  </td>
						</tr>
						<tr>
						  <td colspan="2">
							<span>PHYSICAL ALGEBRAIC FORM:</span>
						  </td>
						<tr>
						<tr>
						  <td colspan="2">
							<img src="' . $id_usuario . '_query1-PAF-1.png" />
						  </td>
						</tr>
						<tr>
						  <td colspan="2">
							<span>DISTRIBUTED LOGICAL ALGEBRAIC FORM:</span>
						  </td>
						<tr>
						<tr>
						  <td colspan="2">
							<img src="' . $id_usuario . '_query1-DLAF-1.png" />
						  </td>
						</tr>
						<tr>
						  <td colspan="2">
							<span>ROUTING TREE:</span>
						  </td>
						<tr>
						<tr>
						  <td colspan="2">
							<img src="' . $id_usuario . '_query1-RT-1.png" />
						  </td>
						</tr>
						<tr>
						  <td colspan="2">
							<span>DISTRIBUTED ALGEBRAIC FORM:</span>
						  </td>
						<tr>
						<tr>
						  <td colspan="2">
							<img src="' . $id_usuario . '_query1-DAF-1.png" />
						  </td>
						</tr>
						<tr>
						  <td colspan="2">
							<span>AGENDA:</span>
						  </td>
						<tr>
						<tr>
						  <td colspan="2">
							<img src="' . $id_usuario . '_query1-Agenda.png" />
						  </td>
						</tr>
					  </table>
					</body>
				</html>');
				fclose($fp);
			}
		}
		echo strpos($sortie, '*O*K*') !== false ? '*O*K*' . $id_usuario : $sortie;
	}
?>
