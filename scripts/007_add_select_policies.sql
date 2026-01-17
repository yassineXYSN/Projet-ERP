-- Add SELECT policies to allow authenticated users to read all records

-- Invoices SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view invoices" ON public.invoices;
CREATE POLICY "Authenticated users can view invoices" ON public.invoices FOR SELECT USING (auth.uid() IS NOT NULL);

-- Quality checks SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view quality checks" ON public.quality_checks;
CREATE POLICY "Authenticated users can view quality checks" ON public.quality_checks FOR SELECT USING (auth.uid() IS NOT NULL);

-- Products SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
CREATE POLICY "Authenticated users can view products" ON public.products FOR SELECT USING (auth.uid() IS NOT NULL);

-- Suppliers SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT USING (auth.uid() IS NOT NULL);

-- Purchase orders SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view purchase orders" ON public.purchase_orders;
CREATE POLICY "Authenticated users can view purchase orders" ON public.purchase_orders FOR SELECT USING (auth.uid() IS NOT NULL);

-- Purchase order items SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view purchase order items" ON public.purchase_order_items;
CREATE POLICY "Authenticated users can view purchase order items" ON public.purchase_order_items FOR SELECT USING (auth.uid() IS NOT NULL);

-- Projects SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view projects" ON public.projects;
CREATE POLICY "Authenticated users can view projects" ON public.projects FOR SELECT USING (auth.uid() IS NOT NULL);

-- Receptions SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view receptions" ON public.receptions;
CREATE POLICY "Authenticated users can view receptions" ON public.receptions FOR SELECT USING (auth.uid() IS NOT NULL);

-- Profiles SELECT policy (users can see all profiles for name lookups)
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
