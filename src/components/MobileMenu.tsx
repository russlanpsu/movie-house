// src/components/MobileMenu.tsx
import { Disclosure, DisclosureButton, DisclosurePanel, CloseButton } from '@headlessui/react';
import { NavLink } from 'react-router-dom';
import './MobileMenu.css';

export function MobileMenu() {
  return (
    <Disclosure as="div" className="mobile-menu">
      {({ open }) => (
        <>
          <DisclosureButton
            className={`mobile-menu__burger ${open ? 'mobile-menu__burger--open' : ''}`}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span className="mobile-menu__line" />
            <span className="mobile-menu__line" />
            <span className="mobile-menu__line" />
          </DisclosureButton>

          <DisclosurePanel className="mobile-menu__panel">
            <CloseButton as={NavLink} to="/" end className="mobile-menu__link">
              Home
            </CloseButton>
            <CloseButton as={NavLink} to="/about" className="mobile-menu__link">
              About
            </CloseButton>
            <CloseButton as={NavLink} to="/favorites" className="mobile-menu__link">
              Избранное
            </CloseButton>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}