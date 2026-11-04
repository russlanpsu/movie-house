// src/components/Layout.tsx
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';
import { MobileMenu } from './MobileMenu';

export function Layout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-logo">
            Мой сайт
          </NavLink>

          <MobileMenu />
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>© 2026 Мой сайт</p>
      </footer>
    </div>
  );
}