-- Insert sample receptions linked to purchase orders
INSERT INTO public.receptions (reception_number, purchase_order_id, reception_date, status, received_by)
SELECT 
  'REC-' || TO_CHAR(ROW_NUMBER() OVER (ORDER BY po.id), '00001') as reception_number,
  po.id as purchase_order_id,
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY po.id))::INTEGER * INTERVAL '1 day' as reception_date,
  'pending' as status,
  p.id as received_by
FROM public.purchase_orders po
CROSS JOIN (SELECT id FROM public.profiles LIMIT 1) p
LIMIT 5;
