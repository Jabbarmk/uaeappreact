import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <i className="fas fa-home"></i>
        <span>Home</span>
      </NavLink>
      <NavLink to="/classifieds" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <i className="fas fa-th-large"></i>
        <span>Classifieds</span>
      </NavLink>
      <NavLink to="/offers" className="nav-item nav-center">
        <div className="nav-plus"><i className="fas fa-search"></i></div>
      </NavLink>
      <NavLink to="/offers" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <i className="fas fa-tag"></i>
        <span>Offers</span>
      </NavLink>
      <NavLink to="/jobs" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <i className="fas fa-briefcase"></i>
        <span>Jobs</span>
      </NavLink>
    </nav>
  );
}
