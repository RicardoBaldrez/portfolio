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
  /** estudo de caso no formato antigo (desafio, o que eu fiz, resultado) */
  challenge?: string;
  did: string[];
  result?: string;
  /** formato detalhado: contexto, onde atuei e destaques */
  context?: string;
  highlights?: { title: string; text: string }[];
}

export const projects: Project[] = [
  { title: 'App Crefisa', meta: 'GFT · Crefisa · 2025 — atual', color: '#FF2E88', cover: 'phone', badge: 'em desenvolvimento',
    summary: 'App bancário da Crefisa, em que atuei de ponta a ponta: transferências, Pix, cartões, conta e extrato, segurança e serviços como saque sem cartão e pagamento de boleto.',
    tags: ['Mobile', 'Fintech', 'Design System'],
    file: 'case-crefisa.md',
    context: 'App bancário mobile construído do zero, em monorepo React Native, para um público com muitos aposentados e pensionistas. Por isso, cada fluxo financeiro precisa ser simples, seguro e acessível.',
    did: [
      'Transferências: jornada completa de TED e TEF, da escolha do banco ao comprovante, com agendamento',
      'Pix: atuação no time de Pix e entrega do Pix Automático',
      'Cartões: detalhe do cartão, bloqueios, cartão virtual e troca de senha',
      'Conta e extrato: saldo, troca de conta e extrato com busca e filtros',
      'Acesso e segurança: código por SMS, senha, biometria e prova de vida',
      'Serviços: INSS, saque sem cartão, boleto, favorecidos, limites e encerramento de conta',
    ],
    highlights: [
      { title: 'TED e TEF', text: 'Os dois tinham fluxos e telas duplicados. Criei uma base única, em que cada tipo é definido por configuração (textos, tarifa, agendamento e comprovante): menos código repetido e regras novas entrando sem duplicar telas.' },
      { title: 'Cartões', text: 'Ajudei a construir a área praticamente do zero: detalhe do cartão, bloqueio temporário e definitivo com motivos de perda ou roubo, cartão virtual e troca de senha.' },
      { title: 'Pix', text: 'Atuei no time de Pix e entreguei o Pix Automático completo: aviso de autorizações pendentes, menu, lista de autorizações com abas e filtros, status e comprovante.' },
    ] },
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
