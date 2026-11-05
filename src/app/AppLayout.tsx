import { NavLink, Outlet } from 'react-router-dom';
import { NAVIGATION_ITEMS } from './navigationItems';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <main className={styles.content}>
        <Outlet />
      </main>
      <nav className={styles.nav} aria-label="Navigation principale">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
