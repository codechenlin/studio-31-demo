
"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function SphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gradients = useMemo(() => {
    if (typeof window === 'undefined') return [];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    
    const purpleBlueGradient = ctx.createLinearGradient(0, 0, 1, 0);
    purpleBlueGradient.addColorStop(0, '#AD00EC');
    purpleBlueGradient.addColorStop(1, '#1700E6');
    
    const greenYellowGradient = ctx.createLinearGradient(0, 0, 1, 0);
    greenYellowGradient.addColorStop(0, '#00CE07');
    greenYellowGradient.addColorStop(1, '#A6EE00');

    return [purpleBlueGradient, greenYellowGradient];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gradients.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth / 2;
    let height = canvas.height = window.innerHeight;

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth / 2;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeHandler);

    const dots: {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      color: CanvasGradient | string;
    }[] = [];

    const dotCount = 800;
    const dotRadius = 1.5;
    const sphereRadius = Math.min(width, height) * 0.35;
    const fov = 300;
    
    let mouse = { x: 0, y: 0 };
    const mouseMoveHandler = (e: MouseEvent) => {
        // Adjust mouse coordinates based on canvas position
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left - width / 2;
        mouse.y = e.clientY - rect.top - height / 2;
    };
    document.addEventListener('mousemove', mouseMoveHandler);

    for (let i = 0; i < dotCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      dots.push({
        x: sphereRadius * Math.sin(phi) * Math.cos(theta),
        y: sphereRadius * Math.sin(phi) * Math.sin(theta),
        z: sphereRadius * Math.cos(phi),
        vx: 0.1 * (Math.random() - 0.5),
        vy: 0.1 * (Math.random() - 0.5),
        vz: 0.1 * (Math.random() - 0.5),
        color: gradients[i % 2],
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.save();
      ctx.clearRect(0, 0, width, height);
      ctx.translate(width / 2, height / 2);
      
      const rotX = mouse.y * 0.0001;
      const rotY = mouse.x * 0.0001;

      dots.forEach(dot => {
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);

        const y1 = dot.y * cosX - dot.z * sinX;
        const z1 = dot.z * cosX + dot.y * sinX;
        const x1 = dot.x * cosY - z1 * sinY;
        const z2 = z1 * cosY + dot.x * sinY;
        
        const scale = fov / (fov + z2);

        if (scale > 0) {
          ctx.beginPath();
          ctx.arc(x1 * scale, y1 * scale, dotRadius * scale, 0, 2 * Math.PI);
          const opacity = Math.max(0, Math.min(1, scale * 1.5));
          ctx.fillStyle = dot.color;
          ctx.globalAlpha = opacity;
          ctx.fill();
        }
      });
      ctx.restore();
    }

    function update() {
       dots.forEach(dot => {
          dot.x += dot.vx;
          dot.y += dot.vy;
          dot.z += dot.vz;
           
          const distSq = dot.x*dot.x + dot.y*dot.y + dot.z*dot.z;
          if (distSq > sphereRadius * sphereRadius) {
              const theta = Math.random() * 2 * Math.PI;
              const phi = Math.acos((Math.random() * 2) - 1);
              dot.x = sphereRadius * Math.sin(phi) * Math.cos(theta);
              dot.y = sphereRadius * Math.sin(phi) * Math.sin(theta);
              dot.z = sphereRadius * Math.cos(phi);
          }
       });
    }

    let animationFrameId: number;
    function animate() {
      update();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();
      
    return () => {
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      cancelAnimationFrame(animationFrameId);
    };

  }, [gradients]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30 pointer-events-none" />;
}
