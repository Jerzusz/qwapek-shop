import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

export default function ShopLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Parse active category from URL
  const params = new URLSearchParams(location.search);
  const activeCategory = params.get('category') || 'Wszystkie';

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={openSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} activeCategory={activeCategory} />
      <main className="flex-1 mt-[105px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
