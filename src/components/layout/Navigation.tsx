import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import {
      Home,
      Wrench,
      Power,
      RotateCcw,
      Settings,
      Cpu,
      GitCompareArrows,
      Chrome,
      Fan,
      NotepadText,
      Cog
    } from 'lucide-react';

    const navItems = [
      { icon: Home, label: 'Главная', href: '/'},
      { icon: Wrench, label: 'Разборка', href: '/disassembly'},
      { icon: Chrome, label: 'Обмотка', href: '/winding'},
      { icon: Fan, label: 'Токарные', href: '/turning'},
      { icon: GitCompareArrows, label: 'Сборка', href: '/assembly'},
      { icon: NotepadText, label: 'Прочие', href: '/other'},
      { icon: Cog, label: 'Профиль', href: '/profile'},
    ];

    export function Navigation() {
      const location = useLocation();

      return (
        <nav className="nav">
          <div className="hidden md:flex items-center px-4 h-16 border-b border-gray-200">
          <svg width="35" height="28" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="19" y="38" width="35" height="28"/></clipPath><clipPath id="clip1"><rect x="-18.5295" y="-5.76871" width="30000.18" height="809.089"/></clipPath><image width="65" height="50" xlinkHref="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAADB//2Q==" preserveAspectRatio="none" id="img2"></image><clipPath id="clip3"><rect x="0" y="0" width="1034.8" height="796"/></clipPath></defs><g clip-path="url(#clip0)" transform="translate(-19 -38)"><g clip-path="url(#clip1)" transform="matrix(0.0386728 0 0 0.0383147 17.7166 36.221)"><g clip-path="url(#clip3)" transform="matrix(1.00503 0 0 1 2.10498e-05 -3.98004e-05)"><use width="100%" height="100%" xlinkHref="#img2" transform="scale(15.92 15.92)"></use></g></g></g></svg>
            <span className="text-lg font-bold text-gray-800 ml-2">КОРТА</span>
          </div>
          <ul className="nav-list pt-0 md:pt-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      );
    }
