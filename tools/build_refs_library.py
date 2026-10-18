import json,os,re,glob,hashlib,datetime,io
from PIL import Image
L='/workspace/landmarks'; OUT='/workspace/infra/repo/refs/places'
def ll(cx,cz): return round(12.519776-(cz-28.8)/110750,6), round((cx+7519.5)/108475-70.039166,6)
def area_of(lat,lon):
    if lon>-69.95: return 'san-nicolas'
    if lat<12.535 and lon<-69.99: return 'oranjestad'
    if 12.545<=lat<12.60 and lon<-70.040: return 'palm-eagle-beach'
    if lat>=12.535 and lon<-70.0: return 'noord'
    return 'interior'
# manual places (no geodata): (glob, area, place, shows, credit, license)
WEB='web photo found online; rights belong to original author'
MAN=[('ref/hostario-da-vittorio_*.jpg','palm-eagle-beach','hostaria-da-vittorio','restaurant exterior/interior','aruba.com (Aruba Tourism Authority) media','unknown - reference only'),
('ref/ikes-bistro_*.jpg','palm-eagle-beach','ikes-bistro','restaurant','aruba.com media','unknown - reference only'),
('ref/papiamento-restaurant_*.jpg','noord','papiamento-restaurant','restaurant','aruba.com media','unknown - reference only'),
('ref/que-pasa_*.jpg','oranjestad','que-pasa','restaurant','aruba.com media','unknown - reference only'),
('ref/sopranos-piano-bar_*.jpg','palm-eagle-beach','sopranos-piano-bar','bar','aruba.com media','unknown - reference only'),
('ref/texas-de-brazil_*.jpg','palm-eagle-beach','texas-de-brazil','restaurant','aruba.com media','unknown - reference only'),
('ref/california_lighthouse.jpg','noord','california-lighthouse','lighthouse',WEB,'unknown - reference only'),
('ref/molen.jpg','palm-eagle-beach','de-olde-molen','windmill',WEB,'unknown - reference only'),
('ref/mainstreet_tram*.jpg','oranjestad','main-street','streetcar on Main Street',WEB,'unknown - reference only'),
('ref/tram_red_doubledecker.jpg','oranjestad','main-street','red double-decker tram',WEB,'unknown - reference only'),
('ref/renaissance_*.jpg','oranjestad','renaissance','Renaissance resort/marketplace at dusk',WEB,'unknown - reference only'),
('ref/palmbeach_balcony.jpg','palm-eagle-beach','palm-beach','view from hotel balcony',WEB,'unknown - reference only'),
('ref/ch_*.jpg','noord','santa-anna-church','church',WEB,'unknown - reference only'),
('ref/r[0-9].jpg','oranjestad','misc-r-series','unlabelled reference (r1-r9)',WEB,'unknown - reference only'),
('refs/palmbeach_*.jpg','palm-eagle-beach','palm-beach','beach / hotel strip',WEB,'unknown - reference only'),
('refs/marriott.jpg','palm-eagle-beach','marriott','hotel',WEB,'unknown - reference only'),
('refs/riu_*.jpg','palm-eagle-beach','riu','RIU hotels',WEB,'unknown - reference only'),
('refs/quinta_2015*.jpg','palm-eagle-beach','la-quinta-beach-resort','resort',WEB,'unknown - reference only'),
('refs/*Donkey*.jpg','interior','donkey-sanctuary','Donkey Sanctuary, Santa Lucia',WEB,'unknown (likely Wikimedia Commons) - verify'),
('refs/sf_*thumb*','palm-eagle-beach','senor-frogs','Senor Frogs',WEB,'unknown - reference only'),
('refs/web/barcelo_entrance.jpg','palm-eagle-beach','barcelo','hotel entrance',WEB,'unknown - reference only'),
('refs/web/polis_ora.jpg','oranjestad','police-station','police',WEB,'unknown - reference only'),
('refs/emergency/*.jpg','_vehicles','emergency','police/ambulance vehicles (livery reference)',WEB,'unknown - reference only'),
('/tmp/refs/*Anna*','noord','santa-anna-church','Santa Anna church, Noord',WEB,'unknown - reference only'),
('/tmp/refs/StAnna*','noord','santa-anna-church','Santa Anna church, Noord',WEB,'unknown - reference only'),
('/tmp/refs/cem*.jpg','noord','santa-anna-church','cemetery',WEB,'unknown - reference only'),
('/tmp/refs/riu_*','palm-eagle-beach','riu','RIU hotels',WEB,'unknown - reference only'),
('/tmp/refs/westin_*.jpg','palm-eagle-beach','westin','Westin resort',WEB,'unknown - reference only'),
('/tmp/refs/w2_*.jpg','palm-eagle-beach','westin','Westin resort (set 2)',WEB,'unknown - reference only'),
('/tmp/refs/hi/*.jpg','noord','hilton-or-hotel-hi','hotel grounds / aerial (hi set)',WEB,'unknown - reference only'),
]
ALIAS={'senorfrogs':'senor-frogs','lh':'california-lighthouse','lh2':'california-lighthouse','h11':'hotel-h11','h11b':'hotel-h11','am2':'archaeological-museum','archmuseum':'archaeological-museum','otank':'water-tower','rb_waves':'renaissance','starbucks2':'starbucks','mcd1':'mcdonalds'}
seen={}; idx={}; n=0; dup=0
def add(src,area,place,meta):
    global n,dup
    try: im=Image.open(src); im.load()
    except Exception: return
    if im.mode!='RGB': im=im.convert('RGB')
    h=hashlib.md5(im.resize((16,16)).convert('L').tobytes()).hexdigest()
    if h in seen: dup+=1; return
    seen[h]=1
    im.thumbnail((1280,1280))
    d=f'{OUT}/{area}/{place}'; os.makedirs(d,exist_ok=True)
    fn=re.sub(r'[^a-z0-9_.-]','_',os.path.splitext(os.path.basename(src))[0].lower())+'.jpg'
    for q in (85,75,65,55,45):
        b=io.BytesIO(); im.save(b,'JPEG',quality=q,optimize=True)
        if b.tell()<300_000: break
        if q==45: im.thumbnail((900,900)); b=io.BytesIO(); im.save(b,'JPEG',quality=60)
    open(f'{d}/{fn}','wb').write(b.getvalue())
    idx.setdefault(d,[]).append(dict(file=fn,**meta,original_path=src)); n+=1
