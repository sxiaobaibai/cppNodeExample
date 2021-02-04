window.addEventListener('load', init);
var manipulator;

function init() {
	var canvas = document.getElementById('myCanvas');
	const width = canvas.offsetWidth;
	const height =canvas.offsetHeight;
	var flag = true;
	var cnt = 0;

	var th1 = 0;
	var th2 = 0;
	var th3 = 0;
	var elem1 = document.getElementById('angle1');
	var elem2 = document.getElementById('angle2');
	var elem3 = document.getElementById('angle3');
	elem1.addEventListener('input', (e)=>{th1 = elem1.value;});
	elem2.addEventListener('input', (e)=>{th2 = elem2.value;});
	elem3.addEventListener('input', (e)=>{th3 = elem3.value;});

	const renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#myCanvas')
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000.0);
	camera.position.set(300, 300, 300);
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

	const loader   = new THREE.TextureLoader();

	const g_motor1  = new THREE.CylinderGeometry( RADIUS, RADIUS, MOTOR_HEIGHT, 32 );
	const g_motor2  = new THREE.CylinderGeometry( RADIUS, RADIUS, MOTOR_HEIGHT, 32 );
	const g_motor3  = new THREE.CylinderGeometry( RADIUS, RADIUS, MOTOR_HEIGHT, 32 );
	const g_link2 = new THREE.BoxGeometry( LINK_HEIGHT, LINK1, LINK_HEIGHT);
	const g_link3 = new THREE.BoxGeometry( LINK_HEIGHT, LINK1, LINK_HEIGHT);

	const material_motor = new THREE.MeshStandardMaterial( {color: 0x000000});//, wireframe: true} );
	const material_link = new THREE.MeshStandardMaterial( {color: 0xffffff});//, wireframe: true} );

	const motor1 = new THREE.Mesh( g_motor1.translate(0, MOTOR_HEIGHT/2.0 + RADIUS, 0) , material_motor );
	const motor2 = new THREE.Mesh( g_motor2.rotateX(Math.PI/2.0) , material_motor );
	const motor3 = new THREE.Mesh( g_motor3.rotateX(Math.PI/2.0) , material_motor );
	const link2  = new THREE.Mesh( g_link2.translate(0, -LINK1/2.0, 0)  , material_link  );
	const link3  = new THREE.Mesh( g_link3.translate(0, -LINK2/2.0, 0)  , material_link  );

	motor1.add(motor2);
	motor2.add(link2);
	link2.add(motor3);
	motor3.add(link3);
	motor3.position.set(0, -LINK1, 0.0);
	scene.add(motor1);
	renderer.setClearColor(0xeeeeee, 1);

	tick();
	function tick() {
		motor1.rotation.y = th1;
		motor2.rotation.z = th2;
		motor3.rotation.z = th3;
		cnt += 1;
		renderer.render(scene, camera); // レンダリング
		requestAnimationFrame(tick);
	}
}
