import * as ace from 'brace';
import 'brace/mode/css';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import '../../build/dinkdonk-scheme';
import EventEmitter = require('events');

type editorModes = 'javascript' | 'typescript' | 'css' | 'html';
type editorEvents = 'change' | 'changeLinting';

export default class Editor {
	public editor:ace.Editor;
	private eventEmitter:EventEmitter = new EventEmitter();

	constructor(elementId:string, mode:editorModes) {
		this.editor = ace.edit(elementId);
		this.editor.setOptions({
			showPrintMargin: false
		});
		this.editor.setTheme('ace/theme/dinkdonk');

		const session:ace.IEditSession = this.editor.getSession();
		session.setUseWrapMode(true);
		session.setWrapLimitRange(null, null);

		switch (mode) {
			case 'javascript':
				session.setMode('ace/mode/javascript');
				break;
			case 'typescript':
				session.setMode('ace/mode/typescript');
				break;
			case 'css':
				session.setMode('ace/mode/css');
				break;
			case 'html':
				session.setMode('ace/mode/html');
				break;
		}

		this.editor.on('change', (event) => {
			this.eventEmitter.emit('change', event);
		});

		this.editor.getSession().on('changeAnnotation', (event) => {
			this.eventEmitter.emit('changeLinting', event);
		});
	}

	public get value():string {
		return this.editor.getValue();
	}

	public set value(value:string) {
		this.editor.setValue(value);
		this.editor.clearSelection();
	}

	public get annotations():any[] {
		return this.editor.getSession().getAnnotations() || [];
	}

	public set annotations(annotations:any[]) {
		this.editor.getSession().setAnnotations(annotations);
	}

	public focus():void {
		this.editor.focus();
	}

	public on(event:editorEvents, listener:(event:any) => void):void {
		this.eventEmitter.addListener(event, listener);
	}

	public off(event:editorEvents, listener:(event:any) => void):void {
		this.eventEmitter.removeListener(event, listener);
	}
}