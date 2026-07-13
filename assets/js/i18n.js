/* Diccionario bilingüe ES/EN y utilidades de traducción. */

const I18N = {
  es: {
    'nav.home': 'Inicio',
    'nav.patterns': 'Patrones',
    'nav.videos': 'Videos',
    'nav.calculator': 'Calculadora',
    'nav.about': 'Sobre mí',
    'brand.tagline': 'Tejidos',

    'hero.title': 'Patrones y tutoriales de tejido, hechos con cariño',
    'hero.subtitle': 'Descarga gratis mis patrones, aprende con mis videos y teje conmigo. Todo pensado para que disfrutes cada puntada.',
    'hero.cta': 'Ver patrones',

    'home.featured': 'Patrones destacados',
    'home.featuredSub': 'Todos mis patrones son gratuitos',
    'home.videos': 'Últimos videos',
    'home.videosSub': 'Aprende paso a paso conmigo',
    'home.seeAll': 'Ver todos los patrones',
    'home.seeAllVideos': 'Ver todos los videos',

    'patterns.title': 'Patrones',
    'patterns.subtitle': 'Todos mis patrones son gratuitos. Elige uno, descárgalo y ¡a tejer!',
    'patterns.all': 'Todos',
    'patterns.empty': 'Pronto habrá patrones nuevos por aquí…',
    'patterns.free': 'Gratis',

    'diff.principiante': 'Principiante',
    'diff.intermedio': 'Intermedio',
    'diff.avanzado': 'Avanzado',

    'pattern.free': 'Gratis',
    'pattern.download': 'Descargar patrón (PDF)',
    'pattern.downloadEn': 'Download pattern in English (PDF)',
    'pattern.noPdf': 'El PDF de este patrón estará disponible muy pronto.',
    'pattern.back': '← Volver a patrones',
    'pattern.notFound': 'No encontramos ese patrón.',

    'videos.title': 'Videos',
    'videos.subtitle': 'Mis tutoriales y proyectos en YouTube. Haz clic para reproducir.',
    'videos.empty': 'Pronto subiré videos nuevos…',

    'calc.title': 'Calculadora de lana',
    'calc.subtitle': '¿Cuánta lana necesitas para tu próximo proyecto? Calcula una estimación en segundos.',
    'calc.garment': 'Prenda',
    'calc.size': 'Talla',
    'calc.weight': 'Grosor de la lana',
    'calc.skein': 'Metros por ovillo',
    'calc.button': 'Calcular',
    'calc.resultTitle': 'Necesitarás aproximadamente',
    'calc.meters': 'metros',
    'calc.skeins': 'ovillos de',
    'calc.note': 'Es una estimación referencial con un 10% de margen. La cantidad real depende de tu tensión, el punto y el modelo.',
    'calc.g.gorro': 'Gorro', 'calc.g.bufanda': 'Bufanda', 'calc.g.cuello': 'Cuello / Snood',
    'calc.g.chaleco': 'Chaleco', 'calc.g.sweater': 'Sweater', 'calc.g.cardigan': 'Cardigan',
    'calc.g.manta': 'Manta', 'calc.g.calcetines': 'Calcetines', 'calc.g.amigurumi': 'Amigurumi',
    'calc.s.bebe': 'Bebé', 'calc.s.nino': 'Niño/a', 'calc.s.s': 'Adulto S',
    'calc.s.m': 'Adulto M', 'calc.s.l': 'Adulto L', 'calc.s.xl': 'Adulto XL',
    'calc.w.fino': 'Fino (fingering)', 'calc.w.medio': 'Medio (DK / worsted)',
    'calc.w.grueso': 'Grueso (chunky)', 'calc.w.muygrueso': 'Muy grueso (super bulky)',

    'about.title': 'Sobre mí',
    'about.p1': '¡Hola! Soy la creadora de Lanissima Tejidos. Tejer es mi pasión y este sitio es mi manera de compartirla contigo.',
    'about.p2': 'Aquí encontrarás todos mis patrones de forma gratuita, junto con videos donde te muestro paso a paso cómo hacer cada proyecto. Mi objetivo es que más personas descubran lo lindo y relajante que es tejer.',
    'about.p3': 'Si tejes algo con uno de mis patrones, me encantaría verlo. ¡Etiquétame en redes sociales!',

    'newsletter.title': 'Boletín Lanissima',
    'newsletter.subtitle': 'Suscríbete y te avisaré cada vez que publique un patrón o video nuevo. Nada de spam, solo lana.',
    'newsletter.placeholder': 'Tu correo electrónico',
    'newsletter.button': 'Suscribirme',
    'newsletter.success': '¡Gracias por suscribirte! Te avisaré de las novedades.',
    'newsletter.invalid': 'Escribe un correo válido, por favor.',

    'footer.rights': 'Todos los patrones son gratuitos, para uso personal.',
    'footer.made': 'Hecho con amor y mucha lana',
  },

  en: {
    'nav.home': 'Home',
    'nav.patterns': 'Patterns',
    'nav.videos': 'Videos',
    'nav.calculator': 'Calculator',
    'nav.about': 'About me',
    'brand.tagline': 'Knits',

    'hero.title': 'Knitting patterns and tutorials, made with love',
    'hero.subtitle': 'Download my free patterns, learn with my videos and knit along with me. Everything made for you to enjoy every stitch.',
    'hero.cta': 'Browse patterns',

    'home.featured': 'Featured patterns',
    'home.featuredSub': 'All my patterns are free',
    'home.videos': 'Latest videos',
    'home.videosSub': 'Learn step by step with me',
    'home.seeAll': 'See all patterns',
    'home.seeAllVideos': 'See all videos',

    'patterns.title': 'Patterns',
    'patterns.subtitle': 'All my patterns are free. Pick one, download it and cast on!',
    'patterns.all': 'All',
    'patterns.empty': 'New patterns coming soon…',
    'patterns.free': 'Free',

    'diff.principiante': 'Beginner',
    'diff.intermedio': 'Intermediate',
    'diff.avanzado': 'Advanced',

    'pattern.free': 'Free',
    'pattern.download': 'Download pattern in Spanish (PDF)',
    'pattern.downloadEn': 'Download pattern (PDF)',
    'pattern.noPdf': 'The PDF for this pattern will be available very soon.',
    'pattern.back': '← Back to patterns',
    'pattern.notFound': 'We could not find that pattern.',

    'videos.title': 'Videos',
    'videos.subtitle': 'My tutorials and projects on YouTube. Click to play.',
    'videos.empty': 'New videos coming soon…',

    'calc.title': 'Yarn calculator',
    'calc.subtitle': 'How much yarn do you need for your next project? Get an estimate in seconds.',
    'calc.garment': 'Garment',
    'calc.size': 'Size',
    'calc.weight': 'Yarn weight',
    'calc.skein': 'Meters per skein',
    'calc.button': 'Calculate',
    'calc.resultTitle': 'You will need approximately',
    'calc.meters': 'meters',
    'calc.skeins': 'skeins of',
    'calc.note': 'This is a reference estimate with a 10% margin. The real amount depends on your gauge, stitch and design.',
    'calc.g.gorro': 'Hat', 'calc.g.bufanda': 'Scarf', 'calc.g.cuello': 'Cowl / Snood',
    'calc.g.chaleco': 'Vest', 'calc.g.sweater': 'Sweater', 'calc.g.cardigan': 'Cardigan',
    'calc.g.manta': 'Blanket', 'calc.g.calcetines': 'Socks', 'calc.g.amigurumi': 'Amigurumi',
    'calc.s.bebe': 'Baby', 'calc.s.nino': 'Kid', 'calc.s.s': 'Adult S',
    'calc.s.m': 'Adult M', 'calc.s.l': 'Adult L', 'calc.s.xl': 'Adult XL',
    'calc.w.fino': 'Fingering', 'calc.w.medio': 'DK / worsted',
    'calc.w.grueso': 'Chunky', 'calc.w.muygrueso': 'Super bulky',

    'about.title': 'About me',
    'about.p1': 'Hi! I am the creator of Lanissima Tejidos. Knitting is my passion and this site is my way of sharing it with you.',
    'about.p2': 'Here you will find all my patterns for free, together with videos where I show you step by step how to make each project. My goal is for more people to discover how lovely and relaxing knitting is.',
    'about.p3': 'If you knit something with one of my patterns I would love to see it — tag me on social media!',

    'newsletter.title': 'Lanissima newsletter',
    'newsletter.subtitle': 'Subscribe and I will let you know every time I publish a new pattern or video. No spam, just yarn.',
    'newsletter.placeholder': 'Your email address',
    'newsletter.button': 'Subscribe',
    'newsletter.success': 'Thanks for subscribing! I will keep you posted.',
    'newsletter.invalid': 'Please enter a valid email.',

    'footer.rights': 'All patterns are free, for personal use.',
    'footer.made': 'Made with love and lots of yarn',
  },
};

function getLang() {
  return localStorage.getItem('lanissima-lang') || 'es';
}

function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.es[key] || key;
}

/* Devuelve el campo localizado de un ítem de contenido: lf(item, 'title') → title_es / title_en */
function lf(item, field) {
  const lang = getLang();
  return item[field + '_' + lang] || item[field + '_es'] || item[field + '_en'] || '';
}

function setLang(lang) {
  localStorage.setItem('lanissima-lang', lang);
  document.documentElement.lang = lang;
  applyI18n();
  document.dispatchEvent(new CustomEvent('langchange'));
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('.lang-switch button').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === getLang());
  });
}
