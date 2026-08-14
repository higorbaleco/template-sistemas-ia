import { useState, useEffect, useCallback } from "react";

const fmtBRL = n => "R$ " + Math.round(n).toLocaleString("pt-BR");
const fmtNum = n => Math.round(n).toLocaleString("pt-BR");
const pad2 = n => String(n).padStart(2,"0");
const DIAS = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

/* ── CONFIGURAÇÃO PIPEFY ──
   Substitua PIPEFY_TOKEN pelo seu token pessoal:
   app.pipefy.com → Configurações → Token de Acesso Pessoal
   O PIPE_ID 306914700 já está correto (Avraham - CRM de Vendas).
*/
const PIPEFY_TOKEN = ""; // cole aqui seu token
const PIPE_ID = "306914700";
const PIPEFY_POLL_MS = 60_000; // atualiza a cada 60 segundos

/* ── GRAPHQL QUERY ── */
const PIPEFY_QUERY = `
  query PanelCards($pipeId: ID!) {
    pipe(id: $pipeId) {
      cards(first: 50) {
        edges {
          node {
            id
            title
            current_phase { name }
            fields {
              field { label }
              value
            }
          }
        }
      }
    }
  }
`;

function parsePipefyCards(data) {
  if (!data?.pipe?.cards?.edges) return null;
  return data.pipe.cards.edges.map(({ node }) => {
    const fields = {};
    node.fields?.forEach(f => {
      fields[f.field?.label] = f.value;
    });
    const valorStr = fields["Valor do Negócio"] || fields["Valor do negócio"] || "";
    const valor = valorStr
      ? parseFloat(valorStr.replace(/\./g,"").replace(",",".")) || null
      : null;
    const seg = fields["Indústria"] || fields["Segmento"] || fields["Indústria/Segmento"] || "";
    return {
      nome: node.title?.trim(),
      valor,
      fase: node.current_phase?.name || "",
      seg,
    };
  });
}

/* ── DADOS FALLBACK (sincronizado: 01/06/2026) ── */
const PIPEFY_FALLBACK = [
  {nome:"Costa Marin",             valor:32800, fase:"5-Negociação",         seg:"Imobiliária"},
  {nome:"Lucky Bet & 1 pra 1 Bet", valor:25000, fase:"5-Negociação",         seg:"Bet"},
  {nome:"Protetauto",              valor:9000,  fase:"5-Negociação",         seg:"Seguros"},
  {nome:"Pizza Do Gordo",          valor:4000,  fase:"5-Negociação",         seg:"Varejo"},
  {nome:"H2 Bet",                  valor:null,  fase:"5-Negociação",         seg:"Bet"},
  {nome:"Aposta Ganha",            valor:null,  fase:"1- Prospecção",        seg:"Bet"},
  {nome:"Thiago Rifeiro",          valor:2400,  fase:"6-Ganho",              seg:"Bet"},
  {nome:"Irrah Tech",              valor:4500,  fase:"Clientes Recorrentes", seg:"Software & Saas"},
  {nome:"4 Win Bet",               valor:15000, fase:"Cliente da Base",      seg:"Bet"},
  {nome:"4Win Bet | 40k Disparos", valor:15000, fase:"Cliente da Base",      seg:"Bet"},
  {nome:"Gorillas Bet",            valor:15000, fase:"Cliente da Base",      seg:"Bet"},
  {nome:"Della Empório",           valor:18000, fase:"Cliente da Base",      seg:"E-commerce"},
  {nome:"Sales Empire",            valor:2100,  fase:"Cliente da Base",      seg:"E-commerce"},
  {nome:"VIP Premium",             valor:750,   fase:"Cliente da Base",      seg:"Bet"},
  {nome:"La Venus",                valor:350,   fase:"Cliente da Base",      seg:"E-commerce"},
  {nome:"Mérito Investimentos",    valor:320,   fase:"Cliente da Base",      seg:"Outro"},
];

/* ── FASE META ── */
const FASE_META = {
  "1- Prospecção":        {cor:"#94a3b8",abrev:"Prospecção"},
  "4-Proposta":           {cor:"#6366f1",abrev:"Proposta"},
  "5-Negociação":         {cor:"#f59e0b",abrev:"Negociação"},
  "6-Ganho":              {cor:"#16a34a",abrev:"Ganho"},
  "Clientes Recorrentes": {cor:"#10b981",abrev:"Recorrentes"},
  "Cliente da Base":      {cor:"#0891b2",abrev:"Base"},
  "Evento Sigma":         {cor:"#8b5cf6",abrev:"Ev. Sigma"},
};
const faseCor = f => FASE_META[f]?.cor || "#94a3b8";

const HISTORICO = [18200,22400,26800,30100,21600,24300,0];

