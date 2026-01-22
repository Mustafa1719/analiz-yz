import React, { useState } from 'react';
import {
  X, BookOpen, Search, ChevronDown, ChevronUp,
  Zap, Target, Users, FileText, Layers, Settings,
  Brain, Sparkles, Cpu, Bot, Rocket, MessageSquare,
  Lightbulb, CheckCircle2, Info
} from 'lucide-react';

// PARTS Framework verisi
const partsFramework = {
  title: "PARTS Modeli – İstem (Prompt) Tasarımı",
  description: "Yapay zekaya doğru soruyu sormayı sağlar.",
  elements: [
    {
      letter: "P",
      name: "Persona / Rol",
      meaning: "Yapay zekanın rolünü tanımlar",
      importance: "Yapay zekaya hangi rolü üstleneceğini söylediğinde, doğru ton, uzmanlık düzeyi ve davranış biçimiyle yanıt üretmesini sağlarsın.",
      example: "Bir koç gibi davran, pazarlama uzmanı gibi davran"
    },
    {
      letter: "A",
      name: "Act / Görev",
      meaning: "Görevi açık ve net şekilde belirtir",
      importance: "\"Oluştur\", \"yeniden yaz\", \"karşılaştır\" veya \"özetle\" gibi eylem sözcükleri kullanarak daha net ve somut sonuçlar elde edersin.",
      example: "Özetle, listele, karşılaştır, analiz et"
    },
    {
      letter: "R",
      name: "Recipient / Hedef Kitle",
      meaning: "Kimin için yazıldığını belirtir",
      importance: "Hedef kitlenin özellikleri yapay zekanın çıktısını doğru gruba göre şekillendirmesini sağlar.",
      example: "Öğrencilere, personele, yöneticilere"
    },
    {
      letter: "T",
      name: "Theme / Tema – Konu",
      meaning: "Konuyu ya da temayı ekler",
      importance: "Bir bağlam vererek içeriğin odaklanmasını sağlarsın.",
      example: "Erken okuryazarlık, sosyal-duygusal öğrenme"
    },
    {
      letter: "S",
      name: "Structure / Yapı",
      meaning: "İstediğin formatı ya da modeli belirtir",
      importance: "Yapay zeka içeriği öğretim tasarımı, araştırma raporu, sunum slaytları veya belirli bir çerçeveye göre yapılandırır.",
      example: "Tablo formatında, madde listesi, 5 adımlı plan"
    }
  ]
};

// SALT Framework verisi
const saltFramework = {
  title: "SALT Modeli – Yanıt (Response) Tasarımı",
  description: "Gelen yanıtı istenen yöne şekillendirmeyi mümkün kılar.",
  elements: [
    {
      letter: "S",
      name: "Style / Stil",
      meaning: "Yanıtın nasıl yapılandırılacağını belirler",
      subElements: ["Performans Görevi (listele, karşılaştır, analiz et)", "Tırnak İşaretleri (\" \") – odak belirleme", "Çift Yıldız (**) – vurgu", "Üç Tire (---) – bölümlendirme"],
      importance: "Style, yalnızca format değil; modelin nasıl düşüneceğini belirler. Yanıtın net, takip edilebilir ve kontrollü olmasını sağlar."
    },
    {
      letter: "A",
      name: "Audience / Hedef Kitle",
      meaning: "Yanıtın kim için üretileceğini tanımlar",
      subElements: ["Yaş", "Rol", "Uzmanlık seviyesi", "Bağlam"],
      importance: "İçeriğin hedef kitleye uygun dil, örnek ve derinlikte sunulmasını sağlar."
    },
    {
      letter: "L",
      name: "Length / Uzunluk",
      meaning: "Yanıtın kapsam ve detay seviyesini belirler",
      subElements: ["Kısa", "Özet", "Detaylı", "Derinlemesine"],
      importance: "Gereksiz bilgi yükünü önler veya ihtiyaç duyulan derinliği sağlar."
    },
    {
      letter: "T",
      name: "Tone / Üslup",
      meaning: "Yanıtın ruh halini ve iletişim biçimini tanımlar",
      subElements: ["Resmi", "Samimi", "Motive edici", "Akademik"],
      importance: "Yanıtın algısını ve etkisini doğrudan belirler. Bağlama uygun iletişim kurulmasını sağlar."
    }
  ]
};

