#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const builder = require('xmlbuilder');
const domain = require('../package.json').domain;
const projetcsPath = 'src/projects/';

const projects = fs.readdirSync(projetcsPath).filter((file) => fs.statSync(path.join(projetcsPath, file)).isDirectory());

let sitemap = builder.create('root', {encoding: 'UTF-8'})
	.ele('urlset', {'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9'});

for (const project of projects) {
	sitemap
		.ele('url')
		.ele('loc', 'http://' + domain + '/#/' + project).up()
		.ele('lastmod', new Date().toISOString()).up()
		.ele('changefreq', 'monthly').up()
		.up();
}

sitemap.end({
	pretty: true
});

fs.ensureDirSync('build');

fs.writeFileSync('build/sitemap.xml', sitemap.toString().replace(/  /g, '\t'));