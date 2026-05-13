"use client";

import {
  memo,
  useState,
  useId,
  useMemo,
  useCallback,
  useRef,
  createContext,
  useContext,
  Children,
  isValidElement,
  cloneElement,
} from 'react';
import type { ReactElement } from 'react';
import { getLoadingProps, getDisabledProps, getIconProps } from '../../utils/accessibility';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { useRovingTabindex } from '../../utils/keyboard/useRovingTabindex';
import type {
  TabsProps,
  TabsListProps,
  TabsTabProps,
  TabsPanelProps,
  TabsVariant,
  TabsSize,
  TabsOrientation,
} from './Tabs.types';

// ── Internal context ─────────────────────────────────────────────────────────

interface TabsContextValue {
  selectedValue: string;
  onSelect: (value: string) => void;
  baseId: string;
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
  listLabel: string;
}

const TabsContext = createContext<TabsContextValue>({
  selectedValue: '',
  onSelect: () => undefined,
  baseId: '',
  variant: 'line',
  size: 'md',
  orientation: 'horizontal',
  listLabel: 'Tabs',
});

// ── Static size map ──────────────────────────────────────────────────────────

const sizeClasses: Record<TabsSize, string> = {
  sm: 'h-[var(--tabs-tab-height-sm)] px-[var(--tabs-tab-px-sm)] text-body-sm',
  md: 'h-[var(--tabs-tab-height-md)] px-[var(--tabs-tab-px-md)] text-body-md',
  lg: 'h-[var(--tabs-tab-height-lg)] px-[var(--tabs-tab-px-lg)] text-body-lg',
};

// ── TabsList ─────────────────────────────────────────────────────────────────

