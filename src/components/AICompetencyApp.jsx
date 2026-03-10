import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart3, ArrowRight,
  ChevronLeft, ChevronRight, ChevronDown, CheckCircle2,
  Brain, Zap, Target, Layers, Cpu, Bot, Sparkles, Rocket,
  TrendingUp, Trophy, Info, Download, AlertTriangle,
  Library, ArrowDown, Users, Lightbulb, MessageCircle,
  Clock, Shield, AlertCircle, Compass, Lock, Building2, Menu, BookOpen, PlayCircle, ExternalLink
} from 'lucide-react';
import GlossaryModal from './GlossaryModal';
import MentorChat from './MentorChat';
import NewsModal from './NewsModal';
import SlideViewer from './SlideViewer';
import YouTubeVideoList from './YouTubeVideoList';

const GEMINI_SLIDES = Array.from({ length: 15 }, (_, i) =>
  `/slides/gemini-prompting/slide${i + 1}.png`
);

// Seviye verileri - Yapay Zeka Gelişim Piramidi (5 Seviye)
const competencyLevels = [
  {
    id: 1,
    title: "Yapay Zeka Kullanımı ve Prompt Mühendisliği",
    subtitle: "Temel Yapay Zeka Kullanımı",
    icon: Zap,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-500",
    description: "Yapay zekaya doğru talimatlar vererek etkili sonuçlar alma becerisi.",
    tools: ["ChatGPT", "Gemini"],
    questions: [
      {
        text: "Yapay zeka araçlarını düzenli kullanıyorum",
        options: [
          "Hiç kullanmıyorum veya sadece bir kez denedim",
          "Ayda birkaç kez kullanıyorum",
          "Haftada 2-3 kez kullanıyorum",
          "Günlük iş akışımda düzenli olarak (günde 1+ kez) kullanıyorum"
        ],
        evidence: "Son 7 gündeki yapay zeka kullanım sıklığı, sohbet geçmişi"
      },
      {
        text: "Net ve yapılandırılmış talimatlar (prompt) yazıyorum",
        options: [
          "Belirsiz sorular soruyorum ('Bana yardım et', 'Bir şey yaz')",
          "Konuyu belirtiyorum ama talimat net değil",
          "Görev, format ve bağlam belirterek talimat yazıyorum",
          "Rol, hedef kitle, ton, format gibi tüm bileşenleri sistematik kullanıyorum"
        ],
        evidence: "'Bir pazarlama uzmanı gibi, genç profesyonellere yönelik, samimi tonla 200 kelimelik blog yazısı yaz' formatında prompt"
      },
      {
        text: "Çıktı kalitesini iyileştirmek için prompt'u geliştiriyorum",
        options: [
          "İlk sonucu olduğu gibi kabul ediyorum",
          "Bazen 'Daha kısa yaz' gibi basit düzeltmeler istiyorum",
          "Sistematik olarak test edip iyileştiriyorum (A/B karşılaştırma)",
          "Farklı yaklaşımları deneyip en iyi sonucu veren prompt'u kaydediyorum"
        ],
        evidence: "Aynı görev için farklı prompt versiyonları ve sonuçların karşılaştırması"
      },
      {
        text: "Yapay zeka çıktılarını kontrol edip düzenliyorum",
        options: [
          "Gelen sonucu hiç kontrol etmeden kullanıyorum",
          "Bazen göz gezdiriyorum ama detaylı kontrol etmiyorum",
          "Her zaman okuyup açık hataları düzeltiyorum",
          "Faktörleri doğrulama, kaynak kontrol ve profesyonel düzenleme yaparak kullanıyorum"
        ],
        evidence: "Yapay zeka çıktısı + düzenlenmiş final versiyonu karşılaştırması"
      },
      {
        text: "Yapay zeka etiği ve veri güvenliği konusunda bilinçliyim",
        options: [
          "Bu konuları hiç düşünmedim",
          "Hassas bilgi paylaşmaması gerektiğini biliyorum",
          "Şirket verilerini, müşteri bilgilerini paylaşmıyorum",
          "Veri gizliliği politikalarını biliyorum, çıktıları atıf/kaynak belirterek kullanıyorum ve telif haklarına dikkat ediyorum"
        ],
        evidence: "Hassas bilgi içeren görevde yapay zeka kullanmama veya anonimleştirme örneği"
      }
    ]
  },
  {
    id: 2,
    title: "Özel GPT'ler",
    subtitle: "Özelleştirilmiş Asistanlar",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500",
    description: "Tekrar eden işler için özel yapay zeka asistanları oluşturabilme.",
    tools: ["Gemini GEM", "Custom GPT", "NotebookLM"],
    questions: [
      {
        text: "Tekrar eden işlerim için özel asistan oluşturdum",
        options: [
          "Her seferinde sıfırdan prompt yazıyorum",
          "Bazı promptları kopyala-yapıştır yapıyorum",
          "1 özel GPT/Gem oluşturdum",
          "3+ farklı iş için özel asistan oluşturdum ve aktif kullanıyorum"
        ],
        evidence: "'Satış E-postası Asistanı', 'Rapor Özet Uzmanı' gibi özel GPT ekran görüntüleri"
      },
      {
        text: "Özel asistanıma kalıcı rol ve talimatlar tanımladım",
        options: [
          "Özel asistan oluşturmadım",
          "Basit bir tanım yazdım ama rol/sınır belirtmedim",
          "Rol, görev ve format gibi temel talimatları tanımladım",
          "Detaylı talimat, yapılacaklar/yapılmayacaklar listesi ve örneklerle kapsamlı yapılandırma yaptım"
        ],
        evidence: "'Sen bir İK uzmanısın. Sadece CV analizi yap. Kişisel görüş belirtme. Çıktıyı 3 madde halinde ver' gibi talimat seti"
      },
      {
        text: "Özel asistanıma referans dokümanlar yükledim",
        options: [
          "Hiç doküman yüklemedim",
          "1 basit doküman yükledim",
          "2-3 referans doküman (şablon, kılavuz) yükledim",
          "Kapsamlı doküman seti (prosedür, şablon, stil kılavuzu, örnek çıktılar) yükledim ve güncelliyorum"
        ],
        evidence: "Şirket yazım kılavuzu, e-posta şablonları, raporlama standartları PDF'leri"
      },
      {
        text: "Asistanımın tutarlılığını test ettim",
        options: [
          "Test yapmadım, ilk sonucu kullandım",
          "1-2 kez denedim",
          "5+ farklı senaryo ile test ettim",
          "Sistematik test protokolü uyguladım (aynı soru farklı zamanlarda, edge case'ler vb.)"
        ],
        evidence: "Aynı sorunun 5 farklı zamanda verilmesi ve tutarlılık analizi"
      },
      {
        text: "Özel asistanlarla ölçülebilir verimlilik kazancı sağladım",
        options: [
          "Net bir kazanç ölçmedim",
          "Biraz hızlandırdığını düşünüyorum",
          "%20-30 zaman tasarrufu sağladım (subjektif)",
          "%40+ zaman tasarrufu sağladım ve somut metriklerle kanıtlayabilirim (öncesi/sonrası)"
        ],
        evidence: "'CV analizi 20 dk→5 dk', 'Haftalık rapor 2 saat→30 dk' karşılaştırması"
      }
    ]
  },
  {
    id: 3,
    title: "Temel Otomasyonlar",
    subtitle: "Builder / No-Code Uygulamalar",
    icon: Target,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500",
    description: "Kod yazmadan yapay zeka destekli uygulamalar ve prototipler geliştirebilme.",
    tools: ["Google AI Studio"],
    questions: [
      {
        text: "İş süreçlerimi görselleştirebiliyorum",
        options: [
          "Süreçlerimi hiç haritalamadım",
          "Basit liste veya not halinde yazıyorum",
          "Akış şeması veya adım adım süreç çiziyorum",
          "SIPOC, Cynefin gibi framework'lerle süreç analizi yapıyorum ve dokümante ediyorum"
        ],
        evidence: "Müşteri onboarding sürecinin SIPOC diyagramı veya Miro/Lucidchart akış şeması"
      },
      {
        text: "Yapay zekanın değer yaratabileceği noktaları tespit ediyorum",
        options: [
          "Hangi işlerin yapay zekaya uygun olduğunu bilmiyorum",
          "'Belki burada kullanılabilir' diye düşünüyorum ama net değil",
          "Süreç içinde yapay zekanın kullanılabileceği 2-3 nokta belirleyebiliyorum",
          "Sistematik analiz yapıyorum (tekrar eden iş, karar noktası, veri analizi vb.) ve önceliklendiriyorum"
        ],
        evidence: "Süreç haritasında 'yapay zeka kullanım noktaları' işaretli dokümantasyon"
      },
      {
        text: "No-code platformlarda prototip geliştiriyorum",
        options: [
          "Hiç prototip geliştirmedim",
          "Bir platform denedim ama tamamlamadım",
          "En az 1 çalışan prototip oluşturdum",
          "3+ prototip geliştirdim ve iş değeri test ettim"
        ],
        evidence: "Google AI Studio'da çalışan uygulama linki"
      },
      {
        text: "Prototipleri test edip geri bildirimle geliştiriyorum",
        options: [
          "Hiç test yapmadım",
          "Kendim denedim",
          "2-3 kişiden geri bildirim aldım",
          "Sistematik kullanıcı testi yaptım (5+ kişi), geri bildirimleri dokümante ettim ve iterasyon yaptım"
        ],
        evidence: "Test senaryoları, kullanıcı geri bildirim formu, V1→V2 iyileştirme logu"
      },
      {
        text: "Prototip ile tam yazılım arasındaki farkı anlıyorum",
        options: [
          "Prototip ve yazılım arasında fark olduğunu bilmiyorum",
          "Genel olarak fark olduğunu biliyorum ama net değil",
          "Prototip=test, Yazılım=production farkını biliyorum",
          "Güvenlik, performans, bakım, ölçeklenebilirlik gibi boyutlarda farkları açıklayabilirim"
        ],
        evidence: "'Bu prototip sadece fikir testi için, production için güvenlik ve hata yönetimi gerekir' açıklaması"
      }
    ]
  },
  {
    id: 4,
    title: "Yapay Zeka Destekli Otomasyon",
    subtitle: "Workflow / Yapay Zeka + Otomasyon",
    icon: Cpu,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-500",
    description: "Otomasyon araçlarıyla yapay zekayı birleştirerek akıllı iş akışları kurma.",
    tools: ["n8n"],
    questions: [
      {
        text: "Otomasyon araçlarını aktif kullanıyorum",
        options: [
          "Hiç otomasyon aracı kullanmadım",
          "Bir platform denedim ama tamamlamadım",
          "1-2 basit otomasyon kurdum",
          "5+ aktif otomasyon kurdum ve düzenli çalışıyor"
        ],
        evidence: "Zapier/Make/n8n dashboard ekran görüntüsü, çalışan otomasyon listesi"
      },
      {
        text: "Farklı uygulamaları birbirine bağlıyorum",
        options: [
          "Hiç entegrasyon yapmadım",
          "Aynı ekosistem içinde (Google Workspace gibi) bağlantı kurdum",
          "2-3 farklı platform arasında entegrasyon kurdum",
          "5+ farklı platform (CRM, E-posta, Sheets, Slack, vb.) arasında çalışan entegrasyonlar kurdum"
        ],
        evidence: "Salesforce → Gmail → Google Sheets → Slack entegrasyon zinciri"
      },
      {
        text: "Otomasyon içinde yapay zekayı stratejik noktalarda kullanıyorum",
        options: [
          "Hiç yapay zeka entegrasyonu yapmadım",
          "Denedim ama tam çalıştıramadım",
          "1-2 otomasyonda yapay zeka kullanıyorum",
          "5+ otomasyonda stratejik karar noktalarında yapay zeka kullanıyorum ve kurallı mantıkla hibrit yaklaşım kurdum"
        ],
        evidence: "E-posta sınıflandırma (Yapay Zeka) → Kategoriye göre routing (kural) akışı"
      },
      {
        text: "Yapay zeka çıktısını akış içinde kullanıyorum",
        options: [
          "Yapay zeka çıktısını manuel kopyalıyorum",
          "Çıktıyı alıyorum ama sonraki adımda kullanamıyorum",
          "Yapay zeka çıktısını sonraki adıma input olarak gönderiyorum",
          "Yapay zeka çıktısına göre dallanma, filtreleme ve dinamik akış kontrolü yapıyorum"
        ],
        evidence: "Yapay zeka sınıflandırma sonucu 'Acil' ise Slack'e bildir, değilse ticket oluştur"
      },
      {
        text: "Hata durumları için alternatif akışlar kurdum",
        options: [
          "Hata yönetimi yapmadım",
          "Başarısız olunca manuel müdahale ediyorum",
          "Basit hata bildirimi kurdum",
          "Try-catch, timeout, fallback mekanizması ve hata bildirimi sistemi kurdum"
        ],
        evidence: "'API yanıt vermezse e-posta gönder + 5 dk sonra tekrar dene' akışı"
      }
    ]
  },
  {
    id: 5,
    title: "Yapay Zeka Ajanları",
    subtitle: "Otonom Yapay Zeka Sistemleri",
    icon: Rocket,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-500",
    description: "Hedef bazlı çalışan otonom yapay zeka sistemleri tasarlayabilme.",
    tools: ["Claude Code", "Google Antigravity"],
    questions: [
      {
        text: "Yapay zekaya hedef tanımlıyorum, adımları kendisi planlıyor",
        options: [
          "Her adımı ben tanımlıyorum",
          "Bazı adımları yapay zeka belirliyor ama çoğunu ben yönetiyorum",
          "Hedef veriyorum, temel planı yapay zeka oluşturuyor",
          "Sadece hedef + kısıtları tanımlıyorum, yapay zeka tam otonom plan+yürütme yapıyor"
        ],
        evidence: "'Ocak ayı satış raporunu hazırla ve yöneticilere mail at' → Ajan veri topluyor, analiz ediyor, rapor oluşturuyor, gönderiyor"
      },
      {
        text: "Ajan platformlarını kullanıyorum",
        options: [
          "Hiç ajan platformu kullanmadım",
          "Ajan kavramını biliyorum ama kurmadım",
          "Basit bir ajan denedim (örn: AutoGPT)",
          "Profesyonel ajan sistemleri (LangChain, AutoGen, CrewAI) kurdum ve production'da çalıştırıyorum"
        ],
        evidence: "LangChain ile multi-agent sistemi + çalışan deployment"
      },
      {
        text: "Ajana araç erişimi tanımlıyorum",
        options: [
          "Ajan araç kullanamıyor",
          "1-2 basit araç (web arama gibi) kullanabiliyor",
          "5+ araç (API, database, dosya sistemi) erişimi tanımladım",
          "Kapsamlı araç kütüphanesi + izin matrisi + güvenlik katmanı ile ajan tool kullanımı kurdum"
        ],
        evidence: "Ajan için tool listesi: [Google Search, Salesforce API, Gmail, Sheets, SQL] + erişim politikası"
      },
      {
        text: "Beklenmeyen durumlar için guardrails kurdum",
        options: [
          "Hata yönetimi yok, ajan sınırsız",
          "Basit timeout veya limit var",
          "Hata durumları için kurallar tanımladım",
          "Kapsamlı guardrail sistemi: bütçe limiti, zaman limiti, veri erişim kontrolü, etik kurallar, insan onayı tetikleyicileri"
        ],
        evidence: "'Maliyet $10 aşarsa dur', '24 saat içinde bitir', 'Hassas veri algılarsa insan onayı iste' kuralları"
      },
      {
        text: "Ajan kararlarını izliyor ve denetimliyorum",
        options: [
          "Ajan ne yaptığını bilmiyorum",
          "Sadece son sonucu görüyorum",
          "Basit loglar tutuyorum",
          "Detaylı observability: her karar, her araç çağrısı, reasoning log, metrikler ve alert sistemi"
        ],
        evidence: "Ajan dashboard'u: gerçek zamanlı status, karar geçmişi, başarı/başarısızlık metrikleri"
      }
    ]
  }
];

