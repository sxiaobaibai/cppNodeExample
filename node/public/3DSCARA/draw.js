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
	camera.position.set(100, 100, 300);
	const axesHelper = new THREE.AxesHelper( 200 );
	scene.add( axesHelper );
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
	directionalLight.position.set(1, 1, 1);
	scene.add(directionalLight);

	const LINK1 = 250;
	const LINK2 = 250;
	const RADIUS = 35;
	const LINK_HEIGHT = 30;
	const MOTOR_HEIGHT = 50;

	const loader = new THREE.TextureLoader();
	const motor_g1 = new THREE.CylinderGeometry( RADIUS, RADIUS, MOTOR_HEIGHT, 32 );
	const motor_g2 = new THREE.CylinderGeometry( RADIUS, RADIUS, MOTOR_HEIGHT, 32 );
	const link_g1=  new THREE.BoxGeometry( LINK_HEIGHT, LINK_HEIGHT, LINK1);
	const link_g2 = new THREE.BoxGeometry( LINK_HEIGHT, LINK_HEIGHT, LINK2);
	const material1 = new THREE.MeshStandardMaterial( {color: 0x00F00F});//, wireframe: true} );
	const material2 = new THREE.MeshStandardMaterial( {color: 0xff000F});//, wireframe: true} );
	const motor1 = new THREE.Mesh( motor_g1, material1 );
	const motor2 = new THREE.Mesh( motor_g2, material1 );
	const link1 = new THREE.Mesh( link_g1.translate(0,0,LINK1/2.0), material2 );
	const link2 = new THREE.Mesh( link_g2.translate(0,0,LINK2/2.0), material2 );

	const motor_g3 = new THREE.CylinderGeometry( RADIUS, RADIUS, MOTOR_HEIGHT, 32 );
	const motor_g4 = new THREE.CylinderGeometry( RADIUS, RADIUS, MOTOR_HEIGHT, 32 );
	const link_g3=  new THREE.BoxGeometry( LINK_HEIGHT, LINK_HEIGHT, LINK1);
	const link_g4 = new THREE.BoxGeometry( LINK_HEIGHT, LINK_HEIGHT, LINK2);
	const motor3 = new THREE.Mesh( motor_g3, material1 );
	const motor4 = new THREE.Mesh( motor_g4, material1 );
	const link3 = new THREE.Mesh( link_g3.translate(0,0,LINK1/2.0), material2 );
	const link4 = new THREE.Mesh( link_g4.translate(0,0,LINK2/2.0), material2 );

	motor1.add(link1);
	link1.add(motor2);
	motor2.add(link2);
	motor1.position.set(-100,0,0);
	motor2.position.set(0,0,LINK1);

	motor3.add(link3);
	link3.add(motor4);
	motor4.add(link4);
	motor3.position.set(100,0,0);
	motor4.position.set(0,0,LINK1);

	scene.add(motor1);
	scene.add(motor3);
	renderer.setClearColor(0xeeeeee, 1);

	tick();
	function tick() {
		motor1.rotation.y += 0.05;
		motor2.rotation.y += 0.05;
		motor3.rotation.y -= 0.05;
		motor4.rotation.y -= 0.05;
		renderer.render(scene, camera); // レンダリング
		requestAnimationFrame(tick);
	}
}
