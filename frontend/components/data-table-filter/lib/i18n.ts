import en from '../locales/en.json'
import ptBr from '../locales/pt-br.json'

export type Locale = 'en' | 'pt-br'

type Translations = Record<string, string>

const translations: Record<Locale, Translations> = {
  en,
  'pt-br': ptBr,
}

export function t(key: string, locale: Locale): string {
  return translations[locale][key] ?? key
}
