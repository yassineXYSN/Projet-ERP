-- Insert Tunisian suppliers
INSERT INTO public.suppliers (name, contact_person, email, phone, address, status)
VALUES
  ('Société Tunisienne de Fournitures', 'Mohamed Ben Ali', 'contact@stf-tunisie.tn', '+216 71 234 567', 'Rue de la Liberté, Tunis 1000', 'validated'),
  ('SOTUVER', 'Ahmed Trabelsi', 'ahmed@sotuver.com.tn', '+216 71 456 789', 'Zone Industrielle Ben Arous, 2013', 'validated'),
  ('Ennakl Automobiles', 'Sami Gharbi', 'sami.gharbi@ennakl.tn', '+216 70 123 456', 'Avenue Habib Bourguiba, Tunis', 'validated'),
  ('Poulina Group Holding', 'Karim Mzoughi', 'k.mzoughi@pfrpoulina.com', '+216 71 789 012', 'Les Berges du Lac, Tunis 1053', 'validated'),
  ('STIP (Société Tunisienne des Industries de Pneumatiques)', 'Nadia Chaabane', 'nadia@stip.com.tn', '+216 72 234 567', 'Zone Industrielle Sousse, 4000', 'validated'),
  ('Délice Holding', 'Riadh Bouazizi', 'r.bouazizi@delice.tn', '+216 71 345 678', 'Route de Mégrine, Ben Arous 2033', 'pending_validation'),
  ('SOTUMAG', 'Fatma Mansour', 'f.mansour@sotumag.com.tn', '+216 71 567 890', 'Centre Urbain Nord, Tunis 1082', 'validated'),
  ('Groupe Loukil', 'Hichem Loukil', 'hichem@groupeloukil.com.tn', '+216 71 678 901', 'Avenue de Carthage, Sfax 3000', 'validated'),
  ('SIAME (Société Industrielle d''Appareillage et de Matériel Électrique)', 'Youssef Kammoun', 'y.kammoun@siame.com.tn', '+216 74 123 456', 'Zone Industrielle Sfax, 3018', 'validated'),
  ('One Tech Holding', 'Leila Ben Mahmoud', 'l.benmahmoud@onetech.tn', '+216 71 890 123', 'Technopole El Ghazala, Ariana 2083', 'validated'),
  ('Electrostar', 'Slim Riahi', 's.riahi@electrostar.com.tn', '+216 71 901 234', 'Route de Sousse Km 5, Tunis', 'pending_validation'),
  ('SOTIPAPIER', 'Mounir Sassi', 'm.sassi@sotipapier.tn', '+216 72 345 678', 'Zone Industrielle Enfidha, 4030', 'validated')
ON CONFLICT DO NOTHING;
