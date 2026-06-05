#!/usr/bin/env python3
"""One-time migration: fold all top-level content/publicaciones/*.md files into a
single references.json that becomes the source of truth for the publicaciones
section (rendered via the _content.gotmpl content adapter).

- Each top-level .md becomes one JSON entry. `slug` = current filename so URLs
  are preserved.
- The 4 entries that already exist in references.json (CSL-JSON) are *merged*
  with their matching .md so their bibliographic fields (author array,
  container-title, issued, etc.) survive for the {{< cite >}} shortcode, while
  the .md contributes the verbatim citation string, section grouping, abstract,
  PDF link, etc.
- Hand-written citation strings and abstract bodies are preserved verbatim.

Run from the repo root:  python3 scripts/migrate_md_to_references.py
"""
import datetime
import json
import shutil
from pathlib import Path

import yaml

PUB_DIR = Path("content/publicaciones")
REFS = PUB_DIR / "references.json"

# Explicit slug -> existing CSL citekey pairing for the 4 overlapping entries.
OVERLAP = {
    "layers-of-crises-when-pandemics-meet-institutional-and-economic-havoc": "rau2020",
    "esperanza-y-desilusion-en-el-momento-constitucional-chileno": "rau2023",
    "bad-cover-versions-of-law": "rau2025",
    "ruling-by-bullying": "rau2026",
}

# CSL bibliographic keys worth keeping from the existing references.json entries.
CSL_KEEP = {
    "type", "abstract", "container-title", "container-author", "ISSN", "ISBN",
    "DOI", "URL", "issue", "volume", "page", "language", "license", "note",
    "publisher", "publisher-place", "event-place", "edition", "source",
    "title-short", "author", "issued", "accessed", "submitted", "accepted",
}

# Frontmatter keys carried onto the entry verbatim (presentation/metadata).
FM_CARRY = [
    "title", "status", "citation", "doi", "uri", "file", "ssrn", "isbn",
    "issn", "pages", "subjects", "comments", "tag", "delivery_date",
    "acceptance_date", "draft", "kind", "revision_date",
]


def split_front_matter(text):
    """Split a `---`-delimited YAML front matter, where the delimiters are lines
    consisting solely of `---` (text bodies use `---` as an em-dash)."""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, text
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            fm = yaml.safe_load("\n".join(lines[1:i])) or {}
            body = "\n".join(lines[i + 1:])
            return fm, body.lstrip("\n")
    return {}, text


def norm_date(value):
    if value in (None, ""):
        return ""
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.strftime("%Y-%m-%d")
    return str(value).strip()


def clean(value):
    """Drop empty / None scalar values; stringify dates for JSON."""
    if value is None:
        return None
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.strftime("%Y-%m-%d")
    if isinstance(value, str) and value.strip() == "":
        return None
    return value


def main():
    csl = json.loads(REFS.read_text(encoding="utf-8"))
    csl_by_id = {str(e.get("id", "")): e for e in csl}
    citekey_by_slug = dict(OVERLAP)

    entries = []
    consumed_ids = set()

    md_files = sorted(p for p in PUB_DIR.glob("*.md") if p.name != "_index.md")
    for md in md_files:
        slug = md.stem
        fm, body = split_front_matter(md.read_text(encoding="utf-8"))

        entry = {}
        citekey = citekey_by_slug.get(slug)
        if citekey and citekey in csl_by_id:
            # Start from the rich CSL entry, keep its bibliographic fields.
            src = csl_by_id[citekey]
            for k in CSL_KEEP:
                if k in src and clean(src[k]) is not None:
                    entry[k] = src[k]
            entry["id"] = citekey
            consumed_ids.add(citekey)
        else:
            entry["id"] = slug

        entry["slug"] = slug
        entry["type_content"] = (fm.get("type") or "articulos").strip()
        entry["author_display"] = str(fm.get("author", "Ramiro Álvarez Ugarte")).strip()
        entry["date"] = norm_date(fm.get("publishdate") or fm.get("date")
                                  or fm.get("published_date"))

        for k in FM_CARRY:
            v = clean(fm.get(k))
            if v is not None:
                entry[k] = v

        abstract = body.strip()
        if abstract:
            entry["abstract"] = abstract

        entries.append(entry)

    # Carry over any CSL entry that had no matching .md (shouldn't happen, but safe).
    for cid, src in csl_by_id.items():
        if cid not in consumed_ids:
            print(f"  ! CSL entry '{cid}' had no matching .md; kept as-is.")
            entries.append(src)

    # Sort newest-first for readability (rendering re-sorts anyway).
    entries.sort(key=lambda e: e.get("date", ""), reverse=True)

    shutil.copyfile(REFS, REFS.with_suffix(".json.bak"))
    REFS.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote {len(entries)} entries to {REFS} (backup: {REFS}.bak)")


if __name__ == "__main__":
    main()
