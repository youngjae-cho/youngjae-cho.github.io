"""Typeset the two-page academic CV from the shared website data.

Requires ReportLab, Node.js 22.18+, and DejaVu Sans fonts. Latin Modern
(Type 1 AFM/PFB files, e.g. fonts-lmodern) supplies the academic serif face;
DejaVu Serif is the fallback. Set CV_TEX_FONT_DIR / CV_FONT_DIR if needed.
The checked-in PDF is rebuilt manually with:
  python3 scripts/build-academic-cv.py
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
tex_dir = Path(os.environ.get('CV_TEX_FONT_DIR', '/usr/share/texmf/fonts'))
serif_faces = [('Serif', 'lmr10', 'DejaVuSerif.ttf'),
               ('SerifBold', 'lmbx10', 'DejaVuSerif-Bold.ttf'),
               ('SerifItalic', 'lmri10', 'DejaVuSerif.ttf')]
for name, stem, fallback in serif_faces:
    afm = tex_dir / f'afm/public/lm/{stem}.afm'
    pfb = tex_dir / f'type1/public/lm/{stem}.pfb'
    if afm.exists() and pfb.exists():
        face = pdfmetrics.EmbeddedType1Face(str(afm), str(pfb))
        # Some ReportLab versions retain AFM vertical metrics as strings.
        face.ascent, face.descent = float(face.ascent), float(face.descent)
        pdfmetrics.registerTypeFace(face)
        pdfmetrics.registerFont(pdfmetrics.Font(name, face.name, 'WinAnsiEncoding'))
    else:
        pdfmetrics.registerFont(TTFont(name, str(font_dir / fallback)))
for name, file in [('Sans', 'DejaVuSans.ttf'), ('SansBold', 'DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(font_dir / file)))
pdfmetrics.registerFontFamily('Serif', normal='Serif', bold='SerifBold',
                              italic='SerifItalic', boldItalic='SerifBold')
pdfmetrics.registerFontFamily('Sans', normal='Sans', bold='SansBold')

OUT = ROOT / 'public/cv/Youngjae_Cho_CV.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = letter
LEFT, RIGHT = 49, W - 49
WIDTH = RIGHT - LEFT
INK = colors.HexColor('#20252b')
MUTED = colors.HexColor('#50565e')
LINK = '#244d70'
RULE = colors.HexColor('#c8cdd2')
styles = {
    'body': ParagraphStyle('body', fontName='Serif', fontSize=10.8, leading=13.6, textColor=INK),
    'title': ParagraphStyle('title', fontName='SerifBold', fontSize=11.2, leading=13.9, textColor=INK),
    'authors': ParagraphStyle('authors', fontName='Serif', fontSize=9.6, leading=11.8, textColor=MUTED),
    'contribution': ParagraphStyle('contribution', fontName='Serif', fontSize=10.1, leading=12.9, textColor=MUTED),
    'meta': ParagraphStyle('meta', fontName='Sans', fontSize=8.1, leading=11.2, textColor=MUTED),
    'small': ParagraphStyle('small', fontName='SerifItalic', fontSize=9, leading=11.5, textColor=MUTED),
}
styles['right'] = ParagraphStyle('right', parent=styles['meta'], alignment=TA_RIGHT)
c = Canvas(str(OUT), pagesize=letter, invariant=1, pageCompression=1)
c.setTitle('Youngjae Cho - Academic CV')
c.setAuthor('Youngjae Cho')
c.setSubject('Machine learning research, publications, and academic service')
y = H - 49
layout = []

def clean(text):
    return text.replace('\u2014', '-').replace('\u2013', '-').replace('\u2011', '-')

def rich(text):
    parts = re.split(r'\*\*(.*?)\*\*', clean(text))
    return ''.join('<b>' + escape(t) + '</b>' if i % 2 else escape(t)
                   for i, t in enumerate(parts))

def draw(text, x=LEFT, top=None, width=WIDTH, style='body', html=False):
    top = y if top is None else top
    p = Paragraph(text if html else rich(text), styles[style])
    _, height = p.wrap(width, H)
    if top - height < 48:
        raise ValueError(f'CV overflows page {c.getPageNumber()} at {top-height:.1f}: {text[:70]}')
    p.drawOn(c, x, top - height)
    return top - height

def heading(label, first=False, x=LEFT, width=WIDTH):
    global y
    if not first:
        y -= 21
    c.setFillColor(INK)
    c.setFont('SansBold', 9.8)
    label = label.upper()
    c.drawString(x, y - 10, label)
    line_x = x + pdfmetrics.stringWidth(label, 'SansBold', 9.8) + 12
    c.setStrokeColor(RULE)
    c.setLineWidth(.5)
    c.line(line_x, y - 6.5, x + width, y - 6.5)
    y -= 25

def dated(title, period, subtitle=None):
    global y
    top = y
    bottom = draw(title, width=WIDTH - 143)
    draw(period, x=RIGHT - 139, top=top + .5, width=139, style='right')
    if subtitle:
        bottom = draw(subtitle, top=bottom - 3, style='meta')
    y = bottom - 10

def date(value):
    if value == 'present':
        return 'Present'
    year, month = value.split('.')
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][int(month)-1] + ' ' + year

def linked(label, url, color=LINK):
    return f'<a href="{escape(url, {chr(34): "&quot;"})}" color="{color}">{escape(clean(label))}</a>'

def publication(pub, number, describe=False):
    global y
    x, width = LEFT + 23, WIDTH - 23
    draw(f'[{number}]', top=y - 1, width=19, style='meta')
    bottom = draw(linked(pub['title'], pub['url'], '#20252b'),
                  x=x, width=width, style='title', html=True)
    bottom = draw(pub['authors'], x=x, top=bottom - 3, width=width, style='authors')
    record = '<b>' + escape(pub['venue']) + '</b>'
    if pub['status'] in ('Accepted', 'Preprint'):
        record += ' &nbsp; | &nbsp; ' + pub['status']
    if pub.get('role') in ('First author', 'Co-first author'):
        record += ' &nbsp; | &nbsp; ' + pub['role']
    record += ' &nbsp; &nbsp; ' + linked('[Paper]', pub['url'])
    if pub.get('codeUrl'):
        record += ' &nbsp; ' + linked('[Code]', pub['codeUrl'])
    bottom = draw(record, x=x, top=bottom - 3, width=width, style='meta', html=True)
    if pub['key'] == 'group':
        bottom = draw('Workshop on Spurious Correlations, Invariance and Stability',
                      x=x, top=bottom - 3, width=width, style='small')
    if describe:
        bottom = draw(pub['summary'].replace('**', ''), x=x, top=bottom - 6,
                      width=width, style='contribution')
    y = bottom - 15
    layout.append((c.getPageNumber(), pub['key'], round(y, 1)))

def footer(page):
    c.setStrokeColor(RULE)
    c.setLineWidth(.4)
    c.line(LEFT, 39, RIGHT, 39)
    c.setFont('Sans', 7.4)
    c.setFillColor(MUTED)
    c.drawString(LEFT, 25, 'Youngjae Cho  |  Academic CV')
    c.drawRightString(RIGHT, 25, f'{page} / 2')

# Page 1: identity, education, and the four central research contributions.
b = data['basics']
c.setFillColor(INK)
c.setFont('SerifBold', 31)
c.drawString(LEFT, y - 31, b['name'])
contact_y = y - 3
for contact in [
    linked(b['email'], 'mailto:' + b['email']),
    linked('youngjae-cho.github.io', 'https://youngjae-cho.github.io/'),
    linked('GitHub', b['links']['github']) + ' &nbsp; | &nbsp; ' + linked('Google Scholar', b['links']['scholar']),
]:
    contact_y = draw(contact, x=RIGHT - 177, top=contact_y, width=177, style='right', html=True) - 4
y -= 43
y = draw(b['label']) - 4
y = draw(b['location'], style='meta') - 20
y = draw(b['researchInterests'])

heading('Education')
for e in data['education']:
    dated(f'**{e["org"]}**  |  {e["degree"]}',
          f'{date(e["start"])} - {date(e["end"])}',
          e.get('note', '').replace('advised by ', 'Advisor: ') or None)

heading('Selected Publications')
y = draw('* Equal contribution.', style='small') - 9
for i, pub in enumerate(data['selectedPublications'], 1):
    publication(pub, i, describe=True)
footer(1)
c.showPage()
y = H - 49

# Page 2: research experience, the remaining complete record, and recognition.
heading('Research Experience', first=True)
for job in data['researchExperience']:
    dated('**' + job['org'] + '**  |  ' + job['role'],
          f'{date(job["start"])} - {date(job["end"])}')
    for text in job['highlights']:
        c.setFillColor(MUTED)
        c.circle(LEFT + 2.2, y - 5.8, .9, fill=1, stroke=0)
        y = draw(text, x=LEFT + 11, width=WIDTH - 11) - 4
    y -= 8

heading('Additional Publications')
for i, pub in enumerate(data['additionalPublications'], len(data['selectedPublications']) + 1):
    publication(pub, i)

# Two compact, aligned sections finish the document.
y -= 6
band_y = y
award_x = LEFT + 235
heading('Academic Service', first=True, width=207)
service_y = y
for service in data['academicService']:
    service_y = draw(f'**{service["venue"]} {service["date"]}**',
                     top=service_y, width=207) - 2
    service_y = draw(service['role'], top=service_y, width=207, style='meta') - 10
y = band_y
heading('Awards', first=True, x=award_x, width=WIDTH - 235)
award_y = y
for award in data['awards']:
    name, _, distinction = award['name'].partition(' — ')
    award_y = draw(name, x=award_x, top=award_y, width=WIDTH - 235, style='title') - 3
    award_y = draw(f'{distinction} | {award["date"]}', x=award_x, top=award_y,
                   width=WIDTH - 235, style='meta') - 5
    award_y = draw(award['detail'].split('. ')[0] + '.', x=award_x, top=award_y,
                   width=WIDTH - 235, style='contribution') - 8
footer(2)
c.save()
print(OUT)
print(json.dumps({'publication_positions': layout,
                  'recognition_bottom': round(min(service_y, award_y), 1)}))
