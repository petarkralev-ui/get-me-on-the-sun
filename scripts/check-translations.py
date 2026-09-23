#!/usr/bin/env python3
"""Fail when visible English website text is missing from any translation."""

import json
import importlib.util
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
GENERATOR_PATH = ROOT / "scripts" / "generate-translations.py"
SPEC = importlib.util.spec_from_file_location("translation_generator", GENERATOR_PATH)
GENERATOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GENERATOR)
collect_texts = GENERATOR.collect_texts


def main():
    source = (ROOT / "translations.js").read_text(encoding="utf-8")
    match = re.fullmatch(r"window\.SITE_TRANSLATIONS = (.*);\n?", source, re.DOTALL)
    if not match:
        print("translations.js has an unexpected format", file=sys.stderr)
        return 1

    catalogue = json.loads(match.group(1))
    texts = collect_texts()
    missing = {
        code: [text for text in texts if not translations.get(text, '').strip()]
        for code, translations in catalogue.items()
    }
    missing = {code: values for code, values in missing.items() if values}
    if missing:
        for code, values in missing.items():
            print(f"{code}: {len(values)} missing translations", file=sys.stderr)
            for value in values[:10]:
                print(f"  - {value}", file=sys.stderr)
        return 1

    print(f"Translation catalogue complete for {len(texts)} visible strings.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
