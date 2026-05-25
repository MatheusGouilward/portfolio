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
 * - Máscara arrasta livre (sem dragConstraints) e volta com snap magnético
 *   pra posição inicial via dragSnapToOrigin + spring.
 * - Mobile (<md) fica oculto pra não confundir touch users.
 * - prefers-reduced-motion: snap da máscara fica instantâneo (spring rígido).
 *
 * Cor de fundo:
 * - Background fixo `#fafafa` (off-white de polaroid real) — NÃO usa
 *   var(--paper) porque a polaroid precisa contrastar em todas as 4
 *   paletas, especialmente carvao-giz onde --paper é escuro.
 *
 * Máscara:
 * - Props em % (relativas ao photo area) — redimensiona junto se PHOTO_*
 *   mudar. Defaults calibrados pra foto do Matt.
 * - Centralização horizontal automática via `calc((100% - maskWidth) / 2)`.
 *   CSS puro, não usa transform (que conflitaria com o transform que o
 *   Motion injeta no drag).
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
 * Specs §22.7 + §22.7.1 do TASKS.md.
 */
type PolaroidDraggableProps = {
  photoSrc: string
  maskSrc: string
  /** PNG transparente; assinatura na faixa inferior da polaroid (opcional). */
  signatureSrc?: string
  signatureAlt?: string
  alt?: string
  initialRotation?: number
  /** Offset do topo da máscara em % do photo area. Default '14%'. */
  maskTop?: string
  /** Largura da máscara em % do photo area. Default '55%'. */
  maskWidth?: string
  /** Altura da máscara em % do photo area. Default 'auto' (mantém aspect). */
  maskHeight?: string
  /** Offset à esquerda em %. Se ausente, centraliza horizontal. */
  maskLeft?: string
  className?: string
  style?: React.CSSProperties
}

const PHOTO_WIDTH = 240
const PHOTO_HEIGHT = 280

export function PolaroidDraggable({
  photoSrc,
  maskSrc,
  signatureSrc,
  signatureAlt = 'assinatura',
  alt = 'foto de Matt Goulart',
  initialRotation = -3,
  maskTop = '14%',
  maskWidth = '55%',
  maskHeight = 'auto',
  maskLeft,
  className,
  style,
}: PolaroidDraggableProps) {
  const photoAreaRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  // Centraliza horizontalmente via CSS puro quando maskLeft não passado.
  // calc não cria transform — preserva origin estável pro dragSnapToOrigin.
  const leftPos = maskLeft ?? `calc((100% - ${maskWidth}) / 2)`

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      initial={{ rotate: initialRotation }}
      animate={{ rotate: initialRotation }}
      className={cn(
        'cursor-grab touch-none select-none',
        'hidden md:block',
        className,
      )}
      style={{
        background: '#fafafa',
        padding: '14px 14px 56px',
        boxShadow:
          '0 12px 36px rgba(0, 0, 0, 0.28), 0 4px 10px rgba(0, 0, 0, 0.14)',
        borderRadius: '2px',
        width: 264,
        outline: '1px solid rgba(0, 0, 0, 0.06)',
        outlineOffset: '-1px',
        ...style,
      }}
    >
      <div
        className="relative"
        style={{ width: PHOTO_WIDTH, height: PHOTO_HEIGHT }}
      >
        {/* Foto clipada — overflow-hidden só na foto */}
        <div
          ref={photoAreaRef}
          className="absolute inset-0 overflow-hidden"
          style={{ background: '#e8e2d3' }}
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
        </div>

        {/* Máscara — sibling da foto, FORA do overflow-hidden.
            Posicionamento em % do photo area. CSS layout puro (left + top
            via calc) — sem transform pré-drag pra Motion não interferir. */}
        <motion.img
          src={maskSrc}
          alt=""
          aria-hidden
          draggable={false}
          drag
          dragSnapToOrigin
          dragTransition={
            reduced
              ? { bounceStiffness: 1200, bounceDamping: 60 }
              : { bounceStiffness: 420, bounceDamping: 18 }
          }
          whileDrag={{ cursor: 'grabbing', scale: 1.04 }}
          className="absolute block cursor-grab"
          style={{
            top: maskTop,
            left: leftPos,
            width: maskWidth,
            height: maskHeight,
            // Reserva slot pre-load: aspect 1/1 quando height é auto, evita
            // layout shift se a imagem demorar a carregar.
            aspectRatio: maskHeight === 'auto' ? '1 / 1' : undefined,
            objectFit: 'contain',
          }}
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