const TabsListComp = memo(({ children, className, ...rest }: TabsListProps) => {
  const { selectedValue, onSelect, variant, orientation, listLabel } = useContext(TabsContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = useMemo(() => {
    return Children.toArray(children)
      .filter((child): child is ReactElement<TabsTabProps> => isValidElement(child))
      .map((child) => ({
        value: (child.props as TabsTabProps).value,
        disabled: (child.props as TabsTabProps).disabled ?? false,
      }));
  }, [children]);

  const selectedIndex = useMemo(
    () => Math.max(0, tabs.findIndex((t) => t.value === selectedValue)),
    [tabs, selectedValue],
  );

  const handleActiveIndexChange = useCallback((idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;
    onSelect(tab.value);
    requestAnimationFrame(() => {
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[idx]?.focus();
    });
  }, [tabs, onSelect]);

  const { handleKeyDown, getItemProps } = useRovingTabindex({
    itemCount: tabs.length,
    activeIndex: selectedIndex,
    orientation,
    loop: true,
    isItemDisabled: (idx) => tabs[idx]?.disabled ?? false,
    onActiveIndexChange: handleActiveIndexChange,
  });

  const clonedChildren = useMemo(() => {
    return Children.toArray(children)
      .filter(isValidElement)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((child, idx) => cloneElement(child as ReactElement<any>, {
        _tabIndex: getItemProps(idx).tabIndex,
      }));
  }, [children, getItemProps]);

  const listClasses = useMemo(() => {
    const base = ['flex', orientation === 'vertical' ? 'flex-col' : ''].filter(Boolean).join(' ');

    let variantClass = '';
    if (variant === 'line') {
      variantClass = orientation === 'horizontal'
        ? 'gap-[var(--tabs-list-gap)] border-b border-[var(--tabs-line-list-border)]'
        : 'gap-[var(--tabs-list-gap)] border-s-2 border-[var(--tabs-line-list-border)]';
    } else if (variant === 'enclosed') {
      variantClass = [
        'gap-[var(--tabs-list-gap)]',
        'p-[var(--tabs-enclosed-list-padding)]',
        'bg-[var(--tabs-enclosed-list-bg)]',
        'rounded-[var(--tabs-enclosed-list-radius)]',
        'border border-[var(--tabs-enclosed-list-border)]',
      ].join(' ');
    } else if (variant === 'soft-rounded') {
      variantClass = [
        'gap-[var(--tabs-list-gap)]',
        'p-[var(--tabs-soft-rounded-list-padding)]',
        'bg-[var(--tabs-soft-rounded-list-bg)]',
        'rounded-[var(--tabs-soft-rounded-list-radius)]',
      ].join(' ');
    } else if (variant === 'solid-rounded') {
      variantClass = [
        'gap-[var(--tabs-list-gap)]',
        'p-[var(--tabs-solid-rounded-list-padding)]',
        'bg-[var(--tabs-solid-rounded-list-bg)]',
        'rounded-[var(--tabs-solid-rounded-list-radius)]',
      ].join(' ');
    }

    return [base, variantClass, className].filter(Boolean).join(' ');
  }, [variant, orientation, className]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={listLabel}
      aria-orientation={orientation}
      className={listClasses}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {clonedChildren}
    </div>
  );
});
TabsListComp.displayName = 'TabsList';

// ── TabsTab ───────────────────────────────────────────────────────────────────

// Internal props injected by TabsList via cloneElement
interface TabsTabInternalProps extends TabsTabProps {
  _tabIndex?: number;
}

const TabsTabComp = memo(({
  value,
  disabled = false,
  icon,
  className,
  children,
  _tabIndex = 0,
  onClick,
  ...rest
}: TabsTabInternalProps) => {
  const { selectedValue, onSelect, baseId, variant, size, orientation } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onSelect(value);
    }
    onClick?.(e);
  }, [disabled, onSelect, value, onClick]);

  const tabClasses = useMemo(() => {
    const base = [
      'inline-flex items-center justify-center',
      'gap-[var(--tabs-tab-gap)]',
      sizeClasses[size],
      'font-medium',
      'transition-default',
      'focus-visible:outline-none focus-visible:focus-ring',
      'content-nowrap',
    ].join(' ');

    if (disabled) {
      return [
        base,
        'text-[var(--tabs-tab-text-disabled)] cursor-not-allowed pointer-events-none opacity-50',
        className,
      ].filter(Boolean).join(' ');
    }

    const interactive = [
      'cursor-pointer',
      'hover:bg-[var(--tabs-tab-bg-hover)]',
      'active:bg-[var(--tabs-tab-bg-active)]',
    ].join(' ');

    let variantClass = '';
    if (variant === 'line') {
      const indicatorBase = orientation === 'horizontal' ? 'border-b-2 -mb-px' : 'border-s-2 -ms-px';
      const indicatorColor = isSelected
        ? orientation === 'horizontal'
          ? 'border-b-[var(--tabs-line-indicator-color)] text-[var(--tabs-tab-text-selected)]'
          : 'border-s-[var(--tabs-line-indicator-color)] text-[var(--tabs-tab-text-selected)]'
        : 'border-transparent text-[var(--tabs-tab-text)] hover:text-[var(--tabs-tab-text-hover)]';
      variantClass = `${indicatorBase} ${indicatorColor}`;
    } else if (variant === 'enclosed') {
      variantClass = isSelected
        ? [
            'bg-[var(--tabs-enclosed-tab-bg-selected)]',
            'border border-[var(--tabs-enclosed-tab-border-selected)]',
            'shadow-[var(--tabs-enclosed-tab-shadow-selected)]',
            'rounded-[var(--tabs-enclosed-tab-radius)]',
            'text-[var(--tabs-tab-text-selected)]',
          ].join(' ')
        : 'border border-transparent rounded-[var(--tabs-enclosed-tab-radius)] text-[var(--tabs-tab-text)] hover:text-[var(--tabs-tab-text-hover)]';
    } else if (variant === 'soft-rounded') {
      variantClass = isSelected
        ? [
            'bg-[var(--tabs-soft-rounded-tab-bg-selected)]',
            'text-[var(--tabs-soft-rounded-tab-text-selected)]',
            'rounded-[var(--tabs-soft-rounded-tab-radius)]',
          ].join(' ')
        : 'rounded-[var(--tabs-soft-rounded-tab-radius)] text-[var(--tabs-tab-text)] hover:text-[var(--tabs-tab-text-hover)]';
    } else if (variant === 'solid-rounded') {
      variantClass = isSelected
        ? [
            'bg-[var(--tabs-solid-rounded-tab-bg-selected)]',
            'text-[var(--tabs-solid-rounded-tab-text-selected)]',
            'shadow-[var(--tabs-solid-rounded-tab-shadow-selected)]',
            'rounded-[var(--tabs-solid-rounded-tab-radius)]',
          ].join(' ')
        : 'rounded-[var(--tabs-solid-rounded-tab-radius)] text-[var(--tabs-tab-text)] hover:text-[var(--tabs-tab-text-hover)]';
    }

    return [base, interactive, variantClass, className].filter(Boolean).join(' ');
  }, [variant, size, orientation, isSelected, disabled, className]);

  return (
    <button
      id={tabId}
      role="tab"
      type="button"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={_tabIndex}
      className={tabClasses}
      onClick={handleClick}
      {...getDisabledProps(disabled)}
      {...rest}
    >
      {icon && (
        <span className="flex-shrink-0" {...getIconProps(true)}>
          {icon}
        </span>
      )}
      <span className="truncate-label">{children}</span>
    </button>
  );
});
TabsTabComp.displayName = 'TabsTab';

