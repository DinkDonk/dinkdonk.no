export default class LazyLoader {
	public static async load(path:string) {
		if (path.substr(-3).toLowerCase() !== '.js') {
			path += '.js';
		}

		await new Promise((resolve, reject) => {
			let scriptElement:HTMLScriptElement = document.createElement('script');
			scriptElement.src = path;

			scriptElement.addEventListener('load', () => {
				console.log('Loaded!');

				resolve();
			});

			document.body.appendChild(scriptElement);
		});
	}
}