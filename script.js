
const CONFIG = {
  whatsappNumber: "5531998261608",
  instagram: "nexor_digital_"
};

const loader = document.getElementById("loader");
const loaderCount = document.getElementById("loaderCount");
const line = document.querySelector(".loader-line i");
let count = 0;
const loading = setInterval(()=>{
  count += Math.ceil(Math.random()*8);
  if(count >= 100){
    count = 100;
    clearInterval(loading);
    setTimeout(()=>loader.classList.add("hide"), 250);
  }
  loaderCount.textContent = String(count).padStart(2,"0");
  line.style.width = count + "%";
}, 55);

const cursor = document.getElementById("cursor");
window.addEventListener("pointermove", e=>{
  cursor.style.left = e.clientX+"px";
  cursor.style.top = e.clientY+"px";
});
document.querySelectorAll("a,button,.project").forEach(el=>{
  el.addEventListener("mouseenter",()=>{cursor.style.width="42px";cursor.style.height="42px"});
  el.addEventListener("mouseleave",()=>{cursor.style.width="10px";cursor.style.height="10px"});
});

const menu = document.getElementById("menuPanel");
document.getElementById("menuTrigger").onclick = ()=>menu.classList.add("open");
document.getElementById("menuClose").onclick = ()=>menu.classList.remove("open");
menu.querySelectorAll("a").forEach(a=>a.onclick=()=>menu.classList.remove("open"));

document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.12;
    const y=(e.clientY-r.top-r.height/2)*.12;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("mouseleave",()=>el.style.transform="translate(0,0)");
});

const heroLetters=[...document.querySelectorAll(".hero-word span")];
window.addEventListener("pointermove",e=>{
  if(innerWidth<900)return;
  const nx=e.clientX/innerWidth-.5;
  heroLetters.forEach((l,i)=>l.style.transform=`translateY(${nx*(i-2)*8}px)`);
});

document.getElementById("contactBtn").addEventListener("click",()=>{
  const service=document.getElementById("serviceSelect").value;
  const msg=`Olá! Vim pelo site da NEXOR e gostaria de falar sobre ${service}.`;
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`,"_blank");
});

/* Compact project configurator */
const DETAIL_OPTIONS = {
  "Site": [
    "Institucional","Landing Page","Catálogo","E-commerce","Portfólio",
    "One page","Várias páginas","Hero fixo","Hero carrossel","Hero vídeo",
    "Hero animado","WhatsApp","Instagram","Formulário","Painel admin",
    "Catálogo editável","Login","Integrações","Luxo","Minimalista","Hi-tech"
  ],
  "Social Media": [
    "Gestão completa","Só criação","Estratégia","Posts","Carrosséis","Reels",
    "Stories","Captação","Edição","Roteiros","Calendário","Identidade visual"
  ],
  "Sistema": [
    "Sistema web","Painel admin","Login","Níveis de acesso","Banco de dados",
    "Relatórios","Dashboard","Cadastros","Estoque","Financeiro","Agenda",
    "WhatsApp","API","Integrações"
  ],
  "Automação / IA": [
    "Atendimento","Conteúdo","Tarefas internas","Análise de dados","Agente IA",
    "Textos e roteiros","WhatsApp","Integrações","Painel","Banco de dados"
  ],
  "Filmmaker": [
    "Vertical","Horizontal","Campanha","Institucional","Reels","Entrevista",
    "Produto","Edição","Legendas","Trilha","Vários cortes","Direção de roteiro"
  ],
  "Storymaker": [
    "Evento","Inauguração","Bastidores","Lançamento","Rotina","Stories ao vivo",
    "Reels rápidos","Fotos","Depoimentos","Melhores momentos"
  ],
  "Orientação": [
    "Quero vender mais","Melhorar minha imagem","Preciso de um site",
    "Organizar processos","Automatizar tarefas","Produzir conteúdo","Divulgar produto"
  ]
};

const compactState = {
  service:"",
  details:[],
  execution:{},
  description:""
};

const serviceChips = [...document.querySelectorAll(".service-chip")];
const detailChips = document.getElementById("detailChips");
const detailHint = document.getElementById("detailHint");
const desc = document.getElementById("compactDescription");
const status = document.getElementById("compactStatus");
const waBtn = document.getElementById("compactWhatsapp");

function updateCompact(){
  compactState.description = desc.value.trim();
  waBtn.disabled = !compactState.service;
  const count = compactState.details.length;
  status.textContent = compactState.service
    ? `${compactState.service} selecionado · ${count} opção${count===1?"":"ões"} marcada${count===1?"":"s"}.`
    : "Selecione um serviço para começar.";
}

function renderDetails(service){
  detailChips.innerHTML="";
  compactState.details=[];
  const opts = DETAIL_OPTIONS[service] || [];
  detailHint.textContent = opts.length ? "Marque apenas o que fizer sentido." : "Selecione um serviço acima.";
  opts.forEach(label=>{
    const b=document.createElement("button");
    b.className="chip detail-chip";
    b.textContent=label;
    b.addEventListener("click",()=>{
      b.classList.toggle("selected");
      if(b.classList.contains("selected")){
        compactState.details.push(label);
      }else{
        compactState.details=compactState.details.filter(x=>x!==label);
      }
      updateCompact();
    });
    detailChips.appendChild(b);
  });
}

serviceChips.forEach(btn=>{
  btn.addEventListener("click",()=>{
    serviceChips.forEach(x=>x.classList.remove("selected"));
    btn.classList.add("selected");
    compactState.service=btn.dataset.service;
    renderDetails(compactState.service);
    updateCompact();
  });
});

document.querySelectorAll(".execution-chip").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const group=btn.dataset.group;
    document.querySelectorAll(`.execution-chip[data-group="${group}"]`).forEach(x=>x.classList.remove("selected"));
    btn.classList.add("selected");
    compactState.execution[group]=btn.dataset.value;
    updateCompact();
  });
});

desc.addEventListener("input", updateCompact);

waBtn.addEventListener("click",()=>{
  const details = compactState.details.length
    ? compactState.details.map(x=>`• ${x}`).join("\n")
    : "• A definir";

  const execution = Object.values(compactState.execution).length
    ? Object.values(compactState.execution).map(x=>`• ${x}`).join("\n")
    : "• A definir";

  const message = `Olá, NEXOR! Montei meu projeto pelo site e gostaria de receber um orçamento.

SERVIÇO
${compactState.service}

OPÇÕES SELECIONADAS
${details}

EXECUÇÃO
${execution}

SOBRE O PROJETO
${compactState.description || "Prefiro explicar durante o atendimento."}

Entendi que os valores são sob consulta e dependem do escopo, prazo, complexidade e horas necessárias.`;

  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`,"_blank");
});

/* Preselect compact builder from service list */
document.querySelectorAll(".service-row").forEach(row=>{
  row.addEventListener("click",()=>{
    const title=row.querySelector("h3")?.textContent.trim();
    const map={"Social Media":"Social Media","Sites":"Site","Sistemas":"Sistema","Filmmaker":"Filmmaker","Storymaker":"Storymaker"};
    const target=map[title];
    if(target){
      setTimeout(()=>document.querySelector(`.service-chip[data-service="${target}"]`)?.click(),200);
    }
  });
});

updateCompact();
