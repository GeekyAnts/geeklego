import type { Meta, StoryObj } from '@storybook/react';
import { Layers, X, Code2, Briefcase, Mail, Share2, GitFork, Play } from 'lucide-react';
import { Footer, FooterBrand, FooterNav, FooterLegal } from './Footer';
import { Link } from '../../atoms/Link/Link';

// ── Shared building blocks ─────────────────────────────────────────────────

const Logo = () => (
  <span
    className="flex h-[var(--size-icon-xl)] w-[var(--size-icon-xl)] items-center justify-center rounded-[var(--radius-component-md)] bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] text-label-md font-bold"
    aria-hidden="true"
  >
    GL
  </span>
);

const SocialLinks = () => (
  <div className="flex items-center gap-[var(--footer-nav-link-gap)]">
    <Link href="https://twitter.com" external aria-label="Geeklego on X (Twitter)" variant="subtle" size="sm">
      <X size="var(--size-icon-md)" aria-hidden="true" />
    </Link>
    <Link href="https://github.com" external aria-label="Geeklego on GitHub" variant="subtle" size="sm">
      <Code2 size="var(--size-icon-md)" aria-hidden="true" />
    </Link>
    <Link href="https://linkedin.com" external aria-label="Geeklego on LinkedIn" variant="subtle" size="sm">
      <Briefcase size="var(--size-icon-md)" aria-hidden="true" />
    </Link>
  </div>
);

// ── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta<typeof Footer> = {
  title: 'Organisms/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page-level `<footer>` landmark with compound slots for brand, navigation columns, and legal bar. Responsive by default — brand stacks full-width on mobile, columns fill available space on larger viewports.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Padding and vertical rhythm scale.',
    },
    schema: {
      control: 'boolean',
      description: 'Enable Schema.org WPFooter Microdata.',
    },
    loading: {
      control: 'boolean',
      description: 'Show a loading skeleton in place of children content.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

// ── 1. Default ────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default',
  render: () => (
    <Footer>
      <Footer.Brand href="/" tagline="Design system for humans.">
        <Logo />
        <span>Geeklego</span>
      </Footer.Brand>

      <Footer.Nav heading="Product" navAriaLabel="Product navigation">
        <Link href="/features" variant="subtle" size="sm">Features</Link>
        <Link href="/pricing" variant="subtle" size="sm">Pricing</Link>
        <Link href="/changelog" variant="subtle" size="sm">Changelog</Link>
        <Link href="/roadmap" variant="subtle" size="sm">Roadmap</Link>
      </Footer.Nav>

      <Footer.Nav heading="Resources" navAriaLabel="Resources navigation">
        <Link href="/docs" variant="subtle" size="sm">Documentation</Link>
        <Link href="/blog" variant="subtle" size="sm">Blog</Link>
        <Link href="/community" variant="subtle" size="sm">Community</Link>
        <Link href="/support" variant="subtle" size="sm">Support</Link>
      </Footer.Nav>

      <Footer.Nav heading="Company" navAriaLabel="Company navigation">
        <Link href="/about" variant="subtle" size="sm">About</Link>
        <Link href="/careers" variant="subtle" size="sm">Careers</Link>
        <Link href="/contact" variant="subtle" size="sm">Contact</Link>
      </Footer.Nav>

      <Footer.Legal>
        <p>© 2026 Geeklego. All rights reserved.</p>
        <div className="flex items-center gap-[var(--footer-legal-gap)]">
          <Link href="/privacy" variant="subtle" size="sm">Privacy Policy</Link>
          <Link href="/terms" variant="subtle" size="sm">Terms of Service</Link>
          <Link href="/cookies" variant="subtle" size="sm">Cookie Policy</Link>
        </div>
      </Footer.Legal>
    </Footer>
  ),
};

// ── 2. Minimal ────────────────────────────────────────────────────────────

