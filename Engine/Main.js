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
loader.queueFile("Assets/Laser.jpg");
loader.queueFile("Assets/SpaceShipHUD.png");
LOAD = loader.queue;

function main() {

	// GameObjecs in scene (Hierarchy)
	let gameObjects = [];

	for(let b=0;b<100;b=b+10){
		let asteroid = new GameObject();
		asteroid.mesh = createMeshFromFMR(LOAD.get("Assets/Asteroid.fmr"));
		asteroid.shader = SHADERLIST.UNLIT;
		asteroid.material = new Material(LOAD.get("Assets/Asteroid.png"));
		asteroid.transform.position = new Vector3(b, 6, 40);
		asteroid.addComponent(new SphereCollider(new Vector3(), 1));
		asteroid.addComponent(new Rigidbody);
		asteroid.tag = "asteroid";
		gameObjects.push(asteroid);
	}

	let sphere = new GameObject();
	sphere.mesh = createMeshFromFMR(LOAD.get("Assets/Sphere.fmr"));
	sphere.shader = SHADERLIST.UNLIT;
	sphere.material = new Material(LOAD.get("Assets/Space.jpg"));
	sphere.transform.position = new Vector3(1, 6, 40);
	sphere.transform.scale = new Vector3(200, 200, 200)
	sphere.addComponent(new Rigidbody);
	gameObjects.push(sphere);

	let score = 0


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
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(LOAD.get("Assets/SpaceShipHUD.png"), 0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.font = "30px Arial";
		ctx.fillText(score, 20, 40);

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
					//console.log("Hit");
					Collider.COLLIDERS[x].isColliding = Collider.COLLIDERS[y].isColliding = true;
					Collider.COLLIDERS[x].collidingWith.push(Collider.COLLIDERS[y]);
					Collider.COLLIDERS[y].collidingWith.push(Collider.COLLIDERS[x]);
				}
			}
		}

		// Update Object Information
		for (let i = 0; i < gameObjects.length; i++) {
			if(gameObjects[i].tag=="laser"){
				let camVec = Vector3.clone(gameObjects[i].transform.Forward);
				camVec.multiply(DELTATIME*40);
				gameObjects[i].transform.position.subtract(camVec);
				if(Math.abs(gameObjects[i].transform.position.x-camera.transform.position.x)>100 || Math.abs(gameObjects[i].transform.position.y-camera.transform.position.y)>100 || Math.abs(gameObjects[i].transform.position.z-camera.transform.position.z)>100){
					Collider.COLLIDERS.splice(Collider.COLLIDERS.indexOf(gameObjects[i].collider), 1)
					gameObjects.splice(gameObjects.indexOf(gameObjects[i]), 1)
					continue;
				}
			}
			// Delete Both Laser and Astroid if hit
			if(gameObjects[i].getComponent(Collider)){
				if(gameObjects[i].getComponent(Collider).isColliding && gameObjects[i].getComponent(Collider).collidingWith[0]){
					if(gameObjects[i].getComponent(Collider).collidingWith[0].gameObject.tag != "laser"){
						Collider.COLLIDERS.splice(Collider.COLLIDERS.indexOf(gameObjects[i].collider), 1);
						gameObjects.splice(gameObjects.indexOf(gameObjects[i]), 1);
						continue;
					}
					if(gameObjects[i].tag = "asteroid"){
						Collider.COLLIDERS.splice(Collider.COLLIDERS.indexOf(gameObjects[i].collider), 1);
						gameObjects.splice(gameObjects.indexOf(gameObjects[i]), 1);
						score = score + 1;
						continue;
					}
				}
			}
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
		sphere.transform.position = camera.transform.position

		if(KEYDOWN==" "){
			let laser = new GameObject();
			laser.mesh = createMeshFromFMR(LOAD.get("Assets/Sphere.fmr"));
			laser.shader = SHADERLIST.UNLIT;
			laser.material = new Material(LOAD.get("Assets/Laser.jpg"));
			laser.transform.scale = new Vector3(.1, .1, .1)
			let vec = Vector3.clone(camera.transform.position)
			vec.subtract(new Vector3(0,1,0));
			laser.transform.position = vec;
			laser.addComponent(new SphereCollider(new Vector3(), 1));
			laser.addComponent(new Rigidbody);
			laser.tag = "laser";
			laser.transform.Forward = Vector3.clone(camera.transform.forward());
			gameObjects.push(laser);
		}
		
		resetInput();

		// Draw GameObjects
		drawScene(gameObjects, camera);

		KEYDOWN = ""

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