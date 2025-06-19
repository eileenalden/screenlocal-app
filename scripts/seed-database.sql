-- ScreenLocal Database Seed Data
-- Run this after initial table creation to populate development data

-- Insert Oakland organization
INSERT INTO organizations (name, slug, city, state, brand_name, hero_title, hero_subtitle, primary_color, is_active) VALUES
('Oakland/East Bay Film Hub', 'oakland-eastbay', 'Oakland', 'CA', 'Oakland/East Bay', 'Your Oakland/East Bay Film Production Matchmaker', 'Connect with locations, talent, and services specifically for Oakland filmmakers', '#ea580c', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample resources with realistic Oakland data
INSERT INTO resources (organization_id, provider_id, type, title, description, category, images, price_per_day, price_type, location, amenities, equipment, specialties, rating, review_count, is_active) VALUES
-- Locations
(1, 1, 'location', 'Victorian House in Oakland Hills', 'Stunning 1890s Victorian with original hardwood floors, ornate moldings, and panoramic bay views. Perfect for period dramas or upscale contemporary scenes.', 'house', 
ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800'], 
400.00, 'day', 'Oakland Hills', 
ARRAY['parking', 'wifi', 'kitchen_access', 'multiple_rooms'], 
ARRAY[], ARRAY['period_drama', 'luxury_interior'], 4.8, 12, true),

(1, 2, 'location', 'Industrial Warehouse in West Oakland', 'Raw 5000 sq ft warehouse with exposed brick, high ceilings, and loading dock. Ideal for music videos, fashion shoots, or gritty urban scenes.', 'warehouse', 
ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800'], 
600.00, 'day', 'West Oakland', 
ARRAY['loading_dock', 'high_ceilings', 'parking', 'power_outlets'], 
ARRAY[], ARRAY['music_video', 'urban_scenes', 'fashion'], 4.5, 8, true),

(1, 3, 'location', 'Classic American Diner', 'Authentic 1950s diner with red vinyl booths, chrome fixtures, and neon signage. Operating restaurant available for filming during off-hours.', 'restaurant', 
ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=800'], 
350.00, 'day', 'Downtown Oakland', 
ARRAY['authentic_props', 'kitchen_access', 'neon_signage'], 
ARRAY[], ARRAY['period_piece', 'americana', 'commercial'], 4.9, 15, true),

-- Crew
(1, 4, 'crew', 'Sarah Chen - Director of Photography', 'Award-winning DP with 8+ years experience in narrative and commercial work. Specializes in natural lighting and handheld cinematography.', 'cinematography', 
ARRAY['https://images.unsplash.com/photo-1594736797933-d0b22d6cddef?auto=format&fit=crop&w=400'], 
800.00, 'day', 'Berkeley', 
ARRAY[], ARRAY['RED_cameras', 'lighting_package', 'gimbal_systems'], ARRAY['narrative', 'commercial', 'natural_lighting'], 4.9, 22, true),

(1, 5, 'crew', 'Marcus Johnson - Sound Engineer', 'Professional location sound recordist with expertise in dialogue recording and ambient sound design. 15+ years in film and television.', 'sound', 
ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400'], 
500.00, 'day', 'Oakland', 
ARRAY[], ARRAY['boom_poles', 'wireless_mics', 'field_recorders'], ARRAY['dialogue', 'ambient_sound', 'post_sync'], 4.7, 18, true),

-- Talent
(1, 6, 'talent', 'Elena Rodriguez', 'Experienced actress with theater background and on-camera training. Fluent in English and Spanish. Available for lead and supporting roles.', 'actor', 
ARRAY['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400'], 
300.00, 'day', 'San Francisco Bay Area', 
ARRAY[], ARRAY[], ARRAY['bilingual', 'theater_trained', 'improvisation'], 4.6, 9, true),

(1, 7, 'talent', 'David Kim', 'Character actor with 20+ years experience in indie films and commercials. Known for authentic portrayals of working-class characters.', 'actor', 
ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400'], 
450.00, 'day', 'Oakland', 
ARRAY[], ARRAY[], ARRAY['character_work', 'commercial', 'working_class_roles'], 4.8, 14, true),

-- Services
(1, 8, 'service', 'Bay Area Equipment Rentals', 'Full-service camera and lighting rental house serving the Bay Area film community. Same-day delivery available in Oakland.', 'equipment_rental', 
ARRAY['https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=800'], 
200.00, 'day', 'Oakland', 
ARRAY['delivery', 'technical_support', 'insurance_included'], 
ARRAY['RED_cameras', 'ARRI_lighting', 'audio_equipment', 'grip_gear'], ARRAY['camera_rental', 'lighting_rental'], 4.7, 25, true),

(1, 9, 'service', 'Golden Gate Post Production', 'Professional editing and color grading services. Experienced in narrative features, documentaries, and commercial work.', 'post_production', 
ARRAY['https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=800'], 
150.00, 'hour', 'Berkeley', 
ARRAY['color_suite', 'audio_mixing', 'client_lounge'], 
ARRAY['Avid_Media_Composer', 'DaVinci_Resolve', 'Pro_Tools'], ARRAY['editing', 'color_grading', 'audio_post'], 4.8, 31, true)

ON CONFLICT (id) DO NOTHING;

-- To run this seed script:
-- 1. Execute: npm run db:push (to ensure tables exist)
-- 2. Run this SQL file through the database tool or copy sections into the SQL tool
-- 
-- Data includes:
-- - 1 Oakland organization
-- - 9 placeholder providers  
-- - 9 realistic resources (3 locations, 2 crew, 2 talent, 2 services)
-- - All with authentic Oakland/East Bay details and pricing