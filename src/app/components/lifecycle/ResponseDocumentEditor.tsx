import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu';

/** Плейсхолдеры: вставка через ПКМ как {{slug}}; в документе — рамка (фиолетовая = активное поле, серая = неактивное). */
const FIELD_OPTIONS: { slug: string; label: string }[] = [
  { slug: 'fio', label: 'ФИО' },
  { slug: 'bank_name', label: 'Название банка' },
  { slug: 'date', label: 'Дата' },
  { slug: 'position', label: 'Должность' },
  { slug: 'contacts', label: 'Контакты' },
  { slug: 'product', label: 'Продукт / услуга' },
  { slug: 'amount', label: 'Сумма' },
  { slug: 'deadline', label: 'Срок' },
  { slug: 'account', label: 'Номер счёта / карты' },
];

function labelForSlug(slug: string): string {
  return FIELD_OPTIONS.find((f) => f.slug === slug)?.label ?? slug;
}

function chipClassNames(isActive: boolean): string {
  const base =
    'inline-block max-w-full align-baseline rounded px-1 py-0.5 mx-0.5 text-sm font-medium select-none cursor-default border-2 transition-colors';
  if (isActive) {
    return `${base} border-[#673AB7] bg-purple-50 text-purple-900 ring-2 ring-[#673AB7]/35`;
  }
  return `${base} border-gray-400 bg-gray-50 text-gray-800`;
}

function parseToParts(raw: string): Array<{ kind: 'text'; text: string } | { kind: 'field'; slug: string }> {
  const out: Array<{ kind: 'text'; text: string } | { kind: 'field'; slug: string }> = [];
  const re = /\{\{([a-z0-9_]+)\}\}/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) {
      out.push({ kind: 'text', text: raw.slice(last, m.index) });
    }
    out.push({ kind: 'field', slug: m[1].toLowerCase() });
    last = m.index + m[0].length;
  }
  if (last < raw.length) {
    out.push({ kind: 'text', text: raw.slice(last) });
  }
  if (out.length === 0 && raw.length > 0) {
    out.push({ kind: 'text', text: raw });
  }
  return out;
}

function serialize(root: HTMLElement): string {
  let out = '';
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent ?? '';
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const slug = el.dataset?.edoField;
    if (slug) {
      out += `{{${slug}}}`;
      return;
    }
    const tag = el.tagName;
    if (tag === 'BR') {
      out += '\n';
      return;
    }
    el.childNodes.forEach(walk);
  };
  root.childNodes.forEach(walk);
  return out;
}

function rebuildEditorDom(root: HTMLElement, raw: string) {
  root.innerHTML = '';
  for (const part of parseToParts(raw)) {
    if (part.kind === 'text') {
      if (part.text) root.appendChild(document.createTextNode(part.text));
    } else {
      const span = document.createElement('span');
      span.contentEditable = 'false';
      span.dataset.edoField = part.slug;
      span.textContent = labelForSlug(part.slug);
      span.setAttribute('class', chipClassNames(false));
      root.appendChild(span);
    }
  }
}

function applyChipActiveClasses(root: HTMLElement | null, activeSlug: string | null) {
  if (!root) return;
  root.querySelectorAll<HTMLElement>('[data-edo-field]').forEach((el) => {
    const slug = el.dataset.edoField ?? '';
    el.setAttribute('class', chipClassNames(slug === activeSlug));
  });
}

function insertFieldAtCaret(editor: HTMLElement, slug: string, activeSlug: string | null) {
  const sel = window.getSelection();
  if (!sel) return;
  let range: Range;
  if (sel.rangeCount === 0) {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
  } else {
    range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }
  }
  range.deleteContents();
  const span = document.createElement('span');
  span.contentEditable = 'false';
  span.dataset.edoField = slug;
  span.textContent = labelForSlug(slug);
  span.setAttribute('class', chipClassNames(slug === activeSlug));
  range.insertNode(span);
  range.setStartAfter(span);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

export interface ResponseDocumentEditorProps {
  value: string;
  onChange: (next: string) => void;
  className?: string;
  minHeightPx?: number;
}

export function ResponseDocumentEditor({ value, onChange, className, minHeightPx = 280 }: ResponseDocumentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const serializedRef = useRef<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (serializedRef.current === null) {
      serializedRef.current = value;
      rebuildEditorDom(el, value);
      return;
    }
    if (value === serializedRef.current) return;
    serializedRef.current = value;
    rebuildEditorDom(el, value);
  }, [value]);

  useEffect(() => {
    applyChipActiveClasses(editorRef.current, activeSlug);
  }, [activeSlug, value]);

  const emitFromDom = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = serialize(el);
    serializedRef.current = next;
    onChange(next);
  }, [onChange]);

  const onPointerDownCapture = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement | null;
    const chip = t?.closest?.('[data-edo-field]') as HTMLElement | null;
    if (chip && editorRef.current?.contains(chip)) {
      setActiveSlug(chip.dataset.edoField ?? null);
    } else {
      setActiveSlug(null);
    }
  }, []);

  const onInput = useCallback(() => {
    emitFromDom();
  }, [emitFromDom]);

  const onBlur = useCallback(() => {
    emitFromDom();
  }, [emitFromDom]);

  const insertField = useCallback(
    (slug: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      insertFieldAtCaret(el, slug, activeSlug);
      setActiveSlug(slug);
      emitFromDom();
    },
    [activeSlug, emitFromDom],
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={editorRef}
          role="textbox"
          aria-multiline
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          onPointerDownCapture={onPointerDownCapture}
          onInput={onInput}
          onBlur={onBlur}
          className={[
            'w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500',
            'whitespace-pre-wrap break-words',
            className ?? '',
          ].join(' ')}
          style={{ minHeight: minHeightPx }}
        />
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-[14rem]">
        <ContextMenuLabel className="text-xs text-muted-foreground">Вставить поле в документ</ContextMenuLabel>
        <ContextMenuSeparator />
        {FIELD_OPTIONS.map((f) => (
          <ContextMenuItem key={f.slug} className="text-sm" onSelect={() => insertField(f.slug)}>
            {f.label}{' '}
            <span className="text-muted-foreground text-xs">
              {'{{'}
              {f.slug}
              {'}}'}
            </span>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
