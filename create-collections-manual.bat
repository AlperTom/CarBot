@echo off
echo Creating Directus Collections manually...
echo.

echo Step 1: Login and get access token
curl -X POST "http://localhost:8055/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"alper.tombulca@web.de\",\"password\":\"CarBot2024!\"}" ^
  -o token.json

echo.
echo Step 2: Please check token.json file for your access token
echo Then use it in Directus admin interface to create collections manually
echo.

echo Manual steps:
echo 1. Go to http://localhost:8055
echo 2. Login with your credentials
echo 3. Click "+" next to Collections
echo 4. Create these collections one by one:
echo.
echo ✅ SERVICES Collection:
echo   - name (Text, required)
echo   - slug (Text)
echo   - description (Rich Text)
echo   - category (Dropdown: TÜV^&HU, Inspektion, Reparaturen, Wartung, Reifenservice, Elektrik, Klimaservice, Karosserie)
echo   - price_from (Decimal)
echo   - price_to (Decimal)
echo   - duration_minutes (Integer)
echo   - image (File)
echo.
echo ✅ BLOG_POSTS Collection:
echo   - title (Text, required)
echo   - slug (Text)
echo   - excerpt (Textarea)
echo   - content (Rich Text)
echo   - featured_image (File)
echo   - author (Text)
echo   - published_date (DateTime)
echo.
echo ✅ FAQS Collection:
echo   - question (Textarea, required)
echo   - answer (Rich Text, required)
echo   - category (Dropdown: Allgemein, TÜV^&HU, Reparaturen, Wartung, Preise)
echo   - language (Dropdown: de, en, tr, pl)
echo.
echo ✅ TESTIMONIALS Collection:
echo   - customer_name (Text, required)
echo   - customer_company (Text)
echo   - rating (Integer: 1-5)
echo   - testimonial_text (Textarea, required)
echo   - customer_photo (File)
echo.

pause