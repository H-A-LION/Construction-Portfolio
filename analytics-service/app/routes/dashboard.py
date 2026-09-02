from fastapi import APIRouter, HTTPException, Header, Query
from app.models.database import AnalyticsDB
from app.config.settings import settings

router = APIRouter()

@router.get("/overview")
async def get_overview(x_internal_auth: str = Header(...), days: int = Query(30)):
    if x_internal_auth != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return AnalyticsDB.get_overview_stats(days)

@router.get("/traffic-sources")
async def get_traffic_sources(x_internal_auth: str = Header(...), days: int = Query(30)):
    if x_internal_auth != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return AnalyticsDB.get_traffic_sources(days)

@router.get("/geolocation")
async def get_geolocation(x_internal_auth: str = Header(...), days: int = Query(30)):
    if x_internal_auth != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return AnalyticsDB.get_geolocation(days)

@router.get("/device-breakdown")
async def get_device_breakdown(x_internal_auth: str = Header(...), days: int = Query(30)):
    if x_internal_auth != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return AnalyticsDB.get_device_breakdown(days)

@router.get("/unique-vs-returning")
async def get_unique_vs_returning(x_internal_auth: str = Header(...), days: int = Query(30)):
    if x_internal_auth != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    stats = AnalyticsDB.get_overview_stats(days)
    total = stats['unique_visitors']
    returning = stats['returning_visitors']
    
    return {
        'unique_visitors': total,
        'returning_visitors': returning,
        'new_visitors': total - returning,
        'returning_percentage': round((returning / total * 100) if total > 0 else 0, 2)
    }