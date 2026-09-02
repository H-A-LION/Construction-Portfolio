import httpx

class GeoService:
    @staticmethod
    async def get_geolocation(ip):
        try:
            if ip in ['127.0.0.1', 'localhost', '::1'] or ip.startswith('192.168.') or ip.startswith('10.'):
                return {'country': 'Local', 'city': 'Local'}
            
            async with httpx.AsyncClient(timeout=3.0) as client:
                response = await client.get(f"http://ip-api.com/json/{ip}")
                data = response.json()
                
                if data.get('status') == 'success':
                    return {
                        'country': data.get('country', 'Unknown'),
                        'city': data.get('city', 'Unknown')
                    }
                return {'country': 'Unknown', 'city': 'Unknown'}
        except:
            return {'country': 'Unknown', 'city': 'Unknown'}