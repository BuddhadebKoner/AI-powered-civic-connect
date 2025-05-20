"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Home, Search, PlusCircle, Heart, User, X } from 'lucide-react'
import NavbarPopup from '../popups/NavbarPopup'

const Sidebar = () => {
   const [isOpen, setIsOpen] = useState(false)
   const [isMobile, setIsMobile] = useState(false)
   const pathname = usePathname()

   // Check if current route is active
   const isActive = (path: string) => pathname === path

   // Handle screen resize
   useEffect(() => {
      const checkScreenSize = () => {
         setIsMobile(window.innerWidth < 768)
      }

      // Initial check
      checkScreenSize()

      // Listen for resize events
      window.addEventListener('resize', checkScreenSize)

      // Cleanup
      return () => window.removeEventListener('resize', checkScreenSize)
   }, [])

   const toggleMenu = () => {
      setIsOpen(!isOpen)
      // Fix the overflow logic - only lock scroll when menu is open
      document.body.style.overflow = !isOpen ? 'hidden' : 'auto'
   }

   const closeMenu = () => {
      if (isOpen) {
         setIsOpen(false)
         document.body.style.overflow = 'auto'
      }
   }

   const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
      const active = isActive(href)
      return (
         <Link href={href} onClick={closeMenu} className={`group relative flex items-center justify-center p-2 rounded-full transition-colors ${active ? 'bg-[var(--color-surface-hover)]' : 'hover:bg-[var(--color-surface-hover)]'}`} aria-label={label}>
            <Icon size={24} className={active ? 'text-[var(--color-foreground)]' : 'text-[var(--color-gray-400)]'} />
            <span className="sr-only md:not-sr-only md:absolute md:left-full md:ml-2 md:whitespace-nowrap md:opacity-0 md:pointer-events-none md:bg-[var(--color-surface)] md:px-2 md:py-1 md:rounded md:text-sm md:shadow-lg md:group-hover:opacity-100 md:transition-opacity">{label}</span>
         </Link>
      )
   }

   const navItems = [
      { href: '/', icon: Home, label: 'Home' },
      { href: '/search', icon: Search, label: 'Search' },
      { href: '/create', icon: PlusCircle, label: 'Create' },
      { href: '/notification', icon: Heart, label: 'Notifications' },
      { href: '/sign-in', icon: User, label: 'Profile' }
   ]

   return (
      <>
         {/* Mobile bottom navigation */}
         {isMobile && (
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--color-background)] border-t border-[var(--color-border)] flex items-center justify-around px-2 z-10">
               {navItems.map((item) => (
                  <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
               ))}
            </nav>
         )}

         {/* Desktop sidebar */}
         {!isMobile && (
            <aside className="fixed left-0 h-screen w-16 flex flex-col items-center justify-between py-8 bg-[var(--color-background)] border-r border-[var(--color-border)] z-10">
               {/* Top - Menu */}
               <div>
                  <button
                     onClick={toggleMenu}
                     className="p-2 rounded-full hover:bg-[var(--color-surface-hover)] transition-colors"
                     aria-expanded={isOpen}
                     aria-label="Toggle menu">
                     {isOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
               </div>

               {/* Middle - Navigation */}
               <div className="flex flex-col items-center space-y-8">
                  {navItems.map((item) => (
                     <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
                  ))}
               </div>

               {/* Spacer for bottom padding */}
               <div></div>
            </aside>
         )}

         {/* Navbar Popup (Desktop only) */}
         {!isMobile && isOpen && (
            <NavbarPopup 
               isOpen={isOpen}
               closeMenu={closeMenu}
               isActive={isActive}
               navItems={navItems}
            />
         )}
      </>
   )
}

export default Sidebar