export const Minimal: Story = {
  name: 'Minimal',
  render: () => (
    <Footer>
      <Footer.Brand href="/">
        <Logo />
        <span>Geeklego</span>
      </Footer.Brand>

      <Footer.Legal>
        <p>© 2026 Geeklego. All rights reserved.</p>
        <div className="flex items-center gap-[var(--footer-legal-gap)]">
          <Link href="/privacy" variant="subtle" size="sm">Privacy</Link>
          <Link href="/terms" variant="subtle" size="sm">Terms</Link>
        </div>
      </Footer.Legal>
    </Footer>
  ),
};

// ── 3. MultiColumn ────────────────────────────────────────────────────────

export const MultiColumn: Story = {
  name: 'MultiColumn',
  render: () => (
    <Footer>
      <Footer.Brand href="/" tagline="Open-source design system built on Tailwind CSS v4.">
        <Logo />
        <span>Geeklego</span>
      </Footer.Brand>

      <Footer.Nav heading="Product" navAriaLabel="Product navigation">
        <Link href="/features" variant="subtle" size="sm">Features</Link>
        <Link href="/pricing" variant="subtle" size="sm">Pricing</Link>
        <Link href="/changelog" variant="subtle" size="sm">Changelog</Link>
        <Link href="/roadmap" variant="subtle" size="sm">Roadmap</Link>
        <Link href="/status" variant="subtle" size="sm">Status</Link>
      </Footer.Nav>

      <Footer.Nav heading="Developers" navAriaLabel="Developer resources navigation">
        <Link href="/docs" variant="subtle" size="sm">Documentation</Link>
        <Link href="/api" variant="subtle" size="sm">API Reference</Link>
        <Link href="/components" variant="subtle" size="sm">Components</Link>
        <Link href="/storybook" variant="subtle" size="sm">Storybook</Link>
        <Link href="https://github.com/geeklego" external variant="subtle" size="sm">GitHub</Link>
      </Footer.Nav>

      <Footer.Nav heading="Resources" navAriaLabel="Resources navigation">
        <Link href="/blog" variant="subtle" size="sm">Blog</Link>
        <Link href="/community" variant="subtle" size="sm">Community</Link>
        <Link href="/tutorials" variant="subtle" size="sm">Tutorials</Link>
        <Link href="/videos" variant="subtle" size="sm">Videos</Link>
      </Footer.Nav>

      <Footer.Nav heading="Company" navAriaLabel="Company navigation">
        <Link href="/about" variant="subtle" size="sm">About</Link>
        <Link href="/careers" variant="subtle" size="sm">Careers</Link>
        <Link href="/press" variant="subtle" size="sm">Press</Link>
        <Link href="/contact" variant="subtle" size="sm">Contact</Link>
      </Footer.Nav>

      <Footer.Legal>
        <p>© 2026 Geeklego, Inc. All rights reserved.</p>
        <SocialLinks />
      </Footer.Legal>
    </Footer>
  ),
};

// ── 4. Sizes ──────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-label-sm text-[var(--color-text-tertiary)] ps-[var(--footer-px-md)] pb-[var(--spacing-component-sm)]">
            size="{size}"
          </p>
          <Footer size={size}>
            <Footer.Brand href="/">
              <Logo />
              <span>Geeklego</span>
            </Footer.Brand>

            <Footer.Nav heading="Product" navAriaLabel={`Product navigation (${size})`}>
              <Link href="/features" variant="subtle" size="sm">Features</Link>
              <Link href="/pricing" variant="subtle" size="sm">Pricing</Link>
              <Link href="/docs" variant="subtle" size="sm">Docs</Link>
            </Footer.Nav>

            <Footer.Nav heading="Company" navAriaLabel={`Company navigation (${size})`}>
              <Link href="/about" variant="subtle" size="sm">About</Link>
              <Link href="/careers" variant="subtle" size="sm">Careers</Link>
            </Footer.Nav>

            <Footer.Legal>
              <p>© 2026 Geeklego. All rights reserved.</p>
            </Footer.Legal>
          </Footer>
        </div>
      ))}
    </div>
  ),
};

// ── 5. WithIcons ──────────────────────────────────────────────────────────

