// v3 시험판 콘텐츠. 터키어는 원어민 검수 전 초안. 디자인과 분리해서 3개 시안이 같은 내용을 씀
const PHOTO = f => `ph/${f}.jpg`;
const POSTS = {
  // 1. 호칭 (오빠·언니·형·누나)
  h: [
    { t: 'cover', photo: 'couple_neon', pos: '55% 50%', kicker: 'Dil', q: 'Dizide neden kızlar “oppa”, erkekler “hyung” diyor?', dek: 'Korecede “abi” ve “abla” demenin dört yolu var.' },
    { t: 'text', photo: 'seoul_neon', kicker: 'Kural', title: 'Önce konuşana bak', body: 'Korecede ağabey ve abla için kullanılan kelime, <b>konuşan kişinin cinsiyetine</b> göre değişir. “Oppa” ve “noona”da bu kural kesin; “unnie” ve “hyung”da çoğunlukla böyle.' },
    { t: 'table', kicker: 'Dört kelime', title: 'Kim, kime ne der?', groups: [
      ['Konuşan kadınsa', [['oppa', '오빠', 'abi'], ['unnie', '언니', 'abla']]],
      ['Konuşan erkekse', [['hyung', '형', 'abi'], ['noona', '누나', 'abla']]]] },
    { t: 'text', photo: 'couple_winter', kicker: 'Peki sevgili?', title: '“Oppa” sevgili demek değil', body: 'Kadınlar, kendinden büyük ve yakın hissettiği erkeklere de <b>oppa</b> der. Dizide sevgiliye “oppa” denmesi bu yüzden: kelimenin anlamı “sevgili” değil, “yakın, büyük erkek”.' },
    { t: 'text', photo: 'istanbul', kicker: 'Türkçede', title: 'Herkes aynı kelimeyi kullanır', body: 'Türkçede kadın da erkek de <b>abi</b> ve <b>abla</b> der. Korecede ise bir erkek “oppa” demez; o, “hyung” der.' },
    { t: 'end', ko: '오빠', rom: 'oppa', mean: 'Bir kadının ağabeyi ya da kendinden büyük, yakın bir erkek.', src: 'Kaynak: Standart Kore Dili Sözlüğü (Ulusal Kore Dili Enstitüsü) · TDK Güncel Türkçe Sözlük' },
  ],
  // 2. 김장
  k: [
    { t: 'cover', photo: 'p10_cabbage', pos: '50% 50%', kicker: 'Kasım', q: 'Kasımda Kore\'de neden herkes onlarca lahana alıyor?', dek: 'Cevap tek kelime: kimjang.' },
    { t: 'text', photo: 'p10_kimjang', kicker: 'Kimjang', title: 'Kışlık kimchi, tek seferde', body: 'Kış boyunca yenecek kimchi, tek seferde ve bol miktarda hazırlanır. Buna <b>kimjang</b> denir.' },
    { t: 'steps', photo: 'p10_cabbage2', kicker: 'Nasıl?', title: 'Üç aşama', items: ['Lahanalar ikiye bölünür ve tuzlanır', 'Kırmızı biber ve sarımsakla bir harç hazırlanır', 'Harç yaprakların arasına sürülür, kimchi saklanır'] },
    { t: 'text', photo: 'p12_autumn', kicker: 'Neden şimdi?', title: 'Sonbaharın sonu', body: 'Kimjang, kış gelmeden yapılır. Eskiden takvimde kışın başlangıcı sayılan <b>ipdong</b> (7 Kasım civarı) zamanında yapılırdı; bugün ise çoğunlukla kasım ayında yapılıyor.' },
    { t: 'num', kicker: 'UNESCO', num: '2013', unit: 'İnsanlığın mirası', body: 'Kimjang sadece yemek yapmak değil. Geleneksel olarak aileler ve komşular sırayla birbirine yardım eder ve kimchiyi paylaşır. UNESCO bu geleneği 2013\'te listesine aldı.' },
    { t: 'end', ko: '김장', rom: 'kimjang', mean: 'Kış için kimchiyi topluca hazırlama ve paylaşma geleneği.', src: 'Kaynak: UNESCO (2013) · Kore Halk Kültürü Ansiklopedisi (Ulusal Halk Müzesi)' },
  ],
};

