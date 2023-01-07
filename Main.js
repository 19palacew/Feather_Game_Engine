// Winston Palace

const loader = new Loader();
loader.queueFile("Assets/Cube.fmr");
loader.queueFile("Assets/CubeDiffuse.png");

let LOAD = loader.queue;

let deltaTime = 0;

var gl = null;
let ctx = null;
let SHADERLIST = null;

//
// start here
//
function main() {

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

	let gameObjects = [];

	let cube = new GameObject();
	cube.mesh = createMeshFromFMR(gl, LOAD.get("Assets/Cube.fmr"));
	cube.shader = SHADERLIST.UNLIT;
	cube.material = new Material(gl, LOAD.get("Assets/CubeDiffuse.png"));
	cube.transform.position = new Vector3(10, 6, -40);
	gameObjects.push(cube);

	const fieldOfView = (45 * Math.PI) / 180; // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;

	const camera = new Camera(fieldOfView, aspect, zNear, zFar);

	let then = 0;

	// Draw the scene repeatedly
	function render(now) {

		//console.log(gl.getError());

		now *= 0.001; // convert to seconds
		deltaTime = now - then;
		then = now;

		//camera.transform.position.z -= 0.1;

		for (let i = 0; i < gameObjects.length; i++) {
			//gameObjects[i].transform.rotation.x += 1;
			gameObjects[i].transform.rotation.y += 1;
			//gameObjects[i].transform.rotation.z += 1;
		}

		drawScene(gl, gameObjects, camera);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

// Waits until DOM is loaded
document.addEventListener("DOMContentLoaded", function (event) {

	const canvas = document.querySelector("#canvas");
	const canvas2 = document.querySelector("#canvas2");

	// Initialize context
	gl = canvas.getContext("webgl");
	ctx = canvas2.getContext("2d");
	SHADERLIST = new ShaderList(gl);
	console.log("Starting Downloads");
	loader.startDownloads(main);
});