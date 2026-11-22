/// <reference types="astro/client" />

/* funções e valores que os scripts compartilham pela window */
interface Window {
  RB_LANG?: 'pt' | 'en';
  RB_T?: (s: string) => string;
  RB_setLang?: (l: 'pt' | 'en') => void;
  RB_setMode?: (m: 'light' | 'dark') => void;
}
