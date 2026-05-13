# Token Quick-Reference

## Color — semantic groups
```
Background:    --color-bg-primary / secondary / tertiary / inverse
Surface:       --color-surface-default / raised / overlay
Text:          --color-text-primary / secondary / tertiary / disabled / inverse / accent
Border:        --color-border-default / subtle / strong / focus / error / success / warning
Action:        --color-action-primary / primary-hover / primary-active / secondary / disabled / accent
Status:        --color-status-success / warning / error / info  (+ -subtle variants)
State:         --color-state-hover / pressed / selected / highlight / loading / loading-shine
```

## Spacing
```
Component (internal padding/gap):  --spacing-component-xs(4px) sm(8) md(12) lg(16) xl(24)
Layout (section/page):             --spacing-layout-xs(16px) sm(24) md(32) lg(48) xl(64)
```

## Sizing
```
Component height:  --size-component-xs(24px) sm(32) md(40) lg(48) xl(56)
Icon:              --size-icon-xs(12) sm(16) md(20) lg(24) xl(32) 2xl(48)
Avatar:            --size-avatar-xs(20) sm(28) md(32) lg(40) xl(56) 2xl(80)
```

## Radius, Shadows, Motion, Layer, Border
```
Radius:   --radius-component-none / sm(4px) / md(6) / lg(8) / xl(12) / full
Shadows:  --shadow-sm / md / lg / xl    --shadow-inset-sm
Motion:   --duration-interaction(100ms)  --duration-transition(200ms)  --duration-enter(300ms)
Easing:   --ease-default(out)  --ease-emphasis(in-out)  --ease-spring(bounce)
Layer:    --layer-raised / sticky / overlay / dialog / notification / popover
Borders:  --border-hairline(1px)  --border-default(2px)  --border-thick(4px)  --border-focus-ring(2px)
```

## Typography classes (use directly on elements)
```
Display:    .text-display-hero / 3xl / 2xl / xl / lg / md / sm
Heading:    .text-heading-h1 / h2 / h3 / h4 / h5
Body:       .text-body-lg / md / sm / xs / 2xs
Label:      .text-label-md / sm / xs
Caption:    .text-caption-md / sm
Overline:   .text-overline-md
Code:       .text-code-md / sm / xs / 2xs
Button:     .text-button-xl / lg / md / sm / xs
```

## Semantic utility classes (ready to use)
```
Background:   .bg-primary  .bg-secondary  .bg-tertiary  .bg-inverse
Surface:      .surface-default  .surface-raised  .surface-overlay
Text color:   .text-primary  .text-secondary  .text-tertiary  .text-disabled  .text-inverse
Border color: .border-default  .border-subtle  .border-strong  .border-focus  .border-error
Action bg:    .bg-action-primary  .bg-action-primary-hover  .bg-action-disabled
Status bg:    .bg-status-success  .bg-status-success-subtle  .bg-status-warning-subtle
              .bg-status-error  .bg-status-error-subtle  .bg-status-info-subtle
Sizing:       .size-component-xs / sm / md / lg / xl
Shadows:      .shadow-sm  .shadow-md  .shadow-lg  .shadow-xl
Focus:        .focus-ring  .focus-ring-inset
Loading:      .skeleton
Transitions:  .transition-default  .transition-enter  .transition-emphasis  .transition-spring
Content flex: .truncate-label  .clamp-description  .clamp-body  .clamp-single  .clamp-lines
              .content-flex  .content-nowrap
Empty state:  .empty-placeholder  .empty-placeholder-icon
```