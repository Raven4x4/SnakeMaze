import { useRef, useEffect, useCallback } from 'react';

export const useCanvas = (
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
  dependencies: any[] = []
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Call the drawing function
    draw(ctx, canvas);
  }, [draw]);

  useEffect(() => {
    redraw();
  }, [redraw, ...dependencies]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Set canvas size to match container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    redraw();
  }, [redraw]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  return { canvasRef, redraw };
};
