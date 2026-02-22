import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function SlideViewer({ slides, title, source }) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(slides.length - 1, c + 1)), [slides.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next]);

  const progressPct = ((current + 1) / slides.length) * 100;

  return (
    <>
      {/* ── Slideshow Card ── */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#f8fafc'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{title}</div>
            {source && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{source}</div>}
          </div>
          <button
            onClick={() => setFullscreen(true)}
            title="Tam ekran"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', color: '#64748b', background: 'none',
              border: '1px solid #e2e8f0', borderRadius: '8px',
              padding: '6px 10px', cursor: 'pointer'
            }}
          >
            <Maximize2 style={{ width: '13px', height: '13px' }} />
            Tam Ekran
          </button>
        </div>

        {/* Slide Image */}
        <div style={{
          backgroundColor: '#0f172a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '360px', position: 'relative', userSelect: 'none'
        }}>
          {/* Prev overlay */}
          <button
            onClick={prev}
            disabled={current === 0}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px',
              background: 'transparent', border: 'none', cursor: current === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: current === 0 ? 0.2 : 0.7,
              transition: 'opacity 0.15s', zIndex: 2
            }}
            onMouseOver={(e) => { if (current > 0) e.currentTarget.style.opacity = '1'; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = current === 0 ? '0.2' : '0.7'; }}
          >
            <ChevronLeft style={{ width: '28px', height: '28px', color: 'white' }} />
          </button>

          <img
            src={slides[current]}
            alt={`Slayt ${current + 1}`}
            style={{
              maxWidth: '100%', maxHeight: '500px',
              objectFit: 'contain', display: 'block'
            }}
          />

          {/* Next overlay */}
          <button
            onClick={next}
            disabled={current === slides.length - 1}
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px',
              background: 'transparent', border: 'none',
              cursor: current === slides.length - 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: current === slides.length - 1 ? 0.2 : 0.7,
              transition: 'opacity 0.15s', zIndex: 2
            }}
            onMouseOver={(e) => { if (current < slides.length - 1) e.currentTarget.style.opacity = '1'; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = current === slides.length - 1 ? '0.2' : '0.7'; }}
          >
            <ChevronRight style={{ width: '28px', height: '28px', color: 'white' }} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', backgroundColor: '#f1f5f9' }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
            transition: 'width 0.25s ease'
          }} />
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px'
        }}>
          <button
            onClick={prev}
            disabled={current === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 500,
              color: current === 0 ? '#cbd5e1' : '#475569',
              background: 'none', border: 'none',
              cursor: current === 0 ? 'default' : 'pointer'
            }}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} />
            Önceki
          </button>

          {/* Slide dots — max 15 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '20px' : '7px',
                  height: '7px',
                  borderRadius: '4px',
                  backgroundColor: i === current ? '#2563eb' : '#cbd5e1',
                  border: 'none', cursor: 'pointer',
                  padding: 0, transition: 'all 0.2s'
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            {current + 1} / {slides.length}
          </span>

          <button
            onClick={next}
            disabled={current === slides.length - 1}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 500,
              color: current === slides.length - 1 ? '#cbd5e1' : '#475569',
              background: 'none', border: 'none',
              cursor: current === slides.length - 1 ? 'default' : 'pointer'
            }}
          >
            Sonraki
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>

      {/* ── Fullscreen Overlay ── */}
      {fullscreen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setFullscreen(false); }}
        >
          {/* Close */}
          <button
            onClick={() => setFullscreen(false)}
            style={{
              position: 'absolute', top: '20px', right: '24px',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>

          {/* Title */}
          <div style={{ position: 'absolute', top: '22px', left: '24px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            {title} · {current + 1} / {slides.length}
          </div>

          {/* Image */}
          <img
            src={slides[current]}
            alt={`Slayt ${current + 1}`}
            style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain' }}
          />

          {/* Arrows */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
            <button
              onClick={prev}
              disabled={current === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: current === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                color: current === 0 ? 'rgba(255,255,255,0.3)' : 'white',
                border: 'none', borderRadius: '10px', padding: '10px 20px',
                fontSize: '14px', fontWeight: 500,
                cursor: current === 0 ? 'default' : 'pointer'
              }}
            >
              <ChevronLeft style={{ width: '18px', height: '18px' }} />
              Önceki
            </button>
            <button
              onClick={next}
              disabled={current === slides.length - 1}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: current === slides.length - 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                color: current === slides.length - 1 ? 'rgba(255,255,255,0.3)' : 'white',
                border: 'none', borderRadius: '10px', padding: '10px 20px',
                fontSize: '14px', fontWeight: 500,
                cursor: current === slides.length - 1 ? 'default' : 'pointer'
              }}
            >
              Sonraki
              <ChevronRight style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
