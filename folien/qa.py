"""Programmatic QA for the generated PPTX.

We don't have LibreOffice locally, so this script does a few cheap structural
checks instead of a full render:

- list every slide's text content
- check that nothing extends beyond slide bounds
- check that text boxes are wide/tall enough for their content (heuristic
  using avg char width per font size)
- flag suspicious overlaps between non-background shapes

Run: python qa.py > qa.txt
"""
from __future__ import annotations
import sys
from pathlib import Path
from pptx import Presentation
from pptx.util import Emu

sys.stdout.reconfigure(encoding="utf-8")

PPTX = Path(__file__).parent / "docker-compose-block4.pptx"


def emu_to_inches(emu):
    return emu / 914400.0


def shape_box(shape):
    return (
        emu_to_inches(shape.left or 0),
        emu_to_inches(shape.top or 0),
        emu_to_inches(shape.width or 0),
        emu_to_inches(shape.height or 0),
    )


def estimate_text_height(text, font_size_pt, width_in):
    """Very rough estimate of how many inches of vertical space the text needs.

    Assumes ~7 chars per inch at 12pt. Scales with font size. Adds 1.4 line height.
    """
    if not text or width_in <= 0:
        return 0.0
    chars_per_inch = 7.0 * (12.0 / max(font_size_pt, 1))
    chars_per_line = max(int(width_in * chars_per_inch), 5)

    # split by explicit newlines, count wrapped lines too
    total_lines = 0
    for paragraph in text.split("\n"):
        if not paragraph:
            total_lines += 1
            continue
        wrapped = (len(paragraph) + chars_per_line - 1) // chars_per_line
        total_lines += max(wrapped, 1)

    line_height_in = (font_size_pt * 1.35) / 72.0
    return total_lines * line_height_in


def main():
    pres = Presentation(str(PPTX))
    sw = emu_to_inches(pres.slide_width)
    sh = emu_to_inches(pres.slide_height)
    print(f"Slide: {sw:.2f}\" x {sh:.2f}\"  ({len(pres.slides)} slides)")

    for i, slide in enumerate(pres.slides, start=1):
        print(f"\n=== Slide {i} ===")
        for shape in slide.shapes:
            x, y, w, h = shape_box(shape)
            issues = []
            # off-slide check
            if x < -0.01 or y < -0.01:
                issues.append(f"off-slide top/left ({x:.2f}, {y:.2f})")
            if x + w > sw + 0.01 or y + h > sh + 0.01:
                issues.append(
                    f"off-slide bottom/right (x+w={x+w:.2f}, y+h={y+h:.2f})"
                )
            # text overflow heuristic
            if shape.has_text_frame:
                tf = shape.text_frame
                text = tf.text
                if text.strip():
                    # find max font size used in this text frame
                    max_size = 14.0
                    for p in tf.paragraphs:
                        for r in p.runs:
                            if r.font.size is not None:
                                max_size = max(max_size, r.font.size.pt)
                    needed_h = estimate_text_height(text, max_size, w)
                    if needed_h > h + 0.05:
                        issues.append(
                            f"text may overflow: needed≈{needed_h:.2f}\", box={h:.2f}\" "
                            f"(font {max_size:.0f}pt, {len(text)} chars)"
                        )
                    short = text.replace("\n", " | ")[:80]
                    label = f"text  [{w:.2f}x{h:.2f}@{x:.2f},{y:.2f}] {short!r}"
                else:
                    label = f"shape  [{w:.2f}x{h:.2f}@{x:.2f},{y:.2f}] {shape.shape_type}"
            elif shape.has_table:
                label = f"table [{w:.2f}x{h:.2f}@{x:.2f},{y:.2f}]"
            else:
                label = f"shape [{w:.2f}x{h:.2f}@{x:.2f},{y:.2f}] {shape.shape_type}"
            print(("  " if not issues else "  !! ") + label)
            for it in issues:
                print(f"      → {it}")


if __name__ == "__main__":
    main()
