import Client = require('./Client');
import LazyLoader from './LazyLoader';
import Logo from './Logo';

/* tslint:disable:no-var-requires */
// ES2015 Promise polyfill
require('es6-promise').polyfill();
/* tslint:enable:no-var-requires */

class App {
	private introDuration:number = 0; //8000;

	constructor() {
		new Logo();

		const loadStarted:number = Date.now();

		if (!Client.isMobileDevice()) {
			LazyLoader.load('./EditorView').then(() => {
				const timeSinceLoadStarted:number = Date.now() - loadStarted;
				const timeLeftOnIntroDuration:number = this.introDuration - timeSinceLoadStarted;

				if (timeLeftOnIntroDuration > 0) {
					setTimeout(this.initEditorView, timeLeftOnIntroDuration);
				} else {
					this.initEditorView();
				}
			});
		} else {
			setTimeout(() => {
				this.initMobileView();
			}, 4000);
		}
	}

	private initEditorView():void {
		document.querySelector('.app').classList.remove('hidden');
		document.querySelector('.loader').classList.add('hidden');
	}

	private initMobileView():void {
		document.querySelector('.visible-mobile').classList.remove('hidden');
	}
}

export = new App();