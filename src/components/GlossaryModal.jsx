import React, { useState } from 'react';
import {
  X, BookOpen, Search, ChevronDown, ChevronUp,
  Zap, Target, Users, FileText, Layers, Settings,
  Brain, Sparkles, Cpu, Bot, Rocket, MessageSquare,
  Lightbulb, CheckCircle2
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

// Seviye detayları (PDF'den)
const levelDetails = [
  {
    level: 1,
    title: "Prompt Mühendisliği ve YZ Kullanım Alanları",
    icon: Zap,
    color: "from-blue-500 to-blue-700",
    definition: "Çalışan, yapay zekayı doğru şekilde yönlendirerek işine uygun, anlamlı ve değerlendirilebilir çıktılar üretebilir.",
    behaviors: [
      "Yapay zekaya verdiği istemler net, yapılandırılmış ve amaca yöneliktir",
      "Aynı işi farklı istemlerle test eder ve çıktıyı iyileştirir",
      "Farklı hedef kitleler için yanıt biçimini ayarlayabilir",
      "Hangi yapay zeka aracının hangi iş için uygun olduğunu ayırt eder"
    ],
    businessValue: ["Daha hızlı içerik üretimi", "Daha kaliteli doküman, sunum, analiz çıktıları", "Daha az revizyon ihtiyacı"],
    targetAudience: "Tüm çalışanlar için temel seviye",
    tools: ["ChatGPT", "Gemini", "Perplexity", "Claude"]
  },
  {
    level: 2,
    title: "Özel GPT (Sohbet Botları)",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    definition: "Çalışan, belirli bir iş ihtiyacını karşılayan, tutarlı ve tekrar kullanılabilir yapay zeka asistanları tasarlayabilir.",
    behaviors: [
      "Tek seferlik istemler yerine kalıcı bir asistan kurgular",
      "Aynı soruya benzer kalite ve yapıdaki yanıtları alır",
      "Asistanı belirli bir rol, süreç veya uzmanlık alanına göre sınırlar",
      "Çıktı kalitesini sürdürülebilir şekilde korur"
    ],
    businessValue: ["Standartlaşmış iş çıktıları", "Bilgiye erişimde hızlanma", "Yeni çalışanların daha hızlı adapte olması"],
    targetAudience: "Tüm çalışanlar, İçerik, analiz, İK, pazarlama, operasyon ekipleri",
    tools: ["ChatGPT GPTs", "Gemini Gems", "Claude Projects"]
  },
  {
    level: 3,
    title: "Yapay Zeka Destekli Uygulama Prototipleme",
    icon: Target,
    color: "from-emerald-500 to-teal-600",
    definition: "Çalışan, bir iş problemini basit bir uygulama veya prototip haline getirerek test edebilir.",
    behaviors: [
      "İş sürecini yüksek seviyede adımlara ayırır",
      "Yapay zekanın katkı sağlayacağı noktaları belirler",
      "Kod yazmadan çalışan bir prototip oluşturur",
      "Prototipi geri bildirimle geliştirir"
    ],
    businessValue: ["Fikirlerin hızlı test edilmesi", "Gereksiz yazılım yatırımlarının önlenmesi", "İş birimleri içinde çözüm üretme kapasitesinin artması"],
    targetAudience: "İş geliştirme, Operasyon, Ürün, süreç, inovasyon ekipleri",
    tools: ["Google AI Studio", "Bolt.new", "Replit", "v0.dev"],
    frameworks: ["SIPOC", "Cynefin Modeli", "4U Framework"]
  },
  {
    level: 4,
    title: "İş Akışı Otomasyonu",
    icon: Cpu,
    color: "from-cyan-500 to-blue-600",
    definition: "Çalışan, tekrarlayan işleri otomatikleştirerek manuel yükü azaltır.",
    behaviors: [
      "Tekrar eden işleri fark eder",
      "Araçları birbirine bağlayarak otomatik akış kurar",
      "Tetikleyici – işlem – çıktı mantığını kurgular",
      "Sürecin sorunsuz çalıştığını takip eder"
    ],
    businessValue: ["Zaman tasarrufu", "Hata oranının azalması", "Operasyonel verimlilik artışı"],
    targetAudience: "Operasyon, Finans, Raporlama, IT'ye yakın iş birimleri",
    tools: ["n8n", "Make", "Zapier", "UiPath", "Paperwork"]
  },
  {
    level: 5,
    title: "Yapay Zeka Destekli İş Otomasyonu",
    icon: Bot,
    color: "from-purple-500 to-indigo-600",
    definition: "Çalışan, otomasyon içinde yapay zekayı karar destek noktalarında bilinçli şekilde kullanır.",
    behaviors: [
      "Yapay zekayı yalnızca gerekli adımlarda devreye alır",
      "Yorumlama, sınıflandırma, yönlendirme işlerini AI'a bırakır",
      "Kurallarla AI arasındaki sınırı doğru çizer",
      "Sürecin kalitesini ve doğruluğunu izler"
    ],
    businessValue: ["Daha esnek ve akıllı süreçler", "Değişen durumlara uyum", "Daha az manuel müdahale"],
    targetAudience: "Süreç sahipleri, Dijital dönüşüm ekipleri, IT Ekipleri",
    tools: ["n8n + AI", "Make + OpenAI", "UiPath + AI Center", "Gemini API", "OpenAI API"]
  },
  {
    level: 6,
    title: "Yapay Zeka Ajanı",
    icon: Rocket,
    color: "from-rose-500 to-pink-600",
    definition: "Çalışan, hedef bazlı çalışan otonom yapay zeka sistemleri tasarlayabilir.",
    behaviors: [
      "Yapay zekaya hedef tanımlar, adımı değil",
      "Ajanın hangi araçları kullanacağını belirler",
      "Hatalı durumları ve istisnaları öngörür",
      "Süreci minimum insan müdahalesiyle yönetir"
    ],
    businessValue: ["Yüksek ölçeklenebilirlik", "Karmaşık süreçlerde hız ve esneklik", "Stratejik işlere daha fazla zaman"],
    targetAudience: "İleri seviye dijital roller, IT, inovasyon, ileri analitik ekipleri",
    tools: ["Claude Code + MCP", "Azure AI Agents", "Gemini Agents", "Amazon Bedrock", "LangChain"]
  }
];

// Alternatif Prompt Framework'leri
const alternativeFrameworks = [
  {
    name: "RAIN",
    components: ["Role (Rol)", "Aim (Amaç)", "Input (Girdi)", "Numeric Target (Sayısal Hedef)"],
    purpose: "Yapay Zeka'ya kim olduğunu, neyi başarması gerektiğini ve başarının nasıl ölçüleceğini netleştirir.",
    example: "Bir UX Lideri gibi davran. Amaç: Sepet terk oranını %25 azaltmak. İşte analitik veriler. Mobil wireframe'ler ve dönüşüm metrikleri tablosu üret."
  },
  {
    name: "CLAR",
    components: ["Context (Bağlam)", "Limits (Sınırlar)", "Action (Eylem)", "Result (Sonuç)"],
    purpose: "Belirsiz işleri odaklı ve yönetilebilir hale getirir.",
    example: "Bu depo gecikme kayıtlarını incele. En önemli iki kök nedene odaklan, etkilerini sayısallaştır, üç çözüm öner ve tek sayfalık bir özet hazırla."
  },
  {
    name: "FLOW",
    components: ["Function (Görev)", "Level (Seviye)", "Output (Çıktı)", "Win Metric (Başarı Ölçütü)"],
    purpose: "İçerik üretiminde hedef kitleye uygunluk ve kalite standardı sağlar.",
    example: "Yeni mezunlar için 900 kelimelik bir kariyer tavsiye yazısı yaz. 4 iş arama ipucu ekle."
  },
  {
    name: "PIVO",
    components: ["Problem (Sorun)", "Insights (İçgörüler)", "Voice (Ton)", "Outcome (Hedeflenen Sonuç)"],
    purpose: "Strateji ve karar alma konularında neden–sonuç netliği sağlar.",
    example: "Mobil uygulama kullanım oranı düşüyor. İşte kullanıcıların yaşadığı 3 sürtünme noktası. İkna edici bir ton kullan."
  },
  {
    name: "SEED",
    components: ["Situation (Mevcut Durum)", "End Goal (Hedef)", "Examples (Örnekler)", "Deliverables (Teslimatlar)"],
    purpose: "Eğitim, program ve proje tasarımlarında uçtan uca netlik sağlar.",
    example: "Dinleme, geri bildirim ve çatışma yönetimini kapsayan 6 haftalık bir iletişim programı tasarlıyorum."
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

  if (!isOpen) return null;

  const tabs = [
    { id: 'levels', label: 'Seviyeler', icon: Layers },
    { id: 'parts', label: 'PARTS', icon: MessageSquare },
    { id: 'salt', label: 'SALT', icon: Settings },
    { id: 'frameworks', label: 'Diğer Frameworkler', icon: Lightbulb },
    { id: 'thinking', label: 'Düşünce Yaklaşımları', icon: Brain }
  ];

  const filteredLevels = levelDetails.filter(level =>
    searchTerm === '' ||
    level.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-white/20 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Yapay Zeka Yetkinlik Sözlüğü</h2>
              <p className="text-sm text-slate-400">Framework'ler, seviyeler ve araçlar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-3 border-b border-white/10 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Seviyeler */}
          {activeTab === 'levels' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm mb-4">
                Yapay Zeka Yetkinlik Piramidi 6 seviyeden oluşur. Her seviye farklı beceriler ve araçlar gerektirir.
              </p>
              {filteredLevels.map((level) => {
                const Icon = level.icon;
                const isExpanded = expandedLevel === level.level;

                return (
                  <div key={level.level} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setExpandedLevel(isExpanded ? null : level.level)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-white/60 text-xs">Seviye {level.level}</p>
                          <h3 className="text-white font-semibold">{level.title}</h3>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-sm text-slate-300">{level.definition}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">Davranış Göstergeleri</h4>
                          <ul className="space-y-1">
                            {level.behaviors.map((behavior, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                {behavior}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">İş Hayatındaki Karşılığı</h4>
                          <div className="flex flex-wrap gap-2">
                            {level.businessValue.map((value, idx) => (
                              <span key={idx} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">Önerilen Araçlar</h4>
                          <div className="flex flex-wrap gap-2">
                            {level.tools.map((tool, idx) => (
                              <span key={idx} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        {level.frameworks && (
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Düşünce Yaklaşımları</h4>
                            <div className="flex flex-wrap gap-2">
                              {level.frameworks.map((fw, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                  {fw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-slate-500">
                          Hedef Kitle: {level.targetAudience}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* PARTS Framework */}
          {activeTab === 'parts' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">{partsFramework.title}</h3>
                <p className="text-slate-300 text-sm">{partsFramework.description}</p>
              </div>

              <div className="grid gap-4">
                {partsFramework.elements.map((element, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{element.letter}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{element.name}</h4>
                        <p className="text-slate-400 text-sm">{element.meaning}</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 mb-2">
                      <p className="text-sm text-slate-300">{element.importance}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Örnek:</span>
                      <span className="text-xs text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded">{element.example}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <h4 className="text-amber-300 font-medium mb-2">Örnek PARTS Prompt</h4>
                <p className="text-slate-300 text-sm italic">
                  "Bir pazarlama uzmanı gibi davran (P). Sosyal medya içerik planı oluştur (A).
                  Küçük işletme sahipleri için (R). Instagram pazarlaması konusunda (T).
                  Haftalık tablo formatında (S)."
                </p>
              </div>
            </div>
          )}

          {/* SALT Framework */}
          {activeTab === 'salt' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">{saltFramework.title}</h3>
                <p className="text-slate-300 text-sm">{saltFramework.description}</p>
              </div>

              <div className="grid gap-4">
                {saltFramework.elements.map((element, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{element.letter}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{element.name}</h4>
                        <p className="text-slate-400 text-sm">{element.meaning}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {element.subElements.map((sub, subIdx) => (
                        <span key={subIdx} className="px-2 py-1 bg-white/10 text-slate-300 rounded text-xs">
                          {sub}
                        </span>
                      ))}
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-sm text-slate-300">{element.importance}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <h4 className="text-amber-300 font-medium mb-2">PARTS + SALT Birlikte</h4>
                <p className="text-slate-300 text-sm">
                  <strong className="text-blue-300">PARTS</strong> doğru soruyu sormayı sağlar;
                  <strong className="text-emerald-300"> SALT</strong> gelen yanıtı istenen yöne şekillendirmeyi mümkün kılar.
                </p>
              </div>
            </div>
          )}

          {/* Diğer Frameworkler */}
          {activeTab === 'frameworks' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm mb-4">
                PARTS ve SALT dışında kullanabileceğiniz alternatif prompt framework'leri:
              </p>
              {alternativeFrameworks.map((fw, idx) => {
                const isExpanded = expandedFramework === fw.name;

                return (
                  <div key={idx} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setExpandedFramework(isExpanded ? null : fw.name)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{fw.name.charAt(0)}</span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-white font-semibold">{fw.name}</h3>
                          <p className="text-slate-400 text-xs">{fw.components.join(' + ')}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3">
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-sm text-slate-300">{fw.purpose}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {fw.components.map((comp, compIdx) => (
                            <span key={compIdx} className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                              {comp}
                            </span>
                          ))}
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Örnek:</p>
                          <p className="text-sm text-slate-300 italic">"{fw.example}"</p>
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
            <div className="space-y-6">
              <p className="text-slate-400 text-sm mb-4">
                3. seviye ve üzerinde kullanılan düşünce yaklaşımları ve süreç haritalama yöntemleri:
              </p>

              {thinkingFrameworks.map((fw, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">{fw.name}</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{fw.description}</p>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Kullanım Amacı:</p>
                    <p className="text-sm text-emerald-300">{fw.usage}</p>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30">
                <h4 className="text-white font-medium mb-2">Ortak Yetkinlik Hedefi (3-6. Seviyeler)</h4>
                <p className="text-slate-300 text-sm">
                  "Cynefin modeli ile yapay zeka ile çalışılabilecek problem alanlarını ayırt eder;
                  4U çerçevesiyle bu problemlerin iş açısından önemini değerlendirir.
                  SIPOC yaklaşımıyla süreci haritalayarak, yapay zekanın hangi adımlarda anlamlı değer yaratabileceğini belirler."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-xs text-slate-500">
            Kaynak: Yapay Zeka Yetkinlik Piramidi Sözlüğü - Mustafa Aydın, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
