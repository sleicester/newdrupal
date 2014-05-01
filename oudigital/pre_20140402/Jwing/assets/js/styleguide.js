
function sg_update(loadedSection) {
	$('#loaded-components').val(loadedSection);

	switch (loadedSection) {
		case 'Cookies bar':
            OUApp.Modules.cookiesbar.removeCookie();
            OUApp.init();
            break;
		default:
			OUApp.init();
	}
    
}

function sg_resized () {
	//console.log(ou_utils.getMQ());
}