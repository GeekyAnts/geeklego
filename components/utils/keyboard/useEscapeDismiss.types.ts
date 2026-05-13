export interface UseEscapeDismissOptions {
  /** Whether the escape listener is active */
  active: boolean;
  /** Called when Escape is pressed */
  onDismiss: () => void;
}