// 8 Seviye detayları (Değerlendirme ile senkronize)
const levelDetails = [
  {
    level: 0,
    title: "Temel Farkındalık",
    icon: Brain,
    color: "#64748b",
    definition: "Yapay zeka araçlarının varlığından haberdar olma ve temel kavramları anlama aşaması.",
    behaviors: [
      "Yapay zeka araçlarının ne olduğunu ve isimlerini biliyor",
      "Yapay zekanın işine nerede değer katabileceğini kavrıyor",
      "Temel yapay zeka kavramlarını (prompt, model, halüsinasyon) biliyor",
      "Yapay zekanın sınırlarını ve risklerini fark ediyor"
    ],
    tools: ["ChatGPT", "Gemini", "Claude", "Perplexity"]
  },
  {
    level: 1,
    title: "Prompt Mühendisliği",
    icon: Zap,
    color: "#3b82f6",
    definition: "Yapay zekaya doğru talimatlar vererek etkili sonuçlar alma becerisi.",
    behaviors: [
      "Net ve yapılandırılmış talimatlar (prompt) yazıyor",
      "Aynı işi farklı istemlerle test eder ve çıktıyı iyileştiriyor",
      "Farklı hedef kitleler için yanıt biçimini ayarlayabiliyor",
      "Hangi yapay zeka aracının hangi iş için uygun olduğunu ayırt ediyor"
    ],
    tools: ["ChatGPT", "Gemini", "Claude", "Perplexity"]
  },
  {
    level: 2,
    title: "Özel GPT (Sohbet Botları)",
    icon: Sparkles,
    color: "#f59e0b",
    definition: "Belirli bir iş ihtiyacını karşılayan, tutarlı ve tekrar kullanılabilir yapay zeka asistanları tasarlayabilme.",
    behaviors: [
      "Tek seferlik istemler yerine kalıcı bir asistan kurguluyor",
      "Aynı soruya benzer kalite ve yapıdaki yanıtları alıyor",
      "Asistanı belirli bir rol, süreç veya uzmanlık alanına göre sınırlıyor",
      "Çıktı kalitesini sürdürülebilir şekilde koruyor"
    ],
    tools: ["ChatGPT GPTs", "Gemini Gems", "Claude Projects"]
  },
  {
    level: 3,
    title: "YZ Destekli Prototipleme",
    icon: Target,
    color: "#10b981",
    definition: "Bir iş problemini basit bir uygulama veya prototip haline getirerek test edebilme.",
    behaviors: [
      "İş sürecini yüksek seviyede adımlara ayırıyor",
      "Yapay zekanın katkı sağlayacağı noktaları belirliyor",
      "Kod yazmadan çalışan bir prototip oluşturuyor",
      "Prototipi geri bildirimle geliştiriyor"
    ],
    tools: ["Google AI Studio", "Bolt.new", "Replit", "v0.dev"]
  },
  {
    level: 4,
    title: "İş Akışı Otomasyonu",
    icon: Cpu,
    color: "#06b6d4",
    definition: "Tekrarlayan işleri otomatikleştirerek manuel yükü azaltma becerisi.",
    behaviors: [
      "Tekrar eden işleri fark ediyor",
      "Araçları birbirine bağlayarak otomatik akış kuruyor",
      "Tetikleyici – işlem – çıktı mantığını kurguluyor",
      "Sürecin sorunsuz çalıştığını takip ediyor"
    ],
    tools: ["n8n", "Make", "Zapier", "UiPath"]
  },
  {
    level: 5,
    title: "YZ Destekli Otomasyon",
    icon: Bot,
    color: "#8b5cf6",
    definition: "Otomasyon içinde yapay zekayı karar destek noktalarında bilinçli şekilde kullanma.",
    behaviors: [
      "Yapay zekayı yalnızca gerekli adımlarda devreye alıyor",
      "Yorumlama, sınıflandırma, yönlendirme işlerini AI'a bırakıyor",
      "Kurallarla AI arasındaki sınırı doğru çiziyor",
      "Sürecin kalitesini ve doğruluğunu izliyor"
    ],
    tools: ["n8n + AI", "Make + OpenAI", "Gemini API", "OpenAI API"]
  },
  {
    level: 6,
    title: "Yapay Zeka Ajanı",
    icon: Rocket,
    color: "#ec4899",
    definition: "Hedef bazlı çalışan otonom yapay zeka sistemleri tasarlayabilme.",
    behaviors: [
      "Yapay zekaya hedef tanımlıyor, adım değil",
      "Ajanın hangi araçları kullanacağını belirliyor",
      "Hatalı durumları ve istisnaları öngörüyor",
      "Süreci minimum insan müdahalesiyle yönetiyor"
    ],
    tools: ["Claude Code + MCP", "Azure AI Agents", "Gemini Agents", "LangChain"]
  },
  {
    level: 7,
    title: "Stratejik YZ Liderliği",
    icon: Layers,
    color: "#0f172a",
    definition: "Organizasyon genelinde yapay zeka stratejisi belirleme ve uygulama.",
    behaviors: [
      "Organizasyonel YZ vizyonu oluşturuyor",
      "Takım genelinde YZ yetkinlik gelişimini yönetiyor",
      "YZ yatırımlarının ROI'sini ölçüyor",
      "Etik ve uyumluluk standartlarını belirlıyor"
    ],
    tools: ["Enterprise AI Platforms", "AI Governance Tools", "ROI Analytics"]
  }
];

