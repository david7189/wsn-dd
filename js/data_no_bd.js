function initialize() {
	jQuery('#download_src').click(function() {
	  jQuery('.download_snee').each(function() {
		jQuery(this).remove();
	  });
	  var a = document.createElement('a');
	  a.className = 'download_snee';
	  a.href = '../downloads/snee_files.tar.gz';
	  a.download = 'snee_files.tar.gz';
	  jQuery(document.body).append(a);
	  jQuery(a)[0].click();
	});
}

jQuery(document).ready(function() {
	initialize();
});

//2954
