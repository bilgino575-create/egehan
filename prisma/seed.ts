import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Admin user -----------------------------------------------------
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@egehanlojistik.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "EgehanAdmin2026!";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Egehan Admin";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: { name: adminName, email: adminEmail, passwordHash, role: "ADMIN" },
    });
    console.log(`✔ Admin kullanıcı oluşturuldu: ${adminEmail}`);
  } else {
    console.log(`— Admin kullanıcı zaten var: ${adminEmail}`);
  }

  // --- Settings (singleton) -------------------------------------------
  await prisma.settings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      siteName: "Egehan Lojistik",
      siteSlogan: "81 İlde Güvenli ve Profesyonel Taşımacılık",
      siteDescription:
        "Egehan Lojistik ile evden eve nakliyat, parça eşya taşıma ve ofis taşıma. " +
        "Türkiye'nin 81 iline sigortalı, hızlı ve profesyonel nakliye hizmeti. " +
        "Ücretsiz keşif ve net teklif için hemen ulaşın.",
      siteUrl: "https://egehanlojistik.com",
      phoneE164: "905530503951",
      workingHours: "Haftanın 7 günü hizmet, 7/24 destek hattı",
    },
    update: {},
  });

  // --- Nav items --------------------------------------------------------
  const navItems = [
    { label: "Hizmetler", href: "#hizmetler" },
    { label: "Neden Biz?", href: "#neden-biz" },
    { label: "Süreç", href: "#surec" },
    { label: "Yorumlar", href: "#yorumlar" },
    { label: "SSS", href: "#sss" },
    { label: "İletişim", href: "#iletisim" },
  ];
  for (const [i, item] of navItems.entries()) {
    const existing = await prisma.navItem.findFirst({ where: { href: item.href } });
    if (!existing) {
      await prisma.navItem.create({ data: { ...item, order: i } });
    }
  }

  // --- Hero (singleton) --------------------------------------------------
  await prisma.heroContent.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      badgeLive: "Türkiye Geneli — 81 İlde Aktif Hizmet",
      badgeVip: "SİZE ÖZEL VİP SERVİS",
      heading: "81 İlde Güvenli ve Profesyonel Taşımacılık",
      headingHighlight: "Güvenli",
      description:
        "Evden eve nakliyattan ofis taşımaya kadar tüm eşyalarınız; uzman ekibimiz, " +
        "sigortalı araç filomuz ve özenli paketleme sistemimizle yeni adresine sorunsuz ulaşır.",
      ctaPrimaryLabel: "Ücretsiz Teklif Alın",
      ctaSecondaryLabel: "Hizmetlerimiz",
      trustItems: [
        "%100 Sigortalı Taşıma",
        "Sözleşmeli Hizmet",
        "Hasarsız Teslimat",
      ],
    },
    update: {},
  });

  // --- Stats --------------------------------------------------------------
  const stats = [
    { value: "10+", label: "Yıllık Deneyim" },
    { value: "15.000+", label: "Tamamlanan Taşıma" },
    { value: "81", label: "İlde Hizmet" },
    { value: "%99", label: "Müşteri Memnuniyeti" },
  ];
  for (const [i, s] of stats.entries()) {
    const existing = await prisma.stat.findFirst({ where: { label: s.label } });
    if (!existing) await prisma.stat.create({ data: { ...s, order: i } });
  }

  // --- Cities ---------------------------------------------------------
  const cities = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
    "Gaziantep", "Mersin", "Kayseri", "Eskişehir", "Samsun", "Denizli",
    "Trabzon", "Diyarbakır", "Van", "Muğla", "Tekirdağ",
  ];
  for (const [i, name] of cities.entries()) {
    await prisma.city.upsert({
      where: { name },
      create: { name, order: i },
      update: {},
    });
  }

  // --- Services (unifies the 3 previously-duplicated lists) -----------
  const services = [
    {
      slug: "evden-eve-nakliye",
      icon: "Home",
      title: "Evden Eve Nakliye",
      description:
        "Evinizdeki tüm eşyalar sökümünden montajına kadar uzman ekibimizin güvencesinde; yeni evinize zahmetsizce taşının.",
      features: ["Söküm ve montaj dahil", "Özel paketleme malzemeleri", "Sigortalı taşıma"],
      popular: true,
    },
    {
      slug: "parca-esya-tasima",
      icon: "Package",
      title: "Parça Eşya Taşıma",
      description:
        "Az sayıda eşya için tam araç ücreti ödemeyin. Parsiyel taşımacılık ile eşyalarınız güvenle ve ekonomik şekilde ulaşsın.",
      features: ["Ekonomik parsiyel çözüm", "Koli ve mobilya taşıma", "Düzenli sefer takvimi"],
    },
    {
      slug: "ofis-tasima",
      icon: "Building2",
      title: "Ofis Taşıma",
      description:
        "İş süreçleriniz aksamadan, hafta sonu ve mesai dışı planlama seçenekleriyle kurumsal standartlarda taşımacılık.",
      features: ["İş kaybı yaşatmayan plan", "Arşiv ve elektronik taşıma", "Kurulum ve yerleşim"],
    },
    {
      slug: "81-ile-nakliye-hizmeti",
      icon: "Route",
      title: "81 İl'e Nakliye Hizmeti",
      description:
        "Türkiye'nin her iline kapıdan kapıya nakliye. Nereye taşınırsanız taşının, Egehan Lojistik yanınızda.",
      features: ["Kapıdan kapıya teslimat", "Anlık bilgilendirme", "Tüm illere düzenli sefer"],
    },
  ];
  for (const [i, s] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: { ...s, order: i },
      update: {},
    });
  }

  // --- Why-us cards -----------------------------------------------------
  const whyUs = [
    { icon: "ShieldCheck", title: "Sigortalı Taşımacılık", description: "Eşyalarınız yükleme anından teslimata kadar nakliyat sigortası güvencesi altındadır." },
    { icon: "Users", title: "Uzman ve Özenli Ekip", description: "Eğitimli, deneyimli ve güler yüzlü ekibimiz eşyalarınıza kendi eşyası gibi davranır." },
    { icon: "CalendarClock", title: "Zamanında Teslimat", description: "Belirlenen gün ve saatte adresinizdeyiz; planlarınız asla aksamaz." },
    { icon: "PackageCheck", title: "Profesyonel Paketleme", description: "Balonlu naylon, özel koli ve battaniyelerle her eşyaya özel koruma uygulanır." },
    { icon: "Wallet", title: "Şeffaf Fiyatlandırma", description: "Keşif sonrası net fiyat; sürpriz maliyet ve gizli ücret yoktur." },
    { icon: "Headset", title: "7/24 Canlı Destek", description: "Taşıma öncesinde, sırasında ve sonrasında bize her an ulaşabilirsiniz." },
  ];
  for (const [i, c] of whyUs.entries()) {
    const existing = await prisma.whyUsCard.findFirst({ where: { title: c.title } });
    if (!existing) await prisma.whyUsCard.create({ data: { ...c, order: i } });
  }

  // --- Process steps ------------------------------------------------
  const steps = [
    { icon: "ClipboardCheck", title: "Keşif ve Net Teklif", description: "Eşyalarınızı yerinde veya görüntülü keşifle değerlendirir, aynı gün net teklif sunarız." },
    { icon: "Boxes", title: "Planlama ve Paketleme", description: "Taşıma gününü birlikte belirler, tüm eşyaları profesyonel malzemelerle paketleriz." },
    { icon: "Truck", title: "Güvenli Taşıma", description: "Sigortalı araçlarımızla eşyalarınız yola çıkar; süreci anlık olarak takip edersiniz." },
    { icon: "PackageOpen", title: "Teslim ve Kurulum", description: "Eşyalarınızı yerleştirir, montajları tamamlar; evinizi yaşamaya hazır teslim ederiz." },
  ];
  for (const [i, s] of steps.entries()) {
    const existing = await prisma.processStep.findFirst({ where: { title: s.title } });
    if (!existing) await prisma.processStep.create({ data: { ...s, order: i } });
  }

  // --- FAQs -----------------------------------------------------------
  const faqs = [
    { question: "Nakliye fiyatı neye göre belirleniyor?", answer: "Fiyat; eşya miktarı, taşıma mesafesi, kat ve asansör durumu ile paketleme ihtiyacına göre belirlenir. Ücretsiz keşif sonrasında size sürpriz maliyet içermeyen net bir teklif sunarız." },
    { question: "Eşyalarım taşıma sırasında sigortalı mı?", answer: "Evet. Tüm taşımalarımız nakliyat sigortası kapsamındadır. Eşyalarınız araca yüklendiği andan teslim edildiği ana kadar güvence altındadır." },
    { question: "Paketleme malzemeleri ve işçilik fiyata dahil mi?", answer: "Evet. Koli, balonlu naylon, streç film ve battaniye gibi tüm paketleme malzemeleri ile söküm ve montaj işçiliği verdiğimiz teklife dahildir." },
    { question: "Şehirler arası taşınma kaç günde tamamlanır?", answer: "Mesafeye ve güzergâha bağlı olarak çoğu şehirler arası taşıma 1-3 gün içinde tamamlanır. Keşif sırasında size net bir teslim tarihi bildiririz." },
    { question: "Asansörlü taşıma hizmetiniz var mı?", answer: "Evet. Yüksek katlar ve dar merdivenler için mobil asansör sistemimizle eşyalarınızı hızlı ve hasarsız şekilde taşıyoruz." },
    { question: "Hafta sonu veya resmî tatillerde taşıma yapıyor musunuz?", answer: "Evet, haftanın 7 günü çalışıyoruz. Yoğun dönemler için taşıma tarihinizi birkaç gün önceden planlamanızı öneririz." },
  ];
  for (const [i, f] of faqs.entries()) {
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) await prisma.faq.create({ data: { ...f, order: i } });
  }

  // --- Testimonials -----------------------------------------------------
  const testimonials = [
    { name: "Ayşe K.", route: "İstanbul → Ankara", serviceSlug: "evden-eve-nakliye", text: "Tüm eşyalarım tek çizik olmadan geldi. Paketlemedeki özen gerçekten şaşırtıcıydı. İyi ki Egehan Lojistik'i seçmişiz." },
    { name: "Mehmet D.", route: "İzmir → Antalya", serviceSlug: "evden-eve-nakliye", text: "Sabah söz verdikleri saatte kapıdaydılar, akşam yeni evimizde kurulum bitmişti. Bu kadar hızlı olmasını beklemiyordum." },
    { name: "Zeynep A.", route: "İstanbul", serviceSlug: "ofis-tasima", text: "40 kişilik ofisimizi hafta sonu taşıdılar; pazartesi sabahı hiçbir şey olmamış gibi işbaşı yaptık. Tam anlamıyla kurumsal hizmet." },
    { name: "Hasan Y.", route: "Bursa → Eskişehir", serviceSlug: "parca-esya-tasima", text: "Sadece birkaç mobilya göndermem gerekiyordu; uygun fiyata, üstelik sigortalı şekilde ulaştırdılar. Süreç boyunca bilgilendirildim." },
    { name: "Elif S.", route: "Ankara → Trabzon", serviceSlug: "evden-eve-nakliye", text: "Şehirler arası taşınmak gözümde büyüyordu ama her aşamada yanımızda oldular. Annemin antika konsolu bile sapasağlam ulaştı." },
    { name: "Burak T.", route: "Gaziantep → İstanbul", serviceSlug: "parca-esya-tasima", text: "Fiyat konusunda en şeffaf firma. Keşifte söylenen rakam neyse ödediğim oydu. Gönül rahatlığıyla tavsiye ederim." },
  ];
  for (const [i, t] of testimonials.entries()) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, route: t.route } });
    if (existing) continue;
    const service = await prisma.service.findUnique({ where: { slug: t.serviceSlug } });
    await prisma.testimonial.create({
      data: {
        name: t.name,
        route: t.route,
        text: t.text,
        rating: 5,
        serviceId: service?.id,
        order: i,
      },
    });
  }

  // --- SEO meta for the home page ------------------------------------
  await prisma.seoMeta.upsert({
    where: { pageKey: "home" },
    create: {
      pageKey: "home",
      title: "Egehan Lojistik — 81 İlde Güvenli ve Profesyonel Taşımacılık",
      description:
        "Egehan Lojistik ile evden eve nakliyat, parça eşya taşıma ve ofis taşıma. Türkiye'nin 81 iline sigortalı, hızlı ve profesyonel nakliye hizmeti.",
      keywords: ["evden eve nakliyat", "nakliyat firması", "ofis taşıma", "parça eşya taşıma"],
      canonicalPath: "/",
    },
    update: {},
  });

  console.log("✔ Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
