import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

// ─── Read a CSS custom property from :root ─────────────────────────────────
function tok(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ─── Read a CSS custom property from a specific element ────────────────────
function tokEl(el: HTMLElement | null, name: string): string {
  if (!el) return '';
  return getComputedStyle(el).getPropertyValue(name).trim();
}

// ─── Shared: page shell ────────────────────────────────────────────────────
function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-secondary text-primary" style={{ minHeight: '100vh', padding: '48px 64px', fontFamily: 'var(--font-family-sans)' }}>
      {children}
    </div>
  );
}

// ─── Shared: section block ─────────────────────────────────────────────────
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '64px' }}>
      <h2 className="text-heading-h3 text-primary" style={{ marginBottom: '4px' }}>{title}</h2>
      {description && <p className="text-body-sm text-secondary" style={{ marginBottom: '24px', marginTop: '4px' }}>{description}</p>}
      {!description && <div style={{ marginBottom: '24px' }} />}
      {children}
    </section>
  );
}

// ─── Shared: group label ───────────────────────────────────────────────────
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-overline-md text-tertiary" style={{ marginBottom: '12px', marginTop: '24px' }}>{children}</p>
  );
}

// ─── Color swatch ──────────────────────────────────────────────────────────
function Swatch({ token, label, containerEl }: { token: string; label?: string; containerEl?: React.RefObject<HTMLDivElement | null> }) {
  const [value, setV] = React.useState('');
  const [isBright, setIsBright] = React.useState(false);
  const swatchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = containerEl ? containerEl.current : null;
    const raw = el ? tokEl(el, token) : tok(token);
    setV(raw || '—');

    // Check if background is bright so we can pick text color
    if (swatchRef.current) {
      const bg = getComputedStyle(swatchRef.current).backgroundColor;
      const m = bg.match(/\d+/g);
      if (m && m.length >= 3) {
        const [r, g, b] = m.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        setIsBright(luminance > 0.65);
      }
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px', flex: '1 1 140px', maxWidth: '180px' }}>
      <div
        ref={swatchRef}
        style={{
          background: `var(${token})`,
          height: '56px',
          borderRadius: 'var(--radius-component-md)',
          border: '1px solid var(--color-border-subtle)',
        }}
      />
      <div>
        <code
          className="text-code-xs"
          style={{
            color: 'var(--color-text-brand)',
            display: 'block',
            wordBreak: 'break-all',
          }}
        >
          {token}
        </code>
        <span className="text-caption-sm text-tertiary" style={{ display: 'block', marginTop: '2px' }}>
          {label || value}
        </span>
      </div>
    </div>
  );
}

// ─── Color group ───────────────────────────────────────────────────────────
function SwatchGroup({ tokens, containerEl }: { tokens: { token: string; label?: string }[]; containerEl?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
      {tokens.map(({ token, label }) => (
        <Swatch key={token} token={token} label={label} containerEl={containerEl} />
      ))}
    </div>
  );
}

