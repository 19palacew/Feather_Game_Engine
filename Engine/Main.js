// Winston Palace

// Begin Loading Assets
const loader = new Loader();
loader.queueFile("Assets/Cube.fmr");
loader.queueFile("Assets/Plane.fmr");
loader.queueFile("Assets/Sphere.fmr");
loader.queueFile("Assets/Asteroid.fmr");
loader.queueFile("Assets/CubeDiffuse.png");
loader.queueFile("Assets/Asteroid.png");
loader.queueFile("Assets/Space.jpg");
LOAD = loader.queue;

function main() {

	// GameObjecs in scene (Hierarchy)
	let gameObjects = [];

	let cube = new GameObject();
	cube.mesh = createMeshFromFMR(LOAD.get("Assets/Asteroid.fmr"));
	cube.shader = SHADERLIST.UNLIT;
	cube.material = new Material(LOAD.get("Assets/Asteroid.png"));
	cube.transform.position = new Vector3(10, 6, 40);
	//cube.collider = new SphereCollider(new Vector3(), 1);
	cube.addComponent(new SphereCollider(new Vector3(), 1));
	cube.addComponent(new Rigidbody);
	gameObjects.push(cube);

	let plane = new GameObject();
	plane.mesh = createMeshFromFMR(LOAD.get("Assets/Plane.fmr"));
	plane.material = new Material(LOAD.get("Assets/CubeDiffuse.png"));
	plane.shader = SHADERLIST.UNLIT;
	plane.transform.scale.x = 10;
	plane.transform.scale.y = 10;
	plane.transform.rotation.x = 90;
	plane.transform.position.z = 10;
	plane.transform.position.y = -2;
	gameObjects.push(plane);

	let sphere = new GameObject();
	sphere.mesh = createMeshFromFMR(LOAD.get("Assets/Sphere.fmr"));
	sphere.shader = SHADERLIST.UNLIT;
	sphere.material = new Material(LOAD.get("Assets/Space.jpg"));
	sphere.transform.position = new Vector3(1, 6, 40);
	sphere.transform.scale = new Vector3(200, 200, 200)
	sphere.addComponent(new SphereCollider(new Vector3(), 1));
	sphere.addComponent(new Rigidbody);
	sphere.getComponent(Rigidbody).velocity = new Vector3(1, 1, 1);
	gameObjects.push(sphere);


	// Camera Creation
	const fieldOfView = (45 * Math.PI) / 180; // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 1000.0;

	const camera = new Camera(fieldOfView, aspect, zNear, zFar);
	camera.transform.rotation.y = 180;

	let then = 0;

	// Update Scene
	function update(now) {

		// Current idea, Update CollisionPositions->CheckCollisions->RunPhysics->RunObjectScripts

		now *= 0.001; // convert to seconds
		DELTATIME = now - then;
		then = now;

		// Update Collisions
		// Sets collision data that GameObjects can call later
		for(let x = 0; x < Collider.COLLIDERS.length; x++){
			for(let y = x+1; y < Collider.COLLIDERS.length; y++){
				Collider.COLLIDERS[x].collidingWith = [];
				Collider.COLLIDERS[x].isColliding = false;
				Collider.COLLIDERS[x].updateCurrentPosition();
				Collider.COLLIDERS[y].updateCurrentPosition();
				if(Collider.isColliding(Collider.COLLIDERS[x], Collider.COLLIDERS[y])){
					console.log("Hit");
					Collider.COLLIDERS[x].isColliding = Collider.COLLIDERS[y].isColliding = true;
					Collider.COLLIDERS[x].collidingWith.push(Collider.COLLIDERS[y]);
				}
			}
		}

		// Update Object Information
		for (let i = 0; i < gameObjects.length; i++) {
			//gameObjects[i].getComponent(Rigidbody).move();
			//gameObjects[i].transform.rotation.y += 1;
		}

		// Camera Movement Demo
		// Coordiantes forward we want to move
		let x_1 = HORIZONTALINPUT * DELTATIME * -10;
		let y_1 = VERTICALINPUT * DELTATIME * -10;
		let moveVec = camera.transform.forward();
		moveVec.multiply(y_1);
		//console.log(moveVec)

		camera.transform.position.add(moveVec);
		//console.log(camera.transform.position)
		
		// Rotate Camera
		camera.transform.rotation.y -= MOUSECX * DELTATIME * 10;
		camera.transform.rotation.x += MOUSECY * DELTATIME * 15;
		
		resetInput();

		// Draw GameObjects
		drawScene(gameObjects, camera);

		// Loop
		requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
}

// Waits until DOM is loaded
document.addEventListener("DOMContentLoaded", function (event) {

	// Establish Canvas Layers
	const uiCanvas = document.querySelector("#ui");
	const glCanvas = document.querySelector("#gl");

	// Initialize context
	gl = glCanvas.getContext("webgl");
	ctx = uiCanvas.getContext("2d");

	ctx.fillStyle = "white";
	ctx.fillText("Feather Prototype V_0.0.2", 10, 10, 200);

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert(
			"Unable to initialize WebGL. Your browser or machine may not support it."
		);
		return;
	}

	startInput(glCanvas, uiCanvas);

	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Create Shader List
	SHADERLIST = new ShaderList();

	// Begin downloading assets and start game
	console.log("Starting Downloads");
	loader.startDownloads(main);
});