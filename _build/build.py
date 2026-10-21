"""Builds the site's HTML pages from _build/layout.html + _build/pages/*.html.

Each page file starts with a metadata comment:
    <!--
    title: Page title
    description: Meta description
    nav: home | services | ai | development | consulting | training | products | industries | careers | contact
    -->
Run from the repo root:  python3 _build/build.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / "_build"
SERVICE_PAGES = {"ai", "development", "consulting", "training"}


def parse(page_file):
    text = page_file.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->\s*", text, re.S)
    meta = dict(re.findall(r"^\s*(\w+):\s*(.+?)\s*$", m.group(1), re.M))
    return meta, text[m.end():]


def main():
    layout = (BUILD / "layout.html").read_text(encoding="utf-8")
    for page_file in sorted((BUILD / "pages").glob("*.html")):
        meta, body = parse(page_file)
        nav = meta.get("nav", "")
        html = layout.replace("{{content}}", body)
        html = html.replace("{{title}}", meta["title"]).replace("{{description}}", meta["description"])
        # Highlight the current page in the menu
        for key in ["home", "services", "ai", "development", "consulting", "training",
                    "products", "industries", "careers", "contact"]:
            on = key == nav or (key == "services" and nav in SERVICE_PAGES)
            html = html.replace("{{active_%s}}" % key, " active" if on else "")
        out = ROOT / page_file.name
        out.write_text(html, encoding="utf-8")
        print("built", out.name)


if __name__ == "__main__":
    main()
