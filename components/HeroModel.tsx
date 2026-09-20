"use client";

import { type RefObject, useEffect, useRef } from "react";
import { assetPath } from "@/lib/asset-path";

type HeroModelProps = {
  interactionRoot: RefObject<HTMLDivElement | null>;
};

export function HeroModel({ interactionRoot }: HeroModelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = interactionRoot.current;
    if (!canvas || !root) return;

    let disposed = false;
    let stop = () => undefined;

    void (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.5, 7.4);
      const target = new THREE.Vector3(0, -0.3, 0);
      scene.add(new THREE.HemisphereLight(0xc7f7ff, 0x0b4b9c, 2.5));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
      keyLight.position.set(3, 5, 5);
      scene.add(keyLight);

      let model: import("three").Object3D | undefined;
      let frame = 0;
      let pointerX = 0;
      let pointerY = 0;
      let initialized = false;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      const resize = () => {
        const { width, height } = root.getBoundingClientRect();
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const updatePointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || reducedMotion.matches) return;
        const bounds = root.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      };

      const render = () => {
        if (disposed) return;
        if (model && !reducedMotion.matches) {
          model.rotation.y += (pointerX * 0.035 - model.rotation.y) * 0.035;
          model.rotation.x += ((pointerY * 0.035) - model.rotation.x) * 0.035;
          camera.position.x += (pointerX * 0.26 - camera.position.x) * 0.028;
          camera.position.y += (0.5 + pointerY * -0.16 - camera.position.y) * 0.028;
        }
        camera.lookAt(target);
        renderer.render(scene, camera);
        if (!reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(render);
      };

      const renderStaticFrame = () => {
        if (!disposed) {
          camera.lookAt(target);
          renderer.render(scene, camera);
        }
      };

      const handleMotionPreference = () => {
        if (reducedMotion.matches) {
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
          renderStaticFrame();
        } else if (!frame) {
          render();
        }
      };

      const loader = new GLTFLoader();
      loader.load(
        assetPath("/assets/fly-akeed-los-angeles.glb"),
        (gltf) => {
          if (disposed) return;
          model = gltf.scene;
          const bounds = new THREE.Box3().setFromObject(model);
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const scale = 14 / Math.max(size.x, size.y, size.z, 0.001);
          model.scale.setScalar(scale);
          model.position.set(-center.x * scale, -center.y * scale - 0.8, -center.z * scale);
          model.rotation.y = 0;
          model.traverse((object) => {
            object.castShadow = false;
            object.receiveShadow = false;
          });
          scene.add(model);
          initialized = true;
          canvas.classList.add("hero__model--ready");
          if (reducedMotion.matches) renderStaticFrame();
          else render();
        },
        undefined,
        () => canvas.classList.add("hero__model--failed")
      );

      const observer = new ResizeObserver(resize);
      observer.observe(root);
      root.addEventListener("pointermove", updatePointer);
      reducedMotion.addEventListener("change", handleMotionPreference);
      resize();

      stop = () => {
        disposed = true;
        if (frame) cancelAnimationFrame(frame);
        observer.disconnect();
        root.removeEventListener("pointermove", updatePointer);
        reducedMotion.removeEventListener("change", handleMotionPreference);
        if (initialized) scene.remove(model!);
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      stop();
    };
  }, [interactionRoot]);

  return <canvas ref={canvasRef} className="hero__model" aria-hidden="true" />;
}
