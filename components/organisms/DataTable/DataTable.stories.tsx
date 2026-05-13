"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BadgeCheckIcon, UserIcon } from 'lucide-react';
import { DataTable } from './DataTable';
import type { DataTableColumn, DataTableSortState } from './DataTable.types';

// ── Shared mock data ───────────────────────────────────────────────────────

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joined: string;
};

const USERS: User[] = [
  { id: 1,  name: 'Alice Martin',   email: 'alice@example.com',  role: 'Admin',     status: 'active',   joined: '2024-01-15' },
  { id: 2,  name: 'Bob Chen',       email: 'bob@example.com',    role: 'Editor',    status: 'active',   joined: '2024-02-20' },
  { id: 3,  name: 'Carol Davies',   email: 'carol@example.com',  role: 'Viewer',    status: 'inactive', joined: '2024-03-10' },
  { id: 4,  name: 'Daniel Kim',     email: 'dan@example.com',    role: 'Editor',    status: 'active',   joined: '2024-04-05' },
  { id: 5,  name: 'Eva Rossi',      email: 'eva@example.com',    role: 'Admin',     status: 'active',   joined: '2024-05-18' },
  { id: 6,  name: 'Frank Torres',   email: 'frank@example.com',  role: 'Viewer',    status: 'inactive', joined: '2024-06-22' },
  { id: 7,  name: 'Grace Liu',      email: 'grace@example.com',  role: 'Editor',    status: 'active',   joined: '2024-07-30' },
  { id: 8,  name: 'Henry Okafor',   email: 'henry@example.com',  role: 'Viewer',    status: 'active',   joined: '2024-08-11' },
];

const DATA = USERS as unknown as Record<string, unknown>[];

const COLUMNS: DataTableColumn[] = [
  { key: 'name',   header: 'Name',   sortable: true },
  { key: 'email',  header: 'Email',  sortable: true },
  { key: 'role',   header: 'Role',   sortable: true },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    render: (value) => (
      <span
        className={[
          'inline-flex items-center gap-[var(--spacing-component-xs)]',
          'px-[var(--spacing-component-sm)] py-[var(--spacing-component-xs)]',
          'rounded-[var(--radius-component-full)]',
          'text-label-xs font-medium content-nowrap',
          value === 'active'
            ? 'bg-[var(--color-status-success-subtle)] text-[var(--color-text-success)]'
            : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]',
        ].join(' ')}
      >
        {value === 'active' && (
          <BadgeCheckIcon size="var(--size-icon-xs)" aria-hidden="true" />
        )}
        {value === 'active' ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  { key: 'joined', header: 'Joined', sortable: true, align: 'end' },
];

// ── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta<typeof DataTable> = {
  title: 'Organisms/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant:       { control: 'select', options: ['default', 'striped', 'bordered'] },
    size:          { control: 'select', options: ['sm', 'md', 'lg'] },
    loading:       { control: 'boolean' },
    stickyHeader:  { control: 'boolean' },
    loadingRowCount: { control: { type: 'number', min: 1, max: 10 } },
    columns:       { control: false },
    data:          { control: false },
    sortState:     { control: false },
    onSortChange:  { control: false },
    selectedKeys:  { control: false },
    onSelectionChange: { control: false },
    pagination:    { control: false },
    i18nStrings:   { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// ── 1. Default ─────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    caption: 'Team members',
    columns: COLUMNS,
    data: DATA,
    rowKey: 'id',
  },
};

