export default class RemoteFileReader {
	public static async read(url:string) {
		const request = new XMLHttpRequest();

		return new Promise<string>((resolve, reject) => {
			request.addEventListener('load', (event:ProgressEvent) => {
				resolve(request.response);
			});

			request.addEventListener('error', (event:ErrorEvent) => {
				reject(new Error(event.error));
			});

			request.open('GET', url);
			request.send();
		});
	}
}