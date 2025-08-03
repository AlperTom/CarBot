# CarBot Scaffold

## Integration

1. Entferne alte Ordner:
   ```bash
   rm -rf app/ components/ lib/ utils/ public/
   ```
2. Kopiere Scaffold:
   ```bash
   cp -r CarBotScaffold/* ./
   ```
3. Installiere Dependencies:
   ```bash
   npm install
   ```
4. .env kopieren:
   ```bash
   cp .env.example .env.local
   ```
5. Entwicklung starten:
   ```bash
   npm run dev
   ```