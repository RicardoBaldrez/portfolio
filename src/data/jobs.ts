export interface Review {
  /** cargo ou área de quem escreveu (o nome fica de fora) */
  role: string;
  /** sigla mostrada no avatar */
  ini: string;
  /** cor do avatar */
  c: string;
  /** onde o feedback foi dado */
  via: 'linkedin' | 'interno';
  /** empresa mostrada no rodapé do review */
  co: string;
  year: string;
  /** texto do feedback, um item por parágrafo */
  text: string[];
}

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
  /** feedbacks de quem trabalhou comigo ali */
  reviews?: Review[];
}

export const jobs: Job[] = [
  { co: 'GFT Technologies · Crefisa', logos: ['gft','crefisa'], when: 'jun 2025 — atual', role: 'Desenvolvedor React Native', c: 'var(--mag)', now: true,
    desc: 'O novo app do Banco Crefisa, que leva a experiência bancária completa para o celular, com fluxos financeiros pensados para serem simples, seguros e acessíveis a um público que inclui muitos aposentados e pensionistas.',
    tags: ['React Native', 'TypeScript', 'React Query', 'Redux', 'Monorepo', 'Jest', 'Design System'],
    reviews: [
      { role: 'Especialista Mobile', ini: 'EM', c: 'var(--mag)', via: 'interno', co: 'GFT · Crefisa', year: '2025', text: [
        'Ricardo entrou no projeto sem experiência com desenvolvimento mobile e aprendeu muito rapidamente a trabalhar com a tecnologia.',
        'Sua habilidade de aprendizado rápido foi extremamente importante para começar a fazer entregas com qualidade e relevantes para o projeto.',
        'Seu conhecimento técnico foi colocado em prática em diversos momentos, e sempre conseguiu se sair bem, agregando valor para as entregas do cliente.'
      ] },
      { role: 'Especialista Mobile', ini: 'EM', c: 'var(--cyan)', via: 'interno', co: 'GFT · Crefisa', year: '2025', text: [
        'Ricardo é sensacional como pessoa e como profissional, sabe estudar bem o projeto e enfrentar coisas novas com muita qualidade. Sempre preocupado em apoiar os outros.'
      ] }
    ] },
  { co: 'GFT Technologies · XP Inc.', logos: ['gft','xp'], when: 'jun 2024 — jun 2025', role: 'Front-End Developer', c: 'var(--cyan)',
    desc: 'Plataforma de investimentos da XP, onde o cliente acompanha a carteira, a evolução dos investimentos e se relaciona com o seu assessor.',
    tags: ['React', 'Zustand', 'React Query', 'Micro Frontends', 'React Hook Form', 'Zod', 'Jest'] },
  { co: 'Dasa', logos: ['dasa'], when: 'nov 2020 — dez 2023', role: 'Front-End Developer Pleno · Júnior', c: 'var(--lime)',
    desc: 'Sistemas usados nas unidades da Dasa para acompanhar o paciente da chegada até o fim do atendimento.',
    tags: ['React', 'Vue', 'Context API', 'Micro Frontends', 'Styled Components'] },
  { co: 'Locaweb', logos: ['locaweb'], when: 'set 2018 — jan 2020', role: 'Analista de Sistemas Júnior · Estagiário', c: 'var(--mag)',
    desc: 'A All In Marketing Cloud, plataforma da Locaweb que ajuda empresas a se comunicar com seus clientes por e-mail marketing, SMS e push, da criação das campanhas ao disparo e à análise dos resultados.',
    tags: ['JavaScript', 'PHP', 'Laravel', 'CSS'],
    reviews: [
      { role: 'Gestão de Produto', ini: 'PR', c: 'var(--lime)', via: 'linkedin', co: 'Locaweb', year: '2018', text: [
        'A experiência de trabalho com Ricardo e sua equipe foi excelente. Conseguimos identificar boas oportunidades de melhoria e desenvolvemos processos de muita consistência para o gerenciamento da equipe e dos nossos projetos. Fiquei particularmente impressionado com sua habilidade para lidar com os clientes mais difíceis – sem esforço. Além de ser uma pessoa ótima e confiável, que honra seus compromissos. Por isso, foi um prazer conhecê-lo em minha vida profissional.'
      ] }
    ] },
  { co: 'Início da carreira', when: 'jan 2018 — set 2018', role: 'Estagiário Front-End · Web', c: 'var(--cyan)',
    desc: 'Naville Brasil: aplicações web responsivas a partir de demandas de clientes. AtivGreen: templates de e-mail marketing para o Mercado Livre.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    reviews: [
      { role: 'Designer', ini: 'DS', c: '#A78BFA', via: 'linkedin', co: 'Naville Brasil', year: '2018', text: [
        'Ricardo, além de extremamente habilidoso com desenvolvimento front-end (domina muito CSS), é um profissional competente, honesto, comprometido e possui muito espírito de equipe, além de ser muito inteligente sempre encontrando soluções em tempo recorde e claro, sempre de forma inovadora. Interessado e apaixonado pelo que faz, demonstra isso por estar sempre comentando sobre algo que está a estudar naquele momento.',
        'Tenho orgulho de ter integrado a mesma equipe e projetos que Ricardo.'
      ] },
      { role: 'Dev Mobile', ini: 'MB', c: 'var(--cyan)', via: 'linkedin', co: 'Naville Brasil', year: '2018', text: [
        'Ricardo é um excelente profissional, tive a oportunidade de trabalhar junto com ele em diversos projetos e posso atestar seu profissionalismo, espírito de líder e capacidade de resolução de problemas. Sem dúvida um ótimo profissional com o qual espero voltar a poder trabalhar novamente.'
      ] }
    ] },
  { co: 'UNIPDS · Anhanguera', when: 'nov 2026 — nov 2027', role: 'Pós-graduação em Engenharia de IA Aplicada', c: '#A78BFA', edu: true, badge: 'em andamento',
    desc: 'Especialização em integrar IA às aplicações em produção: fundamentos de LLMs, APIs de IA generativa e Prompt Engineering, RAG, MCP, criação de agentes autônomos e arquitetura de sistemas com IA. Também cobre processamento de dados e fine-tuning, segurança e governança, e ferramentas de IA para UX, DevOps e gestão, fechando com um projeto integrador.',
    tags: ['LLMs', 'RAG', 'Prompt Engineering', 'MCP', 'Agentes de IA', 'Fine-tuning', 'IA generativa', 'Governança de IA'] },
  { co: 'Universidade Cruzeiro do Sul', when: '2017 — 2018', role: 'Análise e Desenvolvimento de Sistemas', c: '#A78BFA', edu: true,
    desc: 'Formação superior em Análise e Desenvolvimento de Sistemas.',
    tags: ['Formação'] }
];