// ─── Themed color palette panel ────────────────────────────────────────────
function ThemedPalette({ theme, label }: { theme?: string; label: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  const bg: React.CSSProperties = theme === 'dark'
    ? { background: '#030712' }
    : theme === 'brand'
      ? { background: '#ffffff' }
      : {};

  return (
    <div data-theme={theme} ref={ref} style={{ borderRadius: 'var(--radius-component-lg)', padding: '24px', border: '1px solid var(--color-border-default)', ...bg, marginBottom: '24px' }}>
      <p className="text-label-md" style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>{label}</p>

      <GroupLabel>Background</GroupLabel>
      <SwatchGroup containerEl={ref} tokens={[
        { token: '--color-bg-primary' },
        { token: '--color-bg-secondary' },
        { token: '--color-bg-tertiary' },
        { token: '--color-bg-inverse' },
      ]} />

      <GroupLabel>Text</GroupLabel>
      <SwatchGroup containerEl={ref} tokens={[
        { token: '--color-text-primary' },
        { token: '--color-text-secondary' },
        { token: '--color-text-tertiary' },
        { token: '--color-text-disabled' },
        { token: '--color-text-brand' },
        { token: '--color-text-accent' },
        { token: '--color-text-inverse' },
      ]} />

      <GroupLabel>Border</GroupLabel>
      <SwatchGroup containerEl={ref} tokens={[
        { token: '--color-border-subtle' },
        { token: '--color-border-default' },
        { token: '--color-border-strong' },
        { token: '--color-border-focus' },
        { token: '--color-border-error' },
        { token: '--color-border-brand' },
        { token: '--color-border-success' },
        { token: '--color-border-warning' },
      ]} />

      <GroupLabel>Action</GroupLabel>
      <SwatchGroup containerEl={ref} tokens={[
        { token: '--color-action-primary' },
        { token: '--color-action-primary-hover' },
        { token: '--color-action-primary-active' },
        { token: '--color-action-secondary' },
        { token: '--color-action-disabled' },
        { token: '--color-action-accent' },
      ]} />

      <GroupLabel>Status</GroupLabel>
      <SwatchGroup containerEl={ref} tokens={[
        { token: '--color-status-success' },
        { token: '--color-status-success-subtle' },
        { token: '--color-status-warning' },
        { token: '--color-status-warning-subtle' },
        { token: '--color-status-error' },
        { token: '--color-status-error-subtle' },
        { token: '--color-status-info' },
        { token: '--color-status-info-subtle' },
      ]} />

      <GroupLabel>State</GroupLabel>
      <SwatchGroup containerEl={ref} tokens={[
        { token: '--color-state-selected' },
        { token: '--color-state-highlight' },
        { token: '--color-state-loading' },
        { token: '--color-state-loading-shine' },
      ]} />
    </div>
  );
}

// ─── Token row (for tables) ────────────────────────────────────────────────
function TokenRow({ name, value, description }: { name: string; value?: string; description?: string }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
      <td style={{ padding: '10px 12px' }}>
        <code className="text-code-sm" style={{ color: 'var(--color-text-brand)' }}>{name}</code>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <code className="text-code-sm text-secondary">{value || tok(name) || '—'}</code>
      </td>
      {description && (
        <td style={{ padding: '10px 12px' }}>
          <span className="text-body-sm text-tertiary">{description}</span>
        </td>
      )}
    </tr>
  );
}

