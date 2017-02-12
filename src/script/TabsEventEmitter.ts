import EventEmitter = require('events');

export default class TabsEventEmitter extends EventEmitter {
	private static _instance:TabsEventEmitter;

	private constructor() {
		super();
	}

	public static get instance() {
		return this._instance || (this._instance = new this());
	}
}