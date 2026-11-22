export interface Job {
  /** empresa (ou cliente) */
  co: string;
  when: string;
  role: string;
  /** cor do item na timeline */
  c: string;
  now?: boolean;
  edu?: boolean;
  badge?: string;
  logos?: string[];
  /** entregas, mostradas num bloco expansível */
  did?: string[];
  desc: string;
  tags: string[];
}

export const jobs: Job[] = [
  { co: 'GFT Technologies · Crefisa', logos: ['gft','crefisa'], when: 'jun 2025 — atual', role: 'Desenvolvedor React Native', c: 'var(--mag)', now: true,
    desc: 'O novo app do Banco Crefisa, que leva a experiência bancária completa para o celular, com fluxos financeiros pensados para serem simples, seguros e acessíveis a um público que inclui muitos aposentados e pensionistas.',
    tags: ['React Native', 'TypeScript', 'React Query', 'Redux', 'Monorepo', 'Jest', 'Design System'] },
  { co: 'GFT Technologies · XP Inc.', logos: ['gft','xp'], when: 'jun 2024 — jun 2025', role: 'Front-End Developer', c: 'var(--cyan)',
    desc: 'Plataforma de investimentos da XP, onde o cliente acompanha a carteira, a evolução dos investimentos e se relaciona com o seu assessor.',
    tags: ['React', 'Zustand', 'React Query', 'Micro Frontends', 'React Hook Form', 'Zod', 'Jest'] },
  { co: 'Dasa', logos: ['dasa'], when: 'nov 2020 — dez 2023', role: 'Front-End Developer Pleno · Júnior', c: 'var(--lime)',
    desc: 'Sistemas usados nas unidades da Dasa para acompanhar o paciente da chegada até o fim do atendimento.',
    tags: ['React', 'Vue', 'Context API', 'Micro Frontends', 'Styled Components'] },
  { co: 'Locaweb', logos: ['locaweb'], when: 'set 2018 — jan 2020', role: 'Analista de Sistemas Júnior · Estagiário', c: 'var(--mag)',
    desc: 'A All In Marketing Cloud, plataforma da Locaweb que ajuda empresas a se comunicar com seus clientes por e-mail marketing, SMS e push, da criação das campanhas ao disparo e à análise dos resultados.',
    tags: ['JavaScript', 'PHP', 'Laravel', 'CSS'] },
  { co: 'Início da carreira', when: 'jan 2018 — set 2018', role: 'Estagiário Front-End · Web', c: 'var(--cyan)',
    desc: 'Naville Brasil: aplicações web responsivas a partir de demandas de clientes. AtivGreen: templates de e-mail marketing para o Mercado Livre.',
    tags: ['HTML', 'CSS', 'JavaScript'] },
  { co: 'UNIPDS · Anhanguera', when: 'nov 2026 — nov 2027', role: 'Pós-graduação em Engenharia de IA Aplicada', c: '#A78BFA', edu: true, badge: 'em andamento',
    desc: 'Especialização em integrar IA às aplicações em produção: fundamentos de LLMs, APIs de IA generativa e Prompt Engineering, RAG, MCP, criação de agentes autônomos e arquitetura de sistemas com IA. Também cobre processamento de dados e fine-tuning, segurança e governança, e ferramentas de IA para UX, DevOps e gestão, fechando com um projeto integrador.',
    tags: ['LLMs', 'RAG', 'Prompt Engineering', 'MCP', 'Agentes de IA', 'Fine-tuning', 'IA generativa', 'Governança de IA'] },
  { co: 'Universidade Cruzeiro do Sul', when: '2017 — 2018', role: 'Análise e Desenvolvimento de Sistemas', c: '#A78BFA', edu: true,
    desc: 'Formação superior em Análise e Desenvolvimento de Sistemas.',
    tags: ['Formação'] }
];
