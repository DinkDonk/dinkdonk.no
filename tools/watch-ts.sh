#!/bin/sh

WHATCHIFY=node_modules/watchify/bin/cmd.js

node $WHATCHIFY src/script/App.ts -p [tsify --noImplicitAny --isolatedModules=true] -o build/app.js &
node $WHATCHIFY src/script/EditorView.ts --standalone EditorView -p [tsify --noImplicitAny --isolatedModules=true] -o build/EditorView.js