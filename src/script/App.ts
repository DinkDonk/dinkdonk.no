import Logo from './Logo';
import LazyLoader from './LazyLoader';

class App {
	private introDuration:number = 8000;

	constructor() {
		new Logo();

		let loadStarted:number = Date.now();

		LazyLoader.load('./EditorView').then(() => {
			let timeSinceLoadStarted:number = Date.now() - loadStarted;
			let timeLeftOnIntroDuration:number = this.introDuration - timeSinceLoadStarted;

			if (timeLeftOnIntroDuration > 0) {
				setTimeout(this.initEditorView, timeLeftOnIntroDuration);
			} else {
				this.initEditorView();
			}
		});
	}

	private initEditorView() {
		document.querySelector('.app').classList.remove('hidden');
		document.querySelector('.loader').classList.add('hidden');
	}
}

export = new App();