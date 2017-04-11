import LazyLoader from './LazyLoader';
import Logo from './Logo';

/* tslint:disable:no-var-requires */
// ES2015 Promise polyfill
require('es6-promise').polyfill();
/* tslint:enable:no-var-requires */

class App {
	private introDuration:number = 8000; // 8000

	constructor() {
		new Logo();

		const loadStarted:number = Date.now();

		LazyLoader.load('./EditorView').then(() => {
			const timeSinceLoadStarted:number = Date.now() - loadStarted;
			const timeLeftOnIntroDuration:number = this.introDuration - timeSinceLoadStarted;

			if (timeLeftOnIntroDuration > 0) {
				setTimeout(this.initEditorView, timeLeftOnIntroDuration);
			} else {
				this.initEditorView();
			}
		});
	}

	private initEditorView():void {
		document.querySelector('.app').classList.remove('hidden');
		document.querySelector('.loader').classList.add('hidden');
	}
}

export = new App();