<?php
	if(isset($_POST['action']) && $_POST['action'] == 'curr_conv') {
		$amount = $_POST['amount'];
		$from = $_POST['from'];
		$to = $_POST['to'];
		$url = 'https://www.google.com/finance/converter?a=' . $amount . '&from=' . $from . '&to=' . $to;
		$get = file_get_contents($url);
		$get = explode('<span class=bld>', $get);
		$get = explode('</span>', $get[1]);
		$converted_amount = preg_replace("/[^0-9\.]/", null, $get[0]);
		echo $converted_amount;
		if(isset($_POST['it'])) echo ', ' . $_POST['it'];
	}
?>