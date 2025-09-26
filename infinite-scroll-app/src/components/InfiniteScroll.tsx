import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import './InfiniteScroll.css';

gsap.registerPlugin(Observer);

interface InfiniteScrollProps {
  width?: string;
  maxHeight?: string;
  negativeMargin?: string;
  items?: { content: React.ReactNode }[];
  itemMinHeight?: number;
  isTilted?: boolean;
  tiltDirection?: 'left' | 'right';
  autoplay?: boolean;
  autoplaySpeed?: number;
  autoplayDirection?: 'up' | 'down';
  pauseOnHover?: boolean;
}

export default function InfiniteScroll({
  width = '30rem',
  maxHeight = '100%',
  negativeMargin = '-0.5em',
  items = [],
  itemMinHeight = 150,
  isTilted = false,
  tiltDirection = 'left',
  autoplay = false,
  autoplaySpeed = 0.5,
  autoplayDirection = 'down',
  pauseOnHover = false
}: InfiniteScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current || items.length === 0) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const allItems = gsap.utils.toArray<HTMLElement>('.infinite-scroll-item');

    let totalHeight = 0;
    allItems.forEach(item => {
      totalHeight += item.offsetHeight;
    });

    const spacing = parseFloat(negativeMargin) || 0;
    const adjustedHeight = totalHeight + (spacing * allItems.length);

    allItems.forEach(item => {
      const clone = item.cloneNode(true) as HTMLElement;
      container.appendChild(clone);
    });

    let y = 0;
    let animationId: number | null = null;

    const updatePosition = (delta: number) => {
      y += delta;
      const maxY = adjustedHeight;

      if (y > maxY) {
        y = y % maxY;
      } else if (y < 0) {
        y = maxY + (y % maxY);
      }

      gsap.set(container, { y: -y });
    };

    let isPaused = false;

    if (autoplay) {
      const animate = () => {
        if (!isPaused) {
          const delta = autoplayDirection === 'down' ? autoplaySpeed : -autoplaySpeed;
          updatePosition(delta);
        }
        animationId = requestAnimationFrame(animate);
      };
      animate();

      if (pauseOnHover) {
        wrapper.addEventListener('mouseenter', () => { isPaused = true; });
        wrapper.addEventListener('mouseleave', () => { isPaused = false; });
      }
    }

    let startY = 0;
    let isDragging = false;

    const observer = Observer.create({
      target: wrapper,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onWheel: (e) => {
        updatePosition(e.deltaY);
      },
      onDragStart: (e) => {
        isDragging = true;
        startY = e.y ?? 0;
        container.style.cursor = 'grabbing';
      },
      onDrag: (e) => {
        if (isDragging && e.y !== undefined) {
          const deltaY = startY - e.y;
          startY = e.y;
          updatePosition(-deltaY);
        }
      },
      onDragEnd: () => {
        isDragging = false;
        container.style.cursor = 'grab';
      },
      tolerance: 10,
      preventDefault: true
    });

    return () => {
      observer.kill();
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      const clonedItems = container.querySelectorAll('.infinite-scroll-item');
      const halfLength = Math.floor(clonedItems.length / 2);
      for (let i = halfLength; i < clonedItems.length; i++) {
        clonedItems[i].remove();
      }
    };
  }, [items, negativeMargin, autoplay, autoplaySpeed, autoplayDirection, pauseOnHover]);

  const tiltStyle = isTilted ? {
    transform: tiltDirection === 'left'
      ? 'perspective(1000px) rotateX(20deg) rotateZ(-20deg) skewX(20deg)'
      : 'perspective(1000px) rotateX(20deg) rotateZ(20deg) skewX(-20deg)'
  } : {};

  return (
    <>
      <style>{`
        .infinite-scroll-wrapper {
          width: ${width};
          max-height: ${maxHeight};
        }
        .infinite-scroll-item {
          margin-bottom: ${negativeMargin};
        }
      `}</style>
      <div
        className="infinite-scroll-wrapper"
        ref={wrapperRef}
        style={tiltStyle}
      >
        <div
          className="infinite-scroll-container"
          ref={containerRef}
        >
          {items.map((item, i) => (
            <div className="infinite-scroll-item" key={i}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}