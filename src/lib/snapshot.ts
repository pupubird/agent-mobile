import type { Browser } from 'webdriverio';
import { updateRefs, type ElementRef } from './session.js';

// Map iOS element types to short names
const TYPE_MAP: Record<string, string> = {
  XCUIElementTypeButton: 'button',
  XCUIElementTypeStaticText: 'staticText',
  XCUIElementTypeTextField: 'textField',
  XCUIElementTypeSecureTextField: 'secureTextField',
  XCUIElementTypeTextView: 'textView',
  XCUIElementTypeSwitch: 'switch',
  XCUIElementTypeSlider: 'slider',
  XCUIElementTypeCell: 'cell',
  XCUIElementTypeImage: 'image',
  XCUIElementTypeLink: 'link',
  XCUIElementTypeSearchField: 'searchField',
  XCUIElementTypeNavigationBar: 'navBar',
  XCUIElementTypeTabBar: 'tabBar',
  XCUIElementTypeTable: 'table',
  XCUIElementTypeCollectionView: 'collectionView',
  XCUIElementTypeScrollView: 'scrollView',
  XCUIElementTypeOther: 'other',
  XCUIElementTypeApplication: 'application',
  XCUIElementTypeWindow: 'window',
};

function mapType(iosType: string): string {
  return TYPE_MAP[iosType] || iosType.replace('XCUIElementType', '').toLowerCase();
}

interface ParsedElement {
  type: string;
  label?: string;
  value?: string;
  enabled: boolean;
  visible: boolean;
  accessible: boolean;
  xpath: string;
}

function parseAccessibilityTree(xml: string): ParsedElement[] {
  const elements: ParsedElement[] = [];

  // Match iOS element tags with attributes
  const elementRegex = /<(XCUIElementType\w+)\s+([^>]*)(?:\/>|>)/g;
  let match;
  const xpathCounts: Record<string, number> = {};

  while ((match = elementRegex.exec(xml)) !== null) {
    const [, tagName, attrs] = match;

    // Parse attributes
    const getAttr = (name: string): string | undefined => {
      const attrMatch = attrs.match(new RegExp(`${name}="([^"]*)"`));
      return attrMatch ? attrMatch[1] : undefined;
    };

    const enabled = getAttr('enabled') !== 'false';
    const visible = getAttr('visible') !== 'false';
    const accessible = getAttr('accessible') === 'true';
    const label = getAttr('label') || getAttr('name');
    const value = getAttr('value');

    // Build XPath - use index if multiple elements of same type
    const shortType = mapType(tagName);
    xpathCounts[tagName] = (xpathCounts[tagName] || 0) + 1;
    const xpath = `//${tagName}[${xpathCounts[tagName]}]`;

    elements.push({
      type: shortType,
      label: label || undefined,
      value: value || undefined,
      enabled,
      visible,
      accessible,
      xpath,
    });
  }

  return elements;
}

function isInteractive(el: ParsedElement): boolean {
  if (!el.enabled || !el.visible) return false;

  // Interactive types
  const interactiveTypes = [
    'button',
    'textField',
    'secureTextField',
    'textView',
    'switch',
    'slider',
    'cell',
    'link',
    'searchField',
  ];

  if (interactiveTypes.includes(el.type)) return true;

  // Elements with labels that are accessible
  if (el.accessible && el.label) return true;

  return false;
}

export interface SnapshotOptions {
  interactive?: boolean;
  all?: boolean;
}

export interface SnapshotResult {
  text: string;
  count: number;
}

export async function takeSnapshot(
  driver: Browser,
  options: SnapshotOptions = {}
): Promise<SnapshotResult> {
  const showAll = options.all === true;
  const interactiveOnly = options.interactive !== false && !showAll;

  const pageSource = await driver.getPageSource();
  const elements = parseAccessibilityTree(pageSource);

  // Filter elements
  const filtered = interactiveOnly ? elements.filter(isInteractive) : elements;

  // Assign refs and build output
  const refs: Record<string, ElementRef> = {};
  const lines: string[] = [];

  filtered.forEach((el, index) => {
    const ref = `@e${index + 1}`;

    refs[ref] = {
      xpath: el.xpath,
      type: el.type,
      label: el.label,
      value: el.value,
    };

    // Build compact output line
    let line = `${ref} ${el.type}`;
    if (el.label) {
      line += ` "${el.label}"`;
    }
    if (el.value) {
      line += ` [${el.value}]`;
    }

    lines.push(line);
  });

  // Persist refs to session
  updateRefs(refs);

  return {
    text: lines.join('\n'),
    count: lines.length,
  };
}
