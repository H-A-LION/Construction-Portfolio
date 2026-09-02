from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings
import json

DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}/{settings.DB_NAME}?charset=utf8mb4"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class AnalyticsDB:
    @staticmethod
    def save_event(data):
        """Save tracking event to MySQL"""
        with SessionLocal() as session:
            query = text("""
                INSERT INTO analytics_events 
                (visitor_id, session_id, event_type, event_data, url, referrer, 
                 user_agent, ip, country, city, device_type, browser, os, created_at)
                VALUES 
                (:visitor_id, :session_id, :event_type, :event_data, :url, :referrer,
                 :user_agent, :ip, :country, :city, :device_type, :browser, :os, NOW())
            """)
            
            session.execute(query, {
                'visitor_id': data.get('visitor_id'),
                'session_id': data.get('session_id'),
                'event_type': data.get('event_type'),
                'event_data': json.dumps(data.get('event_data', {})),
                'url': data.get('url'),
                'referrer': data.get('referrer'),
                'user_agent': data.get('user_agent'),
                'ip': data.get('ip'),
                'country': data.get('country'),
                'city': data.get('city'),
                'device_type': data.get('device_type'),
                'browser': data.get('browser'),
                'os': data.get('os')
            })
            session.commit()
    
    @staticmethod
    def get_overview_stats(days=30):
        with SessionLocal() as session:
            total_visits = session.execute(
                text("SELECT COUNT(*) FROM analytics_events WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)"),
                {'days': days}
            ).scalar() or 0
            
            unique_visitors = session.execute(
                text("SELECT COUNT(DISTINCT visitor_id) FROM analytics_events WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)"),
                {'days': days}
            ).scalar() or 0
            
            returning = session.execute(
                text("""
                    SELECT COUNT(*) FROM (
                        SELECT visitor_id, COUNT(*) as visits 
                        FROM analytics_events 
                        WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                        GROUP BY visitor_id 
                        HAVING visits > 1
                    ) as returning_visitors
                """),
                {'days': days}
            ).scalar() or 0
            
            return {
                'total_visits': total_visits,
                'unique_visitors': unique_visitors,
                'returning_visitors': returning,
                'time_range': f"Last {days} days"
            }
    
    @staticmethod
    def get_traffic_sources(days=30):
        with SessionLocal() as session:
            results = session.execute(
                text("""
                    SELECT 
                        CASE 
                            WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
                            WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
                            WHEN referrer LIKE '%github%' THEN 'GitHub'
                            WHEN referrer LIKE '%google%' THEN 'Google'
                            WHEN referrer LIKE '%twitter%' OR referrer LIKE '%x.com%' THEN 'Twitter/X'
                            WHEN referrer LIKE '%facebook%' THEN 'Facebook'
                            WHEN referrer LIKE '%youtube%' THEN 'YouTube'
                            ELSE 'Other'
                        END as source,
                        COUNT(*) as visits,
                        COUNT(DISTINCT visitor_id) as unique_visitors
                    FROM analytics_events 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                    GROUP BY source
                    ORDER BY visits DESC
                """),
                {'days': days}
            ).fetchall()
            
            return [{'source': row[0], 'visits': row[1], 'unique_visitors': row[2]} for row in results]
    
    @staticmethod
    def get_geolocation(days=30):
        with SessionLocal() as session:
            results = session.execute(
                text("""
                    SELECT 
                        country,
                        COUNT(*) as visits,
                        COUNT(DISTINCT visitor_id) as unique_visitors
                    FROM analytics_events 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                        AND country IS NOT NULL 
                        AND country != 'Unknown'
                    GROUP BY country
                    ORDER BY visits DESC
                    LIMIT 20
                """),
                {'days': days}
            ).fetchall()
            
            return [{'country': row[0], 'visits': row[1], 'unique_visitors': row[2]} for row in results]
    
    @staticmethod
    def get_device_breakdown(days=30):
        with SessionLocal() as session:
            devices = session.execute(
                text("""
                    SELECT 
                        device_type,
                        COUNT(*) as visits,
                        COUNT(DISTINCT visitor_id) as unique_visitors
                    FROM analytics_events 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                        AND device_type IS NOT NULL
                    GROUP BY device_type
                    ORDER BY visits DESC
                """),
                {'days': days}
            ).fetchall()
            
            browsers = session.execute(
                text("""
                    SELECT 
                        browser,
                        COUNT(*) as visits,
                        COUNT(DISTINCT visitor_id) as unique_visitors
                    FROM analytics_events 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                        AND browser IS NOT NULL
                    GROUP BY browser
                    ORDER BY visits DESC
                    LIMIT 10
                """),
                {'days': days}
            ).fetchall()
            
            os_data = session.execute(
                text("""
                    SELECT 
                        os,
                        COUNT(*) as visits,
                        COUNT(DISTINCT visitor_id) as unique_visitors
                    FROM analytics_events 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                        AND os IS NOT NULL
                    GROUP BY os
                    ORDER BY visits DESC
                    LIMIT 10
                """),
                {'days': days}
            ).fetchall()
            
            return {
                'devices': [{'type': row[0], 'visits': row[1], 'unique_visitors': row[2]} for row in devices],
                'browsers': [{'browser': row[0], 'visits': row[1], 'unique_visitors': row[2]} for row in browsers],
                'os': [{'os': row[0], 'visits': row[1], 'unique_visitors': row[2]} for row in os_data]
            }