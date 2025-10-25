/*
  # Add Tier Cost and Toppings Management

  1. Changes to Existing Tables
    - `tiers`
      - Add `tier_cost` (decimal) - Base cost or chef charge for each tier
  
  2. New Tables
    - `toppings`
      - `id` (uuid, primary key)
      - `name` (text, unique, required) - Topping name
      - `price` (decimal, required) - Price per topping
      - `is_available` (boolean, default true) - Availability toggle
      - `image_url` (text) - Image for the topping
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  3. Security
    - Enable RLS on toppings table
    - Add policies for authenticated admin users to manage records
    - Public read access for front-end display
*/

-- Add tier_cost column to tiers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tiers' AND column_name = 'tier_cost'
  ) THEN
    ALTER TABLE tiers ADD COLUMN tier_cost decimal(10,2) DEFAULT 0 CHECK (tier_cost >= 0);
  END IF;
END $$;

-- Create toppings table
CREATE TABLE IF NOT EXISTS toppings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  is_available boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on toppings
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;

-- Policies for toppings table
CREATE POLICY "Anyone can view toppings"
  ON toppings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert toppings"
  ON toppings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update toppings"
  ON toppings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete toppings"
  ON toppings FOR DELETE
  TO authenticated
  USING (true);