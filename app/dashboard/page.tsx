'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '../dash.css';

const AGENTS = [
  {
    id: 'leo',
    name: 'Leo',
    role: 'Agente Master · CEO',
    color: '#204080',
    bg: 'rgba(32,64,128,0.12)',
    border: 'rgba(32,64,128,0.25)',
    initials: 'L',
    emoji: '🧠',
    description: 'Visão 360° da empresa. Estratégia, decisões e coordenação de todos os agentes.',
    suggestions: [
      'Qual é o status geral da empresa esta semana?',
      'Quais são as prioridades dos próximos 30 dias?',
      'Como estamos em relação às metas de R$30k/mês?',
      'Analisa o pipeline de vendas atual.',
    ],
    responses: {
      default: [
        'Entendido. Vou analisar a situação com base no CLAUDE.md e nas métricas atuais. Para dar uma resposta precisa, preciso que você me informe: (1) os números mais recentes de leads e faturamento, e (2) qual é a decisão que precisa ser tomada. Posso então montar a análise estratégica completa.',
        'Como Agente Master, minha função é conectar os pontos entre todas as áreas. Baseado no contexto da AVESTRA, recomendo priorizarmos o fechamento dos primeiros contratos V1 antes de escalar o tráfego. Isso vai gerar prova social e caixa para reinvestimento. Quer que eu detalhe o plano de ação?',
        'Visão geral da semana: marketing precisa de pauta aprovada, Victor tem 3 leads em negociação, Clara está configurando os onboardings. Minha recomendação: foque nos fechamentos — cada R$3k fechado esta semana muda o moral da equipe. O que quer que eu priorize agora?',
      ],
    },
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'CMO · Marketing & Conteúdo',
    color: '#6B21A8',
    bg: 'rgba(107,33,168,0.1)',
    border: 'rgba(107,33,168,0.25)',
    initials: 'M',
    emoji: '✨',
    description: 'Copy, conteúdo, redes sociais, Meta Ads. Conversão acima de vaidade.',
    suggestions: [
      'Cria a pauta de conteúdo desta semana.',
      'Escreve um post para o perfil @wladmirbonadiofilho_adv.',
      'Quais são os pilares de conteúdo prioritários?',
      'Analisa a performance dos últimos posts.',
    ],
    responses: {
      default: [
        'Pauta da semana pronta: Segunda — case de rescisão trabalhista (prova social ICP01). Quarta — Reels bastidores do escritório (autoridade). Sexta — educativo sobre direito do consumidor (awareness). Stories diários: rotina + bastidores. Quer que eu escreva o roteiro de algum desses?',
        'Post para @wladmirbonadiofilho_adv:\n\n"Você sabia que demissão sem justa causa tem uma lista de direitos que muita empresa tenta não pagar?\n\nSérie: Direitos que você não pode deixar passar.\n\nSalva esse post 👇"\n\n[continua em carrossel com 7 slides]. Quer o roteiro completo dos slides?',
        'Para ICP01 (advogado sem marketing), o conteúdo que mais converte é: case real com resultado → educativo sobre direito → bastidores do escritório → depoimento de cliente. Vou montar o calendário semanal com essa sequência. Confirma?',
      ],
    },
  },
  {
    id: 'victor',
    name: 'Victor',
    role: 'CSO · Vendas & Pipeline',
    color: '#065F46',
    bg: 'rgba(6,95,70,0.1)',
    border: 'rgba(6,95,70,0.25)',
    initials: 'V',
    emoji: '💼',
    description: 'Pipeline, qualificação de leads, propostas e fechamentos consultivos.',
    suggestions: [
      'Quais leads estão no pipeline agora?',
      'Monta uma proposta para um advogado trabalhista.',
      'Qual é o script de primeiro contato?',
      'Analisa os motivos de perda dos últimos leads.',
    ],
    responses: {
      default: [
        'Pipeline atual: Aguardando sua atualização dos leads. Para um pipeline saudável com meta de R$30k, precisamos de pelo menos: 20 leads novos/mês → 10 qualificados → 5 propostas → 3 fechamentos. Qual etapa está travando mais? Captação, qualificação ou fechamento?',
        'Proposta para advogado trabalhista (ICP01):\n\nProposta de Posicionamento Digital\nDr./Dra. [Nome]\n\n✦ Diagnóstico do seu perfil atual\n✦ Estratégia de conteúdo por 30 dias\n✦ 12 posts/mês (roteiro + design)\n✦ Gestão do Instagram\n✦ Reunião mensal de resultados\n\nInvestimento: R$1.500/mês\n\nQuer que eu adicione os bônus e a garantia?',
        'Script de primeiro contato:\n\n"Oi [Nome], tudo bem? Vi seu perfil e percebi que você atua em [área]. Tenho ajudado advogados a atrair clientes qualificados pelo Instagram sem precisar virar criador de conteúdo. Faz sentido conversarmos sobre isso?"\n\nTaxa de resposta esperada: 15-25%. Quer as variações para follow-up 48h?',
      ],
    },
  },
  {
    id: 'clara',
    name: 'Clara',
    role: 'CCO · Atendimento & CS',
    color: '#92400E',
    bg: 'rgba(146,64,14,0.1)',
    border: 'rgba(146,64,14,0.25)',
    initials: 'C',
    emoji: '🤝',
    description: 'Onboarding, suporte, satisfação de clientes e coleta de depoimentos.',
    suggestions: [
      'Como está o onboarding dos clientes ativos?',
      'Monta o checklist de onboarding para um novo cliente V1.',
      'Quando devo coletar depoimentos?',
      'Qual é o SLA de resposta para clientes?',
    ],
    responses: {
      default: [
        'SLA atual definido: resposta em até 2h no horário comercial. Para clientes V1 (advocacia): primeiro contato em 24h após assinatura do contrato, reunião de kickoff em até 3 dias. Precisa que eu monte o template de mensagem de boas-vindas?',
        'Checklist de Onboarding V1:\n\n✓ Contrato assinado e arquivado\n✓ Acesso ao grupo exclusivo criado\n✓ Reunião de kickoff agendada (máx. 72h)\n✓ Diagnóstico do perfil atual realizado\n✓ Primeiro mês de pauta aprovado\n✓ Primeiro post publicado\n✓ Feedback coletado no dia 15\n\nQuer que eu crie o template de mensagem para cada etapa?',
        'O momento ideal para coletar depoimento: 30 dias após início (primeira percepção de resultado) e após qualquer conquista concreta (primeiro cliente captado, post que viralizou, etc.). Formato recomendado: áudio de 30-60s pelo WhatsApp — maior naturalidade e taxa de conversão. Posso montar o roteiro de pergunta?',
      ],
    },
  },
  {
    id: 'bruno',
    name: 'Bruno',
    role: 'COO · Operações & SOPs',
    color: '#1E3A5F',
    bg: 'rgba(30,58,95,0.1)',
    border: 'rgba(30,58,95,0.25)',
    initials: 'B',
    emoji: '⚙️',
    description: 'SOPs, processos, templates jurídicos e automações internas.',
    suggestions: [
      'Cria um SOP para onboarding de novos clientes.',
      'Quais processos precisam virar automação?',
      'Lista os templates jurídicos disponíveis.',
      'Como estruturar o financeiro da empresa?',
    ],
    responses: {
      default: [
        'SOP #001 — Onboarding de Cliente V1:\n\nPasso 1: Receber assinatura do contrato\nPasso 2: Clara envia mensagem de boas-vindas (template A)\nPasso 3: Victor agenda reunião de kickoff em 72h\nPasso 4: Maya realiza diagnóstico de perfil\nPasso 5: Pauta do mês 1 aprovada pelo Wladmir\nPasso 6: Publicação do primeiro post\nPasso 7: Check-in no dia 15\n\nQuer que eu documente os scripts de cada passo?',
        'Processos que precisam virar automação imediata:\n\n1. Follow-up de leads (Victor) — 48h sem resposta → mensagem automática\n2. Coleta de depoimento (Clara) — 30 dias pós-contrato → lembrete\n3. Relatório semanal (Leo) — toda sexta às 17h → compilação automática\n4. Pauta de conteúdo (Maya) — toda segunda → template pré-preenchido\n\nQuer que eu priorize a implementação de algum?',
        'Regra operacional da AVESTRA: toda tarefa repetida 2x vira SOP. Todo SOP executado 3x vira automação. Hoje precisamos documentar: atendimento inicial, proposta comercial, onboarding e coleta de NPS. Por onde quer começar?',
      ],
    },
  },
];

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

