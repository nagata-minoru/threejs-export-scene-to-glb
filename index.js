import * as THREE from 'three';
import { GLTFLoader } from 'gltflaoder';
import { GLTFExporter } from 'gltfexporter';
import { OrbitControls } from 'orbitcontrols';

// canvas要素を選択して3Dシーンを準備するためのコードです🌍
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// ライトの追加
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight1.position.set(1, 1, 1).normalize();
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight2.position.set(-1, -1, -1).normalize();
scene.add(directionalLight2);

// 環境光の追加
const ambientLight = new THREE.AmbientLight(0x404040); // ソフトホワイトライト
scene.add(ambientLight);

// ダウンロードリンクを作成してDOMに追加するコードです🔗
const link = document.createElement('a');
document.body.appendChild(link);

// 'upload-glb'というIDを持つHTML要素がクリックされたとき、
// 隠されたファイル入力('file-input')を自動でクリックして、ファイル選択ダイアログを開きます📂👆
document.getElementById('upload-glb').onclick = () => document.getElementById('file-input').click();

// ファイル入力が変更されたとき(新しいファイルが選択されたとき)の処理を定義します。
// 選択されたファイルを読み込んで、Three.jsのシーンにGLTFモデルとして追加する処理を行います🔄🌐
document.getElementById('file-input').onchange = (event) => {
  const file = event.target.files[0]; // 選択されたファイルを取得します📄
  if (!file) {
    console.log('No file selected.');  // ファイルが選択されていなければ、ログを出力して処理を終了します。
    return;
  }

  const reader = new FileReader(); // ファイルリーダーを作成して、ファイルを読み込む準備をします👓
  reader.readAsArrayBuffer(file); // ファイルをArrayBuffer形式で読み込みます。

  reader.onload = () => { // GLTFLoaderを使用して、読み込んだデータからGLTFモデルを解析します🔄
    const loader = new GLTFLoader();
    loader.parse(reader.result, '', (gltf) => {
      scene.add(gltf.scene); // 解析が完了したGLTFモデルをシーンに追加します🎬
      console.log('GLB file loaded and added to the scene.'); // ログを出力します。

      // モデルのバウンディングボックスを計算して、カメラの位置を調整するための処理を以下で行います📏📐
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // ビューポートに合わせてカメラの位置を調整
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim * Math.tan(fov / 2));

      // カメラが近すぎる場合や遠すぎる場合の微調整
      cameraZ *= 1.5; // オブジェクトに少し余裕を持たせる
      camera.position.z = center.z + cameraZ;

      // 新しい位置からのオブジェクトの注視点を設定
      const direction = new THREE.Vector3().subVectors(camera.position, center).normalize();
      camera.position.addVectors(center, direction.multiplyScalar(cameraZ));
      camera.lookAt(center);

      // カメラコントロールを更新（必要な場合）
      if (controls) {
        controls.target.copy(center);
        controls.update();
      }
    }, (error) => {
      console.log('An error happened while loading the GLB file:', error); // エラーが発生した場合にログを出力します。
    });
  };
};

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
  scene.remove(directionalLight1);
  scene.remove(directionalLight2);
  (new GLTFExporter()).parse(
    scene,
    gltf => {
      scene.add(camera);
      scene.add(directionalLight1);
      scene.add(directionalLight2);
      save(new Blob([gltf], { type: 'application/octet-stream' }), 'scene.glb');
    },
    error => console.log(error),
    { binary: true }
  );
};

// ビューポートのサイズを設定するコードです📐
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight - 60
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
