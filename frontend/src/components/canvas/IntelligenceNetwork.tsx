import React, { useEffect, useRef } from 'react';

interface IntelligenceNetworkProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  type: 'intel' | 'beacon' | 'anomaly';
}

export const IntelligenceNetwork: React.FC<IntelligenceNetworkProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse coordinates for subtle interactive deflection
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 140,
    };

    let nodes: Node[] = [];

    const initNodes = () => {
      // Scale node count by viewport area, constrained between 16 (mobile) and 55 (desktop)
      const count = Math.min(55, Math.max(16, Math.floor((width * height) / 24000)));
      nodes = [];

      for (let i = 0; i < count; i++) {
        // ~10% anomaly nodes, ~25% beacon nodes, remainder standard telemetry intel
        const rand = Math.random();
        const type: Node['type'] = rand > 0.9 ? 'anomaly' : rand > 0.65 ? 'beacon' : 'intel';

        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: type === 'anomaly' ? 2.5 : type === 'beacon' ? 2.0 : 1.4,
          alpha: 0.35 + Math.random() * 0.5,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          type,
        });
      }
    };

    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initNodes();

      if (prefersReducedMotion) {
        drawFrame(0);
      }
    };

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const maxDistance = width < 768 ? 95 : 130;
      const maxDistanceSq = maxDistance * maxDistance;

      // 1. Draw connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / maxDistance;
            const alpha = factor * 0.22;

            // Anomaly edges have a subtle coral tint, standard have cyan
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);

            if (nodeA.type === 'anomaly' || nodeB.type === 'anomaly') {
              ctx.strokeStyle = `rgba(248, 113, 113, ${alpha * 1.2})`;
            } else {
              ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            }

            ctx.lineWidth = 1;
            ctx.stroke();

            // Render a subtle pulse packet traversing high-affinity connections
            if (!prefersReducedMotion && factor > 0.75) {
              const pulsePos = ((time * 0.0008 + (i + j) * 0.2) % 1);
              const px = nodeA.x + dx * pulsePos;
              const py = nodeA.y + dy * pulsePos;
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(45, 212, 191, ${alpha * 2})`;
              ctx.fill();
            }
          }
        }
      }

      // 2. Draw nodes and apply gentle kinematics
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          // Update pulse
          node.pulsePhase += node.pulseSpeed;

          // Mouse proximity influence (gentle deflection)
          const mdx = node.x - mouse.x;
          const mdy = node.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.radius && mdist > 0) {
            const force = (1 - mdist / mouse.radius) * 0.7;
            node.vx += (mdx / mdist) * force * 0.15;
            node.vy += (mdy / mdist) * force * 0.15;
          }

          // Friction / drag
          node.vx *= 0.985;
          node.vy *= 0.985;

          // Natural minimum drift
          if (Math.abs(node.vx) < 0.1) node.vx += (Math.random() - 0.5) * 0.04;
          if (Math.abs(node.vy) < 0.1) node.vy += (Math.random() - 0.5) * 0.04;

          node.x += node.vx;
          node.y += node.vy;

          // Boundary bounce / wrap
          if (node.x < -10) node.x = width + 10;
          else if (node.x > width + 10) node.x = -10;
          if (node.y < -10) node.y = height + 10;
          else if (node.y > height + 10) node.y = -10;
        }

        // Draw node dot
        const pulsingRadius = node.radius + (prefersReducedMotion ? 0 : Math.sin(node.pulsePhase) * 0.4);
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.8, pulsingRadius), 0, Math.PI * 2);

        if (node.type === 'anomaly') {
          ctx.fillStyle = `rgba(248, 113, 113, ${node.alpha * 0.9})`;
          ctx.shadowColor = 'rgba(248, 113, 113, 0.4)';
          ctx.shadowBlur = 6;
        } else if (node.type === 'beacon') {
          ctx.fillStyle = `rgba(45, 212, 191, ${node.alpha * 0.95})`;
          ctx.shadowColor = 'rgba(45, 212, 191, 0.5)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(34, 211, 238, ${node.alpha * 0.8})`;
          ctx.shadowColor = 'rgba(34, 211, 238, 0.3)';
          ctx.shadowBlur = 4;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for efficiency
      }
    };

    const loop = (timestamp: number) => {
      if (!isVisible) return;
      drawFrame(timestamp);
      animationFrameId = requestAnimationFrame(loop);
    };

    // Mouse listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Visibility and Intersection observers for extreme performance
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isVisible = true;
        if (!prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(loop);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            if (!prefersReducedMotion) {
              animationFrameId = requestAnimationFrame(loop);
            }
          }
        } else {
          isVisible = false;
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Resize listener
    window.addEventListener('resize', handleResize);
    handleResize();

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full opacity-60" />
      {/* Subtle radial vignette gradient to blend smoothly into background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(8, 13, 24, 0) 30%, rgba(8, 13, 24, 0.85) 85%, #080D18 100%)',
        }}
      />
    </div>
  );
};
