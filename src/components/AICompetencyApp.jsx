import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart3, ArrowRight,
  ChevronLeft, ChevronRight, CheckCircle2,
  Brain, Zap, Target, Layers, Cpu, Bot, Sparkles, Rocket,
  TrendingUp, Trophy, Info, Download, AlertTriangle,
  Library, ArrowDown, Users, Lightbulb, MessageCircle,
  Clock, Shield, AlertCircle, Compass, Lock, Building2, Menu
} from 'lucide-react';
import GlossaryModal from './GlossaryModal';
import MentorChat from './MentorChat';

// Seviye verileri - YZ_Sorular belgesinden
const competencyLevels = [
  {
    id: 0,
    title: "Temel Farkındalık",
    subtitle: "Yapay zeka ile tanışma aşaması",
    icon: Brain,
    color: "from-slate-500 to-slate-700",
    bgColor: "bg-slate-500",
    description: "Yapay zeka araçlarının varlığından haberdar olma ve temel kavramları anlama aşaması.",
    questions: [
      {
        text: "Yapay zeka ve araçlarını tanıyorum",
        options: [
          "Yapay zeka araçlarının ne olduğunu bilmiyorum, isimlerini duymadım",
          "ChatGPT, Gemini, Claude gibi araç isimlerini duydum ancak ne işe yaradıklarını bilmiyorum",
          "Bu araçların metin yazma, soru yanıtlama gibi genel işlevleri olduğunu biliyorum",
          "En az iki yapay zeka aracının adını ve hangi tür işlerde kullanıldığını açıklayabiliyorum"
        ],
        evidence: "'ChatGPT metin üretmek için, Gemini araştırma için kullanılıyor' gibi açıklama yapabilme"
      },
      {
        text: "Yapay zekanın işime nerede değer katabileceğini kavrıyorum",
        options: [
          "Yapay zekanın benim işimle ilgili olduğunu düşünmüyorum",
          "Yapay zekanın bazı işlerde kullanılabileceğini biliyorum ama kendi işimle ilişkilendirmedim",
          "Kendi işimde yapay zekanın hangi tür görevlerde kullanılabileceğini ayırt edebiliyorum (2-3 örnek)",
          "Kendi işimde yapay zekanın uygun olduğu ve olmadığı alanları örneklerle açıklayabiliyorum (5+ senaryo)"
        ],
        evidence: "'E-posta taslağı yazabilir ama müşteriyle birebir kararları veremez' gibi açıklama"
      },
      {
        text: "Temel yapay zeka kavramlarını biliyorum",
        options: [
          "Prompt, model, yapay zeka gibi terimleri hiç duymadım",
          "Bu terimleri duydum ama ne anlama geldiklerini bilmiyorum",
          "Prompt'un 'yapay zekaya verilen talimat' olduğunu biliyorum",
          "Prompt, model, halüsinasyon, veri güvenliği gibi en az 3-4 temel kavramı doğru şekilde açıklayabiliyorum"
        ],
        evidence: "'Halüsinasyon, yapay zekanın uydurma bilgi üretmesidir' şeklinde tanım yapabilme"
      },
      {
        text: "Yapay zekanın sınırlarını ve risklerini farkındayım",
        options: [
          "Yapay zekanın verdiği sonuçların her zaman doğru olduğunu düşünüyorum",
          "Yapay zekanın hata yapabileceğini duydum ama nedenlerini bilmiyorum",
          "Halüsinasyon ve veri güvenliği gibi temel riskleri biliyorum",
          "Yapay zeka çıktılarının kontrol edilmesi gerektiğini, etik ve gizlilik risklerini açıklayabiliyorum"
        ],
        evidence: "'YZ çıktıları kontrol edilmeli çünkü yanlış veya eksik olabilir' açıklaması"
      },
      {
        text: "Yapay zeka öğrenmek için somut adım attım",
        options: [
          "Herhangi bir araştırma veya deneme yapmadım",
          "Makale okudum, video izledim gibi pasif öğrenme yaptım",
          "Bir yapay zeka aracına üye oldum ve ilk denememi yaptım",
          "Farklı yapay zeka araçlarını denedim ve öğrenme kaynaklarını takip etmeye devam ediyorum"
        ],
        evidence: "İlk prompt denemesi, ekran görüntüsü veya örnek soru-cevap"
      }
    ]
  },
  {
    id: 1,
    title: "Prompt Mühendisliği",
    subtitle: "Temel YZ Kullanımı",
    icon: Zap,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-500",
    description: "Yapay zekaya doğru talimatlar vererek etkili sonuçlar alma becerisi.",
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
    title: "YZ Araçları Kullanımı",
    subtitle: "Özelleşmiş Araçlar",
    icon: Layers,
    color: "from-violet-500 to-violet-700",
    bgColor: "bg-violet-500",
    description: "Metin dışında görsel, ses, video gibi farklı yapay zeka araçlarını kullanabilme.",
    questions: [
      {
        text: "Metin dışında farklı modalitelerde (görsel, video, ses) yapay zeka kullanıyorum",
        options: [
          "Sadece metin tabanlı araçlar kullanıyorum",
          "Görsel veya ses araçlarını denedim ama düzenli kullanmıyorum",
          "En az 2 farklı modalitede (görsel+ses veya video+görsel) araç kullanıyorum",
          "4+ farklı modalitede (metin, görsel, video, ses, kod) aktif ve düzenli kullanıyorum"
        ],
        evidence: "Midjourney görseli + ElevenLabs ses kaydı + ChatGPT metni birleşik proje"
      },
      {
        text: "İhtiyaca göre doğru aracı seçebiliyorum",
        options: [
          "Tüm işler için aynı aracı kullanıyorum",
          "Bazen farklı araçlar deniyorum ama hangisinin ne için iyi olduğunu bilmiyorum",
          "Her modalite için en az 1 aracı biliyorum ve kullanıyorum",
          "Her iş için en uygun aracı seçiyorum (fotorealistik görsel→Midjourney, hızlı kod→Claude vb.) ve tercihimi gerekçelendirebiliyorum"
        ],
        evidence: "Görev-araç eşleştirme tablosu (Rapor→ChatGPT, Görsel→Midjourney, Video→Runway)"
      },
      {
        text: "Görsel oluşturma araçlarında istediğim çıktıyı alabiliyorum",
        options: [
          "Hiç görsel üretme aracı kullanmadım",
          "Basit promptlar veriyorum ama istediğim sonucu alamıyorum",
          "Stil, kompozisyon, renk belirterek iyi sonuçlar alıyorum",
          "İleri prompt teknikleriyle (negatif prompt, aspect ratio, stil referansı) profesyonel sonuçlar üretiyorum"
        ],
        evidence: "'Minimalist, pastel renkler, üstten bakış açısı, kurumsal sunum için' gibi detaylı görsel prompt"
      },
      {
        text: "Doküman ve veri analizi için yapay zeka kullanıyorum",
        options: [
          "Sadece metin yazıyorum, dosya analizi yapmıyorum",
          "PDF veya Excel yükleyerek basit sorular soruyorum",
          "Karmaşık dokümanları (sözleşme, rapor) analiz ettiriyorum",
          "Çok sayfalı dokümanları, veri setlerini sistematik analiz edip sentez yapıyorum"
        ],
        evidence: "50 sayfalık raporu özetleme + ana bulguları çıkarma görevi"
      },
      {
        text: "Farklı araçları kombine ederek iş akışı oluşturuyorum",
        options: [
          "Her aracı ayrı ve bağımsız kullanıyorum",
          "Bazen bir araçtan diğerine manuel veri aktarıyorum",
          "Düzenli olarak araçları zincir halinde kullanıyorum (ChatGPT→Midjourney→Canva)",
          "Entegre iş akışları kuruyorum ve süreç dokümante ediyorum"
        ],
        evidence: "'Blog yazısı (ChatGPT) → Kapak görseli (Midjourney) → Sesli versiyon (ElevenLabs)' iş akışı"
      }
    ]
  },
  {
    id: 3,
    title: "Özel GPT / Gem Tasarımı",
    subtitle: "Özelleştirilmiş Asistanlar",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500",
    description: "Tekrar eden işler için özel yapay zeka asistanları oluşturabilme.",
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
    id: 4,
    title: "Uygulama Prototipleme",
    subtitle: "No-Code YZ Uygulamaları",
    icon: Target,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500",
    description: "Kod yazmadan yapay zeka destekli uygulamalar ve prototipler geliştirebilme.",
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
          "Hangi işlerin YZ'ye uygun olduğunu bilmiyorum",
          "'Belki burada kullanılabilir' diye düşünüyorum ama net değil",
          "Süreç içinde YZ kullanılabilecek 2-3 nokta belirleyebiliyorum",
          "Sistematik analiz yapıyorum (tekrar eden iş, karar noktası, veri analizi vb.) ve önceliklendiriyorum"
        ],
        evidence: "Süreç haritasında 'YZ kullanım noktaları' işaretli dokümantasyon"
      },
      {
        text: "No-code platformlarda prototip geliştiriyorum",
        options: [
          "Hiç prototip geliştirmedim",
          "Bir platform denedim ama tamamlamadım",
          "En az 1 çalışan prototip oluşturdum",
          "3+ prototip geliştirdim ve iş değeri test ettim"
        ],
        evidence: "Google AI Studio, Bolt.new veya Replit'te çalışan uygulama linki"
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
    id: 5,
    title: "İş Akışı Otomasyonu",
    subtitle: "Yapay Zekasız Otomasyon",
    icon: Cpu,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500",
    description: "Tekrarlayan işleri otomatikleştirerek manuel yükü azaltma.",
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
        text: "Tetikleyici-İşlem-Çıktı mantığıyla düşünüyorum",
        options: [
          "Bu mantığı bilmiyorum",
          "Duydum ama uygulamıyorum",
          "Basit 'eğer X olursa Y yap' kuralları kuruyorum",
          "Çoklu tetikleyici, dallanma ve hata yönetimi ile karmaşık mantık kuruyorum"
        ],
        evidence: "'Yeni Gmail gelirse (tetik) → Önceliğe göre filtrele (işlem) → Slack'e bildir (çıktı)' akış diyagramı"
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
        text: "Hata durumları için alternatif akışlar kurdum",
        options: [
          "Hata yönetimi yapmadım",
          "Başarısız olunca manuel müdahale ediyorum",
          "Basit hata bildirimi kurdum",
          "Try-catch, timeout, fallback mekanizması ve hata bildirimi sistemi kurdum"
        ],
        evidence: "'API yanıt vermezse e-posta gönder + 5 dk sonra tekrar dene' akışı"
      },
      {
        text: "Otomasyonlarla ölçülebilir zaman kazancı sağlıyorum",
        options: [
          "Kazancı ölçmedim",
          "Genel olarak zaman kazandırdığını düşünüyorum",
          "Haftalık 3-5 saat tasarruf sağlıyorum",
          "Haftalık 10+ saat tasarruf sağlıyorum ve dokümante ettim"
        ],
        evidence: "'Rapor hazırlama 5 saat/hafta → 30 dk/hafta' karşılaştırması"
      }
    ]
  },
  {
    id: 6,
    title: "YZ Destekli Otomasyon",
    subtitle: "AI + Otomasyon",
    icon: Bot,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-500",
    description: "Otomasyon içinde yapay zekayı karar destek noktalarında kullanma.",
    questions: [
      {
        text: "Otomasyon içinde yapay zekayı stratejik noktalarda kullanıyorum",
        options: [
          "Hiç yapay zeka entegrasyonu yapmadım",
          "Denedim ama tam çalıştıramadım",
          "1-2 otomasyonda yapay zeka kullanıyorum",
          "5+ otomasyonda stratejik karar noktalarında yapay zeka kullanıyorum ve kurallı mantıkla hibrit yaklaşım kurdum"
        ],
        evidence: "E-posta sınıflandırma (AI) → Kategoriye göre routing (kural) akışı"
      },
      {
        text: "Yapay zekaya spesifik görevler tanımlıyorum",
        options: [
          "Yapay zekaya genel 'analiz et' gibi talimatlar veriyorum",
          "Basit görevler tanımlıyorum ama çıktı kontrolsüz",
          "Net görev (sınıflandır, özetle, çıkar) tanımlıyorum ve format belirtiyorum",
          "Detaylı görev tanımı + çıktı formatı + kalite kriterleri + hata durumu yönetimi tanımlıyorum"
        ],
        evidence: "'Bu e-postayı 3 kategoriden birine sınıflandır: Şikayet/Soru/Öneri. Çıktı: JSON {category, confidence, reason}'"
      },
      {
        text: "Kural ve yapay zeka arasındaki sınırı doğru çiziyorum",
        options: [
          "Her işi yapay zekaya yaptırmaya çalışıyorum",
          "Bazen kural bazen yapay zeka kullanıyorum ama net kriter yok",
          "Deterministik işlerde kural, belirsiz işlerde yapay zeka kullanıyorum",
          "Sistematik karar matrisi kurdum (kural: hız+maliyet+kesinlik, AI: yorumlama+context+esneklik) ve hibrit optimize ediyorum"
        ],
        evidence: "'Tarih/sayı çıkarma→Kural, duygu analizi→AI' karar tablosu"
      },
      {
        text: "Yapay zeka çıktısını akış içinde kullanıyorum",
        options: [
          "Yapay zeka çıktısını manuel kopyalıyorum",
          "Çıktıyı alıyorum ama sonraki adımda kullanamıyorum",
          "Yapay zeka çıktısını sonraki adıma input olarak gönderiyorum",
          "Yapay zeka çıktısına göre dallanma, filtreleme ve dinamik akış kontrolü yapıyorum"
        ],
        evidence: "AI sınıflandırma sonucu 'Acil' ise Slack'e bildir, değilse ticket oluştur"
      },
      {
        text: "Yapay zeka kalitesini izliyor ve doğruluyorum",
        options: [
          "Yapay zeka sonuçlarını hiç kontrol etmiyorum",
          "Bazen rastgele kontrol ediyorum",
          "Düzenli örnekleme yapıyorum (%10 kontrol)",
          "Otomatik kalite metrikleri (confidence score, validation rules) ve periyodik audit sistemi kurdum"
        ],
        evidence: "'Confidence<0.7 ise insan onayına gönder' kuralı + haftalık kalite raporu"
      }
    ]
  },
  {
    id: 7,
    title: "Yapay Zeka Ajanları",
    subtitle: "Otonom AI Sistemler",
    icon: Rocket,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-500",
    description: "Hedef bazlı çalışan otonom yapay zeka sistemleri tasarlayabilme.",
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
  0: {
    next: "ChatGPT veya Gemini'ye üye olun ve günde 15 dakika basit sorular sorun.",
    tools: ["ChatGPT", "Gemini", "Perplexity"],
    resources: ["YouTube'da 'Yapay Zeka Nedir?' videoları", "Prompt, model, API terimlerini öğrenin"]
  },
  1: {
    next: "PARTS ve SALT formüllerini öğrenin ve günlük uygulayın.",
    tools: ["ChatGPT Plus", "Claude", "Gemini Advanced"],
    resources: ["Prompt mühendisliği kursları", "Farklı modelleri karşılaştırın"]
  },
  2: {
    next: "Tekrar eden işleriniz için özel GPT veya Gem oluşturun.",
    tools: ["ChatGPT GPTs", "Gemini Gems", "Midjourney", "ElevenLabs"],
    resources: ["Her modalite için en az 1 araç öğrenin", "İş akışı zincirleri kurun"]
  },
  3: {
    next: "İş süreçlerinizi haritalayın ve no-code prototip geliştirin.",
    tools: ["Google AI Studio", "Bolt.new", "Replit", "v0.dev"],
    resources: ["SIPOC ve Cynefin modeli öğrenin", "İlk prototipi 1 günde bitirin"]
  },
  4: {
    next: "Otomasyon araçlarını öğrenin ve manuel işleri otomatikleştirin.",
    tools: ["Zapier", "Make", "n8n"],
    resources: ["Gmail → Sheets basit otomasyon kurun", "If-then mantığını öğrenin"]
  },
  5: {
    next: "Yapay zeka API'lerini otomasyon akışlarına entegre edin.",
    tools: ["n8n + OpenAI", "Make + Gemini API", "UiPath"],
    resources: ["API anahtarı alın ve test edin", "Hibrit akışlar kurun"]
  },
  6: {
    next: "Ajan tabanlı sistemleri öğrenin ve otonom çözümler geliştirin.",
    tools: ["Claude Code", "LangChain", "AutoGPT", "Azure AI Agents"],
    resources: ["Ajan güvenliği ve izleme öğrenin", "Production deployment yapın"]
  },
  7: {
    next: "Tebrikler! Bilginizi paylaşın ve mentorluk yapın.",
    tools: ["Tüm araçlar"],
    resources: ["Ekibinize eğitim verin", "YZ yönetişim politikaları oluşturun"]
  }
};

