// Winston Palace

// Begin Loading Assets
const loader = new Loader();
loader.queueFile("Assets/Cube.fmr");
loader.queueFile("Assets/Sphere.fmr");
loader.queueFile("Assets/CubeDiffuse.png");
LOAD = loader.queue;

function main() {

	// GameObjecs in scene (Hierarchy)
	let gameObjects = [];

	let cube = new GameObject();
	cube.mesh = createMeshFromFMR(gl, LOAD.get("Assets/Sphere.fmr"));
	cube.shader = SHADERLIST.UNLIT;
	cube.material = new Material(gl, LOAD.get("Assets/CubeDiffuse.png"));
	cube.transform.position = new Vector3(10, 6, -40);
	//cube.collider = new SphereCollider(new Vector3(), 1);
	cube.addComponent(new SphereCollider(new Vector3(), 1));
	gameObjects.push(cube);

	for(let i=0; i<.5; i+=.5){
		let sphere = new GameObject();
		sphere.mesh = createMeshFromFMR(gl, LOAD.get("Assets/Sphere.fmr"));
		sphere.shader = SHADERLIST.UNLIT;
		sphere.material = new Material(gl, LOAD.get("Assets/CubeDiffuse.png"));
		sphere.transform.position = new Vector3(1, 6, -40);
		sphere.addComponent(new SphereCollider(new Vector3(), 1));
		gameObjects.push(sphere);
	}

	// Camera Creation
	const fieldOfView = (45 * Math.PI) / 180; // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;

	const camera = new Camera(fieldOfView, aspect, zNear, zFar);

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
			
			gameObjects[i].transform.rotation.y += 1;
		}

		gameObjects[0].transform.position.x += HORIZONTALINPUT * DELTATIME * 10;
		gameObjects[0].transform.position.y += VERTICALINPUT * DELTATIME * 10;

		

		// Draw GameObjects
		drawScene(gl, gameObjects, camera);

		// Loop
		requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
}

// Waits until DOM is loaded
document.addEventListener("DOMContentLoaded", function (event) {

	// Establish Canvas Layers
	const canvas = document.querySelector("#canvas");
	const canvas2 = document.querySelector("#canvas2");

	// Initialize context
	gl = canvas.getContext("webgl");
	ctx = canvas2.getContext("2d");

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert(
			"Unable to initialize WebGL. Your browser or machine may not support it."
		);
		return;
	}

	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Create Shader List
	SHADERLIST = new ShaderList(gl);

	// Begin downloading assets and start game
	console.log("Starting Downloads");
	loader.startDownloads(main);
});