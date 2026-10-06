import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (id: T) => void;
  /** Prefix for ids so tab buttons and panels can reference each other. */
  idPrefix: string;
  ariaLabel: string;
}

/**
 * Accessible tab list with a sliding indicator.
 * The indicator moves with transform only (translateX plus scaleX), never width or left.
 * Arrow keys, Home and End move between tabs.
 */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  idPrefix,
  ariaLabel,
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!active) return;
    setIndicator({ x: active.offsetLeft, w: active.offsetWidth });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [value, tabs, measure]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.id === value);
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[next].id);
    listRef.current
      ?.querySelector<HTMLElement>(`#${idPrefix}-tab-${tabs[next].id}`)
      ?.focus();
  };

  return (
    <div
      className="tabs"
      role="tablist"
      aria-label={ariaLabel}
      ref={listRef}
      onKeyDown={onKeyDown}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            id={`${idPrefix}-tab-${tab.id}`}
            type="button"
            role="tab"
            className="tab"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
      {indicator && (
        <span
          className="tab-indicator"
          aria-hidden="true"
          style={{ transform: `translateX(${indicator.x}px) scaleX(${indicator.w})` }}
        />
      )}
    </div>
  );
}
