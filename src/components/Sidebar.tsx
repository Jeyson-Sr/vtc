import { NavLink } from 'react-router-dom';

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

const links = [
  { to: '/', label: 'Generar VTC', icon: '☰' },
  { to: '/formulas', label: 'Fórmulas', icon: '▦' },
  { to: '/jarabes', label: 'Jarabes', icon: '⚗' },
];

export function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark">VC</div>
        <div className="brand-text">
          <strong>VTC Caral</strong>
          <span>Embotelladora Caral</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? '»' : '« Menú'}
        </button>
        {!collapsed && <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Datos en el navegador (sql.js)</span>}
      </div>
    </aside>
  );
}