export const WithIcons: Story = {
  name: 'WithIcons',
  render: () => (
    <Footer>
      <Footer.Brand href="/" tagline="Design system for the modern web.">
        <Layers size="var(--size-icon-xl)" aria-hidden="true" />
        <span>Geeklego</span>
      </Footer.Brand>

      <Footer.Nav heading="Product" navAriaLabel="Product navigation">
        <Link href="/features" variant="subtle" size="sm">Features</Link>
        <Link href="/pricing" variant="subtle" size="sm">Pricing</Link>
        <Link href="/changelog" variant="subtle" size="sm">Changelog</Link>
      </Footer.Nav>

      <Footer.Nav heading="Connect" navAriaLabel="Social links navigation">
        <Link href="https://twitter.com/geeklego" external variant="subtle" size="sm">
          <span className="flex items-center gap-[var(--footer-brand-gap)]">
            <Share2 size="var(--size-icon-sm)" aria-hidden="true" />
            X (Twitter)
          </span>
        </Link>
        <Link href="https://github.com/geeklego" external variant="subtle" size="sm">
          <span className="flex items-center gap-[var(--footer-brand-gap)]">
            <GitFork size="var(--size-icon-sm)" aria-hidden="true" />
            GitHub
          </span>
        </Link>
        <Link href="https://linkedin.com/company/geeklego" external variant="subtle" size="sm">
          <span className="flex items-center gap-[var(--footer-brand-gap)]">
            <Briefcase size="var(--size-icon-sm)" aria-hidden="true" />
            LinkedIn
          </span>
        </Link>
        <Link href="https://youtube.com/@geeklego" external variant="subtle" size="sm">
          <span className="flex items-center gap-[var(--footer-brand-gap)]">
            <Play size="var(--size-icon-sm)" aria-hidden="true" />
            YouTube
          </span>
        </Link>
        <Link href="mailto:hello@geeklego.dev" variant="subtle" size="sm">
          <span className="flex items-center gap-[var(--footer-brand-gap)]">
            <Mail size="var(--size-icon-sm)" aria-hidden="true" />
            Email us
          </span>
        </Link>
      </Footer.Nav>

      <Footer.Legal>
        <p>© 2026 Geeklego. Open source under MIT license.</p>
        <div className="flex items-center gap-[var(--footer-legal-gap)]">
          <Link href="/privacy" variant="subtle" size="sm">Privacy</Link>
          <Link href="/terms" variant="subtle" size="sm">Terms</Link>
        </div>
      </Footer.Legal>
    </Footer>
  ),
};

// ── 6. DarkMode ──────────────────────────────────────────────────────────

export const DarkMode: Story = {
  name: 'DarkMode',
  render: () => (
    <div data-theme="dark" className="bg-primary max-w-2xl">
      <Footer>
        <Footer.Brand href="/" tagline="Design system for humans.">
          <Logo />
          <span>Geeklego</span>
        </Footer.Brand>

        <Footer.Nav heading="Product" navAriaLabel="Product navigation">
          <Link href="/features" variant="subtle" size="sm">Features</Link>
          <Link href="/pricing" variant="subtle" size="sm">Pricing</Link>
          <Link href="/changelog" variant="subtle" size="sm">Changelog</Link>
        </Footer.Nav>

        <Footer.Nav heading="Company" navAriaLabel="Company navigation">
          <Link href="/about" variant="subtle" size="sm">About</Link>
          <Link href="/careers" variant="subtle" size="sm">Careers</Link>
          <Link href="/contact" variant="subtle" size="sm">Contact</Link>
        </Footer.Nav>

        <Footer.Legal>
          <p>© 2026 Geeklego. All rights reserved.</p>
          <div className="flex items-center gap-[var(--footer-legal-gap)]">
            <Link href="/privacy" variant="subtle" size="sm">Privacy</Link>
            <Link href="/terms" variant="subtle" size="sm">Terms</Link>
          </div>
        </Footer.Legal>
      </Footer>
    </div>
  ),
};

