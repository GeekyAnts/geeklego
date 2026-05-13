"use client"
import { forwardRef, memo, useMemo } from 'react';
import { NavItem } from '../../atoms/NavItem/NavItem';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  NavbarItemDef,
  NavbarOrientation,
  NavbarProps,
  NavbarSize,
  NavbarVariant,
} from './Navbar.types';

// ── Module-scope static class strings ────────────────────────────────────────

const orientationClasses: Record<NavbarOrientation, string> = {
  horizontal: 'flex flex-row items-center flex-wrap',
  vertical:   'flex flex-col',
};

const gapClasses: Record<NavbarSize, string> = {
  sm: 'gap-[var(--navbar-gap-sm)]',
  md: 'gap-[var(--navbar-gap-md)]',
  lg: 'gap-[var(--navbar-gap-lg)]',
};

// CSS variable override classes defined in geeklego.css — applied to <nav> so
// child NavItem tokens re-resolve in the variant context via CSS cascade.
const variantContextClasses: Record<NavbarVariant, string> = {
  pills:     '',
  underline: 'navbar-variant-underline',
  flush:     'navbar-variant-flush',
  bordered:  '',
};

// CSS classes applied to <nav> — override --navitem-height per size
const sizeContextClasses: Record<NavbarSize, string> = {
  sm: 'navbar-size-sm',
  md: '',
  lg: 'navbar-size-lg',
};

// Bordered variant: surface bg + border wraps the <nav>
const borderedNavClasses = [
  'bg-[var(--navbar-bordered-bg)]',
  'border border-[var(--navbar-bordered-border)]',
  'rounded-[var(--navbar-bordered-radius)]',
  'px-[var(--navbar-container-px)]',
  'py-[var(--navbar-container-py)]',
].join(' ');

// Underline variant: bottom-rule on the <nav> container
const underlineNavClasses = [
  'border-b border-[var(--navbar-underline-border)]',
].join(' ');

// ── Component ─────────────────────────────────────────────────────────────────

export const Navbar = memo(
  forwardRef<HTMLElement, NavbarProps>(
    (
      {
        items,
        variant     = 'pills',
        size        = 'md',
        orientation = 'horizontal',
        schema      = false,
        i18nStrings,
        className,
        'aria-label': ariaLabel,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('navbar', i18nStrings);

      // Nav wrapper classes: variant context + size context + bordered/underline container
      const navClasses = useMemo(
        () =>
          [
            variantContextClasses[variant],
            sizeContextClasses[size],
            variant === 'bordered'  && borderedNavClasses,
            variant === 'underline' && underlineNavClasses,
            className,
          ]
            .filter(Boolean)
            .join(' ') || undefined,
        [variant, size, className],
      );

      // List classes: flex layout + gap (on <ul> so the list box is the flex container)
      const listClasses = useMemo(
        () =>
          [
            orientationClasses[orientation],
            gapClasses[size],
            'list-none m-0 p-0',
          ].join(' '),
        [orientation, size],
      );

      return (
        <nav
          ref={ref}
          aria-label={ariaLabel ?? i18n.navLabel}
          className={navClasses}
          {...rest}
        >
          <ul className={listClasses}>
            {items.map((item: NavbarItemDef) => (
              <NavItem
                key={item.id}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={item.isActive}
                disabled={item.disabled}
                badge={item.badge}
                schema={schema}
              />
            ))}
          </ul>
        </nav>
      );
    },
  ),
);
Navbar.displayName = 'Navbar';
