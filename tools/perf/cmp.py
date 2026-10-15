import sys
from PIL import Image, ImageChops
import numpy as np
a=Image.open(sys.argv[1]).convert('RGB'); b=Image.open(sys.argv[2]).convert('RGB'); out=sys.argv[3]
x=np.abs(np.asarray(a).astype(int)-np.asarray(b).astype(int)).sum(2)
print('size',a.size,'differing px (sum>24):',int((x>24).sum()),'of',x.size, 'max',int(x.max()), 'mean', round(float(x.mean()),3))
w=a.width; o=Image.new('RGB',(w*3,a.height)); o.paste(a,(0,0)); o.paste(b,(w,0))
m=(x>24); dd=(np.asarray(a)*0.35).astype(np.uint8); dd[m]=[255,0,0]; o.paste(Image.fromarray(dd),(2*w,0)); o.save(out)
