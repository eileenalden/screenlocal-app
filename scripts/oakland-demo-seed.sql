-- Oakland Demo Seed Data for ScreenLocal
-- Comprehensive film industry resources for Oakland city
-- This script matches the current database schema structure

-- Clear existing demo resources
DELETE FROM resources WHERE organization_id = 1;

-- LOCATIONS (12 authentic Oakland locations)
INSERT INTO resources (organization_id, provider_id, type, title, description, category, images, price_per_day, price_type, location, amenities, equipment, specialties, rating, review_count, is_active) VALUES

-- Historic/Period Locations
(1, 1, 'location', 'Paramount Theatre - Art Deco Masterpiece', 
 'Stunning 1931 Art Deco theatre in downtown Oakland. Original marquee, ornate interior with gold leaf details, 3,000-seat auditorium. Perfect for period pieces, music videos, and elegant event scenes.', 
 'theatre', 
 ARRAY['https://images.unsplash.com/photo-1518894781321-630e638d0742', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf'],
 2500.00, 'day', 'Oakland, CA (Downtown)', 
 ARRAY['marquee', 'interior_access', 'stage', 'auditorium', 'backstage', 'parking'], 
 ARRAY['sound_system', 'lighting_grid', 'dressing_rooms'], 
 ARRAY['historic', 'art_deco', 'period', 'elegant', 'downtown'], 
 4.9, 15, true),

(1, 1, 'location', 'Victorian Mansion - Preservation Park', 
 'Authentic 1880s Victorian mansion with period furnishings, wraparound porch, and manicured gardens. Features original hardwood floors, stained glass windows, and vintage wallpapers.', 
 'house', 
 ARRAY['https://images.unsplash.com/photo-1572120360610-d971b9d7767c', 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be'],
 1800.00, 'day', 'Oakland, CA (Downtown)', 
 ARRAY['period_furnishings', 'gardens', 'multiple_rooms', 'porch', 'parking'], 
 ARRAY[], 
 ARRAY['victorian', 'historic', 'period', 'interior', 'exterior', 'authentic'], 
 4.8, 12, true),

(1, 1, 'location', 'Craftsman Bungalow - Rockridge', 
 'Beautiful 1920s Craftsman home with original built-ins, exposed beam ceilings, and vintage fixtures. Charming front porch, mature landscaping, perfect for residential scenes.', 
 'house', 
 ARRAY['https://images.unsplash.com/photo-1449844908441-8829872d2607', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90'],
 1200.00, 'day', 'Oakland, CA (Rockridge)', 
 ARRAY['built_ins', 'front_porch', 'landscaping', 'parking', 'kitchen_access'], 
 ARRAY[], 
 ARRAY['craftsman', 'bungalow', 'residential', 'vintage', 'rockridge'], 
 4.7, 18, true),

-- Industrial/Urban Locations  
(1, 2, 'location', 'West Oakland Industrial Warehouse', 
 'Massive 15,000 sq ft warehouse with 25-foot ceilings, concrete floors, and excellent natural light. Drive-in access, ample parking, perfect for commercials, music videos, and large productions.', 
 'warehouse', 
 ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13'],
 2200.00, 'day', 'Oakland, CA (West Oakland)', 
 ARRAY['drive_in_access', 'high_ceilings', 'ample_parking', 'loading_dock', 'power_outlets'], 
 ARRAY[], 
 ARRAY['warehouse', 'industrial', 'concrete', 'large_space', 'natural_light'], 
 4.6, 22, true),

(1, 2, 'location', 'Jack London Square Waterfront', 
 'Iconic waterfront location with San Francisco skyline views, wooden boardwalks, marina, and vintage warehouses. Multiple angles available, including pier access and indoor/outdoor options.', 
 'outdoor', 
 ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'https://images.unsplash.com/photo-1485846234645-a62644f84728'],
 1600.00, 'day', 'Oakland, CA (Jack London Square)', 
 ARRAY['skyline_views', 'boardwalk', 'marina', 'pier_access', 'parking'], 
 ARRAY[], 
 ARRAY['waterfront', 'marina', 'skyline', 'iconic', 'scenic'], 
 4.8, 31, true),

(1, 2, 'location', 'Uptown Art Deco Office Building', 
 'Renovated 1920s office building with original terrazzo floors, brass elevators, and geometric details. Features both modern offices and vintage common areas with period lighting.', 
 'office', 
 ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', 'https://images.unsplash.com/photo-1497366216548-37526070297c'],
 1400.00, 'day', 'Oakland, CA (Uptown)', 
 ARRAY['terrazzo_floors', 'brass_elevators', 'modern_offices', 'vintage_areas', 'parking'], 
 ARRAY[], 
 ARRAY['office', 'art_deco', 'uptown', 'period', 'vintage'], 
 4.5, 14, true),

-- Restaurants/Retail
(1, 3, 'location', 'Classic American Diner - Grand Lake', 
 'Authentic 1950s diner with red vinyl booths, chrome fixtures, checkered floors, and neon signs. Fully operational kitchen, jukebox, and classic soda fountain. Available after hours.', 
 'restaurant', 
 ARRAY['https://images.unsplash.com/photo-1571091718767-18b5b1457add', 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2'],
 1100.00, 'day', 'Oakland, CA (Grand Lake)', 
 ARRAY['vinyl_booths', 'operational_kitchen', 'jukebox', 'soda_fountain', 'after_hours'], 
 ARRAY['kitchen_equipment', 'sound_system'], 
 ARRAY['diner', 'retro', '1950s', 'chrome', 'neon', 'authentic'], 
 4.7, 25, true),

(1, 3, 'location', 'Temescal Alley Boutique Space', 
 'Trendy retail space in hip Temescal district. Exposed brick walls, Edison bulb lighting, large windows, and curated vintage displays. Perfect for fashion shoots and contemporary scenes.', 
 'retail', 
 ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8', 'https://images.unsplash.com/photo-1524738258074-f8125c6a7588'],
 800.00, 'day', 'Oakland, CA (Temescal)', 
 ARRAY['exposed_brick', 'large_windows', 'vintage_displays', 'street_access'], 
 ARRAY['edison_lighting'], 
 ARRAY['retail', 'boutique', 'temescal', 'trendy', 'fashion', 'contemporary'], 
 4.6, 19, true),

-- Outdoor/Nature
(1, 1, 'location', 'Redwood Regional Park', 
 'Majestic redwood groves with hiking trails, creeks, and dappled sunlight. Multiple locations within park including meadows, dense forest, and creek beds. Permit coordination included.', 
 'outdoor', 
 ARRAY['https://images.unsplash.com/photo-1441974231531-c6227db76b6e', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b'],
 600.00, 'day', 'Oakland, CA (Oakland Hills)', 
 ARRAY['hiking_trails', 'creek_access', 'meadows', 'permit_included', 'multiple_locations'], 
 ARRAY[], 
 ARRAY['redwoods', 'forest', 'nature', 'hiking', 'creek', 'outdoor', 'natural'], 
 4.9, 42, true),

(1, 1, 'location', 'Lake Merritt Boathouse', 
 'Historic 1920s boathouse with panoramic lake views, wooden docks, and classic architecture. Includes both interior spaces and waterfront access. Popular for romantic and scenic shots.', 
 'outdoor', 
 ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
 1300.00, 'day', 'Oakland, CA (Lake Merritt)', 
 ARRAY['panoramic_views', 'wooden_docks', 'interior_access', 'waterfront', 'parking'], 
 ARRAY[], 
 ARRAY['boathouse', 'lake', 'historic', 'waterfront', 'romantic', 'scenic'], 
 4.8, 33, true),

-- Residential Modern
(1, 1, 'location', 'Mid-Century Modern - Oakland Hills', 
 'Stunning 1960s architect-designed home with floor-to-ceiling windows, clean lines, and breathtaking bay views. Features original period furniture and minimalist aesthetic.', 
 'house', 
 ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'https://images.unsplash.com/photo-1484154218962-a197022b5858'],
 2000.00, 'day', 'Oakland, CA (Oakland Hills)', 
 ARRAY['floor_to_ceiling_windows', 'bay_views', 'period_furniture', 'minimalist', 'parking'], 
 ARRAY[], 
 ARRAY['mid_century', 'modern', 'architect', 'bay_views', 'minimalist', 'period'], 
 4.9, 28, true),

(1, 1, 'location', 'Fruitvale Adobe Historic Home', 
 'Rare 1850s adobe structure with thick walls, wooden beam ceilings, and period courtyard. One of Oakland''s oldest buildings, perfect for Western or historical productions.', 
 'house', 
 ARRAY['https://images.unsplash.com/photo-1449844908441-8829872d2607', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add'],
 1500.00, 'day', 'Oakland, CA (Fruitvale)', 
 ARRAY['thick_walls', 'wooden_beams', 'courtyard', 'historic_significance'], 
 ARRAY[], 
 ARRAY['adobe', 'historic', '1850s', 'western', 'rare', 'period'], 
 4.7, 16, true);

-- CREW MEMBERS (15 professional Oakland/Bay Area crew)
INSERT INTO resources (organization_id, provider_id, type, title, description, category, images, price_per_day, price_type, location, amenities, equipment, specialties, rating, review_count, is_active) VALUES

-- Camera Department
(1, 4, 'crew', 'Maria Santos - Director of Photography', 
 'Award-winning DP with 12+ years experience in narrative features and commercials. RED and ARRI certified, owns full camera package. Credits include Sundance selections and national commercials. Bilingual (English/Spanish).', 
 'camera', 
 ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
 1000.00, 'day', 'Oakland, CA', 
 ARRAY['RED_certified', 'ARRI_certified', 'bilingual', 'award_winning', 'sundance_credits'], 
 ARRAY['RED_camera', 'ARRI_package', 'full_lens_set', 'monitors'], 
 ARRAY['cinematographer', 'dp', 'narrative', 'commercial', 'bilingual'], 
 4.9, 45, true),

(1, 4, 'crew', 'James Chen - Camera Operator/Steadicam', 
 'Specialist in handheld and Steadicam work with extensive music video and action sequence experience. 15+ years in Bay Area film industry, owns professional Steadicam rig.', 
 'camera', 
 ARRAY['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'],
 760.00, 'day', 'Berkeley, CA', 
 ARRAY['steadicam_specialist', 'handheld_expert', 'music_video_experience', 'action_sequences'], 
 ARRAY['steadicam_rig', 'handheld_package', 'wireless_monitor'], 
 ARRAY['camera_operator', 'steadicam', 'handheld', 'music_video', 'action'], 
 4.8, 38, true),

-- Sound Department  
(1, 5, 'crew', 'Alex Rodriguez - Sound Mixer', 
 'Location sound specialist with Sound Devices 833 package, extensive boom and wireless mic inventory. 10+ years recording for features, documentaries, and corporate videos in Bay Area.', 
 'sound', 
 ARRAY['https://images.unsplash.com/photo-1560472354-b33ff0c44a43'],
 680.00, 'day', 'Oakland, CA', 
 ARRAY['location_specialist', 'sound_devices_833', 'documentary_experience', 'corporate_experience'], 
 ARRAY['sound_devices_833', 'boom_poles', 'wireless_mics', 'monitoring'], 
 ARRAY['sound_mixer', 'location_sound', 'boom', 'wireless', 'documentary'], 
 4.7, 52, true),

(1, 5, 'crew', 'Sarah Kim - Boom Operator', 
 'Professional boom operator with extensive narrative and commercial experience. Expert in difficult recording environments, owns professional boom equipment and wireless systems.', 
 'sound', 
 ARRAY['https://images.unsplash.com/photo-1494790108755-2616c0763b5e'],
 520.00, 'day', 'San Francisco, CA', 
 ARRAY['narrative_experience', 'commercial_experience', 'difficult_environments', 'professional_equipment'], 
 ARRAY['boom_equipment', 'wireless_systems', 'windscreens', 'shock_mounts'], 
 ARRAY['boom_operator', 'narrative', 'commercial', 'recording', 'wireless'], 
 4.6, 29, true),

-- Lighting/Grip
(1, 4, 'crew', 'Michael Torres - Gaffer', 
 'Master electrician with 20+ years experience and full lighting truck. Specializes in HMI, LED, and tungsten packages. Available with 3-person electric crew for larger productions.', 
 'lighting', 
 ARRAY['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'],
 880.00, 'day', 'Oakland, CA', 
 ARRAY['master_electrician', '20_years_experience', 'full_truck', 'crew_available'], 
 ARRAY['lighting_truck', 'HMI_package', 'LED_package', 'tungsten_package'], 
 ARRAY['gaffer', 'electrician', 'lighting_truck', 'HMI', 'LED', 'tungsten'], 
 4.9, 67, true),

(1, 4, 'crew', 'David Park - Key Grip', 
 'Experienced key grip with full grip truck and rigging equipment. Specializes in camera movement, lighting support, and complex rigging solutions. Available with grip crew.', 
 'grip', 
 ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
 760.00, 'day', 'Richmond, CA', 
 ARRAY['full_truck', 'rigging_specialist', 'camera_movement', 'crew_available'], 
 ARRAY['grip_truck', 'rigging_equipment', 'dollies', 'cranes'], 
 ARRAY['key_grip', 'grip_truck', 'rigging', 'camera_movement', 'lighting_support'], 
 4.8, 41, true),

-- Production
(1, 4, 'crew', 'Jennifer Lee - Script Supervisor', 
 'Meticulous script supervisor with 8+ years on narrative features and commercials. Expert in continuity, timing, and production coordination. Available for multi-day shoots.', 
 'production', 
 ARRAY['https://images.unsplash.com/photo-1438761681033-6461ffad8d80'],
 600.00, 'day', 'Berkeley, CA', 
 ARRAY['8_years_experience', 'narrative_features', 'commercial_experience', 'multi_day_available'], 
 ARRAY['script_software', 'continuity_photos', 'timing_equipment'], 
 ARRAY['script_supervisor', 'continuity', 'narrative', 'commercial', 'coordination'], 
 4.7, 33, true),

-- Hair/Makeup
(1, 6, 'crew', 'Amanda Johnson - Hair & Makeup Artist', 
 'Professional makeup artist specializing in beauty, character, and special effects makeup. 12+ years experience, full kit included. Expert in period looks and prosthetics.', 
 'hair_makeup', 
 ARRAY['https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb'],
 640.00, 'day', 'Oakland, CA', 
 ARRAY['12_years_experience', 'full_kit', 'period_specialist', 'prosthetics_expert'], 
 ARRAY['full_makeup_kit', 'hair_styling_tools', 'prosthetics', 'airbrush'], 
 ARRAY['makeup_artist', 'hair', 'beauty', 'character', 'special_effects', 'period'], 
 4.8, 56, true);

-- TALENT (12 diverse performers)
INSERT INTO resources (organization_id, provider_id, type, title, description, category, images, price_per_day, price_type, location, amenities, equipment, specialties, rating, review_count, is_active) VALUES

-- Lead Actors
(1, 6, 'talent', 'Elena Rodriguez - Lead Actress', 
 'Bilingual actress (English/Spanish) with extensive theater and film credits. SAG-AFTRA member specializing in dramatic roles. Recent credits include Berkeley Rep and independent features.', 
 'lead', 
 ARRAY['https://images.unsplash.com/photo-1494790108755-2616c0763b5e'],
 800.00, 'day', 'Oakland, CA', 
 ARRAY['bilingual', 'sag_aftra', 'theater_background', 'berkeley_rep', 'independent_features'], 
 ARRAY[], 
 ARRAY['actress', 'lead', 'bilingual', 'spanish', 'dramatic', 'theater', 'SAG_AFTRA'], 
 4.9, 34, true),

(1, 7, 'talent', 'Marcus Williams - Character Actor', 
 'Versatile character actor with 15+ years experience in supporting roles. Expert in dialects and physical comedy. Credits include regional theatre and national commercials.', 
 'supporting', 
 ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
 650.00, 'day', 'San Francisco, CA', 
 ARRAY['15_years_experience', 'dialect_expert', 'physical_comedy', 'regional_theatre', 'national_commercials'], 
 ARRAY[], 
 ARRAY['actor', 'character', 'supporting', 'dialects', 'comedy', 'theatre', 'commercials'], 
 4.7, 42, true),

(1, 6, 'talent', 'Kenji Tanaka - Lead Actor', 
 'Japanese-American actor fluent in English and Japanese. Specializes in contemporary drama and action sequences. Martial arts background, stunt training.', 
 'lead', 
 ARRAY['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'],
 750.00, 'day', 'Berkeley, CA', 
 ARRAY['bilingual', 'martial_arts', 'stunt_training', 'action_specialist', 'drama_specialist'], 
 ARRAY[], 
 ARRAY['actor', 'lead', 'japanese_american', 'bilingual', 'action', 'martial_arts', 'stunts'], 
 4.8, 28, true),

-- Supporting Actors
(1, 6, 'talent', 'Sarah Chen - Supporting Actress', 
 'Chinese-American actress with strong improv and ensemble skills. Graduate of SF State Theatre program. Specializes in comedy and contemporary roles.', 
 'supporting', 
 ARRAY['https://images.unsplash.com/photo-1438761681033-6461ffad8d80'],
 500.00, 'day', 'Oakland, CA', 
 ARRAY['improv_skills', 'ensemble_specialist', 'sf_state_graduate', 'comedy_specialist'], 
 ARRAY[], 
 ARRAY['actress', 'supporting', 'chinese_american', 'improv', 'ensemble', 'comedy'], 
 4.6, 31, true),

-- Voice Over
(1, 7, 'talent', 'Robert Thompson - Voice Over Artist', 
 'Professional voice talent with home studio setup. 20+ years experience in commercials, narration, and character voices. Deep, authoritative delivery.', 
 'voice_over', 
 ARRAY['https://images.unsplash.com/photo-1560472354-b33ff0c44a43'],
 300.00, 'day', 'Richmond, CA', 
 ARRAY['home_studio', '20_years_experience', 'authoritative_delivery', 'character_voices'], 
 ARRAY['home_studio', 'professional_microphone', 'recording_software'], 
 ARRAY['voice_over', 'narration', 'commercials', 'character_voices', 'authoritative'], 
 4.8, 89, true),

(1, 6, 'talent', 'Lisa Park - Voice Over Artist', 
 'Multilingual voice artist (English, Korean, Mandarin) specializing in commercials and animation. Warm, conversational delivery perfect for corporate and educational content.', 
 'voice_over', 
 ARRAY['https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb'],
 275.00, 'day', 'Berkeley, CA', 
 ARRAY['multilingual', 'korean', 'mandarin', 'animation_specialist', 'corporate_specialist'], 
 ARRAY['home_studio', 'multiple_microphones', 'editing_software'], 
 ARRAY['voice_over', 'multilingual', 'korean', 'mandarin', 'animation', 'corporate'], 
 4.7, 64, true);

-- SERVICES (Premium Partners + Production Services)
INSERT INTO resources (organization_id, provider_id, type, title, description, category, images, price_per_day, price_type, location, amenities, equipment, specialties, rating, review_count, is_active) VALUES

-- Premium Partner Services (Featured)
(1, 8, 'service', 'MamaDog Studios',
 'Premium full-service production studio in Oakland. State-of-the-art soundstages, equipment rental, and post-production facilities. Complete production support from pre-production through final delivery.',
 'full_service_studio',
 ARRAY['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17'],
 1500.00, 'day', 'Oakland, CA',
 ARRAY['soundstages', 'equipment_rental', 'post_production', 'full_service', 'premium_facilities'],
 ARRAY['soundstages', 'camera_packages', 'lighting_grid', 'editing_suites', 'audio_mixing'],
 ARRAY['full_service', 'soundstage', 'production_studio', 'premium', 'complete_support'],
 4.9, 127, true),

(1, 8, 'service', 'CielSpace',
 'Boutique creative space and production services in Oakland. Specializes in high-end commercial production, brand content, and creative direction. Modern facilities with artistic vision.',
 'creative_studio',
 ARRAY['https://images.unsplash.com/photo-1524758631624-e2822e304c36', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'],
 1200.00, 'day', 'Oakland, CA',
 ARRAY['boutique_space', 'creative_direction', 'brand_content', 'commercial_specialist', 'artistic_vision'],
 ARRAY['creative_spaces', 'brand_equipment', 'commercial_lighting', 'art_direction_tools'],
 ARRAY['creative_studio', 'boutique', 'commercial', 'brand_content', 'artistic'],
 4.8, 89, true),

-- Equipment Rental
(1, 8, 'service', 'Bay Area Camera Rentals', 
 'Full-service camera and lens rental facility. RED, ARRI, Sony cinema cameras with complete lens packages. Same-day delivery available throughout East Bay. Technical support included.', 
 'equipment_rental', 
 ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a'],
 450.00, 'day', 'Oakland, CA', 
 ARRAY['same_day_delivery', 'technical_support', 'east_bay_delivery', 'complete_packages'], 
 ARRAY['RED_cameras', 'ARRI_cameras', 'Sony_cinema', 'lens_packages', 'delivery_truck'], 
 ARRAY['camera_rental', 'RED', 'ARRI', 'Sony', 'lenses', 'delivery', 'technical_support'], 
 4.8, 73, true),

(1, 8, 'service', 'Oakland Lighting & Grip', 
 'Professional lighting and grip equipment rental. HMI, LED, tungsten packages. Grip trucks, dollies, jibs, and rigging equipment. Experienced delivery crew available.', 
 'equipment_rental', 
 ARRAY['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91'],
 650.00, 'day', 'Oakland, CA', 
 ARRAY['experienced_crew', 'delivery_available', 'rigging_support', 'package_deals'], 
 ARRAY['HMI_lights', 'LED_panels', 'tungsten_lights', 'grip_trucks', 'dollies', 'jibs'], 
 ARRAY['lighting_rental', 'grip', 'HMI', 'LED', 'trucks', 'dollies', 'rigging'], 
 4.7, 58, true),

-- Catering
(1, 3, 'service', 'Golden State Craft Services', 
 'Professional film set catering with focus on healthy, locally-sourced options. Accommodates all dietary restrictions. Full setup, service, and cleanup included.', 
 'craft_services', 
 ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0'],
 350.00, 'day', 'Oakland, CA', 
 ARRAY['dietary_accommodations', 'locally_sourced', 'full_service', 'setup_cleanup'], 
 ARRAY['catering_equipment', 'serving_stations', 'refrigeration'], 
 ARRAY['craft_services', 'catering', 'healthy_options', 'dietary_restrictions', 'local'], 
 4.9, 91, true),

-- Post Production
(1, 9, 'service', 'Golden Gate Post Production', 
 'Professional editing and color grading services. Experienced in narrative features, documentaries, and commercial work. State-of-the-art facility with client lounge.', 
 'post_production', 
 ARRAY['https://images.unsplash.com/photo-1551818255-e6e10975bc17'],
 150.00, 'hour', 'Berkeley, CA', 
 ARRAY['client_lounge', 'state_of_art_facility', 'experienced_editors', 'multiple_suites'], 
 ARRAY['Avid_Media_Composer', 'DaVinci_Resolve', 'Pro_Tools', 'color_suite', 'audio_mixing'], 
 ARRAY['editing', 'color_grading', 'audio_post', 'narrative', 'documentary', 'commercial'], 
 4.8, 47, true),

-- Transportation
(1, 8, 'service', 'Bay Area Film Transport', 
 'Professional transportation services for cast, crew, and equipment. Luxury vans, production trucks, and specialty vehicles available. Licensed, insured, and film-experienced drivers.', 
 'transportation', 
 ARRAY['https://images.unsplash.com/photo-1570125909232-eb263c188f7e'],
 280.00, 'day', 'Oakland, CA', 
 ARRAY['licensed_drivers', 'insured_vehicles', 'film_experienced', 'luxury_options'], 
 ARRAY['luxury_vans', 'production_trucks', 'specialty_vehicles'], 
 ARRAY['transportation', 'cast_crew_transport', 'equipment_transport', 'luxury_vans'], 
 4.6, 35, true),

-- Security
(1, 8, 'service', 'Oakland Set Security', 
 'Professional film set security services. Experienced in location shoots, equipment protection, and crowd control. Available 24/7 with radio communication systems.', 
 'security', 
 ARRAY['https://images.unsplash.com/photo-1559526324-c1f275fbfa32'],
 180.00, 'day', 'Oakland, CA', 
 ARRAY['24_7_available', 'radio_communication', 'crowd_control', 'equipment_protection'], 
 ARRAY['radio_systems', 'security_vehicles', 'crowd_barriers'], 
 ARRAY['security', 'location_security', 'equipment_protection', 'crowd_control'], 
 4.7, 42, true),

-- Permits/Insurance
(1, 8, 'service', 'Bay Area Film Permits', 
 'Comprehensive permit and insurance coordination services. Handles city permits, location agreements, and production insurance. Experienced with Oakland and East Bay requirements.', 
 'permits_insurance', 
 ARRAY['https://images.unsplash.com/photo-1589829545856-d10d557cf95f'],
 120.00, 'day', 'Oakland, CA', 
 ARRAY['city_permits', 'location_agreements', 'insurance_coordination', 'east_bay_specialist'], 
 ARRAY[], 
 ARRAY['permits', 'insurance', 'city_coordination', 'location_agreements'], 
 4.8, 67, true),

-- Legal Services
(1, 9, 'service', 'Entertainment Legal Services', 
 'Specialized entertainment law services for film productions. Contract review, talent agreements, and production legal support. Bay Area film industry expertise.', 
 'legal_services', 
 ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
 200.00, 'hour', 'San Francisco, CA', 
 ARRAY['entertainment_specialist', 'bay_area_expertise', 'contract_review', 'talent_agreements'], 
 ARRAY[], 
 ARRAY['legal_services', 'entertainment_law', 'contracts', 'talent_agreements'], 
 4.9, 23, true);