type ChatHistory = Record<string, Message[]>;

export default function DashboardPage() {
  const router = useRouter();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState<ChatHistory>({});
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('av_auth') !== '1') {
        router.replace('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, typing]);

  const currentAgent = AGENTS.find(a => a.id === activeAgent);
  const currentMessages = activeAgent ? (chats[activeAgent] || []) : [];

  const sendMessage = async () => {
    if (!input.trim() || !activeAgent || typing) return;
    const userMsg = input.trim();
    setInput('');

    setChats(prev => ({
      ...prev,
      [activeAgent]: [...(prev[activeAgent] || []), { role: 'user', content: userMsg, timestamp: new Date() }],
    }));

    setTyping(true);
    const agent = AGENTS.find(a => a.id === activeAgent)!;
    const responses = agent.responses.default;
    const reply = responses[Math.floor(Math.random() * responses.length)];

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    setTyping(false);

    setChats(prev => ({
      ...prev,
      [activeAgent]: [...(prev[activeAgent] || []), { role: 'agent', content: reply, timestamp: new Date() }],
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('av_auth');
    router.push('/login');
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="dash-layout">

      {/* SIDEBAR */}
      <aside className={`dash-sidebar${sidebarOpen ? '' : ' dash-sidebar--closed'}`}>
        <div className="dash-sidebar-header">
          <div className="dash-logo">
            <span className="dash-logo-text">AVESTRA</span>
            <span className="dash-logo-badge">Agentes</span>
          </div>
          <button className="dash-sidebar-toggle" onClick={() => setSidebarOpen(v => !v)} title="Recolher sidebar">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="dash-new-chat">
          <button className="dash-new-btn" onClick={() => { setActiveAgent(null); }}>
            <span>＋</span> Nova conversa
          </button>
        </div>

        <nav className="dash-agent-list">
          <p className="dash-agent-list-label">Seus Agentes</p>
          {AGENTS.map(agent => {
            const hasMessages = (chats[agent.id] || []).length > 0;
            return (
              <button
                key={agent.id}
                className={`dash-agent-item${activeAgent === agent.id ? ' active' : ''}`}
                onClick={() => setActiveAgent(agent.id)}
                style={activeAgent === agent.id ? { borderLeft: `3px solid ${agent.color}`, background: agent.bg } : {}}
              >
                <div className="dash-agent-avatar" style={{ background: agent.color }}>
                  {agent.emoji}
                </div>
                <div className="dash-agent-item-info">
                  <span className="dash-agent-item-name">{agent.name}</span>
                  <span className="dash-agent-item-role">{agent.role.split(' · ')[1]}</span>
                </div>
                {hasMessages && <span className="dash-agent-dot" style={{ background: agent.color }} />}
              </button>
            );
          })}
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

      {/* MAIN */}
      <main className="dash-main">

        {/* HEADER */}
        {currentAgent ? (
          <header className="dash-header">
            <div className="dash-header-agent">
              <div className="dash-header-avatar" style={{ background: currentAgent.color }}>
                {currentAgent.emoji}
              </div>
              <div>
                <span className="dash-header-name">{currentAgent.name}</span>
                <span className="dash-header-role">{currentAgent.role}</span>
              </div>
            </div>
            <div className="dash-header-status">
              <span className="dash-status-dot" />
              Online
            </div>
          </header>
        ) : (
          <header className="dash-header">
            <div className="dash-header-agent">
              <span className="dash-header-name">Painel de Agentes</span>
              <span className="dash-header-role">AVESTRA · Selecione um agente para começar</span>
            </div>
          </header>
        )}

        {/* MESSAGES / WELCOME */}
        <div className="dash-messages">
          {!activeAgent ? (
            /* WELCOME SCREEN */
            <div className="dash-welcome">
              <div className="dash-welcome-icon">🏛️</div>
              <h2 className="dash-welcome-title">Olá, Dr. Wladmir</h2>
              <p className="dash-welcome-sub">
                Selecione um agente para começar uma conversa ou continue de onde parou.
              </p>
              <div className="dash-agent-grid">
                {AGENTS.map(agent => (
                  <button
                    key={agent.id}
                    className="dash-agent-card"
                    onClick={() => setActiveAgent(agent.id)}
                    style={{ borderColor: agent.border, background: agent.bg }}
                  >
                    <div className="dash-agent-card-avatar" style={{ background: agent.color }}>
                      {agent.emoji}
                    </div>
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
            /* AGENT WELCOME */
            <div className="dash-agent-welcome">
              <div className="dash-agent-welcome-avatar" style={{ background: currentAgent!.color }}>
                {currentAgent!.emoji}
              </div>
              <h3>{currentAgent!.name}</h3>
              <p className="dash-agent-welcome-desc">{currentAgent!.description}</p>
              <div className="dash-suggestions">
                {currentAgent!.suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="dash-suggestion-btn"
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* CHAT MESSAGES */
            <div className="dash-chat-log">
              {currentMessages.map((msg, i) => (
                <div key={i} className={`dash-msg dash-msg--${msg.role}`}>
                  {msg.role === 'agent' && (
                    <div className="dash-msg-avatar" style={{ background: currentAgent!.color }}>
                      {currentAgent!.emoji}
                    </div>
                  )}
                  <div className="dash-msg-bubble">
                    <div className="dash-msg-content" style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </div>
                    <div className="dash-msg-time">{formatTime(msg.timestamp)}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="dash-msg-avatar dash-msg-avatar--user">W</div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="dash-msg dash-msg--agent">
                  <div className="dash-msg-avatar" style={{ background: currentAgent!.color }}>
                    {currentAgent!.emoji}
                  </div>
                  <div className="dash-msg-bubble">
                    <div className="dash-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* INPUT */}
        {activeAgent && (
          <div className="dash-input-area">
            <div className="dash-input-wrap">
              <textarea
                ref={inputRef}
                className="dash-input"
                rows={1}
                placeholder={`Mensagem para ${currentAgent?.name}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="dash-send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || typing}
                style={{ background: currentAgent?.color }}
              >
                ↑
              </button>
            </div>
            <p className="dash-input-hint">Enter para enviar · Shift+Enter para nova linha</p>
          </div>
        )}
      </main>
    </div>
  );
}
