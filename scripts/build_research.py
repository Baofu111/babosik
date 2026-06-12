#!/usr/bin/env python3
"""
Regenerates research/research.html from research/research.md + research/template.html.
Run: python scripts/build_research.py
"""

import re
import html as htmllib
from pathlib import Path
from datetime import date

ROOT     = Path(__file__).parent.parent
MD       = ROOT / "research" / "research.md"
TEMPLATE = ROOT / "research" / "template.html"
OUTPUT   = ROOT / "research" / "research.html"
SCREENS  = ROOT / "research" / "screens"

# ── MD extractors ──────────────────────────────────────────────────────────

def get_section(text, heading):
    m = re.search(
        rf"^## {re.escape(heading)}\s*\n(.*?)(?=^## |\Z)",
        text, re.DOTALL | re.MULTILINE
    )
    return m.group(1).strip() if m else ""

def get_subsection(block, heading):
    m = re.search(
        rf"^### {re.escape(heading)}\s*\n(.*?)(?=^### |^## |\Z)",
        block, re.DOTALL | re.MULTILINE
    )
    return m.group(1).strip() if m else ""

def parse_md_table(block):
    lines = [
        l for l in block.strip().splitlines()
        if l.strip() and not re.match(r"^\s*\|[\s\-|:]+\|\s*$", l)
    ]
    if len(lines) < 2:
        return []
    headers = [h.strip() for h in lines[0].strip("|").split("|")]
    return [
        dict(zip(headers, [c.strip() for c in l.strip("|").split("|")]))
        for l in lines[1:]
        if l.strip().startswith("|")
    ]

def parse_md_list(block):
    return [
        m.group(1).strip()
        for line in block.splitlines()
        if (m := re.match(r"^\s*(?:\d+\.|[-*])\s+(.+)", line))
    ]

def strip_md(text):
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    return text.strip()

def esc(text):
    return htmllib.escape(strip_md(text))

def md_inline(text):
    text = htmllib.escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    return text

# ── Recommendations parser ─────────────────────────────────────────────────

def parse_recommendations(patterns_block):
    sub = get_subsection(patterns_block, "Вибір для Бабосіка")
    rec = dict(best="", second="", avoid="",
               best_reasons=[], second_reasons=[], avoid_reasons=[],
               second_label="")

    # Best: **Найкращий: Pattern Name**
    m = re.search(r"\*\*Найкращий[^*:]*:\s*(.+?)\*\*", sub)
    if m:
        rec["best"] = strip_md(m.group(1))

    # Second: **Другий за умови X: Pattern Name**
    m = re.search(r"\*\*Другий(.+?):\s*(.+?)\*\*", sub)
    if m:
        rec["second"] = strip_md(m.group(2))
        cond = re.search(r"за умови (.+)", m.group(1))
        if cond:
            rec["second_label"] = cond.group(1).strip()

    # Avoid: **Не підходить: Pattern Name**
    m = re.search(r"\*\*Не підходить[^*:]*:\s*(.+?)\*\*", sub)
    if m:
        rec["avoid"] = strip_md(m.group(1))

    # Reasons per block (split by bold headers)
    parts = re.split(r"\*\*(?:Найкращий|Другий|Не підходить)[^*]*\*\*", sub)
    if len(parts) > 1:
        rec["best_reasons"] = parse_md_list(parts[1])
    if len(parts) > 2:
        rec["second_reasons"] = [
            s.strip() for s in re.split(r"(?<=[.!])\s+", parts[2].strip())
            if len(s.strip()) > 15
        ]
    if len(parts) > 3:
        rec["avoid_reasons"] = [
            s.strip() for s in re.split(r"(?<=[.!])\s+", parts[3].strip())
            if len(s.strip()) > 15
        ]

    return rec

# ── HTML renderers ─────────────────────────────────────────────────────────

def render_competitors(rows):
    if not rows:
        return "<p style='color:var(--muted)'>Даних немає.</p>"
    trs = "\n".join(
        "<tr>"
        f"<td>{esc(list(r.values())[0])}</td>"
        f"<td class='good'>{esc(list(r.values())[1]) if len(r) > 1 else ''}</td>"
        f"<td class='bad'>{esc(list(r.values())[2]) if len(r) > 2 else ''}</td>"
        "</tr>"
        for r in rows
    )
    return (
        '<div class="table-wrap"><table>'
        '<thead><tr><th>Продукт</th><th>Що добре</th><th>Що не так</th></tr></thead>'
        f'<tbody>{trs}</tbody></table></div>'
    )

