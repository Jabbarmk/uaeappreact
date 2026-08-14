import{r as e}from"./rolldown-runtime-S-ySWqyJ.js";import{i as t,t as n,x as r}from"./query-C5SnrwOR.js";import{d as i,i as a,p as o}from"./vendor-aRQpYNnp.js";import{n as s}from"./index-DwV3m1NH.js";var c=e(r(),1),l=t(),u=[`All UAE`,`Dubai`,`Abu Dhabi`,`Sharjah`,`Ajman`,`Fujairah`,`Ras Al Khaimah`,`Umm Al Quwain`],d=e=>e?new Date(e).toLocaleDateString(`en-GB`,{weekday:`short`,day:`2-digit`,month:`short`}):``;function f(){let[e]=o(),t=i(),[r,f]=(0,c.useState)(()=>{let e=localStorage.getItem(`eventsGrid`);return e===`2`?2:e===`3`?3:1}),p=e.get(`loc`)||`All UAE`,m=e.get(`cat`)||``,h=p===`All UAE`?``:p,{data:g}=n({queryKey:[`event-categories`],queryFn:()=>s.get(`/events/categories`).then(e=>e.data)}),{data:_,isLoading:v}=n({queryKey:[`events`,h,m],queryFn:()=>s.get(`/events?${h?`emirate=${encodeURIComponent(h)}&`:``}${m?`category=${m}&`:``}pageSize=60`).then(e=>e.data)}),y=g?.categories||[],b=_?.items||[],x=(e,n)=>t(`/events?loc=${encodeURIComponent(e)}${n?`&cat=${n}`:``}`),S=e=>{f(e),localStorage.setItem(`eventsGrid`,String(e))},C=r===1?`events-grid`:r===2?`events-grid cols-2`:`events-grid list`;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(`div`,{className:`page-topbar`,children:[(0,l.jsx)(a,{to:`/`,className:`back-btn`,children:(0,l.jsx)(`i`,{className:`fas fa-arrow-left`})}),(0,l.jsx)(`h1`,{children:`EVENTS`}),(0,l.jsx)(`div`,{className:`right-actions`,children:(0,l.jsxs)(`label`,{className:`loc-pill`,children:[(0,l.jsx)(`i`,{className:`fas fa-map-marker-alt loc-pin`}),(0,l.jsx)(`select`,{value:p,onChange:e=>x(e.target.value,m),children:u.map(e=>(0,l.jsx)(`option`,{value:e,children:e},e))}),(0,l.jsx)(`i`,{className:`fas fa-chevron-down loc-chev`})]})})]}),(0,l.jsxs)(`div`,{className:`cat-tabs`,children:[(0,l.jsxs)(`button`,{onClick:()=>x(p,``),className:`cat-tab${m?``:` active`}`,children:[(0,l.jsx)(`i`,{className:`fas fa-calendar-day`}),` All`]}),y.map(e=>(0,l.jsxs)(`button`,{onClick:()=>x(p,String(e.id)),className:`cat-tab${String(e.id)===m?` active`:``}`,children:[e.icon&&(0,l.jsx)(`span`,{children:e.icon}),e.name]},e.id))]}),(0,l.jsxs)(`div`,{className:`offers-head`,children:[(0,l.jsxs)(`div`,{children:[(0,l.jsxs)(`h2`,{className:`offers-head-title`,children:[`Upcoming in `,(0,l.jsx)(`span`,{children:p})]}),(0,l.jsxs)(`span`,{className:`offers-head-count`,children:[b.length,` events`]})]}),(0,l.jsx)(`div`,{className:`grid-toggle`,children:[1,2,3].map(e=>(0,l.jsxs)(`button`,{className:`grid-btn${r===e?` active`:``}`,onClick:()=>S(e),children:[e===1&&(0,l.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,children:[(0,l.jsx)(`rect`,{x:`2`,y:`2`,width:`12`,height:`4`,rx:`1`}),(0,l.jsx)(`rect`,{x:`2`,y:`8`,width:`12`,height:`4`,rx:`1`})]}),e===2&&(0,l.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,children:[(0,l.jsx)(`rect`,{x:`1`,y:`1`,width:`6`,height:`6`,rx:`1`}),(0,l.jsx)(`rect`,{x:`9`,y:`1`,width:`6`,height:`6`,rx:`1`}),(0,l.jsx)(`rect`,{x:`1`,y:`9`,width:`6`,height:`6`,rx:`1`}),(0,l.jsx)(`rect`,{x:`9`,y:`9`,width:`6`,height:`6`,rx:`1`})]}),e===3&&(0,l.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,children:[(0,l.jsx)(`rect`,{x:`1`,y:`2`,width:`5`,height:`5`,rx:`1`}),(0,l.jsx)(`rect`,{x:`8`,y:`2.4`,width:`7`,height:`1.6`,rx:`0.8`}),(0,l.jsx)(`rect`,{x:`8`,y:`5.2`,width:`5`,height:`1.6`,rx:`0.8`}),(0,l.jsx)(`rect`,{x:`1`,y:`9`,width:`5`,height:`5`,rx:`1`}),(0,l.jsx)(`rect`,{x:`8`,y:`9.4`,width:`7`,height:`1.6`,rx:`0.8`}),(0,l.jsx)(`rect`,{x:`8`,y:`12.2`,width:`5`,height:`1.6`,rx:`0.8`})]})]},e))})]}),v?(0,l.jsx)(`div`,{style:{padding:40,textAlign:`center`},children:`Loading…`}):(0,l.jsxs)(`div`,{className:C,children:[b.length===0&&(0,l.jsxs)(`div`,{style:{background:`#fff`,padding:`40px 24px`,borderRadius:18,textAlign:`center`,color:`#9BA4B5`,gridColumn:`1/-1`,border:`1px solid #F0F1F5`,boxShadow:`0 4px 20px rgba(13,27,42,0.05)`},children:[(0,l.jsx)(`i`,{className:`far fa-calendar`,style:{fontSize:34,marginBottom:14,display:`block`,color:`#DDD`}}),(0,l.jsxs)(`div`,{style:{fontSize:14,fontWeight:600},children:[`No upcoming events in `,p]}),(0,l.jsx)(`div`,{style:{fontSize:12.5,marginTop:4},children:`Try another location or category.`})]}),b.map(e=>{let t=!(Number(e.price)>0),n=e.organizer_whatsapp?`https://wa.me/${String(e.organizer_whatsapp).replace(/\D/g,``)}?text=${encodeURIComponent(`Hi, I'd like to book for: ${e.title}`)}`:null,r=e.booking_url||n||(e.organizer_phone?`tel:${e.organizer_phone}`:`/events/${e.id}`),i=e.booking_url?`Get Tickets`:n?`Book`:e.organizer_phone?`Call`:`Details`,o=e.booking_url?`fa-ticket-alt`:n?`fa-whatsapp`:e.organizer_phone?`fa-phone`:`fa-arrow-right`,s=!!(e.booking_url||n);return(0,l.jsxs)(`div`,{className:`event-card`,children:[(0,l.jsxs)(a,{to:`/events/${e.id}`,className:`event-media`,children:[(0,l.jsx)(`img`,{src:e.posterUrl,alt:e.title,className:`event-img`,loading:`lazy`,decoding:`async`,onError:e=>{e.target.src=`https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1000&fit=crop`}}),e.category_name&&(0,l.jsxs)(`span`,{className:`event-cat-badge`,children:[e.category_icon?`${e.category_icon} `:``,e.category_name]}),e.event_date&&(0,l.jsxs)(`span`,{className:`event-date-badge`,children:[(0,l.jsx)(`b`,{children:new Date(e.event_date).getDate()}),new Date(e.event_date).toLocaleDateString(`en-GB`,{month:`short`})]}),(0,l.jsx)(`span`,{className:`event-price-badge${t?` free`:``}`,children:t?`FREE`:`${e.currency||`AED`} ${Math.round(e.price)}`})]}),(0,l.jsxs)(`div`,{className:`event-body`,children:[(0,l.jsx)(a,{to:`/events/${e.id}`,style:{textDecoration:`none`,color:`inherit`},children:(0,l.jsx)(`h3`,{className:`event-title`,children:e.title})}),(0,l.jsxs)(`div`,{className:`event-meta`,children:[(0,l.jsx)(`i`,{className:`far fa-calendar`}),` `,d(e.event_date),e.start_time?` · ${e.start_time}`:``]}),(e.venue||e.location)&&(0,l.jsxs)(`div`,{className:`event-meta`,children:[(0,l.jsx)(`i`,{className:`fas fa-map-marker-alt`}),` `,e.venue||e.location,e.emirate?`, ${e.emirate}`:``]}),(0,l.jsxs)(`div`,{className:`event-btns`,children:[(0,l.jsxs)(a,{to:`/events/${e.id}`,className:`event-btn`,style:{background:`#f0f2f8`,color:`#1A1A2E`},children:[(0,l.jsx)(`i`,{className:`fas fa-circle-info`}),` `,(0,l.jsx)(`span`,{className:`event-btn-label`,children:`Details`})]}),(0,l.jsxs)(`a`,{href:r,target:s?`_blank`:void 0,rel:`noreferrer`,className:`event-btn`,style:{background:`#6C5CE7`,color:`#fff`},children:[(0,l.jsx)(`i`,{className:`fas ${o}`}),` `,(0,l.jsx)(`span`,{className:`event-btn-label`,children:i})]})]})]})]},e.id)})]}),(0,l.jsx)(`style`,{children:`
        /* ── Category tabs ── */
        .cat-tabs{display:flex;gap:8px;overflow-x:auto;padding:2px 16px;margin:6px 0 18px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .cat-tabs::-webkit-scrollbar{display:none}
        .cat-tab{padding:8px 15px;border-radius:999px;background:#fff;color:#1A1A2E;font-size:13px;font-weight:700;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;gap:6px;flex-shrink:0;border:1px solid #ECECF3;box-shadow:0 1px 4px rgba(13,27,42,0.04);cursor:pointer;transition:background .15s,color .15s,box-shadow .15s}
        .cat-tab i{font-size:11px}
        .cat-tab.active{background:#6C5CE7;color:#fff;border-color:#6C5CE7;box-shadow:0 5px 14px rgba(108,92,231,0.28)}

        /* ── Section heading + grid toggle ── */
        .offers-head{padding:0 16px 15px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .offers-head-title{font-size:20px;font-weight:800;color:#1A1A2E;margin:0 0 3px;letter-spacing:-0.4px;line-height:1.2}
        .offers-head-title span{color:#6C5CE7}
        .offers-head-count{font-size:12px;color:#9BA4B5;font-weight:600}

        /* ── Grid containers (unified 16px gutter) ── */
        .events-grid{padding:0 16px 32px;display:grid;gap:16px;grid-template-columns:1fr}
        .events-grid.cols-2{grid-template-columns:repeat(2,1fr);gap:12px}
        .events-grid.list{grid-template-columns:1fr;gap:12px}

        /* ── Event card ── */
        .event-card{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 20px rgba(13,27,42,0.07);border:1px solid #F0F1F5}
        .event-media{display:block;position:relative}
        .event-img{width:100%;height:auto;object-fit:contain;display:block;background:#F7F8FB}
        .event-cat-badge{position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.55);color:#fff;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;backdrop-filter:blur(4px);max-width:calc(100% - 74px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .event-date-badge{position:absolute;top:10px;right:10px;background:#fff;border-radius:12px;padding:5px 10px;display:flex;flex-direction:column;align-items:center;line-height:1;color:#6C5CE7;font-size:10px;font-weight:700;text-transform:uppercase;box-shadow:0 4px 12px rgba(0,0,0,.18)}
        .event-date-badge b{font-size:16px;font-weight:800;color:#1A1A2E}
        .event-price-badge{position:absolute;bottom:10px;left:10px;background:#6C5CE7;color:#fff;font-size:12px;font-weight:800;padding:5px 12px;border-radius:999px;box-shadow:0 3px 9px rgba(108,92,231,0.32)}
        .event-price-badge.free{background:#00B894;box-shadow:0 3px 9px rgba(0,184,148,0.32)}
        .event-body{padding:14px 16px 16px}
        .event-title{font-size:16px;font-weight:800;color:#1A1A2E;margin:0 0 9px;line-height:1.32;letter-spacing:-0.2px}
        .event-meta{font-size:12.5px;color:#636E8A;display:flex;align-items:center;gap:7px;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .event-meta i{color:#9BA4B5;width:13px;flex-shrink:0}
        .event-btns{display:flex;gap:10px;margin-top:13px}
        .event-btn{flex:1;padding:12px 0;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:7px;transition:transform .12s;-webkit-tap-highlight-color:transparent}
        .event-btn i{font-size:13px}
        .event-btn:active{transform:scale(0.97)}

        /* ── Style 2: 2-column, compact + responsive text ── */
        .cols-2 .event-img{aspect-ratio:1/1;object-fit:cover}
        .cols-2 .event-meta{display:none}
        .cols-2 .event-body{padding:12px 12px 13px}
        .cols-2 .event-title{font-size:clamp(12px,3.4vw,15px);margin-bottom:0}
        .cols-2 .event-cat-badge{font-size:clamp(9px,2.6vw,11px);padding:4px 9px}
        .cols-2 .event-price-badge{font-size:clamp(10px,2.8vw,12px);padding:4px 10px}
        .cols-2 .event-date-badge b{font-size:14px}
        .cols-2 .event-btns{margin-top:11px}
        .cols-2 .event-btn{font-size:clamp(11px,3vw,13px);padding:10px 0;gap:5px}

        /* ── Style 3: horizontal list — image left, text right, buttons bottom ── */
        .events-grid.list .event-card{display:grid;grid-template-columns:134px 1fr;grid-template-areas:"img body";align-items:stretch}
        .events-grid.list .event-media{grid-area:img;align-self:stretch}
        .events-grid.list .event-img{width:100%;height:100%;min-height:100%;object-fit:cover;aspect-ratio:auto}
        .events-grid.list .event-date-badge{top:8px;right:auto;left:8px}
        .events-grid.list .event-cat-badge{display:none}
        .events-grid.list .event-price-badge{bottom:8px;left:8px}
        .events-grid.list .event-body{grid-area:body;padding:12px 14px 14px;display:flex;flex-direction:column}
        .events-grid.list .event-title{font-size:15px;margin-bottom:8px}
        .events-grid.list .event-btns{margin-top:auto}
        @media (max-width:420px){
          .events-grid.list .event-card{grid-template-columns:106px 1fr}
          .events-grid.list .event-title{font-size:14px}
          .events-grid.list .event-btn-label{display:none}
        }

        /* ── Top-right location pill ── */
        .loc-pill{display:inline-flex;align-items:center;gap:7px;background:#fff;border:1px solid #ECECF3;border-radius:999px;padding:8px 13px;box-shadow:0 2px 10px rgba(13,27,42,0.07);cursor:pointer;transition:box-shadow .15s}
        .loc-pill:hover{box-shadow:0 4px 14px rgba(13,27,42,0.11)}
        .loc-pill .loc-pin{color:#6C5CE7;font-size:13px}
        .loc-pill select{border:none;background:transparent;font-size:13px;font-weight:700;color:#1A1A2E;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;width:auto;padding:2px 6px}
        .loc-pill select option{padding:6px 10px}
        .loc-pill .loc-chev{color:#9BA4B5;font-size:10px;pointer-events:none}

        /* ── Grid toggle ── */
        .grid-toggle{display:flex;gap:5px;align-items:center;background:#EEF0F6;padding:4px;border-radius:11px}
        .grid-btn{width:30px;height:30px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;background:transparent;transition:background .15s}
        .grid-btn.active{background:#6C5CE7;box-shadow:0 3px 8px rgba(108,92,231,0.3)}
        .grid-btn svg rect{fill:#9BA4B5;transition:fill .15s}
        .grid-btn.active svg rect{fill:#fff}
      `})]})}export{f as default};