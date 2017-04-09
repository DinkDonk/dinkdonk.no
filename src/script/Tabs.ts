import TabsEventEmitter from './TabsEventEmitter';

console.log('Tabs');

export default class Tabs {
	private tabs:NodeList;

	constructor() {
		console.log('Tabs constructor');

		this.tabs = document.querySelectorAll('[tab-controls]');

		for (var i = 0, l = this.tabs.length; i < l; i++) {
			this.tabs[i].addEventListener('click', this.onTabClick);
		}

		this.selectTab(this.tabs[0]);
	}

	private selectTab(tab:Node) {
		for (var i = 0, l = this.tabs.length; i < l; i++) {
			let iTabElement = this.tabs[i] as Element;

			if (this.tabs[i] == tab) {
				iTabElement.classList.add('active');
				document.getElementById(iTabElement.getAttribute('tab-controls')).classList.add('active');
			} else {
				iTabElement.classList.remove('active');
				document.getElementById(iTabElement.getAttribute('tab-controls')).classList.remove('active');
			}
		}
	}

	private onTabClick = (event:MouseEvent) => {
		this.selectTab(event.target as Node);

		TabsEventEmitter.instance.emit('selected', (event.target as HTMLElement).getAttribute('tab-controls'));
	}
}