# Railway Deployment Guide

## Automatické nasazení na Railway

Tento projekt je nastaven pro automatické nasazení na Railway pomocí Docker image z GitHub Container Registry (GHCR).

### Jak to funguje:

1. **GitHub Actions workflow** (`.github/workflows/main.yml`) automaticky:
   - Buildí Docker image při push do `main` větve
   - Pushuje image s tagy: `latest`, `staging`, a **`prod`**
   - Image je dostupný na: `ghcr.io/pet84/librechat:prod`

2. **Railway automaticky nasadí** novou verzi, když:
   - Sleduješ image `ghcr.io/pet84/librechat:prod`
   - Railway detekuje nový build a automaticky redeployuje

### Nastavení na Railway:

#### Varianta 1: Sledování Docker Image (Doporučeno)

1. V Railway projektu:
   - Jdi do **Settings** → **Service**
   - V **Image** nastav: `ghcr.io/pet84/librechat:prod`
   - V **Registry** nastav: `ghcr.io`
   - V **Username** nastav: `pet84`
   - V **Password** nastav: GitHub Personal Access Token (PAT) s oprávněním `read:packages`

2. Railway automaticky:
   - Sleduje image `ghcr.io/pet84/librechat:prod`
   - Při novém buildu automaticky redeployuje

#### Varianta 2: Sledování GitHub Repo

1. V Railway projektu:
   - Připoj GitHub repo
   - Railway automaticky buildí při push do `main` větve
   - Použij Dockerfile z root adresáře

### GitHub Personal Access Token (pro Variantu 1):

1. Jdi na: https://github.com/settings/tokens
2. Vytvoř nový token s oprávněním: `read:packages`
3. Použij ho v Railway jako password pro GHCR

### Testování:

1. Pushni změny do `main` větve:
   ```bash
   git checkout main
   git merge update-to-upstream
   git push origin main
   ```

2. GitHub Actions automaticky:
   - Buildí image
   - Pushuje `ghcr.io/pet84/librechat:prod`

3. Railway automaticky:
   - Detekuje nový image
   - Redeployuje službu

### Manuální trigger:

Workflow můžeš spustit manuálně v GitHub Actions:
- Jdi do **Actions** → **📦 Sestavit a nahrát image (staging + prod)**
- Klikni **Run workflow**

### Poznámky:

- Image `prod` se buildí při každém push do `main`
- Railway sleduje image a automaticky redeployuje
- Pro manuální redeploy v Railway: **Deployments** → **Redeploy**

