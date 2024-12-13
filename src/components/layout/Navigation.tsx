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
          <svg className="nav-logo" width="136" height="37" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="8" y="29" width="136" height="37"/></clipPath><clipPath id="clip1"><rect x="0" y="0" width="1.2954e+06" height="352425"/></clipPath><image width="240" height="121" xlinkHref="data:image/jpeg;base64,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" preserveAspectRatio="none" id="img2"></image><clipPath id="clip3"><path d="M303788 299528 1.59919e+06 299528 1.59919e+06 632386 303788 632386Z" fill-rule="evenodd" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#clip0)" transform="translate(-8 -29)"><g clip-path="url(#clip1)" transform="matrix(0.000104987 0 0 0.000104987 8 29)"><g clip-path="url(#clip3)" transform="matrix(1 0 0 1.05879 -303788 -317137)"><use width="100%" height="100%" xlinkHref="#img2" transform="scale(7972.44 7972.44)"></use></g></g></g></svg>
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
