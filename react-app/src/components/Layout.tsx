import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <>
      {/* <Topbar /> */}
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
