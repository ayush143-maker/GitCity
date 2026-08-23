import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CameraTarget } from '@/types';

interface CameraControllerProps {
  target: CameraTarget;
  clearTarget: () => void;
}

export function CameraController({ target, clearTarget }: CameraControllerProps) {
  const { camera } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef({ x: 0, y: 0 });
  const isPointerLocked = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.code);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isPointerLocked.current) {
        rotation.current.y -= e.movementX * 0.002;
        rotation.current.x -= e.movementY * 0.002;
        rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x));
      }
    };
    const handleClick = () => {
      document.body.requestPointerLock?.();
    };
    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === document.body;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  useEffect(() => {
    if (target) {
      camera.position.set(...target.position);
      if (target.lookAt) {
        camera.lookAt(new THREE.Vector3(...target.lookAt));
      }
      clearTarget();
    }
  }, [target, camera, clearTarget]);

  useFrame((_, delta) => {
    const speed = 50;
    const damping = 0.85;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const move = new THREE.Vector3();

    if (keys.current.has('KeyW')) move.add(forward);
    if (keys.current.has('KeyS')) move.sub(forward);
    if (keys.current.has('KeyD')) move.add(right);
    if (keys.current.has('KeyA')) move.sub(right);
    if (keys.current.has('Space')) move.y += 1;
    if (keys.current.has('ShiftLeft')) move.y -= 1;

    if (move.length() > 0) {
      move.normalize().multiplyScalar(speed * delta);
      velocity.current.add(move);
    }

    velocity.current.multiplyScalar(damping);
    camera.position.add(velocity.current);

    if (isPointerLocked.current) {
      camera.rotation.order = 'YXZ';
      camera.rotation.x = rotation.current.x;
      camera.rotation.y = rotation.current.y;
    }
  });

  return null;
}
