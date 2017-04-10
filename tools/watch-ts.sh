#!/bin/sh

WHATCHIFY=node_modules/watchify/bin/cmd.js

node $WHATCHIFY src/script/App.ts -p [tsify --noImplicitAny] -o build/app.js &
node $WHATCHIFY src/script/EditorView.ts -p [tsify --noImplicitAny] -o build/EditorView.js