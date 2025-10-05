#!/usr/bin/env python3
"""Regenerate the student manifest for the collaborative roster site."""
from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    students_dir = repo_root / "data" / "students"
    manifest_path = students_dir / "index.json"

    if not students_dir.is_dir():
        raise SystemExit(f"Student directory not found: {students_dir}")

    student_files = sorted(
        path.name
        for path in students_dir.glob("*.json")
        if path.name != "index.json"
    )

    manifest_path.write_text(json.dumps(student_files, indent=2) + "\n", encoding="utf-8")
    print(f"Updated manifest with {len(student_files)} student file(s).")


if __name__ == "__main__":
    main()
