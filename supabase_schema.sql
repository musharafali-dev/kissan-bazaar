-- Supabase DB Schema for Kissan Bazaar
-- Includes tables for users (profiles), farms (KYC), products (crops), orders, reviews, and disputes.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES / USERS
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone_number text unique not null,
  full_name text not null,
  role text not null check (role in ('farmer', 'buyer', 'admin')) default 'buyer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. FARMS / KYC
create table public.farms (
  id uuid default uuid_generate_v4() primary key,
  farmer_id uuid references public.profiles(id) on delete cascade not null,
  farm_name text not null,
  cnic_number text not null unique check (cnic_number ~ '^[0-9]{5}-[0-9]{7}-[0-9]{1}$'), -- Pakistan CNIC format: 12345-1234567-1
  gps_latitude numeric(10, 8) not null,
  gps_longitude numeric(11, 8) not null,
  payout_method text not null check (payout_method in ('easypaisa', 'jazzcash', 'bank')),
  payout_details jsonb not null, -- Store account number, bank name, IBAN, etc.
  is_verified boolean default false not null,
  verification_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for location searches
create index idx_farms_location on public.farms(gps_latitude, gps_longitude);

-- 3. PRODUCTS / CROPS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  farmer_id uuid references public.profiles(id) on delete cascade not null,
  farm_id uuid references public.farms(id) on delete cascade not null,
  crop_name text not null,
  quantity_kg numeric(10, 2) not null check (quantity_kg >= 0),
  price_per_kg numeric(10, 2) not null check (price_per_kg > 0),
  harvest_date date not null,
  grade text not null check (grade in ('A', 'B', 'C')),
  photo_url text,
  video_url text,
  is_organic boolean default false not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_products_crop_name on public.products(crop_name);

-- 4. ORDERS & ORDER ITEMS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  farmer_id uuid references public.profiles(id) on delete cascade not null,
  total_amount numeric(10, 2) not null,
  payment_method text not null check (payment_method in ('cod', 'advance')),
  payment_status text not null check (payment_status in ('pending', 'paid', 'refunded')) default 'pending',
  order_status text not null check (order_status in ('pending', 'packed', 'shipped', 'delivered', 'cancelled')) default 'pending',
  delivery_address text not null,
  delivery_gps_lat numeric(10, 8),
  delivery_gps_lng numeric(11, 8),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  quantity_kg numeric(10, 2) not null check (quantity_kg > 0),
  price_per_kg numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. REVIEWS & RATINGS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  farmer_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. DISPUTES
create table public.disputes (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  raised_by uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  status text not null check (status in ('open', 'under_investigation', 'resolved', 'closed')) default 'open',
  resolution_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) policies

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.disputes enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- Farms Policies
create policy "Farms are viewable by everyone." on public.farms
  for select using (true);

create policy "Farmers can insert their own farm profile." on public.farms
  for insert with check (auth.uid() = farmer_id);

create policy "Farmers can update their own farm profile." on public.farms
  for update using (auth.uid() = farmer_id);

-- Products Policies
create policy "Products are viewable by everyone." on public.products
  for select using (true);

create policy "Farmers can insert their own products." on public.products
  for insert with check (auth.uid() = farmer_id);

create policy "Farmers can update/delete their own products." on public.products
  for all using (auth.uid() = farmer_id);

-- Orders Policies
create policy "Buyers and Farmers can view their own orders." on public.orders
  for select using (auth.uid() = buyer_id or auth.uid() = farmer_id);

create policy "Buyers can insert orders." on public.orders
  for insert with check (auth.uid() = buyer_id);

create policy "Authorized parties can update order status." on public.orders
  for update using (auth.uid() = buyer_id or auth.uid() = farmer_id);

-- Order Items Policies
create policy "Order items are viewable by authorized parties." on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.buyer_id = auth.uid() or orders.farmer_id = auth.uid())
    )
  );

create policy "Buyers can insert order items." on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.buyer_id = auth.uid()
    )
  );

-- Reviews Policies
create policy "Reviews are viewable by everyone." on public.reviews
  for select using (true);

create policy "Buyers can write reviews for completed orders." on public.reviews
  for insert with check (auth.uid() = buyer_id);

-- Disputes Policies
create policy "Disputes are viewable by order parties." on public.disputes
  for select using (
    auth.uid() = raised_by or 
    exists (
      select 1 from public.orders
      where orders.id = disputes.order_id
      and (orders.buyer_id = auth.uid() or orders.farmer_id = auth.uid())
    )
  );

create policy "Order parties can raise disputes." on public.disputes
  for insert with check (auth.uid() = raised_by);
