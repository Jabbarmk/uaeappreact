import{r as e}from"./rolldown-runtime-S-ySWqyJ.js";import{i as t,t as n,x as r}from"./query-C5SnrwOR.js";import{d as i,i as a,p as o}from"./vendor-aRQpYNnp.js";import{n as s}from"./index-DwV3m1NH.js";var c=e(r(),1),l=t();function u(){let[e]=o(),t=i(),[r,u]=(0,c.useState)(()=>{let e=localStorage.getItem(`offersGrid`);return e===`2`?2:e===`3`?3:1}),d=e.get(`loc`)||`Dubai`,f=e.get(`cat`)||``,{data:p,isLoading:m}=n({queryKey:[`offers`,d,f],queryFn:()=>s.get(`/offers?loc=${encodeURIComponent(d)}&cat=${f}`).then(e=>e.data)}),h=p?.emirates||[`Dubai`,`Abu Dhabi`,`Sharjah`],g=p?.categories||[],_=p?.offers||[];function v(e){u(e),localStorage.setItem(`offersGrid`,String(e))}let y=r===1?`offers-grid`:r===2?`offers-grid cols-2`:`offers-grid list`;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(`div`,{className:`page-topbar`,children:[(0,l.jsx)(a,{to:`/`,className:`back-btn`,children:(0,l.jsx)(`i`,{className:`fas fa-arrow-left`})}),(0,l.jsx)(`h1`,{children:`OFFERS`}),(0,l.jsx)(`div`,{className:`right-actions`,children:(0,l.jsxs)(`label`,{className:`loc-pill`,children:[(0,l.jsx)(`i`,{className:`fas fa-map-marker-alt loc-pin`}),(0,l.jsx)(`select`,{value:d,onChange:e=>t(`/offers?loc=${encodeURIComponent(e.target.value)}${f?`&cat=${f}`:``}`),children:h.map(e=>(0,l.jsx)(`option`,{value:e,children:e},e))}),(0,l.jsx)(`i`,{className:`fas fa-chevron-down loc-chev`})]})})]}),(0,l.jsxs)(`div`,{className:`cat-tabs`,children:[(0,l.jsxs)(a,{to:`/offers?loc=${encodeURIComponent(d)}`,className:`cat-tab${f?``:` active`}`,children:[(0,l.jsx)(`i`,{className:`fas fa-fire`}),` All`]}),g.map(e=>(0,l.jsxs)(a,{to:`/offers?loc=${encodeURIComponent(d)}&cat=${e.id}`,className:`cat-tab${String(e.id)===f?` active`:``}`,children:[e.icon&&(0,l.jsx)(`span`,{children:e.icon}),e.name]},e.id))]}),(0,l.jsxs)(`div`,{className:`offers-head`,children:[(0,l.jsxs)(`div`,{children:[(0,l.jsxs)(`h2`,{className:`offers-head-title`,children:[`Top Offers in `,(0,l.jsx)(`span`,{children:d})]}),(0,l.jsxs)(`span`,{className:`offers-head-count`,children:[_.length,` offers`]})]}),(0,l.jsx)(`div`,{className:`grid-toggle`,children:[1,2,3].map(e=>(0,l.jsxs)(`button`,{className:`grid-btn${r===e?` active`:``}`,onClick:()=>v(e),children:[e===1&&(0,l.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,children:[(0,l.jsx)(`rect`,{x:`2`,y:`2`,width:`12`,height:`4`,rx:`1`}),(0,l.jsx)(`rect`,{x:`2`,y:`8`,width:`12`,height:`4`,rx:`1`})]}),e===2&&(0,l.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,children:[(0,l.jsx)(`rect`,{x:`1`,y:`1`,width:`6`,height:`6`,rx:`1`}),(0,l.jsx)(`rect`,{x:`9`,y:`1`,width:`6`,height:`6`,rx:`1`}),(0,l.jsx)(`rect`,{x:`1`,y:`9`,width:`6`,height:`6`,rx:`1`}),(0,l.jsx)(`rect`,{x:`9`,y:`9`,width:`6`,height:`6`,rx:`1`})]}),e===3&&(0,l.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 16 16`,children:[(0,l.jsx)(`rect`,{x:`1`,y:`2`,width:`5`,height:`5`,rx:`1`}),(0,l.jsx)(`rect`,{x:`8`,y:`2.4`,width:`7`,height:`1.6`,rx:`0.8`}),(0,l.jsx)(`rect`,{x:`8`,y:`5.2`,width:`5`,height:`1.6`,rx:`0.8`}),(0,l.jsx)(`rect`,{x:`1`,y:`9`,width:`5`,height:`5`,rx:`1`}),(0,l.jsx)(`rect`,{x:`8`,y:`9.4`,width:`7`,height:`1.6`,rx:`0.8`}),(0,l.jsx)(`rect`,{x:`8`,y:`12.2`,width:`5`,height:`1.6`,rx:`0.8`})]})]},e))})]}),m?(0,l.jsx)(`div`,{style:{padding:40,textAlign:`center`},children:`Loading…`}):(0,l.jsxs)(`div`,{className:y,children:[_.length===0&&(0,l.jsxs)(`div`,{style:{background:`#fff`,padding:`40px 24px`,borderRadius:18,textAlign:`center`,color:`#9BA4B5`,gridColumn:`1/-1`,border:`1px solid #F0F1F5`,boxShadow:`0 4px 20px rgba(13,27,42,0.05)`},children:[(0,l.jsx)(`i`,{className:`fas fa-tag`,style:{fontSize:34,marginBottom:14,display:`block`,color:`#DDD`}}),(0,l.jsxs)(`div`,{style:{fontSize:14,fontWeight:600},children:[`No offers found in `,d]}),(0,l.jsx)(`div`,{style:{fontSize:12.5,marginTop:4},children:`Try another location or category.`})]}),_.map(e=>{let t=e.business_whatsapp?`https://wa.me/${e.business_whatsapp.replace(/\D/g,``)}?text=${encodeURIComponent(`Hi, I want to order: ${e.title} (${e.currency} ${Math.round(e.price)})`)}`:null,n=t||(e.business_phone?`tel:${e.business_phone}`:`/offers/${e.id}`),r=t?`Order Now`:e.business_phone?`Call Now`:`Order Now`,i=t?`fa-bolt`:e.business_phone?`fa-phone`:`fa-bolt`;return(0,l.jsxs)(`div`,{className:`offer-card`,children:[(0,l.jsxs)(a,{to:`/businesses/${e.business_id}`,className:`offer-biz-header`,children:[(0,l.jsx)(`img`,{src:e.logoUrl,alt:e.business_name,className:`offer-biz-avatar`,onError:e=>{e.target.src=`https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&h=80&fit=crop`},loading:`lazy`,decoding:`async`}),(0,l.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,l.jsx)(`div`,{className:`offer-biz-name`,children:e.business_name}),(0,l.jsxs)(`div`,{className:`offer-biz-sub`,children:[(0,l.jsx)(`i`,{className:`fas fa-map-marker-alt`}),e.emirate||e.business_emirate||``,e.category_name&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`span`,{children:`·`}),(0,l.jsx)(`span`,{children:e.category_name})]})]})]}),e.discount_percent&&(0,l.jsxs)(`div`,{className:`offer-discount-badge`,children:[`-`,Math.round(e.discount_percent),`%`]})]}),(0,l.jsx)(a,{to:`/offers/${e.id}`,className:`offer-img-link`,style:{display:`block`},children:(0,l.jsx)(`img`,{src:e.imageUrl,alt:e.title,className:`offer-img`,loading:`lazy`,decoding:`async`,onError:e=>{e.target.src=`https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1000&fit=crop`}})}),(0,l.jsxs)(`div`,{className:`offer-body`,children:[(0,l.jsxs)(a,{to:`/offers/${e.id}`,style:{textDecoration:`none`,color:`inherit`},children:[(0,l.jsx)(`h3`,{className:`offer-title`,children:e.title}),e.description&&(0,l.jsxs)(`p`,{className:`offer-desc`,children:[e.description.substring(0,120),`…`]})]}),(0,l.jsxs)(`div`,{className:`offer-price-row`,children:[(0,l.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:6,flexWrap:`wrap`},children:[(0,l.jsxs)(`span`,{className:`offer-price`,children:[e.currency,` `,Math.round(e.price).toLocaleString()]}),e.original_price&&e.original_price>e.price&&(0,l.jsxs)(`span`,{className:`offer-original`,children:[e.currency,` `,Math.round(e.original_price).toLocaleString()]})]}),(0,l.jsxs)(`div`,{className:`offer-rating`,children:[(0,l.jsx)(`i`,{className:`fas fa-star`}),(0,l.jsx)(`span`,{children:Number(e.rating).toFixed(1)})]})]}),(0,l.jsxs)(`div`,{className:`offer-btns`,children:[(0,l.jsxs)(a,{to:`/offers/${e.id}`,className:`offer-btn`,style:{background:`#f0f2f8`,color:`#1A1A2E`},children:[(0,l.jsx)(`i`,{className:`fas fa-book-open`}),` `,(0,l.jsx)(`span`,{className:`offer-btn-label`,children:`Read More`})]}),(0,l.jsxs)(`a`,{href:n,target:t?`_blank`:void 0,rel:`noreferrer`,className:`offer-btn`,style:{background:`#6C5CE7`,color:`#fff`},children:[(0,l.jsx)(`i`,{className:`fas ${i}`}),` `,(0,l.jsx)(`span`,{className:`offer-btn-label`,children:r})]})]})]})]},e.id)})]}),(0,l.jsx)(`style`,{children:`
        /* ── Category tabs ── */
        .cat-tabs{display:flex;gap:8px;overflow-x:auto;padding:2px 16px;margin:6px 0 18px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .cat-tabs::-webkit-scrollbar{display:none}
        .cat-tab{padding:8px 15px;border-radius:999px;background:#fff;color:#1A1A2E;font-size:13px;font-weight:700;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;gap:6px;flex-shrink:0;border:1px solid #ECECF3;box-shadow:0 1px 4px rgba(13,27,42,0.04);transition:background .15s,color .15s,box-shadow .15s}
        .cat-tab i{font-size:11px}
        .cat-tab.active{background:#6C5CE7;color:#fff;border-color:#6C5CE7;box-shadow:0 5px 14px rgba(108,92,231,0.28)}

        /* ── Section heading + grid toggle ── */
        .offers-head{padding:0 16px 15px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .offers-head-title{font-size:20px;font-weight:800;color:#1A1A2E;margin:0 0 3px;letter-spacing:-0.4px;line-height:1.2}
        .offers-head-title span{color:#6C5CE7}
        .offers-head-count{font-size:12px;color:#9BA4B5;font-weight:600}

        /* ── Grid containers (unified 16px gutter) ── */
        .offers-grid{padding:0 16px 32px;display:grid;gap:16px;grid-template-columns:1fr}
        .offers-grid.cols-2{grid-template-columns:repeat(2,1fr);gap:12px}
        .offers-grid.list{grid-template-columns:1fr;gap:12px}

        /* ── Offer card ── */
        .offer-card{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 20px rgba(13,27,42,0.07);border:1px solid #F0F1F5}
        .offer-biz-header{display:flex;align-items:center;gap:11px;padding:13px 15px;text-decoration:none;color:inherit}
        .offer-biz-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid #F0F0F5}
        .offer-biz-name{font-size:14px;font-weight:700;color:#1A1A2E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.25}
        .offer-biz-sub{font-size:11.5px;color:#9BA4B5;display:flex;align-items:center;gap:5px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .offer-biz-sub i{font-size:10px}
        .offer-discount-badge{background:#FF6B6B;color:#fff;font-size:11px;font-weight:800;padding:5px 11px;border-radius:11px;flex-shrink:0;box-shadow:0 3px 9px rgba(255,107,107,0.3)}
        .offer-img{width:100%;height:auto;object-fit:contain;display:block;background:#F7F8FB}
        .offer-body{padding:15px 16px 16px}
        .offer-title{font-size:16px;font-weight:800;color:#1A1A2E;margin:0 0 7px;line-height:1.32;letter-spacing:-0.2px}
        .offer-desc{font-size:13px;color:#636E8A;line-height:1.55;margin:0 0 12px}
        .offer-price-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px}
        .offer-price{font-size:20px;font-weight:800;color:#6C5CE7;letter-spacing:-0.3px}
        .offer-original{font-size:13px;color:#9BA4B5;text-decoration:line-through}
        .offer-rating{display:flex;align-items:center;gap:5px;background:#FFF5E7;border-radius:10px;padding:5px 11px}
        .offer-rating i{color:#FDCB6E;font-size:12px}
        .offer-rating span{font-size:12px;font-weight:700;color:#1A1A2E}
        .offer-btns{display:flex;gap:10px}
        .offer-btn{flex:1;padding:12px 0;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:7px;transition:transform .12s,box-shadow .12s;-webkit-tap-highlight-color:transparent}
        .offer-btn i{font-size:13px}
        .offer-btn:active{transform:scale(0.97)}

        /* ── Style 2: 2-column, compact + responsive text ── */
        .cols-2 .offer-img{aspect-ratio:1/1;object-fit:cover}
        .cols-2 .offer-desc,.cols-2 .offer-biz-sub{display:none}
        .cols-2 .offer-biz-header{padding:10px 11px}
        .cols-2 .offer-biz-avatar{width:34px;height:34px}
        .cols-2 .offer-body{padding:12px 12px 13px}
        .cols-2 .offer-biz-name{font-size:clamp(11px,3vw,13px)}
        .cols-2 .offer-title{font-size:clamp(12px,3.4vw,15px);margin-bottom:5px}
        .cols-2 .offer-price{font-size:clamp(15px,4.4vw,19px)}
        .cols-2 .offer-original{font-size:clamp(10px,2.6vw,12px)}
        .cols-2 .offer-discount-badge{font-size:clamp(9px,2.6vw,11px);padding:3px 8px}
        .cols-2 .offer-rating{padding:4px 9px}
        .cols-2 .offer-rating span{font-size:clamp(10px,2.6vw,12px)}
        .cols-2 .offer-price-row{margin-bottom:11px}
        .cols-2 .offer-btn{font-size:clamp(11px,3vw,13px);padding:10px 0;gap:5px}

        /* ── Style 3: horizontal list — image left, text right, buttons bottom ── */
        .offers-grid.list .offer-card{display:grid;grid-template-columns:134px 1fr;grid-template-areas:"img header" "img body";align-items:stretch}
        .offers-grid.list .offer-biz-header{grid-area:header;padding:13px 14px 4px;gap:9px}
        .offers-grid.list .offer-biz-avatar{width:34px;height:34px}
        .offers-grid.list .offer-img-link{grid-area:img;align-self:stretch}
        .offers-grid.list .offer-img{width:100%;height:100%;min-height:100%;object-fit:cover;aspect-ratio:auto;background:#F7F8FB}
        .offers-grid.list .offer-body{grid-area:body;padding:4px 14px 14px;display:flex;flex-direction:column}
        .offers-grid.list .offer-desc{display:none}
        .offers-grid.list .offer-title{font-size:15px;margin-bottom:8px}
        .offers-grid.list .offer-price-row{margin-bottom:12px}
        .offers-grid.list .offer-btns{margin-top:auto}
        @media (max-width:420px){
          .offers-grid.list .offer-card{grid-template-columns:106px 1fr}
          .offers-grid.list .offer-title{font-size:14px}
          .offers-grid.list .offer-btn-label{display:none}
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
      `})]})}export{u as default};