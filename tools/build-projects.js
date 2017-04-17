#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const projetcsPath = 'src/projects/';

const projects = fs.readdirSync(projetcsPath).filter((file) => fs.statSync(path.join(projetcsPath, file)).isDirectory());

const markupInject =
`
	<footer>
		<h3>Looking for help on your next project?</h3>

		<p>
			Call me at <a href="phone:+47 976 17 050">+47 976 17 050</a><br>
			shoot me an e-mail at <a href="mailto:rune@dinkdonk.no">rune@dinkdonk.no</a><br>
			or hook up on <a href="https://www.linkedin.com/in/rune-warhuus-59b64989/" target="_blank">LinkedIn</a>
		</p>
	</footer>

	<script>
		var siteAnchors = document.querySelectorAll('a[href^="#"]');

		for (var i = 0, l = siteAnchors.length; i < l; i++) {
			siteAnchors[i].addEventListener('click', function (event) {
				event.preventDefault();

				parent.postMessage({
					type: 'goto',
					route: event.target.href
				}, '*');
			});
		}
	</script>
`;

for (const project of projects) {
	fs.copySync(projetcsPath + project, 'build/projects/' + project, {
		overwrite: true
	});

	let markup = fs.readFileSync('build/projects/' + project + '/markup.html', 'utf8');

	markup = markup.replace('</body>', markupInject + '</body>');

	fs.writeFileSync('build/projects/' + project + '/markup.html', markup);
}