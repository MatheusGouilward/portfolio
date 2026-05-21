'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { nav } from '@/lib/site'
import { cn } from '@/lib/utils'

/**
 * Drawer mobile que abre da direita ao tocar no bracket-glyph.
 * - Apenas <sm (640px).
 * - Foco move pro 1º link ao abrir; restaura no trigger ao fechar.
 * - `inert` no resto da página enquanto aberto (focus trap robusto).
 * - Esc fecha.
 * - iOS-safe scroll lock (position: fixed + restore scrollY).
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const reduced = useReducedMotion() ?? false
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Portal target: only after mount to keep SSR-safe.
  useEffect(() => setMounted(true), [])

  // Esc fecha
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // iOS-safe scroll lock + foco inicial + inert em irmãos do drawer no <body>
  useEffect(() => {
    if (!open) return

    const scrollY = window.scrollY
    const body = document.body
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'

    // Drawer is portaled to <body> — inert everything else in body except the
    // portal node itself (data-mobile-nav-portal).
    const inerted: Element[] = []
    for (const child of Array.from(body.children)) {
      if (child.hasAttribute('data-mobile-nav-portal')) continue
      if (child.hasAttribute('inert')) continue
      child.setAttribute('inert', '')
      inerted.push(child)
    }

    // Foco no 1º link após a próxima paint
    const focusId = window.requestAnimationFrame(() => {
      firstLinkRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(focusId)
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
      for (const el of inerted) el.removeAttribute('inert')
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex size-11 items-center justify-center sm:hidden',
          'text-[var(--pencil-darkest)] transition-colors duration-[var(--duration-fast)]',
          'hover:text-[var(--pencil)]',
        )}
      >
        {open ? <CloseGlyph /> : <BracketGlyph />}
      </button>

      {mounted
        ? createPortal(
            <div data-mobile-nav-portal>
              <AnimatePresence>
                {open ? (
                  <>
                    <motion.div
                      key="backdrop"
                      className="fixed inset-0 z-40 sm:hidden"
                      style={{ background: 'var(--backdrop)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.2 }}
                      onClick={() => setOpen(false)}
                      aria-hidden
                    />
                    <motion.aside
                      key="drawer"
                      id="mobile-nav-drawer"
                      role="dialog"
                      aria-modal="true"
                      aria-label="Navegação principal"
                      className={cn(
                        'fixed right-0 top-0 z-50 h-dvh w-[78vw] max-w-[320px] sm:hidden',
                        'border-l border-[var(--line-strong)]',
                        'flex flex-col gap-2 px-6 py-20',
                      )}
                      style={{ background: 'var(--paper)' }}
                      initial={{ x: reduced ? 0 : '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: reduced ? 0 : '100%' }}
                      transition={{
                        duration: reduced ? 0 : 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <span className="mono-upper mb-6 text-[var(--pencil-mid)]">
                        navegação
                      </span>
                      <ul className="flex flex-col gap-1">
                        {nav.slice(1).map((item, i) => (
                          <li key={item.href}>
                            <Link
                              ref={i === 0 ? firstLinkRef : undefined}
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                'block py-3 text-xl font-semibold',
                                'text-[var(--pencil-darkest)]',
                                'transition-colors duration-[var(--duration-fast)]',
                                'hover:text-[var(--pencil)]',
                              )}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.aside>
                  </>
                ) : null}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

function BracketGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M 3 19 L 3 3 L 19 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M 7 11 L 19 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 11 15 L 19 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M 4 4 L 16 16 M 16 4 L 4 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