/* ── TODOIST ── */
const TODOIST_RAW = [
  {c:"Review Pipeline",d:"2026-06-01",prio:"p4"},
  {c:"Costa Marin",d:"2026-06-01",prio:"p4"},
  {c:"Deuces Follow Up",d:"2026-06-01",prio:"p4"},
  {c:"Felipe Otoni - Follow + Fecha",d:"2026-06-01",prio:"p4"},
  {c:"Filipe Machado | Follow e solução",d:"2026-06-01",prio:"p4"},
  {c:"Pizza do Gordo",d:"2026-06-01",prio:"p4"},
  {c:"IA para outro nicho",d:"2026-06-01",prio:"p4"},
  {c:"Provas Portal Ava",d:"2026-06-01",prio:"p4"},
  {c:"Finalizar Site",d:"2026-06-01",prio:"p4"},
  {c:"Conteúdos",d:"2026-06-01",prio:"p4"},
  {c:"Estratégia de Marca | Avraham",d:"2026-06-01",prio:"p4"},
  {c:"Funil",d:"2026-06-01",prio:"p4"},
  {c:"Prospecção",d:"2026-06-01",prio:"p4"},
  {c:"Estratégia Comercial",d:"2026-06-01",prio:"p4"},
  {c:"Criar portfólios em Ferramentas Gringas",d:"2026-06-01",prio:"p4"},
  {c:"Upwork",d:"2026-06-01",prio:"p4"},
  {c:"Fiverr",d:"2026-06-01",prio:"p4"},
  {c:"Workana",d:"2026-06-01",prio:"p4"},
  {c:"Entrar em grupos de prospects",d:"2026-06-01",prio:"p4"},
  {c:"Pegar lista inicial p/ disparo",d:"2026-06-01",prio:"p4"},
  {c:"Freelancer.com",d:"2026-06-01",prio:"p4"},
  {c:"1. Preparação imediata de ativos",d:null,prio:"p4"},
  {c:"Ajustar frase única de oferta",d:null,prio:"p4"},
  {c:"Salvar pitch de 30 segundos",d:null,prio:"p4"},
  {c:"Salvar mensagem curta WA/IG",d:null,prio:"p4"},
  {c:"Separar 2 cases em formato curto",d:null,prio:"p4"},
  {c:"Definir modelo padrão de condição",d:null,prio:"p4"},
  {c:"Preparar texto padrão de proposta",d:null,prio:"p4"},
  {c:"Definir nicho principal e reserva",d:null,prio:"p4"},
  {c:"2. Montar lista de ataque (60 min)",d:null,prio:"p4"},
  {c:"Montar lista com 50 leads",d:null,prio:"p4"},
  {c:"Encontrar decisor e canal de contato",d:null,prio:"p4"},
  {c:"Classificar prioridade A, B, C",d:null,prio:"p4"},
  {c:"Separar 20 leads A para atacar",d:null,prio:"p4"},
  {c:"Separar 20 leads B",d:null,prio:"p4"},
  {c:"Separar 10 leads C",d:null,prio:"p4"},
  {c:"Preparar campo Próximo passo",d:null,prio:"p4"},
  {c:"3. Bloco 1 de prospecção (90 min)",d:null,prio:"p4"},
  {c:"Enviar 25 abordagens canal principal",d:null,prio:"p4"},
  {c:"Fazer as duas perguntas rápidas",d:null,prio:"p4"},
  {c:"Agendar diagnóstico com horário",d:null,prio:"p4"},
  {c:"Registrar lead no pipeline",d:null,prio:"p4"},
  {c:"4. Follow up aquecimento (45 min)",d:null,prio:"p4"},
  {c:"Enviar follow up D+1 para 10",d:null,prio:"p4"},
  {c:"Enviar follow up D+3 para 5",d:null,prio:"p4"},
  {c:"Enviar 1 prova por contato",d:null,prio:"p4"},
  {c:"Pergunta: prioridade agora ou depois?",d:null,prio:"p4"},
  {c:"Atualizar pipeline",d:null,prio:"p4"},
  {c:"5. Diagnósticos e fechamento",d:null,prio:"p4"},
  {c:"Abrir com resumo do objetivo",d:null,prio:"p4"},
  {c:"Confirmar volume diário",d:null,prio:"p4"},
  {c:"Identificar gargalo",d:null,prio:"p4"},
  {c:"Quantificar impacto",d:null,prio:"p4"},
  {c:"Propor Agente 24h Standard",d:null,prio:"p4"},
  {c:"Validar objeção principal",d:null,prio:"p4"},
  {c:"Encaminhar para proposta",d:null,prio:"p4"},
  {c:"6. Proposta em velocidade (2h)",d:null,prio:"p4"},
  {c:"Montar proposta simples",d:null,prio:"p4"},
  {c:"Inserir dois cases curtos",d:null,prio:"p4"},
  {c:"Enviar com validade curta",d:null,prio:"p4"},
  {c:"Confirmar recebimento",d:null,prio:"p4"},
  {c:"Registrar no pipeline com data",d:null,prio:"p4"},
  {c:"7. Bloco 2 de prospecção (90 min)",d:null,prio:"p4"},
  {c:"Enviar 25 abordagens restantes",d:null,prio:"p4"},
  {c:"Repetir duas perguntas",d:null,prio:"p4"},
  {c:"Registrar no pipeline",d:null,prio:"p4"},
  {c:"8. Fechamento do dia (30 min)",d:null,prio:"p4"},
  {c:"Revisar propostas enviadas",d:null,prio:"p4"},
  {c:"Enviar mensagem de cobrança",d:null,prio:"p4"},
  {c:"Oferecer duas opções de condição",d:null,prio:"p4"},
  {c:"Confirmar forma de pagamento",d:null,prio:"p4"},
  {c:"Criação Calendário conteúdo",d:null,prio:"p4"},
  {c:"Criação ferramenta prospecção",d:null,prio:"p4"},
  {c:"Criação ferramenta de conteúdo",d:null,prio:"p4"},
  {c:"Criar materiais Avraham",d:null,prio:"p4"},
  {c:"Portfólio Geral",d:null,prio:"p4"},
  {c:"Agentes de IA",d:null,prio:"p4"},
  {c:"Disparos",d:null,prio:"p4"},
  {c:"Infraestrutura",d:null,prio:"p4"},
  {c:"Portfólio BR",d:null,prio:"p4"},
  {c:"Agentes MULTI LING",d:null,prio:"p4"},
  {c:"DISPAROS MULTI LING",d:null,prio:"p4"},
  {c:"Infra MULTI LING",d:null,prio:"p4"},
  {c:"Materiais Cases",d:null,prio:"p4"},
  {c:"Trocar palheta",d:null,prio:"p4"},
  {c:"Marcar endócrino",d:null,prio:"p4"},
  {c:"Marcar dentista",d:null,prio:"p4"},
];

