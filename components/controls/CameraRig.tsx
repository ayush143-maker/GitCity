'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { CITY } from '@/lib/demoCity';

export type ControlState = {
  moveX: number;
  moveY: number;
  lookX: number;
  lookY: number;
  altitude: number;
  camX: number;
  camY: number;
  camZ: number;
};

const BOUND = CITY.size / 2;

export function CameraRig({
  controls,
}: {
  controls: React.MutableRefObject<ControlState>;
}) {
  const { camera } = useThree();

  const yaw = useRef(0);
  const pitch = useRef(-0.36);

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false,
  });

  const vel = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));
  const targetVel = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.rotation.order = 'YXZ';
    camera.rotation.x = pitch.current;
    camera.rotation.y = yaw.current;

    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space') e.preventDefault();

      if (e.code === 'KeyW') keys.current.w = true;
      if (e.code === 'KeyA') keys.current.a = true;
      if (e.code === 'KeyS') keys.current.s = true;
      if (e.code === 'KeyD') keys.current.d = true;
      if (e.code === 'Space') keys.current.space = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight')
        keys.current.shift = true;
    };

    const upHandler = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') keys.current.w = false;
      if (e.code === 'KeyA') keys.current.a = false;
      if (e.code === 'KeyS') keys.current.s = false;
      if (e.code === 'KeyD') keys.current.d = false;
      if (e.code === 'Space') keys.current.space = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight')
        keys.current.shift = false;
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', upHandler);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.08);
    const c = controls.current;

    yaw.current -= c.lookX * 0.0021;
    pitch.current -= c.lookY * 0.0021;
    pitch.current = THREE.MathUtils.clamp(pitch.current, -1.25, 0.55);

    c.lookX = 0;
    c.lookY = 0;

    camera.rotation.order = 'YXZ';
    camera.rotation.x = pitch.current;
    camera.rotation.y = yaw.current;
    camera.rotation.z = 0;

    camera.getWorldDirection(dir.current);
    dir.current.y = 0;

    if (dir.current.lengthSq() < 0.0001) {
      dir.current.set(0, 0, -1);
    }

    dir.current.normalize();

    right.current.crossVectors(dir.current, up.current).normalize();

    let inputX =
      c.moveX + (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0);

    let inputY =
      c.moveY + (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0);

    const inputAlt =
      c.altitude +
      (keys.current.space ? 1 : 0) -
      (keys.current.shift ? 1 : 0);

    const len = Math.hypot(inputX, inputY);

    if (len > 1) {
      inputX /= len;
      inputY /= len;
    }

    const speed = 46;

    targetVel.current.set(0, 0, 0);
    targetVel.current.addScaledVector(dir.current, inputY * speed);
    targetVel.current.addScaledVector(right.current, inputX * speed);
    targetVel.current.y = inputAlt * speed * 0.72;

    vel.current.lerp(targetVel.current, 1 - Math.exp(-4.4 * dt));

    camera.position.addScaledVector(vel.current, dt);

    // Invisible rectangular boundary
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -BOUND, BOUND);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -BOUND, BOUND);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, 2.5, 260);

    c.camX = camera.position.x;
    c.camY = camera.position.y;
    c.camZ = camera.position.z;
  });

  return null;
}
