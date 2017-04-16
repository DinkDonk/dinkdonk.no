export interface Route {
	name:string;
	path:string;
}

const routes:Route[] = [
	{name: 'project', path: '#\/(.+)\/?'}
];

export default routes;