const app = 'El Kiosko Llanero';
const description = '';
const link = 'https://educatecancer.online';
const urlImage =
  'https://res.cloudinary.com/dsvy4oeqc/image/upload/v1674192461/educate-cancer/screenshot-index-lscc_kjhaay.png';
const typeImage = 'image/png';

module.exports = {
  settings: {
    robots: 'index, follow',
    disallow: '/dashboard', //  separate pages with commas
    color: '#FF9431',
    locale: 'es_CO',
    lang: 'es'
  },
  tags: {
    title: app,
    titleTemplate: `%s | ${app}`,
    description,
    rating: 'general',
    keywords: [],
    author: 'El Kiosko Llanero',
    publisher: app,
    language: 'spanish'
  },
  og: {
    type: 'website',
    siteName: app,
    url: link,
    title: app,
    description,
    image: {
      url: urlImage,
      width: 1280,
      height: 720,
      type: typeImage
    }
  },
  twitter: {
    creator: '@prjhonf',
    site: '@prjhonf',
    url: `https://twitter.com/prjhonf`
  }
};
