"""Build the downloadable academic CV from the site's shared data.

Requires Python 3, reportlab, Node.js 22.18+ (native TypeScript imports),
and DejaVu Serif/Sans TTF fonts. Run from any directory:
  python3 scripts/build-academic-cv.py
Set CV_FONT_DIR to a directory containing the DejaVu TTF files if needed.
The PDF is committed; this is a manual authoring step, not part of Astro build.
"""
import json
import os
from pathlib import Path
import re
import subprocess
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
node = os.environ.get('CODEX_PRIMARY_RUNTIME_NODE', 'node')
data = json.loads(subprocess.check_output([
    node, '--experimental-strip-types', '--input-type=module', '-e',
    'import { basics, education, researchExperience, academicService, awards } from "./src/data/cv.ts";'
    'import { publications } from "./src/data/publications.ts";'
    'console.log(JSON.stringify({ basics, education, researchExperience, academicService, awards, publications }));'
], cwd=ROOT, text=True))

font_dir = Path(os.environ.get('CV_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
for name, filename in [('Serif', 'DejaVuSerif.ttf'), ('SerifBold', 'DejaVuSerif-Bold.ttf'),
                       ('Sans', 'DejaVuSans.ttf'), ('SansBold', 'DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(font_dir / filename)))
pdfmetrics.registerFontFamily('Serif', normal='Serif', bold='SerifBold', italic='Serif', boldItalic='SerifBold')
pdfmetrics.registerFontFamily('Sans', normal='Sans', bold='SansBold', italic='Sans', boldItalic='SansBold')

OUT = ROOT / 'public/cv/Youngjae_Cho_CV.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = letter
LEFT, RIGHT = 48, W - 48
WIDTH = RIGHT - LEFT
INK = colors.HexColor('#171b20')
MUTED = colors.HexColor('#505963')
styles = {
    'body': ParagraphStyle('body', fontName='Serif', fontSize=10.7, leading=14.7, textColor=INK),
    'title': ParagraphStyle('title', fontName='SerifBold', fontSize=11.2, leading=14.5, textColor=INK),
    'meta': ParagraphStyle('meta', fontName='Sans', fontSize=8.5, leading=11.7, textColor=MUTED),
    'rail': ParagraphStyle('rail', fontName='SansBold', fontSize=8.8, leading=12.5, textColor=INK),
    'small': ParagraphStyle('small', fontName='Sans', fontSize=8.3, leading=11.5, textColor=MUTED),
}
c = Canvas(str(OUT), pagesize=letter, invariant=1, pageCompression=1)
c.setTitle('Youngjae Cho Academic CV')
c.setAuthor('Youngjae Cho')
c.setSubject('Machine learning research, publications, and academic service')
y = H - 48

def rich(text):
    parts = re.split(r'\*\*(.*?)\*\*', text)
    return ''.join(('<b>' + escape(t) + '</b>') if i % 2 else escape(t) for i, t in enumerate(parts))

def draw(text, x=LEFT, top=None, width=WIDTH, style='body', html=False):
    global y
    top = y if top is None else top
    p = Paragraph(text if html else rich(text), styles[style])
    _, height = p.wrap(width, H)
    if top - height < 47:
        raise ValueError(f'CV content overflows page {c.getPageNumber()}: {text[:70]}')
    p.drawOn(c, x, top - height)
    return top - height

def heading(label, first=False):
    global y
    y -= 20 if not first else 0
    c.setFillColor(colors.black)
    c.setFont('SansBold', 11)
    c.drawString(LEFT, y - 11, label.upper())
    y -= 27

def dated(title, date, subtitle=None):
    global y
    bottom = draw(title, width=WIDTH - 157, style='title')
    st = ParagraphStyle('date', parent=styles['meta'], alignment=TA_RIGHT)
    p = Paragraph(escape(date), st)
    _, height = p.wrap(151, 50)
    p.drawOn(c, RIGHT - 151, y - height - 1)
    y = bottom
    if subtitle:
        y = draw(subtitle, top=y - 3, style='meta')
    y -= 10

def linked(label, url):
    return f'<a href="{escape(url, {chr(34): "&quot;"})}" color="#171b20">{escape(label)}</a>'

def publication(pub, contribution=None):
    global y
    x, width = LEFT + 94, WIDTH - 94
    # The venue rail makes year and publication status scannable independently.
    draw(pub['venue'], width=81, style='rail')
    status = 'Accepted' if pub['status'] == 'Accepted' else ('Preprint' if pub['status'] == 'Preprint' else '')
    if status:
        draw(status, top=y - 27 if 'Workshop' in pub['venue'] else y - 15, width=81, style='small')
    bottom = draw(linked(pub['title'], pub['url']), x=x, width=width, style='title', html=True)
    bottom = draw(pub['authors'], x=x, top=bottom - 4, width=width, style='meta')
    if pub.get('role') in ('First author', 'Co-first author'):
        bottom = draw(pub['role'], x=x, top=bottom - 3, width=width, style='small')
    if contribution:
        bottom = draw(contribution, x=x, top=bottom - 6, width=width)
    if pub['key'] == 'group':
        bottom = draw('Workshop on Spurious Correlations, Invariance and Stability', x=x, top=bottom - 3, width=width, style='small')
    y = bottom - 16

def footer(page):
    c.setFillColor(MUTED)
    c.setFont('Sans', 8)
    c.drawString(LEFT, 28, 'Youngjae Cho  /  Academic CV')
    c.drawRightString(RIGHT, 28, f'{page} / 2')

# Page 1: research identity and the central publication record.
c.setFont('SerifBold', 29)
c.setFillColor(colors.black)
c.drawString(LEFT, y - 29, data['basics']['name'])
y -= 42
y = draw('Machine Learning Researcher', style='body') - 10
b = data['basics']
y = draw(f'{escape(b["location"])} &nbsp; | &nbsp; {linked(b["email"], "mailto:" + b["email"])}', style='meta', html=True) - 4
y = draw(' &nbsp; | &nbsp; '.join([
    linked('youngjae-cho.github.io', 'https://youngjae-cho.github.io/'),
    linked('GitHub', b['links']['github']), linked('Google Scholar', b['links']['scholar'])
]), style='meta', html=True) - 17
y = draw('My research focuses on **robust and data-efficient machine learning** under imperfect supervision, spanning preference optimization, active learning, Bayesian adaptation, and multimodal learning.')

heading('Education')
for e in data['education']:
    def date(v):
        year, month = v.split('.')
        return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][int(month)-1] + ' ' + year
    dated(f'{e["org"]}  |  {e["degree"]}', f'{date(e["start"])} - {date(e["end"])}',
          'Advisor: Il-Chul Moon' if 'note' in e else None)

heading('Selected Publications')
pubs = {p['key']: p for p in data['publications']}
for key, contribution in [
    ('gapo', 'Geometric anchoring for robust preference optimization; **+3.6 percentage points** in AlpacaEval 2.0 LC win rate over SimPO.'),
    ('app', 'Bayesian prompt adaptation with data-dependent priors for vision-language learning with scarce data and distribution shift.'),
    ('saal', 'Sharpness-aware sample acquisition to improve generalization under a limited labeling budget.'),
]:
    publication(pubs[key], contribution)
y = draw('* Equal contribution. Additional publications appear on page 2.', style='small')
footer(1)
c.showPage()
y = H - 48

# Page 2: research experience, the complete remaining record, and service.
heading('Research Experience', first=True)
experience = [
    ('Pyler', 'Research Scientist', 'Oct 2025 - Present', [
        ('Preference optimization', 'Developed GAPO (NeurIPS 2026, accepted) and multimodal preference-optimization methods for Nemotron-Nano-12B-v2-VL using SimPO and Megatron-Bridge.'),
        ('Auditable supervision', 'Recovered decision trees from 299K LLM/VLM reasoning traces; improved content-safety macro F1 from **0.777 to 0.857**.'),
    ]),
    ('Aiv Co.', 'ML Research Scientist', 'Mar 2024 - Oct 2025', [
        ('Generative modeling', 'Led background-aware diffusion research for industrial anomaly detection. Evaluated on MVTec-AD and LOCO and deployed defect synthesis to improve production detector precision and recall.'),
    ]),
    ('KAIST', 'Graduate Research', 'Mar 2022 - Feb 2024', [
        ('Data-efficient learning', 'Developed Bayesian vision-language prompt adaptation (APP, AAAI 2024; first author) and sharpness-aware active learning (SAAL, ICML 2023; co-first author).'),
    ]),
]
for org, role, period, projects in experience:
    dated(org, period, role)
    for label, text in projects:
        y = draw(f'**{label}.** {text}') - 7
    y -= 7

heading('Additional Publications')
for key in ['defect', 'group', 'vade']:
    publication(pubs[key])

# Short parallel records share the last band without interrupting the reading flow.
band_top = y - 8
award_x = LEFT + 227
c.setFillColor(colors.black)
c.setFont('SansBold', 11)
c.drawString(LEFT, band_top - 11, 'ACADEMIC SERVICE')
c.drawString(award_x, band_top - 11, 'AWARDS')
service_y = band_top - 27
for service in data['academicService']:
    service_y = draw(f'**{service["venue"]} {service["date"]}** | {service["role"]}', top=service_y, width=205) - 10
award_y = draw('NVIDIA Nemotron Hackathon', x=award_x, top=band_top - 27, width=WIDTH - 227, style='title')
award_y = draw('Track B Winner  |  2026', x=award_x, top=award_y - 4, width=WIDTH - 227, style='meta')
draw('Team winner, Domain-Specialized Model track.', x=award_x, top=award_y - 6, width=WIDTH - 227, style='meta')
footer(2)
c.save()
print(OUT)
