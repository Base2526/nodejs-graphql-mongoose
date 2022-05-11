import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from '../i18n/en';

const messages = {
    th: () => import('../i18n/th').then(messages => messages.default),
};

export default polyglotI18nProvider(locale => {
    console.log("polyglotI18nProvider :", locale)
    if (locale === 'th') {
        return messages[locale]();
    }

    // Always fallback on english
    return englishMessages;
}, 'en');