for j in sorted(glob.glob(L+'/mly/*.json')):
    name=os.path.basename(j)[:-5]
    if name.startswith('sv_') or name in('coverage','wrong_hides'): continue
    for e in json.load(open(j)):
        if not isinstance(e,dict): continue
        e.setdefault('file',e.get('f')); e.setdefault('cx',e.get('x')); e.setdefault('cz',e.get('z')); e.setdefault('date',e.get('ts')); e.setdefault('mly_id',e.get('id'))
        if not e['file'] or e['cx'] is None: continue
        lat,lon=ll(e['cx'],e['cz'])
        date=datetime.datetime.fromtimestamp(e['date']/1000,datetime.UTC).strftime('%Y-%m-%d') if e.get('date') else None
        add(f"{L}/{e['file']}",area_of(lat,lon),ALIAS.get(name,name.replace('_','-')),dict(source_url=f"https://www.mapillary.com/app/?pKey={e['mly_id']}",license='CC BY-SA 4.0 (Mapillary)',credit=f"Mapillary / {e.get('by')}",lat=lat,lon=lon,heading=round(e['cmp'],1) if e.get('cmp') is not None else None,date=date,shows=f"street-level view toward {name} (~{e.get('dist')} m away)"))
for g,area,place,shows,credit,lic in MAN:
    base=os.path.basename(g).split('_')[0]
    urls=[]
    for u in glob.glob(f"{L}/ref/{place}*.urls")+glob.glob(f"{L}/ref/{base}*.urls"):
        urls=[l.split()[0] for l in open(u) if l.strip()]; break
    for src in sorted(glob.glob(g if g.startswith('/') else f'{L}/{g}')):
        m=re.search(r'_(\d+)\.jpg$',src); su=urls[int(m.group(1))] if (m and urls and int(m.group(1))<len(urls)) else None
        add(src,area,place,dict(source_url=su,license=lic,credit=credit,lat=None,lon=None,heading=None,date=None,shows=shows))
for d,items in idx.items():
    json.dump({'place':os.path.basename(d),'area':os.path.basename(os.path.dirname(d)),'photos':items},open(f'{d}/index.json','w'),indent=1)
print('written',n,'dups skipped',dup,'places',len(idx))