// Alternatif Prompt Framework'leri
const alternativeFrameworks = [
  {
    name: "RAIN",
    components: ["Role (Rol)", "Aim (Amaç)", "Input (Girdi)", "Numeric Target (Sayısal Hedef)"],
    purpose: "Yapay Zeka'ya kim olduğunu, neyi başarması gerektiğini ve başarının nasıl ölçüleceğini netleştirir.",
    example: "Bir UX Lideri gibi davran. Amaç: Sepet terk oranını %25 azaltmak. İşte analitik veriler."
  },
  {
    name: "CLAR",
    components: ["Context (Bağlam)", "Limits (Sınırlar)", "Action (Eylem)", "Result (Sonuç)"],
    purpose: "Belirsiz işleri odaklı ve yönetilebilir hale getirir.",
    example: "Bu depo gecikme kayıtlarını incele. En önemli iki kök nedene odaklan."
  },
  {
    name: "FLOW",
    components: ["Function (Görev)", "Level (Seviye)", "Output (Çıktı)", "Win Metric (Başarı Ölçütü)"],
    purpose: "İçerik üretiminde hedef kitleye uygunluk ve kalite standardı sağlar.",
    example: "Yeni mezunlar için 900 kelimelik bir kariyer tavsiye yazısı yaz."
  }
];

// Düşünce Yaklaşımları
const thinkingFrameworks = [
  {
    name: "Cynefin Modeli",
    description: "Problemin doğasını anlamak için kullanılır. Problem açık (Obvious), karmaşık (Complicated) veya belirsiz (Complex) olabilir.",
    usage: "Yapay zeka için uygun olan ve olmayan alanları ayırt etmek"
  },
  {
    name: "4U Framework",
    description: "Problemlerin iş açısından önemini ve önceliğini değerlendirmek için kullanılır.",
    usage: "Hangi problemin ele alınmaya değer olduğunu seçmek"
  },
  {
    name: "SIPOC",
    description: "Supplier (Tedarikçi) → Input (Girdi) → Process (Süreç) → Output (Çıktı) → Customer (Müşteri)",
    usage: "Süreci haritalar ve yapay zekanın nerede kullanılabileceğini anlamak"
  }
];

