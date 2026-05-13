"use client"
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
import type { PaginationSize, PaginationVariant } from './Pagination.types';

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'simple'] satisfies PaginationVariant[],
      description: 'Layout strategy — numbered pages with ellipsis, or prev/next with page info.',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'] satisfies PaginationSize[],
      description: 'Height and typography scale of page item buttons.',
    },
    totalPages: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Total number of pages.',
    },
    currentPage: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Active page (1-indexed). Controlled — manage with onPageChange.',
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Page buttons shown on each side of the current page.',
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Show jump-to-first (⟨⟨) and jump-to-last (⟩⟩) buttons.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// ── 1. Default ───────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        totalPages={10}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

// ── 2. Variants ──────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => {
    const [defaultPage, setDefaultPage] = useState(5);
    const [simplePage, setSimplePage]   = useState(5);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Default — numbered pages with ellipsis for large ranges
          </p>
          <Pagination
            variant="default"
            totalPages={20}
            currentPage={defaultPage}
            onPageChange={setDefaultPage}
          />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Simple — prev/next arrows + "Page X of Y" centre label
          </p>
          <Pagination
            variant="simple"
            totalPages={20}
            currentPage={simplePage}
            onPageChange={setSimplePage}
          />
        </div>
      </div>
    );
  },
};

// ── 3. Sizes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const [smPage, setSmPage] = useState(3);
    const [mdPage, setMdPage] = useState(3);
    const [lgPage, setLgPage] = useState(3);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">Small (sm)</p>
          <Pagination size="sm" totalPages={7} currentPage={smPage} onPageChange={setSmPage} />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">Medium (md) — default</p>
          <Pagination size="md" totalPages={7} currentPage={mdPage} onPageChange={setMdPage} />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">Large (lg)</p>
          <Pagination size="lg" totalPages={7} currentPage={lgPage} onPageChange={setLgPage} />
        </div>
      </div>
    );
  },
};

// ── 4. States ────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => {
    const [p1,  setP1]  = useState(1);
    const [p5,  setP5]  = useState(5);
    const [p10, setP10] = useState(10);
    const [p3,  setP3]  = useState(3);
    const [p25, setP25] = useState(25);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            First page — previous disabled
          </p>
          <Pagination totalPages={10} currentPage={p1} onPageChange={setP1} />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Middle page — both directions active, ellipsis on right
          </p>
          <Pagination totalPages={10} currentPage={p5} onPageChange={setP5} />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Last page — next disabled
          </p>
          <Pagination totalPages={10} currentPage={p10} onPageChange={setP10} />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Few pages — no ellipsis
          </p>
          <Pagination totalPages={5} currentPage={p3} onPageChange={setP3} />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Many pages — ellipsis on both sides
          </p>
          <Pagination totalPages={50} currentPage={p25} onPageChange={setP25} />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            showFirstLast — first/last jump buttons
          </p>
          <Pagination totalPages={20} currentPage={p5} onPageChange={setP5} showFirstLast />
        </div>
      </div>
    );
  },
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => {
    const [defaultPage, setDefaultPage] = useState(5);
    const [simplePage,  setSimplePage]  = useState(5);
    return (
      <div
        data-theme="dark"
        className="flex flex-col gap-[var(--spacing-layout-xs)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
      >
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">Default variant</p>
          <Pagination
            totalPages={10}
            currentPage={defaultPage}
            onPageChange={setDefaultPage}
          />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">Simple variant</p>
          <Pagination
            variant="simple"
            totalPages={10}
            currentPage={simplePage}
            onPageChange={setSimplePage}
          />
        </div>
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">First page (previous disabled)</p>
          <Pagination totalPages={10} currentPage={1} onPageChange={() => {}} />
        </div>
      </div>
    );
  },
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    totalPages: 10,
    siblingCount: 1,
    showFirstLast: false,
    variant: 'default',
    size: 'md',
  },
  render: (args) => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange?.(p);
        }}
      />
    );
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)]">
        {/*
          Keyboard:
            Tab                 — moves focus across prev/page/next buttons
            Enter / Space       — activates the focused page button
            Current page button — aria-current="page", announces "Page 5 of 10, current"
            SR-only live region — polite announcement each time page changes

          Screen reader:
            nav landmark  → "Pagination, navigation"
            prev button   → "Previous page, button" (or "dimmed/unavailable" when disabled)
            page 5        → "Page 5 of 10, button, current" (aria-current="page")
            page 6        → "Page 6 of 10, button"
            ellipsis      → skipped entirely (aria-hidden="true")
            next button   → "Next page, button"
        */}

        {/* Default — numbered pages with aria-current on active page */}
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Default — aria-current="page" on current, aria-hidden on ellipsis
          </p>
          <Pagination
            totalPages={10}
            currentPage={page}
            onPageChange={setPage}
            i18nStrings={{
              navLabel:   'Product listing pagination',
              prevLabel:  'Previous results page',
              nextLabel:  'Next results page',
              pageLabel:  ({ page: p, total }) => `Page ${p} of ${total}`,
            }}
          />
        </div>

        {/* Simple — live region announces page changes only */}
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Simple variant — visible label aria-hidden, sr-only live region announces change
          </p>
          <Pagination
            variant="simple"
            totalPages={10}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>

        {/* With first/last — all 4 nav buttons accessible */}
        <div>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            showFirstLast — first/last buttons have explicit accessible labels
          </p>
          <Pagination
            totalPages={20}
            currentPage={page}
            onPageChange={setPage}
            showFirstLast
            i18nStrings={{
              firstLabel: 'Jump to first page',
              lastLabel:  'Jump to last page',
            }}
          />
        </div>
      </div>
    );
  },
};
