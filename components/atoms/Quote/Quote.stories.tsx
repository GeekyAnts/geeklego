import type { Meta, StoryObj } from '@storybook/react';
import { Quote } from './Quote';

const meta: Meta<typeof Quote> = {
  title:     'Atoms/Quote',
  component: Quote,
  tags:      ['autodocs'],
  args: {
    variant:     'default',
    size:        'md',
    children:    'The only way to do great work is to love what you do.',
    attribution: 'Steve Jobs',
    source:      undefined,
    sourceUrl:   undefined,
    cite:        undefined,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'pullquote', 'minimal', 'card'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    children:    { control: 'text' },
    attribution: { control: 'text' },
    source:      { control: 'text' },
    sourceUrl:   { control: 'text' },
    cite:        { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Quote>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children:    'The only way to do great work is to love what you do.',
    attribution: 'Steve Jobs',
    source:      'Stanford Commencement Address',
    sourceUrl:   'https://news.stanford.edu/2005/06/14/jobs-061505/',
    cite:        'https://news.stanford.edu/2005/06/14/jobs-061505/',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-2xl">
      <Quote
        variant="default"
        attribution="Steve Jobs"
        source="Stanford Commencement Address"
      >
        Design is not just what it looks like and feels like. Design is how it
        works.
      </Quote>

      <Quote
        variant="pullquote"
        attribution="Leonardo da Vinci"
      >
        Simplicity is the ultimate sophistication.
      </Quote>

      <Quote
        variant="minimal"
        attribution="Albert Einstein"
      >
        In the middle of difficulty lies opportunity.
      </Quote>

      <Quote
        variant="card"
        attribution="Martin Fowler"
        source="Refactoring: Improving the Design of Existing Code"
      >
        Any fool can write code that a computer can understand. Good programmers
        write code that humans can understand.
      </Quote>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-2xl">
      <Quote size="sm" attribution="Ludwig Mies van der Rohe">
        Less is more.
      </Quote>
      <Quote size="md" attribution="Ludwig Mies van der Rohe">
        Less is more.
      </Quote>
      <Quote size="lg" attribution="Ludwig Mies van der Rohe">
        Less is more.
      </Quote>
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-2xl">
      {/* Text only — no attribution */}
      <Quote>A standalone quote with no attribution or source.</Quote>

      {/* Attribution only */}
      <Quote attribution="Marie Curie">
        Nothing in life is to be feared, it is only to be understood.
      </Quote>

      {/* Attribution + source title */}
      <Quote attribution="Martin Fowler" source="Refactoring">
        Any fool can write code that a computer can understand.
      </Quote>

      {/* Attribution + source with URL */}
      <Quote
        attribution="Steve Jobs"
        source="Stanford Commencement Address"
        sourceUrl="https://news.stanford.edu/2005/06/14/jobs-061505/"
        cite="https://news.stanford.edu/2005/06/14/jobs-061505/"
      >
        Stay hungry, stay foolish.
      </Quote>

      {/* Long text — content flexibility */}
      <Quote attribution="A Very Long Author Name That Demonstrates Truncation Behaviour">
        The measure of intelligence is the ability to change. The measure of
        wisdom is the ability to know when and how to adapt to circumstances that
        are continually shifting beneath your feet. Understanding this
        fundamental truth is what separates those who succeed from those who
        merely survive in an ever-changing world.
      </Quote>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-layout-xs)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <Quote variant="default" attribution="Steve Jobs" source="Stanford Commencement Address">
        The only way to do great work is to love what you do.
      </Quote>
      <Quote variant="pullquote" attribution="Leonardo da Vinci">
        Simplicity is the ultimate sophistication.
      </Quote>
      <Quote variant="minimal" attribution="Albert Einstein">
        In the middle of difficulty lies opportunity.
      </Quote>
      <Quote variant="card" attribution="Martin Fowler" source="Refactoring">
        Any fool can write code that a computer can understand. Good programmers
        write code that humans can understand.
      </Quote>
    </div>
  ),
};

// ── 6. EdgeCases ──────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      {/* Quote without attribution */}
      <Quote variant="default">
        The only way to do great work is to love what you do.
      </Quote>

      {/* Quote with very long text */}
      <Quote variant="card" attribution="Maya Angelou">
        I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.
      </Quote>

      {/* Minimal variant with source */}
      <Quote variant="minimal" attribution="Steve Jobs" source="Think Different Campaign">
        The people who are crazy enough to think they can change the world are the ones that do.
      </Quote>

      {/* Pullquote without source */}
      <Quote variant="pullquote" attribution="Walt Disney">
        It is kind of fun to do the impossible.
      </Quote>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant:     'default',
    size:        'md',
    children:    'The only way to do great work is to love what you do.',
    attribution: 'Steve Jobs',
    source:      'Stanford Commencement Address',
    sourceUrl:   'https://news.stanford.edu/2005/06/14/jobs-061505/',
    cite:        'https://news.stanford.edu/2005/06/14/jobs-061505/',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] max-w-2xl">
      {/*
        Screen reader announces the blockquote content naturally.
        <figcaption> is associated with the <figure>, providing attribution context.
        <cite> communicates the source title semantically.
        The source link has a visible focus ring and describes the destination.
      */}

      {/* Semantic blockquote with full attribution */}
      <Quote
        attribution="Steve Jobs"
        source="Stanford Commencement Address"
        sourceUrl="https://news.stanford.edu/2005/06/14/jobs-061505/"
        cite="https://news.stanford.edu/2005/06/14/jobs-061505/"
      >
        The only way to do great work is to love what you do.
      </Quote>

      {/* Attribution without source — no interactive element */}
      <Quote attribution="Marie Curie">
        Nothing in life is to be feared, it is only to be understood.
      </Quote>

      {/* No attribution — standalone blockquote */}
      <Quote variant="minimal">
        A quote with no attribution uses a plain <code>blockquote</code>{' '}
        without a <code>figcaption</code>.
      </Quote>

      {/* Pullquote — decorative mark is aria-hidden */}
      <Quote variant="pullquote" attribution="Leonardo da Vinci">
        Simplicity is the ultimate sophistication.
      </Quote>
    </div>
  ),
};
