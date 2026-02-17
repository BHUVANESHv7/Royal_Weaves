import json
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os

app = FastAPI()

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Load data
def load_data():
    with open("data/products.json", "r") as f:
        return json.load(f)

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    data = load_data()
    return templates.TemplateResponse("index.html", {
        "request": request,
        "products": data["products"],
        "categories": data["categories"]
    })

@app.get("/product/{product_id}", response_class=HTMLResponse)
async def read_product(request: Request, product_id: str):
    data = load_data()
    product = next((p for p in data["products"] if p["id"] == product_id), None)
    return templates.TemplateResponse("product.html", {
        "request": request,
        "product": product
    })

@app.get("/cart", response_class=HTMLResponse)
async def read_cart(request: Request):
    return templates.TemplateResponse("cart.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
