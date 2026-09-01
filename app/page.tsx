"use client";
import { useMemo, useState } from "react";
import { Activity, Bell, CalendarDays, ChevronDown, CircleCheck, Dumbbell, Flame, HeartPulse, LayoutDashboard, LogOut, Menu, MessageCircle, MoreHorizontal, Search, Settings, Sparkles, Target, TrendingUp, Users, X } from "lucide-react";

const people=[
 {name:"Marina Costa",goal:"Definição",ini:"MC",p:82,last:"Hoje",ok:true,color:"violet"},
 {name:"Lucas Mendes",goal:"Hipertrofia",ini:"LM",p:68,last:"Ontem",ok:true,color:"cyan"},
 {name:"Renata Alves",goal:"Condicionamento",ini:"RA",p:44,last:"4 dias",ok:false,color:"amber"},
 {name:"Pedro Lima",goal:"Emagrecimento",ini:"PL",p:91,last:"Hoje",ok:true,color:"green"},
];
const links=[[LayoutDashboard,"Visão geral"],[Users,"Alunos"],[Dumbbell,"Treinos"],[HeartPulse,"Avaliações"],[Target,"Metas"],[MessageCircle,"Mensagens"]] as const;

export default function Home(){
 const [active,setActive]=useState("Visão geral"),[open,setOpen]=useState(false),[query,setQuery]=useState("");
 const rows=useMemo(()=>people.filter(x=>x.name.toLowerCase().includes(query.toLowerCase())),[query]);
 return <main className="shell">
  {open&&<button className="shade" onClick={()=>setOpen(false)} aria-label="Fechar menu"/>}
  <aside className={open?"open":""}>
   <div className="brand"><b>K</b><strong>Kipp<span>GO</span></strong><button onClick={()=>setOpen(false)}><X/></button></div>
   <div className="unit"><i>AP</i><div><strong>Academia Pulse</strong><small>Unidade Centro</small></div><ChevronDown/></div>
   <nav><p>GESTÃO</p>{links.map(([Icon,label])=><button key={label} className={active===label?"active":""} onClick={()=>{setActive(label);setOpen(false)}}><Icon/>{label}{label==="Mensagens"&&<em>3</em>}</button>)}<p>CONTA</p><button><Settings/>Configurações</button></nav>
   <div className="profile"><i>JR</i><div><strong>João Ribeiro</strong><small>Professor</small></div><LogOut/></div>
  </aside>
  <section className="content">
   <header><button className="hamb" onClick={()=>setOpen(true)}><Menu/></button><div><small>TERÇA-FEIRA, 01 DE SETEMBRO</small><h1>{active}</h1></div><div className="actions"><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar aluno..."/></label><button className="bell"><Bell/><i/></button><button className="primary"><Users/>Novo aluno</button></div></header>
   <div className="dash">
    <section className="welcome"><div><span><Sparkles/> RESUMO INTELIGENTE</span><h2>Bom trabalho, João.</h2><p>Seus alunos completaram <strong>87% dos treinos</strong> planejados esta semana. Renata precisa de atenção — está há 4 dias sem registrar atividade.</p><button>Ver recomendações</button></div><div className="ring"><Activity/><b>87%</b><small>adesão</small></div></section>
    <section className="metrics">{[
     [Users,"ALUNOS ATIVOS","48","6,7%","violet"],[Dumbbell,"TREINOS CONCLUÍDOS","326","12,4%","coral"],[Target,"METAS ALCANÇADAS","21","de 34 ativas","cyan"],[Flame,"RETENÇÃO","94%","2,1%","amber"]
    ].map(([Icon,label,value,note,color])=><article key={String(label)}><i className={String(color)}><Icon/></i><div><span>{label}</span><h3>{value}</h3><p><TrendingUp/>{note}</p></div></article>)}</section>
    <section className="columns">
     <article className="panel chart-panel"><div className="panel-head"><div><h3>Evolução dos alunos</h3><p>Média geral de progresso</p></div><button>Este mês <ChevronDown/></button></div><div className="chart"><div className="lines"><i/><i/><i/><i/></div><svg viewBox="0 0 600 200" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7157ef" stopOpacity=".35"/><stop offset="1" stopColor="#7157ef" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 170 C70 165 90 145 150 146 S220 110 280 115 S360 87 420 84 S500 53 550 60 S585 35 600 38 L600 200 L0 200Z"/><path className="stroke" d="M0 170 C70 165 90 145 150 146 S220 110 280 115 S360 87 420 84 S500 53 550 60 S585 35 600 38"/></svg></div><div className="legend"><span><i className="violet"/>Força <b>+18%</b></span><span><i className="cyan"/>Resistência <b>+12%</b></span><span><i className="coral"/>Composição corporal <b>+9%</b></span></div></article>
     <article className="panel agenda"><div className="panel-head"><div><h3>Agenda de hoje</h3><p>6 compromissos</p></div><MoreHorizontal/></div>{[["08:00","Avaliação física","Marina Costa"],["10:30","Treino acompanhado","Lucas Mendes"],["14:00","Bioimpedância","Pedro Lima"],["16:30","Revisão de metas","Ana Beatriz"]].map((x,i)=><div className="slot" key={x[0]}><time>{x[0]}</time><i className={["violet","cyan","coral","amber"][i]}/><div><strong>{x[1]}</strong><small>{x[2]}</small></div><em>{i===0?"Concluído":"Hoje"}</em></div>)}<button className="agenda-button"><CalendarDays/>Ver agenda completa</button></article>
    </section>
    <section className="panel students"><div className="panel-head"><div><h3>Alunos em acompanhamento</h3><p>Progresso e frequência recentes</p></div><button>Ver todos</button></div><div className="table"><div className="row head"><span>ALUNO</span><span>OBJETIVO</span><span>PROGRESSO</span><span>ÚLTIMA ATIVIDADE</span><span>STATUS</span></div>{rows.map(x=><div className="row" key={x.name}><div className="person"><i className={x.color}>{x.ini}</i><strong>{x.name}</strong></div><span>{x.goal}</span><div className="progress"><i><b style={{width:x.p+"%"}}/></i><strong>{x.p}%</strong></div><span>{x.last}</span><em className={x.ok?"ok":"warn"}>{x.ok&&<CircleCheck/>}{x.ok?"Em dia":"Atenção"}</em></div>)}{!rows.length&&<p className="empty">Nenhum aluno encontrado.</p>}</div></section>
   </div>
  </section>
 </main>
}
