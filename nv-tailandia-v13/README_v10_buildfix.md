# nv-tailandia v10 — Build fix (Vercel)

## Qué corrige
Vercel falla con:
Type error: Type '{ type: string; features: any[]; }' is not assignable to type 'GeoJSON...'
en components/MapView.tsx (addSource user-accuracy).

Este parche castea `polyData` a `any` en la llamada `map.addSource(...)` para satisfacer el typecheck sin cambiar runtime.

## Cómo aplicar
1) Copiá este zip a tu máquina y desde la raíz del repo ejecutá:

```bash
cd ~/Documents/nv-tailandia
unzip -o ~/Downloads/nv-tailandia_v10_buildfix.zip
bash apply-v10-buildfix.sh
```

2) Commit + push:

```bash
git add components/MapView.tsx apply-v10-buildfix.sh
git commit -m "Fix TS: cast user-accuracy GeoJSON data"
git push
```
