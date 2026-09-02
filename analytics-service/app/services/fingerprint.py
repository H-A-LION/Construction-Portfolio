import hashlib
import user_agents
import os

class FingerprintService:
    @staticmethod
    def generate_visitor_id(frontend_id, ip, user_agent):
        if frontend_id:
            return frontend_id
        
        salt = os.getenv('FINGERPRINT_SALT', 'default-salt')
        combined = f"{ip}|{user_agent}|{salt}"
        return hashlib.sha256(combined.encode()).hexdigest()
    
    @staticmethod
    def parse_user_agent(user_agent_str):
        try:
            ua = user_agents.parse(user_agent_str)
            
            device_type = 'desktop'
            if ua.is_mobile:
                device_type = 'mobile'
            elif ua.is_tablet:
                device_type = 'tablet'
            
            browser = ua.browser.family if ua.browser else 'Unknown'
            os_name = f"{ua.os.family} {ua.os.version_string}" if ua.os else 'Unknown'
            
            return {
                'device_type': device_type,
                'browser': browser,
                'os': os_name
            }
        except:
            return {
                'device_type': 'unknown',
                'browser': 'Unknown',
                'os': 'Unknown'
            }