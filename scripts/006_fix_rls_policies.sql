-- Fix RLS policies to allow authenticated users to create records

-- Drop restrictive policies and recreate with better permissions

-- Fix invoices policies
DROP POLICY IF EXISTS "Finance users can manage invoices" ON public.invoices;
CREATE POLICY "Authenticated users can create invoices" ON public.invoices FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update invoices" ON public.invoices FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete invoices" ON public.invoices FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Fix quality_checks policies
DROP POLICY IF EXISTS "QC inspectors can manage quality checks" ON public.quality_checks;
CREATE POLICY "Authenticated users can create quality checks" ON public.quality_checks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update quality checks" ON public.quality_checks FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete quality checks" ON public.quality_checks FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'quality_control'))
);

-- Fix products policies - allow all authenticated users to create/update
DROP POLICY IF EXISTS "Inventory managers can manage products" ON public.products;
CREATE POLICY "Authenticated users can create products" ON public.products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update products" ON public.products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager'))
);

-- Fix suppliers policies - allow all authenticated users to create/update
DROP POLICY IF EXISTS "Buyers can manage suppliers" ON public.suppliers;
CREATE POLICY "Authenticated users can create suppliers" ON public.suppliers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete suppliers" ON public.suppliers FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'buyer'))
);
