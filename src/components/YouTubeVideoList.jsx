import { useState } from 'react';
import { ExternalLink, PlayCircle, AlertCircle, Clock } from 'lucide-react';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} gün önce`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} ay önce`;
  return `${Math.floor(diff / 31536000)} yıl önce`;
}

function VideoCard({ video, color }) {
  const { title, channelTitle, publishedAt, thumbnail, url } = video;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        gap: '18px',
        alignItems: 'center',
        textDecoration: 'none',
        transition: 'all 0.2s',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = color + '90';
        e.currentTarget.style.boxShadow = `0 6px 20px ${color}20`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail — 16:9 */}
      <div style={{
        width: '180px', height: '101px', flexShrink: 0,
        borderRadius: '10px', overflow: 'hidden', backgroundColor: '#0f172a',
      }}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlayCircle style={{ width: '36px', height: '36px', color: 'rgba(255,255,255,0.5)' }} />
          </div>
        )}
      </div>

      {/* İçerik */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '15px', fontWeight: 600, color: '#0f172a',
          marginBottom: '8px', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            {channelTitle}
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock style={{ width: '12px', height: '12px' }} />
            {timeAgo(publishedAt)}
          </span>
        </div>
      </div>

      <ExternalLink style={{ width: '18px', height: '18px', color: '#cbd5e1', flexShrink: 0 }} />
    </a>
  );
}

function VideoList({ keyword, language, accentColor }) {
  const color = accentColor || '#f59e0b';
  const { videos, loading, error } = useYouTubeSearch(keyword, language);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            backgroundColor: 'white', border: '1px solid #e2e8f0',
            borderRadius: '16px', padding: '16px 20px',
            display: 'flex', gap: '18px', alignItems: 'center'
          }}>
            <div style={{ width: '180px', height: '101px', flexShrink: 0, backgroundColor: '#f1f5f9', borderRadius: '10px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: '16px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '10px', width: '85%' }} />
              <div style={{ height: '16px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '10px', width: '60%' }} />
              <div style={{ height: '13px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '35%' }} />
            </div>
          </div>
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '20px 24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <AlertCircle style={{ width: '20px', height: '20px', color: '#ea580c', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ color: '#9a3412', fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>Video yüklenemedi</p>
          <p style={{ color: '#c2410c', fontSize: '13px', margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '40px 32px', textAlign: 'center' }}>
        <PlayCircle style={{ width: '44px', height: '44px', color: '#cbd5e1', margin: '0 auto 14px' }} />
        <p style={{ color: '#475569', fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>
          Henüz onaylı video yok
        </p>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
          Bu araç için {language === 'tr' ? 'Türkçe' : 'İngilizce'} video henüz eklenmemiş.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {videos.map(video => (
        <VideoCard key={video.videoId} video={video} color={color} />
      ))}
    </div>
  );
}

export default function YouTubeVideoList({ keyword, accentColor }) {
  const [lang, setLang] = useState('tr');
  const color = accentColor || '#f59e0b';

  const tabStyle = (active) => ({
    padding: '7px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px',
    transition: 'all 0.15s',
    backgroundColor: active ? color : '#f1f5f9',
    color: active ? 'white' : '#64748b',
    boxShadow: active ? `0 2px 8px ${color}40` : 'none',
  });

  return (
    <div>
      {/* Dil sekmeleri */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button onClick={() => setLang('tr')} style={tabStyle(lang === 'tr')}>
          🇹🇷 Türkçe
        </button>
        <button onClick={() => setLang('en')} style={tabStyle(lang === 'en')}>
          🌐 İngilizce
        </button>
      </div>

      <VideoList keyword={keyword} language={lang} accentColor={accentColor} />
    </div>
  );
}