export default function GlossaryModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('levels');
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [expandedFramework, setExpandedFramework] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!isOpen) return null;

  // Sadeleştirilmiş 3 ana kategori
  const tabs = [
    { id: 'levels', label: '8 Seviye', icon: Layers },
    { id: 'frameworks', label: 'Prompt Modelleri', icon: MessageSquare },
    { id: 'thinking', label: 'Düşünce Yaklaşımları', icon: Brain }
  ];

  const filteredLevels = levelDetails.filter(level =>
    searchTerm === '' ||
    level.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles
  const modalStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px'
  };

  const backdropStyle = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)'
  };

  const containerStyle = {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '85vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0'
  };

  const searchContainerStyle = {
    padding: '12px 24px',
    borderBottom: '1px solid #e2e8f0'
  };

  const searchInputStyle = {
    width: '100%',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px 12px 10px 40px',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none'
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '8px',
    padding: '12px 24px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  };

  const getTabStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    backgroundColor: isActive ? '#3b82f6' : 'transparent',
    color: isActive ? '#ffffff' : '#64748b'
  });

  const contentStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '24px'
  };

  const getCardStyle = (isHovered) => ({
    backgroundColor: isHovered ? '#f8fafc' : '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    marginBottom: '12px',
    transition: 'all 0.2s',
    transform: isHovered ? 'translateY(-2px)' : 'none',
    boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none'
  });

  const cardHeaderStyle = {
    width: '100%',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left'
  };

  const footerStyle = {
    padding: '12px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px'
  };

  return (
    <div style={modalStyle}>
      {/* Backdrop */}
      <div style={backdropStyle} onClick={onClose} />

      {/* Modal */}
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen style={{ width: '22px', height: '22px', color: '#ffffff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Yapay Zeka Yetkinlik Sözlüğü
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Seviyeler, modeller ve yaklaşımlar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X style={{ width: '20px', height: '20px', color: '#64748b' }} />
          </button>
        </div>

        {/* Search */}
        <div style={searchContainerStyle}>
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Terim ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>
        </div>

        {/* Tabs - Sadeleştirilmiş */}
        <div style={tabContainerStyle}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={getTabStyle(isActive)}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.backgroundColor = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.backgroundColor = 'transparent';
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* 8 Seviye */}
          {activeTab === 'levels' && (
            <div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                Yapay Zeka Yetkinlik Piramidi <strong>8 seviyeden</strong> oluşur. Her seviye farklı beceriler ve araçlar gerektirir.
              </p>
              {filteredLevels.map((level) => {
                const Icon = level.icon;
                const isExpanded = expandedLevel === level.level;
                const isHovered = hoveredItem === `level-${level.level}`;

                return (
                  <div
                    key={level.level}
                    style={getCardStyle(isHovered)}
                    onMouseEnter={() => setHoveredItem(`level-${level.level}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      onClick={() => setExpandedLevel(isExpanded ? null : level.level)}
                      style={cardHeaderStyle}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: level.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                            {level.level}. Seviye
                          </p>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                            {level.title}
                          </h3>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
                      ) : (
                        <ChevronDown style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
                      )}
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0 16px 16px 16px' }}>
                        <div style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '12px'
                        }}>
                          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
                            {level.definition}
                          </p>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                            Davranış Göstergeleri
                          </h4>
                          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                            {level.behaviors.map((behavior, idx) => (
                              <li key={idx} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px',
                                fontSize: '13px',
                                color: '#475569',
                                marginBottom: '6px'
                              }}>
                                <CheckCircle2 style={{
                                  width: '16px',
                                  height: '16px',
                                  color: '#10b981',
                                  flexShrink: 0,
                                  marginTop: '2px'
                                }} />
                                {behavior}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                            Önerilen Araçlar
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {level.tools.map((tool, idx) => (
                              <span key={idx} style={{
                                padding: '4px 10px',
                                backgroundColor: `${level.color}15`,
                                color: level.color,
                                borderRadius: '16px',
                                fontSize: '12px',
                                fontWeight: 500
                              }}>
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Prompt Modelleri (PARTS + SALT + Diğerleri birleşik) */}
          {activeTab === 'frameworks' && (
            <div>
              {/* PARTS */}
              <div style={{
                background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #c7d2fe'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e40af', marginBottom: '4px' }}>
                  {partsFramework.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#4338ca', margin: 0 }}>
                  {partsFramework.description}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                {partsFramework.elements.map((element, idx) => {
                  const isHovered = hoveredItem === `parts-${idx}`;
                  return (
                    <div
                      key={idx}
                      style={{
                        ...getCardStyle(isHovered),
                        padding: '14px'
                      }}
                      onMouseEnter={() => setHoveredItem(`parts-${idx}`)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px' }}>
                            {element.letter}
                          </span>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                            {element.name}
                          </h4>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                            {element.meaning}
                          </p>
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '6px',
                        padding: '10px',
                        marginBottom: '8px'
                      }}>
                        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                          {element.importance}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Örnek:</span>
                        <span style={{
                          fontSize: '12px',
                          color: '#6366f1',
                          backgroundColor: '#eef2ff',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}>
                          {element.example}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SALT */}
              <div style={{
                background: 'linear-gradient(135deg, #d1fae5, #cffafe)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #99f6e4'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
                  {saltFramework.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#0f766e', margin: 0 }}>
                  {saltFramework.description}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                {saltFramework.elements.map((element, idx) => {
                  const isHovered = hoveredItem === `salt-${idx}`;
                  return (
                    <div
                      key={idx}
                      style={{
                        ...getCardStyle(isHovered),
                        padding: '14px'
                      }}
                      onMouseEnter={() => setHoveredItem(`salt-${idx}`)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px' }}>
                            {element.letter}
                          </span>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                            {element.name}
                          </h4>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                            {element.meaning}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {element.subElements.map((sub, subIdx) => (
                          <span key={subIdx} style={{
                            padding: '3px 8px',
                            backgroundColor: '#f0fdfa',
                            color: '#0f766e',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}>
                            {sub}
                          </span>
                        ))}
                      </div>
                      <div style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '6px',
                        padding: '10px'
                      }}>
                        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                          {element.importance}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Diğer Frameworkler */}
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>
                Alternatif Modeller
              </h3>
              {alternativeFrameworks.map((fw, idx) => {
                const isExpanded = expandedFramework === fw.name;
                const isHovered = hoveredItem === `fw-${idx}`;

                return (
                  <div
                    key={idx}
                    style={getCardStyle(isHovered)}
                    onMouseEnter={() => setHoveredItem(`fw-${idx}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      onClick={() => setExpandedFramework(isExpanded ? null : fw.name)}
                      style={cardHeaderStyle}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>
                            {fw.name}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                          {fw.components.join(' → ')}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
                      ) : (
                        <ChevronDown style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
                      )}
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0 16px 16px 16px' }}>
                        <div style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          padding: '10px',
                          marginBottom: '10px'
                        }}>
                          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                            {fw.purpose}
                          </p>
                        </div>
                        <div style={{
                          backgroundColor: '#fef3c7',
                          borderRadius: '6px',
                          padding: '10px',
                          border: '1px solid #fcd34d'
                        }}>
                          <p style={{ fontSize: '11px', color: '#92400e', margin: '0 0 4px 0' }}>Örnek:</p>
                          <p style={{ fontSize: '12px', color: '#78350f', margin: 0, fontStyle: 'italic' }}>
                            "{fw.example}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Düşünce Yaklaşımları */}
          {activeTab === 'thinking' && (
            <div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                3. seviye ve üzerinde kullanılan düşünce yaklaşımları ve süreç haritalama yöntemleri:
              </p>

              {thinkingFrameworks.map((fw, idx) => {
                const isHovered = hoveredItem === `thinking-${idx}`;
                return (
                  <div
                    key={idx}
                    style={{
                      ...getCardStyle(isHovered),
                      padding: '16px'
                    }}
                    onMouseEnter={() => setHoveredItem(`thinking-${idx}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Brain style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                        {fw.name}
                      </h3>
                    </div>
                    <p style={{ fontSize: '14px', color: '#475569', marginBottom: '12px' }}>
                      {fw.description}
                    </p>
                    <div style={{
                      backgroundColor: '#ecfdf5',
                      borderRadius: '6px',
                      padding: '10px',
                      border: '1px solid #a7f3d0'
                    }}>
                      <p style={{ fontSize: '11px', color: '#047857', margin: '0 0 4px 0' }}>Kullanım Amacı:</p>
                      <p style={{ fontSize: '13px', color: '#065f46', margin: 0 }}>
                        {fw.usage}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Ortak Hedef */}
              <div style={{
                background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '20px',
                border: '1px solid #c7d2fe'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', marginBottom: '8px' }}>
                  Ortak Yetkinlik Hedefi (3-7. Seviyeler)
                </h4>
                <p style={{ fontSize: '13px', color: '#3730a3', margin: 0 }}>
                  "Cynefin modeli ile yapay zeka ile çalışılabilecek problem alanlarını ayırt eder;
                  4U çerçevesiyle bu problemlerin iş açısından önemini değerlendirir.
                  SIPOC yaklaşımıyla süreci haritalayarak, yapay zekanın hangi adımlarda anlamlı değer yaratabileceğini belirler."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Küçültülmüş kaynak gösterimi */}
        <div style={footerStyle}>
          <Info style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
            Mustafa Aydın, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
