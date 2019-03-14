import RouterEventEmitter from './RouterEventEmitter';
import {Route} from './routes';
import routes from './routes';

export default class Router {
	private static _instance:Router;
	public currentRoute:string[];

	private constructor() {
		this.goto(window.location.hash);

		window.addEventListener('popstate', (event:PopStateEvent) => {
			this.goto(window.location.hash, false);
		});

		window.addEventListener('message', (event:MessageEvent) => {
			this.goto(event.data.route);
		});
	}

	public goto(path:string, doPushState:boolean = true, options:any = {}):void {
		if (!path) {
			path = '#/welcome';
		}

		// Clean path of all protocols, domain and ports
		path = path.replace(/https?:\/\/.+?\//, '');

		const route:Route = routes.filter((value:Route) => {
			if (value.path === path) {
				return true;
			}

			const match:RegExpExecArray = new RegExp(value.path, 'i').exec(path);

			if (match && match.length > 1) {
				return true;
			}

			return false;
		})[0];

		if (route) {
			this.currentRoute = path.split('/');

			if (doPushState) {
				window.history.pushState(options, null, path);
			}

			RouterEventEmitter.instance.emit('route', this.currentRoute);
		} else {
			console.error(new Error('Route not found'));
		}
	}

	public static get instance():Router {
		return this._instance || (this._instance = new this());
	}
}