export default function AICompetencyApp() {
  const [currentView, setCurrentView] = useState('home'); // home, assessment, results
  const [currentLevel, setCurrentLevel] = useState(0);
  const [responses, setResponses] = useState({});
  const [showGlossary, setShowGlossary] = useState(false);
  const [selectedLevelPopover, setSelectedLevelPopover] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showMentorChat, setShowMentorChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
      } else if (level < 7) {
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
    for (let i = 7; i >= 0; i--) {
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
    } else if (currentLevel < 7) {
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
                    <h1 style={{ color: '#0f172a', fontWeight: 700, fontSize: '18px', margin: 0 }}>YZ Yetkinlik Değerlendirme</h1>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Kişisel Değerlendirme</p>
                  </div>
                )}
              </div>

              {/* Nav */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
                <button
                  onClick={() => setShowGlossary(true)}
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
                    minHeight: '44px'
                  }}
                >
                  <Library style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
                  {!isMobile && 'Kavramlar'}
                </button>
                <button
                  onClick={startAssessment}
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
                    minHeight: '44px'
                  }}
                >
                  {isMobile ? 'Başla' : 'Hemen Başla'}
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
              <span>Kişisel YZ Yetkinlik Analizi</span>
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
              Yapay Zeka<br />
              <span style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Yetkinliğinizi Ölçün
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
              Yapay zeka yetkinliğinizi{' '}
              <strong style={{ color: '#0f172a' }}>8 seviyeli</strong>{' '}
              çerçevemizle değerlendirin ve kişisel gelişim yolunuzu belirleyin.
            </p>

            {/* CTA */}
            <button
              onClick={startAssessment}
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
                maxWidth: isMobile ? '320px' : 'none',
                borderRadius: isMobile ? '14px' : '16px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(37,99,235,0.35)'
              }}
            >
              <span>Değerlendirmeye Başla</span>
              <ArrowRight style={{ width: isMobile ? '18px' : '20px', height: isMobile ? '18px' : '20px' }} />
            </button>
          </div>
        </section>

        {/* Levels Section */}
        <section style={{ padding: isMobile ? '48px 16px' : '80px 24px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                YETKİNLİK SEVİYELERİ
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a' }}>
                8 Seviyeli Değerlendirme
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {competencyLevels.map((level, index) => {
                const LevelIcon = level.icon;
                const colors = ['#64748b', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#6366f1'];
                const bgColor = colors[index];
                const isPopoverOpen = selectedLevelPopover === index;

                return (
                  <div
                    key={level.id}
                    style={{ position: 'relative' }}
                  >
                    {/* Level Card */}
                    <div
                      onClick={() => setSelectedLevelPopover(isPopoverOpen ? null : index)}
                      style={{
                        backgroundColor: 'white',
                        border: isPopoverOpen ? `2px solid ${bgColor}` : '2px solid #f1f5f9',
                        borderRadius: '20px',
                        padding: '24px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        boxShadow: isPopoverOpen ? `0 8px 32px ${bgColor}25` : 'none',
                        transform: isPopoverOpen ? 'translateY(-4px)' : 'translateY(0)'
                      }}
                      onMouseOver={(e) => {
                        if (!isPopoverOpen) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isPopoverOpen) {
                          e.currentTarget.style.borderColor = '#f1f5f9';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          backgroundColor: bgColor,
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: `0 4px 12px ${bgColor}40`
                        }}>
                          <LevelIcon style={{ width: '28px', height: '28px', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: bgColor,
                            backgroundColor: `${bgColor}15`,
                            padding: '4px 10px',
                            borderRadius: '50px',
                            display: 'inline-block',
                            marginBottom: '8px'
                          }}>
                            Seviye {level.id}
                          </span>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{level.title}</h3>
                          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{level.subtitle}</p>
                        </div>
                        {/* Expand indicator */}
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: isPopoverOpen ? bgColor : '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          flexShrink: 0
                        }}>
                          <ChevronRight style={{
                            width: '14px',
                            height: '14px',
                            color: isPopoverOpen ? 'white' : '#94a3b8',
                            transform: isPopoverOpen ? 'rotate(90deg)' : 'rotate(0deg)',
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
                Tanıdık Geldi mi?
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                8 Seviyeli Değerlendirme ile<br />
                <span style={{ color: '#3b82f6' }}>Bu Sorulara Cevap Bulun</span>
              </h2>
              <p style={{ fontSize: '18px', color: '#64748b' }}>
                Seviyenizi öğrenin, gelişim yolunuzu netleştirin
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
                Bu Değerlendirme Size Ne Sağlar?
              </h2>
              <p style={{ fontSize: '18px', color: '#64748b' }}>Somut çıktılar ve aksiyonlar</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {[
                { icon: Target, title: 'Mevcut Durum', desc: '8 seviyeli olgunluk modelinde şu an nerede olduğunuzu net olarak görün.', gradient: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '#a7f3d0', iconBg: 'linear-gradient(135deg, #10b981, #14b8a6)' },
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
                { icon: Target, title: 'Kişisel gelişim odaklı', desc: 'Bireysel YZ yetkinliğinizi ölçün ve size özel gelişim önerileri alın.' }
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
              AI Yolculuğunuza Başlayın
            </h2>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '40px' }}>
              Değerlendirme yaklaşık 10 dakika sürer.<br />
              Sonuçlarınızı hemen göreceksiniz.
            </p>
            <button
              onClick={startAssessment}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'white',
                color: '#0f172a',
                fontSize: '18px',
                fontWeight: 700,
                padding: '20px 40px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
            >
              <span>Değerlendirmeye Başla</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>
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

    const levelColors = ['#64748b', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#6366f1'];
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
                  transition: 'all 0.2s'
                }}
              >
                <ChevronLeft style={{ width: isMobile ? '22px' : '18px', height: isMobile ? '22px' : '18px' }} />
                {!isMobile && <span>Ana Sayfa</span>}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  backgroundColor: currentColor,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  {currentQuestionNumber} / {getTotalQuestions()}
                </span>
              </div>

              <button
                onClick={() => setShowGlossary(true)}
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
                  borderRadius: '6px'
                }}
              >
                <Library style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
                {!isMobile && <span>Kavramlar</span>}
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
              justifyContent: 'center',
              marginTop: '4px',
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              <span style={{ fontWeight: 600, color: currentColor }}>%{Math.round(progress)}</span>
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
                    <span>{isMobile ? `${idx}` : `${idx}. Seviye`}</span>
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
                <span style={{ fontSize: '11px', color: currentColor, fontWeight: 700 }}>SEVİYE {currentLevel}</span>
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
                    level: currentLevel,
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
      </div>
    );
  }

  // ==================== RESULTS PAGE ====================
  if (currentView === 'results') {
    const overallLevel = calculateOverallLevel();
    const levelScores = competencyLevels.map((level, idx) => ({
      level: idx,
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
    const nextLevelRec = recommendations[Math.min(overallLevel + 1, 7)];

    const handleDownloadPDF = () => {
      window.print();
    };

    // Seviye bazlı renkler
    const levelColors = ['#64748b', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#6366f1'];
    const currentColor = levelColors[Math.max(0, overallLevel)];

    // Motivasyon mesajları
    const getMotivationMessage = () => {
      if (overallPercentage >= 80) return { emoji: '🎉', text: 'Mükemmel! YZ konusunda ileri seviyedesiniz.' };
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
                  Yapay Zeka Yetkinlik Seviyeniz
                </p>
                <h2 style={{ fontSize: '48px', fontWeight: 800, color: 'white', margin: '0 0 4px 0' }}>
                  {overallLevel === -1 ? 0 : overallLevel}. Seviye
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
                  {levelScores.map(({ level, icon: LIcon, score, maxScore, percentage }) => (
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
                          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{level}. Seviye</span>
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
                          {weakAreas.map(a => `${a.level}. Seviye`).join(', ')}
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
                Yapay Zeka Yetkinlik Değerlendirmesi - {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </main>

        <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
      </div>
    );
  }

  return null;
}
