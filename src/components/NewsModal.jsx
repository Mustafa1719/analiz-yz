import React, { useState, useEffect } from 'react';
import { X, Clock, Play, TrendingUp, ExternalLink, RefreshCw, Youtube, ChevronDown } from 'lucide-react';

// Kanal listesi
const CHANNELS = [
  // Bilgi Odaklı
  {
    id: 'cicek',
    name: 'Çiçek ile Teknoloji',
    channelId: 'UCLGTx8RPgoB7DpsfQz8aBcA',
    youtubeUrl: 'https://www.youtube.com/@cicekteknoloji',
    flag: '🇹🇷',
    category: 'knowledge',
    description: 'Yapay zeka ve teknoloji dünyasındaki son gelişmeler'
  },
  {
    id: 'harun',
    name: 'Harun Seyhan',
    channelId: 'UCyfmdbYiR9HEy9nEUX2DU5w',
    youtubeUrl: 'https://www.youtube.com/@harun_seyhan',
    flag: '🇹🇷',
    category: 'knowledge',
    description: 'Yapay zeka haberlerini Türkçe takip et'
  },
  {
    id: 'erhan',
    name: 'Erhan Meydan',
    channelId: 'UC6E0xxW6o3QacO-rx71x26Q',
    youtubeUrl: 'https://www.youtube.com/@erhanmeydan',
    flag: '🇹🇷',
    category: 'knowledge',
    description: 'Yapay zeka araçları ve pratik uygulamalar'
  },
  // Beceri Odaklı
  {
    id: 'mustafa',
    name: 'Mustafa Aydın',
    channelId: 'UCIHorV2cg0edmU6va8Sr7CQ',
    youtubeUrl: 'https://www.youtube.com/@mustafa1aydin',
    flag: '🇹🇷',
    category: 'skill',
    description: 'Yapay zeka ile iş süreçleri ve otomasyon',
    priority: true
  },
  {
    id: 'julian',
    name: 'Julian Goldie',
    channelId: 'UCGpsgNbzdF7BECCVbB1COHw',
    youtubeUrl: 'https://www.youtube.com/@JulianGoldieSEO',
    flag: '🇬🇧',
    category: 'skill',
    description: 'YZ ile SEO ve içerik stratejileri'
  },
  {
    id: 'nate',
    name: 'Nate Herk',
    channelId: 'UC2ojq-nuP8ceeHqiroeKhBA',
    youtubeUrl: 'https://www.youtube.com/@nateherk',
    flag: '🇺🇸',
    category: 'skill',
    description: 'YZ otomasyon ve üretkenlik ipuçları'
  },
  {
    id: 'surya',
    name: 'Surya Kunju',
    channelId: 'UCz80JEs56coMRDd5OzYe_lw',
    youtubeUrl: 'https://www.youtube.com/@suryakunju',
    flag: '🇮🇳',
    category: 'skill',
    description: 'YZ araçları ve otomasyon eğitimleri'
  },
  {
    id: 'aiworkflow',
    name: 'Your AI Workflow',
    channelId: 'UCI4xxi0p97BghIqgEPYx6sw',
    youtubeUrl: 'https://www.youtube.com/@youraiworkflow',
    flag: '🇺🇸',
    category: 'skill',
    description: 'Pratik YZ iş akışı çözümleri'
  }
];

const CATEGORIES = [
  { id: 'knowledge', name: 'Bilgi Odaklı', icon: '📰' },
  { id: 'skill', name: 'Beceri Odaklı', icon: '🎯' }
];

// Yedek veriler (n8n bağlantısı yoksa)
const sampleNews = [
  {
    id: 1,
    author: "Yükleniyor...",
    authorCategory: "YouTube",
    title: "Yapay Zeka Haberleri - Yükleniyor...",
    readTime: "Video",
    url: "#"
  }
];

