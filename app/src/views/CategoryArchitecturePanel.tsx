import { ChevronRight } from 'lucide-react'
import type { CategoryArchitecture } from '../ia/categoryCopy'
import { EdChip } from '../editor-ds/primitives/EdChip'
import './CategoryArchitecturePanel.css'

const ROLE_VARIANT: Record<CategoryArchitecture['role'], 'info' | 'warning' | 'purple'> = {
  'Theme Token': 'info',
  'Governed Vocabulary': 'warning',
  'Build-time Contract': 'purple',
}

interface CategoryArchitecturePanelProps {
  architecture: CategoryArchitecture
}

/**
 * Collapsible "Architecture" panel shown under the CategoryPage header. Surfaces the
 * per-category architectural metadata from the Motion Duration ADR — Role, Purpose,
 * Runtime Themeable, Usage, Consumers, Notes — so the governed-vs-live split is legible
 * and the editor never presents a "lying control" (an edit that silently does nothing).
 */
export function CategoryArchitecturePanel({ architecture }: CategoryArchitecturePanelProps) {
  const { role, purpose, runtimeThemeable, usage, consumers, notes } = architecture

  return (
    <details className="ed-arch-panel">
      <summary className="ed-arch-panel__summary">
        <ChevronRight size={14} className="ed-arch-panel__chevron" aria-hidden="true" />
        <span className="ed-arch-panel__summary-label">Architecture</span>
        <EdChip variant={ROLE_VARIANT[role]} className="ed-arch-panel__role-chip">
          {role}
        </EdChip>
        <span
          className={
            'ed-arch-panel__themeable' +
            (runtimeThemeable ? ' ed-arch-panel__themeable--yes' : ' ed-arch-panel__themeable--no')
          }
        >
          {runtimeThemeable ? 'Runtime themeable' : 'Not runtime themeable'}
        </span>
      </summary>

      <dl className="ed-arch-panel__grid">
        <div className="ed-arch-panel__field">
          <dt className="ed-arch-panel__label">Role</dt>
          <dd className="ed-arch-panel__value">{role}</dd>
        </div>

        <div className="ed-arch-panel__field">
          <dt className="ed-arch-panel__label">Runtime Themeable</dt>
          <dd className="ed-arch-panel__value">
            {runtimeThemeable ? '✅ Yes' : '⚠️ No'}
          </dd>
        </div>

        <div className="ed-arch-panel__field ed-arch-panel__field--wide">
          <dt className="ed-arch-panel__label">Purpose</dt>
          <dd className="ed-arch-panel__value">{purpose}</dd>
        </div>

        <div className="ed-arch-panel__field">
          <dt className="ed-arch-panel__label">Current Usage</dt>
          <dd className="ed-arch-panel__value">{usage}</dd>
        </div>

        <div className="ed-arch-panel__field">
          <dt className="ed-arch-panel__label">Primary Consumers</dt>
          <dd className="ed-arch-panel__value ed-arch-panel__consumers">
            {consumers.map((c) => (
              <EdChip key={c} variant="outline">
                {c}
              </EdChip>
            ))}
          </dd>
        </div>

        <div className="ed-arch-panel__field ed-arch-panel__field--wide">
          <dt className="ed-arch-panel__label">Notes</dt>
          <dd className="ed-arch-panel__value ed-arch-panel__notes">{notes}</dd>
        </div>
      </dl>
    </details>
  )
}