// Öneriler
const recommendations = {
  1: {
    next: "Özel GPT veya Gem oluşturarak tekrar eden işlerinizi otomatikleştirin.",
    tools: ["Custom GPT", "Gemini GEM", "NotebookLM"],
    resources: ["Özel asistan oluşturma rehberleri", "Prompt şablonlarınızı kaydedin"]
  },
  2: {
    next: "No-code platformlarda ilk prototiplerinizi geliştirin.",
    tools: ["Google AI Studio"],
    resources: ["İş süreçlerinizi haritalayın", "İlk prototipi 1 günde bitirin"]
  },
  3: {
    next: "Otomasyon araçlarıyla yapay zekayı iş akışlarına entegre edin.",
    tools: ["n8n"],
    resources: ["API anahtarı alın ve test edin", "Hibrit akışlar kurun"]
  },
  4: {
    next: "Ajan tabanlı sistemleri öğrenin ve otonom çözümler geliştirin.",
    tools: ["Claude Code", "Google Antigravity"],
    resources: ["Ajan güvenliği ve izleme öğrenin", "Production deployment yapın"]
  },
  5: {
    next: "Tebrikler! Bilginizi paylaşın ve mentorluk yapın.",
    tools: ["Tüm araçlar"],
    resources: ["Ekibinize eğitim verin", "Yapay zeka yönetişim politikaları oluşturun"]
  }
};

