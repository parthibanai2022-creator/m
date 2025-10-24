/*
  # Customization Cakes Management Tables

  1. New Tables
    - `flavours`
      - `id` (uuid, primary key)
      - `name` (text, unique, required) - Flavor name
      - `image_url` (text) - URL to uploaded flavor image
      - `base_price_per_kg` (decimal, required) - Base price per kilogram
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
    
    - `tiers`
      - `id` (uuid, primary key)
      - `tier_number` (integer, unique, required) - Tier number (1-4)
      - `min_weight_kg` (decimal, required) - Minimum weight in kg
      - `max_weight_kg` (decimal, required) - Maximum weight in kg
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
      - Constraint: min_weight_kg < max_weight_kg
      - Constraint: tier_number between 1 and 4
    
    - `design_models`
      - `id` (uuid, primary key)
      - `model_number` (text, unique, required) - Model identifier (e.g., M01, M02)
      - `model_name` (text, required) - Display name for the model
      - `image_url` (text) - URL to uploaded design preview image
      - `price` (decimal, required) - Price for this design model
      - `tier_id` (uuid, foreign key) - Reference to tiers table
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users to manage records
    - Public read access for front-end display
*/

-- Create flavours table
CREATE TABLE IF NOT EXISTS flavours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  image_url text,
  base_price_per_kg decimal(10,2) NOT NULL CHECK (base_price_per_kg > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tiers table
CREATE TABLE IF NOT EXISTS tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_number integer UNIQUE NOT NULL CHECK (tier_number >= 1 AND tier_number <= 4),
  min_weight_kg decimal(10,2) NOT NULL CHECK (min_weight_kg > 0),
  max_weight_kg decimal(10,2) NOT NULL CHECK (max_weight_kg > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_weight_range CHECK (min_weight_kg < max_weight_kg)
);

-- Create design_models table
CREATE TABLE IF NOT EXISTS design_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_number text UNIQUE NOT NULL,
  model_name text NOT NULL,
  image_url text,
  price decimal(10,2) NOT NULL CHECK (price > 0),
  tier_id uuid NOT NULL REFERENCES tiers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE flavours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_models ENABLE ROW LEVEL SECURITY;

-- Policies for flavours table
CREATE POLICY "Anyone can view flavours"
  ON flavours FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert flavours"
  ON flavours FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update flavours"
  ON flavours FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete flavours"
  ON flavours FOR DELETE
  TO authenticated
  USING (true);

-- Policies for tiers table
CREATE POLICY "Anyone can view tiers"
  ON tiers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert tiers"
  ON tiers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tiers"
  ON tiers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tiers"
  ON tiers FOR DELETE
  TO authenticated
  USING (true);

-- Policies for design_models table
CREATE POLICY "Anyone can view design models"
  ON design_models FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert design models"
  ON design_models FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update design models"
  ON design_models FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete design models"
  ON design_models FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for customization images
INSERT INTO storage.buckets (id, name, public)
VALUES ('customization-images', 'customization-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for customization-images bucket
CREATE POLICY "Anyone can view customization images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'customization-images');

CREATE POLICY "Authenticated users can upload customization images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'customization-images');

CREATE POLICY "Authenticated users can update customization images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'customization-images')
  WITH CHECK (bucket_id = 'customization-images');

CREATE POLICY "Authenticated users can delete customization images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'customization-images');