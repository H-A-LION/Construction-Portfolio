from fastapi import APIRouter, Request, HTTPException, Header
from app.models.database import AnalyticsDB
from app.services.fingerprint import FingerprintService
from app.services.geo import GeoService
from app.config.settings import settings

router = APIRouter()

@router.post("/track")
async def track_event(request: Request, x_internal_auth: str = Header(...)):
    if x_internal_auth != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        data = await request.json()
        client_ip = request.client.host
        user_agent = request.headers.get('user-agent', '')
        
        # Parse user agent
        ua_data = FingerprintService.parse_user_agent(user_agent)
        
        # Generate visitor ID
        visitor_id = FingerprintService.generate_visitor_id(
            data.get('visitorId'),
            client_ip,
            user_agent
        )
        
        # Get geolocation
        geo_data = await GeoService.get_geolocation(client_ip)
        
        # Save event
        AnalyticsDB.save_event({
            'visitor_id': visitor_id,
            'session_id': data.get('sessionId'),
            'event_type': data.get('eventType'),
            'event_data': data.get('eventData', {}),
            'url': data.get('url'),
            'referrer': data.get('referrer'),
            'user_agent': user_agent,
            'ip': client_ip,
            'country': geo_data.get('country'),
            'city': geo_data.get('city'),
            'device_type': ua_data.get('device_type'),
            'browser': ua_data.get('browser'),
            'os': ua_data.get('os')
        })
        
        return {"success": True, "visitor_id": visitor_id}
        
    except Exception as e:
        print(f"Tracking error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "analytics"}