-- Script pour nettoyer la table suppliers
-- 1. Supprimer tous les fournisseurs non tunisiens
-- 2. Supprimer les doublons

-- Supprimer les fournisseurs non tunisiens (ceux qui n'ont pas +216 dans le téléphone)
DELETE FROM suppliers 
WHERE phone NOT LIKE '+216%' OR phone IS NULL;

-- Utiliser DISTINCT ON au lieu de MIN(uuid) pour supprimer les doublons
DELETE FROM suppliers 
WHERE id NOT IN (
  SELECT DISTINCT ON (name) id 
  FROM suppliers 
  ORDER BY name, created_at ASC
);