export default function AICompetencyApp() {
  const [currentView, setCurrentView] = useState('home'); // home, assessment, results
  const [currentLevel, setCurrentLevel] = useState(0);
  const [responses, setResponses] = useState({});
  const [showGlossary, setShowGlossary] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [selectedLevelPopover, setSelectedLevelPopover] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showMentorChat, setShowMentorChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [educationActiveLevel, setEducationActiveLevel] = useState(0);
  const [educationActiveSection, setEducationActiveSection] = useState('read'); // 'read' | 'watch'
  const [educationActiveTool, setEducationActiveTool] = useState(null); // araç indexi (Seviye 2 için)
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // başlangıçta Modül 0 açık
  const [educationActiveLesson, setEducationActiveLesson] = useState(null); // Claude Code ders seçimi

  // Seviye 2 (index 1) araç bazlı navigasyon kullanır
  const TOOL_NAV_LEVELS = [0, 1, 2, 3, 4];
  const assessmentRef = useRef(null);

  // Mobil cihaz kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleResponse = (level, questionIndex, score) => {
    setResponses(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [questionIndex]: score
      }
    }));

    // Otomatik olarak sonraki soruya geç (300ms bekle)
    setTimeout(() => {
      const currentLevelData = competencyLevels[level];
      if (questionIndex < currentLevelData.questions.length - 1) {
        // Aynı seviyede sonraki soru
        setCurrentQuestion(questionIndex + 1);
      } else if (level < 4) {
        // Sonraki seviyeye geç
        setCurrentLevel(level + 1);
        setCurrentQuestion(0);
      } else {
        // Son soru - sonuçlara git
        setCurrentView('results');
      }
    }, 300);
  };

  const getLevelScore = (level) => {
    const levelResponses = responses[level] || {};
    const scores = Object.values(levelResponses);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0);
  };

  const getLevelMaxScore = (level) => {
    return competencyLevels[level].questions.length * 3;
  };

  const getLevelPercentage = (level) => {
    const score = getLevelScore(level);
    const maxScore = getLevelMaxScore(level);
    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  };

  const getAnsweredCount = (level) => {
    const levelResponses = responses[level] || {};
    return Object.keys(levelResponses).length;
  };

  const calculateOverallLevel = () => {
    for (let i = 4; i >= 0; i--) {
      if (getLevelPercentage(i) >= 70) {
        return i;
      }
    }
    return -1;
  };

  const getTotalAnswered = () => {
    return Object.keys(responses).reduce((sum, level) => {
      return sum + Object.keys(responses[level] || {}).length;
    }, 0);
  };

  const getTotalQuestions = () => {
    return competencyLevels.reduce((sum, level) => sum + level.questions.length, 0);
  };

  const startAssessment = () => {
    setCurrentView('assessment');
    setCurrentLevel(0);
    setCurrentQuestion(0);
  };

  const handleNextQuestion = () => {
    const currentLevelData = competencyLevels[currentLevel];
    if (currentQuestion < currentLevelData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentLevel < 4) {
      setCurrentLevel(currentLevel + 1);
      setCurrentQuestion(0);
    } else {
      setCurrentView('results');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1);
      setCurrentQuestion(competencyLevels[currentLevel - 1].questions.length - 1);
    }
  };

  const jumpToLevel = (level) => {
    setCurrentLevel(level);
    setCurrentQuestion(0);
  };

  // ==================== HOME PAGE ====================
  if (currentView === 'home') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Sticky Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile ? '60px' : '72px' }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px' }}>
                <div style={{
                  width: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px',
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  borderRadius: isMobile ? '10px' : '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                }}>
                  <Brain style={{ width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px', color: 'white' }} />
                </div>
                {!isMobile && (
                  <div>
                    <h1 style={{ color: '#0f172a', fontWeight: 700, fontSize: '18px', margin: 0 }}>Yapay Zeka Gelişim Modeli</h1>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Öğren · Gelişin · Büyü</p>
                  </div>
                )}
              </div>

              {/* Nav */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
                <button
                  onClick={() => setCurrentView('education')}
                  aria-label="Eğitim sayfasına git"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#2563eb',
                    fontSize: '14px',
                    fontWeight: 600,
                    padding: isMobile ? '10px' : '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#eff6ff',
                    cursor: 'pointer',
                    minWidth: '44px',
                    minHeight: '44px',
                    outline: 'none',
                    position: 'relative'
                  }}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <BookOpen style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
                  {!isMobile && 'Eğitimler'}
                </button>
                <button
                  onClick={() => setShowGlossary(true)}
                  aria-label="Kavramlar sözlüğünü aç"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: isMobile ? '10px' : '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    minWidth: '44px',
                    minHeight: '44px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <Library style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
                  {!isMobile && 'Kavramlar'}
                </button>
                <button
                  onClick={() => setShowNews(true)}
                  aria-label="Güncel haberleri aç"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: isMobile ? '10px' : '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    minWidth: '44px',
                    minHeight: '44px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <TrendingUp style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
                  {!isMobile && 'Haberler'}
                </button>
                <button
                  onClick={startAssessment}
                  aria-label="Değerlendirmeyi başlat"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                    color: 'white',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: 600,
                    padding: isMobile ? '10px 16px' : '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                    minHeight: '44px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.5)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)'}
                >
                  {isMobile ? 'Değerlendirme' : 'Değerlendirmeye Başla'}
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
          padding: isMobile ? '48px 20px 60px' : '80px 24px 100px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: isMobile ? '8px' : '10px',
              backgroundColor: 'white',
              color: '#2563eb',
              padding: isMobile ? '10px 16px' : '12px 20px',
              borderRadius: '50px',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: 600,
              marginBottom: isMobile ? '24px' : '32px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid #dbeafe'
            }}>
              <Sparkles style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px' }} />
              <span>5 Seviyeli Yapay Zeka Gelişim Modeli</span>
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.1,
              marginBottom: '32px',
              letterSpacing: '-0.02em'
            }}>
              Gelişim Yolunuzu<br />
              <span style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Keşfedin
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 22px)',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '48px',
              maxWidth: '700px',
              margin: '0 auto 48px'
            }}>
              Yapay zekayı{' '}
              <strong style={{ color: '#0f172a' }}>öğrenin, uygulayın ve büyüyün.</strong>{' '}
              Seviye seviye ilerleyen eğitimler ve kişisel yetkinlik değerlendirmesi bir arada.
            </p>

            {/* Dual CTA */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '12px' : '16px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '320px' : 'none',
              margin: '0 auto'
            }}>
              <button
                onClick={() => setCurrentView('education')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isMobile ? '10px' : '12px',
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  color: 'white',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 700,
                  padding: isMobile ? '16px 28px' : '20px 40px',
                  minHeight: isMobile ? '52px' : 'auto',
                  width: isMobile ? '100%' : 'auto',
                  borderRadius: isMobile ? '14px' : '16px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(37,99,235,0.35)'
                }}
              >
                <BookOpen style={{ width: isMobile ? '18px' : '20px', height: isMobile ? '18px' : '20px' }} />
                <span>Eğitimlere Başla</span>
              </button>
              <button
                onClick={startAssessment}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isMobile ? '10px' : '12px',
                  background: 'white',
                  color: '#2563eb',
                  fontSize: isMobile ? '15px' : '17px',
                  fontWeight: 600,
                  padding: isMobile ? '15px 28px' : '19px 36px',
                  minHeight: isMobile ? '52px' : 'auto',
                  width: isMobile ? '100%' : 'auto',
                  borderRadius: isMobile ? '14px' : '16px',
                  border: '2px solid #2563eb',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(37,99,235,0.15)'
                }}
              >
                <BarChart3 style={{ width: isMobile ? '17px' : '19px', height: isMobile ? '17px' : '19px' }} />
                <span>Seviyemi Ölç</span>
              </button>
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section style={{ padding: isMobile ? '48px 16px' : '80px 24px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                GELİŞİM MODELİ
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a' }}>
                5 Seviyeli Yapay Zeka Gelişim Modeli
              </h2>
            </div>

            {/* Horizontal Timeline Container */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'flex-start',
              gap: isMobile ? '16px' : '12px',
              justifyContent: 'center',
              position: 'relative',
              padding: isMobile ? '0' : '20px 0'
            }}>
              {/* Timeline Line - Desktop Only */}
              {!isMobile && (
                <div style={{
                  position: 'absolute',
                  top: '52px',
                  left: '5%',
                  right: '5%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #f59e0b 25%, #10b981 50%, #8b5cf6 75%, #f43f5e 100%)',
                  borderRadius: '2px',
                  zIndex: 0,
                  opacity: 0.15
                }} />
              )}

              {competencyLevels.map((level, index) => {
                const LevelIcon = level.icon;
                const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e'];
                const bgColor = colors[index];
                const isPopoverOpen = selectedLevelPopover === index;

                return (
                  <div
                    key={level.id}
                    style={{
                      position: 'relative',
                      flex: isMobile ? 'none' : '0 0 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 1
                    }}
                  >

                    {/* Level Card */}
                    <div
                      onClick={() => setSelectedLevelPopover(isPopoverOpen ? null : index)}
                      style={{
                        backgroundColor: 'white',
                        border: isPopoverOpen ? `3px solid ${bgColor}` : '2px solid #f1f5f9',
                        borderRadius: '24px',
                        padding: isMobile ? '20px' : '20px 16px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        boxShadow: isPopoverOpen ? `0 12px 40px ${bgColor}30` : '0 2px 8px rgba(0,0,0,0.04)',
                        transform: isPopoverOpen ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                        width: isMobile ? '100%' : '180px',
                        minHeight: isMobile ? 'auto' : '240px'
                      }}
                      onMouseOver={(e) => {
                        if (!isPopoverOpen) {
                          e.currentTarget.style.borderColor = `${bgColor}40`;
                          e.currentTarget.style.boxShadow = `0 8px 24px ${bgColor}20`;
                          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isPopoverOpen) {
                          e.currentTarget.style.borderColor = '#f1f5f9';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                        {/* Icon */}
                        <div style={{
                          width: '64px',
                          height: '64px',
                          backgroundColor: bgColor,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: `0 4px 16px ${bgColor}40`,
                          position: 'relative'
                        }}>
                          <LevelIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                          {/* Level Number Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            width: '24px',
                            height: '24px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${bgColor}`,
                            fontSize: '11px',
                            fontWeight: 700,
                            color: bgColor
                          }}>
                            {level.id}
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, width: '100%' }}>
                          <h3 style={{
                            fontSize: isMobile ? '15px' : '14px',
                            fontWeight: 700,
                            color: '#0f172a',
                            margin: '0 0 6px',
                            lineHeight: 1.3
                          }}>
                            {level.title}
                          </h3>
                          <p style={{
                            fontSize: isMobile ? '13px' : '12px',
                            color: '#64748b',
                            margin: 0,
                            lineHeight: 1.4
                          }}>
                            {level.subtitle}
                          </p>
                        </div>

                        {/* Expand indicator */}
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isPopoverOpen ? bgColor : '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          marginTop: '4px'
                        }}>
                          <ChevronDown style={{
                            width: '16px',
                            height: '16px',
                            color: isPopoverOpen ? 'white' : '#94a3b8',
                            transform: isPopoverOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }} />
                        </div>
                      </div>
                    </div>

                    {/* Popover Content */}
                    {isPopoverOpen && (
                      <div style={{
                        marginTop: '12px',
                        backgroundColor: 'white',
                        border: `2px solid ${bgColor}30`,
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                        animation: 'fadeIn 0.2s ease'
                      }}>
                        {/* Description */}
                        <p style={{
                          fontSize: '14px',
                          color: '#475569',
                          lineHeight: 1.6,
                          margin: '0 0 16px',
                          paddingBottom: '16px',
                          borderBottom: '1px solid #f1f5f9'
                        }}>
                          {level.description}
                        </p>

                        {/* Behavioral Indicators */}
                        <div>
                          <p style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            margin: '0 0 12px'
                          }}>
                            Davranış Göstergeleri
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {level.questions.slice(0, 4).map((q, qIdx) => (
                              <div key={qIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <CheckCircle2 style={{
                                  width: '16px',
                                  height: '16px',
                                  color: bgColor,
                                  flexShrink: 0,
                                  marginTop: '2px'
                                }} />
                                <span style={{
                                  fontSize: '13px',
                                  color: '#334155',
                                  lineHeight: 1.4
                                }}>
                                  {q.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CSS Animation */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        </section>

        {/* Problem Section */}
        <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                padding: '10px 18px',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '16px'
              }}>
                <Sparkles style={{ width: '16px', height: '16px' }} />
                Nereden Başlayacaksın?
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                Gelişim Modeli Bu Sorulara<br />
                <span style={{ color: '#3b82f6' }}>Cevap Veriyor</span>
              </h2>
              <p style={{ fontSize: '18px', color: '#64748b' }}>
                Seviyeni keşfet, doğru eğitimden başla
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: Target, text: "Yapay zekada hangi seviyedeyim?" },
                { icon: Compass, text: "Kendimi geliştirmek için nereden başlamalıyım?" },
                { icon: Lightbulb, text: "Prompt mu öğrenmeliyim, otomasyon mu, yoksa daha temel bir şey mi?" }
              ].map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '20px',
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{
                      width: '52px',
                      height: '52px',
                      backgroundColor: '#fef9c3',
                      border: '1px solid #fde047',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ItemIcon style={{ width: '24px', height: '24px', color: '#ca8a04' }} />
                    </div>
                    <p style={{ fontSize: '17px', color: '#334155', lineHeight: 1.6, margin: 0, paddingTop: '8px' }}>{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section style={{ padding: '80px 24px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                FAYDALAR
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                Yapay Zeka Gelişim Modeli<br />Size Ne Sağlar?
              </h2>
              <p style={{ fontSize: '18px', color: '#64748b' }}>Öğrenmekten eyleme — somut adımlar</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {[
                { icon: Target, title: 'Mevcut Durum', desc: '5 seviyeli olgunluk modelinde şu an nerede olduğunuzu net olarak görün.', gradient: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '#a7f3d0', iconBg: 'linear-gradient(135deg, #10b981, #14b8a6)' },
                { icon: TrendingUp, title: 'Gelişim Yolu', desc: 'Sonraki seviyeye geçmek için hangi becerilere odaklanmanız gerektiğini öğrenin.', gradient: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '#93c5fd', iconBg: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
                { icon: Users, title: 'Ortak Dil', desc: 'İK, yöneticiler ve ekipler arasında ortak bir anlayış ve terminoloji oluşturun.', gradient: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '#c4b5fd', iconBg: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={i}
                    style={{
                      background: item.gradient,
                      border: `2px solid ${item.border}`,
                      borderRadius: '24px',
                      padding: '32px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: item.iconBg,
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                    }}>
                      <ItemIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>{item.title}</h3>
                    <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section style={{ padding: '80px 24px', backgroundColor: '#0f172a' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '48px',
              textAlign: 'center'
            }}>
              {[
                { icon: Compass, title: 'Test değil, pusula', desc: 'Doğru veya yanlış cevap yok. Amacımız yargılamak değil, yön göstermek.' },
                { icon: Lock, title: 'Verileriniz sizde', desc: 'Yanıtlarınız sunucuya gönderilmez. Tüm işlem tarayıcınızda gerçekleşir.' },
                { icon: Target, title: 'Gelişim odaklı', desc: 'Eğitimler ve değerlendirme birlikte çalışır — öğrenin, uygulayın, bir üst seviyeye geçin.' }
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <div key={i}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <ItemIcon style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>{item.title}</h3>
                    <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{
          padding: '100px 24px',
          background: 'linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '10px 18px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '24px'
            }}>
              <Rocket style={{ width: '16px', height: '16px' }} />
              <span>Hazır mısınız?</span>
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: 'white', marginBottom: '20px' }}>
              Yapay Zeka Gelişim<br />Yolculuğunuza Başlayın
            </h2>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '40px' }}>
              Eğitimlerle öğrenin, değerlendirmeyle seviyenizi doğrulayın.<br />
              Hepsi burada, ücretsiz.
            </p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={() => setCurrentView('education')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'white',
                  color: '#2563eb',
                  fontSize: '18px',
                  fontWeight: 700,
                  padding: '20px 40px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
              >
                <BookOpen style={{ width: '20px', height: '20px' }} />
                <span>Eğitimlere Git</span>
              </button>
              <button
                onClick={startAssessment}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  fontSize: '17px',
                  fontWeight: 600,
                  padding: '19px 36px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255,255,255,0.6)',
                  cursor: 'pointer'
                }}
              >
                <BarChart3 style={{ width: '19px', height: '19px' }} />
                <span>Seviyemi Ölç</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '40px 24px', backgroundColor: '#020617', borderTop: '1px solid #1e293b' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Brain style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '14px', color: '#64748b' }}>© 2026 Mustafa Aydın</span>
            </div>
            <button
              onClick={() => setShowGlossary(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#64748b',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Library style={{ width: '16px', height: '16px' }} />
              Kavramlar Sözlüğü
            </button>
          </div>
        </footer>

        <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
        <NewsModal isOpen={showNews} onClose={() => setShowNews(false)} />
      </div>
    );
  }

  // ==================== EDUCATION PAGE ====================
  if (currentView === 'education') {
    const levelColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e'];
    const activeLevelData = competencyLevels[educationActiveLevel];
    const activeBgColor = levelColors[educationActiveLevel];
    const ActiveIcon = activeLevelData.icon;

    const pageSections = educationActiveSection === 'read'
      ? [
          { id: 'giris', title: 'Giriş' },
          { id: 'ogrenecekleriniz', title: 'Ne Öğreneceksiniz?' },
          { id: 'araclar', title: 'Araçlar & Kaynaklar' },
          { id: 'sonraki-adim', title: 'Sonraki Adım' },
        ]
      : [
          { id: 'video-listesi', title: 'Video Listesi' },
          { id: 'sonraki-adim', title: 'Sonraki Adım' },
        ];

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile ? '60px' : '72px' }}>
              {/* Logo */}
              <div
                onClick={() => setCurrentView('home')}
                style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px', cursor: 'pointer' }}
              >
                <div style={{
                  width: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px',
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  borderRadius: isMobile ? '10px' : '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                }}>
                  <Brain style={{ width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px', color: 'white' }} />
                </div>
                {!isMobile && (
                  <div>
                    <h1 style={{ color: '#0f172a', fontWeight: 700, fontSize: '18px', margin: 0 }}>Yapay Zeka Gelişim Modeli</h1>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Öğren · Gelişin · Büyü</p>
                  </div>
                )}
              </div>
              {/* Nav */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
                {/* Eğitim - aktif sayfa göstergesi (ilk sırada, ana sayfa ile aynı konum) */}
                <button
                  aria-current="page"
                  aria-label="Şu an Eğitim sayfasındasınız"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    color: '#2563eb', fontSize: '14px', fontWeight: 600,
                    padding: isMobile ? '10px' : '10px 16px', borderRadius: '10px',
                    border: '1px solid #dbeafe', background: '#eff6ff', cursor: 'default',
                    minWidth: '44px', minHeight: '44px', outline: 'none'
                  }}
                >
                  <BookOpen style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
                  {!isMobile && 'Eğitimler'}
                </button>
                <button
                  onClick={() => setShowGlossary(true)}
                  aria-label="Kavramlar sözlüğünü aç"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    color: '#475569', fontSize: '14px', fontWeight: 500,
                    padding: isMobile ? '10px' : '10px 16px', borderRadius: '10px',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    minWidth: '44px', minHeight: '44px', outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <Library style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
                  {!isMobile && 'Kavramlar'}
                </button>
                <button
                  onClick={() => setShowNews(true)}
                  aria-label="Güncel haberleri aç"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    color: '#475569', fontSize: '14px', fontWeight: 500,
                    padding: isMobile ? '10px' : '10px 16px', borderRadius: '10px',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    minWidth: '44px', minHeight: '44px', outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <TrendingUp style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
                  {!isMobile && 'Haberler'}
                </button>
                <button
                  onClick={startAssessment}
                  aria-label="Değerlendirmeyi başlat"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                    color: 'white', fontSize: isMobile ? '13px' : '14px', fontWeight: 600,
                    padding: isMobile ? '10px 16px' : '12px 24px', borderRadius: '12px',
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)', minHeight: '44px', outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.5)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)'}
                >
                  {isMobile ? 'Değerlendirme' : 'Değerlendirmeye Başla'}
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* 3-Column Layout */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: isMobile ? 'block' : 'flex',
          minHeight: 'calc(100vh - 72px)'
        }}>
          {/* Left Sidebar */}
          {!isMobile && (
            <aside style={{
              width: '260px',
              flex: '0 0 260px',
              borderRight: '1px solid #e2e8f0',
              position: 'sticky',
              top: '72px',
              height: 'calc(100vh - 72px)',
              overflowY: 'auto',
              backgroundColor: 'white',
              padding: '24px 0'
            }}>
              <div style={{
                padding: '0 16px 12px',
                fontSize: '12px', fontWeight: 700, color: '#94a3b8',
                letterSpacing: '1px', textTransform: 'uppercase'
              }}>
                Modüller
              </div>
              {competencyLevels.map((level, index) => {
                const LevelIcon = level.icon;
                const color = levelColors[index];
                const isActive = educationActiveLevel === index;
                const hasToolNav = TOOL_NAV_LEVELS.includes(index);
                const isReadActive = isActive && !hasToolNav && educationActiveSection === 'read';
                const isWatchActive = isActive && !hasToolNav && educationActiveSection === 'watch';
                return (
                  <div key={level.id}>
                    {/* Seviye butonu */}
                    <button
                      onClick={() => {
                        setEducationActiveLevel(index);
                        setEducationActiveSection('read');
                        setEducationActiveTool(hasToolNav ? 0 : null);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`Seviye ${level.id}: ${level.title}${isActive ? ' (şu an görüntüleniyor)' : ''}`}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 16px',
                        background: isActive ? `${color}18` : 'transparent',
                        border: 'none',
                        borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        outline: 'none'
                      }}
                      onFocus={(e) => { e.currentTarget.style.boxShadow = `inset 0 0 0 2px ${color}60`; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{
                        width: '32px', height: '32px',
                        backgroundColor: isActive ? color : '#f1f5f9',
                        borderRadius: '8px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s',
                        boxShadow: isActive ? `0 2px 8px ${color}40` : 'none'
                      }}>
                        <LevelIcon style={{ width: '15px', height: '15px', color: isActive ? 'white' : '#64748b' }} aria-hidden="true" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', color: isActive ? color : '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                          Seviye {level.id}
                        </div>
                        <div style={{ fontSize: '14px', color: isActive ? '#0f172a' : '#475569', fontWeight: isActive ? 700 : 500, lineHeight: 1.3 }}>
                          {level.title}
                        </div>
                      </div>
                      {isActive && (
                        <div style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          backgroundColor: color, flexShrink: 0
                        }} aria-hidden="true" />
                      )}
                    </button>

                    {/* Alt navigasyon — sadece aktif seviyede */}
                    {isActive && (
                      <div style={{ borderLeft: `3px solid ${color}`, marginLeft: '16px' }}>

                        {/* Araç bazlı nav (Seviye 2 gibi) */}
                        {hasToolNav ? (
                          level.tools.map((tool, toolIndex) => {
                            const isToolActive = educationActiveTool === toolIndex;
                            const isToolReadActive = isToolActive && educationActiveSection === 'read';
                            const isToolWatchActive = isToolActive && educationActiveSection === 'watch';
                            return (
                              <div key={toolIndex}>
                                {/* Araç butonu */}
                                <button
                                  onClick={() => { setEducationActiveTool(toolIndex); setEducationActiveSection('read'); }}
                                  style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 16px',
                                    background: isToolActive ? `${color}12` : 'transparent',
                                    border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                                  }}
                                >
                                  <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                                    backgroundColor: isToolActive ? color : '#cbd5e1',
                                    transition: 'all 0.15s'
                                  }} />
                                  <span style={{ fontSize: '13px', color: isToolActive ? color : '#64748b', fontWeight: isToolActive ? 700 : 500 }}>
                                    {tool}
                                  </span>
                                </button>

                                {/* Read / Watch — sadece aktif araç altında */}
                                {isToolActive && (
                                  <div style={{ marginLeft: '22px' }}>
                                    <button
                                      onClick={() => setEducationActiveSection('read')}
                                      style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '6px 16px',
                                        background: isToolReadActive ? `${color}10` : 'transparent',
                                        border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                                      }}
                                    >
                                      <BookOpen style={{ width: '13px', height: '13px', color: isToolReadActive ? color : '#94a3b8', flexShrink: 0 }} />
                                      <span style={{ fontSize: '13px', color: isToolReadActive ? color : '#94a3b8', fontWeight: isToolReadActive ? 600 : 400 }}>
                                        Okuyarak Öğren
                                      </span>
                                    </button>

                                    <button
                                      onClick={() => { setEducationActiveSection('watch'); setEducationActiveLesson(null); }}
                                      style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '6px 16px',
                                        background: isToolWatchActive ? `${color}10` : 'transparent',
                                        border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                                      }}
                                    >
                                      <PlayCircle style={{ width: '13px', height: '13px', color: isToolWatchActive ? color : '#94a3b8', flexShrink: 0 }} />
                                      <span style={{ fontSize: '13px', color: isToolWatchActive ? color : '#94a3b8', fontWeight: isToolWatchActive ? 600 : 400 }}>
                                        İzleyerek Öğren
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          /* Doğrudan read/watch (Seviye 1, 3, 4, 5) */
                          <>
                            <button
                              onClick={() => setEducationActiveSection('read')}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px',
                                background: isReadActive ? `${color}12` : 'transparent',
                                border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                              }}
                            >
                              <BookOpen style={{ width: '14px', height: '14px', color: isReadActive ? color : '#94a3b8', flexShrink: 0 }} />
                              <span style={{ fontSize: '13px', color: isReadActive ? color : '#64748b', fontWeight: isReadActive ? 600 : 400 }}>
                                Okuyarak Öğren
                              </span>
                            </button>
                            <button
                              onClick={() => setEducationActiveSection('watch')}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px',
                                background: isWatchActive ? `${color}12` : 'transparent',
                                border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                              }}
                            >
                              <PlayCircle style={{ width: '14px', height: '14px', color: isWatchActive ? color : '#94a3b8', flexShrink: 0 }} />
                              <span style={{ fontSize: '13px', color: isWatchActive ? color : '#64748b', fontWeight: isWatchActive ? 600 : 400 }}>
                                İzleyerek Öğren
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </aside>
          )}

          {/* Mobile Level Tabs */}
          {isMobile && (
            <div style={{
              overflowX: 'auto', padding: '16px 16px 0',
              display: 'flex', gap: '8px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: 'white'
            }}>
              {competencyLevels.map((level, index) => {
                const color = levelColors[index];
                const isActive = educationActiveLevel === index;
                return (
                  <button
                    key={level.id}
                    onClick={() => setEducationActiveLevel(index)}
                    style={{
                      flexShrink: 0, padding: '8px 14px 12px',
                      borderRadius: '0', border: 'none',
                      borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
                      background: 'transparent',
                      color: isActive ? color : '#64748b',
                      fontSize: '13px', fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s'
                    }}
                  >
                    S{level.id} · {level.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Content */}
          <main style={{
            flex: 1,
            padding: isMobile ? '28px 20px 60px' : '40px 32px 80px',
            minWidth: 0
          }}>
            {/* Breadcrumb */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '28px', fontSize: '14px', color: '#94a3b8', flexWrap: 'wrap'
            }}>
              <span
                onClick={() => setCurrentView('home')}
                style={{ cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#475569'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
              >Ana Sayfa</span>
              <ChevronRight style={{ width: '14px', height: '14px' }} />
              <span>Eğitim</span>
              <ChevronRight style={{ width: '14px', height: '14px' }} />
              <span
                onClick={() => { setEducationActiveTool(null); setEducationActiveSection('read'); }}
                style={{ cursor: TOOL_NAV_LEVELS.includes(educationActiveLevel) ? 'pointer' : 'default', color: '#475569' }}
              >
                Seviye {activeLevelData.id} · {activeLevelData.title}
              </span>
              {TOOL_NAV_LEVELS.includes(educationActiveLevel) && educationActiveTool !== null && (
                <>
                  <ChevronRight style={{ width: '14px', height: '14px' }} />
                  <span style={{ color: activeBgColor, fontWeight: 600 }}>
                    {activeLevelData.tools[educationActiveTool]}
                  </span>
                </>
              )}
              {!TOOL_NAV_LEVELS.includes(educationActiveLevel) && (
                <>
                  <ChevronRight style={{ width: '14px', height: '14px' }} />
                  <span style={{ color: activeBgColor, fontWeight: 600 }}>
                    {educationActiveSection === 'read' ? 'Okuyarak Öğren' : 'İzleyerek Öğren'}
                  </span>
                </>
              )}
            </div>

            {/* Module Header */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '60px', height: '60px',
                  backgroundColor: activeBgColor,
                  borderRadius: '18px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 6px 20px ${activeBgColor}40`, flexShrink: 0
                }}>
                  <ActiveIcon style={{ width: '30px', height: '30px', color: 'white' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '12px', fontWeight: 700, color: activeBgColor,
                    letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px'
                  }}>
                    Seviye {activeLevelData.id}
                  </p>
                  <h1 style={{
                    fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800,
                    color: '#0f172a', margin: 0, lineHeight: 1.2
                  }}>
                    {activeLevelData.title}
                  </h1>
                </div>
              </div>
              <p style={{
                fontSize: '18px', color: '#475569', lineHeight: 1.7,
                margin: 0, maxWidth: '720px'
              }}>
                {activeLevelData.description}
              </p>
            </div>

            {/* ——— OKUYARAK ÖĞREN ——— */}
            {educationActiveSection === 'read' && (
              <>
                {/* Seviye 1 — ChatGPT: yakında / Gemini: Prompting Slaytları */}
                {educationActiveLevel === 0 && educationActiveTool === 0 ? (
                  /* ChatGPT — içerik yakında */
                  <section style={{ marginBottom: '52px' }}>
                    <div style={{
                      backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0',
                      borderRadius: '16px', padding: '48px 32px', textAlign: 'center'
                    }}>
                      <div style={{
                        width: '56px', height: '56px', backgroundColor: '#f1f5f9',
                        borderRadius: '14px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 16px'
                      }}>
                        <BookOpen style={{ width: '26px', height: '26px', color: '#94a3b8' }} />
                      </div>
                      <p style={{ fontSize: '17px', fontWeight: 700, color: '#334155', margin: '0 0 8px' }}>
                        İçerik Hazırlanıyor
                      </p>
                      <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                        ChatGPT için okuma içerikleri yakında eklenecek.
                      </p>
                    </div>
                  </section>
                ) : educationActiveLevel === 0 && educationActiveTool === 1 ? (
                  /* Gemini — Prompting Slaytları */
                  <>
                    <section id="giris" style={{ marginBottom: '52px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                        Mastering Gemini Prompting
                      </h2>
                      <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '28px', maxWidth: '680px' }}>
                        Google'ın <strong style={{ color: '#0f172a' }}>LearnLM</strong> teknolojisi, Gemini yapay zekasını bir öğretmen asistanına dönüştürüyor.
                        Bu rehber; doğrudan cevap vermek yerine adım adım düşündüren, <strong style={{ color: '#0f172a' }}>PARTS çerçevesiyle</strong> özelleştirilebilen
                        ve Google Arama, YouTube ile Classroom'a entegre çalışan sistemi pratik örneklerle anlatıyor.
                        Yapay zekanın sınıflarda nasıl koçluk yapabileceğini 15 slayta sığdırdık.
                      </p>
                      <SlideViewer
                        slides={GEMINI_SLIDES}
                        title="Mastering Gemini Prompting"
                        source="Google · 15 slayt"
                      />
                    </section>

                    <section id="ogrenecekleriniz" style={{ marginBottom: '52px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                        Bu Rehberde Ne Var?
                      </h2>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                        {[
                          'LearnLM nedir, nasıl çalışır?',
                          'PARTS çerçevesi ile prompt yazma',
                          'Öğretmen asistanı oluşturma',
                          'Gerçek sınıf senaryoları'
                        ].map((item, i) => (
                          <div key={i} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: activeBgColor + '20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                              <CheckCircle2 style={{ width: '13px', height: '13px', color: activeBgColor }} />
                            </div>
                            <span style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="araclar" style={{ marginBottom: '52px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                        Araçlar & Kaynaklar
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {activeLevelData.tools.map((tool, i) => (
                          <span key={i} style={{ backgroundColor: 'white', border: `1px solid ${activeBgColor}50`, borderRadius: '20px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: activeBgColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeBgColor }} />
                            {tool}
                          </span>
                        ))}
                      </div>
                    </section>
                  </>
                ) : TOOL_NAV_LEVELS.includes(educationActiveLevel) && educationActiveTool !== null ? (
                  /* Araç bazlı seviyeler */
                  educationActiveLevel === 4 && educationActiveTool === 0 && educationActiveSection === 'read' ? (
                    /* Claude Code — Okuyarak Öğren ders içerikleri */
                    <>
                      {!educationActiveLesson && (
                        <section style={{ marginBottom: '40px' }}>
                          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                            Claude Code — Okuyarak Öğren
                          </h2>
                          <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '20px 24px' }}>
                            <p style={{ color: '#881337', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                              Sol menüden bir konu seçerek okumaya başlayabilirsin.
                            </p>
                          </div>
                        </section>
                      )}

                      {educationActiveLesson === 'intro' && (
                        <section style={{ marginBottom: '40px' }}>
                          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                            Kurs Tanıtımı
                          </h2>
                          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                            Bu kurs, Claude Code'u sıfırdan öğrenmek isteyenler için hazırlanmıştır. Kodlama bilgisi gerekmez — sadece yapay zeka ile çalışmak istemen yeterli.
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Kodlama bilgisi gerekmez', 'Adım adım ilerleyebilirsin', 'Gerçek projeler üretirsin', 'Yapay zeka destekli geliştirme öğrenirsin'].map((item, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', border: '1px solid #fecdd3', borderRadius: '10px', padding: '14px 16px' }}>
                                <div style={{ width: '28px', height: '28px', backgroundColor: '#fff1f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <CheckCircle2 style={{ width: '14px', height: '14px', color: '#f43f5e' }} />
                                </div>
                                <span style={{ fontSize: '15px', color: '#334155' }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {educationActiveLesson === 'mod0-0' && (
                        <section style={{ marginBottom: '40px' }}>
                          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                            0.0: Claude Code'a Giriş
                          </h2>
                          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                            Claude Code, Anthropic'in yapay zeka destekli terminal aracıdır. Terminal üzerinden komutlar vererek kod yazar, dosya oluşturur, projeleri yönetir ve hata ayıklar.
                          </p>
                          <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px' }}>
                            <p style={{ color: '#881337', fontSize: '15px', lineHeight: 1.7, margin: '0 0 8px', fontWeight: 700 }}>Ne Yapabilir?</p>
                            <ul style={{ color: '#9f1239', fontSize: '15px', lineHeight: 2, margin: 0, paddingLeft: '20px' }}>
                              <li>Doğal dille komut vererek uygulama geliştir</li>
                              <li>Mevcut kodunu oku, düzenle ve açıkla</li>
                              <li>Hataları otomatik olarak tespit edip düzelt</li>
                              <li>GitHub'a push, test çalıştırma gibi işlemleri yönet</li>
                            </ul>
                          </div>
                        </section>
                      )}

                      {educationActiveLesson === 'mod0-1' && (
                        <section style={{ marginBottom: '40px' }}>
                          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                            0.1: Kurulum
                          </h2>
                          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                            Claude Code'u kurmak için bilgisayarında Node.js yüklü olması yeterli.
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                              { adim: '1', baslik: 'Node.js Kur', aciklama: 'nodejs.org adresinden Node.js 18+ sürümünü indir ve kur.' },
                              { adim: '2', baslik: 'Claude Code Yükle', aciklama: 'Terminali aç ve şu komutu çalıştır: npm install -g @anthropic-ai/claude-code' },
                              { adim: '3', baslik: 'Giriş Yap', aciklama: 'claude komutuyla başlat, Anthropic hesabınla giriş yap.' },
                            ].map((item, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#f43f5e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{item.adim}</span>
                                </div>
                                <div>
                                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{item.baslik}</p>
                                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{item.aciklama}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {educationActiveLesson === 'mod0-2' && (
                        <section style={{ marginBottom: '40px' }}>
                          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                            0.2: İndir ve Başlat
                          </h2>
                          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                            Kurulum tamamlandıktan sonra Claude Code'u ilk kez başlatmak çok kolay.
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                              { adim: '1', baslik: 'Terminali Aç', aciklama: 'Windows\'ta PowerShell, Mac\'te Terminal uygulamasını aç.' },
                              { adim: '2', baslik: 'Proje Klasörüne Git', aciklama: 'cd komutunu kullanarak proje klasörüne git. Örnek: cd belgeler/projem' },
                              { adim: '3', baslik: 'Claude\'u Başlat', aciklama: '"claude" yazıp Enter\'a bas. Yapay zeka seni karşılayacak.' },
                              { adim: '4', baslik: 'İlk Komutu Ver', aciklama: '"Merhaba, bu klasörde ne var?" diyerek başlayabilirsin.' },
                            ].map((item, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#f43f5e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{item.adim}</span>
                                </div>
                                <div>
                                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{item.baslik}</p>
                                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{item.aciklama}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </>
                  ) : (
                  /* Diğer araçlar için placeholder */
                  <>
                    <section id="giris" style={{ marginBottom: '52px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                        {activeLevelData.tools[educationActiveTool]}
                      </h2>
                      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '12px', padding: '20px 24px', display: 'flex', gap: '12px' }}>
                        <Info style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ color: '#1e40af', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                          <strong>{activeLevelData.tools[educationActiveTool]}</strong> için okuma içeriği hazırlanmaktadır.
                          Yakında burada rehberler ve makaleler yer alacak.
                        </p>
                      </div>
                    </section>

                    <section id="ogrenecekleriniz" style={{ marginBottom: '52px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                        Ne Öğreneceksiniz?
                      </h2>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                        {[
                          'Temel kavramlar ve terminoloji',
                          'Pratik uygulama örnekleri',
                          'Adım adım kurulum rehberi',
                          'Gerçek kullanım senaryoları'
                        ].map((item, i) => (
                          <div key={i} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: activeBgColor + '20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                              <CheckCircle2 style={{ width: '13px', height: '13px', color: activeBgColor }} />
                            </div>
                            <span style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                  )
                ) : (
                  /* Diğer seviyeler — genel placeholder */
                  <>
                    <section id="giris" style={{ marginBottom: '52px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                        Giriş
                      </h2>
                      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '12px', padding: '20px 24px', display: 'flex', gap: '12px' }}>
                        <Info style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ color: '#1e40af', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                          Bu modülün yazılı içeriği hazırlanmaktadır. Yakında burada{' '}
                          <strong>{activeLevelData.title}</strong> seviyesine ait makaleler ve rehberler yer alacak.
                        </p>
                      </div>
                    </section>

                    <section id="ogrenecekleriniz" style={{ marginBottom: '52px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                        Ne Öğreneceksiniz?
                      </h2>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                        {[
                          'Temel kavramlar ve terminoloji',
                          'Pratik uygulama örnekleri',
                          'Gerçek dünya senaryoları',
                          'Değerlendirme kriterleri ve kanıtlar'
                        ].map((item, i) => (
                          <div key={i} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: activeBgColor + '20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                              <CheckCircle2 style={{ width: '13px', height: '13px', color: activeBgColor }} />
                            </div>
                            <span style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="araclar" style={{ marginBottom: '52px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                        Araçlar & Kaynaklar
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {activeLevelData.tools.map((tool, i) => (
                          <span key={i} style={{ backgroundColor: 'white', border: `1px solid ${activeBgColor}50`, borderRadius: '20px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: activeBgColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeBgColor }} />
                            {tool}
                          </span>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </>
            )}

            {/* ——— İZLEYEREK ÖĞREN ——— */}
            {educationActiveSection === 'watch' && (
              <>
                <section id="video-listesi" style={{ marginBottom: '52px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                    Video Listesi
                  </h2>

                  {/* Claude Code özel kurs kartı */}
                  {educationActiveLevel === 4 && educationActiveTool === 0 && (
                    <a
                      href="https://anthropic.skilljar.com/claude-code-in-action/303233"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        gap: '0',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        border: '2px solid #e9d5ff',
                        textDecoration: 'none',
                        marginBottom: '16px',
                        boxShadow: '0 4px 20px rgba(124,58,237,0.1)',
                        transition: 'all 0.25s',
                        background: 'white',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#7c3aed';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e9d5ff';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Sol — görsel */}
                      <div style={{
                        width: '200px',
                        minHeight: '110px',
                        flexShrink: 0,
                        overflow: 'hidden',
                        background: '#1e1b4b',
                      }}>
                        <img
                          src="/claude-code-promo.svg"
                          alt="Claude Code in Action"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>

                      {/* Sağ — içerik */}
                      <div style={{ flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 700,
                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            color: 'white', padding: '3px 10px', borderRadius: '20px',
                            letterSpacing: '0.5px', textTransform: 'uppercase'
                          }}>
                            Resmi Kurs
                          </span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                          Claude Code in Action
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                          MCP sunucuları, GitHub entegrasyonu, bağlam yönetimi ve otomasyon komutlarını kapsayan kapsamlı geliştirici eğitimi.
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <ExternalLink style={{ width: '13px', height: '13px', color: '#7c3aed' }} />
                          <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 600 }}>anthropic.skilljar.com'da aç</span>
                        </div>
                      </div>
                    </a>
                  )}

                  {/* YouTube video listesi */}
                  {TOOL_NAV_LEVELS.includes(educationActiveLevel) && educationActiveTool !== null
                      && activeLevelData.tools[educationActiveTool] ? (
                    <YouTubeVideoList
                      keyword={activeLevelData.tools[educationActiveTool]}
                      accentColor={activeBgColor}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '52px', height: '52px', backgroundColor: activeBgColor + '15', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <PlayCircle style={{ width: '24px', height: '24px', color: activeBgColor }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Sol menüden bir araç seçin</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Araç seçince videolar burada görünür</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </>
            )}

            {/* Sonraki Adım — her iki bölümde de ortak */}
            <section id="sonraki-adim" style={{ marginBottom: '52px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9' }}>
                Sonraki Adım
              </h2>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {educationActiveLevel < 4 && (
                  <button
                    onClick={() => { setEducationActiveLevel(educationActiveLevel + 1); setEducationActiveSection('read'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = levelColors[educationActiveLevel + 1]; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Sonraki Seviye</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{competencyLevels[educationActiveLevel + 1].title}</div>
                    </div>
                    <ChevronRight style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
                  </button>
                )}
                <button
                  onClick={startAssessment}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white', border: 'none', borderRadius: '12px', padding: '16px 24px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
                >
                  <Target style={{ width: '18px', height: '18px' }} />
                  Seviyeni Test Et
                </button>
              </div>
            </section>

            {/* Prev / Next Navigation */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              paddingTop: '32px', borderTop: '1px solid #e2e8f0'
            }}>
              {educationActiveLevel > 0 ? (
                <button
                  onClick={() => setEducationActiveLevel(educationActiveLevel - 1)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    color: '#475569', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontWeight: 500
                  }}
                >
                  <ChevronLeft style={{ width: '18px', height: '18px' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>Önceki Seviye</div>
                    <div>{competencyLevels[educationActiveLevel - 1].title}</div>
                  </div>
                </button>
              ) : <div />}
              {educationActiveLevel < 4 ? (
                <button
                  onClick={() => setEducationActiveLevel(educationActiveLevel + 1)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    color: '#475569', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontWeight: 500
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>Sonraki Seviye</div>
                    <div>{competencyLevels[educationActiveLevel + 1].title}</div>
                  </div>
                  <ChevronRight style={{ width: '18px', height: '18px' }} />
                </button>
              ) : <div />}
            </div>
          </main>

          {/* Right Sidebar — Bu Sayfada */}
          {!isMobile && (
            <aside style={{
              width: '220px', flex: '0 0 220px',
              padding: '40px 24px 40px 8px',
              position: 'sticky', top: '72px',
              height: 'calc(100vh - 72px)', overflowY: 'auto'
            }}>
              <div style={{
                fontSize: '12px', fontWeight: 700, color: '#94a3b8',
                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px'
              }}>
                Bu Sayfada
              </div>
              {pageSections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  style={{
                    display: 'block', fontSize: '14px', color: '#64748b',
                    textDecoration: 'none', padding: '8px 0 8px 12px',
                    borderLeft: '2px solid #e2e8f0',
                    marginBottom: '4px', transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                    e.currentTarget.style.borderLeftColor = '#2563eb';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.borderLeftColor = '#e2e8f0';
                  }}
                >
                  {section.title}
                </a>
              ))}
            </aside>
          )}
        </div>

        <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
        <NewsModal isOpen={showNews} onClose={() => setShowNews(false)} />
      </div>
    );
  }

  // ==================== ASSESSMENT PAGE ====================
  if (currentView === 'assessment') {
    const currentLevelData = competencyLevels[currentLevel];
    const currentQuestionData = currentLevelData.questions[currentQuestion];
    const Icon = currentLevelData.icon;
    const selectedAnswer = responses[currentLevel]?.[currentQuestion];
    const isAnswered = selectedAnswer !== undefined;

    const totalQuestionsBeforeCurrentLevel = competencyLevels
      .slice(0, currentLevel)
      .reduce((sum, level) => sum + level.questions.length, 0);
    const currentQuestionNumber = totalQuestionsBeforeCurrentLevel + currentQuestion + 1;
    const progress = (currentQuestionNumber / getTotalQuestions()) * 100;

    const levelColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e'];
    const currentColor = levelColors[currentLevel];

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Header - Açık tema ile uyumlu */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '8px 24px' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <button
                onClick={() => setCurrentView('home')}
                aria-label="Ana sayfaya geri dön"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#64748b',
                  fontSize: isMobile ? '14px' : '13px',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: isMobile ? '10px 12px' : '4px 8px',
                  minHeight: isMobile ? '44px' : 'auto',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <ChevronLeft style={{ width: isMobile ? '22px' : '18px', height: isMobile ? '22px' : '18px' }} aria-hidden="true" />
                {!isMobile && <span>Ana Sayfa</span>}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{
                  backgroundColor: currentColor,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  Soru {currentQuestionNumber} / {getTotalQuestions()}
                </span>
                {!isMobile && (
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Seviye {currentLevel + 1}/5 — {currentLevelData.title} • Soru {currentQuestion + 1}/{currentLevelData.questions.length}
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowGlossary(true)}
                aria-label="Kavramlar sözlüğünü aç"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#64748b',
                  fontSize: isMobile ? '14px' : '13px',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: isMobile ? '10px 12px' : '4px 8px',
                  minHeight: isMobile ? '44px' : 'auto',
                  borderRadius: '6px',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <Library style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} aria-hidden="true" />
                {!isMobile && <span>Kavramlar</span>}
              </button>
              <button
                onClick={() => setShowNews(true)}
                aria-label="Güncel haberleri aç"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#64748b',
                  fontSize: isMobile ? '14px' : '13px',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: isMobile ? '10px 12px' : '4px 8px',
                  minHeight: isMobile ? '44px' : 'auto',
                  borderRadius: '6px',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <TrendingUp style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} aria-hidden="true" />
                {!isMobile && <span>Haberler</span>}
              </button>
            </div>

            {/* Progress Bar - Kompakt */}
            <div style={{
              height: '6px',
              backgroundColor: '#e2e8f0',
              borderRadius: '50px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${currentColor}, ${currentColor}cc)`,
                  borderRadius: '50px',
                  transition: 'width 0.3s ease',
                  width: `${progress}%`
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              <span>Genel ilerleme</span>
              <span style={{ fontWeight: 600, color: currentColor }}>%{Math.round(progress)} tamamlandı</span>
            </div>
          </div>
        </header>

        {/* Level Selector - Mobilde yatay kaydırmalı */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: isMobile ? '8px 12px' : '6px 8px',
          overflowX: isMobile ? 'auto' : 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center' }}>
            <div style={{
              display: 'flex',
              gap: isMobile ? '8px' : '4px'
            }}>
              {competencyLevels.map((level, idx) => {
                const LevelIcon = level.icon;
                const isActive = idx === currentLevel;
                const answered = getAnsweredCount(idx);
                const total = level.questions.length;
                const isComplete = answered === total;
                const color = levelColors[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => jumpToLevel(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? '6px' : '4px',
                      padding: isMobile ? '10px 14px' : '5px 8px',
                      minHeight: isMobile ? '44px' : 'auto',
                      borderRadius: isMobile ? '10px' : '6px',
                      fontSize: isMobile ? '13px' : '11px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      border: isActive ? `2px solid ${color}` : '1px solid #e2e8f0',
                      backgroundColor: isActive ? `${color}10` : 'white',
                      color: isActive ? color : '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      flexShrink: 0
                    }}
                  >
                    <LevelIcon style={{ width: isMobile ? '16px' : '13px', height: isMobile ? '16px' : '13px' }} />
                    <span>{isMobile ? `${level.id}` : `${level.id}. Seviye`}</span>
                    {isComplete ? (
                      <CheckCircle2 style={{ width: isMobile ? '14px' : '11px', height: isMobile ? '14px' : '11px', color: '#10b981' }} />
                    ) : (
                      <span style={{ fontSize: isMobile ? '11px' : '9px', color: '#94a3b8' }}>{answered}/{total}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '10px 24px' }} ref={assessmentRef}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Level Info - Tek satır */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
              padding: '8px 12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: currentColor,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon style={{ width: '16px', height: '16px', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                <span style={{ fontSize: '11px', color: currentColor, fontWeight: 700 }}>SEVİYE {currentLevelData.id}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>•</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{currentLevelData.title}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>- {currentLevelData.subtitle}</span>
              </div>
            </div>

            {/* Question Card - Kompakt */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              {/* Question Header */}
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#fafbfc'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: currentColor,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{currentQuestion + 1}</span>
                  </div>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0f172a',
                    lineHeight: 1.45,
                    margin: 0
                  }}>
                    {currentQuestionData.text}
                  </h3>
                </div>
              </div>

              {/* Options - Kompakt tasarım */}
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentQuestionData.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleResponse(currentLevel, currentQuestion, idx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: isMobile ? '14px 16px' : '12px 14px',
                        minHeight: isMobile ? '56px' : 'auto',
                        borderRadius: isMobile ? '12px' : '10px',
                        border: isSelected ? `2px solid ${currentColor}` : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? `${currentColor}08` : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? `0 2px 8px ${currentColor}15` : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '10px' }}>
                        <div style={{
                          width: isMobile ? '32px' : '26px',
                          height: isMobile ? '32px' : '26px',
                          borderRadius: isMobile ? '8px' : '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor: isSelected ? currentColor : '#f1f5f9',
                          transition: 'all 0.15s'
                        }}>
                          {isSelected ? (
                            <CheckCircle2 style={{ width: isMobile ? '18px' : '16px', height: isMobile ? '18px' : '16px', color: 'white' }} />
                          ) : (
                            <span style={{ fontSize: isMobile ? '14px' : '12px', fontWeight: 600, color: '#94a3b8' }}>{idx}</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: isMobile ? '15px' : '14px',
                            lineHeight: 1.4,
                            color: isSelected ? '#0f172a' : '#475569',
                            margin: 0,
                            fontWeight: isSelected ? 500 : 400
                          }}>
                            {option}
                          </p>
                        </div>
                        <div style={{
                          padding: isMobile ? '6px 10px' : '4px 8px',
                          borderRadius: isMobile ? '8px' : '6px',
                          fontSize: isMobile ? '13px' : '12px',
                          fontWeight: 600,
                          flexShrink: 0,
                          backgroundColor: isSelected ? currentColor : '#f1f5f9',
                          color: isSelected ? 'white' : '#64748b'
                        }}>
                          {idx}p
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Evidence + Mentor Chat */}
              <div style={{ padding: '0 16px 14px' }}>
                {/* Kanıt Örneği - tıklanınca sohbet açılır */}
                <div style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setShowMentorChat(!showMentorChat)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#b45309',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lightbulb style={{ width: '16px', height: '16px' }} />
                      <span>Kanıt Örneği</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      backgroundColor: showMentorChat ? '#3b82f6' : '#fef3c7',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: showMentorChat ? '#ffffff' : '#92400e',
                      transition: 'all 0.2s'
                    }}>
                      <MessageCircle style={{ width: '12px', height: '12px' }} />
                      {showMentorChat ? 'Sohbeti Kapat' : 'Mentöre Sor'}
                    </div>
                  </button>

                  {/* Kanıt metni */}
                  <div style={{
                    padding: '0 12px 10px',
                    fontSize: '13px',
                    color: '#78716c',
                    lineHeight: 1.5
                  }}>
                    {currentQuestionData.evidence}
                  </div>
                </div>

                {/* Mentor Chat */}
                <MentorChat
                  isOpen={showMentorChat}
                  onClose={() => setShowMentorChat(false)}
                  context={{
                    level: currentLevelData.id,
                    levelTitle: currentLevelData.title,
                    questionIndex: currentQuestion,
                    questionText: currentQuestionData.text,
                    options: currentQuestionData.options,
                    evidence: currentQuestionData.evidence
                  }}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Navigation Footer */}
        <footer style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
          borderTop: '1px solid #e2e8f0',
          padding: '8px 24px',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Önceki Soru - sadece ilk soru değilse göster */}
            {(currentLevel > 0 || currentQuestion > 0) ? (
              <button
                onClick={handlePrevQuestion}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: isMobile ? '12px 18px' : '10px 16px',
                  minHeight: isMobile ? '44px' : 'auto',
                  borderRadius: isMobile ? '10px' : '8px',
                  fontSize: isMobile ? '14px' : '13px',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <ChevronLeft style={{ width: isMobile ? '18px' : '16px', height: isMobile ? '18px' : '16px' }} />
                {isMobile ? '' : 'Önceki'}
              </button>
            ) : (
              <div />
            )}

            {/* Raporu Göster - en az 1 cevap varsa göster */}
            {Object.keys(responses).length > 0 && (
              <button
                onClick={() => setCurrentView('results')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: isMobile ? '12px 18px' : '10px 16px',
                  minHeight: isMobile ? '44px' : 'auto',
                  borderRadius: isMobile ? '10px' : '8px',
                  fontSize: isMobile ? '14px' : '13px',
                  fontWeight: 600,
                  border: 'none',
                  backgroundColor: currentColor,
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: `0 2px 8px ${currentColor}30`
                }}
              >
                <BarChart3 style={{ width: isMobile ? '18px' : '16px', height: isMobile ? '18px' : '16px' }} />
                {isMobile ? 'Rapor' : 'Raporu Göster'}
              </button>
            )}
          </div>
        </footer>

        <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
        <NewsModal isOpen={showNews} onClose={() => setShowNews(false)} />
      </div>
    );
  }

  // ==================== RESULTS PAGE ====================
  if (currentView === 'results') {
    const overallLevel = calculateOverallLevel();
    const levelScores = competencyLevels.map((level, idx) => ({
      level: idx,
      levelId: level.id,
      title: level.title,
      icon: level.icon,
      color: level.color,
      score: getLevelScore(idx),
      maxScore: getLevelMaxScore(idx),
      percentage: getLevelPercentage(idx)
    }));

    const totalScore = levelScores.reduce((sum, l) => sum + l.score, 0);
    const totalMaxScore = levelScores.reduce((sum, l) => sum + l.maxScore, 0);
    const overallPercentage = (totalScore / totalMaxScore) * 100;

    const weakAreas = levelScores.filter(l => l.percentage < 50);
    const currentLevelData = overallLevel >= 0 ? competencyLevels[overallLevel] : competencyLevels[0];
    const nextLevelRec = recommendations[Math.min(overallLevel >= 0 ? competencyLevels[overallLevel].id + 1 : 1, 5)];

    const handleDownloadPDF = () => {
      window.print();
    };

    // Seviye bazlı renkler
    const levelColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e'];
    const currentColor = levelColors[Math.max(0, overallLevel)];

    // Motivasyon mesajları
    const getMotivationMessage = () => {
      if (overallPercentage >= 80) return { emoji: '🎉', text: 'Mükemmel! Yapay zeka konusunda ileri seviyedesiniz.' };
      if (overallPercentage >= 60) return { emoji: '💪', text: 'Harika ilerleme! Biraz daha pratikle uzmanlaşabilirsiniz.' };
      if (overallPercentage >= 40) return { emoji: '🚀', text: 'İyi bir başlangıç! Potansiyeliniz yüksek.' };
      return { emoji: '🌱', text: 'Yolculuğunuz başlıyor! Adım adım ilerleyeceksiniz.' };
    };
    const motivation = getMotivationMessage();

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Print Styles */}
        <style>{`
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}</style>

        {/* Header - Açık tema */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '12px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => setCurrentView('home')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }}
              >
                <ChevronLeft style={{ width: '20px', height: '20px' }} />
                Ana Sayfa
              </button>

              <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Değerlendirme Sonucu
              </h1>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowGlossary(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b',
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <Library style={{ width: '18px', height: '18px' }} />
                </button>
                <button
                  onClick={() => setShowNews(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b',
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <TrendingUp style={{ width: '18px', height: '18px' }} />
                </button>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    borderRadius: '8px'
                  }}
                >
                  <Download style={{ width: '16px', height: '16px' }} />
                  PDF
                </button>
              </div>
            </div>
          </div>
        </header>

        <main style={{ padding: '24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Motivasyon Mesajı */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <span style={{ fontSize: '32px' }}>{motivation.emoji}</span>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                  Tebrikler, değerlendirmeyi tamamladınız!
                </p>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{motivation.text}</p>
              </div>
            </div>

            {/* Sonuç Kartı */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              {/* Üst Banner */}
              <div style={{
                background: `linear-gradient(135deg, ${currentColor}, ${currentColor}cc)`,
                padding: '32px 24px',
                textAlign: 'center'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>
                  Yapay Zeka Gelişim Seviyeniz
                </p>
                <h2 style={{ fontSize: '48px', fontWeight: 800, color: 'white', margin: '0 0 4px 0' }}>
                  {overallLevel >= 0 ? currentLevelData.id : 1}. Seviye
                </h2>
                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                  {currentLevelData.title}
                </p>
              </div>

              {/* İstatistikler */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderTop: '1px solid #e2e8f0'
              }}>
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  borderRight: '1px solid #e2e8f0'
                }}>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: currentColor, margin: 0 }}>{totalScore}</p>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Toplam Puan</p>
                </div>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: currentColor, margin: 0 }}>%{Math.round(overallPercentage)}</p>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Başarı Oranı</p>
                </div>
              </div>
            </div>

            {/* İki Sütunlu Alan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

              {/* Seviye Bazlı Performans */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <BarChart3 style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
                  Seviye Bazlı Performans
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {levelScores.map(({ level, levelId, icon: LIcon, score, maxScore, percentage }) => (
                    <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: levelColors[level],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <LIcon style={{ width: '14px', height: '14px', color: 'white' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{levelId}. Seviye</span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: percentage >= 70 ? '#10b981' : '#94a3b8'
                          }}>
                            {score}/{maxScore}
                          </span>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '50px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            borderRadius: '50px',
                            backgroundColor: percentage >= 70 ? '#10b981' : levelColors[level],
                            width: `${percentage}%`,
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gelişim Önerileri */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TrendingUp style={{ width: '18px', height: '18px', color: '#10b981' }} />
                  Gelişim Önerileri
                </h3>

                {/* Sonraki Hedef */}
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#1d4ed8', marginBottom: '4px' }}>
                    Sonraki Hedef
                  </p>
                  <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: 1.4 }}>
                    {nextLevelRec.next}
                  </p>
                </div>

                {/* Geliştirilmesi Gereken Alanlar */}
                {weakAreas.length > 0 && (
                  <div style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <AlertTriangle style={{ width: '16px', height: '16px', color: '#d97706', flexShrink: 0, marginTop: '1px' }} />
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>
                          Geliştirilmesi Gereken Alanlar
                        </p>
                        <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                          {weakAreas.map(a => `${a.levelId}. Seviye`).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Önerilen Araçlar */}
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>
                    Önerilen Araçlar
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {nextLevelRec.tools.map((tool, idx) => (
                      <span key={idx} style={{
                        padding: '6px 12px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleDownloadPDF}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <Download style={{ width: '18px', height: '18px' }} />
                PDF Olarak İndir
              </button>
              <button
                onClick={() => {
                  setCurrentView('home');
                  setResponses({});
                  setCurrentLevel(0);
                  setCurrentQuestion(0);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  background: `linear-gradient(135deg, ${currentColor}, ${currentColor}dd)`,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: `0 4px 12px ${currentColor}40`
                }}
              >
                <ArrowRight style={{ width: '18px', height: '18px' }} />
                Yeniden Değerlendir
              </button>
            </div>

            {/* Print Footer */}
            <div style={{ display: 'none' }} className="print:block">
              <p style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                Yapay Zeka Gelişim Modeli - {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </main>

        <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
        <NewsModal isOpen={showNews} onClose={() => setShowNews(false)} />
      </div>
    );
  }

  return null;
}
