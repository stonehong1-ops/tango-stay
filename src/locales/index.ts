import ko from './ko';
import en from './en';
import ja from './ja';
import zhCN from './zh-CN';
import zhTW from './zh-TW';
import es from './es';
import vi from './vi';
import it from './it';
import fr from './fr';
import tr from './tr';

export type Language = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW' | 'es' | 'vi' | 'it' | 'fr' | 'tr';

export const translations = {
  'ko': ko,
  'en': en,
  'ja': ja,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'es': es,
  'vi': vi,
  'it': it,
  'fr': fr,
  'tr': tr,
};

export type Translations = typeof translations;
