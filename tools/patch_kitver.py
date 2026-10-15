"""Cache-bust the car/props kit GLBs loaded by sh() (./models/<name>.glb). Bump KV when cars.glb/props.glb change. Idempotent."""
import re,glob
KV='c7'  # ev.glb is versioned in addons/src/evModels.ts (?v=e1); bump it when ev.glb changes
f=glob.glob('game/assets/index-*.js')[0]; s=open(f).read()
old='t.loadAsync(`./models/`+r+`.glb`)'; s2=re.sub(r't\.loadAsync\(`\./models/`\+r\+`\.glb(\?v=\w+)?`\)','t.loadAsync(`./models/`+r+`.glb?v=%s`)'%KV,s,count=1)
print('ok' if s2!=s else 'already'); open(f,'w').write(s2)
