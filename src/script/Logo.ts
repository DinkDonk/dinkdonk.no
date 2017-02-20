import * as TWEEN from 'tween.js';

interface Vector1Interface {
	x:number;
}

interface Vector2Interface extends Vector1Interface {
	x:number;
	y:number;
	add(v:Vector2Interface | number):Vector2Interface;
	subtract(v:Vector2Interface | number):Vector2Interface;
	normalized:Vector2Interface;
	reversed:Vector2Interface;
	magnitude:number;
	dotProduct(v:Vector2Interface | number):number;
	crossProduct(v:Vector2Interface | number):number;
	multiply(v:Vector2Interface | number):Vector2Interface;
}

interface Vector3Interface {
	x:number;
	y:number;
	z:number;
}

class Vector1 implements Vector1Interface {
	public x:number;

	constructor(x:number) {
		this.x = x;
	}
}

class Vector2 implements Vector2Interface {
	public x:number;
	public y:number;

	constructor(x:number, y:number) {
		this.x = x;
		this.y = y;
	}

	public add(v:Vector2 | number):Vector2 {
		if (typeof v === 'number') {
			return new Vector2(this.x + v, this.y + v);
		}

		return new Vector2(this.x + v.x, this.y + v.y);
	}

	public subtract(v:Vector2 | number):Vector2 {
		if (typeof v === 'number') {
			return new Vector2(this.x + -v, this.y + -v);
		}

		return new Vector2(this.x + -v.x, this.y + -v.y);
	}

	public get normalized():Vector2 {
		let magitude:number = this.magnitude;
		return new Vector2(this.x / magitude, this.y / magitude);
	}

	public get magnitude():number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	public get reversed():Vector2 {
		return new Vector2(-this.x, -this.y);
	}

	public dotProduct(v:Vector2Interface | number):number {
		if (typeof v === 'number') {
			return this.x * v + this.y * v;
		}

		return this.x * v.x + this.y * v.y;
	}

	public crossProduct(v:Vector2Interface | number):number {
		if (typeof v === 'number') {
			return this.x * v - this.y * v;
		}

		return this.x * v.x - this.y * v.y;
	}

	public multiply(v:Vector2 | number):Vector2 {
		if (typeof v === 'number') {
			return new Vector2(this.x * v, this.y * v);
		}

		return new Vector2(this.x * v.x, this.y * v.y);
	}
}

class Vector3 implements Vector3Interface {
	public x:number;
	public y:number;
	public z:number;

	constructor(x:number, y:number, z:number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public add(v:Vector3 | number):Vector3 {
		if (typeof v === 'number') {
			return new Vector3(this.x + v, this.y + v, this.z + v);
		}

		return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
	}

	public scale(factor:number):Vector3 {
		return new Vector3(this.x * factor, this.y * factor, this.z * factor);
	}
}

type Bezier = {
	startPoint:Vector2,
	startControlPoint:Vector2,
	endPoint:Vector2,
	endControlPoint:Vector2
};

export default class Logo {
	private canvas:HTMLCanvasElement;
	private context:CanvasRenderingContext2D;
	private padding:number = 100;
	private offset:Vector2;
	private scale:number;
	private points:Array<Vector2>;
	private tensions:Array<Vector1>;
	private tensionsObjArr:Array<Object>;

