import { useRef, useEffect, useCallback, useState } from 'react'
import { hexToHsv, hsvToHex, hexToRgb, rgbToHex } from '../utils/colorUtils.ts'

interface Props {
  hex: string
  onChange: (hex: string) => void
  onClose: () => void
}

type ColorFormat = 'HEX' | 'RGB' | 'HSL'

function hsvToHsl(h: number, s: number, v: number) {
  const l = v * (1 - s / 2)
  const sl = (l === 0 || l === 1) ? 0 : (v - l) / Math.min(l, 1 - l)
  return { h: Math.round(h), s: Math.round(sl * 100), l: Math.round(l * 100) }
}

function hslToHsv(h: number, sPct: number, lPct: number) {
  const s = sPct / 100, l = lPct / 100
  const v = l + s * Math.min(l, 1 - l)
  const sv = v === 0 ? 0 : 2 * (1 - l / v)
  return { h, s: sv, v }
}

export default function ColorPicker({ hex, onChange, onClose }: Props) {
  const [hsv, setHsv] = useState(() => hexToHsv(hex))
  const [hexInput, setHexInput] = useState(hex)
  const [format, setFormat] = useState<ColorFormat>('HEX')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hueRef = useRef<HTMLCanvasElement>(null)
  const alphaRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingSV = useRef(false)
  const isDraggingHue = useRef(false)

  const previewHex = hsvToHex(hsv.h, hsv.s, hsv.v)
  const rgb = hexToRgb(previewHex)
  const hsl = hsvToHsl(hsv.h, hsv.s, hsv.v)

  // Draw SV gradient canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const w = canvas.width, h = canvas.height
    const gradH = ctx.createLinearGradient(0, 0, w, 0)
    gradH.addColorStop(0, 'white')
    gradH.addColorStop(1, hsvToHex(hsv.h, 1, 1))
    ctx.fillStyle = gradH
    ctx.fillRect(0, 0, w, h)
    const gradV = ctx.createLinearGradient(0, 0, 0, h)
    gradV.addColorStop(0, 'rgba(0,0,0,0)')
    gradV.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = gradV
    ctx.fillRect(0, 0, w, h)
    const cx = hsv.s * w, cy = (1 - hsv.v) * h
    ctx.beginPath()
    ctx.arc(cx, cy, 7, 0, Math.PI * 2)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, 6, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [hsv])

  // Draw hue slider
  useEffect(() => {
    const canvas = hueRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
    for (let i = 0; i <= 360; i += 30) {
      grad.addColorStop(i / 360, `hsl(${i},100%,50%)`)
    }
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const x = (hsv.h / 360) * canvas.width
    ctx.beginPath()
    ctx.arc(x, canvas.height / 2, 7, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [hsv.h])

  // Draw opacity/alpha slider — visual only, cursor pinned at 100%
  useEffect(() => {
    const canvas = alphaRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const w = canvas.width, h = canvas.height
    // Checkerboard
    const sq = 5
    for (let x = 0; x < w; x += sq) {
      for (let y = 0; y < h; y += sq) {
        ctx.fillStyle = (Math.floor(x / sq) + Math.floor(y / sq)) % 2 === 0 ? '#666' : '#999'
        ctx.fillRect(x, y, sq, sq)
      }
    }
    // Color → transparent gradient
    if (rgb) {
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`)
      grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},1)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    }
    // Cursor at 100% (far right)
    ctx.beginPath()
    ctx.arc(w - 2, h / 2, 7, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [hsv]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateFromHsv = useCallback((h: number, s: number, v: number) => {
    setHsv({ h, s, v })
    const newHex = hsvToHex(h, s, v)
    setHexInput(newHex)
    onChange(newHex)
  }, [onChange])

  const handleSVDrag = useCallback((e: MouseEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height))
    updateFromHsv(hsv.h, s, v)
  }, [hsv.h, updateFromHsv])

  const handleHueDrag = useCallback((e: MouseEvent | React.MouseEvent) => {
    const canvas = hueRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const h = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360))
    updateFromHsv(h, hsv.s, hsv.v)
  }, [hsv.s, hsv.v, updateFromHsv])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDraggingSV.current) handleSVDrag(e)
      if (isDraggingHue.current) handleHueDrag(e)
    }
    const onUp = () => { isDraggingSV.current = false; isDraggingHue.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [handleSVDrag, handleHueDrag])

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose()
    }
    setTimeout(() => window.addEventListener('mousedown', handler), 0)
    return () => window.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleHexInput = (val: string) => {
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const newHsv = hexToHsv(val)
      setHsv(newHsv)
      onChange(val)
    }
  }

  async function handleEyedropper() {
    // @ts-ignore — EyeDropper API (Chromium only)
    if (!('EyeDropper' in window)) return
    try {
      // @ts-ignore
      const picker = new window.EyeDropper()
      const result = await picker.open()
      handleHexInput(result.sRGBHex)
    } catch { /* user cancelled */ }
  }

  return (
    <div
      ref={containerRef}
      className="absolute select-none"
      style={{
        background: '#161616',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 16,
        padding: 14,
        width: 264,
        zIndex: 50,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      {/* SV Canvas */}
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <canvas
          ref={canvasRef}
          width={236}
          height={148}
          style={{ display: 'block', cursor: 'crosshair', borderRadius: 10 }}
          onMouseDown={e => { isDraggingSV.current = true; handleSVDrag(e) }}
        />
      </div>

      {/* Sliders row: [eyedropper] [hue + alpha stacked] */}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>

        {/* Eyedropper button */}
        <button
          onClick={handleEyedropper}
          title="Pick color from screen"
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.04)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 2,
            color: '#6b7280',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#a0a0a0'
            ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = '#6b7280'
            ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 22 1-1h3l9-9"/>
            <path d="M3 21v-3l9-9"/>
            <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8-1.4 1.4-.4-.4"/>
          </svg>
        </button>

        {/* Hue + alpha sliders stacked */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Hue slider */}
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <canvas
              ref={hueRef}
              width={200}
              height={20}
              style={{ display: 'block', height: 16, cursor: 'pointer', borderRadius: 8 }}
              onMouseDown={e => { isDraggingHue.current = true; handleHueDrag(e) }}
            />
          </div>
          {/* Opacity slider (visual only — always 100%) */}
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <canvas
              ref={alphaRef}
              width={200}
              height={20}
              style={{ display: 'block', height: 16, borderRadius: 8, cursor: 'default' }}
            />
          </div>
        </div>
      </div>

      {/* Input row: swatch + format switcher + format-specific inputs */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Preview swatch */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            flexShrink: 0,
            background: previewHex,
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
          }}
        />

        {/* Format dropdown */}
        <select
          value={format}
          onChange={e => setFormat(e.target.value as ColorFormat)}
          className="gl-select"
          style={{ fontSize: 10, padding: '3px 4px', flexShrink: 0, width: 50 }}
        >
          <option value="HEX">HEX</option>
          <option value="RGB">RGB</option>
          <option value="HSL">HSL</option>
        </select>

        {/* HEX input */}
        {format === 'HEX' && (
          <input
            type="text"
            value={hexInput}
            onChange={e => handleHexInput(e.target.value)}
            className="gl-input"
            style={{ flex: 1, fontSize: 11, padding: '4px 7px' }}
            spellCheck={false}
          />
        )}

        {/* RGB inputs */}
        {format === 'RGB' && rgb && (
          <>
            {(['r', 'g', 'b'] as const).map(ch => (
              <input
                key={ch}
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={e => {
                  const v = Math.max(0, Math.min(255, parseInt(e.target.value) || 0))
                  const updated = { ...rgb, [ch]: v }
                  handleHexInput(rgbToHex(updated.r, updated.g, updated.b))
                }}
                className="gl-input"
                style={{ width: 42, fontSize: 11, padding: '4px 3px', textAlign: 'center' }}
              />
            ))}
          </>
        )}

        {/* HSL inputs */}
        {format === 'HSL' && (
          <>
            <input
              type="number" min={0} max={360}
              value={hsl.h}
              onChange={e => {
                const h = Math.max(0, Math.min(360, parseInt(e.target.value) || 0))
                const n = hslToHsv(h, hsl.s, hsl.l)
                updateFromHsv(n.h, n.s, n.v)
              }}
              className="gl-input"
              style={{ width: 40, fontSize: 11, padding: '4px 3px', textAlign: 'center' }}
            />
            <input
              type="number" min={0} max={100}
              value={hsl.s}
              onChange={e => {
                const s = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                const n = hslToHsv(hsl.h, s, hsl.l)
                updateFromHsv(n.h, n.s, n.v)
              }}
              className="gl-input"
              style={{ width: 40, fontSize: 11, padding: '4px 3px', textAlign: 'center' }}
            />
            <input
              type="number" min={0} max={100}
              value={hsl.l}
              onChange={e => {
                const l = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                const n = hslToHsv(hsl.h, hsl.s, l)
                updateFromHsv(n.h, n.s, n.v)
              }}
              className="gl-input"
              style={{ width: 40, fontSize: 11, padding: '4px 3px', textAlign: 'center' }}
            />
            <span style={{ fontSize: 10, color: '#525252', flexShrink: 0 }}>%</span>
          </>
        )}
      </div>
    </div>
  )
}
