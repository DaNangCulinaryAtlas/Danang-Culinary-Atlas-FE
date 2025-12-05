import path from 'path';

const config = {
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
  },
  ns: ['common'],
  defaultNS: 'common',
  localePath: path.resolve('./public/locales'),
  interpolation: {
    escapeValue: false, // React already escapes values
  },
};

export default config;