	constructor() {
		let colors = [
			'#b6a997',
			'#eb175e',
			'#70cff6'
		];

		let color = colors[Math.floor(Math.random() * colors.length)];

		(document.querySelector('.loader') as HTMLElement).style.backgroundColor = color;

		this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
		this.context = this.canvas.getContext('2d');

		this.canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
		this.canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
		this.canvas.style.width = window.innerWidth + 'px';
		this.canvas.style.height = window.innerHeight + 'px';

		this.scale = this.canvas.width / (330 + this.padding * 2);
		this.offset = new Vector2(this.padding - 5, (this.canvas.height / 2) / this.scale);

		if (window.innerWidth / window.innerHeight < 1) {
			this.offset.y = (this.canvas.height / 3) / this.scale;
		}

		let anchors:Array<Vector3> = [
			// start
			new Vector3(-this.offset.x, 0, 0.3),
			// d
			new Vector3(40, 0, 0.3),
			new Vector3(0, -30, 1),
			new Vector3(50, -50, 0.3),
			new Vector3(30, 10, 0.3),
			new Vector3(60, -120, -1.5),
			new Vector3(50, 0, 1),
			// i
			new Vector3(70, -50, -1),
			new Vector3(60, 0, 0.3),
			// n
			new Vector3(70, 0, 1),
			new Vector3(80, -40, -1),
			new Vector3(110, -50, 0.5),
			new Vector3(100, 0, 0.3),
			// k
			new Vector3(110, 0, 1),
			new Vector3(130, -100, -2),
			new Vector3(125, -50, 0.3),
			new Vector3(160, -60, -2),
			new Vector3(115, -40, 0.3),
			new Vector3(144, 0, 0.3),
			// d
			new Vector3(190, -10, -1),
			new Vector3(150, -20, 2),
			new Vector3(195, -50, 1),
			new Vector3(180, 0, 0.3),
			new Vector3(215, -120, -1.5),
			new Vector3(195, 0, 0.5),
			// o
			new Vector3(230, -10, 0.5),
			new Vector3(245, -50, 0.5),
			new Vector3(215, -50, 0.5),
			new Vector3(205, -10, 0.5),
			// n
			new Vector3(235, 0, 0.3),
			new Vector3(245, -40, -1),
			new Vector3(275, -50, 0.5),
			new Vector3(265, 0, 0.3),
			// k
			new Vector3(275, 0, 1),
			new Vector3(295, -100, -2),
			new Vector3(290, -50, 0.3),
			new Vector3(325, -60, -2),
			new Vector3(280, -40, 0.3),
			new Vector3(309, 0, 0.3),
			// end
			new Vector3(330 + this.offset.x + 10, 0, 0.3)
		];

		this.points = [];
		this.tensions = [];

		for (let i in anchors) {
			this.points.push(new Vector2(anchors[i].x, anchors[i].y));
			this.tensions.push(new Vector1(anchors[i].z));
		}

		this.points = this.offsetAndScalePoints();

		let endPoints:Array<Vector2> = [];
		let endTensions:Array<Vector1> = [];

		for (let i in this.tensions) {
			endTensions[i] = new Vector1(this.tensions[i].x);
			this.tensions[i].x = 0;
		}

		if (Math.random() > 0.5) {
			// Falling string from the roof

			for (let i in this.points) {
				endPoints[i] = new Vector2(this.points[i].x, this.points[i].y);
				this.points[i].y = -5;
			}

			for (let i = 0, l = this.tensions.length; i < l; i++) {
				let tween = new TWEEN.Tween(this.tensions[i])
				.to(endTensions[i], 4000)
				.easing(TWEEN.Easing.Elastic.Out)
				.delay(500 + i * 100)
				.start();
			}

			let tween00 = new TWEEN.Tween(this.points[0])
			.to(endPoints[0], 1000)
			.easing(TWEEN.Easing.Elastic.Out)
			.delay(1000)
			.start();

			for (let i = 1, l = this.points.length - 1; i < l; i++) {
				let tween = new TWEEN.Tween(this.points[i])
				.to(endPoints[i], 1000)
				.easing(elasticOutTight)
				.delay(1000 + i * 100)
				.start();
			}

			let tween1 = new TWEEN.Tween(this.points[this.points.length - 1])
			.to(endPoints[endPoints.length - 1], 1000)
			.easing(TWEEN.Easing.Elastic.Out)
			.delay(1000 + (endPoints.length - 1) * 100)
			.start();
		} else {
			// Up from the line

			for (let i in this.points) {
				endPoints[i] = new Vector2(this.points[i].x, this.points[i].y);
				this.points[i].x = this.points[i].x + (this.canvas.width * 0.05);
				this.points[i].y = this.offset.multiply(this.scale).y;
			}

			this.points[0].x = 0;

			for (let i = 0, l = this.tensions.length; i < l; i++) {
				let tween = new TWEEN.Tween(this.tensions[i])
				.to(endTensions[i], 4000)
				.easing(TWEEN.Easing.Elastic.Out)
				.delay(500 + i * 40)
				// .repeat(Infinity)
				// .yoyo(true)
				.start();
			}

			for (let i = 0, l = this.points.length; i < l; i++) {
				let tween = new TWEEN.Tween(this.points[i])
				.to(endPoints[i], 1700)
				.easing(elasticOutTight)
				.delay(1000 + i * 40)
				.start();
			}
		}

		function elasticOutTight(k:number) {
			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(5, -10 * k) * Math.sin((k * 0.8 - 0.1) * 5 * Math.PI) + 1;
		}

		requestAnimationFrame(this.render);

		this.draw();
	}

	private offsetAndScalePoints():Array<Vector2> {
		let points:Array<Vector2> = [];

		for (let i in this.points) {
			let point = this.points[i];

			points.push(new Vector2((point.x + this.offset.x) * this.scale, (point.y + this.offset.y) * this.scale));
		}

		return points;
	}

	private render = (time?:number):void => {
		requestAnimationFrame(this.render);

		TWEEN.update(time);

		this.draw();
	}

	private draw():void {
		let canvas = this.canvas;
		let context = this.context;
		let points = this.points;
		let tensions = this.tensions;
		let beziers:Array<Bezier> = [];

		for (let i = 1, l = points.length - 1; i < l; i++) {
			let p0:Vector2 = points[i - 1];
			let p1:Vector2 = points[i];
			let p2:Vector2 = points[i + 1];
			let q0Distance:number = p1.subtract(p0).magnitude;
			let q1Distance:number = p2.subtract(p1).magnitude;
			let tension = tensions[i].x;
			let fa:number = tension * q0Distance / (q0Distance + q1Distance);
			let fb:number = tension - fa;
			let q0:Vector2 = p1.add(p0.subtract(p2).multiply(fa));
			let q1:Vector2 = p1.subtract(p0.subtract(p2).multiply(fb));

			beziers.push({
				startPoint: p0,
				startControlPoint:q1,
				endPoint: p1,
				endControlPoint: q0
			});
		}

		context.clearRect(0, 0, canvas.width, canvas.height);

		context.beginPath();

		context.moveTo(points[0].x, points[0].y);
		context.quadraticCurveTo(beziers[0].endControlPoint.x, beziers[0].endControlPoint.y, points[1].x, points[1].y);

		for (let i = 1, l = beziers.length; i < l; i++) {
			context.bezierCurveTo(beziers[i - 1].startControlPoint.x, beziers[i-1].startControlPoint.y, beziers[i].endControlPoint.x, beziers[i].endControlPoint.y, beziers[i].endPoint.x, beziers[i].endPoint.y);
		}

		context.quadraticCurveTo(beziers[beziers.length - 1].startControlPoint.x, beziers[beziers.length - 1].startControlPoint.y, points[points.length - 1].x, points[points.length - 1].y);

		context.strokeStyle = '#f7f06f';
		context.lineWidth = this.scale * 1.5;
		context.lineJoin = 'round';
		// context.shadowOffsetX = 0;
		// context.shadowOffsetY = 50;
		// context.shadowBlur = 10;
		// context.shadowColor = 'rgba(0, 0, 0, 0.05)';
		context.stroke();
	}
}