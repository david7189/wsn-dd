<?php
	set_time_limit(180);
	if(isset($_POST['action']) && $_POST['action'] == 'curr_conv') {
		$amount = $_POST['amount'];
		$from = $_POST['from'];
		$to = $_POST['to'];
		$url = 'http://www.x-rates.com/calculator/?from=' . $from . '&to=' . $to . '&amount=' . $amount;
		$get = explode('<span class="ccOutputRslt">', file_get_contents($url))[1];
		echo str_replace(',', '', explode('<span', $get)[0]);
		if(isset($_POST['it'])) echo ', ' . $_POST['it'];
	}
?>