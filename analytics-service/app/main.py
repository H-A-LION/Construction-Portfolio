from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import tracking, dashboard
from app.config.settings import settings

app = FastAPI(title="Analytics Microservice", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(tracking.router, prefix="/api/analytics", tags=["tracking"])
app.include_router(dashboard.router, prefix="/api/analytics/admin", tags=["dashboard"])

@app.get("/")
async def root():
    return {"service": "Analytics Microservice", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.SERVICE_PORT)