// ── 7. Loading ───────────────────────────────────────────────────────────

export const Loading: Story = {
  name: 'Loading',
  render: () => (
    <Footer loading>
      {/* children ignored when loading={true} */}
    </Footer>
  ),
};

// ── 8. Playground ────────────────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    size: 'md',
    schema: false,
  },
  render: (args) => (
    <Footer {...args}>
      <Footer.Brand href="/" tagline="Design system for humans.">
        <Logo />
        <span>Geeklego</span>
      </Footer.Brand>

      <Footer.Nav heading="Product" navAriaLabel="Product navigation">
        <Link href="/features" variant="subtle" size="sm">Features</Link>
        <Link href="/pricing" variant="subtle" size="sm">Pricing</Link>
        <Link href="/changelog" variant="subtle" size="sm">Changelog</Link>
        <Link href="/roadmap" variant="subtle" size="sm">Roadmap</Link>
      </Footer.Nav>

      <Footer.Nav heading="Resources" navAriaLabel="Resources navigation">
        <Link href="/docs" variant="subtle" size="sm">Documentation</Link>
        <Link href="/blog" variant="subtle" size="sm">Blog</Link>
        <Link href="/community" variant="subtle" size="sm">Community</Link>
      </Footer.Nav>

      <Footer.Nav heading="Company" navAriaLabel="Company navigation">
        <Link href="/about" variant="subtle" size="sm">About</Link>
        <Link href="/careers" variant="subtle" size="sm">Careers</Link>
        <Link href="/contact" variant="subtle" size="sm">Contact</Link>
      </Footer.Nav>

      <Footer.Legal>
        <p>© 2026 Geeklego. All rights reserved.</p>
        <div className="flex items-center gap-[var(--footer-legal-gap)]">
          <Link href="/privacy" variant="subtle" size="sm">Privacy</Link>
          <Link href="/terms" variant="subtle" size="sm">Terms</Link>
        </div>
      </Footer.Legal>
    </Footer>
  ),
};

// ── 9. Accessibility ─────────────────────────────────────────────────────

export const Accessibility: Story = {
  name: 'Accessibility',
  tags: ['a11y'],
  render: () => (
    <Footer
      aria-label="Site footer"
      schema={true}
      i18nStrings={{
        footerLabel: 'Site footer',
        navLabel: 'Footer navigation',
      }}
    >
      <Footer.Brand href="/" tagline="Accessible design system.">
        <Logo />
        {/* Screen reader gets full name, visible text is abbreviated */}
        <span aria-label="Geeklego">GL</span>
      </Footer.Brand>

      {/* Each nav has a unique label for the contentinfo landmark */}
      <Footer.Nav
        heading="Product"
        navAriaLabel="Product links"
        headingLevel="h3"
      >
        <Link href="/features" variant="subtle" size="sm">Features</Link>
        <Link href="/pricing" variant="subtle" size="sm">Pricing</Link>
        <Link href="/changelog" variant="subtle" size="sm">Changelog</Link>
      </Footer.Nav>

      <Footer.Nav
        heading="Company"
        navAriaLabel="Company links"
        headingLevel="h3"
      >
        <Link href="/about" variant="subtle" size="sm">About Geeklego</Link>
        {/* Explicit label avoids "opens in new tab" ambiguity */}
        <Link
          href="https://github.com/geeklego"
          external
          variant="subtle"
          size="sm"
          aria-label="Geeklego on GitHub (opens in new tab)"
        >
          GitHub
        </Link>
      </Footer.Nav>

      <Footer.Legal>
        {/* time element provides machine-readable copyright year */}
        <p>
          © <time dateTime="2026">2026</time> Geeklego. All rights reserved.
        </p>
        <div className="flex items-center gap-[var(--footer-legal-gap)]">
          <Link href="/privacy" variant="subtle" size="sm">Privacy Policy</Link>
          <Link href="/terms" variant="subtle" size="sm">Terms of Service</Link>
        </div>
      </Footer.Legal>
    </Footer>
  ),
};
