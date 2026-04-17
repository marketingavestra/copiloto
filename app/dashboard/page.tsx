'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '../dash.css';

/* ─────────────────────────────────────────── AGENTS DATA */
const AGENTS = [
  {
    id: 'leo', name: 'Leo', role: 'Agente Master · CEO',
    color: '#204080', bg: 'rgba(32,64,128,0.12)', border: 'rgba(32,64,128,0.25)',
    emoji: '🧠',
    description: 'Visão 360° da empresa. Estratégia, decisões e coordenação de todos os agentes.',
    suggestions: [
      'Qual é o status geral da empresa esta semana?',
      'Quais são as prioridades dos próximos 30 dias?',
      'Como estamos em relação às metas de R$30k/mês?',
      'Analisa o pipeline de vendas atual.',
    ],
    responses: { default: [
      'Entendido. Vou analisar a situação com base no CLAUDE.md e nas métricas atuais. Para dar uma resposta precisa, preciso que você informe: (1) os números mais recentes de leads e faturamento, e (2) qual é a decisão que precisa ser tomada. Posso então montar a análise estratégica completa.',
      'Como Agente Master, minha função é conectar os pontos entre todas as áreas. Baseado no contexto da Bonadio Cursos, recomendo priorizarmos o fechamento dos primeiros contratos V1 antes de escalar o tráfego. Isso vai gerar prova social e caixa para reinvestimento. Quer que eu detalhe o plano de ação?',
      'Visão geral da semana: marketing precisa de pauta aprovada, Victor tem 3 leads em negociação, Clara está configurando os onboardings. Minha recomendação: foque nos fechamentos — cada R$3k fechado esta semana muda o moral da equipe. O que quer que eu priorize agora?',
    ]},
  },
  {
    id: 'maya', name: 'Maya', role: 'CMO · Marketing & Conteúdo',
    color: '#6B21A8', bg: 'rgba(107,33,168,0.1)', border: 'rgba(107,33,168,0.25)',
    emoji: '✨',
    description: 'Copy, conteúdo, redes sociais, Meta Ads. Conversão acima de vaidade.',
    suggestions: [
      'Cria a pauta de conteúdo desta semana.',
      'Escreve um post para o perfil @wladmirbonadiofilho_adv.',
      'Quais são os pilares de conteúdo prioritários?',
      'Analisa a performance dos últimos posts.',
    ],
    responses: { default: [
      'Pauta da semana pronta: Segunda — case de rescisão trabalhista (prova social ICP01). Quarta — Reels bastidores do escritório (autoridade). Sexta — educativo sobre direito do consumidor (awareness). Stories diários: rotina + bastidores. Quer que eu escreva o roteiro de algum desses?',
      'Post para @wladmirbonadiofilho_adv:\n\n"Você sabia que demissão sem justa causa tem uma lista de direitos que muita empresa tenta não pagar?\n\nSérie: Direitos que você não pode deixar passar.\n\nSalva esse post 👇"\n\n[continua em carrossel com 7 slides]. Quer o roteiro completo dos slides?',
      'Para ICP01 (advogado sem marketing), o conteúdo que mais converte é: case real com resultado → educativo sobre direito → bastidores do escritório → depoimento de cliente. Vou montar o calendário semanal com essa sequência. Confirma?',
    ]},
  },
  {
    id: 'victor', name: 'Victor', role: 'CSO · Vendas & Pipeline',
    color: '#065F46', bg: 'rgba(6,95,70,0.1)', border: 'rgba(6,95,70,0.25)',
    emoji: '💼',
    description: 'Pipeline, qualificação de leads, propostas e fechamentos consultivos.',
    suggestions: [
      'Quais leads estão no pipeline agora?',
      'Monta uma proposta para um advogado trabalhista.',
      'Qual é o script de primeiro contato?',
      'Analisa os motivos de perda dos últimos leads.',
    ],
    responses: { default: [
      'Pipeline atual: Aguardando sua atualização dos leads. Para uma meta de R$30k, precisamos de: 20 leads novos/mês → 10 qualificados → 5 propostas → 3 fechamentos. Qual etapa está travando mais? Captação, qualificação ou fechamento?',
      'Proposta para advogado trabalhista (ICP01):\n\n✦ Diagnóstico do perfil atual\n✦ Estratégia de conteúdo por 30 dias\n✦ 12 posts/mês (roteiro + design)\n✦ Gestão do Instagram\n✦ Reunião mensal de resultados\n\nInvestimento: R$1.500/mês\n\nQuer que eu adicione os bônus e a garantia?',
      'Script de primeiro contato:\n\n"Oi [Nome], tudo bem? Vi seu perfil e percebi que você atua em [área]. Tenho ajudado advogados a atrair clientes qualificados pelo Instagram sem precisar virar criador de conteúdo. Faz sentido conversarmos sobre isso?"\n\nTaxa de resposta esperada: 15-25%. Quer as variações para follow-up 48h?',
    ]},
  },
  {
    id: 'clara', name: 'Clara', role: 'CCO · Atendimento & CS',
    color: '#92400E', bg: 'rgba(146,64,14,0.1)', border: 'rgba(146,64,14,0.25)',
    emoji: '🤝',
    description: 'Onboarding, suporte, satisfação de clientes e coleta de depoimentos.',
    suggestions: [
      'Como está o onboarding dos clientes ativos?',
      'Monta o checklist de onboarding para um novo cliente V1.',
      'Quando devo coletar depoimentos?',
      'Qual é o SLA de resposta para clientes?',
    ],
    responses: { default: [
      'SLA atual: resposta em até 2h no horário comercial. Para clientes V1: primeiro contato em 24h após assinatura, reunião de kickoff em até 3 dias. Precisa que eu monte o template de mensagem de boas-vindas?',
      'Checklist de Onboarding V1:\n\n✓ Contrato assinado e arquivado\n✓ Acesso ao grupo exclusivo criado\n✓ Reunião de kickoff agendada (máx. 72h)\n✓ Diagnóstico do perfil atual realizado\n✓ Primeiro mês de pauta aprovado\n✓ Primeiro post publicado\n✓ Feedback coletado no dia 15\n\nQuer que eu crie o template de mensagem para cada etapa?',
      'Momento ideal para depoimento: 30 dias após início e após qualquer conquista concreta. Formato recomendado: áudio de 30-60s pelo WhatsApp — maior naturalidade e taxa de conversão. Posso montar o roteiro?',
    ]},
  },
  {
    id: 'bruno', name: 'Bruno', role: 'COO · Operações & SOPs',
    color: '#1E3A5F', bg: 'rgba(30,58,95,0.1)', border: 'rgba(30,58,95,0.25)',
    emoji: '⚙️',
    description: 'SOPs, processos, templates jurídicos e automações internas.',
    suggestions: [
      'Cria um SOP para onboarding de novos clientes.',
      'Quais processos precisam virar automação?',
      'Lista os templates jurídicos disponíveis.',
      'Como estruturar o financeiro da empresa?',
    ],
    responses: { default: [
      'SOP #001 — Onboarding de Cliente V1:\n\nPasso 1: Receber assinatura do contrato\nPasso 2: Clara envia mensagem de boas-vindas (template A)\nPasso 3: Victor agenda reunião de kickoff em 72h\nPasso 4: Maya realiza diagnóstico de perfil\nPasso 5: Pauta do mês 1 aprovada pelo Wladmir\nPasso 6: Publicação do primeiro post\nPasso 7: Check-in no dia 15\n\nQuer que eu documente os scripts de cada passo?',
      'Processos que precisam virar automação imediata:\n\n1. Follow-up de leads (Victor) — 48h sem resposta → mensagem automática\n2. Coleta de depoimento (Clara) — 30 dias pós-contrato → lembrete\n3. Relatório semanal (Leo) — toda sexta às 17h → compilação automática\n4. Pauta de conteúdo (Maya) — toda segunda → template pré-preenchido\n\nQuer que eu priorize a implementação de algum?',
      'Regra operacional da Bonadio Cursos: toda tarefa repetida 2x vira SOP. Todo SOP executado 3x vira automação. Precisamos documentar: atendimento inicial, proposta comercial, onboarding e coleta de NPS. Por onde quer começar?',
    ]},
  },
];