def render_patterns(rows, rec):
    def _key(name):
        return name.lower().split("/")[0].strip().split("(")[0].strip()

    def card_cls(name):
        n = _key(name)
        if rec["best"]   and _key(rec["best"])   in n: return "pattern-card best"
        if rec["second"] and _key(rec["second"])  in n: return "pattern-card second"
        if rec["avoid"]  and _key(rec["avoid"])   in n: return "pattern-card avoid"
        return "pattern-card"

    def badge(name):
        n = _key(name)
        if rec["best"]   and _key(rec["best"])   in n:
            return '<span class="badge badge-best">Вибір для MVP</span>'
        if rec["second"] and _key(rec["second"])  in n:
            lbl = htmllib.escape(rec["second_label"] or "умова")
            return f'<span class="badge badge-second">Якщо {lbl}</span>'
        if rec["avoid"]  and _key(rec["avoid"])   in n:
            return '<span class="badge badge-avoid">Не для MVP</span>'
        return ""

    cards = []
    for i, r in enumerate(rows, 1):
        v    = list(r.values())
        name = strip_md(v[1]) if len(v) > 1 else f"Патерн {i}"
        how  = esc(v[2])      if len(v) > 2 else ""
        where= esc(v[3])      if len(v) > 3 else ""
        ok   = esc(v[4])      if len(v) > 4 else ""
        bad  = esc(v[5])      if len(v) > 5 else ""

        cards.append(
            f'<div class="{card_cls(name)}">'
            f'<div class="pattern-num">{i:02d}</div>'
            f'<div>'
            f'<div class="pattern-title">{htmllib.escape(name)} {badge(name)}</div>'
            f'<div class="pattern-desc">{how}</div>'
            f'<div class="pattern-meta">'
            f'<div class="meta-item"><div class="meta-label">Де</div><div class="meta-value">{where}</div></div>'
            f'<div class="meta-item"><div class="meta-label">Підходить</div><div class="meta-value">{ok}</div></div>'
            f'<div class="meta-item"><div class="meta-label">Ламається</div><div class="meta-value">{bad}</div></div>'
            f'</div></div></div>'
        )
    return '<div class="patterns-grid" style="margin-bottom:32px;">' + "".join(cards) + "</div>"

def render_recommendations(rec):
    def lis(items):
        return "".join(f"<li>{htmllib.escape(r)}</li>" for r in items if r)

    second_label = (
        f"Другий — за умови {rec['second_label']}"
        if rec["second_label"] else "Другий варіант"
    )
    return (
        '<div class="recommend-grid">'
        '<div class="recommend-item best">'
        '<div class="recommend-label">Вибір для Бабосіка</div>'
        f'<div class="recommend-title">{htmllib.escape(rec["best"])}</div>'
        f'<ul class="recommend-reasons">{lis(rec["best_reasons"])}</ul>'
        '</div>'
        '<div class="recommend-item second">'
        f'<div class="recommend-label">{htmllib.escape(second_label)}</div>'
        f'<div class="recommend-title">{htmllib.escape(rec["second"])}</div>'
        f'<ul class="recommend-reasons">{lis(rec["second_reasons"])}</ul>'
        '</div>'
        '<div class="recommend-item avoid">'
        '<div class="recommend-label">Не підходить</div>'
        f'<div class="recommend-title">{htmllib.escape(rec["avoid"])}</div>'
        f'<ul class="recommend-reasons">{lis(rec["avoid_reasons"])}</ul>'
        '</div>'
        '</div>'
    )

def render_jtbd(items):
    rows = "".join(
        f'<li><div class="jtbd-num">{i + 1}</div>'
        f'<div class="jtbd-text">"{htmllib.escape(item)}"</div></li>'
        for i, item in enumerate(items)
    )
    return f'<ul class="jtbd-list">{rows}</ul>'

def render_conclusions(items):
    return '<ul class="conclusion-list">' + "".join(
        f"<li>{md_inline(item)}</li>" for item in items
    ) + "</ul>"

def render_screens():
    exts = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
    imgs = (
        [p for p in sorted(SCREENS.iterdir()) if p.suffix.lower() in exts]
        if SCREENS.exists() else []
    )
    if not imgs:
        placeholders = ["Monobank Analytics", "YNAB Dashboard", "Spendee Bubbles", "CoinKeeper UI"]
        items = "".join(
            f'<div class="screen-placeholder">'
            f'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="1.5">'
            f'<rect x="3" y="3" width="18" height="18" rx="2"/>'
            f'<path d="M3 9h18"/><path d="M9 21V9"/></svg>'
            f'<span>{n}</span></div>'
            for n in placeholders
        )
    else:
        items = "".join(
            f'<img src="screens/{p.name}" alt="{p.stem}" class="screen-img" loading="lazy">'
            for p in imgs
        )
    return f'<div class="screens-grid">{items}</div>'

# ── Build ───────────────────────────────────────────────────────────────────

def build():
    text = MD.read_text(encoding="utf-8")
    tpl  = TEMPLATE.read_text(encoding="utf-8")

    comp_block     = get_section(text, "Конкуренти та референси")
    patterns_block = get_section(text, "UX-патерни — аналіз")
    jtbd_block     = get_section(text, "Jobs To Be Done")
    conc_block     = get_section(text, "Висновки")

    comp_rows    = parse_md_table(comp_block)
    sub_patterns = get_subsection(patterns_block, "5 принципово різних підходів")
    pattern_rows = parse_md_table(sub_patterns or patterns_block)
    rec          = parse_recommendations(patterns_block)
    jtbd_items   = parse_md_list(jtbd_block)
    conc_items   = parse_md_list(conc_block)

    today = date.today().strftime("%Y-%m-%d")

    replacements = {
        "<!-- BUILD:competitors -->":     render_competitors(comp_rows),
        "<!-- BUILD:patterns -->":        render_patterns(pattern_rows, rec),
        "<!-- BUILD:recommendations -->": render_recommendations(rec),
        "<!-- BUILD:jtbd -->":            render_jtbd(jtbd_items),
        "<!-- BUILD:conclusions -->":     render_conclusions(conc_items),
        "<!-- BUILD:screens -->":         render_screens(),
        "<!-- BUILD:date -->":            today,
    }

    out = tpl
    for marker, content in replacements.items():
        out = out.replace(marker, content)

    OUTPUT.write_text(out, encoding="utf-8")
    print(f"OK research.html rebuilt from research.md ({today})")

if __name__ == "__main__":
    build()
