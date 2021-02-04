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
	const axesHelper = new THREE.AxesHelper( 100 );
	scene.add( axesHelper );
	//const loader = new THREE.TextureLoader();
	const material = new THREE.MeshBasicMaterial( {color: 0xFFFF00} );
	const geometry1 = new THREE.CylinderGeometry( 20, 20, 90, 8 );
	const geometry2 = new THREE.CylinderGeometry( 20, 20, 90, 8 );
	const geometry3 = new THREE.CylinderGeometry( 20, 20, 90, 8 );
	const geometry4 = new THREE.CylinderGeometry( 20, 20, 90, 8 );
	const geometry5 = new THREE.BoxGeometry( 80, 20, 10 );
	const motor1 = new THREE.Mesh( geometry1.rotateZ(Math.PI), material );
	const motor2 = new THREE.Mesh( geometry2, material );
	const motor3 = new THREE.Mesh( geometry3, material );
	const motor4 = new THREE.Mesh( geometry4, material );
	const link1 = new THREE.Mesh( geometry5, material );
	scene.add(motor1);
	//scene.add(motor2);
	//scene.add(motor3);
	//scene.add(motor4);
	scene.add(link1);
	tick();


	motor1.rotation.x = Math.PI/2.0;
	function tick() {
		//if (manipulator)
		//{
		//	cylinder.position.y = 100.0 * manipulator.joints[0].x;
		//}
		//motor1.position.x = 0.0;
		//motor2.position.x = 100.0;
		//motor3.position.x = 200.0;
		//motor4.position.x = 300.0;

		//motor1.rotation.x += 0.1;
		//motor2.rotation.x += 0.1;
		//motor3.rotation.x += 0.1;
		//motor4.rotation.x += 0.1;

		//link1.rotation.x += 0.1;
		//cylinder.rotation.x += 0.1;
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
