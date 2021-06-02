/*
 *	Road Builder vs Road Demolisher™
 *
 *	Ever wonder what makes a snake-like game tick?
 *	Wonder no longer!
 *	Take a gander at this here code. 🤓
 *
*/

enum Key {
	UP = 38,
	DOWN = 40,
	LEFT = 37,
	RIGHT = 39
};

enum Direction {
	UP,
	DOWN,
	LEFT,
	RIGHT
}

interface Point {
	x:number;
	y:number;
}

interface Segment extends Point {
	direction:Direction;
	delay?:number;
}

class App {
	private canvas:HTMLCanvasElement;
	private context:CanvasRenderingContext2D;
	private width:number;
	private height:number;
	private speed:number = 4;
	private length:number = 1;
	private cellSize:number;
	private segments:Segment[];
	private turningPoints:Segment[];
	private food:Point;

	constructor() {
		this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
		this.context = this.canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.cellSize = Math.round(this.width / 20);

		if (!Number.isInteger(this.canvas.width / this.cellSize)) {
			throw new Error('Canvas width is not divisible by cell size');
		} else if (!Number.isInteger(this.canvas.height / this.cellSize)) {
			throw new Error('Canvas height is not divisible by cell size');
		}

		// Initialize segments
		this.reset();

		// Set up controls
		document.addEventListener('keydown', (event:KeyboardEvent) => {
			event.preventDefault();
			event.stopPropagation();

			const previousDirection = this.segments[0].direction;

			switch (event.keyCode) {
				case Key.UP:
					this.segments[0].direction = Direction.UP;
					break;

				case Key.DOWN:
					this.segments[0].direction = Direction.DOWN;
					break;

				case Key.LEFT:
					this.segments[0].direction = Direction.LEFT;
					break;

				case Key.RIGHT:
					this.segments[0].direction = Direction.RIGHT;
					break;
			}

			if (this.segments[0].direction !== previousDirection) {
				this.turningPoints.push({...this.segments[0]});
			}
		});

		// Start game loop
		const interval = setInterval(() => {
			this.tick();
			this.draw();
		}, 1000 / this.speed);

		this.draw();
	}

	private reset():void {
		this.segments = [{
			direction: Direction.LEFT,
			x: this.width - this.cellSize,
			y: 0
		}];

		this.turningPoints = [];

		this.dropFood();
	}

	private grow(count:number):void {
		for (let i = 0; i < count; i++) {
			const newSegment:Segment = {...this.segments[this.segments.length - 1]};

			newSegment.delay = i + 1;

			this.segments.push(newSegment);
		}
	}

	private dropFood():void {
		this.food = {
			x: Math.round(Math.random() * ((this.width - this.cellSize) / this.cellSize)) * this.cellSize,
			y: Math.round(Math.random() * ((this.height - this.cellSize) / this.cellSize)) * this.cellSize
		};
	}

	private tick():void {
		for (let i = 0; i < this.segments.length; i++) {
			const segment = this.segments[i];

			if (segment.delay && segment.delay > 0) {
				segment.delay--;

				continue;
			}

			const turningPoint:Segment = this.turningPoints.filter((value:Segment) => {
				if (value.x === segment.x && value.y === segment.y) {
					return true;
				}

				return false;
			})[0];

			if (turningPoint) {
				segment.direction = turningPoint.direction;

				// Remove first turning point when the last segment passes over it
				if (i === this.segments.length - 1) {
					this.turningPoints.shift();
				}
			}

			// Move the segment in current direction
			switch (segment.direction) {
				case Direction.UP:
					segment.y -= this.cellSize;
					break;

				case Direction.DOWN:
					segment.y += this.cellSize;
					break;

				case Direction.LEFT:
					segment.x -= this.cellSize;
					break;

				case Direction.RIGHT:
					segment.x += this.cellSize;
					break;
			}
		}

		// Check for fail state
		if (
			this.segments[0].x < 0
			|| this.segments[0].x > this.width - this.cellSize
			|| this.segments[0].y < 0
			|| this.segments[0].y > this.height - this.cellSize
			|| this.segments.filter((value:Segment) => {
				if (value.x === this.segments[0].x && value.y === this.segments[0].y) {
					return true;
				}

				return false;
			}).length > 1
		) {
			this.reset();

			return;
		}

		// Eat food?
		if (
			this.food
			&& this.segments[0].x === this.food.x
			&& this.segments[0].y === this.food.y
		) {
			this.food = null;

			this.grow(2);
		}

		if (!this.food) {
			this.dropFood();
		}
	}

	private draw():void {
		this.context.clearRect(0, 0, this.width, this.height);

		if (this.food) {
			this.context.fillStyle = '#f7f06f';
			this.context.fillRect(this.food.x, this.food.y, this.cellSize, this.cellSize);
		}

		this.context.fillStyle = '#303840';

		for (const segment of this.segments) {
			this.context.fillRect(segment.x, segment.y, this.cellSize, this.cellSize);
		}
	}
}

new App();