// ─── Token table ───────────────────────────────────────────────────────────
function TokenTable({ headers, rows }: {
  headers: string[];
  rows: { name: string; value?: string; description?: string }[];
}) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-component-lg)', overflow: 'hidden', border: '1px solid var(--color-border-subtle)' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--color-border-default)' }}>
          {headers.map(h => (
            <th key={h} className="text-label-sm text-secondary" style={{ padding: '10px 12px', textAlign: 'left', background: 'var(--color-bg-secondary)' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(r => <TokenRow key={r.name} {...r} />)}
      </tbody>
    </table>
  );
}

// ─── Scale bar ─────────────────────────────────────────────────────────────
function ScaleBar({ token, label, description }: { token: string; label?: string; description?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
      <div style={{ width: '160px', flexShrink: 0 }}>
        <code className="text-code-xs" style={{ color: 'var(--color-text-brand)' }}>{token}</code>
        {description && <span className="text-caption-sm text-tertiary" style={{ display: 'block' }}>{description}</span>}
      </div>
      <div style={{ width: `var(${token})`, height: '8px', background: 'var(--color-action-primary)', borderRadius: 'var(--radius-component-full)', flexShrink: 0 }} />
      <span className="text-code-xs text-tertiary">{label || tok(token)}</span>
    </div>
  );
}

// ─── STORY: Colors ─────────────────────────────────────────────────────────
export const Colors: Story = {
  render: () => (
    <Page>
      <h1 className="text-heading-h2 text-primary" style={{ marginBottom: '8px' }}>Color Tokens</h1>
      <p className="text-body-md text-secondary" style={{ marginBottom: '48px' }}>
        Semantic color tokens that adapt to light, dark, and brand themes. Use these via CSS custom properties or the semantic utility classes.
      </p>

      <Section title="Light Mode" description="Default theme — applied to :root and [data-theme='light']">
        <ThemedPalette label="Light" />
      </Section>

      <Section title="Dark Mode" description="Applied when [data-theme='dark'] is set on a parent element">
        <ThemedPalette theme="dark" label="Dark" />
      </Section>

      <Section title="Brand Mode" description="Applied when [data-theme='brand'] is set on a parent element">
        <ThemedPalette theme="brand" label="Brand" />
      </Section>
    </Page>
  ),
};

// ─── STORY: Typography ─────────────────────────────────────────────────────
type TypographyRow = { cls: string; sample: string; meta: string };

function TypoRow({ cls, sample, meta }: TypographyRow) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 260px', alignItems: 'center', gap: '24px', borderBottom: '1px solid var(--color-border-subtle)', padding: '16px 0' }}>
      <div>
        <code className="text-code-xs" style={{ color: 'var(--color-text-brand)' }}>.{cls}</code>
      </div>
      <div className={cls} style={{ color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sample}</div>
      <div>
        <code className="text-code-xs text-tertiary">{meta}</code>
      </div>
    </div>
  );
}

const TYPO_ROWS: TypographyRow[] = [
  { cls: 'text-display-hero',  sample: 'Display Hero',   meta: '96px · bold · −0.075rem' },
  { cls: 'text-display-3xl',   sample: 'Display 3XL',    meta: '80px · bold · −0.075rem' },
  { cls: 'text-display-2xl',   sample: 'Display 2XL',    meta: '72px · bold · −0.075rem' },
  { cls: 'text-display-xl',    sample: 'Display XL',     meta: '64px · bold · −0.075rem' },
  { cls: 'text-display-lg',    sample: 'Display LG',     meta: '56px · bold · −0.075rem' },
  { cls: 'text-display-md',    sample: 'Display MD',     meta: '48px · bold · −0.075rem' },
  { cls: 'text-display-sm',    sample: 'Display SM',     meta: '40px · bold · −0.075rem' },
  { cls: 'text-heading-h1',    sample: 'Heading 1',      meta: '36px · bold · −0.025rem' },
  { cls: 'text-heading-h2',    sample: 'Heading 2',      meta: '32px · bold · −0.025rem' },
  { cls: 'text-heading-h3',    sample: 'Heading 3',      meta: '28px · semibold · −0.025rem' },
  { cls: 'text-heading-h4',    sample: 'Heading 4',      meta: '24px · semibold · −0.025rem' },
  { cls: 'text-heading-h5',    sample: 'Heading 5',      meta: '20px · semibold · −0.025rem' },
  { cls: 'text-body-lg',       sample: 'Body Large — The quick brown fox jumps over the lazy dog.',   meta: '20px · regular · 0rem' },
  { cls: 'text-body-md',       sample: 'Body Medium — The quick brown fox jumps over the lazy dog.',  meta: '16px · regular · 0rem' },
  { cls: 'text-body-sm',       sample: 'Body Small — The quick brown fox jumps over the lazy dog.',   meta: '14px · regular · 0rem' },
  { cls: 'text-body-xs',       sample: 'Body XS — The quick brown fox jumps over the lazy dog.',     meta: '12px · regular · 0rem' },
  { cls: 'text-body-2xs',      sample: 'Body 2XS — The quick brown fox jumps over the lazy dog.',    meta: '10px · regular · 0rem' },
  { cls: 'text-label-md',      sample: 'Label Medium',   meta: '14px · medium · 0.025rem' },
  { cls: 'text-label-sm',      sample: 'Label Small',    meta: '12px · medium · 0.025rem' },
  { cls: 'text-label-xs',      sample: 'Label XS',       meta: '10px · medium · 0.025rem' },
  { cls: 'text-caption-md',    sample: 'Caption Medium', meta: '12px · regular · 0.05rem' },
  { cls: 'text-caption-sm',    sample: 'Caption Small',  meta: '10px · regular · 0.05rem' },
  { cls: 'text-overline-md',   sample: 'Overline',       meta: '12px · medium · 0.05rem · uppercase' },
  { cls: 'text-code-md',       sample: 'const answer = 42;',  meta: '16px · mono · regular' },
  { cls: 'text-code-sm',       sample: 'const answer = 42;',  meta: '14px · mono · regular' },
  { cls: 'text-code-xs',       sample: 'const answer = 42;',  meta: '12px · mono · regular' },
  { cls: 'text-code-2xs',      sample: 'const answer = 42;',  meta: '10px · mono · regular' },
  { cls: 'text-button-xl',     sample: 'Button XL',      meta: '16px · regular · 0rem' },
  { cls: 'text-button-lg',     sample: 'Button LG',      meta: '14px · medium · 0.025rem' },
  { cls: 'text-button-md',     sample: 'Button MD',      meta: '14px · medium · 0.025rem' },
  { cls: 'text-button-sm',     sample: 'Button SM',      meta: '12px · medium · 0.025rem' },
  { cls: 'text-button-xs',     sample: 'Button XS',      meta: '10px · medium · 0.025rem' },
];

export const Typography: Story = {
  render: () => (
    <Page>
      <h1 className="text-heading-h2 text-primary" style={{ marginBottom: '8px' }}>Typography Scale</h1>
      <p className="text-body-md text-secondary" style={{ marginBottom: '48px' }}>
        Semantic text style classes that compose font-family, size, weight, line-height and letter-spacing. Apply the class directly to any element.
      </p>

      <div style={{ background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-component-lg)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 260px', gap: '24px', padding: '12px 0', borderBottom: '2px solid var(--color-border-default)' }}>
          <span className="text-label-sm text-tertiary">Class</span>
          <span className="text-label-sm text-tertiary">Sample</span>
          <span className="text-label-sm text-tertiary">Properties</span>
        </div>
        {TYPO_ROWS.map(row => <TypoRow key={row.cls} {...row} />)}
      </div>
    </Page>
  ),
};

// ─── STORY: Spacing ────────────────────────────────────────────────────────
export const Spacing: Story = {
  render: () => (
    <Page>
      <h1 className="text-heading-h2 text-primary" style={{ marginBottom: '8px' }}>Spacing & Sizing</h1>
      <p className="text-body-md text-secondary" style={{ marginBottom: '48px' }}>
        Spacing and sizing tokens for component internals, page layouts, and component heights.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
        <div>
          <Section title="Component Spacing" description="Internal padding and gap for UI components">
            <ScaleBar token="--spacing-component-xs" description="4px · tight padding" />
            <ScaleBar token="--spacing-component-sm" description="8px · compact padding" />
            <ScaleBar token="--spacing-component-md" description="12px · default padding" />
            <ScaleBar token="--spacing-component-lg" description="16px · relaxed padding" />
            <ScaleBar token="--spacing-component-xl" description="24px · spacious padding" />
          </Section>

          <Section title="Layout Spacing" description="Section and page-level gutters">
            <ScaleBar token="--spacing-layout-xs" description="16px" />
            <ScaleBar token="--spacing-layout-sm" description="24px" />
            <ScaleBar token="--spacing-layout-md" description="32px" />
            <ScaleBar token="--spacing-layout-lg" description="48px" />
            <ScaleBar token="--spacing-layout-xl" description="64px" />
          </Section>
        </div>

        <div>
          <Section title="Component Height" description="Standard heights for interactive elements">
            <ScaleBar token="--size-component-xs" description="24px · chip, badge" />
            <ScaleBar token="--size-component-sm" description="32px · small button, input" />
            <ScaleBar token="--size-component-md" description="40px · default button, input" />
            <ScaleBar token="--size-component-lg" description="48px · large input" />
            <ScaleBar token="--size-component-xl" description="56px · hero inputs" />
          </Section>

          <Section title="Icon Sizes">
            <ScaleBar token="--size-icon-xs" description="12px" />
            <ScaleBar token="--size-icon-sm" description="16px" />
            <ScaleBar token="--size-icon-md" description="20px · default" />
            <ScaleBar token="--size-icon-lg" description="24px" />
            <ScaleBar token="--size-icon-xl" description="32px" />
            <ScaleBar token="--size-icon-2xl" description="48px · feature icons" />
          </Section>
        </div>
      </div>
    </Page>
  ),
};

// ─── STORY: Shadows ────────────────────────────────────────────────────────
function ShadowCard({ token, label }: { token: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 180px' }}>
      <div style={{
        background: 'var(--color-bg-primary)',
        borderRadius: 'var(--radius-component-lg)',
        padding: '32px 24px',
        boxShadow: `var(${token})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span className="text-label-sm text-secondary">{label}</span>
      </div>
      <code className="text-code-xs" style={{ color: 'var(--color-text-brand)', display: 'block' }}>{token}</code>
    </div>
  );
}

export const Shadows: Story = {
  render: () => (
    <Page>
      <h1 className="text-heading-h2 text-primary" style={{ marginBottom: '8px' }}>Shadows</h1>
      <p className="text-body-md text-secondary" style={{ marginBottom: '48px' }}>
        Elevation shadows for surfaces, cards, popovers and dialogs. Brand shadows add a tinted glow for primary interactive elements.
      </p>

      <Section title="Neutral Shadows" description="Used for surfaces, cards, modals, dropdowns">
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <ShadowCard token="--shadow-sm" label="SM · Subtle lift" />
          <ShadowCard token="--shadow-md" label="MD · Cards" />
          <ShadowCard token="--shadow-lg" label="LG · Dropdowns" />
          <ShadowCard token="--shadow-xl" label="XL · Modals" />
        </div>
      </Section>

      <Section title="Brand Shadows" description="Used for primary buttons and focused brand elements">
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <ShadowCard token="--shadow-brand-sm" label="Brand SM" />
          <ShadowCard token="--shadow-brand-md" label="Brand MD" />
        </div>
      </Section>
    </Page>
  ),
};

// ─── STORY: Motion ─────────────────────────────────────────────────────────
function DurationBar({ token, label }: { token: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
      <div style={{ width: '200px', flexShrink: 0 }}>
        <code className="text-code-xs" style={{ color: 'var(--color-text-brand)', display: 'block' }}>{token}</code>
        <span className="text-caption-sm text-tertiary">{label}</span>
      </div>
      <div style={{ position: 'relative', height: '8px', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-component-full)', flex: 1, overflow: 'hidden' }}>
        <style>{`
          @keyframes ds-slide-${token.replace(/[^a-z0-9]/gi, '')} {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
          .ds-bar-${token.replace(/[^a-z0-9]/gi, '')} {
            animation: ds-slide-${token.replace(/[^a-z0-9]/gi, '')} var(${token}) linear infinite;
          }
        `}</style>
        <div
          className={`ds-bar-${token.replace(/[^a-z0-9]/gi, '')}`}
          style={{ width: '25%', height: '100%', background: 'var(--color-action-primary)', borderRadius: 'var(--radius-component-full)', position: 'absolute' }}
        />
      </div>
      <span className="text-code-xs text-tertiary" style={{ width: '60px', textAlign: 'right', flexShrink: 0 }}>{tok(token)}</span>
    </div>
  );
}

export const Motion: Story = {
  render: () => (
    <Page>
      <h1 className="text-heading-h2 text-primary" style={{ marginBottom: '8px' }}>Motion</h1>
      <p className="text-body-md text-secondary" style={{ marginBottom: '48px' }}>
        Duration and easing tokens for transitions and animations. The animated bars below run at the exact token duration.
      </p>

      <Section title="Duration Tokens" description="Use these for transition-duration and animation-duration">
        <div style={{ background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-component-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px' }}>
          <DurationBar token="--duration-interaction" label="Micro-interactions, hover" />
          <DurationBar token="--duration-transition" label="State changes, toggles" />
          <DurationBar token="--duration-enter" label="Element entry animations" />
        </div>
      </Section>

      <Section title="Semantic Transition Classes" description="Ready-to-use classes that combine duration + easing">
        <TokenTable
          headers={['Class', 'Duration', 'Easing', 'Usage']}
          rows={[
            { name: '.transition-default',  value: tok('--duration-transition'), description: 'State changes, color/opacity' },
            { name: '.transition-enter',    value: tok('--duration-enter'),      description: 'Slide-in, fade-in, mount' },
            { name: '.transition-emphasis', value: tok('--duration-transition'), description: 'ease-in-out — expand/collapse' },
            { name: '.transition-spring',   value: tok('--duration-slow') || '—',description: 'Spring bounce — drawers, panels' },
          ]}
        />
      </Section>

      <Section title="Easing Tokens">
        <TokenTable
          headers={['Token', 'Value', 'Usage']}
          rows={[
            { name: '--ease-default',   value: tok('--ease-default'),   description: 'Most transitions' },
            { name: '--ease-emphasis',  value: tok('--ease-emphasis'),  description: 'Expand/collapse, drawers' },
          ]}
        />
      </Section>
    </Page>
  ),
};

// ─── STORY: Borders ────────────────────────────────────────────────────────
function RadiusBox({ token, label }: { token: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: '1 1 100px' }}>
      <div style={{
        width: '64px',
        height: '64px',
        background: 'var(--color-action-primary)',
        borderRadius: `var(${token})`,
        opacity: 0.85,
      }} />
      <code className="text-code-xs" style={{ color: 'var(--color-text-brand)', textAlign: 'center' }}>{label}</code>
      <span className="text-caption-sm text-tertiary">{tok(token)}</span>
    </div>
  );
}

export const Borders: Story = {
  render: () => (
    <Page>
      <h1 className="text-heading-h2 text-primary" style={{ marginBottom: '8px' }}>Borders & Radius</h1>
      <p className="text-body-md text-secondary" style={{ marginBottom: '48px' }}>
        Border width tokens for stroke thickness and border-radius tokens for corner rounding.
      </p>

      <Section title="Border Widths" description="Use with border-width or outline-width">
        <TokenTable
          headers={['Token', 'Value', 'Usage']}
          rows={[
            { name: '--border-hairline',          description: 'Dividers, subtle outlines' },
            { name: '--border-default',           description: 'Standard component border' },
            { name: '--border-focus',             description: 'Focus indicator rings' },
            { name: '--border-thick',             description: 'Emphasis borders, indicators' },
            { name: '--border-interactive',       description: 'Interactive element stroke' },
            { name: '--border-interactive-focus', description: 'Focused interactive stroke' },
            { name: '--border-container',         description: 'Container outlines' },
            { name: '--border-media',             description: 'Image and media frames' },
            { name: '--border-divider',           description: 'Section dividers' },
            { name: '--border-indicator',         description: 'Active state indicator bar' },
            { name: '--border-focus-ring',        description: 'Keyboard focus ring width' },
          ]}
        />
      </Section>

      <Section title="Border Radius" description="Component corner rounding — all via --radius-component-* tokens">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '24px', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-component-lg)', border: '1px solid var(--color-border-subtle)' }}>
          <RadiusBox token="--radius-component-none" label="none" />
          <RadiusBox token="--radius-component-sm"   label="sm · 4px" />
          <RadiusBox token="--radius-component-md"   label="md · 6px" />
          <RadiusBox token="--radius-component-lg"   label="lg · 8px" />
          <RadiusBox token="--radius-component-xl"   label="xl · 12px" />
          <RadiusBox token="--radius-component-full" label="full" />
        </div>
      </Section>

      <Section title="Layer (Z-Index)" description="Use for stacking context management">
        <TokenTable
          headers={['Token', 'Value', 'Usage']}
          rows={[
            { name: '--layer-raised',       description: 'Dropdowns, tooltips above base content' },
            { name: '--layer-sticky',       description: 'Sticky headers and toolbars' },
            { name: '--layer-overlay',      description: 'Backdrop overlays' },
            { name: '--layer-dialog',       description: 'Modals and dialogs' },
            { name: '--layer-notification', description: 'Toasts and snackbars' },
            { name: '--layer-popover',      description: 'Popovers and top-layer elements' },
          ]}
        />
      </Section>
    </Page>
  ),
};

// ─── STORY: Component Tokens ───────────────────────────────────────────────
function ComponentSection({ title, tokens }: { title: string; tokens: string[] }) {
  return (
    <Section title={title}>
      <TokenTable
        headers={['Token', 'Resolves to']}
        rows={tokens.map(name => ({ name }))}
      />
    </Section>
  );
}

export const ComponentTokens: Story = {
  render: () => (
    <Page>
      <h1 className="text-heading-h2 text-primary" style={{ marginBottom: '8px' }}>Component Tokens</h1>
      <p className="text-body-md text-secondary" style={{ marginBottom: '48px' }}>
        Auto-generated tokens for each component, written by the component-builder skill into <code className="text-code-sm" style={{ color: 'var(--color-text-brand)' }}>geeklego.css</code>. Each token aliases a semantic — never a primitive.
      </p>

      <ComponentSection title="NavItem" tokens={[
        '--nav-item-bg', '--nav-item-bg-hover', '--nav-item-bg-active', '--nav-item-bg-disabled',
        '--nav-item-text', '--nav-item-text-hover', '--nav-item-text-active', '--nav-item-text-disabled',
        '--nav-item-icon', '--nav-item-icon-hover', '--nav-item-icon-active', '--nav-item-icon-disabled',
        '--nav-item-indicator-color', '--nav-item-indicator-width',
        '--nav-item-badge-bg', '--nav-item-badge-text',
        '--nav-item-height', '--nav-item-padding-x', '--nav-item-gap', '--nav-item-radius',
        '--nav-item-icon-size', '--nav-item-badge-radius', '--nav-item-badge-padding-x', '--nav-item-badge-height',
      ]} />

      <ComponentSection title="Icon" tokens={[
        '--icon-color', '--icon-color-active', '--icon-color-disabled',
        '--icon-size-sm', '--icon-size-md', '--icon-size-lg',
      ]} />

      <ComponentSection title="Text" tokens={[
        '--text-color-primary', '--text-color-secondary', '--text-color-tertiary',
        '--text-color-disabled', '--text-color-brand', '--text-color-inverse',
      ]} />

      <ComponentSection title="Badge" tokens={[
        '--badge-bg', '--badge-bg-soft', '--badge-bg-success', '--badge-bg-success-soft',
        '--badge-bg-warning', '--badge-bg-warning-soft', '--badge-bg-error', '--badge-bg-error-soft',
        '--badge-bg-neutral',
        '--badge-text', '--badge-text-soft', '--badge-text-neutral',
        '--badge-border', '--badge-radius', '--badge-radius-md',
        '--badge-padding-x-sm', '--badge-padding-x-md',
        '--badge-height-sm', '--badge-height-md',
      ]} />
    </Page>
  ),
};
