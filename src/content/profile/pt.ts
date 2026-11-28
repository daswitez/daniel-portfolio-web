import type { ProfileText } from "./base";

export const pt: ProfileText = {
  role: "Fullstack Developer · UI/UX",
  location: "Remoto · LATAM",
  availability: "Respondo em menos de 24 h",
  lede: "Ei, olá! Que bom que você passou por aqui.",
  bio: [
    "Sou desenvolvedor fullstack e designer UI/UX, e o que mais me empolga é criar coisas que as pessoas adoram usar. Amo fazer parte de toda a jornada: da primeira conversa com o usuário e do esboço no Figma até o banco de dados, o deploy e aquele momento em que as métricas gritam “funcionou!”.",
    "Ultimamente vivo entre a IA e o produto: integro modelos, monto agentes e desenho interfaces que fazem tudo isso parecer simples. Brilho em equipes pequenas que se movem rápido, escrevo código que dá gosto de ler e estou sempre a fim de aprender algo novo. Tem uma ideia rodando na cabeça? Me conta, que a gente faz acontecer.",
  ],
  facts: [
    { label: "Foco", value: "Produto de ponta a ponta" },
    { label: "Idiomas", value: "Espanhol, inglês, português (intermediário)" },
    { label: "Modalidade", value: "Remoto, freelance ou full-time" },
  ],
  experienceLede:
    "Experiência em UI/UX, integrações com inteligência artificial e software AI‑native.",
  experience: {
    solvertic: {
      role: "AI Engineer",
      period: "2026 — presente",
      description:
        "Na Solvertic construo software para uma universidade e para um sistema financeiro. Trabalho principalmente com backend, inteligência artificial e infraestrutura: microsserviços em Java com Spring Boot, desenhados com arquitetura hexagonal, e integrações de IA com Spring AI.",
      highlights: [
        "Microsserviços em Java e Spring Boot com arquitetura hexagonal (portas e adaptadores).",
        "Integração de modelos de IA nos serviços com Spring AI.",
        "Infraestrutura e deploy dos serviços da universidade e do sistema financeiro.",
      ],
      tags: [
        "Java",
        "Spring Boot",
        "Spring AI",
        "Arquitetura hexagonal",
        "Microsserviços",
      ],
    },
    grazia: {
      role: "Desenvolvedor Fullstack · AI Engineer · UI/UX",
      period: "2025 — 2026",
      description:
        "Grazia é um creative board de vídeo com IA: gera anúncios cinematográficos, influenciadores de IA fotorrealistas, conteúdo UGC e vídeos imobiliários em minutos, para equipes de marketing e e‑commerce. Meu papel cobre o produto de ponta a ponta: desenho a experiência, construo o frontend e o backend e integro os modelos generativos em uma plataforma AI‑native.",
      highlights: [
        "Design UI/UX dos fluxos de geração de vídeo, imagem, voz e áudio.",
        "Integração de modelos de IA generativa: pipelines de geração, filas de trabalho e entrega de mídia.",
        "Desenvolvimento fullstack de funcionalidades do produto, do design no Figma ao deploy.",
      ],
      tags: ["Next.js", "TypeScript", "Supabase", "IA generativa", "UI/UX"],
    },
    freelance: {
      role: "Desenvolvedor web freelance",
      company: "Clientes independentes",
      period: "2024 — 2025",
      description:
        "Desenvolvimento sob medida para negócios e empreendedores. Além de sites, construí software sob medida: sistemas pensados para o processo de cada cliente. Entendo o problema, desenho a interface e entrego o produto funcionando.",
      highlights: [
        "Sistemas sob medida para cada negócio: painéis administrativos, automações e integrações, não só sites.",
      ],
    },
  },
  projects: {
    landed: {
      title: "Landed",
      tagline: "Alugar casa noutro país sem nunca lá ter posto os pés.",
      description:
        "Casas mobiladas de 3 a 24 meses em Lisboa e no Porto para quem se muda do estrangeiro: pesquisa, visita por vídeo, documentos e contrato, tudo online e em três idiomas. O objetivo: passar de 3 semanas para 5 dias entre o primeiro contacto e o contrato.",
      role: "Produto, UX/UI, design system e desenvolvimento full-stack, de ponta a ponta",
      highlights: [
        "Pesquisa por minutos reais de transporte público até ao teu escritório ou universidade, com mapa e lista sincronizados.",
        "Preço tudo incluído e na tua moeda, com a taxa de câmbio diária do BCE.",
        "Visitas por vídeo no teu fuso horário, sem reservas duplas: o Postgres impede-as com uma exclusion constraint.",
        "Assistente com IA baseado em dados reais: recomenda casas que existem, consulta horários livres e marca a visita.",
        "Segurança de produto real: API própria, cookies httpOnly, CSRF e Row Level Security em todas as tabelas.",
        "Demo pública com 5 perfis, acessível (axe, WCAG 2.1 AA) e pensada primeiro para o telemóvel.",
      ],
      stats: [
        { value: "31", label: "Páginas" },
        { value: "44", label: "Endpoints de API" },
        { value: "62", label: "Ecrãs no Figma" },
        { value: "3", label: "Idiomas" },
      ],
      note: "Projeto de portfólio: as casas, pessoas e empresa da demo são fictícias. Para experimentar: Sign in → Try the demo.",
    },
    tuvoz: {
      title: "Tu Voz",
      tagline: "Vender a falar: inventário e vendas com um agente de IA.",
      description:
        "Sistema de gestão de inventário e vendas para comerciantes, com um agente de IA que entende texto e voz. Em vez de procurar produtos e preencher formulários com o balcão cheio, o vendedor diz «vendi dois rolos de tecido de 50 metros» e o agente prepara a venda para ele confirmar.",
      role: "Produto, UX/UI e desenvolvimento full-stack, incluindo a integração de IA por voz",
      highlights: [
        "Vendas por voz em tempo real com Gemini Live: transcrição ao vivo e resposta falada.",
        "Um agente com 12 ferramentas sobre os dados reais: encontra produtos mesmo com o nome dito errado, regista vendas, entradas e transferências entre lojas, anula vendas, cria produtos e avisa do stock baixo.",
        "Nada é guardado sem confirmação: o agente propõe e a pessoa confirma por voz ou com um botão.",
        "O stock só muda através de funções SQL que registam cada movimento, por isso vendas manuais e por voz usam exatamente a mesma lógica.",
        "Equipas com cargos (dono, administrador, funcionário), lojas e convites por código ou QR, protegidos com Row Level Security.",
        "Produtos com código QR, unidades decimais (metros, rolos, kg) e um painel com gráficos por período.",
      ],
      stats: [
        { value: "12", label: "Ferramentas do agente" },
        { value: "3", label: "Cargos com permissões" },
        { value: "2", label: "Modos: texto e voz" },
        { value: "6", label: "Migrações SQL" },
      ],
    },
  },
  stack: [
    {
      name: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "React Native",
      ],
    },
    {
      name: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "PostgreSQL",
        "Prisma",
        "Redis",
        "REST / GraphQL",
      ],
    },
    {
      name: "Design",
      items: [
        "Figma",
        "Design systems",
        "Prototipagem",
        "User research",
        "Acessibilidade",
      ],
    },
    {
      name: "Infra e IA",
      items: ["Docker", "Vercel", "AWS", "CI/CD", "APIs de LLM", "Agentes"],
    },
  ],
};
