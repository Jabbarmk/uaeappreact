import{i as e,t}from"./query-C5SnrwOR.js";import{f as n,i as r}from"./vendor-aRQpYNnp.js";import{n as i}from"./index-DwV3m1NH.js";var a=e(),o=e=>e?new Date(e).toLocaleDateString(`en-GB`,{weekday:`long`,day:`2-digit`,month:`short`,year:`numeric`}):null;function s(){let{id:e}=n(),{data:s,isLoading:c}=t({queryKey:[`event`,e],queryFn:()=>i.get(`/events/${e}`).then(e=>e.data)});if(c)return(0,a.jsx)(`div`,{style:{padding:40,textAlign:`center`},children:`Loading…`});if(!s?.item)return(0,a.jsxs)(`div`,{style:{padding:40},children:[`Not found. `,(0,a.jsx)(r,{to:`/events`,children:`Back`})]});let l=s.item,u=s.images||[],d=!(Number(l.price)>0),f=l.organizer_whatsapp?`https://wa.me/${String(l.organizer_whatsapp).replace(/\D/g,``)}?text=${encodeURIComponent(`Hi, I'd like to book for: ${l.title}`)}`:null,p=l.end_date&&l.end_date!==l.event_date?`${o(l.event_date)} → ${o(l.end_date)}`:o(l.event_date),m=l.start_time?`${l.start_time}${l.end_time?` – ${l.end_time}`:``}`:null,h=[[`fa-calendar-alt`,`Date`,p],[`fa-clock`,`Time`,m],[`fa-map-marker-alt`,`Venue`,l.venue||l.location],[`fa-city`,`Emirate`,l.emirate],[`fa-user-tie`,`Organizer`,l.organizer],[`fa-phone`,`Contact`,l.organizer_phone]].filter(([,,e])=>e);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(`div`,{className:`page-topbar`,children:[(0,a.jsx)(r,{to:`/events`,className:`back-btn`,children:(0,a.jsx)(`i`,{className:`fas fa-arrow-left`})}),(0,a.jsx)(`h1`,{className:`ev-topbar-title`,children:l.title}),(0,a.jsx)(`div`,{className:`right-actions`})]}),(0,a.jsxs)(`div`,{className:`ev-page`,children:[(0,a.jsxs)(`div`,{className:`ev-poster`,children:[(0,a.jsx)(`img`,{src:l.posterUrl,alt:l.title,onError:e=>{e.target.src=`https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop`},loading:`lazy`,decoding:`async`}),l.category_name&&(0,a.jsxs)(`span`,{className:`ev-poster-cat`,children:[l.category_icon?`${l.category_icon} `:``,l.category_name]}),(0,a.jsx)(`span`,{className:`ev-poster-price${d?` free`:``}`,children:d?`FREE ENTRY`:`${l.currency||`AED`} ${Math.round(l.price).toLocaleString()}`})]}),(0,a.jsxs)(`section`,{className:`ev-card`,children:[l.category_name&&(0,a.jsx)(`div`,{className:`ev-eyebrow`,children:l.category_name}),(0,a.jsx)(`h2`,{className:`ev-title`,children:l.title}),p&&(0,a.jsxs)(`div`,{className:`ev-subrow accent`,children:[(0,a.jsx)(`i`,{className:`far fa-calendar`}),(0,a.jsxs)(`span`,{children:[p,m?` · ${m}`:``]})]}),(l.venue||l.location)&&(0,a.jsxs)(`div`,{className:`ev-subrow`,children:[(0,a.jsx)(`i`,{className:`fas fa-map-marker-alt`}),(0,a.jsxs)(`span`,{children:[l.venue||l.location,l.emirate?`, ${l.emirate}`:``]})]}),(0,a.jsxs)(`div`,{className:`ev-cta`,children:[l.booking_url&&(0,a.jsxs)(`a`,{href:l.booking_url,target:`_blank`,rel:`noreferrer`,className:`ev-btn primary`,children:[(0,a.jsx)(`i`,{className:`fas fa-ticket-alt`}),` Get Tickets`]}),f&&(0,a.jsxs)(`a`,{href:f,target:`_blank`,rel:`noreferrer`,className:`ev-btn whatsapp`,children:[(0,a.jsx)(`i`,{className:`fab fa-whatsapp`}),` Book on WhatsApp`]}),!l.booking_url&&!f&&l.organizer_phone&&(0,a.jsxs)(`a`,{href:`tel:${l.organizer_phone}`,className:`ev-btn primary`,children:[(0,a.jsx)(`i`,{className:`fas fa-phone`}),` Call Organizer`]})]})]}),l.description&&(0,a.jsxs)(`section`,{className:`ev-card`,children:[(0,a.jsx)(`div`,{className:`ev-section-label`,children:`About this event`}),(0,a.jsx)(`p`,{className:`ev-desc`,children:l.description})]}),u.length>0&&(0,a.jsxs)(`section`,{className:`ev-card`,children:[(0,a.jsx)(`div`,{className:`ev-section-label`,children:`Photos`}),(0,a.jsx)(`div`,{className:`ev-gallery`,children:u.map((e,t)=>(0,a.jsx)(`a`,{href:e,target:`_blank`,rel:`noreferrer`,className:`ev-gallery-item`,children:(0,a.jsx)(`img`,{src:e,alt:`${l.title} photo ${t+1}`,loading:`lazy`,decoding:`async`})},t))})]}),h.length>0&&(0,a.jsxs)(`section`,{className:`ev-card`,children:[(0,a.jsx)(`div`,{className:`ev-section-label`,children:`Event details`}),(0,a.jsx)(`div`,{className:`ev-info-list`,children:h.map(([e,t,n])=>(0,a.jsxs)(`div`,{className:`ev-info-row`,children:[(0,a.jsx)(`div`,{className:`ev-info-icon`,children:(0,a.jsx)(`i`,{className:`fas ${e}`})}),(0,a.jsxs)(`div`,{className:`ev-info-text`,children:[(0,a.jsx)(`div`,{className:`ev-info-label`,children:t}),(0,a.jsx)(`div`,{className:`ev-info-val`,children:n})]})]},t))}),(0,a.jsxs)(`a`,{href:`https://maps.google.com/?q=${encodeURIComponent(`${l.venue||l.location||``} ${l.emirate||`UAE`}`)}`,target:`_blank`,rel:`noreferrer`,className:`ev-maps`,children:[(0,a.jsx)(`i`,{className:`fas fa-directions`}),` Open in Maps`]})]})]}),(0,a.jsx)(`style`,{children:`
        .ev-topbar-title{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70vw}

        .ev-page{padding-bottom:36px;margin-top:-8px}

        /* Poster */
        .ev-poster{position:relative;margin:0 16px 18px;border-radius:20px;overflow:hidden;box-shadow:0 10px 34px rgba(13,27,42,0.14)}
        .ev-poster img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:#F7F8FB}
        .ev-poster-cat{position:absolute;top:14px;left:14px;background:rgba(0,0,0,0.55);color:#fff;font-size:12px;font-weight:700;padding:6px 13px;border-radius:999px;backdrop-filter:blur(6px);max-width:calc(100% - 28px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ev-poster-price{position:absolute;bottom:14px;left:14px;background:#6C5CE7;color:#fff;font-size:13px;font-weight:800;padding:6px 15px;border-radius:999px;box-shadow:0 4px 14px rgba(108,92,231,0.4)}
        .ev-poster-price.free{background:#00B894;box-shadow:0 4px 14px rgba(0,184,148,0.4)}

        /* Cards — consistent gutter + even vertical rhythm */
        .ev-card{background:#fff;margin:0 16px 14px;border-radius:20px;padding:22px 18px;box-shadow:0 2px 14px rgba(13,27,42,0.05);border:1px solid #F0F1F5}

        /* Hero typography */
        .ev-eyebrow{font-size:12px;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;color:#6C5CE7;margin-bottom:9px}
        .ev-title{font-size:24px;font-weight:800;color:#1A1A2E;letter-spacing:-0.5px;line-height:1.22;margin:0 0 16px}
        .ev-subrow{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;color:#636E8A;line-height:1.45;margin-bottom:8px}
        .ev-subrow:last-of-type{margin-bottom:0}
        .ev-subrow i{width:16px;text-align:center;color:#9BA4B5;margin-top:1px;flex-shrink:0}
        .ev-subrow.accent{color:#6C5CE7;font-weight:700}
        .ev-subrow.accent i{color:#6C5CE7}

        /* CTA */
        .ev-cta{display:flex;gap:12px;margin-top:20px}
        .ev-btn{flex:1;padding:14px 0;border-radius:14px;font-size:14.5px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:9px;transition:transform .12s;-webkit-tap-highlight-color:transparent}
        .ev-btn:active{transform:scale(0.98)}
        .ev-btn.primary{background:#6C5CE7;color:#fff;box-shadow:0 6px 18px rgba(108,92,231,0.32)}
        .ev-btn.whatsapp{background:#25D366;color:#fff;box-shadow:0 6px 18px rgba(37,211,102,0.3)}

        /* Section label (Apple-style eyebrow) */
        .ev-section-label{font-size:12.5px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#9BA4B5;margin:0 0 14px}

        /* About paragraph — comfortable reading measure */
        .ev-desc{font-size:14.5px;line-height:1.75;color:#4B5563;margin:0;white-space:pre-wrap;letter-spacing:0.1px}

        /* Photos — horizontal scroll strip */
        .ev-gallery{display:flex;gap:10px;overflow-x:auto;margin:0 -18px;padding:0 18px 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .ev-gallery::-webkit-scrollbar{display:none}
        .ev-gallery-item{flex:0 0 auto;display:block;border-radius:14px;overflow:hidden;background:#F7F8FB}
        .ev-gallery-item img{height:172px;width:auto;max-width:280px;object-fit:cover;display:block}

        /* Details list — evenly spaced rows with hairline dividers */
        .ev-info-list{margin:-4px 0 0}
        .ev-info-row{display:flex;align-items:center;gap:13px;padding:13px 0}
        .ev-info-row + .ev-info-row{border-top:1px solid #F1F2F6}
        .ev-info-icon{width:36px;height:36px;background:#F4F3FF;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#6C5CE7;font-size:14px;flex-shrink:0}
        .ev-info-text{min-width:0}
        .ev-info-label{font-size:11.5px;color:#9BA4B5;font-weight:600;letter-spacing:0.2px;margin-bottom:2px}
        .ev-info-val{font-size:14.5px;color:#1A1A2E;font-weight:600;line-height:1.35;word-break:break-word}
        .ev-maps{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:16px;padding:13px 0;background:#F4F3FF;color:#6C5CE7;border-radius:13px;font-size:14px;font-weight:700;text-decoration:none;transition:background .15s}
        .ev-maps:active{background:#E9E7FD}
      `})]})}export{s as default};