const CALENDAR_EVENTS = [
  {h:"04:45",hf:"05:30",t:"Acordar, devocional, leitura",tipo:"pessoal",meet:null},
  {h:"05:30",hf:"06:00",t:"Estudar | Preparar o dia",tipo:"pessoal",meet:null},
  {h:"06:00",hf:"07:00",t:"Academia",tipo:"fitness",meet:null},
  {h:"07:00",hf:"07:30",t:"Estudo & Devocional",tipo:"pessoal",meet:null},
  {h:"07:30",hf:"08:00",t:"Story Rotina indo ao Escritório",tipo:"conteudo",meet:null},
  {h:"08:00",hf:"09:00",t:"Prospecção Ativa",tipo:"comercial",meet:"https://meet.google.com/gvb-ouks-gpt"},
  {h:"08:15",hf:"09:30",t:"FollowUp Clientes e Planejamento",tipo:"comercial",meet:null},
  {h:"09:00",hf:"10:00",t:"Joinzapp | Higor",tipo:"reuniao",meet:"https://meet.google.com/ikc-qktz-psr"},
  {h:"09:30",hf:"09:45",t:"Gravar e Editar Reels do dia",tipo:"conteudo",meet:null},
  {h:"18:00",hf:"19:00",t:"Afiar o Machado",tipo:"pessoal",meet:null},
  {h:"19:30",hf:"21:30",t:"Tempo de Qualidade com a esposa",tipo:"pessoal",meet:null},
  {h:"20:00",hf:"21:00",t:"Devocional",tipo:"pessoal",meet:"https://meet.google.com/nvq-nybx-pvp"},
  {h:"21:30",hf:"22:00",t:"Desligamento para Dormir",tipo:"pessoal",meet:null},
];

const TIPO_COR = {pessoal:"#8b5cf6",fitness:"#10b981",conteudo:"#f59e0b",comercial:"#dc2626",reuniao:"#6366f1"};
const TIPO_ICON = {pessoal:"ti-heart",fitness:"ti-barbell",conteudo:"ti-camera",comercial:"ti-target",reuniao:"ti-video"};

/* ── HELPERS ── */
function diasUteis(ano,mes){let d=0;const ul=new Date(ano,mes+1,0).getDate();for(let i=1;i<=ul;i++){const w=new Date(ano,mes,i).getDay();if(w!==0&&w!==6)d++;}return d;}
function diasUteisAte(ano,mes,dia){let d=0;for(let i=1;i<dia;i++){const w=new Date(ano,mes,i).getDay();if(w!==0&&w!==6)d++;}return d;}

function useCotacoes(){
  const[q,setQ]=useState({USD:{v:5.71,d:+0.12},EUR:{v:6.33,d:-0.08},GBP:{v:7.41,d:+0.15}});
  useEffect(()=>{const t=setInterval(()=>setQ(p=>({
    USD:{v:+(p.USD.v+(Math.random()-.5)*.018).toFixed(4),d:+((Math.random()-.5)*.6).toFixed(2)},
    EUR:{v:+(p.EUR.v+(Math.random()-.5)*.018).toFixed(4),d:+((Math.random()-.5)*.6).toFixed(2)},
    GBP:{v:+(p.GBP.v+(Math.random()-.5)*.018).toFixed(4),d:+((Math.random()-.5)*.6).toFixed(2)},
  })),6000);return()=>clearInterval(t);},[]);
  return q;
}

function useClock(){const[t,setT]=useState(new Date());useEffect(()=>{const i=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(i);},[]);return t;}

function getStatus(h,hf){
  const now=new Date(),cur=now.getHours()*60+now.getMinutes();
  const[sh,sm]=h.split(":").map(Number),[eh,em]=hf.split(":").map(Number);
  const s=sh*60+sm,e=eh*60+em;
  if(cur>=e)return"passado";if(cur>=s&&cur<e)return"agora";if(s-cur<=30&&s-cur>0)return"proximo";return"futuro";
}

/* ── HOOK PIPEFY REAL TIME ── */
function usePipefyCards() {
  const [cards, setCards] = useState(PIPEFY_FALLBACK);
  const [status, setStatus] = useState("fallback"); // "fallback" | "loading" | "ok" | "error"
  const [lastSync, setLastSync] = useState(null);

  const fetchCards = useCallback(async () => {
    if (!PIPEFY_TOKEN) return;
    setStatus("loading");
    try {
      const res = await fetch("https://api.pipefy.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PIPEFY_TOKEN}`,
        },
        body: JSON.stringify({
          query: PIPEFY_QUERY,
          variables: { pipeId: PIPE_ID },
        }),
      });
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0]?.message);
      const parsed = parsePipefyCards(json.data);
      if (parsed && parsed.length > 0) {
        setCards(parsed);
        setStatus("ok");
        setLastSync(new Date());
      }
    } catch (e) {
      console.warn("Pipefy fetch error:", e);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchCards();
    const interval = setInterval(fetchCards, PIPEFY_POLL_MS);
    return () => clearInterval(interval);
  }, [fetchCards]);

  return { cards, status, lastSync, refetch: fetchCards };
}

