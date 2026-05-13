import '../design-system/geeklego.css';

export const parameters = {
  a11y: {
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    test: "todo"
  },
  viewport: {
    viewports: {
      mobile:  { name: 'Mobile',  styles: { width: '375px',  height: '812px' } },
      tablet:  { name: 'Tablet',  styles: { width: '768px',  height: '1024px' } },
      desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
      wide:    { name: 'Wide',    styles: { width: '1536px', height: '900px' } },
    },
  },
};