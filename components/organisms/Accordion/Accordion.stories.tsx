"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Accordion } from './Accordion';
import type { AccordionItem } from './Accordion.types';

// ── Shared mock data ─────────────────────────────────────────────────────────

const faqItems: AccordionItem[] = [
  {
    id: 'what-is-geeklego',
    title: 'What is Geeklego?',
    content:
      'Geeklego is an open-source, design-system-first React component library built on Tailwind CSS v4. It ships a design system, a component library, and an AI generation skill.',
  },
  {
    id: 'how-tokens-work',
    title: 'How does the token system work?',
    content:
      'Geeklego uses a two-tier token system: primitives define raw values, semantics provide purpose-driven aliases, and generated component tokens sit on top. Every component token must reference a semantic — never a primitive directly.',
  },
  {
    id: 'tailwind-v4',
    title: 'Why Tailwind CSS v4?',
    content:
      'Tailwind v4 introduces CSS-first configuration with @theme blocks, which aligns perfectly with design-system-first principles. All tokens are registered as CSS custom properties and generate utility classes automatically.',
  },
  {
    id: 'accessibility',
    title: 'Is Geeklego accessible?',
    content:
      'Yes. Every component targets WCAG 2.2 AA compliance. The Accordion follows the WAI-ARIA disclosure pattern with aria-expanded, aria-controls, and role="region" on panels.',
  },
];

const shortItems: AccordionItem[] = [
  { id: 'item-1', title: 'Getting started', content: 'Install via npm and import components.' },
  { id: 'item-2', title: 'Configuration', content: 'Configure your design tokens in geeklego.css.' },
  { id: 'item-3', title: 'Customisation', content: 'Override any token to match your brand.' },
];

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Accordion> = {
  title: 'Organisms/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    items: faqItems,
    variant: 'default',
    mode: 'single',
    size: 'md',
    headingLevel: 'h3',
    schema: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'flush'],
      description: 'Visual style of the accordion',
    },
    mode: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Whether one or multiple items can be open at once',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Spacing and icon scale',
    },
    headingLevel: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading level for item titles',
    },
    schema: {
      control: 'boolean',
      description: 'Enable Schema.org FAQPage structured data',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ── 1 · Default ──────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: faqItems,
    defaultOpenItems: ['what-is-geeklego'],
  },
};

// ── 2 · Variants ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-md)]">
          Default — bottom borders, transparent background
        </p>
        <Accordion items={shortItems} variant="default" defaultOpenItems={['item-1']} />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-md)]">
          Bordered — each item in an outlined card
        </p>
        <Accordion items={shortItems} variant="bordered" defaultOpenItems={['item-1']} />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-md)]">
          Flush — no borders, minimal chrome
        </p>
        <Accordion items={shortItems} variant="flush" defaultOpenItems={['item-1']} />
      </div>
    </div>
  ),
};

// ── 3 · Sizes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-md)]">
            Size: {size}
          </p>
          <Accordion
            items={shortItems}
            variant="bordered"
            size={size}
            defaultOpenItems={['item-1']}
          />
        </div>
      ))}
    </div>
  ),
};

// ── 4 · States ────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => {
    const [openItems, setOpenItems] = useState<string[]>(['item-1']);

    const itemsWithDisabled: AccordionItem[] = [
      { id: 'item-1', title: 'Open by default', content: 'This item starts open.' },
      { id: 'item-2', title: 'Closed by default', content: 'This item starts closed.' },
      {
        id: 'item-disabled',
        title: 'Disabled — cannot be opened',
        content: 'This content is not reachable.',
        disabled: true,
      },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        <div>
          <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-md)]">
            Uncontrolled (defaultOpenItems)
          </p>
          <Accordion items={itemsWithDisabled} defaultOpenItems={['item-1']} />
        </div>
        <div>
          <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-md)]">
            Controlled — open: [{openItems.join(', ')}]
          </p>
          <Accordion
            items={itemsWithDisabled}
            openItems={openItems}
            onChange={setOpenItems}
          />
        </div>
        <div>
          <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-md)]">
            Multiple expand mode
          </p>
          <Accordion
            items={faqItems}
            mode="multiple"
            defaultOpenItems={['what-is-geeklego', 'accessibility']}
          />
        </div>
        <div>
          <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-md)]">
            Loading state (aria-busy)
          </p>
          <Accordion items={[]} loading loadingCount={4} />
        </div>
      </div>
    );
  },
};

// ── 5 · Dark Mode ─────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-[var(--color-bg-primary)] p-[var(--spacing-layout-md)] rounded-[var(--accordion-radius)] max-w-2xl">
      <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-layout-xs)]">
        Default variant
      </p>
      <Accordion items={faqItems} defaultOpenItems={['what-is-geeklego']} />
      <p className="text-label-sm text-[var(--color-text-tertiary)] mt-[var(--spacing-layout-sm)] mb-[var(--spacing-layout-xs)]">
        Bordered variant
      </p>
      <Accordion items={shortItems} variant="bordered" defaultOpenItems={['item-1']} />
    </div>
  ),
};

// ── 7 · Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: faqItems,
    variant: 'default',
    mode: 'single',
    size: 'md',
    headingLevel: 'h3',
    defaultOpenItems: ['what-is-geeklego'],
    schema: false,
  },
};

// ── 8 · Accessibility ────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      <p className="text-body-sm text-[var(--color-text-secondary)]">
        Each trigger is a <code>&lt;button&gt;</code> inside a{' '}
        <code>&lt;h3&gt;</code>. The panel has{' '}
        <code>role="region"</code> and{' '}
        <code>aria-labelledby</code> pointing to the trigger id.{' '}
        <code>aria-expanded</code> reflects open/closed state.
        Collapsed panels receive <code>inert</code> to prevent Tab focus into hidden content.
      </p>
      <Accordion
        items={faqItems}
        variant="bordered"
        defaultOpenItems={['what-is-geeklego']}
        headingLevel="h3"
        i18nStrings={{ expandLabel: 'Expand', collapseLabel: 'Collapse' }}
      />
      <p className="text-label-sm text-[var(--color-text-tertiary)] mt-[var(--spacing-component-lg)]">
        With Schema.org FAQPage structured data (schema=true):
      </p>
      <Accordion
        items={faqItems.slice(0, 2)}
        variant="bordered"
        schema
        defaultOpenItems={['what-is-geeklego']}
      />
    </div>
  ),
};
