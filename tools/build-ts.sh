#!/bin/sh

BROWSERIFY=node_modules/browserify/bin/cmd.js
UGLIFY=node_modules/uglify-js/bin/uglifyjs

node $BROWSERIFY src/script/App.ts -p [tsify --noImplicitAny] | $UGLIFY --mangle --compress warnings=false > build/app.js
node $BROWSERIFY src/script/EditorView.ts -p [tsify --noImplicitAny] | $UGLIFY --mangle --compress warnings=false > build/EditorView.js