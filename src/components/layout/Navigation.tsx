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
          <svg className="nav-logo" width="136" height="37" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="8" y="29" width="136" height="37"/></clipPath><clipPath id="clip1"><rect x="0" y="0" width="1.2954e+06" height="352425"/></clipPath><image width="240" height="121" xlinkHref="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/so+ +G3wn8M2vhTwXrWn/ /2Q==" preserveAspectRatio="none" id="img2"></image><clipPath id="clip3"><path d="M303788 299528 1.59919e+06 299528 1.59919e+06 632386 303788 632386Z" fill-rule="evenodd" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#clip0)" transform="translate(-8 -29)"><g clip-path="url(#clip1)" transform="matrix(0.000104987 0 0 0.000104987 8 29)"><g clip-path="url(#clip3)" transform="matrix(1 0 0 1.05879 -303788 -317137)"><use width="100%" height="100%" xlinkHref="#img2" transform="scale(7972.44 7972.44)"></use></g></g></g></svg>
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
