# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
import os
import sys

sys.path.append(os.path.abspath("_themes"))

project = 'NCCoE Agentic AI Identity and Authorization Project Resource Hub'
author = 'NIST NCCoE'
email = u'AI-Identity@nist.gov'
email_subject = u'[Doc review] {PROJECT} - {N} comments'
googleanalytics_id = 'G-RJSMY46M5C'
comment_capture_export_html = True
comment_capture_export_csv = True

# Open Graph base URL
ogp_site_url = "https://pages.nist.gov/nccoe-ai-identity"

# Publication metadata
publication_metadata = {
    "title": project,
    "headline": project,
    "citation_title": project,
    "description": "",
    "url": ogp_site_url,
    "jsonld_type": "Report",
    "og_type": "article",
    "language": "en-US",
    "language_dcterms": "EN-US",
    "date_created": "2026-09-29",
    "published_date": "2026-09-29",
    "published_date_google": "2026/09/29",
    "technical_report_number": "",
    "technical_report_institution": "National Institute of Standards and Technology",
    "publisher_name": "National Institute of Standards and Technology",
    "publisher_url": "https://www.nist.gov/",
    "site_name": "NCCoE | NIST",
    "image": "",
    "image_alt": "",
    "keywords": [
        "cybersecurity",
        "NCCoE",
        "NIST",
    ],
    "authors": [
        {
            "name": "NIST | NCCoE",
            "given_name": "",
            "family_name": "",
            "affiliation": "NIST",
            "citation_name": "NCCoE, NIST",
            "dcterms_name": "Author: NIST | NCCoE",
        },
    ],
    "editors": [],
}

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinxcontrib.rsvgconverter',
    'sphinx.ext.intersphinx',
    'sphinx.ext.autodoc',
    'sphinx.ext.autosummary',
    'sphinx_design',
    'sphinx.ext.mathjax',
    'sphinx.ext.viewcode',
    'nccoe_rtd_theme',
    "sphinxcontrib.mermaid",
    "sphinxcontrib.googleanalytics",
    "sphinx_reredirects",
    #"sphinxcontrib.spelling",
    "sphinxcontrib.images",
    "sphinxext.opengraph",
]


# Optionally include the spelling extension only if it's installed
try:
    import sphinxcontrib.spelling
except Exception:
    pass
else:
    extensions.append("sphinxcontrib.spelling")

templates_path = ['_templates']
source_suffix = '.rst'
gettext_compact = False
exclude_patterns = ['build', 'Thumbs.db', '.DS_Store', '.git']

master_doc = 'index'
suppress_warnings = ['image.nonlocal_uri']
pygments_style = 'default'




html_logo = "_static/img/nccoe-logo.svg"
html_show_sourcelink = False
html_favicon = "_static/img/favicon.ico"

html_theme = "nccoe_rtd_theme"
html_theme_path = [os.path.abspath("_themes")]
html_static_path = ['_static']
html_theme_options = {
    'logo_only': False,
    'prev_next_buttons_location': 'bottom',
    'style_external_links': True,
    'vcs_pageview_mode': '',
    'style_nav_header_background': 'white',
    'flyout_display': 'hidden',
    'version_selector': False,
    'language_selector': False,
    # Toc options
    'collapse_navigation': False,
    'sticky_navigation': True,
    'navigation_depth': 1,
    'includehidden': True,
    'titles_only': True,
    'project_page': 'https://www.nccoe.nist.gov/projects/software-and-ai-agent-identity-and-authorization'
}
html_context = {
    "email": email,
    "subject": email_subject,
    "comment_capture_export_html": comment_capture_export_html,
    "comment_capture_export_csv": comment_capture_export_csv,
    "publication_metadata": publication_metadata,
}
html_css_files = [
    "custom.css"
]
html_js_files = [
    "main.js"
]

# Open Graph metadata
ogp_site_url = publication_metadata["url"]
ogp_site_name = publication_metadata["site_name"]
ogp_type = publication_metadata["og_type"]
ogp_description_length = 300
ogp_image = publication_metadata["image"]
ogp_image_alt = publication_metadata["image_alt"]

# Twitter metadata
twitter_domain = publication_metadata["url"].replace("https://", "").replace("http://", "").split("/")[0]

ogp_custom_meta_tags = [
    '<meta name="twitter:card" content="summary_large_image">',
    f'<meta property="twitter:domain" content="{twitter_domain}">',
    f'<meta property="twitter:url" content="{publication_metadata["url"]}">',
    f'<meta name="twitter:title" content="{publication_metadata["title"]}">',
    f'<meta name="twitter:description" content="{publication_metadata["description"]}">',
    f'<meta name="twitter:image" content="{publication_metadata["image"]}">',
]

numfig = True

redirects = {
     "<source>": "<target>"
}

rst_epilog = """
.. |repo_base| replace:: https://gitlab.nist.gov/<group>/<repo>/-/blob/main
.. |config_base| replace:: config
"""

spelling_word_list_filename = ["_themes/nccoe_rtd_theme/dictionaries/spelling_wordlist.txt"] # you can add more wordlist files here