const NewsModal = ({ isOpen, onClose }) => {
  const [news, setNews] = useState(sampleNews);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('knowledge');
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);

  // Seçili kategorideki kanalları filtrele
  const filteredChannels = CHANNELS.filter(ch => ch.category === selectedCategory);

  // n8n webhook'tan videoları çek
  const fetchNews = async (channel = selectedChannel) => {
    setLoading(true);
    try {
      const response = await fetch('https://mustafaaydinlabmind.app.n8n.cloud/webhook/youtube-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: channel.channelId })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.videos) {
          const now = new Date();
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

          // Son 3 ay içindeki videoları filtrele
          const recentVideos = data.videos.filter(video => {
            const videoDate = new Date(video.pubDate);
            return videoDate >= threeMonthsAgo;
          });

          const formattedNews = recentVideos.slice(0, 15).map((video, index) => ({
            id: index + 1,
            author: channel.name,
            authorCategory: 'YouTube',
            title: video.title,
            readTime: formatDate(video.pubDate),
            url: video.link,
            isShort: video.link?.includes('/shorts/'),
            description: video.description || ''
          }));

          if (formattedNews.length > 0) {
            setNews(formattedNews);
            setLastUpdated(new Date());
          } else {
            setNews([{
              id: 1,
              author: channel.name,
              authorCategory: 'YouTube',
              title: 'Bu hafta yeni video yok',
              readTime: '-',
              url: channel.youtubeUrl
            }]);
            setLastUpdated(new Date());
          }
        }
      }
    } catch (error) {
      console.log('Veri çekilemedi:', error);
      setNews(sampleNews);
    }
    setLoading(false);
  };

  // Kategori değişince ilk kanalı seç
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const firstChannelInCategory = CHANNELS.find(ch => ch.category === categoryId);
    if (firstChannelInCategory) {
      setSelectedChannel(firstChannelInCategory);
      fetchNews(firstChannelInCategory);
    }
  };

  // Kanal değişince yeniden çek
  const handleChannelChange = (channel) => {
    setSelectedChannel(channel);
    setShowChannelDropdown(false);
    fetchNews(channel);
  };

  // YouTube video ID'sini link'ten çıkar
  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : null;
  };

  // Video thumbnail URL'i oluştur
  const getThumbnailUrl = (url) => {
    const videoId = getVideoId(url);
    return videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  // Tarih formatla
  const formatDate = (dateString) => {
    if (!dateString) return 'Video';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  useEffect(() => {
    if (isOpen) {
      fetchNews(selectedChannel);
    }
  }, [isOpen]);

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = () => setShowChannelDropdown(false);
    if (showChannelDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showChannelDropdown]);

  
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '28px 32px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to bottom, #ffffff, #fafbfc)'
        }}>
          {/* Title Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255, 0, 0, 0.2)'
              }}>
                <Youtube style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <h2 style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#1a1a1a',
                margin: 0,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}>
                Güncel Haberler
              </h2>
            </div>
          </div>

          {/* Categories and Channel Selector Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {/* Kategori Seçici */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: selectedCategory === cat.id ? '#ffffff' : '#6b7280',
                    background: selectedCategory === cat.id
                      ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                      : '#ffffff',
                    border: selectedCategory === cat.id ? 'none' : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    padding: '10px 20px',
                    transition: 'all 0.2s',
                    boxShadow: selectedCategory === cat.id
                      ? '0 4px 12px rgba(37, 99, 235, 0.25)'
                      : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat.id) {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat.id) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  <span style={{ marginRight: '6px', fontSize: '16px' }}>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Kanal Seçici */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowChannelDropdown(!showChannelDropdown); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#1f2937',
                  background: '#ffffff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  padding: '10px 16px',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <span style={{ fontSize: '18px' }}>{selectedChannel.flag}</span>
                <span style={{ flex: 1 }}>{selectedChannel.name}</span>
                <ChevronDown style={{ width: '18px', height: '18px', color: '#6b7280' }} />
              </button>

              {/* Dropdown Menu */}
              {showChannelDropdown && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '4px',
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: '1px solid #e5e7eb',
                      minWidth: '240px',
                      zIndex: 100,
                      overflow: 'hidden'
                    }}
                  >
                    {filteredChannels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => handleChannelChange(channel)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '2px',
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: selectedChannel.id === channel.id ? '#2563eb' : '#374151',
                          background: selectedChannel.id === channel.id ? '#eff6ff' : 'white',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px' }}>{channel.flag}</span>
                          <span style={{ fontWeight: 500 }}>{channel.name}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.3' }}>
                          {channel.description}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            {/* Refresh and Close Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <button
              onClick={fetchNews}
              disabled={loading}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: loading ? '#f3f4f6' : '#f9fafb',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Yenile"
            >
              <RefreshCw
                style={{
                  width: '18px',
                  height: '18px',
                  color: '#6b7280',
                  animation: loading ? 'spin 1s linear infinite' : 'none'
                }}
              />
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: '#f9fafb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            </button>
          </div>
          </div>
        </div>

        {/* Highlights Badge */}
        <div style={{
          padding: '16px 24px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Son 3 Ayın İçerikleri
            </span>
          </div>
          {lastUpdated && (
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
              Son güncelleme: {lastUpdated.toLocaleDateString('tr-TR')}
            </span>
          )}
        </div>

        {/* News List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 24px 24px'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              color: '#6b7280'
            }}>
              Haberler yükleniyor...
            </div>
          ) : (
            news.map((item, index) => (
              <article
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '24px 16px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Author Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${item.id * 60}, 70%, 50%), hsl(${item.id * 60 + 30}, 70%, 40%))`,
                    }} />
                    <span style={{
                      fontSize: '14px',
                      color: '#1a1a1a',
                      fontWeight: 600
                    }}>
                      {item.author}
                    </span>
                    <span style={{ color: '#d1d5db', fontSize: '14px' }}>·</span>
                    <span style={{
                      fontSize: '13px',
                      color: '#6b7280'
                    }}>
                      {item.authorCategory}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    margin: '0 0 8px 0',
                    lineHeight: 1.4,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.title}
                  </h3>

                  {/* Meta */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#9ca3af',
                    marginBottom: item.description ? '8px' : '0'
                  }}>
                    <Clock style={{ width: '14px', height: '14px' }} />
                    <span>{item.readTime}</span>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p style={{
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: '#6b7280',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.description}
                    </p>
                  )}
                </div>

                {/* YouTube Thumbnail */}
                <div style={{
                  width: '200px',
                  height: '112px',
                  borderRadius: '12px',
                  flexShrink: 0,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#f3f4f6'
                }}>
                  {getThumbnailUrl(item.url) ? (
                    <>
                      <img
                        src={getThumbnailUrl(item.url)}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: '#ff0000',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(255,0,0,0.4)'
                        }}>
                          <Play style={{ width: '24px', height: '24px', color: 'white', marginLeft: '3px' }} fill="white" />
                        </div>
                      </div>
                      {item.isShort && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#dc2626',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.5px'
                        }}>
                          SHORT
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #fee2e2, #fef2f2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Play style={{ width: '32px', height: '32px', color: '#dc2626' }} />
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            fontSize: '12px',
            color: '#9ca3af'
          }}>
            Her Pazartesi güncellenir
          </span>
          <button
            onClick={() => window.open(selectedChannel.youtubeUrl, '_blank')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#6b7280',
              background: '#f9fafb',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Tümünü Gör
            <ExternalLink style={{ width: '12px', height: '12px' }} />
          </button>
        </div>
      </div>

      {/* Spin Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NewsModal;
