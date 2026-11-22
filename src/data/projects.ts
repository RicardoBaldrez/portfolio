export interface Project {
  title: string;
  meta: string;
  badge?: string;
  summary: string;
  tags: string[];
  color: string;
  /** ilustração da capa do card */
  cover: 'phone' | 'chart' | 'flow' | 'mail';
  file: string;
  challenge: string;
  did: string[];
  result: string;
}

export const projects: Project[] = [
  { title: 'App Crefisa', meta: 'GFT · Crefisa · 2025 — atual', color: '#FF2E88', cover: 'phone', badge: 'em desenvolvimento',
    summary: 'Novo app bancário da Crefisa, com Pix, transferências, cartões, limites e serviços como INSS na palma da mão.',
    tags: ['Mobile', 'Fintech'],
    file: 'case-crefisa.md',
    challenge: 'Construir o app bancário mobile da Crefisa, com fluxos financeiros críticos, num projeto de escopo fechado e com qualidade desde o primeiro dia.',
    did: ['Pix, TED e TEF: fluxos de transferência, incluindo atuação no time de Pix', 'Gestão de cartões e limites transacionais', 'Home do app, INSS e outros serviços bancários', 'Design System, integração com APIs e testes unitários e de integração'],
    result: 'Fluxos financeiros críticos construídos sobre uma base de componentes padronizada, com mais estabilidade e menos falhas chegando à produção.' },
  { title: 'Plataforma de Investimentos XP', meta: 'GFT · XP Inc. · 2024 — 2025', color: '#22D3EE', cover: 'chart',
    summary: 'Onde os clientes da XP acompanham a carteira, evoluem seus investimentos e falam com seus assessores.',
    tags: ['Web', 'Investimentos'],
    file: 'case-xp.md',
    challenge: 'Evoluir uma plataforma crítica, usada por milhões de pessoas, com vários times trabalhando em paralelo.',
    did: ['Criei o Agendamento com Assessor, que simplificou o contato entre cliente e assessor', 'Criei a Troca de Assessor, com migração e gestão de carteiras de forma segura', 'Criei Campanhas e Recompensas, voltado a engajamento e fidelização', 'Atuei no dashboard, na carteira e na evolução dos investimentos, em Micro Frontends'],
    result: 'Fluxos de relacionamento mais simples para o cliente e mais autonomia entre os times.' },
  { title: 'Jornada do Paciente', meta: 'Dasa · 2020 — 2023', color: '#B6F43C', cover: 'flow',
    summary: 'Sistemas que acompanham o paciente da chegada à unidade até o fim do atendimento, em toda a rede de laboratórios e hospitais.',
    tags: ['Web', 'Saúde'],
    file: 'case-dasa.md',
    challenge: 'Sustentar e evoluir sistemas críticos para a operação diária das unidades de saúde.',
    did: ['Triagem, gestão de filas e atendimento ao paciente', 'Coleta de exames e monitoramento operacional', 'Gestão de unidades e novos microsserviços', 'Orientação técnica de estagiários e juniores'],
    result: 'A jornada do paciente acompanhada de ponta a ponta e um time mais forte em boas práticas.' },
  { title: 'All In Marketing Cloud', meta: 'Locaweb · 2018 — 2020', color: '#A78BFA', cover: 'mail',
    summary: 'Plataforma de marketing que leva campanhas por e-mail marketing tradicional ou comportamental, SMS e push.',
    tags: ['Web', 'SaaS', 'E-mail marketing'],
    file: 'case-locaweb.md',
    challenge: 'Manter estável e evoluir uma plataforma de campanhas usada por muitos clientes ao mesmo tempo.',
    did: ['Novas funcionalidades e correção de bugs', 'Evolução contínua do produto', 'Ferramenta interna para acompanhar os atendimentos do suporte'],
    result: 'Mais estabilidade, performance e qualidade na plataforma e no dia a dia do suporte.' }
];
