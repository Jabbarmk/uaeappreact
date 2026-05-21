import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Header from './Header';

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
