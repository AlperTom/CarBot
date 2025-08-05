-- SQL to create Directus collections manually
-- Run this in Directus > Settings > Data Model > Raw SQL

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status VARCHAR(255) DEFAULT 'draft',
    sort INTEGER,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    price_from DECIMAL(10,2),
    price_to DECIMAL(10,2),
    duration_minutes INTEGER,
    image CHAR(36),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_created CHAR(36),
    date_updated DATETIME,
    user_updated CHAR(36)
);

-- Blog posts table  
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status VARCHAR(255) DEFAULT 'draft',
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    excerpt TEXT,
    content TEXT,
    featured_image CHAR(36),
    author VARCHAR(255),
    published_date DATETIME,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_created CHAR(36),
    date_updated DATETIME,
    user_updated CHAR(36)
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status VARCHAR(255) DEFAULT 'published',
    sort INTEGER,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(255),
    language VARCHAR(10) DEFAULT 'de',
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_created CHAR(36),
    date_updated DATETIME,
    user_updated CHAR(36)
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status VARCHAR(255) DEFAULT 'published',
    customer_name VARCHAR(255) NOT NULL,
    customer_company VARCHAR(255),
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    testimonial_text TEXT NOT NULL,
    customer_photo CHAR(36),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_created CHAR(36),
    date_updated DATETIME,
    user_updated CHAR(36)
);