// ── TabsPanel ─────────────────────────────────────────────────────────────────

const TabsPanelComp = memo(({ value, className, children, ...rest }: TabsPanelProps) => {
  const { selectedValue, baseId, orientation } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  const panelId = `${baseId}-panel-${value}`;
  const tabId = `${baseId}-tab-${value}`;

  const panelClasses = useMemo(() => [
    'pt-[var(--tabs-panel-pt)]',
    orientation === 'vertical' ? 'flex-1' : '',
    'text-body-md text-[var(--tabs-panel-text)]',
    'focus-visible:outline-none focus-visible:focus-ring',
    className,
  ].filter(Boolean).join(' '), [orientation, className]);

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isSelected}
      className={panelClasses}
      {...rest}
    >
      {children}
    </div>
  );
});
TabsPanelComp.displayName = 'TabsPanel';

// ── Compound component — attach slots as static properties ────────────────────

const TabsRoot = memo(({
  value: controlledValue,
  defaultValue = '',
  onChange,
  variant = 'line',
  size = 'md',
  orientation = 'horizontal',
  loading = false,
  loadingCount = 3,
  i18nStrings,
  className,
  children,
  ...rest
}: TabsProps) => {
  const i18n = useComponentI18n('tabs', i18nStrings);
  const baseId = useId();

  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const selectedValue = controlledValue ?? internalValue;

  const handleSelect = useCallback((v: string) => {
    if (controlledValue === undefined) {
      setInternalValue(v);
    }
    onChange?.(v);
  }, [controlledValue, onChange]);

  const rootClasses = useMemo(() => [
    'w-full min-w-[var(--tabs-min-width)]',
    orientation === 'vertical' ? 'flex gap-[var(--tabs-vertical-gap)]' : '',
    className,
  ].filter(Boolean).join(' '), [orientation, className]);

  const contextValue = useMemo<TabsContextValue>(() => ({
    selectedValue,
    onSelect: handleSelect,
    baseId,
    variant,
    size,
    orientation,
    listLabel: i18n.listLabel ?? 'Tabs',
  }), [selectedValue, handleSelect, baseId, variant, size, orientation, i18n.listLabel]);

  if (loading) {
    const skeletonListClasses = [
      'flex',
      orientation === 'vertical' ? 'flex-col' : '',
      variant === 'line'
        ? orientation === 'horizontal'
          ? 'gap-[var(--tabs-list-gap)] border-b border-[var(--tabs-line-list-border)]'
          : 'gap-[var(--tabs-list-gap)] border-s-2 border-[var(--tabs-line-list-border)]'
        : [
            'gap-[var(--tabs-list-gap)]',
            'p-[var(--tabs-enclosed-list-padding)]',
            'bg-[var(--tabs-enclosed-list-bg)]',
            'rounded-[var(--tabs-enclosed-list-radius)]',
          ].join(' '),
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClasses} {...getLoadingProps(true)} {...rest}>
        <div className={skeletonListClasses}>
          {Array.from({ length: loadingCount }, (_, i) => (
            <div
              key={`tabs-skeleton-tab-${i}`}
              className={['skeleton', sizeClasses[size], 'w-20 rounded-[var(--radius-component-md)]'].join(' ')}
            />
          ))}
        </div>
        <div className="pt-[var(--tabs-panel-pt)] flex-1">
          <div className="skeleton h-24 w-full rounded-[var(--radius-component-md)]" />
        </div>
      </div>
    );
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={rootClasses} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});
TabsRoot.displayName = 'Tabs';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsListComp,
  Tab: TabsTabComp,
  Panel: TabsPanelComp,
});

// Named slot exports
export { TabsListComp as TabsList, TabsTabComp as TabsTab, TabsPanelComp as TabsPanel };
