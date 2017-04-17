function isMobileDevice() {
		return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
	}

export = {
	isMobileDevice: isMobileDevice
};