function Ring({pct,size=52,stroke=5,color="#6366f1"}){
  const r=(size-stroke)/2,circ=2*Math.PI*r,off=circ*(1-Math.min(pct/100,1));
  return(<svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}22`} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dashoffset .6s"}}/><text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle" style={{fontSize:9,fontWeight:700,fill:"var(--color-text-primary)"}}>{Math.round(pct)}%</text></svg>);
}
function Spark({data,color="#6366f1",h=26,w=80}){
  if(!data||data.length<2)return null;
  const mn=Math.min(...data),mx=Math.max(...data),rg=mx-mn||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/rg)*(h-4)-2}`).join(" ");
  const last=pts.trim().split(" ").pop().split(",");
  return(<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx={last[0]} cy={last[1]} r="3" fill={color}/></svg>);
}
function Card({children,s={}}){return(<div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:13,padding:"1rem 1.15rem",...s}}>{children}</div>);}
function SH({icon,label,right}){return(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}><div style={{display:"flex",alignItems:"center",gap:6}}><i className={`ti ${icon}`} style={{fontSize:13,color:"#6366f1"}}/><span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",color:"var(--color-text-secondary)"}}>{label}</span></div>{right&&<span style={{fontSize:10,color:"var(--color-text-secondary)"}}>{right}</span>}</div>);}

function PipefyBadge({status, lastSync, refetch}) {
  const cfg = {
    ok:      {cor:"#16a34a", txt:"Ao vivo", icon:"ti-circle-check"},
    loading: {cor:"#6366f1", txt:"Sincronizando...", icon:"ti-loader-2"},
    error:   {cor:"#dc2626", txt:"Erro na sync", icon:"ti-alert-circle"},
    fallback:{cor:"#94a3b8", txt:"Dados de 01/06", icon:"ti-database"},
  };
  const c = cfg[status] || cfg.fallback;
  const syncTxt = lastSync ? `${pad2(lastSync.getHours())}:${pad2(lastSync.getMinutes())}` : null;
  return (
    <span
      onClick={refetch}
      title="Clique para sincronizar agora"
      style={{fontSize:9,padding:"2px 8px",borderRadius:20,background:`${c.cor}15`,color:c.cor,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,userSelect:"none"}}
    >
      <i className={`ti ${c.icon}`} style={{fontSize:9,animation:status==="loading"?"spin 1s linear infinite":undefined}}/>
      {c.txt}{syncTxt && ` · ${syncTxt}`}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function App(){
  const now=useClock(),cotq=useCotacoes();
  const { cards: PIPEFY_CARDS, status: pipefyStatus, lastSync, refetch } = usePipefyCards();
  const[tab,setTab]=useState("overview");
  const[metaMes,setMetaMes]=useState(50000);
  const[faturado,setFaturado]=useState(0);
  const[ticket,setTicket]=useState(4000);
  const[vendasHoje,setVendasHoje]=useState(1);
  const[r_close,setRClose]=useState(20);
  const[r_qual,setRQual]=useState(60);
  const[r_show,setRShow]=useState(70);
  const[editFoco,setEditFoco]=useState(false);
  const[tarefas,setTarefas]=useState(TODOIST_RAW.map(t=>({...t,feita:false})));
  const[faseF,setFaseF]=useState("Todos");

  const hora=now.getHours();
  const sauda=hora<12?"Bom dia":hora<18?"Boa tarde":"Boa noite";

  const abertos=PIPEFY_CARDS.filter(c=>c.fase==="4-Proposta"||c.fase==="5-Negociação");
  const pipeAberto=abertos.reduce((a,c)=>a+(c.valor||0),0);
  const mrrRec=PIPEFY_CARDS.filter(c=>c.fase==="Clientes Recorrentes").reduce((a,c)=>a+(c.valor||0),0);

  const gap=Math.max(0,metaMes-faturado);
  const pctMeta=Math.min((faturado/metaMes)*100,100);
  const ano=now.getFullYear(),mes=now.getMonth(),dia=now.getDate();
  const totalDU=diasUteis(ano,mes),duPassados=diasUteisAte(ano,mes,dia),duRestam=totalDU-duPassados;
  const metaDiaria=metaMes/totalDU;
  const esperadoHoje=metaDiaria*duPassados;
  const ritmoR=esperadoHoje>0?(faturado/esperadoHoje)*100:100;
  const ritmo=ritmoR>=95?{cor:"#16a34a",txt:"No ritmo",bg:"rgba(22,163,74,.08)"}:ritmoR>=75?{cor:"#f59e0b",txt:"Abaixo",bg:"rgba(245,158,11,.08)"}:{cor:"#dc2626",txt:"Crítico",bg:"rgba(220,38,38,.08)"};

  const vendasNec=Math.ceil(gap/ticket);
  const propostasNec=Math.ceil(vendasNec/(r_close/100));
  const reunioesNec=Math.ceil(propostasNec/(r_qual/100));
  const agendNec=Math.ceil(reunioesNec/(r_show/100));
  const urgAc=gap===0?"#16a34a":pctMeta>=70?"#d97706":"#dc2626";
  const urgBg=gap===0?"rgba(22,163,74,.07)":pctMeta>=70?"rgba(217,119,6,.07)":"rgba(220,38,38,.07)";
  const urgTitulo=gap===0?"Meta atingida!":vendasNec<=2?`Feche ${vendasNec} proposta(s) no pipeline.`:"Pipeline parcial. Feche + prospecte.";
  const urgMsg=gap===0?"Foco em superar e documentar novos cases.":pipeAberto/gap>=1.5?`R$ ${fmtNum(pipeAberto)} em pipeline cobre o gap. Priorize follow-ups.`:`Gere ${Math.max(0,vendasNec-abertos.length)} lead(s) novo(s) hoje.`;

  const fasesOrd=Object.keys(FASE_META);
  const cardsFiltrados=(faseF==="Todos"?PIPEFY_CARDS:PIPEFY_CARDS.filter(c=>c.fase===faseF)).sort((a,b)=>(b.valor||0)-(a.valor||0));
  const totalFiltrado=cardsFiltrados.reduce((a,c)=>a+(c.valor||0),0);

  const tabs=[{id:"overview",icon:"ti-layout-dashboard",l:"Overview"},{id:"pipeline",icon:"ti-currency-dollar",l:"Pipeline"},{id:"agenda",icon:"ti-calendar",l:"Agenda"},{id:"tarefas",icon:"ti-checkbox",l:"Tarefas"},{id:"metricas",icon:"ti-chart-bar",l:"Métricas"}];

  const hoje=`${ano}-${pad2(mes+1)}-${pad2(dia)}`;
  const tarefasHoje=tarefas.filter(t=>t.d===hoje);
  const tarefasSemData=tarefas.filter(t=>!t.d);

  return(
    <div style={{fontFamily:"var(--font-sans)",maxWidth:760,margin:"0 auto",padding:"1rem 0 2.5rem"}}>
      {/* ─ HEADER ─ */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
            <div style={{width:24,height:24,borderRadius:7,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-bolt" style={{fontSize:13,color:"#fff"}}/></div>
            <span style={{fontSize:11,fontWeight:700,color:"#6366f1",letterSpacing:".4px"}}>DAILY PANEL</span>
            <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:"rgba(99,102,241,.1)",color:"#6366f1"}}>Avraham</span>
          </div>
          <p style={{fontSize:22,fontWeight:600,margin:"0 0 2px"}}>{sauda}, Higor</p>
          <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:0}}>{DIAS[now.getDay()]}, {now.getDate()} de {MESES[now.getMonth()]} de {now.getFullYear()}</p>
        </div>
        <div style={{textAlign:"right"}}>
          <p style={{fontSize:30,fontWeight:500,letterSpacing:"-1px",margin:0,fontVariantNumeric:"tabular-nums"}}>{pad2(now.getHours())}:{pad2(now.getMinutes())}:{pad2(now.getSeconds())}</p>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4,flexWrap:"wrap"}}>
            {Object.entries(cotq).map(([m,d])=>(<span key={m} style={{fontSize:10,color:d.d>=0?"#16a34a":"#dc2626"}}>{m} R${d.v.toFixed(2).replace(".",",")} {d.d>=0?"▲":"▼"}{Math.abs(d.d).toFixed(2)}%</span>))}
          </div>
        </div>
      </div>

      {/* ─ FOCO DO DIA ─ */}
      <div style={{background:urgBg,border:`0.5px solid ${urgAc}35`,borderLeft:`3px solid ${urgAc}`,borderRadius:12,padding:"0.9rem 1.1rem",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
          <div style={{flex:1}}>
            <p style={{fontSize:9,fontWeight:700,color:urgAc,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:".5px"}}>Foco do dia</p>
            <p style={{fontSize:15,fontWeight:600,margin:"0 0 2px"}}>{urgTitulo}</p>
            <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:0}}>{urgMsg}</p>
          </div>
          <button onClick={()=>setEditFoco(v=>!v)} style={{fontSize:10,padding:"3px 9px",borderRadius:6,border:"0.5px solid var(--color-border-secondary)",background:"transparent",cursor:"pointer",flexShrink:0}}><i className="ti ti-edit" style={{fontSize:11,marginRight:3}}/>Editar</button>
        </div>
        {editFoco&&(
          <div style={{marginTop:14,paddingTop:12,borderTop:`0.5px solid ${urgAc}30`}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
              {[["metaMes","Meta do mês",setMetaMes],["faturado","Faturado",setFaturado],["vendasHoje","Vendas hoje",setVendasHoje]].map(([k,l,fn])=>(<div key={k}>
                <label style={{fontSize:9,color:"var(--color-text-secondary)",display:"block",marginBottom:3,textTransform:"uppercase"}}>{l}</label>
                <input type="text" defaultValue={(k==="vendasHoje"?vendasHoje:k==="faturado"?faturado:metaMes).toLocaleString("pt-BR")} onBlur={e=>{const v=parseInt(e.target.value.replace(/\D/g,""))||0;fn(v);}} style={{width:"100%",boxSizing:"border-box",fontSize:13,fontWeight:600,padding:"5px 8px",borderRadius:6,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)"}}/>
              </div>))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[["Fechamento %",r_close,setRClose],["Qualificação %",r_qual,setRQual],["Show-up %",r_show,setRShow]].map(([l,v,fn])=>(<div key={l}>
                <label style={{fontSize:9,color:"var(--color-text-secondary)",display:"block",marginBottom:3,textTransform:"uppercase"}}>{l}</label>
                <input type="number" value={v} onChange={e=>fn(Math.max(1,Math.min(100,+e.target.value)))} style={{width:"100%",boxSizing:"border-box",padding:"5px 8px",borderRadius:6,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)"}}/>
              </div>))}
            </div>
          </div>
        )}
      </div>

      {/* ─ KPI STRIP ─ */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <Card s={{textAlign:"center",padding:"0.7rem"}}>
          <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 5px",textTransform:"uppercase"}}>Faturado</p>
          <p style={{fontSize:17,fontWeight:700,margin:0}}>{fmtBRL(faturado)}</p>
          <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"2px 0 0"}}>meta {fmtBRL(metaMes)}</p>
        </Card>
        <Card s={{textAlign:"center",padding:"0.7rem"}}>
          <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 5px",textTransform:"uppercase"}}>Gap</p>
          <p style={{fontSize:17,fontWeight:700,margin:0,color:gap===0?"#16a34a":"#dc2626"}}>{fmtBRL(gap)}</p>
          <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"2px 0 0"}}>~{vendasNec} venda(s)</p>
        </Card>
        <Card s={{textAlign:"center",padding:"0.7rem"}}>
          <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 5px",textTransform:"uppercase"}}>Pipeline</p>
          <p style={{fontSize:17,fontWeight:700,margin:0}}>{fmtBRL(pipeAberto)}</p>
          <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"2px 0 0"}}>{abertos.length} negócios</p>
        </Card>
        <Card s={{textAlign:"center",padding:"0.7rem",background:ritmo.bg,borderLeft:`3px solid ${ritmo.cor}`}}>
          <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 5px",textTransform:"uppercase"}}>Ritmo</p>
          <p style={{fontSize:17,fontWeight:700,margin:0,color:ritmo.cor}}>{Math.round(ritmoR)}%</p>
          <p style={{fontSize:9,color:ritmo.cor,margin:"2px 0 0"}}>{ritmo.txt}</p>
        </Card>
      </div>

      {/* ─ TABS ─ */}
      <div style={{display:"flex",gap:2,marginBottom:14,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
        {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{fontSize:11,padding:"5px 12px",borderRadius:"7px 7px 0 0",border:"none",background:tab===t.id?"#6366f1":"transparent",color:tab===t.id?"#fff":"var(--color-text-secondary)",fontWeight:tab===t.id?700:400,cursor:"pointer"}}><i className={`ti ${t.icon}`} style={{fontSize:11,marginRight:4}}/>{t.l}</button>))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {tab==="overview"&&(<div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>Faturamento</span>
              <Ring pct={pctMeta} size={42} stroke={4} color="#6366f1"/>
            </div>
            <p style={{fontSize:20,fontWeight:700,margin:"0 0 2px"}}>{fmtBRL(faturado)}</p>
            <p style={{fontSize:10,color:"var(--color-text-secondary)",margin:"0 0 7px"}}>Meta {fmtBRL(metaMes)}</p>
            <div style={{height:3,borderRadius:3,background:"rgba(99,102,241,.12)"}}><div style={{width:`${pctMeta}%`,height:"100%",background:"#6366f1",borderRadius:3,transition:"width .6s"}}/></div>
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>Pipeline aberto</span>
              <PipefyBadge status={pipefyStatus} lastSync={lastSync} refetch={refetch}/>
            </div>
            <p style={{fontSize:20,fontWeight:700,margin:"0 0 2px"}}>{fmtBRL(pipeAberto)}</p>
            <p style={{fontSize:10,color:"var(--color-text-secondary)",margin:"0 0 6px"}}>{abertos.length} negócios em aberto</p>
            <Spark data={HISTORICO} color="#f59e0b" w={80} h={24}/>
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>MRR Recorrente</span>
              <i className="ti ti-repeat" style={{fontSize:16,color:"#10b981"}}/>
            </div>
            <p style={{fontSize:20,fontWeight:700,margin:"0 0 2px",color:"#10b981"}}>{fmtBRL(mrrRec)}</p>
            <p style={{fontSize:10,color:"var(--color-text-secondary)",margin:0}}>{PIPEFY_CARDS.filter(c=>c.fase==="Clientes Recorrentes").length} clientes recorrentes</p>
          </Card>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:10}}>
          <Card>
            <SH icon="ti-calendar" label="Google Calendar" right={`${CALENDAR_EVENTS.length} eventos`}/>
            <div style={{maxHeight:280,overflowY:"auto"}}>
              {CALENDAR_EVENTS.map((e,i)=>{const st=getStatus(e.h,e.hf);return(
                <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:i<CALENDAR_EVENTS.length-1?"0.5px solid var(--color-border-tertiary)":"none",opacity:st==="passado"?.4:1}}>
                  <div style={{minWidth:36,textAlign:"center"}}>
                    <p style={{fontSize:11,fontWeight:700,margin:0,color:st==="agora"?"#10b981":st==="proximo"?"#f59e0b":"var(--color-text-primary)",fontVariantNumeric:"tabular-nums"}}>{e.h}</p>
                    <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:0}}>{e.hf}</p>
                  </div>
                  <div style={{width:3,borderRadius:2,background:TIPO_COR[e.tipo]||"#94a3b8",flexShrink:0,alignSelf:"stretch"}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:11,fontWeight:500,margin:"0 0 3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:st==="passado"?"line-through":"none"}}>{e.t}</p>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                      {st==="agora"&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:20,background:"rgba(16,185,129,.12)",color:"#059669"}}>Agora</span>}
                      {st==="proximo"&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:20,background:"rgba(245,158,11,.12)",color:"#d97706"}}>Em breve</span>}
                      <span style={{fontSize:8,padding:"1px 5px",borderRadius:20,background:`${TIPO_COR[e.tipo]}18`,color:TIPO_COR[e.tipo]||"#94a3b8"}}><i className={`ti ${TIPO_ICON[e.tipo]||"ti-calendar"}`} style={{fontSize:8,marginRight:2}}/>{e.tipo}</span>
                      {e.meet&&<a href={e.meet} style={{fontSize:8,padding:"1px 5px",borderRadius:20,background:"rgba(99,102,241,.1)",color:"#6366f1",textDecoration:"none"}}>Meet</a>}
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </Card>
          <Card>
            <SH icon="ti-checkbox" label="Tarefas de hoje" right={`${tarefasHoje.filter(t=>!t.feita).length}/${tarefasHoje.length}`}/>
            {tarefasHoje.length===0?<p style={{fontSize:11,color:"var(--color-text-secondary)"}}>Nenhuma tarefa para hoje</p>:
            tarefasHoje.slice(0,8).map((t,i)=>(<div key={i} onClick={()=>{const idx=tarefas.findIndex(x=>x.c===t.c);setTarefas(p=>p.map((x,j)=>j===idx?{...x,feita:!x.feita}:x));}} style={{display:"flex",gap:8,padding:"6px 0",cursor:"pointer",borderBottom:i<Math.min(tarefasHoje.length,8)-1?"0.5px solid var(--color-border-tertiary)":"none",opacity:t.feita?.45:1}}>
              <i className={`ti ${t.feita?"ti-circle-check":"ti-circle"}`} style={{fontSize:14,color:t.feita?"#16a34a":"var(--color-text-secondary)",flexShrink:0}}/>
              <p style={{fontSize:11,margin:0,textDecoration:t.feita?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.c}</p>
            </div>))}
          </Card>
        </div>

        <Card>
          <SH icon="ti-world" label="Cotações" right="Atualiza a cada 6s"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {Object.entries(cotq).map(([m,d])=>(<div key={m} style={{background:"var(--color-background-secondary)",borderRadius:9,padding:"9px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,fontWeight:700}}>{m}/BRL</span>
                <span style={{fontSize:9,padding:"1px 6px",borderRadius:20,background:d.d>=0?"rgba(22,163,74,.12)":"rgba(220,38,38,.12)",color:d.d>=0?"#16a34a":"#dc2626"}}>{d.d>=0?"▲":"▼"}{Math.abs(d.d).toFixed(2)}%</span>
              </div>
              <p style={{fontSize:17,fontWeight:600,margin:0,fontVariantNumeric:"tabular-nums"}}>R$ {d.v.toFixed(2).replace(".",",")}</p>
            </div>))}
          </div>
        </Card>
      </div>)}

      {/* ═══ PIPELINE ═══ */}
      {tab==="pipeline"&&(<div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>Pipe 306914700 · Avraham CRM de Vendas</span>
          <PipefyBadge status={pipefyStatus} lastSync={lastSync} refetch={refetch}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          <Card><p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 3px",textTransform:"uppercase"}}>Total filtrado</p><p style={{fontSize:18,fontWeight:700,margin:0}}>{fmtBRL(totalFiltrado)}</p></Card>
          <Card><p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 3px",textTransform:"uppercase"}}>Cards</p><p style={{fontSize:18,fontWeight:700,margin:0,color:"#6366f1"}}>{cardsFiltrados.length}</p></Card>
          <Card><p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 3px",textTransform:"uppercase"}}>MRR Recorrente</p><p style={{fontSize:18,fontWeight:700,margin:0,color:"#10b981"}}>{fmtBRL(mrrRec)}</p></Card>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <button onClick={()=>setFaseF("Todos")} style={{fontSize:10,padding:"3px 10px",borderRadius:20,border:"none",background:faseF==="Todos"?"#6366f1":"var(--color-background-secondary)",color:faseF==="Todos"?"#fff":"var(--color-text-secondary)",cursor:"pointer",fontWeight:faseF==="Todos"?600:400}}>Todos {PIPEFY_CARDS.length}</button>
          {fasesOrd.map(f=>(<button key={f} onClick={()=>setFaseF(f)} style={{fontSize:10,padding:"3px 10px",borderRadius:20,border:"none",background:faseF===f?faseCor(f):"var(--color-background-secondary)",color:faseF===f?"#fff":"var(--color-text-secondary)",cursor:"pointer",fontWeight:faseF===f?600:400}}>{FASE_META[f].abrev} {PIPEFY_CARDS.filter(c=>c.fase===f).length}</button>))}
        </div>
        <Card>
          <SH icon="ti-building" label="Pipefy — CRM de Vendas" right={`${cardsFiltrados.length} cards`}/>
          <div style={{maxHeight:460,overflowY:"auto"}}>
          {cardsFiltrados.map((p,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<cardsFiltrados.length-1?"0.5px solid var(--color-border-tertiary)":"none"}}>
            <div style={{width:32,height:32,borderRadius:8,background:`${faseCor(p.fase)}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="ti ti-briefcase" style={{fontSize:14,color:faseCor(p.fase)}}/></div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:12,fontWeight:500,margin:"0 0 3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nome}</p>
              <div style={{display:"flex",gap:4}}>
                <span style={{fontSize:9,padding:"1px 6px",borderRadius:20,background:`${faseCor(p.fase)}20`,color:faseCor(p.fase)}}>{FASE_META[p.fase]?.abrev || p.fase}</span>
                {p.seg&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:20,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)"}}>{p.seg}</span>}
              </div>
            </div>
            <p style={{fontSize:13,fontWeight:700,margin:0,color:p.valor?undefined:"var(--color-text-secondary)"}}>{p.valor?fmtBRL(p.valor):"—"}</p>
          </div>))}
          </div>
        </Card>
        <Card>
          <SH icon="ti-chart-bar" label="Distribuição por fase"/>
          {fasesOrd.map(f=>{const v=PIPEFY_CARDS.filter(c=>c.fase===f).reduce((a,c)=>a+(c.valor||0),0);const n=PIPEFY_CARDS.filter(c=>c.fase===f).length;const max=Math.max(...fasesOrd.map(ff=>PIPEFY_CARDS.filter(c=>c.fase===ff).reduce((a,c)=>a+(c.valor||0),0)),1);return(<div key={f} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span style={{fontSize:10,color:"var(--color-text-secondary)",minWidth:80,textAlign:"right"}}>{FASE_META[f].abrev}</span>
            <div style={{flex:1,height:8,background:"var(--color-background-secondary)",borderRadius:4,overflow:"hidden"}}><div style={{width:`${(v/max)*100}%`,height:"100%",background:faseCor(f),borderRadius:4,minWidth:v>0?3:0}}/></div>
            <span style={{fontSize:9,minWidth:90,textAlign:"right"}}>{v>0?fmtBRL(v):"—"} <span style={{color:"var(--color-text-secondary)"}}>({n})</span></span>
          </div>);})}
        </Card>
      </div>)}

      {/* ═══ AGENDA ═══ */}
      {tab==="agenda"&&(<Card>
        <SH icon="ti-calendar" label="Agenda completa" right={`${CALENDAR_EVENTS.length} eventos`}/>
        {CALENDAR_EVENTS.map((e,i)=>{const st=getStatus(e.h,e.hf);return(
          <div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<CALENDAR_EVENTS.length-1?"0.5px solid var(--color-border-tertiary)":"none",opacity:st==="passado"?.4:1}}>
            <div style={{minWidth:44,textAlign:"center"}}>
              <p style={{fontSize:13,fontWeight:700,margin:0,color:st==="agora"?"#10b981":st==="proximo"?"#f59e0b":"var(--color-text-primary)"}}>{e.h}</p>
              <p style={{fontSize:10,color:"var(--color-text-secondary)",margin:0}}>{e.hf}</p>
            </div>
            <div style={{width:3,borderRadius:2,background:TIPO_COR[e.tipo]||"#94a3b8",alignSelf:"stretch",flexShrink:0}}/>
            <div style={{flex:1}}>
              <p style={{fontSize:12,fontWeight:500,margin:"0 0 4px",textDecoration:st==="passado"?"line-through":"none"}}>{e.t}</p>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {st==="agora"&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:"rgba(16,185,129,.12)",color:"#059669"}}>Em andamento</span>}
                {st==="proximo"&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:"rgba(245,158,11,.12)",color:"#d97706"}}>Em breve</span>}
                {st==="passado"&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)"}}>Encerrado</span>}
                <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:`${TIPO_COR[e.tipo]||"#94a3b8"}18`,color:TIPO_COR[e.tipo]||"#94a3b8"}}><i className={`ti ${TIPO_ICON[e.tipo]||"ti-calendar"}`} style={{fontSize:9,marginRight:2}}/>{e.tipo}</span>
                {e.meet&&<a href={e.meet} style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:"rgba(99,102,241,.1)",color:"#6366f1",textDecoration:"none"}}><i className="ti ti-video" style={{fontSize:9,marginRight:2}}/>Meet</a>}
              </div>
            </div>
          </div>
        );})}
      </Card>)}

      {/* ═══ TAREFAS ═══ */}
      {tab==="tarefas"&&(<div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          <Card s={{textAlign:"center",padding:"0.7rem"}}><p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 4px",textTransform:"uppercase"}}>Total</p><p style={{fontSize:18,fontWeight:700,margin:0}}>{tarefas.length}</p></Card>
          <Card s={{textAlign:"center",padding:"0.7rem"}}><p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 4px",textTransform:"uppercase"}}>Concluídas</p><p style={{fontSize:18,fontWeight:700,margin:0,color:"#16a34a"}}>{tarefas.filter(t=>t.feita).length}</p></Card>
          <Card s={{textAlign:"center",padding:"0.7rem"}}><p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 4px",textTransform:"uppercase"}}>De hoje</p><p style={{fontSize:18,fontWeight:700,margin:0,color:"#6366f1"}}>{tarefasHoje.length}</p></Card>
        </div>
        {tarefasHoje.length>0&&(<Card>
          <SH icon="ti-calendar" label="Para hoje" right={`${tarefasHoje.filter(t=>!t.feita).length} pendentes`}/>
          {tarefasHoje.map((t,i)=>{const idx=tarefas.indexOf(t);return(<div key={i} onClick={()=>setTarefas(p=>p.map((x,j)=>j===idx?{...x,feita:!x.feita}:x))} style={{display:"flex",gap:8,padding:"8px 0",cursor:"pointer",borderBottom:i<tarefasHoje.length-1?"0.5px solid var(--color-border-tertiary)":"none",opacity:t.feita?.45:1}}>
            <i className={`ti ${t.feita?"ti-circle-check":"ti-circle"}`} style={{fontSize:15,color:t.feita?"#16a34a":"var(--color-text-secondary)",flexShrink:0}}/>
            <p style={{fontSize:12,margin:0,textDecoration:t.feita?"line-through":"none"}}>{t.c}</p>
          </div>);})}
        </Card>)}
        <Card>
          <SH icon="ti-list" label="Backlog" right={`${tarefasSemData.filter(t=>!t.feita).length} pendentes`}/>
          <div style={{maxHeight:400,overflowY:"auto"}}>
          {tarefasSemData.map((t,i)=>{const idx=tarefas.indexOf(t);return(<div key={i} onClick={()=>setTarefas(p=>p.map((x,j)=>j===idx?{...x,feita:!x.feita}:x))} style={{display:"flex",gap:8,padding:"6px 0",cursor:"pointer",borderBottom:i<tarefasSemData.length-1?"0.5px solid var(--color-border-tertiary)":"none",opacity:t.feita?.45:1}}>
            <i className={`ti ${t.feita?"ti-circle-check":"ti-circle"}`} style={{fontSize:14,color:t.feita?"#16a34a":"var(--color-text-secondary)",flexShrink:0}}/>
            <p style={{fontSize:11,margin:0,textDecoration:t.feita?"line-through":"none"}}>{t.c}</p>
          </div>);})}
          </div>
        </Card>
      </div>)}

      {/* ═══ MÉTRICAS ═══ */}
      {tab==="metricas"&&(<div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card>
          <SH icon="ti-trending-up" label="Histórico semanal — Faturamento"/>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:70,marginBottom:8}}>
            {HISTORICO.map((v,i)=>{const isL=i===HISTORICO.length-1;const h=v>0?Math.max(6,(v/Math.max(...HISTORICO.filter(x=>x>0)))*66):4;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:8,color:isL?"#6366f1":"var(--color-text-secondary)"}}>{v>0?(v/1000).toFixed(0)+"k":"—"}</span><div style={{width:"100%",height:h,borderRadius:"3px 3px 0 0",background:isL?"#6366f1":"rgba(99,102,241,.25)"}}/></div>);})}
          </div>
          <div style={{display:"flex"}}>{["S-6","S-5","S-4","S-3","S-2","S-1","Atual"].map(l=>(<span key={l} style={{flex:1,textAlign:"center",fontSize:8,color:"var(--color-text-secondary)"}}>{l}</span>))}</div>
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          <Card s={{display:"flex",flexDirection:"column",alignItems:"center",padding:".85rem"}}>
            <Ring pct={pctMeta} size={58} stroke={5} color="#6366f1"/>
            <p style={{fontSize:10,color:"var(--color-text-secondary)",margin:"6px 0 0"}}>Meta faturamento</p>
          </Card>
          <Card s={{display:"flex",flexDirection:"column",alignItems:"center",padding:".85rem"}}>
            <Ring pct={Math.min((pipeAberto/metaMes)*100,100)} size={58} stroke={5} color="#f59e0b"/>
            <p style={{fontSize:10,color:"var(--color-text-secondary)",margin:"6px 0 0"}}>Pipeline/Meta</p>
          </Card>
          <Card s={{display:"flex",flexDirection:"column",alignItems:"center",padding:".85rem"}}>
            <Ring pct={tarefas.length?Math.round((tarefas.filter(t=>t.feita).length/tarefas.length)*100):0} size={58} stroke={5} color="#10b981"/>
            <p style={{fontSize:10,color:"var(--color-text-secondary)",margin:"6px 0 0"}}>Tarefas</p>
          </Card>
        </div>
        <Card>
          <SH icon="ti-report-analytics" label="Indicadores operacionais"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {[["Gap absoluto",fmtBRL(gap),"#dc2626"],["Vendas necessárias",vendasNec,"#6366f1"],["Reuniões a agendar",agendNec,"#f59e0b"],["MRR Recorrente",fmtBRL(mrrRec),"#10b981"],["Dias úteis restantes",duRestam,"#8b5cf6"],["Meta diária",fmtBRL(metaDiaria),"#6366f1"]].map(([l,v,c])=>(<div key={l} style={{background:"var(--color-background-secondary)",borderRadius:8,padding:"9px 11px"}}>
              <p style={{fontSize:9,color:"var(--color-text-secondary)",margin:"0 0 3px",textTransform:"uppercase"}}>{l}</p>
              <p style={{fontSize:16,fontWeight:700,margin:0,color:c}}>{v}</p>
            </div>))}
          </div>
        </Card>
      </div>)}

      <div style={{marginTop:18,paddingTop:10,borderTop:"0.5px solid var(--color-border-tertiary)",display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--color-text-secondary)"}}>
        <span>Pipefy · Todoist · Google Calendar</span>
        <span>Avraham Digital · {now.getFullYear()}</span>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
