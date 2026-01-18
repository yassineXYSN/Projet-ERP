-- Add supplier_id column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier_id);

-- Delete related data first to avoid foreign key constraint violations
DELETE FROM public.quality_checks;
DELETE FROM public.purchase_order_items;
DELETE FROM public.purchase_orders;
DELETE FROM public.receptions;
DELETE FROM public.invoices;

-- Delete all existing products to start fresh
DELETE FROM public.products;

-- Insert new products linked to Tunisian suppliers
-- Products for SOTUVER (Glass packaging)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Bouteille en verre 750ml',
  'Bouteille en verre transparent pour boissons',
  'SOTV-BV750',
  'Emballage',
  2.50,
  500,
  100,
  id
FROM public.suppliers WHERE name = 'SOTUVER';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Pot en verre 500ml',
  'Pot en verre pour conserves alimentaires',
  'SOTV-PV500',
  'Emballage',
  1.80,
  800,
  150,
  id
FROM public.suppliers WHERE name = 'SOTUVER';

-- Products for Poulina Group Holding (Agro-industry)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Farine de blé 25kg',
  'Farine de blé tendre pour boulangerie',
  'POUL-FB25',
  'Agroalimentaire',
  45.00,
  200,
  50,
  id
FROM public.suppliers WHERE name = 'Poulina Group Holding';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Aliment volaille 50kg',
  'Aliment composé pour volailles',
  'POUL-AV50',
  'Agroalimentaire',
  85.00,
  150,
  30,
  id
FROM public.suppliers WHERE name = 'Poulina Group Holding';

-- Products for SOTUMAG (Industrial equipment)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Pompe hydraulique 50L/min',
  'Pompe hydraulique industrielle haute pression',
  'STMG-PH50',
  'Équipement industriel',
  1250.00,
  25,
  5,
  id
FROM public.suppliers WHERE name = 'SOTUMAG';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Compresseur air 200L',
  'Compresseur d''air industriel 200 litres',
  'STMG-CA200',
  'Équipement industriel',
  2800.00,
  10,
  3,
  id
FROM public.suppliers WHERE name = 'SOTUMAG';

-- Products for STIP (Tires)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Pneu 195/65R15',
  'Pneu tourisme été',
  'STIP-P19565',
  'Pneumatique',
  180.00,
  120,
  20,
  id
FROM public.suppliers WHERE name = 'STIP (Société Tunisienne d''Industrie Pneumatique)';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Pneu camion 315/80R22.5',
  'Pneu poids lourd longue distance',
  'STIP-PC315',
  'Pneumatique',
  650.00,
  45,
  10,
  id
FROM public.suppliers WHERE name = 'STIP (Société Tunisienne d''Industrie Pneumatique)';

-- Products for Délice Holding (Dairy)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Lait UHT 1L (pack 12)',
  'Pack de 12 briques de lait UHT demi-écrémé',
  'DELI-LT12',
  'Produits laitiers',
  18.00,
  300,
  50,
  id
FROM public.suppliers WHERE name = 'Délice Holding';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Yaourt nature 125g (pack 8)',
  'Pack de 8 yaourts nature',
  'DELI-YN8',
  'Produits laitiers',
  8.50,
  400,
  80,
  id
FROM public.suppliers WHERE name = 'Délice Holding';

-- Products for SOTIPAPIER (Paper)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Papier A4 80g (ramette 500)',
  'Ramette de papier blanc A4 80g/m²',
  'SOTP-PA4',
  'Papeterie',
  12.00,
  1000,
  200,
  id
FROM public.suppliers WHERE name = 'SOTIPAPIER';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Carton ondulé 60x40cm',
  'Feuille de carton ondulé pour emballage',
  'SOTP-CO60',
  'Emballage',
  3.50,
  600,
  100,
  id
FROM public.suppliers WHERE name = 'SOTIPAPIER';

-- Products for Groupe Loukil (Distribution)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Climatiseur Split 12000 BTU',
  'Climatiseur mural inverter',
  'LOUK-CS12',
  'Électroménager',
  1450.00,
  35,
  8,
  id
FROM public.suppliers WHERE name = 'Groupe Loukil';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Réfrigérateur 400L',
  'Réfrigérateur double porte No Frost',
  'LOUK-RF400',
  'Électroménager',
  2200.00,
  20,
  5,
  id
FROM public.suppliers WHERE name = 'Groupe Loukil';

-- Products for SOPAL (Aluminum)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Feuille aluminium 30cm x 100m',
  'Rouleau de feuille d''aluminium alimentaire',
  'SOPL-FA30',
  'Emballage',
  25.00,
  250,
  40,
  id
FROM public.suppliers WHERE name = 'SOPAL';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Barquette aluminium (pack 100)',
  'Barquettes aluminium jetables pour traiteur',
  'SOPL-BA100',
  'Emballage',
  35.00,
  180,
  30,
  id
FROM public.suppliers WHERE name = 'SOPAL';

-- Products for Groupe Slama Frères (Ceramics)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Carrelage sol 60x60cm',
  'Carrelage grès cérame poli brillant',
  'SLAM-CS60',
  'Matériaux construction',
  28.00,
  500,
  100,
  id
FROM public.suppliers WHERE name = 'Groupe Slama Frères';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Faïence murale 25x40cm',
  'Carrelage mural salle de bain',
  'SLAM-FM25',
  'Matériaux construction',
  18.00,
  700,
  120,
  id
FROM public.suppliers WHERE name = 'Groupe Slama Frères';

-- Products for SIAME (Electrical)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Disjoncteur 32A',
  'Disjoncteur modulaire monophasé',
  'SIAM-D32',
  'Électrique',
  35.00,
  200,
  40,
  id
FROM public.suppliers WHERE name = 'SIAME';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Tableau électrique 12 modules',
  'Coffret électrique encastrable',
  'SIAM-TE12',
  'Électrique',
  85.00,
  80,
  15,
  id
FROM public.suppliers WHERE name = 'SIAME';

-- Products for CFT (Packaging)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Sachet plastique 30x40cm (1000)',
  'Sachet plastique transparent alimentaire',
  'CFT-SP30',
  'Emballage',
  45.00,
  300,
  50,
  id
FROM public.suppliers WHERE name = 'CFT (Conditionnement et Façonnage Tunisien)';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Film étirable 50cm x 300m',
  'Film étirable pour palettisation',
  'CFT-FE50',
  'Emballage',
  28.00,
  150,
  25,
  id
FROM public.suppliers WHERE name = 'CFT (Conditionnement et Façonnage Tunisien)';

-- Products for SITEX (Textile)
INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Tissu coton 150cm (mètre)',
  'Tissu 100% coton pour confection',
  'SITX-TC150',
  'Textile',
  15.00,
  400,
  80,
  id
FROM public.suppliers WHERE name = 'SITEX';

INSERT INTO public.products (name, description, sku, category, unit_price, quantity_in_stock, reorder_level, supplier_id)
SELECT 
  'Jean denim 12oz (mètre)',
  'Tissu denim brut pour jeans',
  'SITX-JD12',
  'Textile',
  22.00,
  250,
  50,
  id
FROM public.suppliers WHERE name = 'SITEX';