/* ─────────────────────────────────────────── COURSES DATA */
const COURSES = [
  {
    id: 'posicionamento',
    title: 'Posicionamento Digital para Advogados',
    description: 'Como construir autoridade no Instagram e atrair clientes qualificados sem violar o Código de Ética da OAB.',
    thumb: 'https://img.youtube.com/vi/7yv_kIu7H8Q/hqdefault.jpg',
    progress: 65,
    lessons: 24,
    duration: '8h 30min',
    level: 'Intermediário',
    modules: [
      {
        id: 'm1', title: 'Fundamentos do Posicionamento', lessons: [
          { id: 'l1', title: 'Introdução: Por que o advogado precisa de posicionamento', duration: '12:30', done: true, videoId: 'Z91EukGPGSg' },
          { id: 'l2', title: 'Os 3 pilares da autoridade digital jurídica', duration: '18:45', done: true, videoId: 'Z91EukGPGSg' },
          { id: 'l3', title: 'Entendendo seu ICP: quem é o seu cliente ideal?', duration: '22:10', done: true, videoId: 'Z91EukGPGSg' },
          { id: 'l4', title: 'A diferença entre marketing jurídico e publicidade vedada', duration: '15:20', done: false, videoId: 'Z91EukGPGSg' },
        ]
      },
      {
        id: 'm2', title: 'Conteúdo que Converte', lessons: [
          { id: 'l5', title: 'Os 5 pilares de conteúdo para advogados', duration: '20:00', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l6', title: 'Como criar um case jurídico sem infringir a ética', duration: '17:30', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l7', title: 'Roteiro de Reels em 3 minutos: template prático', duration: '25:15', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l8', title: 'Stories que vendem: frequência e formato', duration: '14:50', done: false, videoId: 'Z91EukGPGSg' },
        ]
      },
      {
        id: 'm3', title: 'Captação e Conversão', lessons: [
          { id: 'l9', title: 'Do seguidor ao lead: a jornada do cliente digital', duration: '19:20', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l10', title: 'Bio do Instagram que converte: o checklist completo', duration: '11:45', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l11', title: 'WhatsApp como canal de vendas jurídico', duration: '23:00', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l12', title: 'Medindo resultados: métricas que importam', duration: '16:30', done: false, videoId: 'Z91EukGPGSg' },
        ]
      },
    ]
  },
  {
    id: 'peças',
    title: 'Peças Jurídicas com IA: Trabalhista',
    description: 'Domine o uso de inteligência artificial para redigir petições, contratos e pareceres em Direito do Trabalho com qualidade e agilidade.',
    thumb: 'https://img.youtube.com/vi/mI60u_YwQuQ/hqdefault.jpg',
    progress: 20,
    lessons: 18,
    duration: '6h 15min',
    level: 'Avançado',
    modules: [
      {
        id: 'm1', title: 'IA no Escritório Jurídico', lessons: [
          { id: 'l1', title: 'Ferramentas de IA para advogados: overview 2026', duration: '16:00', done: true, videoId: 'Z91EukGPGSg' },
          { id: 'l2', title: 'Limites éticos e responsabilidade do advogado', duration: '14:30', done: true, videoId: 'Z91EukGPGSg' },
          { id: 'l3', title: 'Configurando seu workflow de IA', duration: '20:45', done: false, videoId: 'Z91EukGPGSg' },
        ]
      },
      {
        id: 'm2', title: 'Petições com IA', lessons: [
          { id: 'l4', title: 'Reclamação Trabalhista: prompt-to-petição em 10 min', duration: '28:20', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l5', title: 'Defesa do Réu (Reclamada): estrutura e argumentação', duration: '24:15', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l6', title: 'Recursos: como usar IA para análise jurisprudencial', duration: '19:00', done: false, videoId: 'Z91EukGPGSg' },
        ]
      },
    ]
  },
  {
    id: 'vendas',
    title: 'Fechamento de Contratos de Alto Valor',
    description: 'Método de consultiva jurídica para fechar contratos de R$3.000/mês sem parecer vendedor e sem violar a ética da OAB.',
    thumb: 'https://img.youtube.com/vi/lJIrFagevic/hqdefault.jpg',
    progress: 0,
    lessons: 12,
    duration: '4h 20min',
    level: 'Iniciante',
    modules: [
      {
        id: 'm1', title: 'Mentalidade de Vendas Consultivas', lessons: [
          { id: 'l1', title: 'O advogado não vende: ele resolve problemas', duration: '13:00', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l2', title: 'Os 4 perfis de cliente e como abordá-los', duration: '21:30', done: false, videoId: 'Z91EukGPGSg' },
          { id: 'l3', title: 'Precificação: como chegar ao seu ticket ideal', duration: '18:45', done: false, videoId: 'Z91EukGPGSg' },
        ]
      },
    ]
  },
];

/* ─────────────────────────────────────────── DOCUMENTS DATA */
interface DocPage { title: string; content: string; }
interface DocItem { id: string; title: string; category: string; icon: string; size: string; date: string; type: string; pages: DocPage[]; }

const DOCUMENTS: DocItem[] = [
  {
    id: 'd1', title: 'Contrato de Prestação de Serviços Jurídicos', category: 'Contratos', icon: '📄', size: '45 KB', date: '2026-04-01', type: 'DOCX',
    pages: [
      { title: 'Página 1 — Partes e Objeto', content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS JURÍDICOS

Pelo presente instrumento particular, as partes abaixo qualificadas celebram o presente Contrato de Prestação de Serviços Jurídicos, que se regerá pelas cláusulas e condições seguintes:

CONTRATANTE:
Nome: ___________________________________
CPF/CNPJ: _______________________________
Endereço: ________________________________
E-mail: __________________________________
Telefone: ________________________________

CONTRATADO:
Dr. Wladmir Bonadio Filho
Advogado — OAB/SP nº 398.640
Endereço profissional: ______________________
E-mail: wladmir@bonadiocursos.com.br

CLÁUSULA 1ª — DO OBJETO
O CONTRATADO obriga-se a prestar ao CONTRATANTE os seguintes serviços de natureza jurídica:

1.1. Assessoria jurídica mensal nas áreas de Direito do Trabalho, Direito Civil, Direito do Consumidor, Direito Previdenciário e Direito de Família.

1.2. Análise e elaboração de documentos jurídicos relacionados às demandas do CONTRATANTE.

1.3. Representação judicial e extrajudicial nos processos discriminados no Anexo I deste contrato.

1.4. Consultoria preventiva para evitar litígios futuros.` },
      { title: 'Página 2 — Honorários e Vigência', content: `CLÁUSULA 2ª — DOS HONORÁRIOS
2.1. Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO os honorários mensais no valor de R$ __________ (____________ reais).

2.2. O pagamento deverá ser efetuado até o dia ___ de cada mês, via PIX, transferência bancária ou boleto bancário, conforme dados fornecidos pelo CONTRATADO.

2.3. O atraso no pagamento implicará multa de 2% (dois por cento) sobre o valor devido, acrescida de juros de mora de 1% (um por cento) ao mês.

2.4. Em caso de demandas não abrangidas pela assessoria mensal, os honorários serão objeto de proposta específica.

CLÁUSULA 3ª — DA VIGÊNCIA
3.1. O presente contrato terá vigência de 12 (doze) meses, a partir da data de sua assinatura, renovando-se automaticamente por igual período, salvo manifestação contrária de qualquer das partes com antecedência mínima de 30 (trinta) dias.

CLÁUSULA 4ª — DO SIGILO PROFISSIONAL
4.1. O CONTRATADO obriga-se a manter absoluto sigilo sobre todas as informações e documentos a que tiver acesso em razão deste contrato, nos termos do Código de Ética e Disciplina da OAB.

CLÁUSULA 5ª — DO FORO
5.1. As partes elegem o foro da Comarca de ______________ para dirimir quaisquer dúvidas ou litígios decorrentes deste contrato.

Local e data: _____________, ___ de __________ de 2026.

________________________          ________________________
CONTRATANTE                                    CONTRATADO
                                                          Dr. Wladmir Bonadio Filho
                                                          OAB/SP nº 398.640` },
    ],
  },
  {
    id: 'd2', title: 'Modelo de Procuração Ad Judicia', category: 'Contratos', icon: '📄', size: '22 KB', date: '2026-04-01', type: 'DOCX',
    pages: [
      { title: 'Página 1 — Procuração', content: `PROCURAÇÃO AD JUDICIA ET EXTRA

OUTORGANTE: _________________________________, [nacionalidade], [estado civil], [profissão], portador(a) do RG nº _____________ e CPF nº _________________, residente e domiciliado(a) na [endereço completo], CEP: _____________.

OUTORGADO: Dr. WLADMIR BONADIO FILHO, Advogado, inscrito na Ordem dos Advogados do Brasil, Seccional de São Paulo, sob o nº 398.640, com escritório profissional na [endereço do escritório], CEP: _____________.

PODERES: Por este instrumento e na melhor forma de direito, o(a) OUTORGANTE nomeia e constitui seu bastante procurador o(a) OUTORGADO(A) acima qualificado(a), a quem confere amplos poderes para o foro em geral, em qualquer Juízo, Instância ou Tribunal, podendo propor contra quem de direito as ações competentes e defender-se das que forem propostas contra o(a) outorgante, seguindo-as até final decisão; usar de todos os recursos legais e acompanhá-los; confessar, desistir, transigir, firmar compromissos ou acordos, receber e dar quitação, agindo em conjunto ou separadamente, com poderes especiais para: receber citação inicial, confessar, reconhecer a procedência do pedido, transigir, desistir, renunciar ao direito sobre o qual se funda a ação, receber e dar quitação.

Poderes específicos para: [descrever a demanda específica]

_______________, ___ de _____________ de 2026.

________________________
[Nome do Outorgante]
CPF: ___________________` },
    ],
  },
  {
    id: 'd3', title: 'Reclamação Trabalhista — Template Completo', category: 'Petições', icon: '⚖️', size: '68 KB', date: '2026-03-20', type: 'DOCX',
    pages: [
      { title: 'Página 1 — Qualificação e Fatos', content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DO TRABALHO DA ___ VARA DO TRABALHO DE _______________ — ESTADO DE SÃO PAULO

[NOME DO RECLAMANTE], [nacionalidade], [estado civil], [profissão], portador do RG nº _________ e CPF nº _________________, residente e domiciliado na [endereço], CEP: __________, por meio de seu advogado que esta subscreve (instrumento de mandato em anexo), vem, respeitosamente, perante Vossa Excelência, propor a presente

RECLAMAÇÃO TRABALHISTA COM PEDIDO DE TUTELA DE URGÊNCIA

em face de [NOME DA RECLAMADA], pessoa jurídica de direito privado, inscrita no CNPJ nº __________________, com sede na [endereço], pelos fatos e fundamentos jurídicos a seguir expostos:

I — DOS FATOS

1.1. O Reclamante foi admitido pela Reclamada em __/__/____, para exercer a função de _________________, mediante remuneração mensal de R$ ______________.

1.2. Durante toda a vigência do contrato de trabalho, o Reclamante sempre cumpriu suas obrigações com dedicação e profissionalismo.

1.3. Em __/__/____, o Reclamante foi dispensado sem justa causa, sem receber as verbas rescisórias legalmente devidas, quais sejam: saldo de salário, aviso prévio, 13º salário proporcional, férias proporcionais + 1/3, multa de 40% do FGTS e seguro desemprego.` },
      { title: 'Página 2 — Pedidos', content: `II — DO DIREITO

2.1. A Constituição Federal, em seu artigo 7º, garante ao trabalhador o recebimento de todas as verbas rescisórias quando dispensado sem justa causa.

2.2. A Consolidação das Leis do Trabalho — CLT, em seus artigos 477 e seguintes, estabelece o prazo e a forma de pagamento das verbas rescisórias.

2.3. O não pagamento das verbas rescisórias no prazo legal enseja a aplicação da multa prevista no artigo 477, §8º, da CLT.

III — DOS PEDIDOS

Ante o exposto, requer o Reclamante:

a) O pagamento de saldo de salário: R$ __________
b) Aviso prévio indenizado (__ dias): R$ __________
c) 13º salário proporcional: R$ __________
d) Férias proporcionais + 1/3: R$ __________
e) Multa de 40% do FGTS: R$ __________
f) Multa do art. 477, §8º, CLT: R$ __________
g) Liberação das guias do seguro-desemprego
h) Baixa na CTPS
i) Honorários advocatícios de 15% sobre o valor da condenação

TOTAL ESTIMADO: R$ __________

Dá-se à causa o valor de R$ __________ (____________ reais).

Termos em que pede deferimento.

_______________, ___ de _____________ de 2026.

________________________
Dr. Wladmir Bonadio Filho
OAB/SP nº 398.640` },
    ],
  },
  {
    id: 'd4', title: 'Contestação em Ação Trabalhista', category: 'Petições', icon: '⚖️', size: '54 KB', date: '2026-03-20', type: 'DOCX',
    pages: [
      { title: 'Página 1 — Contestação', content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DO TRABALHO

Processo nº: ___________________________

[NOME DA RECLAMADA], já qualificada nos autos, por seu advogado que esta subscreve, vem, tempestivamente e com o devido respeito, apresentar

CONTESTAÇÃO

aos termos da reclamação trabalhista proposta por [NOME DO RECLAMANTE], pelos fatos e fundamentos a seguir expostos:

PRELIMINAR — DA PRESCRIÇÃO BIENAL
Verifica-se que parte dos pedidos formulados na inicial refere-se a período anterior a 2 (dois) anos contados do ajuizamento da presente ação. Assim, requer-se o reconhecimento da prescrição bienal, nos termos do artigo 7º, XXIX, da Constituição Federal.

I — DA IMPUGNAÇÃO DOS FATOS

1.1. Nega-se, categoricamente, que o Reclamante tenha laborado em condições diversas das estabelecidas no contrato de trabalho.

1.2. Todos os valores devidos ao Reclamante foram pagos rigorosamente em dia, conforme demonstram os recibos de pagamento em anexo.

1.3. A rescisão contratual ocorreu de forma regular, tendo sido quitadas todas as verbas rescisórias pertinentes, conforme TRCT devidamente assinado pelo Reclamante.` },
    ],
  },
  {
    id: 'd5', title: 'Checklist de Onboarding de Cliente V1', category: 'Operações', icon: '✅', size: '18 KB', date: '2026-04-10', type: 'PDF',
    pages: [
      { title: 'Checklist de Onboarding — Cliente V1', content: `CHECKLIST DE ONBOARDING — CLIENTE V1
Bonadio Cursos · Advocacia & Educação Jurídica
Responsável: Clara (Agente de Atendimento)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ETAPA 1 — CONTRATO E DOCUMENTAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐  Contrato assinado digitalmente recebido
☐  Cópia do contrato arquivada no sistema
☐  Procuração assinada e digitalizada
☐  Dados cadastrais do cliente inseridos no CRM
☐  Primeiro pagamento confirmado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ETAPA 2 — BOAS-VINDAS (até 24h após assinatura)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐  Mensagem de boas-vindas enviada via WhatsApp (template A)
☐  E-mail de boas-vindas enviado com cópia do contrato
☐  Reunião de kickoff agendada (máx. 72h)
☐  Acesso ao grupo exclusivo de clientes criado e enviado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ETAPA 3 — KICKOFF (até 72h após assinatura)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐  Reunião de kickoff realizada
☐  Diagnóstico do perfil atual do Instagram realizado (Maya)
☐  Dores e objetivos do cliente documentados no CRM
☐  Expectativas alinhadas e acordadas
☐  Primeiro mês de pauta apresentado e aprovado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ETAPA 4 — PRIMEIROS 15 DIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐  Primeiro post publicado
☐  Check-in de 15 dias realizado
☐  Feedback coletado e registrado
☐  Ajustes de pauta aplicados se necessário
☐  NPS coletado (escala 0-10)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ETAPA 5 — FIM DO PRIMEIRO MÊS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐  Relatório do mês 1 entregue
☐  Renovação ou ajuste de escopo discutido
☐  Depoimento solicitado (se NPS ≥ 8)
☐  Próximo mês de pauta aprovado` },
    ],
  },
  {
    id: 'd6', title: 'SOP #001 — Atendimento Inicial de Lead', category: 'Operações', icon: '📋', size: '30 KB', date: '2026-04-10', type: 'PDF',
    pages: [
      { title: 'SOP #001 — Atendimento Inicial de Lead', content: `SOP #001 — ATENDIMENTO INICIAL DE LEAD
Bonadio Cursos · Versão 1.0 · Criado em: Abril/2026
Responsável: Victor (Vendas) + Clara (Atendimento)

OBJETIVO
Garantir que 100% dos leads que entram em contato recebam resposta em até 2h no horário comercial e sejam corretamente qualificados antes de qualquer proposta.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GATILHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lead envia mensagem pelo Instagram DM, WhatsApp ou formulário do site.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASSO 1 — PRIMEIRO CONTATO (Victor · máx. 2h)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1.1. Responder com o Script de Primeiro Contato (ver Scripts de Vendas).
1.2. Identificar a origem do lead (qual post, anúncio ou indicação).
1.3. Registrar o lead no CRM com status: "Lead Novo".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASSO 2 — QUALIFICAÇÃO (Victor · mesma conversa)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verificar os 4 critérios de qualificação:

✓ ÁREA: Atua em área que o Dr. Wladmir atende?
  (Trabalhista, Civil, Consumidor, Previdenciário, Empresarial, Família)
  Se não → encerrar com indicação educada. Registrar como "Não Qualificado".

✓ PERFIL: É ICP01 (cliente jurídico) ou ICP02 (advogado que quer escalar)?

✓ DOR: Consegue identificar a dor principal do lead?

✓ ORÇAMENTO: Tem compatibilidade com o ticket mínimo?
  ICP01: a partir de R$1.500/mês | ICP02: a partir de R$3.000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASSO 3 — AGENDAMENTO (se qualificado)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3.1. Oferecer horário de conversa de 20-30 min.
3.2. Atualizar CRM: "Qualificado — Reunião Agendada".
3.3. Enviar lembrete 1h antes da reunião.

PRAZO MÁXIMO: 48h entre primeiro contato e reunião.` },
    ],
  },
  {
    id: 'd7', title: 'Planilha DRE Mensal — Template', category: 'Financeiro', icon: '📊', size: '85 KB', date: '2026-04-01', type: 'XLSX',
    pages: [
      { title: 'DRE Mensal — Template', content: `DEMONSTRATIVO DE RESULTADO DO EXERCÍCIO (DRE)
Bonadio Cursos · Dr. Wladmir Bonadio Filho
Mês de Referência: ________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECEITAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VERTENTE 1 — ADVOCACIA (Cliente Direto)
  Contratos recorrentes ativos:       _______ clientes
  Ticket médio:                        R$ _______
  Receita recorrente (MRR):            R$ _______
  Honorários de êxito:                 R$ _______
  Novos contratos no mês:              R$ _______
  SUBTOTAL V1:                         R$ _______

VERTENTE 2 — EDUCAÇÃO JURÍDICA
  Mentorias individuais:               R$ _______
  Produto digital (vendas):            R$ _______
  Comunidade paga (recorrência):       R$ _______
  SUBTOTAL V2:                         R$ _______

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECEITA BRUTA TOTAL:                   R$ _______
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOS E DESPESAS
  Ferramentas e SaaS:                  R$ _______
  Tráfego pago (Meta Ads):             R$ _______
  Freelancers / terceiros:             R$ _______
  Escritório e infraestrutura:         R$ _______
  Impostos (Simples Nacional):         R$ _______
  Outros:                              R$ _______

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESPESAS TOTAIS:                       R$ _______
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LUCRO LÍQUIDO:                         R$ _______
MARGEM LÍQUIDA:                        _______ %

META DO MÊS:                           R$ 30.000
REALIZADO:                             R$ _______
ATINGIMENTO:                           _______ %` },
    ],
  },
  {
    id: 'd8', title: 'Proposta Comercial V1 — Template', category: 'Vendas', icon: '💰', size: '40 KB', date: '2026-04-05', type: 'PDF',
    pages: [
      { title: 'Proposta Comercial — Posicionamento Digital', content: `PROPOSTA DE POSICIONAMENTO DIGITAL JURÍDICO
Bonadio Cursos · Dr. Wladmir Bonadio Filho · OAB/SP 398.640

Preparada especialmente para: ______________________
Data: ____ / ____ / 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A SITUAÇÃO QUE IDENTIFICAMOS NO SEU PERFIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Você tem conhecimento técnico de qualidade, mas:
→ Poucos seguidores engajados no Instagram
→ Conteúdo irregular ou sem estratégia definida
→ Clientes chegando por indicação (imprevisível)
→ Incerteza sobre o que pode ou não publicar (OAB)

Isso está custando contratos que deveriam ser seus.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
O QUE ENTREGAMOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✦ DIAGNÓSTICO COMPLETO DO PERFIL (1x na contratação)
  Análise do Instagram atual, ICP, posicionamento e gaps

✦ ESTRATÉGIA DE CONTEÚDO MENSAL
  Calendário editorial com 20+ conteúdos por mês
  Alinhado com o Código de Ética da OAB

✦ PRODUÇÃO DE CONTEÚDO (12 posts/mês)
  Roteiro escrito + design entregue pronto
  Você só precisa gravar e revisar

✦ GESTÃO E PUBLICAÇÃO
  Agendamento, hashtags e otimização de horário

✦ REUNIÃO MENSAL DE RESULTADOS
  Análise de métricas + planejamento do próximo mês

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVESTIMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

R$ 1.500/mês  (contrato mínimo de 3 meses)

Início em até 5 dias úteis após assinatura do contrato.
Garantia: se em 60 dias você não perceber resultado,
devolvemos o valor do último mês, sem burocracia.` },
    ],
  },
  {
    id: 'd9', title: 'Script de Primeiro Contato — WhatsApp', category: 'Vendas', icon: '💬', size: '15 KB', date: '2026-04-05', type: 'PDF',
    pages: [
      { title: 'Scripts de Vendas — WhatsApp', content: `SCRIPTS DE VENDAS — PRIMEIRO CONTATO WHATSAPP
Bonadio Cursos · Agente Victor · Versão 1.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 1 — LEAD QUE VEIO DO INSTAGRAM (ICP01)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Olá, [Nome]! Aqui é o assistente do Dr. Wladmir 😊

Vi que você entrou em contato pelo perfil dele. Para eu conseguir te passar as informações certas, me conta rapidinho: você está buscando assessoria jurídica para um caso específico ou está interessado(a) no serviço mensal de posicionamento digital?"

[Se caso específico → Script 1B]
[Se posicionamento → Script 1C]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 1B — CASO ESPECÍFICO (ICP01 jurídico)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Entendi! O Dr. Wladmir atua em: Trabalhista, Civil, Consumidor, Previdenciário, Empresarial e Família.

Qual é a área do seu caso? Assim já verifico a disponibilidade dele para uma conversa."

[Qualificar a área → se fora das áreas: indicar educadamente]
[Se dentro → agendar consulta inicial]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 2 — FOLLOW-UP 48H SEM RESPOSTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Olá, [Nome]! Passando para verificar se você teve a chance de ver nossa mensagem anterior 🙂

Sei que a rotina é corrida. Se quiser, posso te enviar um resumo rápido do que oferecemos para você avaliar com calma. Faz sentido?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT 3 — OBJEÇÃO "PRECISO PENSAR"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Claro, faz todo sentido! É uma decisão importante.

Só quero garantir que você tem todas as informações para decidir. Tem alguma dúvida específica sobre o serviço que eu possa esclarecer agora?"

[Ouvir a objeção real e responder com benefício específico]` },
    ],
  },
  {
    id: 'd10', title: 'Calendário Editorial — Template Mensal', category: 'Marketing', icon: '📅', size: '25 KB', date: '2026-04-08', type: 'XLSX',
    pages: [
      { title: 'Calendário Editorial — Maio/2026', content: `CALENDÁRIO EDITORIAL MENSAL
Bonadio Cursos · Perfis: @wladmirbonadiofilho_adv + @wbonadiofilho
Mês: MAIO / 2026 · Responsável: Maya

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEMANA 1 (05 – 09/05)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEG 05 · @adv  · Carrossel  · Pilar: Case Jurídico
         "5 direitos que toda rescisão sem justa causa deve incluir"
         CTA: "Salva e compartilha"

QUA 07 · @adv  · Reels 60s  · Pilar: Educativo
         "O que acontece se a empresa não pagar o aviso prévio?"
         CTA: "Comenta SIM se isso aconteceu com você"

QUI 08 · @wbo  · Carrossel  · Pilar: Bastidores
         "Como eu estruturo meu dia para ter tempo para conteúdo"
         CTA: "Me conta como é sua rotina"

SEX 09 · @adv  · Foto/Post  · Pilar: Autoridade Técnica
         "Citação com insight sobre Direito do Trabalho"
         CTA: "Salva para consultar depois"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEMANA 2 (12 – 16/05)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEG 12 · @adv  · Reels 90s  · Pilar: Case Jurídico
         "Case: cliente que perdeu 60% dos direitos por falta de prova"
         CTA: "Agende uma consulta preventiva"

QUA 14 · @wbo  · Carrossel  · Pilar: Educação para Advogados
         "Por que advogados com 3k seguidores faturam mais que os com 30k"
         CTA: "Comenta se quiser entender a estratégia"

SEX 16 · @adv  · Stories    · Pilar: Prova Social
         Depoimento de cliente (formato: print ou áudio)` },
    ],
  },
  {
    id: 'd11', title: 'Copy Framework — Regras de Persuasão', category: 'Marketing', icon: '✍️', size: '35 KB', date: '2026-04-08', type: 'PDF',
    pages: [
      { title: 'Copy Framework — Página 1', content: `COPY FRAMEWORK — Bonadio Cursos
Regras de Persuasão e Comunicação
Versão 1.0 · Criado por: Leo + Maya

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRINCÍPIO #1 — NÚMEROS ESPECÍFICOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NUNCA use: "muitos clientes", "ótimos resultados", "grande crescimento"
SEMPRE use: "23 contratos fechados", "R$47.000 em honorários", "312% de crescimento"

Números específicos = credibilidade. Arredondamentos parecem inventados.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRINCÍPIO #2 — FILTRO DE ELEGIBILIDADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Toda comunicação de oferta deve começar eliminando quem NÃO é o público.

Exemplo:
❌ "Para qualquer advogado que queira crescer"
✅ "Para advogados com 2 a 10 anos de OAB que faturam entre R$5k e R$15k
    e sentiram o teto do modelo hora × dinheiro"

Filtrar aumenta conversão porque quem passa pelo filtro se sente visto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRINCÍPIO #3 — MECANISMO ÚNICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
O que faz sua solução funcionar de forma diferente de tudo que o cliente já tentou?

Para o Dr. Wladmir:
"Não é mais conteúdo — é o Sistema de Autoridade Jurídica: uma sequência específica de conteúdos que posiciona o advogado como referência antes mesmo de falar em preço."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PALAVRAS PROIBIDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✗ "talvez"         ✗ "pode ser"       ✗ "normalmente"
✗ "tentar"         ✗ "depende"        ✗ "a maioria"
✗ "geralmente"     ✗ "costuma"        ✗ "provavelmente"

Essas palavras destroem confiança. Use linguagem afirmativa e direta.` },
      { title: 'Copy Framework — Página 2', content: `COPY FRAMEWORK — Bonadio Cursos
Estrutura de Página de Vendas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUTURA PADRÃO DE PÁGINA DE VENDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

01. FILTRO DE ELEGIBILIDADE
    "Esta página é para você se..."

02. HEADLINE PRINCIPAL
    Benefício maior + prazo + sem o custo temido
    Modelo: "Como [resultado desejado] em [prazo] sem [objeção principal]"

03. CTA #1 (acima da dobra)
    Botão direto: "Quero começar" / "Agendar conversa"

04. MÉTRICAS DE CREDIBILIDADE
    Números reais: clientes atendidos, anos de OAB, casos ganhos

05. COMO FUNCIONA (3 passos simples)
    Simplifica o processo e reduz o medo de comprar

06. AGITAÇÃO DO PROBLEMA
    Descreve a dor com tanta precisão que o cliente pensa:
    "Parece que ele está falando de mim"

07. MECANISMO ÚNICO
    Por que isso funciona quando outras coisas não funcionaram

08. PROVA SOCIAL
    3-5 depoimentos reais, específicos, com resultado mensurável

09. CTA #2

10. APRESENTAÇÃO DA OFERTA (o que está incluído)

11. STACK DE BÔNUS (valor percebido total)

12. REVEAL DE PREÇO (após construir valor)

13. CTA #3

14. GARANTIA (reduz risco da decisão)

15. BIO DE AUTORIDADE (quem é o Dr. Wladmir)

16. CTA #4 — FINAL (urgência ou escassez real)` },
    ],
  },
  {
    id: 'd12', title: 'Design System Bonadio Cursos — Guia Visual', category: 'Marketing', icon: '🎨', size: '2.1 MB', date: '2026-04-01', type: 'PDF',
    pages: [
      { title: 'Design System — Identidade Visual', content: `DESIGN SYSTEM Bonadio Cursos
Guia de Identidade Visual · Versão 1.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PALETA DE CORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AZUIS PRIMÁRIOS
  ████  #204080  Azul Institucional (títulos, CTAs, elementos de autoridade)
  ████  #306090  Azul Médio (backgrounds de seções, bordas)
  ████  #5070B0  Azul Accent (links, destaques, ícones ativos)
  ████  #6090C0  Azul Claro (hover states, elementos secundários)
  ████  #90C0E0  Azul Suave (backgrounds sutis, tags)

NEUTROS
  ████  #F0F0F0  Cinza Claro (backgrounds de seção)
  ████  #E0E0D0  Off-White (backgrounds elegantes)
  ████  #B0C0D0  Cinza Azulado (textos secundários, bordas)
  ████  #1a2a3a  Quase Preto (texto principal)
  ████  #FFFFFF  Branco (fundos limpos, texto em fundo escuro)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIPOGRAFIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TÍTULOS: DM Sans / Playfair Display
  Peso: 700-900 · Tracking: -0.5px
  Uso: Headlines, nomes de seções, CTAs

CORPO: Inter / DM Sans
  Peso: 400-600 · Line-height: 1.6
  Uso: Parágrafos, labels, descrições

DESTAQUE: DM Sans caps + azul #5070B0
  Uso: Tags, badges, categorias

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOM VISUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Premium e sóbrio — sem cores vibrantes ou neón
✓ Espaço em branco generoso — respiro é luxo
✓ Fotos profissionais do Dr. Wladmir — rosto humano converte
✓ Ícones minimalistas — menos é mais
✗ NÃO usar: fontes decorativas informais
✗ NÃO usar: gradientes chamativos (apenas azul→azul)
✗ NÃO usar: stock photos genéricas` },
    ],
  },
];

const DOC_CATEGORIES = ['Todos', 'Contratos', 'Petições', 'Operações', 'Financeiro', 'Vendas', 'Marketing'];

/* ─────────────────────────────────────────── TYPES */
interface Message { role: 'user' | 'agent'; content: string; timestamp: Date; }
type ChatHistory = Record<string, Message[]>;
type Section = 'agents' | 'courses' | 'documents';

/* ─────────────────────────────────────────── COMPONENT */
export default function DashboardPage() {
  const router = useRouter();
  const [section, setSection] = useState<Section>('agents');

  // Auth
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('av_auth') !== '1') {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => { localStorage.removeItem('av_auth'); router.push('/login'); };

  return (
    <div className="dash-layout">
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <div className="dash-logo">
            <span className="dash-logo-text">Bonadio Cursos</span>
            <span className="dash-logo-badge">Pro</span>
          </div>
        </div>

        {/* NAV SECTIONS */}
        <nav className="dash-sections-nav">
          <button className={`dash-section-btn${section === 'agents' ? ' active' : ''}`} onClick={() => setSection('agents')}>
            <span>🤖</span> Agentes
          </button>
          <button className={`dash-section-btn${section === 'courses' ? ' active' : ''}`} onClick={() => setSection('courses')}>
            <span>🎓</span> Cursos
          </button>
          <button className={`dash-section-btn${section === 'documents' ? ' active' : ''}`} onClick={() => setSection('documents')}>
            <span>📁</span> Documentos
          </button>
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user-info">
            <div className="dash-user-avatar">W</div>
            <div className="dash-user-text">
              <span className="dash-user-name">Dr. Wladmir</span>
              <span className="dash-user-email">teste@teste.com</span>
            </div>
          </div>
          <button className="dash-logout-btn" onClick={handleLogout} title="Sair">⏏</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dash-main">
        {section === 'agents' && <AgentsSection />}
        {section === 'courses' && <CoursesSection />}
        {section === 'documents' && <DocumentsSection />}
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────── AGENTS SECTION */
function AgentsSection() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState<ChatHistory>({});
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chats, typing]);

  const currentAgent = AGENTS.find(a => a.id === activeAgent);
  const currentMessages = activeAgent ? (chats[activeAgent] || []) : [];

  const sendMessage = async () => {
    if (!input.trim() || !activeAgent || typing) return;
    const userMsg = input.trim();
    setInput('');
    setChats(prev => ({ ...prev, [activeAgent]: [...(prev[activeAgent] || []), { role: 'user', content: userMsg, timestamp: new Date() }] }));
    setTyping(true);
    const agent = AGENTS.find(a => a.id === activeAgent)!;
    const reply = agent.responses.default[Math.floor(Math.random() * agent.responses.default.length)];
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    setTyping(false);
    setChats(prev => ({ ...prev, [activeAgent]: [...(prev[activeAgent] || []), { role: 'agent', content: reply, timestamp: new Date() }] }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* AGENTS SIDEBAR PANEL */}
      <div className="dash-agents-side">
        <div className="dash-agents-side-header">
          <button className="dash-new-btn" onClick={() => setActiveAgent(null)}>＋ Nova conversa</button>
        </div>
        <p className="dash-agent-list-label">Seus Agentes</p>
        {AGENTS.map(agent => (
          <button
            key={agent.id}
            className={`dash-agent-item${activeAgent === agent.id ? ' active' : ''}`}
            onClick={() => setActiveAgent(agent.id)}
            style={activeAgent === agent.id ? { borderLeft: `3px solid ${agent.color}`, background: agent.bg } : {}}
          >
            <div className="dash-agent-avatar" style={{ background: agent.color }}>{agent.emoji}</div>
            <div className="dash-agent-item-info">
              <span className="dash-agent-item-name">{agent.name}</span>
              <span className="dash-agent-item-role">{agent.role.split(' · ')[1]}</span>
            </div>
            {(chats[agent.id] || []).length > 0 && <span className="dash-agent-dot" style={{ background: agent.color }} />}
          </button>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="dash-chat-area">
        {/* Header */}
        <header className="dash-header">
          {currentAgent ? (
            <div className="dash-header-agent">
              <div className="dash-header-avatar" style={{ background: currentAgent.color }}>{currentAgent.emoji}</div>
              <div>
                <span className="dash-header-name">{currentAgent.name}</span>
                <span className="dash-header-role">{currentAgent.role}</span>
              </div>
            </div>
          ) : (
            <div className="dash-header-agent">
              <span className="dash-header-name">Hub de Agentes</span>
              <span className="dash-header-role">Bonadio Cursos · Selecione um agente para começar</span>
            </div>
          )}
          {currentAgent && <div className="dash-header-status"><span className="dash-status-dot" /> Online</div>}
        </header>

        {/* Messages */}
        <div className="dash-messages">
          {!activeAgent ? (
            <div className="dash-welcome">
              <div className="dash-welcome-icon">🏛️</div>
              <h2 className="dash-welcome-title">Olá, Dr. Wladmir</h2>
              <p className="dash-welcome-sub">Selecione um agente para começar uma conversa ou continue de onde parou.</p>
              <div className="dash-agent-grid">
                {AGENTS.map(agent => (
                  <button key={agent.id} className="dash-agent-card" onClick={() => setActiveAgent(agent.id)} style={{ borderColor: agent.border, background: agent.bg }}>
                    <div className="dash-agent-card-avatar" style={{ background: agent.color }}>{agent.emoji}</div>
                    <div className="dash-agent-card-info">
                      <strong>{agent.name}</strong>
                      <span>{agent.role}</span>
                      <p>{agent.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="dash-agent-welcome">
              <div className="dash-agent-welcome-avatar" style={{ background: currentAgent!.color }}>{currentAgent!.emoji}</div>
              <h3>{currentAgent!.name}</h3>
              <p className="dash-agent-welcome-desc">{currentAgent!.description}</p>
              <div className="dash-suggestions">
                {currentAgent!.suggestions.map((s, i) => (
                  <button key={i} className="dash-suggestion-btn" onClick={() => { setInput(s); inputRef.current?.focus(); }}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="dash-chat-log">
              {currentMessages.map((msg, i) => (
                <div key={i} className={`dash-msg dash-msg--${msg.role}`}>
                  {msg.role === 'agent' && <div className="dash-msg-avatar" style={{ background: currentAgent!.color }}>{currentAgent!.emoji}</div>}
                  <div className="dash-msg-bubble">
                    <div className="dash-msg-content" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    <div className="dash-msg-time">{formatTime(msg.timestamp)}</div>
                  </div>
                  {msg.role === 'user' && <div className="dash-msg-avatar dash-msg-avatar--user">W</div>}
                </div>
              ))}
              {typing && (
                <div className="dash-msg dash-msg--agent">
                  <div className="dash-msg-avatar" style={{ background: currentAgent!.color }}>{currentAgent!.emoji}</div>
                  <div className="dash-msg-bubble"><div className="dash-typing"><span /><span /><span /></div></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        {activeAgent && (
          <div className="dash-input-area">
            <div className="dash-input-wrap">
              <textarea ref={inputRef} className="dash-input" rows={1}
                placeholder={`Mensagem para ${currentAgent?.name}...`}
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              />
              <button className="dash-send-btn" onClick={sendMessage} disabled={!input.trim() || typing} style={{ background: currentAgent?.color }}>↑</button>
            </div>
            <p className="dash-input-hint">Enter para enviar · Shift+Enter para nova linha</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────── COURSES SECTION */
function CoursesSection() {
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'materials'>('overview');

  const course = COURSES.find(c => c.id === activeCourse);
  let lesson: typeof COURSES[0]['modules'][0]['lessons'][0] | null = null;
  if (course && activeLesson) {
    const mod = course.modules.find(m => m.id === activeLesson.moduleId);
    lesson = mod?.lessons.find(l => l.id === activeLesson.lessonId) || null;
  }

  if (activeCourse && course) {
    const completedLessons = course.modules.flatMap(m => m.lessons).filter(l => l.done).length;
    const totalLessons = course.modules.flatMap(m => m.lessons).length;
    const progressPct = Math.round((completedLessons / totalLessons) * 100);

    return (
      <div className="member-layout">
        {/* Course Header */}
        <div className="course-hero">
          <button className="course-back-btn" onClick={() => { setActiveCourse(null); setActiveLesson(null); }}>← Voltar aos cursos</button>
          <h1 className="course-hero-title">{course.title}</h1>
          <div className="course-meta-row">
            <span className="course-meta-tag">{course.level}</span>
            <span className="course-meta-tag">📚 {totalLessons} aulas</span>
            <span className="course-meta-tag">⏱ {course.duration}</span>
          </div>
          <div className="course-progress-bar-wrap">
            <div className="course-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="course-progress-text">{progressPct}% concluído · {completedLessons}/{totalLessons} aulas</p>
        </div>

        {/* Course Body */}
        <div className="course-body">
          {/* Video Player */}
          <div className="course-content-area">
            {lesson ? (
              <>
                <div className="video-player-wrap">
                  <iframe
                    src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1`}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="lesson-info-bar">
                  <div>
                    <h2 className="lesson-title">{lesson.title}</h2>
                    <p className="lesson-meta">Duração: {lesson.duration}</p>
                  </div>
                  <div className="lesson-nav-btns">
                    <button className="lesson-nav-btn">← Anterior</button>
                    <button className="lesson-nav-btn lesson-nav-btn--primary">Próxima →</button>
                  </div>
                </div>

                <div className="lesson-tabs">
                  {(['overview', 'curriculum', 'materials'] as const).map(tab => (
                    <button key={tab} className={`lesson-tab-btn${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                      {tab === 'overview' ? 'Visão Geral' : tab === 'curriculum' ? 'Currículo' : 'Materiais'}
                    </button>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <div className="lesson-tab-content">
                    <h3>Sobre esta aula</h3>
                    <p>{course.description}</p>
                    <div className="overview-grid">
                      <div className="overview-card"><span className="overview-icon">🎯</span><strong>Objetivo</strong><p>Dominar o conceito apresentado e aplicar imediatamente no seu escritório.</p></div>
                      <div className="overview-card"><span className="overview-icon">📝</span><strong>Pré-requisitos</strong><p>Nenhum pré-requisito. Apenas disposição para agir.</p></div>
                      <div className="overview-card"><span className="overview-icon">⚡</span><strong>Próximos passos</strong><p>Complete as tarefas práticas na aba Materiais antes de avançar.</p></div>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="lesson-tab-content">
                    <h3>Módulos do curso</h3>
                    {course.modules.map((mod, mi) => (
                      <div key={mod.id} className="curriculum-module">
                        <div className="curriculum-module-header">
                          <span className="curriculum-module-num">Módulo {mi + 1}</span>
                          <span className="curriculum-module-title">{mod.title}</span>
                          <span className="curriculum-module-count">{mod.lessons.length} aulas</span>
                        </div>
                        {mod.lessons.map(l => (
                          <button key={l.id} className={`curriculum-lesson${l.done ? ' done' : ''}${activeLesson?.lessonId === l.id ? ' active' : ''}`}
                            onClick={() => setActiveLesson({ moduleId: mod.id, lessonId: l.id })}>
                            <span className="curriculum-lesson-icon">{l.done ? '✓' : activeLesson?.lessonId === l.id ? '▶' : '○'}</span>
                            <span className="curriculum-lesson-title">{l.title}</span>
                            <span className="curriculum-lesson-duration">{l.duration}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'materials' && (
                  <div className="lesson-tab-content">
                    <h3>Materiais complementares</h3>
                    <div className="materials-list">
                      <div className="material-item"><span>📄</span><div><strong>Slides da aula</strong><p>PDF com os principais pontos e frameworks</p></div><button className="material-download-btn">↓ Baixar</button></div>
                      <div className="material-item"><span>📋</span><div><strong>Template prático</strong><p>Planilha/documento para aplicar o conteúdo</p></div><button className="material-download-btn">↓ Baixar</button></div>
                      <div className="material-item"><span>🔗</span><div><strong>Recursos adicionais</strong><p>Links e referências mencionados na aula</p></div><button className="material-download-btn">↓ Acessar</button></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No lesson selected — show curriculum */
              <div className="course-curriculum-default">
                <div className="course-welcome-card">
                  <h2>Bem-vindo ao curso!</h2>
                  <p>{course.description}</p>
                  <button className="course-start-btn"
                    onClick={() => setActiveLesson({ moduleId: course.modules[0].id, lessonId: course.modules[0].lessons[0].id })}>
                    {progressPct > 0 ? 'Continuar de onde parei' : 'Começar agora'} →
                  </button>
                </div>
                <h3 style={{ marginTop: 32, marginBottom: 16, fontWeight: 600 }}>Conteúdo do curso</h3>
                {course.modules.map((mod, mi) => (
                  <div key={mod.id} className="curriculum-module">
                    <div className="curriculum-module-header">
                      <span className="curriculum-module-num">Módulo {mi + 1}</span>
                      <span className="curriculum-module-title">{mod.title}</span>
                      <span className="curriculum-module-count">{mod.lessons.length} aulas</span>
                    </div>
                    {mod.lessons.map(l => (
                      <button key={l.id} className={`curriculum-lesson${l.done ? ' done' : ''}`}
                        onClick={() => setActiveLesson({ moduleId: mod.id, lessonId: l.id })}>
                        <span className="curriculum-lesson-icon">{l.done ? '✓' : '○'}</span>
                        <span className="curriculum-lesson-title">{l.title}</span>
                        <span className="curriculum-lesson-duration">{l.duration}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Curriculum Sidebar */}
          <div className="curriculum-sidebar">
            <h3 className="curriculum-sidebar-title">Conteúdo</h3>
            {course.modules.map((mod, mi) => (
              <div key={mod.id} className="curriculum-module">
                <div className="curriculum-module-header">
                  <span className="curriculum-module-num">M{mi + 1}</span>
                  <span className="curriculum-module-title" style={{ fontSize: 13 }}>{mod.title}</span>
                </div>
                {mod.lessons.map(l => (
                  <button key={l.id} className={`curriculum-lesson${l.done ? ' done' : ''}${activeLesson?.lessonId === l.id ? ' active' : ''}`}
                    onClick={() => setActiveLesson({ moduleId: mod.id, lessonId: l.id })}>
                    <span className="curriculum-lesson-icon">{l.done ? '✓' : activeLesson?.lessonId === l.id ? '▶' : '○'}</span>
                    <span className="curriculum-lesson-title">{l.title}</span>
                    <span className="curriculum-lesson-duration">{l.duration}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* COURSE LISTING */
  const totalLessonsAll = COURSES.reduce((s, c) => s + c.lessons, 0);
  const totalCompleted = COURSES.reduce((s, c) => s + Math.round(c.lessons * c.progress / 100), 0);

  return (
    <div className="member-page">
      {/* Page Header */}
      <div className="member-page-header">
        <div>
          <h1 className="member-page-title">Meus Cursos</h1>
          <p className="member-page-sub">Biblioteca de treinamentos exclusivos Bonadio Cursos</p>
        </div>
        <div className="member-stats-row">
          <div className="member-stat-card"><strong>{COURSES.length}</strong><span>Cursos</span></div>
          <div className="member-stat-card"><strong>{totalLessonsAll}</strong><span>Aulas</span></div>
          <div className="member-stat-card"><strong>{totalCompleted}</strong><span>Concluídas</span></div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="member-progress-bar-card">
        <div className="member-progress-label">
          <span>Progresso geral</span>
          <span>{Math.round((totalCompleted / totalLessonsAll) * 100)}%</span>
        </div>
        <div className="member-progress-track">
          <div className="member-progress-fill" style={{ width: `${Math.round((totalCompleted / totalLessonsAll) * 100)}%` }} />
        </div>
      </div>

      {/* Course Cards */}
      <div className="course-grid">
        {COURSES.map(c => (
          <div key={c.id} className="course-card" onClick={() => setActiveCourse(c.id)}>
            <div className="course-card-thumb" style={{ backgroundImage: `url(${c.thumb})` }}>
              {c.progress > 0 && c.progress < 100 && <span className="course-card-badge">Em andamento</span>}
              {c.progress === 100 && <span className="course-card-badge course-card-badge--done">Concluído ✓</span>}
              {c.progress === 0 && <span className="course-card-badge course-card-badge--new">Novo</span>}
            </div>
            <div className="course-card-body">
              <div className="course-card-meta">
                <span className="course-level-tag">{c.level}</span>
                <span className="course-duration-tag">⏱ {c.duration}</span>
              </div>
              <h3 className="course-card-title">{c.title}</h3>
              <p className="course-card-desc">{c.description}</p>
              <div className="course-card-footer">
                <div className="course-card-progress">
                  <div className="course-card-progress-bar">
                    <div className="course-card-progress-fill" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span>{c.progress}%</span>
                </div>
                <button className="course-card-btn">
                  {c.progress > 0 ? 'Continuar' : 'Iniciar'} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── PDF VIEWER MODAL */
function PdfModal({ doc, onClose }: { doc: DocItem; onClose: () => void }) {
  const [page, setPage] = useState(0);
  const total = doc.pages.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setPage(p => Math.min(p + 1, total - 1));
      if (e.key === 'ArrowLeft') setPage(p => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, total]);

  const handleDownload = () => {
    const content = doc.pages.map(p => `${p.title}\n${'─'.repeat(60)}\n\n${p.content}`).join('\n\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pdf-overlay" onClick={onClose}>
      <div className="pdf-modal" onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div className="pdf-modal-header">
          <div className="pdf-modal-title-wrap">
            <span className="pdf-modal-icon">{doc.icon}</span>
            <div>
              <p className="pdf-modal-filename">{doc.title}</p>
              <p className="pdf-modal-meta">{doc.type} · {doc.size} · {total} {total === 1 ? 'página' : 'páginas'}</p>
            </div>
          </div>
          <div className="pdf-modal-actions">
            <button className="pdf-download-btn" onClick={handleDownload}>↓ Baixar</button>
            <button className="pdf-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="pdf-toolbar">
          <button className="pdf-nav-btn" onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>‹</button>
          <span className="pdf-page-info">Página {page + 1} de {total}</span>
          <button className="pdf-nav-btn" onClick={() => setPage(p => Math.min(p + 1, total - 1))} disabled={page === total - 1}>›</button>
          <span className="pdf-toolbar-sep" />
          <span className="pdf-toolbar-hint">← → para navegar · ESC para fechar</span>
        </div>

        {/* Page viewer */}
        <div className="pdf-viewer-area">
          <div className="pdf-page">
            <div className="pdf-page-header-bar">
              <span className="pdf-page-label">{doc.pages[page].title}</span>
              <div className="pdf-page-logo">Bonadio Cursos</div>
            </div>
            <pre className="pdf-page-content">{doc.pages[page].content}</pre>
            <div className="pdf-page-footer">
              <span>Bonadio Cursos · Dr. Wladmir Bonadio Filho · OAB/SP 398.640</span>
              <span>Pág. {page + 1}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail strip (if multiple pages) */}
        {total > 1 && (
          <div className="pdf-thumb-strip">
            {doc.pages.map((p, i) => (
              <button key={i} className={`pdf-thumb${page === i ? ' active' : ''}`} onClick={() => setPage(i)}>
                <span className="pdf-thumb-num">{i + 1}</span>
                <span className="pdf-thumb-title">{p.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── DOCUMENTS SECTION */
function DocumentsSection() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [viewingDoc, setViewingDoc] = useState<DocItem | null>(null);

  const filtered = DOCUMENTS.filter(d => {
    const matchCat = activeCategory === 'Todos' || d.category === activeCategory;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (doc: DocItem) => {
    const content = doc.pages.map(p => `${p.title}\n${'─'.repeat(60)}\n\n${p.content}`).join('\n\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {viewingDoc && <PdfModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}

      <div className="member-page">
        <div className="member-page-header">
          <div>
            <h1 className="member-page-title">Documentos</h1>
            <p className="member-page-sub">Templates, modelos e materiais exclusivos para download</p>
          </div>
          <div className="member-stats-row">
            <div className="member-stat-card"><strong>{DOCUMENTS.length}</strong><span>Arquivos</span></div>
            <div className="member-stat-card"><strong>{DOC_CATEGORIES.length - 1}</strong><span>Categorias</span></div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="docs-toolbar">
          <input
            className="docs-search"
            type="text"
            placeholder="Buscar documentos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="docs-filters">
            {DOC_CATEGORIES.map(cat => (
              <button key={cat} className={`docs-filter-btn${activeCategory === cat ? ' active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Doc Grid */}
        <div className="docs-grid">
          {filtered.map(doc => (
            <div key={doc.id} className="doc-card">
              <div className="doc-card-icon">{doc.icon}</div>
              <div className="doc-card-info">
                <h4 className="doc-card-title">{doc.title}</h4>
                <div className="doc-card-meta">
                  <span className="doc-category-tag">{doc.category}</span>
                  <span className="doc-type-tag">{doc.type}</span>
                  <span className="doc-size">{doc.size}</span>
                </div>
                <p className="doc-date">Atualizado em {new Date(doc.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="doc-card-btns">
                <button className="doc-view-btn" title="Visualizar documento" onClick={() => setViewingDoc(doc)}>👁 Ver</button>
                <button className="doc-download-btn" title="Baixar arquivo" onClick={() => handleDownload(doc)}>↓</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="docs-empty">
              <span>📂</span>
              <p>Nenhum documento encontrado para &quot;{search}&quot;.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
