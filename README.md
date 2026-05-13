# @geeklego/ui

A React component library built on a design-system-first architecture with Tailwind CSS v4.
58 production-ready components: atoms, molecules, and organisms.

## Install

```bash
npm install @geeklego/ui react react-dom
```

**Peer dependencies:** This library requires React 19+ and react-dom. If you want to use components that require icons (about 50% of components), also install lucide-react:

```bash
npm install lucide-react
```

## Quick Start

```tsx
import { Button } from "@geeklego/ui";
import "@geeklego/ui/styles";

export default function App() {
  return <Button variant="primary">Click me</Button>;
}
```

## Documentation

See the README and Storybook for usage and examples.

## License

MIT
