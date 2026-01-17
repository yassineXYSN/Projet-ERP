-- Insert sample products
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level)
VALUES
  ('Office Chair', 'Ergonomic office chair with lumbar support', 'FRN-001', 'Furniture', 299.99, 15, 5),
  ('Laptop Computer', 'Business laptop with 16GB RAM', 'ELC-001', 'Electronics', 1299.99, 8, 3),
  ('Printer Paper', 'A4 white paper, 500 sheets per ream', 'STA-001', 'Stationery', 5.99, 150, 20),
  ('Standing Desk', 'Height-adjustable standing desk', 'FRN-002', 'Furniture', 599.99, 5, 2),
  ('USB Flash Drive', '64GB USB 3.0 flash drive', 'ELC-002', 'Electronics', 15.99, 50, 10),
  ('Whiteboard Markers', 'Pack of 12 assorted colors', 'STA-002', 'Stationery', 12.99, 75, 15),
  ('Conference Phone', 'Wireless conference speakerphone', 'ELC-003', 'Electronics', 249.99, 6, 2),
  ('Filing Cabinet', '4-drawer metal filing cabinet', 'FRN-003', 'Furniture', 189.99, 10, 3)
ON CONFLICT (sku) DO NOTHING;

-- Insert sample suppliers
INSERT INTO public.suppliers (name, contact_person, email, phone, address, status)
VALUES
  ('Office Supplies Co', 'John Smith', 'john@officesupplies.com', '+1-555-0101', '123 Business St, New York, NY', 'validated'),
  ('Tech Equipment Inc', 'Sarah Johnson', 'sarah@techequip.com', '+1-555-0102', '456 Tech Ave, San Francisco, CA', 'validated'),
  ('Furniture World', 'Mike Brown', 'mike@furnitureworld.com', '+1-555-0103', '789 Furniture Blvd, Chicago, IL', 'validated'),
  ('Global Stationery', 'Emily Davis', 'emily@globalstat.com', '+1-555-0104', '321 Paper Lane, Boston, MA', 'pending_validation'),
  ('Premium Electronics', 'David Wilson', 'david@premiumelec.com', '+1-555-0105', '654 Circuit Dr, Austin, TX', 'validated')
ON CONFLICT DO NOTHING;
