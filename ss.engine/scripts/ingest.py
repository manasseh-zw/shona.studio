"""
ingest.py — Shona Studio ETL Script
====================================
Downloads `shunyalabs/shona-speech-dataset` from HuggingFace,
extracts audio as WAV files into ss.web/public/audio/, and
writes metadata into workspace/shona_studio.db (SQLite).

Usage:
    # First run — test with 5 rows from train split
    uv run python scripts/ingest.py --limit 5 --splits train

    # Full ingest of all splits
    uv run python scripts/ingest.py

    # Re-running is safe — already-written rows are skipped (idempotent)
"""

from __future__ import annotations

import argparse
import io
import sqlite3
from pathlib import Path

import soundfile as sf
from datasets import Audio, load_dataset

# ── Paths (relative to this script's location) ────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
ROOT = SCRIPT_DIR.parent.parent  # shona.studio/

CACHE_DIR = ROOT / "workspace" / "datasets" / "shunyalabs"
DB_PATH = ROOT / "workspace" / "shona_studio.db"
AUDIO_OUT_DIR = ROOT / "ss.web" / "public" / "audio"

HF_DATASET = "shunyalabs/shona-speech-dataset"
ALL_SPLITS = ["train", "validation", "test"]


# ── Database ───────────────────────────────────────────────────────────────────
def init_db(con: sqlite3.Connection) -> None:
    con.execute("""
        CREATE TABLE IF NOT EXISTS dataset_records (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name   TEXT    NOT NULL UNIQUE,
            transcript  TEXT    NOT NULL,
            split_type  TEXT    NOT NULL,
            duration_s  REAL,
            created_at  TEXT    DEFAULT (datetime('now'))
        )
    """)
    con.commit()


# ── Main ───────────────────────────────────────────────────────────────────────
def main(splits: list[str], limit: int | None) -> None:
    # Ensure output directories exist
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    AUDIO_OUT_DIR.mkdir(parents=True, exist_ok=True)
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    print(f"📂  Cache dir : {CACHE_DIR}")
    print(f"🗄️  Database  : {DB_PATH}")
    print(f"🔊  Audio out : {AUDIO_OUT_DIR}")
    print(f"📋  Splits    : {splits}")
    print(f"🔢  Limit     : {limit or 'all'}")
    print()

    # Download / load from cache
    # decode=False → datasets returns raw bytes instead of routing through torchcodec
    print(f"⬇️  Loading dataset '{HF_DATASET}' …")
    dataset = load_dataset(HF_DATASET, cache_dir=str(CACHE_DIR))
    dataset = dataset.cast_column("audio", Audio(decode=False))

    con = sqlite3.connect(DB_PATH)
    init_db(con)

    total_written = 0
    total_skipped = 0

    for split in splits:
        if split not in dataset:
            print(f"⚠️  Split '{split}' not found — skipping.")
            continue

        rows = dataset[split]
        if limit is not None:
            rows = rows.select(range(min(limit, len(rows))))

        print(f"🔄  Processing split '{split}' ({len(rows)} rows) …")

        for idx, row in enumerate(rows):
            file_name = f"{split}_{idx + 1:05d}.wav"
            wav_path = AUDIO_OUT_DIR / file_name

            audio = row["audio"]          # {"bytes": bytes, "path": str | None}
            array, sample_rate = sf.read(io.BytesIO(audio["bytes"]))
            duration_s = round(len(array) / sample_rate, 3)

            # Write WAV (skip if already on disk)
            if not wav_path.exists():
                sf.write(str(wav_path), array, sample_rate)

            # Insert into DB — skip silently if file_name already exists (UNIQUE)
            cursor = con.execute(
                """
                INSERT OR IGNORE INTO dataset_records
                    (file_name, transcript, split_type, duration_s)
                VALUES (?, ?, ?, ?)
                """,
                (file_name, row["transcript"], split, duration_s),
            )
            if cursor.rowcount == 1:
                total_written += 1
            else:
                total_skipped += 1

        con.commit()
        print(f"   ✅ '{split}' done.")

    con.close()

    print()
    print(f"🎉  Ingest complete: {total_written} written, {total_skipped} skipped (already existed).")


# ── CLI ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Shona Studio dataset ingest script")
    parser.add_argument(
        "--splits",
        nargs="+",
        default=ALL_SPLITS,
        choices=ALL_SPLITS,
        metavar="SPLIT",
        help=f"Which splits to ingest. Default: all ({', '.join(ALL_SPLITS)})",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        metavar="N",
        help="Max rows per split. Omit to process everything.",
    )
    args = parser.parse_args()
    main(splits=args.splits, limit=args.limit)
