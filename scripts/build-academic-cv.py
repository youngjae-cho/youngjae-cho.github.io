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
    'import { selectedPublications, additionalPublications } from "./src/data/publications.ts";'
    'console.log(JSON.stringify({ basics, education, researchExperience, academicService, awards, selectedPublications, additionalPublications }));'
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
    'body': ParagraphStyle('body', fontName='Serif', fontSize=10.4, leading=13.5, textColor=INK),
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
    y -= 15 if not first else 0
    c.setFillColor(colors.black)
    c.setFont('SansBold', 11)
    c.drawString(LEFT, y - 11, label.upper())
    y -= 25

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
    y -= 6

def linked(label, url):
    return f'<a href="{escape(url, {chr(34): "&quot;"})}" color="#171b20">{escape(label)}</a>'

def publication(pub, describe=False):
    global y
    x, width = LEFT + 94, WIDTH - 94
    # The venue rail makes year and publication status scannable independently.
    rail_bottom = draw(pub['venue'], width=81, style='rail')
    status = 'Accepted' if pub['status'] == 'Accepted' else ('Preprint' if pub['status'] == 'Preprint' else '')
    if status:
        rail_bottom = draw(status, top=rail_bottom - 3, width=81, style='small')
    if pub.get('role') in ('First author', 'Co-first author'):
        rail_bottom = draw(pub['role'], top=rail_bottom - 4, width=81, style='small')
    links = [linked('[Paper]', pub['url'])] if pub.get('url') else []
    if pub.get('codeUrl'):
        links.append(linked('[Code]', pub['codeUrl']))
    if links:
        rail_bottom = draw(' &nbsp; '.join(links), top=rail_bottom - 5, width=81, style='small', html=True)
    bottom = draw(linked(pub['title'], pub['url']), x=x, width=width, style='title', html=True)
    bottom = draw(pub['authors'], x=x, top=bottom - 4, width=width, style='meta')
    if describe:
        bottom = draw(pub['summary'], x=x, top=bottom - 6, width=width)
    if pub['key'] == 'group':
        bottom = draw('Workshop on Spurious Correlations, Invariance and Stability', x=x, top=bottom - 3, width=width, style='small')
    y = min(bottom, rail_bottom) - 9

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
y = draw(data['basics']['label'], style='body') - 10
b = data['basics']
y = draw(f'{escape(b["location"])} &nbsp; | &nbsp; {linked(b["email"], "mailto:" + b["email"])}', style='meta', html=True) - 4
y = draw(' &nbsp; | &nbsp; '.join([
    linked('youngjae-cho.github.io', 'https://youngjae-cho.github.io/'),
    linked('GitHub', b['links']['github']), linked('Google Scholar', b['links']['scholar'])
]), style='meta', html=True) - 12
y = draw(b['researchInterests'])

heading('Education')
def date(v):
    if v == 'present':
        return 'Present'
    year, month = v.split('.')
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][int(month)-1] + ' ' + year

for e in data['education']:
    dated(f'{e["org"]}  |  {e["degree"]}', f'{date(e["start"])} - {date(e["end"])}',
          e.get('note', '').replace('advised by ', 'Advisor: ') or None)

heading('Selected Publications')
for pub in data['selectedPublications']:
    publication(pub, describe=True)
y = draw('* Equal contribution. Additional publications appear on page 2.', style='small')
footer(1)
c.showPage()
y = H - 48

# Page 2: research experience, the complete remaining record, and service.
heading('Research Experience', first=True)
for job in data['researchExperience']:
    dated(job['org'], f'{date(job["start"])} - {date(job["end"])}', job['role'])
    for text in job['highlights']:
        y = draw(text) - 5
    y -= 5

heading('Additional Publications')
# The shared list includes every paper outside the selected record.
for pub in data['additionalPublications']:
    publication(pub)

# Short parallel records share the last band without interrupting the reading flow.
band_top = y - 6
award_x = LEFT + 227
c.setFillColor(colors.black)
c.setFont('SansBold', 11)
c.drawString(LEFT, band_top - 11, 'ACADEMIC SERVICE')
c.drawString(award_x, band_top - 11, 'AWARDS')
service_y = band_top - 27
for service in data['academicService']:
    service_y = draw(f'**{service["venue"]} {service["date"]}** | {service["role"]}', top=service_y, width=205) - 10
award_y = band_top - 27
for award in data['awards']:
    name, _, distinction = award['name'].partition(' — ')
    award_y = draw(name, x=award_x, top=award_y, width=WIDTH - 227, style='title')
    award_y = draw(f'{distinction} | {award["date"]}', x=award_x, top=award_y - 4, width=WIDTH - 227, style='meta')
    award_y = draw(award['detail'].split('. ')[0] + '.', x=award_x, top=award_y - 6, width=WIDTH - 227, style='meta') - 10
footer(2)
c.save()
print(OUT)
