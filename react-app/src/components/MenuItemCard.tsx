// Food/menu item card — image, name, price, veg/non-veg dot. Tap → onOpen (popup with full description + order CTA).
export default function MenuItemCard({ item, onOpen }: { item: any; onOpen: (item: any) => void }) {
  return (
    <div onClick={() => onOpen(item)}
      style={{ width: 150, flexShrink: 0, background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,.05)', cursor: 'pointer', overflow: 'hidden', WebkitTapHighlightColor: 'transparent' }}>
      <div style={{ width: '100%', height: 100, background: '#F3F3F7' }}>
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🍽️</div>}
      </div>
      <div style={{ padding: '9px 10px 11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {item.is_veg != null && (
            <span style={{ width: 12, height: 12, border: `1.5px solid ${item.is_veg ? '#0E9F6E' : '#C42B1C'}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.is_veg ? '#0E9F6E' : '#C42B1C' }} />
            </span>
          )}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1C1C1E', lineHeight: 1.25, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</div>
        </div>
        {item.price != null && (
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', marginTop: 5 }}>{item.currency || 'AED'} {Number(item.price).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
}
