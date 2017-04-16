import EventEmitter = require('events');

export default class RouterEventEmitter extends EventEmitter {
	private static _instance:RouterEventEmitter;

	private constructor() {
		super();
	}

	public static get instance():RouterEventEmitter {
		return this._instance || (this._instance = new this());
	}
}