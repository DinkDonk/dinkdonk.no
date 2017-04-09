#!/bin/sh

BROWSERIFY=node_modules/browserify/bin/cmd.js

node $BROWSERIFY src/script/App.ts -p [tsify --noImplicitAny --isolatedModules=true] > build/app.js
node $BROWSERIFY src/script/EditorView.ts --standalone EditorView -p [tsify --noImplicitAny --isolatedModules=true] > build/EditorView.js