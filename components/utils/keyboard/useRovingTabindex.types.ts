export interface UseRovingTabindexOptions {
  /** Total number of items in the group */
  itemCount: number;
  /** Currently active (focused) index. -1 means no item is active. */
  activeIndex?: number;
  /** Arrow key direction. Default: 'vertical' */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** Whether ArrowDown at last item wraps to first (and vice versa). Default: true */
  loop?: boolean;
  /** Return true if the item at `index` should be skipped during arrow navigation */
  isItemDisabled?: (index: number) => boolean;
  /** Called when the active index changes via keyboard */
  onActiveIndexChange: (index: number) => void;
}

export interface RovingItemProps {
  tabIndex: 0 | -1;
}

export interface UseRovingTabindexReturn {
  /** Attach to the container element's onKeyDown */
  handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Returns tabIndex for the item at `index` */
  getItemProps: (index: number) => RovingItemProps;
}
