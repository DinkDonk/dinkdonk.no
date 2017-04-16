import * as ts from 'typescript';
import Editor from './Editor';
import RemoteFileReader from './RemoteFileReader';
import RouterEventEmitter from './RouterEventEmitter';
import Router from './Router';
import {Route} from './routes';
import Tabs from './Tabs';
import TabsEventEmitter from './TabsEventEmitter';

class EditorView {
	private scriptEditor:Editor;
	private styleEditor:Editor;
	private markupEditor:Editor;
	private lastGoodScriptEditorValue:string;
	private lastGoodStyleEditorValue:string;
	private lastGoodMarkupEditorValue:string;
	private outputDocument:HTMLDocument;

	constructor() {
		this.outputDocument = (document.getElementById('output') as HTMLIFrameElement).contentWindow.document;

		// Create editors
		this.initScriptEditor();
		this.initStyleEditor();
		this.initMarkupEditor();

		// Load default project
		this.loadProject('./projects/' + Router.instance.currentRoute[1]);

		// Listen for project URLs
		RouterEventEmitter.instance.on('route', (route:string[]) => {
			this.loadProject('./projects/' + route[1]);
		});

		TabsEventEmitter.instance.on('selected', (tabContentId:string) => {
			if (/script/.test(tabContentId)) {
				this.scriptEditor.focus();
			}

			if (/style/.test(tabContentId)) {
				this.styleEditor.focus();
			}

			if (/markup/.test(tabContentId)) {
				this.markupEditor.focus();
			}
		});

		// Create tabs
		new Tabs();
	}

	private initScriptEditor():void {
		this.scriptEditor = new Editor('script-editor', 'typescript');

		this.scriptEditor.on('change', (event:any) => {
			const transpileOutput:ts.TranspileOutput = ts.transpileModule(this.scriptEditor.value, {
				compilerOptions: {
					module: ts.ModuleKind.ES2015,
					target: ts.ScriptTarget.ES5
				}
			});

			this.lastGoodScriptEditorValue = transpileOutput.outputText;

			this.render();
		});
	}

	private initStyleEditor():void {
		this.styleEditor = new Editor('style-editor', 'css');

		this.styleEditor.on('changeLinting', (event:any) => {
			const annotations:any[] = this.styleEditor.annotations;

			if (annotations.length < 1) {
				this.lastGoodStyleEditorValue = this.styleEditor.value;

				this.render();
			}
		});
	}

	private initMarkupEditor():void {
		this.markupEditor = new Editor('markup-editor', 'html');

		this.markupEditor.on('changeLinting', (event:any) => {
			const annotations:any[] = this.markupEditor.annotations;
			const l:number = annotations.length;
			let i:number = l;

			while (i--) {
				if (/doctype first\. Expected/.test(annotations[i].text)) {
					annotations.splice(i, 1);
				}
			}

			if (l > annotations.length) {
				this.markupEditor.annotations = annotations;
			}

			if (annotations.length < 1) {
				this.lastGoodMarkupEditorValue = this.markupEditor.value;

				this.render();
			}
		});
	}

	private render():void {
		let output:string = this.lastGoodMarkupEditorValue;

		if (!output) {
			return;
		}

		if (this.lastGoodStyleEditorValue) {
			output = output.replace('</head>', '<style>' + this.lastGoodStyleEditorValue + '</style></head>');
		}

		if (this.lastGoodScriptEditorValue) {
			output = output.replace('</body>', '<script>' + this.lastGoodScriptEditorValue + '</script></body>');
		}

		this.outputDocument.open();
		this.outputDocument.write(output);
		this.outputDocument.close();
	}

	private loadProject(path:string):void {
		this.lastGoodScriptEditorValue = null;
		this.lastGoodStyleEditorValue = null;
		this.lastGoodMarkupEditorValue = null;

		RemoteFileReader.read(path + '/script.ts').then((data) => {
			this.scriptEditor.value = data;
			this.scriptEditor.editor.session.setScrollTop(0);
		});

		RemoteFileReader.read(path + '/style.css').then((data) => {
			this.styleEditor.value = data;
			this.scriptEditor.editor.session.setScrollTop(0);
		});

		RemoteFileReader.read(path + '/markup.html').then((data) => {
			this.markupEditor.value = data;
			this.scriptEditor.editor.session.setScrollTop(0);
		});
	}
}

export = new EditorView();