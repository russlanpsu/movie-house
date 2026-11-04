import { NavLink, Outlet } from 'react-router-dom'
import "./Layout.css";
import { MovieSearch } from './MovieSearch';
// import { DebugConsole } from './DebugConsole';

export function Layout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header__inner">
          <nav className="app-nav">
            <NavLink to="/" end className="app-nav__link">Home</NavLink>
            <NavLink to="/favorites" end className="app-nav__link">Favorites</NavLink>
            <NavLink to="/about" className="app-nav__link">About</NavLink>
          </nav>
          <MovieSearch/>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
       <footer className="app-footer">
        <p>© 2026 Мой сайт</p>
      </footer>
      {/* <DebugConsole/> */}
    </div>
  )
}


