const path = require('path');
const fs = require('fs-extra');
const projetcsPath = 'src/projects/';

const projects = fs.readdirSync(projetcsPath).filter((file) => fs.statSync(path.join(projetcsPath, file)).isDirectory());

const markupInject =
`
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
	console.log(project);

	fs.copySync(projetcsPath + project, 'build/projects/' + project, {
		overwrite: true
	});

	let markup = fs.readFileSync('build/projects/' + project + '/markup.html', 'utf8');

	markup = markup.replace('</body>', markupInject + '</body>');

	fs.writeFileSync('build/projects/' + project + '/markup.html', markup);
}