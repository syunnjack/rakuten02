#!/usr/bin/env python3
"""Validate and enrich DTI affiliate movie CSV rows."""

from __future__ import annotations

import argparse
import csv
import re
import sys
import urllib.request
from dataclasses import dataclass
from pathlib import Path

HEADERS = [
    "movie_id",
    "site_id",
    "site_name",
    "title",
    "actress",
    "description",
    "release_date",
    "sample_url",
    "aff_link",
    "original_id",
    "sample_movie_url_2",
    "provider_name",
]

MOVIE_CODE_RE = re.compile(r"/moviepages/([^/]+)/index\.html")


@dataclass
class MovieRow:
    movie_id: str
    site_id: str
    site_name: str
    title: str
    actress: str
    description: str
    release_date: str
    sample_url: str
    aff_link: str
    original_id: str
    sample_movie_url_2: str
    provider_name: str

    @classmethod
    def from_dict(cls, row: dict[str, str]) -> "MovieRow":
        return cls(**{field: (row.get(field) or "").strip() for field in HEADERS})

    def to_dict(self) -> dict[str, str]:
        return {field: getattr(self, field) for field in HEADERS}

    def enrich(self) -> list[str]:
        notes: list[str] = []

        if not self.sample_movie_url_2 and self.sample_url:
            match = MOVIE_CODE_RE.search(self.sample_url)
            if match:
                code = match.group(1)
                self.sample_movie_url_2 = (
                    f"http://smovie.caribbeancom.com/sample/movies/{code}/sample_m.mp4"
                )
                notes.append("sample_movie_url_2 derived from sample_url")

        if not self.provider_name and self.site_name:
            self.provider_name = self.site_name
            notes.append("provider_name filled from site_name")

        if self.sample_url and "caribbeancom.com" in self.sample_url and not self.site_name:
            self.site_name = "カリビアンコム"
            notes.append("site_name inferred as カリビアンコム")

        return notes

    def validate(self) -> list[str]:
        errors: list[str] = []

        if not self.movie_id:
            errors.append("movie_id is required")
        if not self.title:
            errors.append("title is required")
        if not self.aff_link:
            errors.append("aff_link is required")
        if not self.sample_movie_url_2:
            errors.append("sample_movie_url_2 is missing")

        return errors

    def sample_exists(self) -> bool:
        if not self.sample_movie_url_2:
            return False

        request = urllib.request.Request(
            self.sample_movie_url_2,
            method="HEAD",
            headers={"User-Agent": "movie-data-processor/1.0"},
        )

        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                return 200 <= response.status < 300
        except Exception:
            return False


def read_rows(path: Path) -> list[MovieRow]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        return [MovieRow.from_dict(row) for row in reader]


def write_rows(path: Path, rows: list[MovieRow]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=HEADERS)
        writer.writeheader()
        writer.writerows(row.to_dict() for row in rows)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_csv", type=Path)
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Write enriched CSV to this path (default: overwrite input)",
    )
    parser.add_argument(
        "--check-sample",
        action="store_true",
        help="Verify sample_movie_url_2 responds to HTTP HEAD",
    )
    args = parser.parse_args()

    rows = read_rows(args.input_csv)
    exit_code = 0

    for index, row in enumerate(rows, start=1):
        notes = row.enrich()
        errors = row.validate()

        print(f"[row {index}] {row.title or '(no title)'}")
        for note in notes:
            print(f"  note: {note}")
        for error in errors:
            print(f"  error: {error}")
            exit_code = 1

        if args.check_sample and row.sample_movie_url_2:
            ok = row.sample_exists()
            print(f"  sample HEAD: {'OK' if ok else 'FAILED'}")
            if not ok:
                exit_code = 1

    output = args.output or args.input_csv
    write_rows(output, rows)
    print(f"Wrote {len(rows)} row(s) to {output}")

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
