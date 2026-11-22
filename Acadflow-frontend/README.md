# AcadFlow â€” How to Run

Complete setup for running the app and testing the photo/PDF timetable importer.

## 0. Clone both repositories

```powershell
git clone https://github.com/jojiver/acadflow-frontend.git
git clone https://github.com/jojiver/LARAVEL-BACKEND-ACADFLOW.git acadflow-backend-laravel
```

Run the remaining commands from the folder that contains both cloned folders.

## 1. Start Docker Desktop

Open Docker Desktop and wait until it shows **Running**.

Verify Docker is ready:

```powershell
docker info
```

## 2. One-time backend setup

Skip this if `.env` and `database\database.sqlite` already exist.

```powershell
cd acadflow-backend-laravel
copy .env.example .env
New-Item -ItemType File -Path database\database.sqlite -Force
```

Generate an `APP_KEY` and paste it into `.env` as `APP_KEY=...`:

```powershell
docker compose run --rm api php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

## 3. Start the Laravel backend

```powershell
cd acadflow-backend-laravel
docker compose up -d --build
```

Wait a few seconds, then check:

```powershell
docker compose ps
Invoke-RestMethod http://localhost:7000/api/health
```

Expected:

```json
{ "status": "ok", "app": "AcadFlow API" }
```

The container runs migrations and seeds the demo data automatically.

If needed:

```powershell
docker compose exec api php artisan migrate --force
docker compose exec api php artisan db:seed --force
```

## 4. Start the frontend

```powershell
cd acadflow-frontend\Acadflow-frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Vite proxies `/api` to Laravel on port `7000`, so no frontend API configuration is needed locally.

## 5. Log in

```text
Email:    alex@acadflow.test
Password: Password123
```

## 6. Test photo/PDF import

1. Go to **Schedule**
2. Click **Import schedule**
3. Drop a timetable file

Supported files:

- PDF
- JPG / JPEG
- PNG
- Maximum 10 MB
- HEIC from iPhone is not supported; convert to JPG first

Wait for OCR, then:

- Review detected classes
- Edit the **Subject** field if a code is wrong
- Untick incorrect rows
- Click **Confirm import**
- Open **Schedule** and **Calendar** to verify

## 7. Verify OCR is working

```powershell
cd acadflow-backend-laravel
docker compose exec api tesseract --version
docker compose exec api php -m | findstr gd
```

Both must return output. The Docker image includes:

- Tesseract OCR
- Poppler (`pdftotext`, `pdftoppm`)
- GD image extension

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| Frontend wonâ€™t open | Make sure `npm run dev` is running on port `5173` |
| Login fails | Check `http://localhost:7000/api/health`; use `localhost` |
| Upload says OCR unavailable | Rebuild the backend: `docker compose up -d --build` |
| Upload fails immediately | Use PDF/JPG/PNG under 10 MB; HEIC is unsupported |
| No classes detected | Use a clearer, straight photo with the header visible |
| CORS/login cookie issue | Open `http://localhost:5173`, not a LAN IP |
| Backend errors | `docker compose logs -f api` |

## 9. Let a groupmate use it on the same Wi-Fi

On your PC:

```powershell
cd acadflow-frontend\Acadflow-frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

Find your IPv4 address:

```powershell
ipconfig
```

Allow **Node.js** through Windows Firewall for Private networks.

Your groupmate opens:

```text
http://YOUR-LAN-IP:5173
```

Your Laravel Docker container stays running on your PC; Vite proxies `/api` for them.

## 10. Stop everything

Frontend: press `Ctrl + C` in the Vite terminal.

Backend:

```powershell
cd acadflow-backend-laravel
docker compose down
```

