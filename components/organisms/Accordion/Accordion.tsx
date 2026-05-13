"use client"
import { memo, useState, useId, useMemo, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { getDisclosureProps, getDisabledProps, getIconProps, getLoadingProps } from '../../utils/accessibility';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  AccordionProps,
  AccordionItem,
  AccordionVariant,
  AccordionSize,
  AccordionHeadingLevel,
} from './Accordion.types';

// ── Static variant + size maps ───────────────────────────────────────────────

const containerVariantClasses: Record<AccordionVariant, string> = {
  default: 'divide-y divide-[var(--accordion-item-border)]',
  bordered: 'flex flex-col gap-[var(--accordion-bordered-gap)]',
  flush: '',
};

const itemVariantClasses: Record<AccordionVariant, string> = {
  default: '',
  bordered: [
    'rounded-[var(--accordion-bordered-radius)]',
    'border border-[var(--accordion-item-border)]',
    'bg-[var(--accordion-bordered-bg)]',
    'overflow-hidden',
  ].join(' '),
  flush: '',
};

interface SizeMap {
  py: string;
  px: string;
  panelPb: string;
  panelPx: string;
}

const sizeClasses: Record<AccordionSize, SizeMap> = {
  sm: {
    py: 'py-[var(--accordion-trigger-py-sm)]',
    px: 'px-[var(--accordion-trigger-px-sm)]',
    panelPb: 'pb-[var(--accordion-panel-pb-sm)]',
    panelPx: 'px-[var(--accordion-panel-px-sm)]',
  },
  md: {
    py: 'py-[var(--accordion-trigger-py-md)]',
    px: 'px-[var(--accordion-trigger-px-md)]',
    panelPb: 'pb-[var(--accordion-panel-pb-md)]',
    panelPx: 'px-[var(--accordion-panel-px-md)]',
  },
  lg: {
    py: 'py-[var(--accordion-trigger-py-lg)]',
    px: 'px-[var(--accordion-trigger-px-lg)]',
    panelPb: 'pb-[var(--accordion-panel-pb-lg)]',
    panelPx: 'px-[var(--accordion-panel-px-lg)]',
  },
};

// ── Accordion ────────────────────────────────────────────────────────────────

