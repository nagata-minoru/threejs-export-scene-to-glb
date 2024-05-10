import * as THREE from 'three';
import { GLTFExporter } from 'gltfexporter';
import { OrbitControls } from 'orbitcontrols';

// canvas要素を選択して3Dシーンを準備するためのコードです🌍
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// 立方体と球体のジオメトリを生成するコードです🔲🔵
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(1, 100, 10);

// マテリアル設定、色はインディゴとブルーです🎨
const material1 = new THREE.MeshBasicMaterial({ color: 'indigo' });
const material2 = new THREE.MeshBasicMaterial({ color: 'blue' });

// メッシュを作成してシーンに追加するコードです🎭
const mesh1 = new THREE.Mesh(cubeGeometry, material1);
const mesh2 = new THREE.Mesh(sphereGeometry, material2);

scene.add(mesh1, mesh2);

// mesh2のスケールと位置を調整するコードです📏
mesh2.scale.set(0.5, 0.5, 0.5);
mesh2.position.set(0, 1, 0);

// ダウンロードリンクを作成してDOMに追加するコードです🔗
const link = document.createElement('a');
document.body.appendChild(link);

/**
 * ブラウザでファイルを保存するための関数です。
 * @param {Blob} blob - 保存するBlobオブジェクト
 * @param {string} filename - 保存するファイルの名前
 */
const save = (blob, filename) => {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * GLBフォーマットで3Dシーンをエクスポートし、保存する関数を実行します。
 */
document.getElementById('download-glb').onclick = () => {
  scene.remove(camera);
  (new GLTFExporter()).parse(
    scene,
    gltf => {
      scene.add(camera);
      save(new Blob([gltf], { type: 'application/octet-stream' }), 'scene.glb');
    },
    error => console.log(error),
    { binary: true }
  );
};

// ビューポートのサイズを設定するコードです📐
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// カメラを設定してシーンに追加するコードです📷
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 3);
scene.add(camera);

// カメラコントロールを設定するコードです🎮
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// レンダラを設定して描画を開始するコードです🖌️
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * シーンをアニメーションさせるための関数です。フレームごとにこの関数が呼び出されます。
 */
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

animate();
