window.addEventListener('load', init);
var manipulator;

function init() {
	const width = 1980;
	const height =1280;
	var flag = true;
	var cnt = 0;

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

	const LINK1 = 100;
	const LINK2 = 250;
	const RADIUS = 5;
	const LINK_HEIGHT = 30;
	const CYLINDER_HEIGHT = 1000;

	const loader   = new THREE.TextureLoader();
	const g_shaftx = new THREE.CylinderGeometry( RADIUS, RADIUS, CYLINDER_HEIGHT, 32 );
	const g_boxx   = new THREE.BoxGeometry( LINK_HEIGHT, LINK1, LINK_HEIGHT);
	const g_shafty = new THREE.CylinderGeometry( RADIUS, RADIUS, CYLINDER_HEIGHT, 32 );
	const g_boxy   = new THREE.BoxGeometry( LINK_HEIGHT, LINK1, LINK_HEIGHT);
	const g_shaftz = new THREE.CylinderGeometry( RADIUS, RADIUS, CYLINDER_HEIGHT, 32 );
	const g_boxz   = new THREE.BoxGeometry( LINK_HEIGHT, LINK1, LINK_HEIGHT);

	const material_coil = new THREE.MeshStandardMaterial( {color: 0x000000});//, wireframe: true} );
	const material_shaft = new THREE.MeshStandardMaterial( {color: 0xffffff});//, wireframe: true} );
	const boxz   = new THREE.Mesh( g_boxz.translate(0,  LINK1/2.0,         0).rotateX(Math.PI/2), material_coil );
	const boxx   = new THREE.Mesh( g_boxx.translate(0, -LINK1/2.0, LINK1/2.0).rotateZ(Math.PI/2), material_coil );
	const boxy   = new THREE.Mesh( g_boxy.translate(LINK1/2.0, -LINK1/2.0, LINK1/2.0)           , material_coil );
	const shaftz = new THREE.Mesh( g_shaftz.rotateX(Math.PI/2).translate(0, 0, CYLINDER_HEIGHT/2.0), material_shaft );
	const shaftx = new THREE.Mesh( g_shaftx.rotateZ(-Math.PI/2).translate(CYLINDER_HEIGHT/2.0, 0, LINK1/2.0), material_shaft );
	const shafty = new THREE.Mesh(           g_shafty.translate(LINK1/2.0, -CYLINDER_HEIGHT/2.0, LINK1/ 2.0), material_shaft );


	shaftz.add(boxz);
	boxz.add(shaftx);
	shaftx.add(boxx);
	boxx.add(shafty);
	shafty.add(boxy);
	scene.add(shaftz);
	renderer.setClearColor(0xeeeeee, 1);

	tick();
	function tick() {
		boxz.position.z =  (CYLINDER_HEIGHT - LINK1) / 2.0 * (1.0 - Math.cos(2 * cnt * 0.01 * Math.PI));
		boxx.position.x =  (CYLINDER_HEIGHT - LINK1) / 2.0 * (1.0 - Math.cos(2 * cnt * 0.01 * Math.PI));
		boxy.position.y = -(CYLINDER_HEIGHT - LINK1) / 2.0 * (1.0 - Math.cos(2 * cnt * 0.01 * Math.PI));
		cnt += 1;
		renderer.render(scene, camera); // レンダリング
		requestAnimationFrame(tick);
	}
}
