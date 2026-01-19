import React, { useState, useRef } from 'react';
import {
  BarChart3, ArrowRight,
  ChevronLeft, ChevronRight, CheckCircle2,
  Brain, Zap, Target, Layers, Cpu, Bot, Sparkles, Rocket,
  TrendingUp, Trophy, Info, Download, AlertTriangle,
  Library, ArrowDown, Users, Lightbulb,
  Clock, Shield, AlertCircle, Compass, Lock, Building2
} from 'lucide-react';
import GlossaryModal from './GlossaryModal';

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
        text: "Prompt formüllerini (PARTS, SALT) biliyorum ve uyguluyorum",
        options: [
          "Bu formülleri hiç duymadım",
          "İsimlerini duydum ama ne olduğunu bilmiyorum",
          "En az birini biliyorum ve bazen uyguluyorum",
          "PARTS veya SALT'ı düzenli olarak uyguluyorum ve farkını görüyorum"
        ],
        evidence: "PARTS (Persona, Action, Recipient, Theme, Structure) açıklaması veya örnek prompt"
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
        text: "Farklı yapay zeka modellerini karşılaştırarak en iyisini seçiyorum",
        options: [
          "Tek bir model kullanıyorum ve alternatifleri denemiyorum",
          "Farklı modellerin olduğunu biliyorum ama hepsini aynı sanıyorum",
          "Bazen farklı modelleri deniyorum",
          "İstediğim sonucu alana kadar farklı modelleri (ChatGPT, Claude, Gemini vb.) sistematik test ediyorum"
        ],
        evidence: "Aynı prompt'u 2+ farklı modelde test etme ve sonuçları karşılaştırma"
      },
      {
        text: "Hedef kitle ve ton yönetimi yapıyorum",
        options: [
          "Hedef kitle veya ton belirtmiyorum",
          "Bazen 'Basit anlat' gibi genel ifadeler kullanıyorum",
          "Hedef kitleyi her zaman belirtiyorum ('Yöneticilere', 'Öğrencilere' vb.)",
          "Hedef kitle + ton + dil seviyesini detaylı tanımlayarak profesyonel sonuçlar alıyorum"
        ],
        evidence: "'C-suite yöneticilere yönelik, resmi ve özet (max 150 kelime) sunum notu' gibi prompt"
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
        text: "Farklı iş görevlerinde yapay zeka kullanıyorum",
        options: [
          "Sadece tek bir iş için kullanıyorum veya hiç kullanmıyorum",
          "1-2 farklı görevde kullanıyorum",
          "3-5 farklı görevde düzenli kullanıyorum",
          "7+ farklı iş görevinde (e-posta, rapor, analiz, sunum, kod vb.) aktif kullanıyorum"
        ],
        evidence: "Son 1 ayda kullanılan görev listesi (e-posta taslağı, veri analizi, özet vb.)"
      },
      {
        text: "İş süreçlerimde yapay zeka ile zaman kazanıyorum",
        options: [
          "Henüz net bir fayda görmedim",
          "Bazen işimi hızlandırıyor",
          "Belirli görevlerde %20-30 zaman tasarrufu sağlıyorum",
          "Düzenli kullandığım görevlerde %40+ zaman tasarrufu sağladım (ölçülebilir)"
        ],
        evidence: "'Rapor özeti eskiden 30 dk, şimdi 10 dk' gibi somut karşılaştırma"
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
        text: "Video ve ses üretme araçlarını kullanıyorum",
        options: [
          "Hiç video/ses aracı kullanmadım",
          "Bir kez denedim ama düzenli kullanmıyorum",
          "Video veya ses araçlarından birini iş projelerimde kullandım",
          "Her ikisini de (video+ses) iş projelerimde düzenli kullanıyorum ve kalite kontrol ediyorum"
        ],
        evidence: "ElevenLabs ile üretilmiş ses dosyası veya Runway ile oluşturulmuş video"
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
        text: "Kod yazma/hata ayıklama için yapay zeka kullanıyorum",
        options: [
          "Hiç kod ile ilgili yapay zeka kullanmadım",
          "Basit kod snippet'leri yazdırıyorum",
          "Orta karmaşıklıkta kod yazıyor veya hata ayıklıyorum",
          "Tam fonksiyonel uygulamalar geliştiriyor veya karmaşık kod tabanlarında hata ayıklıyorum"
        ],
        evidence: "Claude/GitHub Copilot ile yazılmış 50+ satır çalışan kod"
      },
      {
        text: "Araştırma ve bilgi toplama için özelleşmiş araçlar kullanıyorum",
        options: [
          "Sadece genel sohbet araçlarıyla araştırma yapıyorum",
          "Perplexity veya Google AI Studio'yu denedim",
          "Düzenli olarak araştırma amaçlı özelleşmiş araçlar kullanıyorum",
          "Derin araştırma, kaynak doğrulama ve çoklu kaynak sentezi yapıyorum"
        ],
        evidence: "Perplexity ile kaynaklı araştırma raporu"
      },
      {
        text: "Farklı yapay zeka modellerinin güçlü-zayıf yönlerini biliyorum",
        options: [
          "Tüm modellerin aynı olduğunu düşünüyorum",
          "Bazı modellerin farklı olduğunu biliyorum ama farkları bilmiyorum",
          "GPT-4, Claude, Gemini arasındaki temel farkları biliyorum",
          "Her modelin optimum kullanım alanını biliyorum (kod→Claude, analiz→GPT-4, hız→Gemini Flash vb.)"
        ],
        evidence: "Model karşılaştırma tablosu (hız, maliyet, kod kalitesi, analiz derinliği)"
      },
      {
        text: "Ücretli abonelik veya API kullanımı deneyimim var",
        options: [
          "Sadece ücretsiz sürümleri kullanıyorum",
          "Ücretli abonelik aldım ama özellikleri tam kullanmıyorum",
          "Ücretli özellikleri (GPT-4, Claude Opus vb.) aktif kullanıyorum",
          "API kullanımı veya kurumsal lisans deneyimim var ve maliyet optimizasyonu yapıyorum"
        ],
        evidence: "ChatGPT Plus aboneliği veya API kullanım faturası/logu"
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
        text: "Farklı kullanım senaryoları için çoklu asistan yönetimi yapıyorum",
        options: [
          "Hiç veya sadece 1 asistan kullanıyorum",
          "2-3 asistan oluşturdum",
          "5+ farklı asistan oluşturdum ve aralarındaki farkları net tanımladım",
          "Asistan kütüphanem var, dokümante edilmiş, kategorize edilmiş ve düzenli güncelleniyor"
        ],
        evidence: "Asistan envanteri (İsim, Amaç, Son Güncelleme, Kullanım Sıklığı)"
      },
      {
        text: "Özel asistanımı ekiple paylaşıyorum veya özelleştiriyorum",
        options: [
          "Sadece kendim kullanıyorum ve kimseyle paylaşmadım",
          "Bir kez bir asistanı paylaştım",
          "Düzenli olarak ekibime asistanlar paylaşıyorum",
          "Ekip üyeleri için kişiselleştirilmiş asistanlar oluşturuyorum ve kullanım eğitimi veriyorum"
        ],
        evidence: "Ekip paylaşım linki veya özelleştirilmiş asistan versiyonları"
      },
      {
        text: "Asistan performansını ölçüyorum ve iyileştiriyorum",
        options: [
          "Hiç performans ölçümü yapmadım",
          "Bazen 'iyi çalışmıyor' diyorum ama düzeltmiyorum",
          "Geri bildirimlere göre talimatları güncelliyorum",
          "Sistematik geri bildirim topluyorum, versiyon kontrolü yapıyorum ve iyileştirme döngüsü kurdum"
        ],
        evidence: "V1.0→V2.0 değişiklik logu, kullanıcı geri bildirim formu"
      },
      {
        text: "Asistanlarım için net sınırlar ve kurallar tanımladım",
        options: [
          "Hiç sınır belirtmedim",
          "'Bu konulara girme' gibi genel ifadeler kullandım",
          "Yapılacaklar ve yapılmayacaklar listesi oluşturdum",
          "Detaylı guardrails (güvenlik, etik, format, içerik sınırları) tanımladım ve test ettim"
        ],
        evidence: "'Kişisel veri paylaşma', 'Medikal tavsiye verme', 'Kaynak olmadan iddia yapma' kuralları"
      },
      {
        text: "Özel asistanlarımı iş akışıma tam entegre ettim",
        options: [
          "Bazen hatırlayınca kullanıyorum",
          "Haftada birkaç kez kullanıyorum",
          "Belirli görevler için varsayılan aracım haline geldi",
          "İş akışımın kritik parçası, günlük rutinimde vazgeçilmez ve ekip prosedürlerine dahil"
        ],
        evidence: "'Her pazartesi haftalık rapor için X asistanını kullanıyorum' gibi rutin"
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
        text: "Problem sınıflandırma yapıyorum",
        options: [
          "Tüm problemleri aynı sanıyorum",
          "Kolay/zor ayrımı yapıyorum",
          "Cynefin modeli gibi framework'leri duydum",
          "Cynefin veya 4U ile problemleri sınıflandırıyor ve çözüm stratejisi belirliyorum"
        ],
        evidence: "'Bu problem Complex kategorisinde, deneme-öğrenme gerekir' analizi"
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
        text: "Kod yazmadan yapay zeka destekli araçlar geliştiriyorum",
        options: [
          "Hiç no-code geliştirme yapmadım",
          "Basit form veya hesaplama aracı yaptım",
          "Orta karmaşıklıkta uygulama (içerik üretimi, veri analizi) geliştirdim",
          "İleri seviye prototip (çoklu adım, karar yapısı, entegrasyon) geliştirdim"
        ],
        evidence: "'Müşteri geri bildirimi analiz ve öneri aracı' gibi fonksiyonel prototip"
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
        text: "Hızlı doğrulama (validation) için prototipleme yapıyorum",
        options: [
          "Doğrudan tam çözüm geliştirmeye çalışıyorum",
          "Bazen basit test yapıyorum",
          "Fikir doğrulama için düzenli prototip yapıyorum",
          "Lean/Agile yaklaşımla MVP mantığında hızlı prototip→test→öğren döngüsü kurdum"
        ],
        evidence: "'Bu fikri 2 günde prototiple test ettim, çalışmıyor, vazgeçtik' hikayesi"
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
      },
      {
        text: "Prototipleri iş değeri göstermek için sunuyorum",
        options: [
          "Hiç sunmadım",
          "Bir kez gösterdim ama tepki almadım",
          "Yöneticilere veya ekibe sunduk ve geri bildirim aldık",
          "İş değeri analizi (zaman tasarrufu, maliyet, kalite) ile sundum ve onay/bütçe aldım"
        ],
        evidence: "Sunum dökümanı + 'Bu prototip haftada 5 saat kazandırır' analizi"
      },
      {
        text: "Girdi-çıktı ilişkisini netleştiriyorum",
        options: [
          "Girdi ve çıktıyı tanımlamıyorum",
          "Ne girdiğini ve ne çıktığını genel olarak biliyorum",
          "Girdi formatı, veri tipi ve çıktı beklentisini dokümante ediyorum",
          "SIPOC yaklaşımıyla Supplier-Input-Process-Output-Customer zincirini net tanımlıyorum"
        ],
        evidence: "'Girdi: Müşteri e-postası (text), Çıktı: Kategori (Şikayet/Soru/Öneri) + Öncelik (1-3)' tanımı"
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
        text: "Manuel tekrar eden işleri otomatikleştirdim",
        options: [
          "Hiçbir manuel işi otomatikleştirmedim",
          "1 basit veri aktarımı otomatikleştirdim",
          "3-5 farklı işi otomatikleştirdim",
          "10+ rutin işi otomatikleştirdim ve dokümante ettim"
        ],
        evidence: "'Form cevabı → Google Sheets → E-posta bildirimi' gibi 3+ aktif otomasyon"
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
        text: "Otomasyonlarımı izliyor ve bakım yapıyorum",
        options: [
          "Kurdum ve unuttum, çalışıp çalışmadığını bilmiyorum",
          "Sorun olduğunda fark ediyorum",
          "Haftada bir kontrol ediyorum",
          "Otomatik bildirim + log takibi + periyodik review sistemi kurdum"
        ],
        evidence: "Otomasyon sağlık kontrol check-listi, son 30 gün hata logu"
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
      },
      {
        text: "Karar yapıları (if-then) kuruyorum",
        options: [
          "Sadece lineer akışlar kuruyorum",
          "Basit tek koşul kullanıyorum",
          "Çoklu koşul ve dallanma kuruyorum",
          "İç içe koşullar, çoklu kriter ve karmaşık karar ağaçları kuruyorum"
        ],
        evidence: "'Eğer tutar>1000 VE müşteri=premium İSE X, değilse Y' mantığı"
      },
      {
        text: "Otomasyon uygunluğunu değerlendirebiliyorum",
        options: [
          "Her işin otomasyona uygun olduğunu düşünüyorum",
          "Bazen 'bu otomatikleştirilemez' diyorum ama neden bilmiyorum",
          "Tekrar sıklığı ve kural netliği ile değerlendiriyorum",
          "ROI analizi (kurulum süresi vs kazanç), teknik uygunluk ve risk değerlendirmesi yapıyorum"
        ],
        evidence: "'Bu iş ayda 2 kez, otomasyon 4 saat, kazanç 30 dk → uygun değil' analizi"
      },
      {
        text: "Otomasyon performansını ölçüyorum ve optimize ediyorum",
        options: [
          "Hiç performans ölçümü yapmıyorum",
          "Bazen çalışma süresine bakıyorum",
          "Başarı oranı ve süre gibi temel metrikleri izliyorum",
          "KPI dashboard'u kurdum (başarı oranı, ortalama süre, hata oranı, maliyet) ve sürekli optimize ediyorum"
        ],
        evidence: "Son 30 gün metrik raporu (97% başarı, ort. 2 dk, %3 hata)"
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
        text: "Yapay zeka API'lerini otomasyon araçlarına entegre ediyorum",
        options: [
          "API kullanmadım",
          "API key aldım ama kullanamadım",
          "Basit API çağrısı yapıyorum",
          "Çoklu API, hata yönetimi, rate limiting ve maliyet optimizasyonu ile entegrasyon yapıyorum"
        ],
        evidence: "n8n'de OpenAI API çağrısı + retry mekanizması + token limiti kontrolü"
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
        text: "Doküman okuma ve analizi otomasyonları kurdum",
        options: [
          "Manuel doküman okuyorum",
          "Yapay zekaya manuel yüklüyorum",
          "Otomatik doküman upload + analiz akışı kurdum",
          "Çoklu doküman işleme, OCR, tablo çıkarma ve yapılandırılmış veri çıktısı üretiyorum"
        ],
        evidence: "PDF fatura → AI ile veri çıkarma → JSON → ERP'ye kayıt"
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
      },
      {
        text: "Akıllı yönlendirme ve önceliklendirme sistemleri kurdum",
        options: [
          "Tüm işler aynı öncelikle işleniyor",
          "Manuel önceliklendirme yapıyorum",
          "Kural bazlı önceliklendirme kurdum",
          "Yapay zeka ile içerik analizi + sentiment + aciliyet skorlaması yapan dinamik önceliklendirme sistemi kurdum"
        ],
        evidence: "E-posta AI analizi → Urgency skoru (1-10) → Sıraya göre routing"
      },
      {
        text: "Yapay zeka maliyetlerini yönetiyorum",
        options: [
          "Maliyet takibi yapmıyorum",
          "Ne kadar harcadığımı biliyorum ama optimize etmiyorum",
          "Model seçimi (GPT-4 vs GPT-3.5) ile optimizasyon yapıyorum",
          "Token limitleri, caching, batch processing ve model optimizasyonu ile maliyet yönetimi yapıyorum"
        ],
        evidence: "'Basit görevlerde GPT-3.5, karmaşık analizde GPT-4' stratejisi + aylık maliyet raporu"
      },
      {
        text: "Esnek ve ölçeklenebilir yapay zeka destekli süreçler sunuyorum",
        options: [
          "Sabit, değişime kapalı akışlar kurdum",
          "Küçük değişiklikler için akışı yeniden kurmam gerekiyor",
          "Parametrik yapılar kurdum, bazı değişikliklere uyum sağlıyor",
          "Yapay zeka adaptasyonu ile değişen durumlara otomatik uyum sağlayan, ölçeklenebilir sistemler kurdum ve dokümante ettim"
        ],
        evidence: "Yeni kategori eklendiğinde AI otomatik öğreniyor, akış değişikliği gerektirmiyor"
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
        text: "Ajan kendi adımlarını belirliyor ve uygulayabiliyor",
        options: [
          "Sabit akış takip ediyor",
          "Basit dallanma yapabiliyor",
          "Alternatif stratejiler deneyebiliyor",
          "Hedefe ulaşmak için dinamik plan oluşturuyor, başarısız olursa alternatif yol buluyor"
        ],
        evidence: "Ajan log'u: 'Web scraping başarısız oldu → API denedi → başarılı → devam etti'"
      },
      {
        text: "Ajana ara sonuçlara göre strateji değiştirme izni veriyorum",
        options: [
          "Ajan sabit planı takip ediyor",
          "Hata durumunda duruyor ve bildiriyor",
          "Basit hata yönetimi var (retry gibi)",
          "Ara sonuçları değerlendirerek strateji değiştirebiliyor, alternatif yollar deneyebiliyor"
        ],
        evidence: "'Veri bulunamadı → Alternatif kaynak dene → Başka format dene → Başarısız → Rapor et' akışı"
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
      },
      {
        text: "Karmaşık, çok adımlı süreçleri ajan ile yönetiyorum",
        options: [
          "Sadece basit tek adımlı görevler",
          "2-3 adımlı basit akışlar",
          "5-10 adımlı orta karmaşıklıkta süreçler",
          "20+ adımlı, çoklu karar noktası, dış sistem entegrasyonu gerektiren karmaşık süreçleri ajan ile yönetiyorum"
        ],
        evidence: "End-to-end müşteri onboarding: veri toplama, doğrulama, CRM kaydı, e-posta dizisi, takip planı"
      },
      {
        text: "Ajan tabanlı sistemlerle ölçeklenebilirlik ve hız sağlıyorum",
        options: [
          "Manuel müdahale gerektiriyor",
          "Bazı işlerde hızlanma var",
          "Belirli süreçlerde 5x hızlanma sağladım",
          "10x+ ölçeklenebilirlik, paralel işlem kapasitesi ve iş değeri metrikleriyle kanıtladım"
        ],
        evidence: "'Müşteri analizi 1 günden 1 saate düştü, aynı anda 50 müşteri işlenebiliyor'"
      },
      {
        text: "Ajan sistemlerinin bakım, güvenlik ve maliyet yönetimini yapıyorum",
        options: [
          "Kurdum ve unuttum, bakım yapmıyorum",
          "Sorun olduğunda müdahale ediyorum",
          "Periyodik kontrol ve güncelleme yapıyorum",
          "Kapsamlı yönetişim: otomatik sağlık kontrolü, güvenlik audit, maliyet optimizasyonu, versiyon yönetimi, dokümantasyon ve ekip eğitimi"
        ],
        evidence: "Ajan yönetişim dokümantasyonu: SLA, güvenlik politikası, maliyet raporu, incident log, update pipeline"
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const assessmentRef = useRef(null);

  const handleResponse = (level, questionIndex, score) => {
    setResponses(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [questionIndex]: score
      }
    }));
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-800 font-semibold text-lg tracking-tight">AI Yetkinlik</span>
            </div>
            <button
              onClick={() => setShowGlossary(true)}
              className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-all duration-300 hover:bg-slate-100 px-4 py-2 rounded-lg"
            >
              Kavramlar
            </button>
          </div>
        </header>

        {/* Hero - Centered */}
        <section className="relative z-10 min-h-[85vh] flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Kurumsal Yapay Zeka Olgunluk Analizi</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
              Yapay Zeka Yetkinliğinizi
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Profesyonelce Olcun
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Organizasyonunuzun AI olgunlugunu 8 seviyeli cercevemizle
              degerlendirin. Dogru egitim ve gelisim yolunu belirleyin.
            </p>

            {/* CTA Button */}
            <button
              onClick={startAssessment}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
            >
              <span>Degerlendirmeye Basla</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{getTotalQuestions()} soru</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>~10 dakika</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Ucretsiz</span>
              </div>
            </div>

            {/* AI Visual */}
            <div className="mt-16 relative">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/50 p-8 max-w-3xl mx-auto">
                <div className="grid grid-cols-4 gap-4">
                  {competencyLevels.slice(0, 8).map((level, index) => {
                    const colors = ['#10b981', '#10b981', '#0ea5e9', '#0ea5e9', '#6366f1', '#6366f1', '#8b5cf6', '#8b5cf6'];
                    return (
                      <div
                        key={level.id}
                        className="group relative bg-slate-50 hover:bg-white rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default border border-slate-100 hover:border-slate-200"
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-3 mx-auto shadow-lg"
                          style={{backgroundColor: colors[index], boxShadow: `0 4px 14px ${colors[index]}40`}}
                        >
                          {level.id}
                        </div>
                        <p className="text-xs text-slate-600 font-medium text-center leading-tight">{level.title}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-slate-400 text-sm mt-6">8 yetkinlik seviyesi ile kapsamli analiz</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="relative z-10 py-24 px-6 bg-white/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Tanidik Geliyor mu?
            </h2>
            <p className="text-slate-500 mb-12">Kurumsal AI donusumunun ortak zorluklari</p>

            <div className="space-y-4">
              {[
                "Yapay zekayi kullanmaya basladik ama aslinda hangi seviyedeyiz bilmiyoruz.",
                "Ekiplere egitim vermek istiyoruz ama kimin neye ihtiyaci var, net degil.",
                "Prompt mu ogretmeliyiz, otomasyon mu, yoksa daha temel bir sey mi?"
              ].map((text, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed">"{text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Bu Degerlendirme Size Ne Saglar?
              </h2>
              <p className="text-slate-500">Somut ciktilar ve aksiyonlar</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "Mevcut Durum",
                  description: "8 seviyeli olgunluk modelinde su an nerede oldugunuzu gorun.",
                  color: "emerald"
                },
                {
                  icon: TrendingUp,
                  title: "Gelisim Yolu",
                  description: "Sonraki seviyeye gecmek icin hangi becerilere odaklanmaniz gerektigini ogrenin.",
                  color: "blue"
                },
                {
                  icon: Users,
                  title: "Ortak Dil",
                  description: "IK, yoneticiler ve ekipler arasinda ortak bir anlayis olusturun.",
                  color: "violet"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    item.color === 'emerald' ? 'bg-emerald-50' :
                    item.color === 'blue' ? 'bg-blue-50' : 'bg-violet-50'
                  }`}>
                    <item.icon className={`w-7 h-7 ${
                      item.color === 'emerald' ? 'text-emerald-600' :
                      item.color === 'blue' ? 'text-blue-600' : 'text-violet-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="relative z-10 py-20 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: Compass, title: "Test degil, pusula", desc: "Dogru veya yanlis cevap yok. Amacimiz yargilamak degil, yon gostermek." },
                { icon: Lock, title: "Verileriniz sizde", desc: "Yanitlariniz sunucuya gonderilmez. Tum islem tarayicinizda gerceklesir." },
                { icon: Building2, title: "Kurumsal odak", desc: "IK, L&D ve yoneticiler icin tasarlandi. Organizasyonel deger odakli." }
              ].map((item, index) => (
                <div key={index} className="p-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Hazir misiniz?
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Degerlendirme yaklasik 10 dakika surer. Sonuclarinizi hemen goreceksiniz.
            </p>
            <button
              onClick={startAssessment}
              className="group inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <span>Degerlendirmeye Basla</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-white border-t border-slate-200 py-8 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-sm text-slate-400">2026 Mustafa Aydin</span>
            <button
              onClick={() => setShowGlossary(true)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Kavramlar Sozlugu
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

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        {/* Header */}
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Ana Sayfa</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Soru</span>
                <span className="text-white font-semibold">{currentQuestionNumber}</span>
                <span className="text-slate-500 text-sm">/ {getTotalQuestions()}</span>
              </div>

              <button
                onClick={() => setShowGlossary(true)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-all"
              >
                <Library className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        {/* Level Tabs */}
        <div className="bg-slate-900/50 border-b border-white/5 overflow-x-auto">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex gap-2">
              {competencyLevels.map((level, idx) => {
                const LevelIcon = level.icon;
                const isActive = idx === currentLevel;
                const answered = getAnsweredCount(idx);
                const total = level.questions.length;
                const isComplete = answered === total;

                return (
                  <button
                    key={idx}
                    onClick={() => jumpToLevel(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${level.color} text-white`
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LevelIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{level.title}</span>
                    <span className="sm:hidden">S{idx}</span>
                    {isComplete && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8" ref={assessmentRef}>
          <div className="max-w-3xl mx-auto">
            {/* Level Info Card */}
            <div className={`bg-gradient-to-br ${currentLevelData.color} rounded-2xl p-6 mb-8`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Seviye {currentLevel}</p>
                  <h2 className="text-xl font-bold text-white">{currentLevelData.title}</h2>
                  <p className="text-white/80 text-sm">{currentLevelData.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Question Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${currentLevelData.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold">{currentQuestion + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg leading-relaxed">
                      {currentQuestionData.text}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="p-6 space-y-3">
                {currentQuestionData.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleResponse(currentLevel, currentQuestion, idx)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        isSelected
                          ? `bg-gradient-to-r ${currentLevelData.color} shadow-lg`
                          : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-white/30' : 'bg-white/10'
                        }`}>
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-sm font-medium text-slate-400">{idx}</span>
                          )}
                        </div>
                        <span className={`text-sm leading-relaxed ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {option}
                        </span>
                        <div className={`ml-auto px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
                        }`}>
                          {idx} puan
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Evidence */}
              <div className="px-6 pb-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-300 text-sm font-medium mb-1">Kanıt Örneği</p>
                      <p className="text-slate-400 text-sm">{currentQuestionData.evidence}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Navigation Footer */}
        <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-white/5 sticky bottom-0">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex gap-3">
              <button
                onClick={handlePrevQuestion}
                disabled={currentLevel === 0 && currentQuestion === 0}
                className="flex-1 bg-white/5 border border-white/10 text-white py-4 rounded-xl font-semibold hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Önceki
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className={`flex-1 bg-gradient-to-r ${currentLevelData.color} text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg`}
              >
                {currentLevel === 7 && currentQuestion === currentLevelData.questions.length - 1 ? (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    Sonuçları Gör
                  </>
                ) : (
                  <>
                    Sonraki
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
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

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 print:bg-white">
        {/* Print Styles */}
        <style>{`
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print\\:hidden { display: none !important; }
            .print\\:bg-white { background: white !important; }
          }
        `}</style>

        {/* Header */}
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 print:hidden">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold">Değerlendirme Sonucu</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGlossary(true)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <Library className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Result Hero */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-yellow-300" />
              </div>
              <p className="text-white/80 text-sm mb-2">Yapay Zeka Yetkinlik Seviyeniz</p>
              <h1 className="text-5xl font-bold text-white mb-2">
                Seviye {overallLevel === -1 ? 0 : overallLevel}
              </h1>
              <p className="text-2xl text-white/90 mb-6">
                {currentLevelData.title}
              </p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{totalScore}</p>
                  <p className="text-white/60 text-sm">Toplam Puan</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">%{Math.round(overallPercentage)}</p>
                  <p className="text-white/60 text-sm">Başarı Oranı</p>
                </div>
              </div>
            </div>

            {/* Level Breakdown */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Scores */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Seviye Bazlı Performans
                </h2>
                <div className="space-y-3">
                  {levelScores.map(({ level, title, icon: LIcon, color, score, maxScore, percentage }) => (
                    <div key={level} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                        <LIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-300 truncate">S{level}</span>
                          <span className={`text-sm font-medium ${percentage >= 70 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {score}/{maxScore}
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percentage >= 70 ? 'bg-emerald-500' : 'bg-slate-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Gelişim Önerileri
                </h2>

                <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl p-4 mb-4">
                  <p className="text-white text-sm font-medium mb-1">Sonraki Hedef</p>
                  <p className="text-slate-300 text-sm">{nextLevelRec.next}</p>
                </div>

                {weakAreas.length > 0 && (
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Geliştirilmesi Gereken Alanlar</p>
                        <p className="text-slate-400 text-sm">
                          {weakAreas.map(a => `Seviye ${a.level}`).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Önerilen Araçlar</p>
                  <div className="flex flex-wrap gap-2">
                    {nextLevelRec.tools.map((tool, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-white/5 border border-white/10 text-white py-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                PDF Olarak İndir
              </button>
              <button
                onClick={() => {
                  setCurrentView('home');
                  setResponses({});
                  setCurrentLevel(0);
                  setCurrentQuestion(0);
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Yeniden Değerlendir
              </button>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
              <p>Yapay Zeka Yetkinlik Değerlendirmesi - {new Date().toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        </main>

        <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
      </div>
    );
  }

  return null;
}