// 2주차: 수능
POSTS.s = [
  { t: 'cover', photo: 'p9_plane', pos: '50% 60%', kicker: 'Sınav', q: 'Kore\'de bir sınav için neden uçaklar bekletiliyor?', dek: '19 Kasım: Kore\'nin üniversite sınavı Suneung.' },
  { t: 'text', photo: 'p9_desk', kicker: 'Suneung', title: 'Yılda bir gün, tek sınav', body: 'Kore\'de üniversiteye girişte kullanılan bu sınav yılda bir kez yapılır. Bu yıl tarih <b>19 Kasım</b>; yaklaşık <b>552 bin</b> kişi başvurdu. Sınav sabah 8.40\'ta başlar, akşam 17.45\'e kadar sürer.' },
  { t: 'steps', photo: 'p9_commute', kicker: 'O gün', title: 'Ülke sınava göre ayarlanır', items: ['Kurum ve şirketlerden mesaiyi 10.00\'da başlatmaları istenir; adaylar trafiğe takılmasın diye', 'İngilizce dinleme bölümünde (13.10–13.35) uçakların iniş ve kalkışı ayarlanır', 'Geç kalan adayları polis sınav yerine yetiştirir'] },
  { t: 'num', kicker: 'Geçen yıl', num: '140', unit: 'uçuşun saati değişti', body: '2025 sınavında dinleme bölümü boyunca 35 dakika iniş ve kalkış yapılmadı. Havadaki uçaklar 3 km\'nin üzerinde bekledi.' },
  { t: 'text', photo: 'p9_police', kicker: 'Polis', title: 'Sabah saatlerinde 234 yardım', body: 'Geçen yılki sınav günü, sabah saatlerinde polis adaylara 234 kez yardım etti. Bunların 134\'ü, adayı devriye arabasıyla sınav yerine götürmekti.' },
  { t: 'end', ko: '수능', rom: 'suneung', mean: 'Kore\'de üniversiteye girişte kullanılan ulusal sınav. Uzun adının kısaltması.', src: 'Kaynak: Kore Eğitim Bakanlığı, korea.kr (2026-10-20) · Kyunghyang Shinmun (2025-11-11) · Seoul Economic Daily (2025-11-13)' },
];

// 2주차: 팁
POSTS.t = [
  { t: 'cover', photo: 'tip_table', pos: '50% 50%', kicker: 'Seyahat', q: 'Kore\'de restoranda bahşiş bırakılır mı?', dek: 'Kısa cevap: genellikle hayır.' },
  { t: 'text', photo: 'tip_pay', kicker: 'Kural', title: 'Bahşiş beklenmez', body: 'Kore Turizm Örgütü\'ne göre Kore\'de bahşiş zorunlu değildir ve beklenmez. Hesapta yazan tutarı ödemen yeterli.' },
  { t: 'text', photo: 'tip_price', kicker: 'Fiyat', title: 'Menüdeki fiyat, ödenen fiyat', body: 'Restoran ve kafeler, KDV dahil, müşterinin gerçekten ödeyeceği fiyatı göstermek zorunda. Bu, gıda hijyeni mevzuatındaki bir kural.' },
  { t: 'num', kicker: 'İstisna: büyük oteller', num: '%10', unit: 'servis ücreti', body: 'Bazı büyük oteller ve lüks restoranlar hesaba %10 servis ücreti ekler. Bu durumda ayrıca bahşiş vermene gerek yok; ücret zaten hesapta.' },
  { t: 'text', photo: 'tip_cafe', kicker: 'Tartışma', title: 'Kafede bahşiş ekranı?', body: '2023\'te Seul\'de bir kafede ödeme ekranında %5–10 bahşiş seçenekleri görülmesi Kore\'de tartışma yarattı. Bahşiş hâlâ isteğe bağlı.' },
  { t: 'end', ko: '계산해 주세요', rom: 'gyesanhae juseyo', kind: 'ifade', mean: '“Hesap lütfen.” Restoranda ödemek istediğinde söylenir.', src: 'Kaynak: Kore Turizm Örgütü (VisitKorea, 2023) · Gıda Hijyeni Yasası Uygulama Yönetmeliği (Ek 17) · Visit Seoul · YTN (2023-08-21)' },
];

