#!/usr/bin/env python3
import argparse
import json
import re
from datetime import date
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(
        description="Generate autonomous.md from citekeys found in a markdown file."
    )
    parser.add_argument("markdown_file", help="Markdown file containing citekeys.")
    parser.add_argument(
        "--references",
        help="Path to references.json (default: same folder as markdown file).",
    )
    parser.add_argument(
        "--output",
        help="Output markdown path (default: same folder/autonomous.md).",
    )
    parser.add_argument(
        "--key",
        help="Specific citekey to use. If omitted, the first key found in markdown is used.",
    )
    parser.add_argument(
        "--tag",
        default="governance",
        help='Single tag value for YAML list (default: "governance").',
    )
    return parser.parse_args()


def extract_front_matter_date(md_text):
    m = re.search(r"(?s)\A---\n(.*?)\n---\n", md_text)
    if not m:
        return ""
    front_matter = m.group(1)
    dm = re.search(r"(?m)^date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*$", front_matter)
    return dm.group(1) if dm else ""


def extract_citekeys(md_text):
    keys = []
    seen = set()

    for m in re.finditer(r"(?<!\w)@([A-Za-z0-9:_\-.]+)", md_text):
        key = m.group(1)
        if key not in seen:
            seen.add(key)
            keys.append(key)

    for m in re.finditer(r'\{\{<\s*cite\s+key="([^"]+)"\s*>\}\}', md_text):
        key = m.group(1).strip()
        if key and key not in seen:
            seen.add(key)
            keys.append(key)

    return keys


def extract_year(item):
    issued = item.get("issued", {})
    date_parts = issued.get("date-parts", [])
    if date_parts and date_parts[0]:
        return str(date_parts[0][0])
    return ""


def extract_accessed_date(item):
    accessed = item.get("accessed", {})
    date_parts = accessed.get("date-parts", [])
    if date_parts and date_parts[0] and len(date_parts[0]) >= 3:
        y, m, d = date_parts[0][0], date_parts[0][1], date_parts[0][2]
        return f"{int(y):04d}-{int(m):02d}-{int(d):02d}"
    return ""


def extract_author(item):
    authors = item.get("author", [])
    names = []
    for a in authors:
        given = a.get("given", "").strip()
        family = a.get("family", "").strip()
        if given and family:
            names.append(f"{given} {family}")
        elif family:
            names.append(family)
        elif given:
            names.append(given)
    return ", ".join(names)


def build_citation(item):
    title = item.get("title", "")
    container = item.get("container-title", "")
    volume = item.get("volume", "")
    issue = item.get("issue", "")
    year = extract_year(item)

    parts = []
    if title:
        parts.append(f"<em>{title}</em>")
    if container:
        parts.append(container)
    if volume:
        parts.append(f"Vol. {volume}")
    if issue:
        parts.append(f"No. {issue}")
    citation = ", ".join(parts)
    if year:
        citation += f" ({year})"
    return citation


def yaml_quote(value):
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def main():
    args = parse_args()
    md_path = Path(args.markdown_file).resolve()
    if not md_path.exists():
        raise SystemExit(f"Markdown file not found: {md_path}")

    refs_path = Path(args.references).resolve() if args.references else md_path.parent / "references.json"
    if not refs_path.exists():
        raise SystemExit(f"references.json not found: {refs_path}")

    out_path = Path(args.output).resolve() if args.output else md_path.parent / "autonomous.md"

    md_text = md_path.read_text(encoding="utf-8")
    citekeys = extract_citekeys(md_text)
    if not citekeys:
        raise SystemExit(f"No citekeys found in: {md_path}")

    key = args.key or citekeys[0]
    refs = json.loads(refs_path.read_text(encoding="utf-8"))
    refs_by_id = {str(item.get("id", "")): item for item in refs}
    if key not in refs_by_id:
        raise SystemExit(f"Citekey '{key}' not found in {refs_path}")

    item = refs_by_id[key]

    title = item.get("title", "")
    author = extract_author(item)
    citation = build_citation(item)
    page_date = extract_front_matter_date(md_text)
    acceptance_date = extract_accessed_date(item)
    doi = item.get("DOI", "")

    front_matter = [
        "---",
        f"title: {yaml_quote(title)}",
        f"author: {author}",
        "status: published",
        "type: articulos",
        f"citation: {yaml_quote(citation)}",
        f'tag: ["{args.tag}"]',
        "subjects: law",
        "comments: no",
        f"date: {date.today().isoformat()}",
        f"delivery_date: {page_date if page_date else ''}",
        f"acceptance_date: {acceptance_date if acceptance_date else ''}",
        f"doi: {doi}",
        "filter:",
        "  - erb",
        "  - markdown",
        "  - rubypants",
        "---",
        "",
        f"source_citekey: {key}",
        "",
    ]

    out_path.write_text("\n".join(front_matter), encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
