'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Polaroid arrastável com máscara magnética sobre o rosto.
 *
 * Inspirado em jackiezhang.co.za — gesto humano que LLM não inventa.
 *
 * Comportamento:
 * - Polaroid inteira arrasta livre e fica onde solta (dragMomentum=false).
 * - Máscara arrasta DENTRO da polaroid e volta com snap magnético pro
 *   centro (dragSnapToOrigin + spring).
 * - Mobile (<md) fica oculto pra não confundir touch users.
 * - prefers-reduced-motion: snap da máscara fica instantâneo (spring rígido).
 *
 * Acessibilidade:
 * - alt descritivo na foto.
 * - Máscara é decoração — aria-hidden.
 * - draggable={false} nos <img> evita native drag do browser.
 * - select-none + touch-none previne seleção/scroll bug.
 *
 * Performance:
 * - Foto via next/image (otimização automática, evita LCP hit do JPG raw).
 *
 * Spec §22.7 do TASKS.md.
 */
type PolaroidDraggableProps = {
  photoSrc: string
  maskSrc: string
  /** PNG transparente; assinatura na faixa inferior da polaroid (opcional). */
  signatureSrc?: string
  signatureAlt?: string
  alt?: string
  initialRotation?: number
  className?: string
  style?: React.CSSProperties
}

export function PolaroidDraggable({
  photoSrc,
  maskSrc,
  signatureSrc,
  signatureAlt = 'assinatura',
  alt = 'foto de Matt Goulart',
  initialRotation = -3,
  className,
  style,
}: PolaroidDraggableProps) {
  const photoAreaRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      initial={{ rotate: initialRotation }}
      animate={{ rotate: initialRotation }}
      className={cn(
        'cursor-grab touch-none select-none',
        // Mobile (<md) fica oculto — touch gestures conflitam com scroll
        'hidden md:block',
        className,
      )}
      style={{
        background: 'var(--paper)',
        padding: '14px 14px 56px',
        boxShadow:
          '0 8px 28px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.10)',
        borderRadius: '2px',
        width: 264,
        ...style,
      }}
    >
      <div
        ref={photoAreaRef}
        className="relative overflow-hidden"
        style={{ width: 240, height: 280, background: 'var(--paper-2)' }}
      >
        <Image
          src={photoSrc}
          alt={alt}
          fill
          sizes="240px"
          draggable={false}
          className="object-cover"
          style={{ pointerEvents: 'none' }}
          priority={false}
        />

        {/* Máscara — arrasta dentro da polaroid, snap magnético pro centro */}
        <motion.img
          src={maskSrc}
          alt=""
          aria-hidden
          draggable={false}
          drag
          dragConstraints={photoAreaRef}
          dragElastic={0.18}
          dragSnapToOrigin
          dragTransition={
            reduced
              ? { bounceStiffness: 1200, bounceDamping: 60 }
              : { bounceStiffness: 420, bounceDamping: 18 }
          }
          whileDrag={{ cursor: 'grabbing', scale: 1.04 }}
          className="absolute inset-0 block h-full w-full cursor-grab object-contain"
        />
      </div>

      {signatureSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={signatureSrc}
          alt={signatureAlt}
          draggable={false}
          className="pointer-events-none absolute"
          style={{
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%) rotate(-4deg)',
            width: '60%',
            maxHeight: 32,
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      ) : null}
    </motion.div>
  )
}