// 3주차: 한국 나이
POSTS.a = [
  { t: 'cover', photo: 'age_jan', pos: '50% 40%', kicker: 'Günlük hayat', q: 'Kore\'de bebekler neden doğar doğmaz 1 yaşında sayılırdı?', dek: 'Ve 2023\'te ne değişti?' },
  { t: 'text', photo: 'age_calendar', pos: '50% 78%', kicker: 'Eski usul', title: '“Sayılan yaş”', body: 'Doğduğun yıl 1 yaş sayılır ve her <b>1 Ocak\'ta</b> herkes aynı anda bir yaş büyür. Yani 31 Aralık\'ta doğan bir bebek, ertesi gün “2 yaşında” olur.' },
  { t: 'num', kicker: 'Yeni kural', num: '2023', unit: '28 Haziran: uluslararası yaş', body: 'O günden beri kanunlarda ve resmî işlerde yaş, doğum gününe göre hesaplanır (Kore Medeni Kanunu, 158. madde).' },
  { t: 'steps', kicker: 'Ama istisnalar var', title: 'Hâlâ doğum yılına bakılan yerler', items: ['Alkol ve sigara: 19 yaşına girdiğin yılın 1 Ocak\'ından itibaren serbest', 'Askerlik: içinde bulunulan yıl eksi doğum yılı', 'İlkokula başlama: doğum gününe değil, doğum yılına göre'] },
  { t: 'num', kicker: 'Peki günlük hayatta?', num: '%60,8', unit: 'hâlâ eski usul', body: '2024\'te özel bir araştırma şirketinin anketinde (1.200 kişi) katılımcıların %60,8\'i günlük hayatta hâlâ “sayılan yaşı” kullandığını söyledi. Dizilerde yaş konuşmalarının kafa karıştırması bu yüzden.' },
  { t: 'end', ko: '나이', rom: 'nai', mean: 'Yaş. Kibarca yaş sormak için: “Nai-ga eotteoke doeseyo?”', src: 'Kaynak: Kore Medeni Kanunu md. 158 · korea.kr (2022-12-08, 2023-06-22, 2023-06-26) · Kore Mevzuat Bakanlığı (2024-06-27) · Embrain anketi, iNews24 (2024-11-21)' },
];
// 3주차: 미역국
POSTS.m = [
  { t: 'cover', photo: 'miyeok_soup', pos: '50% 50%', kicker: 'Mutfak', q: 'Kore\'de doğum gününde neden yosun çorbası içilir?', dek: 'Adı miyeokguk.' },
  { t: 'text', photo: 'miyeok_dried', kicker: 'Miyeokguk nedir?', title: 'Deniz yosunu çorbası', body: '<b>Miyeok</b> bir tür deniz yosunu; <b>guk</b> çorba demek. Miyeokguk, Kore\'de en yaygın çorbalardan biri.' },
  { t: 'text', photo: 'meal_table', kicker: 'Önce anneler için', title: 'Doğumdan sonra', body: 'Kore\'de doğum yapan anneye ilk olarak beyaz pilav ve miyeokguk verilir. Ansiklopediye göre sebebi, yosundaki iyot ve kalsiyum.' },
  { t: 'text', photo: 'bday_cake', kicker: 'Sonra herkes için', title: 'Doğum günü sofrası', body: 'Zamanla miyeokguk doğum günlerinin de yemeği oldu. Doğum günü sofrasında beyaz pilav ve miyeokguk eksik edilmez.' },
  { t: 'text', photo: 'miyeok_soup2', kicker: 'Ama sınavdan önce değil', title: '“Miyeokguk yemek”', body: 'Korecede bu deyimin mecaz anlamı <b>“sınavda kalmak”</b> (Standart Kore Dili Sözlüğü). Bu yüzden sınavdan önce bu çorbayı yemeyenler olduğu söylenir.' },
  { t: 'end', ko: '미역국', rom: 'miyeokguk', mean: 'Deniz yosunu çorbası. Doğum günlerinin çorbası.', src: 'Kaynak: Kore Kültürü Ansiklopedisi (encykorea.aks.ac.kr: “Miyeokguk”, “Saengil”, “Miyeok”) · Standart Kore Dili Sözlüğü' },
];
// 4주차: 인사말 (릴스 원고 재활용)
POSTS.g = [
  { t: 'cover', photo: 'seoul_winter', pos: '50% 40%', kicker: 'Dil', q: 'Korecede neden üç farklı “merhaba” var?', dek: 'Kime selam verdiğine göre değişir.' },
  { t: 'text', photo: 'p8_hanriver', kicker: 'Kural', title: 'Önce karşındakine bak', body: 'Korecede selamın biçimi, <b>kime selam verdiğine</b> göre değişir: yakın bir arkadaşa, bir yetişkine ya da resmî bir ortamda farklı bir kelime kullanılır.' },
  { t: 'trio', kicker: 'Üç selam', title: 'Kime hangisi?', rows: [
    ['안녕', 'annyeong', 'Samimi', 'Yakın arkadaşlar arasında ve çocuklara'],
    ['안녕하세요', 'annyeonghaseyo', 'Kibar', 'Yetişkinler arasında günlük selam'],
    ['안녕하십니까', 'annyeonghasimnikka', 'Daha resmî', 'İş yerinde, büyüklere']] },
  { t: 'text', photo: 'market_vendor', kicker: 'Günlük hayatta', title: 'En çok duyacağın: annyeonghaseyo', body: 'Mağazada, restoranda, yeni tanıştığın biriyle: yetişkinler arasındaki kibar, günlük selam <b>annyeonghaseyo</b>.' },
  { t: 'text', photo: 'p8_picnic', kicker: 'Bir de şu var', title: '“Annyeong” hem merhaba hem hoşça kal', body: 'Sözlüğe göre samimi ortamda <b>annyeong</b>, karşılaşırken de ayrılırken de söylenir. Kelimenin kendi anlamı “esenlik, huzur”.' },
  { t: 'end', ko: '안녕하세요', rom: 'annyeonghaseyo', kind: 'selam', mean: '“Merhaba.” Yetişkinler arasında kibar, günlük selam.', src: 'Kaynak: Ulusal Kore Dili Enstitüsü, Standart Dil Görgü Kuralları (2011) · Standart Kore Dili Sözlüğü' },
];
// 4주차: 식사 인사 (릴스 원고 재활용)
POSTS.y = [
  { t: 'cover', photo: 'tip_table2', pos: '50% 50%', kicker: 'Günlük hayat', q: 'Bir Koreli “Yemek yedin mi?” diye sorarsa ne demek istiyor?', dek: 'Çoğu zaman sadece selam veriyor.' },
  { t: 'text', photo: 'p8_ramen', kicker: 'Selam', title: 'Yemek saatinde bir selam', body: 'Ulusal Kore Dili Enstitüsü\'nün görgü kuralları kitabı, yemek saatinde karşılaşınca verilen selamlar arasında <b>“Yemek yedin mi?”</b> sorusunu da sayar.' },
  { t: 'trio', kicker: 'Üç hâli', title: 'Kime nasıl sorulur?', rows: [
    ['밥 먹었어?', 'bap meogeosseo?', 'Samimi', 'Arkadaşa: “Yemek yedin mi?”'],
    ['식사하셨어요?', 'siksahasyeosseoyo?', 'Kibar', '“Yemek yediniz mi?”'],
    ['점심 잡수셨습니까?', 'jeomsim japsusyeosseumnikka?', 'En saygılı', 'Büyüklere: “Öğle yemeğini yediniz mi?”']] },
  { t: 'text', photo: 'p10_kimchi', kicker: 'Kelimeler', title: '“Bap” ve “siksa”', body: '<b>Bap</b> günlük dilde “yemek”; kibar konuşurken <b>siksa</b> denir. Büyüklere konuşurken fiil de değişir: “meokda” (yemek) yerine saygı bildiren <b>“japsusida”</b>.' },
  { t: 'text', photo: 'meal_table', kicker: 'Saat önemli', title: 'Öğlen “jeomsim”, akşam “jeonyeok”', body: 'En saygılı örnekte öğünün adı da geçer: <b>jeomsim</b> öğle yemeği, <b>jeonyeok</b> akşam yemeği demek.' },
  { t: 'end', ko: '밥 먹었어?', rom: 'bap meogeosseo?', kind: 'ifade', mean: '“Yemek yedin mi?” Yakın arkadaşlar arasında hem soru hem selam.', src: 'Kaynak: Ulusal Kore Dili Enstitüsü, Standart Dil Görgü Kuralları (2011), s. 172–173 · Standart Kore Dili Sözlüğü' },
];
// 5주차: 수저 (2026-10-30 작성, 컨펌 대기)
POSTS.su = [
  { t: 'cover', photo: 'sujeo_stew', pos: '50% 72%', kicker: 'Sofra', q: 'Kore sofrasında neden hem kaşık hem çubuk var?', dek: 'İkisinin ayrı bir işi var.' },
  { t: 'text', photo: 'banchan_spread', kicker: 'Kore sofrası', title: 'Pilav, çorba ve yan yemekler', body: 'Bir Kore sofrasında genellikle pilav, çorba ve küçük tabaklarda yan yemekler (<b>banchan</b>) bulunur. Kaşık ve çubuk bu yüzden birlikte gelir.' },
  { t: 'trio', kicker: 'Sözlükte', title: 'Hangisi ne için?', rows: [
    ['숟가락', 'sutgarak', 'Kaşık', 'Pilav ve çorba gibi şeyleri almak için'],
    ['젓가락', 'jeotgarak', 'Çubuk', 'Yemeği tutup almak için'],
    ['수저', 'sujeo', 'İkisi birden', 'Kaşık ile çubuğun ortak adı']] },
  { t: 'steps', kicker: 'Sofra adabı', title: 'Büyüklerle yemekte', items: ['Büyükler kaşığını alıp yemeğe başlamadan başlanmaz', 'İlk olarak kaşıkla çorbadan bir yudum alınır', 'Büyüklerin yeme hızına uyulur'] },
  { t: 'text', photo: 'sujeo_flat', kicker: 'Bir ayrıntı', title: 'Kaşık masada = “Bitirdim”', body: 'Kaşığı masaya bırakmak, yemeğin bittiği anlamına gelir. Bu yüzden yemek sürerken kaşık, pilav ya da çorba kasesinin içine konur.' },
  { t: 'end', ko: '수저', rom: 'sujeo', mean: 'Kaşık ve yemek çubuğu; ikisinin birlikte adı.', src: 'Kaynak: Standart Kore Dili Sözlüğü (“sujeo”, “sutgarak”, “jeotgarak”) · Kore Ulusal Miras İdaresi, “Hansik sofra adabı” (2024-10-04)' },
];
// 6주차: 동지 팥죽 (2026-10-31 작성, 컨펌 대기, 12월 시기)
POSTS.dj = [
  { t: 'cover', photo: 'dongji_pat', pos: '50% 55%', kicker: 'Gelenek', q: 'Kore\'de yılın en uzun gecesinde neden kırmızı lapa yenir?', dek: 'Adı patjuk. Günün adı dongji.' },
  { t: 'text', photo: 'dongji_night', pos: '50% 60%', kicker: 'Dongji', title: 'Yılın en uzun gecesi', body: 'Geleneksel takvimde yıl 24 döneme ayrılır. Bunların 22\'ncisi <b>dongji</b>: gecenin en uzun, gündüzün en kısa olduğu gün. Bu yıl <b>22 Aralık</b>.' },
  { t: 'text', photo: 'dongji_snow', pos: '50% 62%', kicker: 'Halk arasında', title: '“Küçük yeni yıl”', body: 'Dongjiden sonra günler yeniden uzar. Bu yüzden halk bu güne <b>“küçük yeni yıl”</b> dedi ve onu Seollal\'den (yeni yıl bayramı) sonra gelen önemli bir gün saydı.' },
  { t: 'trio', kicker: 'Patjuk', title: 'Kasede ne var?', rows: [
    ['팥죽', 'patjuk', 'Lapa', 'Fasulye suyu ve pirinçle pişen lapa'],
    ['팥', 'pat', 'Fasulye', 'Küçük, kırmızı adzuki fasulyesi'],
    ['새알심', 'saealsim', 'Toplar', 'Yapışkan pirinç unundan küçük toplar']] },
  { t: 'steps', kicker: 'Neden kırmızı?', title: 'Gelenekteki anlamı', items: ['Kırmızı rengin kötü ruhları uzak tuttuğuna inanılırdı', 'Yemeden önce biraz lapa evin kapısına ya da yanındaki duvara serpilirdi', 'Bazı evlerde lapaya herkesin yaşı kadar top konur', '“Dongjide patjuk yemeden bir yaş büyümüş sayılmazsın” diye bir söz vardır'] },
  { t: 'end', ko: '동지', rom: 'dongji', mean: 'Yılın en uzun gecesinin olduğu gün; 24 mevsim döneminin 22\'ncisi.', src: 'Kaynak: Kore Kültürü Ansiklopedisi (encykorea.aks.ac.kr: “Dongji”, “Dongji patjuk”) · Kore Ulusal Halk Müzesi (2016-12-20) · Kore Astronomi ve Uzay Bilimi Enstitüsü (KASI)' },
];
const NAMES = { A: ['Kore Notları', '@kore.notlari'], B: ['Kore\'de Neden?', '@korede.neden'], C: ['Kore\'de Neden?', '@korede.neden'] };
