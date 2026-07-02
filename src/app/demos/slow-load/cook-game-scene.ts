import {
  AmbientLight,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

type IngredientKind = 'onion' | 'tomato' | 'carrot' | 'pepper';
type ToolKind = 'knife' | 'pan' | 'oven' | 'board';

interface GameObject {
  mesh: Object3D;
  kind: IngredientKind | ToolKind;
  cuttable: boolean;
  cut: boolean;
  held: boolean;
}

const INGREDIENT_COLORS: Record<IngredientKind, number> = {
  onion: 0xc084fc,
  tomato: 0xef4444,
  carrot: 0xf97316,
  pepper: 0x22c55e,
};

export class CookGameScene {
  private readonly _scene = new Scene();
  private readonly _camera: PerspectiveCamera;
  private readonly _renderer: WebGLRenderer;
  private readonly _raycaster = new Raycaster();
  private readonly _pointer = new Vector2();
  private readonly _objects: GameObject[] = [];
  private readonly _dragPlane = new PlaneGeometry(6, 2);
  private readonly _dragPlaneMesh: Mesh;
  private readonly _onStatusChange: (message: string) => void;

  private _heldObject: GameObject | null = null;
  private _animationId = 0;
  private _disposed = false;

  constructor(canvas: HTMLCanvasElement, onStatusChange: (message: string) => void) {
    this._onStatusChange = onStatusChange;
    this._scene.background = new Color(0xf5f0e8);

    this._camera = new PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    this._camera.position.set(0, 7, 8);
    this._camera.lookAt(0, 0.5, 0);

    this._renderer = new WebGLRenderer({ canvas, antialias: true });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this._renderer.shadowMap.enabled = true;

    this._dragPlaneMesh = new Mesh(
      this._dragPlane,
      new MeshStandardMaterial({ visible: false }),
    );
    this._dragPlaneMesh.rotation.x = -Math.PI / 2;
    this._dragPlaneMesh.position.y = 0.52;
    this._scene.add(this._dragPlaneMesh);

    this._addLights();
    this._buildKitchen();

    canvas.addEventListener('pointerdown', this._onPointerDown);
    canvas.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('resize', this._onResize);

    this._animate();
    this._emitStatus();
  }

  dispose(): void {
    this._disposed = true;
    cancelAnimationFrame(this._animationId);
    this._renderer.domElement.removeEventListener('pointerdown', this._onPointerDown);
    this._renderer.domElement.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('resize', this._onResize);
    this._renderer.dispose();
  }

  get statusMessage(): string {
    if (this._heldObject?.kind === 'knife') {
      return 'Knife in hand. Click a vegetable to chop it.';
    }
    if (this._heldObject) {
      return `Holding ${this._heldObject.kind}. Drop on the pan or in the oven.`;
    }
    return 'Pick up the knife or an ingredient.';
  }

  private _emitStatus(): void {
    this._onStatusChange(this.statusMessage);
  }

  private _addLights(): void {
    this._scene.add(new AmbientLight(0xffffff, 0.65));
    const keyLight = new DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    this._scene.add(keyLight);
  }

  private _buildKitchen(): void {
    this._addCounter();
    this._addCuttingBoard();
    this._addPan();
    this._addOven();
    this._addKnife();
    this._addIngredient('onion', -2.4, 0.7, 0.4);
    this._addIngredient('tomato', -2.4, 0.7, -0.4);
    this._addIngredient('carrot', -1.7, 0.7, 0.4);
    this._addIngredient('pepper', -1.7, 0.7, -0.4);
  }

  private _addCounter(): void {
    const counter = new Mesh(
      new BoxGeometry(8, 0.8, 3),
      new MeshStandardMaterial({ color: 0xd6c4a8 }),
    );
    counter.position.y = 0.4;
    counter.receiveShadow = true;
    this._scene.add(counter);
  }

  private _addCuttingBoard(): void {
    const board = this._createMesh(
      new BoxGeometry(2.2, 0.08, 1.4),
      0x8b5a2b,
      0, 0.86, 0,
    );
    board.receiveShadow = true;
    this._registerObject(board, 'board', false);
  }

  private _addPan(): void {
    const panGroup = new Group();
    const body = new Mesh(
      new CylinderGeometry(0.55, 0.45, 0.12, 24),
      new MeshStandardMaterial({ color: 0x374151, metalness: 0.8, roughness: 0.35 }),
    );
    body.castShadow = true;
    panGroup.add(body);

    const handle = new Mesh(
      new BoxGeometry(0.7, 0.06, 0.06),
      new MeshStandardMaterial({ color: 0x111827 }),
    );
    handle.position.set(0.85, 0, 0);
    panGroup.add(handle);

    panGroup.position.set(1.8, 0.92, 0.2);
    this._scene.add(panGroup);

    const hitArea = this._createMesh(
      new CylinderGeometry(0.65, 0.65, 0.2, 24),
      0x374151,
      1.8, 0.92, 0.2,
    );
    hitArea.material = new MeshStandardMaterial({
      color: 0x374151,
      transparent: true,
      opacity: 0.001,
    });
    this._registerObject(hitArea, 'pan', false);
  }

  private _addOven(): void {
    const oven = this._createMesh(
      new BoxGeometry(1.4, 1.1, 1),
      0x4b5563,
      2.8, 1.15, -0.6,
    );
    oven.castShadow = true;

    const door = this._createMesh(
      new BoxGeometry(1, 0.7, 0.05),
      0x111827,
      2.8, 1.05, -0.08,
    );
    this._scene.add(door);
    this._registerObject(oven, 'oven', false);
  }

  private _addKnife(): void {
    const knifeGroup = new Group();
    const blade = new Mesh(
      new BoxGeometry(0.55, 0.03, 0.12),
      new MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 }),
    );
    knifeGroup.add(blade);

    const handle = new Mesh(
      new BoxGeometry(0.18, 0.05, 0.08),
      new MeshStandardMaterial({ color: 0x78350f }),
    );
    handle.position.x = -0.35;
    knifeGroup.add(handle);

    knifeGroup.position.set(0.2, 0.92, 0.8);
    knifeGroup.rotation.y = -0.4;
    this._scene.add(knifeGroup);
    this._registerObject(knifeGroup, 'knife', false);
  }

  private _addIngredient(kind: IngredientKind, x: number, y: number, z: number): void {
    const mesh = this._createIngredientMesh(kind);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    this._registerObject(mesh, kind, true);
  }

  private _createIngredientMesh(kind: IngredientKind, scale = 1): Mesh {
    const color = INGREDIENT_COLORS[kind];
    if (kind === 'carrot') {
      return this._createMesh(new CylinderGeometry(0.12 * scale, 0.08 * scale, 0.5 * scale, 12), color, 0, 0, 0);
    }
    if (kind === 'pepper') {
      return this._createMesh(new BoxGeometry(0.28 * scale, 0.35 * scale, 0.28 * scale), color, 0, 0, 0);
    }
    return this._createMesh(new SphereGeometry(0.22 * scale, 16, 16), color, 0, 0, 0);
  }

  private _createMesh(geometry: BoxGeometry | CylinderGeometry | SphereGeometry, color: number, x: number, y: number, z: number): Mesh {
    const mesh = new Mesh(geometry, new MeshStandardMaterial({ color }));
    mesh.position.set(x, y, z);
    this._scene.add(mesh);
    return mesh;
  }

  private _registerObject(object: Object3D, kind: IngredientKind | ToolKind, cuttable: boolean): void {
    object.userData['gameObject'] = true;
    this._objects.push({ mesh: object, kind, cuttable, cut: false, held: false });
  }

  private readonly _onResize = (): void => {
    const canvas = this._renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height, false);
  };

  private readonly _onPointerDown = (event: PointerEvent): void => {
    const hit = this._pickObject(event);
    if (!hit) {
      if (this._heldObject) {
        this._heldObject.held = false;
        this._heldObject = null;
      }
      this._emitStatus();
      return;
    }

    if (hit.kind === 'knife') {
      this._pickUpObject(hit, event);
      this._emitStatus();
      return;
    }

    if (hit.kind === 'pan' || hit.kind === 'oven') {
      if (this._heldObject?.cuttable) {
        this._placeHeldObject(hit.kind);
        this._emitStatus();
      }
      return;
    }

    if (hit.cuttable && this._heldObject?.kind === 'knife' && !hit.cut) {
      this._cutIngredient(hit);
      this._emitStatus();
      return;
    }

    if (hit.cuttable) {
      this._pickUpObject(hit, event);
      this._emitStatus();
    }
  };

  private readonly _onPointerMove = (event: PointerEvent): void => {
    if (!this._heldObject) {
      return;
    }

    this._moveHeldObjectToPointer(event);
  };

  private _pickUpObject(object: GameObject, event: PointerEvent): void {
    if (this._heldObject && this._heldObject !== object) {
      this._heldObject.held = false;
    }

    this._heldObject = object;
    object.held = true;
    this._moveHeldObjectToPointer(event);
  }

  private _moveHeldObjectToPointer(event: PointerEvent): void {
    if (!this._heldObject) {
      return;
    }

    this._updatePointer(event);
    this._raycaster.setFromCamera(this._pointer, this._camera);
    const intersection = this._raycaster.intersectObject(this._dragPlaneMesh)[0];
    if (!intersection) {
      return;
    }

    this._heldObject.mesh.position.copy(intersection.point);
    this._heldObject.mesh.position.y = this._heldObject.kind === 'knife' ? 0.98 : 0.95;
  }

  private _pickObject(event: PointerEvent): GameObject | null {
    this._updatePointer(event);
    this._raycaster.setFromCamera(this._pointer, this._camera);
    const meshes = this._objects.map((object) => object.mesh);
    const hits = this._raycaster.intersectObjects(meshes, true);
    const object = hits[0]?.object;
    if (!object) {
      return null;
    }
    return this._gameObjectFromObject3D(object);
  }

  private _gameObjectFromObject3D(object: Object3D): GameObject | null {
    let current: Object3D | null = object;
    while (current) {
      const match = this._objects.find((gameObject) => gameObject.mesh === current);
      if (match) {
        return match;
      }
      current = current.parent;
    }
    return null;
  }

  private _updatePointer(event: PointerEvent): void {
    const rect = this._renderer.domElement.getBoundingClientRect();
    this._pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this._pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private _cutIngredient(object: GameObject): void {
    object.cut = true;
    const position = object.mesh.position.clone();
    this._scene.remove(object.mesh);

    const left = this._createIngredientMesh(object.kind as IngredientKind, 0.55);
    const right = this._createIngredientMesh(object.kind as IngredientKind, 0.55);
    left.position.copy(position).add(new Vector3(-0.12, 0, 0));
    right.position.copy(position).add(new Vector3(0.12, 0, 0));
    left.castShadow = true;
    right.castShadow = true;

    this._objects.splice(this._objects.indexOf(object), 1);
    this._registerObject(left, object.kind, true);
    this._registerObject(right, object.kind, true);
    this._objects[this._objects.length - 1].cut = true;
    this._objects[this._objects.length - 2].cut = true;
  }

  private _placeHeldObject(target: 'pan' | 'oven'): void {
    if (!this._heldObject) {
      return;
    }

    const object = this._heldObject;
    object.held = false;
    this._heldObject = null;

    if (target === 'pan') {
      object.mesh.position.set(1.8, 1.05, 0.2);
      object.mesh.scale.setScalar(0.75);
      return;
    }

    object.mesh.position.set(2.8, 1.35, -0.55);
    object.mesh.scale.setScalar(0.7);
    const material = (object.mesh as Mesh).material as MeshStandardMaterial;
    material.emissive = new Color(0x7c2d12);
    material.emissiveIntensity = 0.35;
  }

  private _animate = (): void => {
    if (this._disposed) {
      return;
    }
    this._animationId = requestAnimationFrame(this._animate);
    this._renderer.render(this._scene, this._camera);
  };
}
