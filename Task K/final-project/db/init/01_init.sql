-- Create the Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL,
    is_returning_customer BOOLEAN NOT NULL, -- Maps to "plan"
    subscribed_newsletter BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Rentals table
CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 4),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    additional_notes TEXT,
    accepted_terms BOOLEAN NOT NULL CHECK (accepted_terms = TRUE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Database-level check to ensure dates make sense
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Inserting sample data that matches your React component logic
INSERT INTO users (first_name, last_name, email, phone_number, is_returning_customer, subscribed_newsletter)
VALUES 
    ('Alice', 'Example', 'alice@example.com', '+358401234567', TRUE, TRUE),
    ('Bob', 'Tester', 'bob@example.com', '0409876543', FALSE, FALSE)
ON CONFLICT (email) DO NOTHING;