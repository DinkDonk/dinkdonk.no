#!/usr/bin/env node

const crypto = require('crypto')
const fs = require('fs')
const replace = require('replace-in-file');

function md5File(path) {
	return new Promise((resolve, reject) => {
		const output = crypto.createHash('md5')
		const input = fs.createReadStream(path)

		input.on('error', (err) => {
			reject(err)
		})

		output.once('readable', () => {
			resolve(output.read().toString('hex'))
		})

		input.pipe(output)
	})
}

async function main() {
	const cssMd5 = await md5File('build/app.css');
	const jsMdf = await md5File('build/app.js');

	const cssOptions = {
		files: 'build/index.html',
		from: /app.css"/,
		to: `app.css?v=${cssMd5}"`
	};

	const jsOptions = {
		files: 'build/index.html',
		from: /app.js"/,
		to: `app.js?v=${jsMdf}"`
	};

	try {
		await replace(cssOptions);
		console.log('Cache busted CSS');
	} catch (error) {
		console.error('Error occurred:', error);

		process.exit(1);
	}

	try {
		await replace(jsOptions);
		console.log('Cache busted JS');
	} catch (error) {
		console.error('Error occurred:', error);

		process.exit(1);
	}
}

main();