export const Accordion = memo(({
  items,
  variant = 'default',
  mode = 'single',
  size = 'md',
  openItems: controlledOpenItems,
  defaultOpenItems = [],
  onChange,
  headingLevel = 'h3',
  schema = false,
  loading = false,
  loadingCount = 3,
  i18nStrings,
  className,
}: AccordionProps) => {
  const i18n = useComponentI18n('accordion', i18nStrings);
  const baseId = useId();

  const [internalOpenItems, setInternalOpenItems] = useState<string[]>(defaultOpenItems);
  const openItems = controlledOpenItems ?? internalOpenItems;

  const handleToggle = useCallback((id: string) => {
    const isOpen = openItems.includes(id);
    let next: string[];
    if (mode === 'single') {
      next = isOpen ? [] : [id];
    } else {
      next = isOpen
        ? openItems.filter((x) => x !== id)
        : [...openItems, id];
    }
    if (controlledOpenItems === undefined) {
      setInternalOpenItems(next);
    }
    onChange?.(next);
  }, [openItems, mode, controlledOpenItems, onChange]);

  const containerClasses = useMemo(() => [
    'w-full min-w-[var(--accordion-min-width)]',
    containerVariantClasses[variant],
    className,
  ].filter(Boolean).join(' '), [variant, className]);

  const sizes = sizeClasses[size];

  if (loading) {
    return (
      <div
        className={containerClasses}
        {...getLoadingProps(true)}
      >
        {Array.from({ length: loadingCount }, (_, i) => (
          <div key={`accordion-skeleton-${i}`} className={itemVariantClasses[variant]}>
            <div className={['flex items-center gap-[var(--spacing-component-sm)]', sizes.py, sizes.px].join(' ')}>
              <span className="skeleton h-5 content-flex rounded-[var(--accordion-radius)]" />
              <span className="skeleton h-5 w-5 flex-shrink-0 rounded-[var(--accordion-radius)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      {...(schema && { itemScope: true, itemType: 'https://schema.org/FAQPage' })}
    >
      {items.map((item) => {
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        const isOpen = openItems.includes(item.id);
        const [triggerProps, panelProps] = getDisclosureProps(isOpen, panelId);

        return (
          <AccordionItemInner
            key={item.id}
            item={item}
            isOpen={isOpen}
            triggerId={triggerId}
            triggerProps={triggerProps}
            panelProps={panelProps}
            variant={variant}
            size={size}
            headingLevel={headingLevel}
            schema={schema}
            expandLabel={i18n.expandLabel ?? 'Expand'}
            collapseLabel={i18n.collapseLabel ?? 'Collapse'}
            onToggle={handleToggle}
          />
        );
      })}
    </div>
  );
});
Accordion.displayName = 'Accordion';

// ── AccordionItemInner (internal compound slot) ──────────────────────────────

interface AccordionItemInnerProps {
  item: AccordionItem;
  isOpen: boolean;
  triggerId: string;
  triggerProps: ReturnType<typeof getDisclosureProps>[0];
  panelProps: ReturnType<typeof getDisclosureProps>[1];
  variant: AccordionVariant;
  size: AccordionSize;
  headingLevel: AccordionHeadingLevel;
  schema: boolean;
  expandLabel: string;
  collapseLabel: string;
  onToggle: (id: string) => void;
}

const AccordionItemInner = memo(({
  item,
  isOpen,
  triggerId,
  triggerProps,
  panelProps,
  variant,
  size,
  headingLevel: HeadingTag,
  schema,
  expandLabel,
  collapseLabel,
  onToggle,
}: AccordionItemInnerProps) => {
  const sizes = sizeClasses[size];

  const triggerClasses = useMemo(() => [
    'w-full flex items-center justify-between gap-[var(--spacing-component-sm)]',
    sizes.py,
    sizes.px,
    'text-start',
    'text-body-md font-semibold',
    'text-[var(--accordion-trigger-text)]',
    'bg-[var(--accordion-trigger-bg)]',
    'shadow-[var(--accordion-trigger-shadow)]',
    'transition-default',
    'focus-visible:outline-none focus-visible:focus-ring',
    item.disabled
      ? 'cursor-not-allowed pointer-events-none opacity-50'
      : [
          'cursor-pointer',
          'hover:bg-[var(--accordion-trigger-bg-hover)]',
          'hover:text-[var(--accordion-trigger-text-hover)]',
          'hover:shadow-[var(--accordion-trigger-shadow-hover)]',
          'active:bg-[var(--accordion-trigger-bg-active)]',
          'active:shadow-[var(--accordion-trigger-shadow-active)]',
        ].join(' '),
  ].filter(Boolean).join(' '), [sizes, item.disabled]);

  const panelGridClasses = useMemo(() => [
    'grid transition-default',
    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
  ].join(' '), [isOpen]);

  const chevronClasses = useMemo(() => [
    'flex-shrink-0 transition-default',
    'text-[var(--accordion-trigger-icon)]',
    isOpen
      ? 'rotate-180 text-[var(--accordion-trigger-icon-hover)]'
      : '',
  ].filter(Boolean).join(' '), [isOpen]);

  return (
    <div
      className={itemVariantClasses[variant]}
      {...(schema && { itemScope: true, itemType: 'https://schema.org/Question' })}
    >
      {/* Heading wrapper provides document outline — trigger sits inside */}
      <HeadingTag className="m-0 p-0 text-inherit">
        <button
          id={triggerId}
          type="button"
          className={triggerClasses}
          onClick={() => onToggle(item.id)}
          {...triggerProps}
          {...getDisabledProps(item.disabled ?? false)}
          {...(schema && { itemProp: 'name' })}
        >
          <span className="truncate-label content-flex">{item.title}</span>
          {/* SR-only state hint supplements aria-expanded for older AT */}
          <span className="sr-only">, {isOpen ? collapseLabel : expandLabel}</span>
          <span className="flex-shrink-0" {...getIconProps(true)}>
            <ChevronDown
              size="var(--size-icon-md)"
              className={chevronClasses}
            />
          </span>
        </button>
      </HeadingTag>

      {/* Panel — grid animation collapses height to 0 when closed */}
      <div className={panelGridClasses}>
        <div
          {...panelProps}
          aria-labelledby={triggerId}
          className={[sizes.panelPx, sizes.panelPb, 'overflow-hidden'].join(' ')}
          inert={isOpen ? undefined : true}
        >
          <div
            className="text-body-md text-[var(--accordion-panel-text)]"
            {...(schema && { itemScope: true, itemType: 'https://schema.org/Answer', itemProp: 'acceptedAnswer' })}
          >
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
});
AccordionItemInner.displayName = 'AccordionItemInner';
