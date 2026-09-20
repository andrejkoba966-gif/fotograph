from html.parser import HTMLParser
from html import escape
from pathlib import Path
import json, re
root=Path(__file__).resolve().parent.parent
copy=json.loads((root/'scripts/en-copy.json').read_text())
copy['Мова сайту']='Site language'
def translate(s):
    key=s.strip()
    if key in copy: return s.replace(key,copy[key])
    if key.startswith('Відкрити фото «'):
        name=key[len('Відкрити фото «'):-1]
        return 'Open photo: '+copy[name]
    if re.search('[А-Яа-яІіЇїЄєҐґ]',s): raise ValueError('Missing translation: '+s)
    return s
class English(HTMLParser):
    def __init__(self): super().__init__(convert_charrefs=False); self.out=[]; self.raw=False
    def handle_decl(self,s): self.out.append('<!'+s+'>')
    def handle_starttag(self,tag,attrs):
        self.raw=tag in ('script','style')
        values=dict(attrs)
        result=[]
        for k,v in attrs:
            if tag=='html' and k=='lang':v='en'
            if k in ('alt','aria-label','placeholder','data-caption','data-session') or (tag=='meta' and values.get('name')=='description' and k=='content'):v=translate(v)
            if k=='aria-current' and 'data-language' in values:continue
            result.append(k if v is None else k+'="'+escape(v,quote=True)+'"')
        if values.get('data-language')=='en':result.append('aria-current="page"')
        self.out.append('<'+tag+(' '+' '.join(result) if result else '')+'>')
    def handle_endtag(self,tag): self.out.append('</'+tag+'>'); self.raw=False
    def handle_data(self,s): self.out.append(s if self.raw else escape(translate(s),quote=False))
    def handle_entityref(self,s):self.out.append('&'+s+';')
    def handle_charref(self,s):self.out.append('&#'+s+';')
    def handle_comment(self,s):self.out.append('<!--'+s+'-->')
p=English();p.feed((root/'dist/index.html').read_text());(root/'dist/en.html').write_text(''.join(p.out))
print('English page generated; every Ukrainian text and accessible attribute translated.')
