#!/usr/bin/env node

const fs = require('fs');
const replace = require('replace-in-file');

let fileToChange = process.argv[2];
let replaceRegexp = process.argv[3];
let fileToInject = process.argv[4];

if (process.argv.length < 5) {
	console.error('Missing arguments. Example: $ node replace-in-file.js path/to/file /regexp/g path/to/file');

	process.exit(1);
}

const options = {
	files: fileToChange,
	replace: new RegExp(replaceRegexp),
	with: String(fs.readFileSync(fileToInject)).replace(/\n/g, '\\\n')
};

replace(options)
.then(changedFiles => {
	console.log('Modified files:', changedFiles.join(', '));

	process.exit();
})
.catch(error => {
	console.error('Error occurred:', error);

	process.exit(1);
});