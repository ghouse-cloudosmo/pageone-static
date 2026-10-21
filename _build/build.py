"""Builds the site from _build/layout.html + _build/pages/*.html, plus sitemap.xml.

Each page file starts with a metadata comment:
    <!--
    title: Page title
    description: Meta description (also used for social previews)
    nav: home | ai | data | cloud | sap | development | employers | industries | training | careers | contact
    crumb: Short page name for breadcrumbs (omit on the home page)
    parent: Label|path of a middle breadcrumb, e.g. Careers|careers.html (optional)
    service: Service name for schema.org Service markup (expertise pages only)
    robots: noindex (optional; also keeps the page out of sitemap.xml)
    base: / (optional; for pages served at other paths, like 404.html)
    -->
Run from the repo root:  python3 _build/build.py
"""
import datetime
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / "_build"
SITE = "https://pageonesystems.com/"
EXPERTISE_PAGES = {"ai", "data", "cloud", "sap", "development"}

ORG = {
    "@type": "Organization",
    "@id": SITE + "#organization",
    "name": "PageOne Systems, Inc",
    "alternateName": "PageOne Systems",
    "url": SITE,
    "logo": SITE + "images/logo_pageone.jpg",
    "image": SITE + "assets/img/og-card.png",
    "description": "IT staffing and consulting firm providing AI & Machine Learning, Data Engineering, "
                   "Cloud & DevOps, SAP and Software Development professionals on contract, "
                   "contract-to-hire, direct hire and dedicated-team basis.",
    "email": "info@pageonesystems.com",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "2700 Lakeview Parkway, Suite 700",
        "addressLocality": "Alpharetta",
        "addressRegion": "GA",
        "postalCode": "30009",
        "addressCountry": "US",
    },
    "contactPoint": [
        {"@type": "ContactPoint", "contactType": "sales", "email": "info@pageonesystems.com"},
        {"@type": "ContactPoint", "contactType": "human resources", "email": "hr@pageonesystems.com"},
    ],
    "knowsAbout": ["IT staffing", "Staff augmentation", "Artificial intelligence", "Machine learning",
                   "Data engineering", "Cloud computing", "DevOps", "SAP", "Software development"],
}
WEBSITE = {"@type": "WebSite", "@id": SITE + "#website", "url": SITE,
           "name": "PageOne Systems", "publisher": {"@id": SITE + "#organization"}}


def parse(page_file):
    text = page_file.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->\s*", text, re.S)
    meta = dict(re.findall(r"^\s*(\w+):\s*(.+?)\s*$", m.group(1), re.M))
    return meta, text[m.end():]


def page_url(name):
    return SITE if name == "index.html" else SITE + name


def structured_data(name, meta):
    graph = [ORG, WEBSITE]
    url = page_url(name)
    if "crumb" in meta:
        items = [("Home", SITE)]
        if "parent" in meta:
            label, path = meta["parent"].split("|")
            items.append((label, SITE + path))
        items.append((meta["crumb"], url))
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]})
    if "service" in meta:
        graph.append({"@type": "Service", "name": meta["service"], "serviceType": "IT staffing",
                      "description": meta["description"], "url": url,
                      "provider": {"@id": SITE + "#organization"},
                      "areaServed": {"@type": "Country", "name": "United States"}})
    data = json.dumps({"@context": "https://schema.org", "@graph": graph}, indent=2, ensure_ascii=False)
    return '<script type="application/ld+json">\n' + data + "\n    </script>"


def main():
    layout = (BUILD / "layout.html").read_text(encoding="utf-8")
    sitemap = []
    for page_file in sorted((BUILD / "pages").glob("*.html")):
        meta, body = parse(page_file)
        name = page_file.name
        nav = meta.get("nav", "")
        robots = meta.get("robots", "index, follow")
        out = layout.replace("{{content}}", body)
        out = out.replace("{{title}}", html.escape(meta["title"], quote=True))
        out = out.replace("{{description}}", html.escape(meta["description"], quote=True))
        out = out.replace("{{canonical}}", page_url(name))
        out = out.replace("{{robots}}", robots)
        out = out.replace("{{base}}", '<base href="%s">\n    ' % meta["base"] if "base" in meta else "")
        out = out.replace("{{jsonld}}", structured_data(name, meta))
        # Highlight the current page in the menu
        for key in ["home", "expertise", "ai", "data", "cloud", "sap", "development",
                    "employers", "industries", "training", "careers", "contact"]:
            on = key == nav or (key == "expertise" and nav in EXPERTISE_PAGES)
            out = out.replace("{{active_%s}}" % key, " active" if on else "")
        (ROOT / name).write_text(out, encoding="utf-8")
        if "noindex" not in robots:
            sitemap.append(page_url(name))
        print("built", name)

    today = datetime.date.today().isoformat()
    urls = "\n".join("  <url><loc>%s</loc><lastmod>%s</lastmod></url>" % (u, today) for u in sitemap)
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n",
        encoding="utf-8")
    print("built sitemap.xml (%d urls)" % len(sitemap))


if __name__ == "__main__":
    main()
