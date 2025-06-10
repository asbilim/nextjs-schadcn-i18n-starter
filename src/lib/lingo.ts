export const loadDictionary = async (locale: string) => {
  switch (locale) {
    case 'es':
      return (await import('../../public/i18n/es.json')).default;
    case 'en':
    default:
      return (await import('../../public/i18n/en.json')).default;
  }
};
