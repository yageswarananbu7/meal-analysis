# 🍎 Hill Calories AI — Meal Analysis App

A simple web app that lets you upload a photo of your meal and get back an instant nutrition breakdown — calories, protein, carbs, and fat. I built this to explore how far I could get with image-based food analysis using a Flask backend, without relying on a heavy pre-trained model.

## What it does

You upload a photo of your food through the browser, and the app:

1. Saves the image temporarily on the server
2. Analyzes the image's color and size characteristics (reds, greens, brightness, dimensions, etc.)
3. Uses those characteristics to simulate food detection — for example, a red-dominant image is more likely to be tagged as tomato/apple/protein, while a light, bright image leans toward rice, pasta, or dairy
4. Looks up the detected foods in a built-in nutrition database and adds a small randomized variation to make the numbers feel more realistic
5. Returns a clean nutrition summary (calories, protein, carbs, fat) along with the list of detected foods
6. Deletes the uploaded image right after analysis — nothing is stored permanently

It's not a trained computer vision model — it's a rule-based simulation of one, built around color/size heuristics. I wanted to first nail the full pipeline (upload → process → analyze → display → clean up) before layering in a real ML model later.

## Tech Stack

- **Backend:** Flask (Python)
- **Image processing:** Pillow, NumPy
- **Frontend:** HTML, CSS, JavaScript (drag-and-drop image upload, live preview, animated results)
- **Deployment:** Gunicorn-ready with a separate WSGI entry point

## Project Structure

```
meal analysis/
├── app.py                  # Flask routes: upload, analyze, health check
├── models/
│   └── nutrition_model.py  # Food detection simulation + nutrition lookup
├── templates/
│   └── index.html          # Upload UI and results display
├── static/
│   ├── css/
│   └── js/
├── uploads/
│   └── requirements.txt
└── Deployment Setup/
    └── wsgi.py
```

## Running it locally

```bash
git clone https://github.com/yageswarananbu7/meal-analysis.git
cd meal-analysis/"meal analysis"
pip install -r uploads/requirements.txt
python app.py
```

Then open `http://localhost:5000` in your browser, upload a food photo (JPG, PNG, or GIF), and hit analyze.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Serves the upload UI |
| `/analyze` | POST | Accepts an image file, returns nutrition data as JSON |
| `/health` | GET | Basic health check for deployment monitoring |

## What I'd improve next

- Swap the color-heuristic detection for a real trained image classification model (e.g. a fine-tuned CNN or a food-recognition API)
- Expand the nutrition database to cover more food items and portion sizes
- Add user accounts so people can track meals over time instead of a one-off analysis
- Store analysis history instead of deleting the image right after processing

## Why I built this

I wanted a project that combined image handling, a Flask API, and a "smart-feeling" feature end-to-end — something that looks and works like a real product, even while the underlying detection logic is intentionally simple for now. It's a good base to eventually plug in an actual ML model without having to redo the app around it.
