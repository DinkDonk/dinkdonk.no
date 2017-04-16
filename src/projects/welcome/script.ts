/*
 *	Welcome!
 *
 *	DinkDonk is a full stack developer.
 *	What better way to show it than with
 *	some beautifully formated code? 🤓
 *
*/

const projectLogoElements:NodeList = document.querySelectorAll('li');

function showProjectLogo(index:number):void {
	const logoElement:HTMLElement = <HTMLElement>projectLogoElements[index];

	for (let element of <HTMLElement[]><any>projectLogoElements) {
		element.classList.remove('active');
	}

	logoElement.classList.add('active');
}

let index:number = 0;

setInterval(() => {
	index++;

	if (index >= projectLogoElements.length) {
		index = 0;
	}

	showProjectLogo(index);
}, 2000);

showProjectLogo(index);