// ── 2. Variants ────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['default', 'striped', 'bordered'] as const).map((variant) => (
        <div key={variant}>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)] capitalize">
            {variant}
          </p>
          <DataTable
            caption={`${variant} table`}
            columns={COLUMNS.slice(0, 4)}
            data={DATA.slice(0, 4)}
            rowKey="id"
            variant={variant}
          />
        </div>
      ))}
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)] uppercase">
            {size}
          </p>
          <DataTable
            caption={`${size} size table`}
            columns={COLUMNS.slice(0, 4)}
            data={DATA.slice(0, 3)}
            rowKey="id"
            size={size}
          />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ──────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => {
    const [sort, setSort] = useState<DataTableSortState>({ key: 'name', direction: 'asc' });
    const [selected, setSelected] = useState<Set<string>>(new Set(['2', '4']));
    const [page, setPage] = useState(1);

    return (
      <div className="flex flex-col gap-[var(--spacing-layout-sm)]">

        {/* Loading */}
        <div>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
            Loading
          </p>
          <DataTable
            caption="Loading state"
            columns={COLUMNS}
            data={[]}
            loading
            loadingRowCount={4}
          />
        </div>

        {/* Empty */}
        <div>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
            Empty
          </p>
          <DataTable
            caption="Empty table"
            columns={COLUMNS}
            data={[]}
            i18nStrings={{ emptyMessage: 'No team members yet' }}
          />
        </div>

        {/* With sort */}
        <div>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
            Sortable (controlled)
          </p>
          <DataTable
            caption="Sorted table"
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            sortState={sort}
            onSortChange={setSort}
          />
        </div>

        {/* With selection */}
        <div>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
            Row selection — {selected.size} selected
          </p>
          <DataTable
            caption="Selectable table"
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            selectedKeys={selected}
            onSelectionChange={setSelected}
          />
        </div>

        {/* With pagination */}
        <div>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
            With pagination
          </p>
          <DataTable
            caption="Paginated table"
            columns={COLUMNS}
            data={DATA.slice((page - 1) * 3, page * 3)}
            rowKey="id"
            pagination={{ currentPage: page, totalPages: 3, onPageChange: setPage, showFirstLast: true }}
          />
        </div>

      </div>
    );
  },
};

// ── 5. Loading (standalone) ────────────────────────────────────────────────

export const Loading: Story = {
  render: () => (
    <DataTable
      caption="Loading state"
      columns={COLUMNS}
      data={[]}
      loading
      loadingRowCount={5}
    />
  ),
};

// ── 6. DarkMode ────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <DataTable
        caption="Dark mode table"
        columns={COLUMNS.slice(0, 4)}
        data={DATA.slice(0, 5)}
        rowKey="id"
        variant="striped"
      />
    </div>
  ),
};

// ── 7. Playground ──────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    caption: 'Playground table',
    columns: COLUMNS,
    data: DATA,
    rowKey: 'id',
    variant: 'default',
    size: 'md',
    loading: false,
    loadingRowCount: 5,
    stickyHeader: false,
  },
};

// ── 8. Accessibility ───────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => {
    const [sort, setSort] = useState<DataTableSortState>({ key: '', direction: 'none' });
    const [selected, setSelected] = useState<Set<string>>(new Set());

    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)] p-[var(--spacing-layout-xs)]">
        {/*
          Keyboard:
            Tab → focus sort buttons and checkboxes in order
            Enter / Space → activate sort button or toggle checkbox
            Screen reader:
              <caption> announces table title to SR
              <th scope="col"> announces column headers on each cell
              aria-sort="ascending|descending|none" communicates sort state
              aria-selected="true|false" communicates row selection
              aria-busy on region communicates loading state
        */}

        {/* Accessible table with caption + sort + selection */}
        <DataTable
          caption="Team members — accessible demo"
          aria-label="Team members"
          columns={COLUMNS}
          data={DATA}
          rowKey="id"
          sortState={sort}
          onSortChange={setSort}
          selectedKeys={selected}
          onSelectionChange={setSelected}
        />

        {/* Loading — aria-busy communicated to SR via the region */}
        <DataTable
          caption="Loading state demo"
          aria-label="Loading team data"
          columns={COLUMNS.slice(0, 3)}
          data={[]}
          loading
          loadingRowCount={3}
        />

        {/* Empty — EmptyState inside the table with accessible role */}
        <DataTable
          caption="Empty table demo"
          aria-label="No members found"
          columns={COLUMNS.slice(0, 3)}
          data={[]}
          i18nStrings={{
            emptyMessage: 'No team members found matching your search',
          }}
        />

        {/* Icon-only column with explicit accessible names */}
        <DataTable
          caption="Custom renderer demo"
          aria-label="Users with avatar"
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (value) => (
                <span className="inline-flex items-center gap-[var(--spacing-component-sm)]">
                  <span
                    className="inline-flex items-center justify-center w-[var(--size-component-sm)] h-[var(--size-component-sm)] rounded-[var(--radius-component-full)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                    aria-hidden="true"
                  >
                    <UserIcon size="var(--size-icon-sm)" />
                  </span>
                  <span className="truncate-label">{String(value)}</span>
                </span>
              ),
            },
            { key: 'role', header: 'Role' },
            { key: 'status', header: 'Status' },
          ]}
          data={DATA.slice(0, 4)}
          rowKey="id"
        />
      </div>
    );
  },
};
