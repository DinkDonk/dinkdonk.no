import EditorView from './EditorView';

declare var loadStarted:number; // Set in the head of the HTML document

class App {
	private introDuration:number = 0;

	constructor() {
		// Create editor view
		new EditorView();

		// Wait for loader to complete before fading in editor view
		function onLoadComplete() {
			document.querySelector('.app').classList.remove('hidden');
			document.querySelector('.loader').classList.add('hidden');
		}

		window.addEventListener('load', (event:Event) => {
			let timeSinceLoadStarted:number = Date.now() - loadStarted;
			let timeLeftOnIntroDuration:number = this.introDuration - timeSinceLoadStarted;

			if (timeLeftOnIntroDuration > 0) {
				setTimeout(onLoadComplete, timeLeftOnIntroDuration);
			} else {
				onLoadComplete();
			}
		});
	}
}

export = new App();