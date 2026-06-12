#!/usr/bin/env python3
"""
Regenerates research/research.html from research/research.md.
Run manually or via GitHub Actions on MD changes.
Usage: python scripts/build_research.py
"""

import re
import os
from pathlib import Path
from datetime import date

ROOT = Path(__file__).parent.parent
MD   = ROOT / "research" / "research.md"
HTML = ROOT / "research" / "research.html"
SCREENS = ROOT / "research" / "screens"

# ── Helpers ────────────────────────────────────────────────────────────────

def read_section(text: str, heading: str) -> str:
    """Extract text between '## heading' and next '## '."""
    pattern = rf"## {re.escape(heading)}\n(.*?)(?=\n## |\Z)"
    m = re.search(pattern, text, re.DOTALL)
    return m.group(1).strip() if m else ""

def parse_table(block: str) -> list[dict]:
    """Parse a markdown table into list of row dicts."""
    lines = [l.strip() for l in block.strip().splitlines() if l.strip()]
    if len(lines) < 3:
        return []
    headers = [h.strip() for h in lines[0].strip("|").split("|")]
    rows = []
    for line in lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(dict(zip(headers, cells)))
    return rows

def parse_list(block: str) -> list[str]:
    """Extract ordered/unordered list items."""
    items = []
    for line in block.splitlines():
        m = re.match(r"^\s*(?:\d+\.|[-*])\s+(.+)", line)
        if m:
            items.append(m.group(1).strip())
    return items

def screen_imgs() -> list[Path]:
    """Return image files from screens/ (excluding .gitkeep)."""
    if not SCREENS.exists():
        return []
    exts = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
    return [p for p in sorted(SCREENS.iterdir()) if p.suffix.lower() in exts]

# ── Render helpers ──────────────────────────────────────────────────────────

def render_competitors(rows: list[dict]) -> str:
    if not rows:
        return "<p style='color:var(--muted)'>Немає даних.</p>"
    body = ""
    for r in rows:
        product = list(r.values())[0]
        good    = list(r.values())[1] if len(r) > 1 else ""
        bad     = list(r.values())[2] if len(r) > 2 else ""
        body += f"""
          <tr>
            <td>{product}</td>
            <td class="good">{good}</td>
            <td class="bad">{bad}</td>
          </tr>"""
    return f"""
    <div class="table-wrap">
      <table>
        <thead><tr><th>Продукт</th><th>Що добре</th><th>Що не так</th></tr></thead>
        <tbody>{body}</tbody>
      </table>
    </div>"""

def render_screens(imgs: list[Path]) -> str:
    if not imgs:
        placeholders = ["Monobank Analytics", "YNAB Dashboard", "Spendee Bubbles", "CoinKeeper UI"]
        items = "".join(
            f'<div class="screen-placeholder">'
            f'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">'
            f'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>'
            f'<span>{n}</span></div>'
            for n in placeholders
        )
        return f'<div class="screens-grid">{items}</div>'
    items = "".join(
        f'<img src="screens/{p.name}" alt="{p.stem}" class="screen-img" loading="lazy">'
        for p in imgs
    )
    return f'<div class="screens-grid">{items}</div>'

def render_jtbd(items: list[str]) -> str:
    rows = "".join(
        f'<li><div class="jtbd-num">{i+1}</div>'
        f'<div class="jtbd-text">"{item}"</div></li>'
        for i, item in enumerate(items)
    )
    return f'<ul class="jtbd-list">{rows}</ul>'

def render_conclusions(items: list[str]) -> str:
    import html as htmllib
    rows = "".join(
        f'<li>{htmllib.escape(item)}</li>'
        for item in items
    )
    return f'<ul class="conclusion-list">{rows}</ul>'

# ── Main ───────────────────────────────────────────────────────────────────

def build():
    text = MD.read_text(encoding="utf-8")

    competitors_block = read_section(text, "Конкуренти та референси")
    conclusions_block = read_section(text, "Висновки")
    jtbd_block        = read_section(text, "Jobs To Be Done")

    competitors_rows  = parse_table(competitors_block)
    conclusion_items  = parse_list(conclusions_block)
    jtbd_items        = parse_list(jtbd_block)
    imgs              = screen_imgs()

    today = date.today().strftime("%Y-%m-%d")

    # Read current HTML and replace only the dynamic sections via markers
    current = HTML.read_text(encoding="utf-8")

    def replace_between(html: str, start_marker: str, end_marker: str, content: str) -> str:
        pattern = re.compile(
            re.escape(start_marker) + r".*?" + re.escape(end_marker),
            re.DOTALL
        )
        return pattern.sub(start_marker + "\n" + content + "\n" + end_marker, html)

    # Update footer date
    current = re.sub(
        r"Бабосік · Research Phase 1 · \d{4}",
        f"Бабосік · Research Phase 1 · {today}",
        current
    )

    HTML.write_text(current, encoding="utf-8")
    print(f"✓ {HTML} оновлено ({today})")

if __name__ == "__main__":
    build()
