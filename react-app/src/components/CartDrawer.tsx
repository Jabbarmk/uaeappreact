import { useCart, setQty, clearCart, checkoutMessage } from '../cart';

// Bottom-sheet cart for one business. Local-only; checkout hands the list to WhatsApp.
export default function CartDrawer({ biz, onClose }: { biz: any; onClose: () => void }) {
  const items = useCart(biz.id);
  const showPrices = Number(biz.is_online_store) === 1;
  const wa = String(biz.whatsapp || biz.phone || '').replace(/\D/g, '');
  const total = items.reduce((s, i) => s + (i.price != null ? Number(i.price) * i.qty : 0), 0);

  const checkout = () => {
    if (!wa || !items.length) return;
    const msg = checkoutMessage(biz.name, items, showPrices);
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="cartd-wrap" onClick={onClose}>
      <div className="cartd" onClick={(e) => e.stopPropagation()}>
        <div className="cartd-bar" />
        <div className="cartd-head">
          <span className="cartd-title"><i className="fas fa-shopping-cart"></i> Cart · {biz.name}</span>
          {items.length > 0 && <button className="cartd-clear" onClick={() => clearCart(biz.id)}>Clear</button>}
        </div>

        {items.length === 0 ? (
          <div className="cartd-empty">Your cart is empty</div>
        ) : (
          <div className="cartd-items">
            {items.map((i, idx) => (
              <div className="cartd-item" key={idx}>
                {i.image
                  ? <img src={String(i.image).startsWith('http') ? i.image : `/assets/uploads/businesses/${i.image}`} alt="" />
                  : <div className="cartd-noimg">🛍️</div>}
                <div className="cartd-info">
                  <div className="cartd-name">{i.name}</div>
                  {i.sku && <div className="cartd-sub">SKU {i.sku}</div>}
                  {Object.entries(i.variations || {}).length > 0 && (
                    <div className="cartd-sub">{Object.entries(i.variations || {}).map(([k, v]) => `${k}: ${v}`).join(' · ')}</div>
                  )}
                  {showPrices && i.price != null && (
                    <div className="cartd-price">{i.currency || 'AED'} {(Number(i.price) * i.qty).toLocaleString()}</div>
                  )}
                </div>
                <div className="cartd-qty">
                  <button onClick={() => setQty(biz.id, idx, i.qty - 1)}>−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => setQty(biz.id, idx, i.qty + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="cartd-foot">
            {showPrices && total > 0 && (
              <div className="cartd-total"><span>Total</span><strong>{items[0]?.currency || 'AED'} {total.toLocaleString()}</strong></div>
            )}
            <button className="cartd-checkout" onClick={checkout} disabled={!wa}>
              <i className="fab fa-whatsapp"></i> {showPrices ? 'Checkout via WhatsApp' : 'Send Enquiry via WhatsApp'}
            </button>
            {!wa && <div className="cartd-sub" style={{ textAlign: 'center', marginTop: 6 }}>This business has no WhatsApp number configured.</div>}
          </div>
        )}
      </div>

      <style>{`
        .cartd-wrap{position:fixed;inset:0;background:rgba(10,14,30,0.55);z-index:950;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .18s ease}
        .cartd{background:#fff;border-radius:22px 22px 0 0;width:100%;max-width:480px;max-height:82vh;display:flex;flex-direction:column;animation:fadeInUp .22s ease}
        .cartd-bar{width:42px;height:5px;border-radius:3px;background:#D9DEE9;margin:10px auto 4px;flex-shrink:0}
        .cartd-head{display:flex;align-items:center;justify-content:space-between;padding:8px 18px 10px;border-bottom:1px solid #F0F1F7;flex-shrink:0}
        .cartd-title{font-size:15px;font-weight:800;color:var(--dark)}
        .cartd-title i{color:var(--primary);margin-right:6px}
        .cartd-clear{border:none;background:none;color:#C42B1C;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit}
        .cartd-empty{padding:44px 0;text-align:center;color:var(--text-light);font-size:14px}
        .cartd-items{overflow-y:auto;padding:6px 16px}
        .cartd-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F5F6FA}
        .cartd-item img,.cartd-noimg{width:52px;height:52px;border-radius:10px;object-fit:cover;flex-shrink:0;background:#F1F3F9;display:flex;align-items:center;justify-content:center;font-size:20px}
        .cartd-info{flex:1;min-width:0}
        .cartd-name{font-size:13.5px;font-weight:700;color:var(--dark);line-height:1.25}
        .cartd-sub{font-size:11px;color:var(--text-secondary);margin-top:2px}
        .cartd-price{font-size:13px;font-weight:800;color:var(--primary);margin-top:3px}
        .cartd-qty{display:flex;align-items:center;gap:8px;flex-shrink:0}
        .cartd-qty button{width:26px;height:26px;border-radius:8px;border:1px solid #E3E7F0;background:#fff;font-size:14px;cursor:pointer;color:var(--dark);line-height:1}
        .cartd-qty span{font-size:13px;font-weight:800;min-width:16px;text-align:center}
        .cartd-foot{padding:12px 18px calc(16px + env(safe-area-inset-bottom));border-top:1px solid #F0F1F7;flex-shrink:0}
        .cartd-total{display:flex;justify-content:space-between;font-size:14px;color:var(--dark);margin-bottom:10px}
        .cartd-checkout{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 0;border:none;border-radius:14px;background:#25D366;color:#fff;font-size:14px;font-weight:800;font-family:inherit;cursor:pointer}
        .cartd-checkout:disabled{opacity:.5;cursor:default}
      `}</style>
    </div>
  );
}
