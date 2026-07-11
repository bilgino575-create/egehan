/** Sayfa bölümlerinde ve JSON-LD şemalarında ortak kullanılan içerikler. */

export const SERVICE_NAMES = [
  "Evden Eve Nakliye",
  "Parça Eşya Taşıma",
  "Ofis Taşıma",
  "81 İl'e Nakliye Hizmeti",
] as const;

export const FAQS = [
  {
    question: "Nakliye fiyatı neye göre belirleniyor?",
    answer:
      "Fiyat; eşya miktarı, taşıma mesafesi, kat ve asansör durumu ile paketleme ihtiyacına göre belirlenir. Ücretsiz keşif sonrasında size sürpriz maliyet içermeyen net bir teklif sunarız.",
  },
  {
    question: "Eşyalarım taşıma sırasında sigortalı mı?",
    answer:
      "Evet. Tüm taşımalarımız nakliyat sigortası kapsamındadır. Eşyalarınız araca yüklendiği andan teslim edildiği ana kadar güvence altındadır.",
  },
  {
    question: "Paketleme malzemeleri ve işçilik fiyata dahil mi?",
    answer:
      "Evet. Koli, balonlu naylon, streç film ve battaniye gibi tüm paketleme malzemeleri ile söküm ve montaj işçiliği verdiğimiz teklife dahildir.",
  },
  {
    question: "Şehirler arası taşınma kaç günde tamamlanır?",
    answer:
      "Mesafeye ve güzergâha bağlı olarak çoğu şehirler arası taşıma 1-3 gün içinde tamamlanır. Keşif sırasında size net bir teslim tarihi bildiririz.",
  },
  {
    question: "Asansörlü taşıma hizmetiniz var mı?",
    answer:
      "Evet. Yüksek katlar ve dar merdivenler için mobil asansör sistemimizle eşyalarınızı hızlı ve hasarsız şekilde taşıyoruz.",
  },
  {
    question: "Hafta sonu veya resmî tatillerde taşıma yapıyor musunuz?",
    answer:
      "Evet, haftanın 7 günü çalışıyoruz. Yoğun dönemler için taşıma tarihinizi birkaç gün önceden planlamanızı öneririz.",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Ayşe K.",
    route: "İstanbul → Ankara",
    service: "Evden Eve Nakliye",
    text: "Tüm eşyalarım tek çizik olmadan geldi. Paketlemedeki özen gerçekten şaşırtıcıydı. İyi ki Egehan Lojistik'i seçmişiz.",
  },
  {
    name: "Mehmet D.",
    route: "İzmir → Antalya",
    service: "Evden Eve Nakliye",
    text: "Sabah söz verdikleri saatte kapıdaydılar, akşam yeni evimizde kurulum bitmişti. Bu kadar hızlı olmasını beklemiyordum.",
  },
  {
    name: "Zeynep A.",
    route: "İstanbul",
    service: "Ofis Taşıma",
    text: "40 kişilik ofisimizi hafta sonu taşıdılar; pazartesi sabahı hiçbir şey olmamış gibi işbaşı yaptık. Tam anlamıyla kurumsal hizmet.",
  },
  {
    name: "Hasan Y.",
    route: "Bursa → Eskişehir",
    service: "Parça Eşya Taşıma",
    text: "Sadece birkaç mobilya göndermem gerekiyordu; uygun fiyata, üstelik sigortalı şekilde ulaştırdılar. Süreç boyunca bilgilendirildim.",
  },
  {
    name: "Elif S.",
    route: "Ankara → Trabzon",
    service: "Evden Eve Nakliye",
    text: "Şehirler arası taşınmak gözümde büyüyordu ama her aşamada yanımızda oldular. Annemin antika konsolu bile sapasağlam ulaştı.",
  },
  {
    name: "Burak T.",
    route: "Gaziantep → İstanbul",
    service: "Parça Eşya Taşıma",
    text: "Fiyat konusunda en şeffaf firma. Keşifte söylenen rakam neyse ödediğim oydu. Gönül rahatlığıyla tavsiye ederim.",
  },
] as const;

export const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Mersin",
  "Kayseri",
  "Eskişehir",
  "Samsun",
  "Denizli",
  "Trabzon",
  "Diyarbakır",
  "Van",
  "Muğla",
  "Tekirdağ",
] as const;

export const STATS = [
  { value: "10+", label: "Yıllık Deneyim" },
  { value: "15.000+", label: "Tamamlanan Taşıma" },
  { value: "81", label: "İlde Hizmet" },
  { value: "%99", label: "Müşteri Memnuniyeti" },
] as const;
