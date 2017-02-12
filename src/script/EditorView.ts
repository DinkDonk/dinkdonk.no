import Tabs from './Tabs';
import Editor from './Editor';
import * as ts from 'typescript';
import TabsEventEmitter from './TabsEventEmitter';

export default class EditorView {
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
		this.initscriptEditor();
		this.initstyleEditor();
		this.initmarkupEditor();

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

	private initscriptEditor():void {
		this.scriptEditor = new Editor('script-editor', 'typescript');

		this.scriptEditor.on('change', (event:any) => {
			console.log('Script changed!');

			let transpileOutput:ts.TranspileOutput = ts.transpileModule(this.scriptEditor.value, {
				compilerOptions: {
					target: ts.ScriptTarget.ES5,
					module: ts.ModuleKind.CommonJS
				}
			});

			this.lastGoodScriptEditorValue = transpileOutput.outputText;

			this.render();
		});

		this.scriptEditor.value = `// This is a comment. It is a nice comment. Comments are awesome
const A_NUMBER:Number = 1234;

let aString:string = 'Hello Sailor!';
let aBoolean:boolean = true;
let anObject:object = {
	property: 'I am a string value'
};

function aFunction(request, result, callback) {
	if (request.code !== 0) {
		console.log(anObject.property, Date.now());
	} else {
		callback();
	}
}`;

	}

	private initstyleEditor():void {
		this.styleEditor = new Editor('style-editor', 'css');

		this.styleEditor.value = `body {
	padding: 30px;
	color: #303840;
}`;

		this.styleEditor.on('changeLinting', (event:any) => {
			console.log('Style changed!');

			let annotations:Array<any> = this.styleEditor.annotations;

			if (annotations.length < 1) {
				this.lastGoodStyleEditorValue = this.styleEditor.value;

				this.render();
			}
		});
	}

	private initmarkupEditor():void {
		this.markupEditor = new Editor('markup-editor', 'html');

		this.markupEditor.value = `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, user-scalable=no">

	<link rel="stylesheet" type="text/css" href="/app.css">
</head>
<body>
	<h1>Hello, Sailor!</h1>
</body>
</html>`;

		this.markupEditor.on('changeLinting', (event:any) => {
			console.log('Markup changed!');

			let annotations:Array<any> = this.styleEditor.annotations;
			let l:number = annotations.length;
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
		console.log('Rendering');

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
}