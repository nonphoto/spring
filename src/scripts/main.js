import AnimationLoop from '@nonphoto/animation-loop'
import Vector from '@nonphoto/vector'
import Entity from './entity'
import { spring, dampen } from './spring'

export default class Main {
	constructor() {
		this.panel = document.getElementsByClassName('spring-panel')[0]

		this.animationLoop = new AnimationLoop(this.handleAnimationFrame.bind(this))
		this.animationLoop.start()

		this.mouse = new Vector(0.5, 0.5)
		this.center = new Vector(0.5, 0.5)
		this.entity = new Entity(0.5, 0.5)

		document.addEventListener('mousemove', this.handleMouseMove.bind(this))
		document.addEventListener('mousedown', this.handleMouseDown.bind(this))
		document.addEventListener('mouseup', this.handleMouseUp.bind(this))
	}

	handleAnimationFrame() {
		const relativeVelocity = this.entity.velocity

		const horizontalMouse = Vector.clone(this.mouse)
		horizontalMouse.y = 0.5

		const mouseImpulse = spring(horizontalMouse, this.entity.position, 0.1, 0.1, true, false)
		const centerImpulse = spring(this.center, this.entity.position, 0.05)
		const impulse = mouseImpulse.add(centerImpulse)

		this.entity.applyImpulse(dampen(impulse, relativeVelocity, 0.2))
		this.entity.update()

		const x = this.entity.position.x * 100
		this.panel.style.transform = `translate3d(${x}%, 0, 0)`
	}

	handleMouseMove(event) {
		this.mouse.x = event.clientX / window.innerWidth
		this.mouse.y = event.clientY / window.innerHeight
	}

	handleMouseDown() {
		this.mouseIsDown = true
	}

	handleMouseUp() {
		this.mouseIsDown = false
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const main = new Main()
})
