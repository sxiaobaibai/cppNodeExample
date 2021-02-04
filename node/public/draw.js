window.addEventListener('load', init);
var manipulator;

function init() {
	var socketio = io();
	var h1 = document.getElementById('server_msg');
	socketio.on('mess', function(msg)
	{
		manipulator = msg;
	});
	const width = 1080;
	const height = 540;
	var flag = true;

	const renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#myCanvas')
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, width / height);
	camera.position.set(0, 0, 1000);
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
	directionalLight.position.set(1, 1, 1);
	scene.add(directionalLight);
	const loader = new THREE.TextureLoader();
	const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
	const material = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
	const cylinder = new THREE.Mesh( geometry, material );
	scene.add( cylinder );
	tick();

	function tick() {
		if (manipulator)
		{
			cylinder.position.y = 100.0 * manipulator.joints[0].x;
		}
		if (flag === true)
		{
			renderer.setClearColor(0xeeeeee, 1);
			flag = false;
		}
		else
		{
			renderer.setClearColor(0x000000, 1);
		}
		renderer.render(scene, camera); // レンダリング
		requestAnimationFrame(tick);
	}
}
