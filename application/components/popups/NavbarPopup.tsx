import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface NavbarPopupProps {
   isOpen: boolean
   closeMenu: () => void
   isActive: (path: string) => boolean
   navItems: {
      href: string
      icon: LucideIcon
      label: string
   }[]
}

const NavbarPopup: React.FC<NavbarPopupProps> = ({ isOpen, closeMenu, isActive, navItems }) => {
   if (!isOpen) return null

   return (
      <>
         {/* Backdrop for closing menu */}
         <div
            className="fixed inset-0 bg-black/20 z-[9]"
            onClick={closeMenu}
            aria-hidden="true"
         />
         <div className="fixed top-4 left-20 w-56 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg shadow-lg z-20 animate-fadeIn">
            <ul className="flex flex-col p-4 space-y-2">
               {navItems.map((item) => (
                  <li key={item.href}>
                     <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`block p-2 rounded ${isActive(item.href) ? 'bg-[var(--color-surface-hover)]' : 'hover:bg-[var(--color-surface-hover)]'} transition-colors`}
                     >
                        {item.label}
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </>
   )
}

export default NavbarPopup