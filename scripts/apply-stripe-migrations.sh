#!/bin/bash

# Script pour appliquer les migrations Stripe en production
# Ce script doit être exécuté sur votre base de données de production Supabase

echo "🚀 Application des migrations Stripe..."

# Variables
SUPABASE_PROJECT_REF="ayyfgjsgyknlztnwzfqd"

echo "📋 Vérification des tables existantes..."

# Vérifier si les tables existent déjà
psql "$DATABASE_URL" -c "\dt plans; \dt prices;" 2>/dev/null

echo "📦 Application de la migration des tables..."

# Appliquer la migration des tables
psql "$DATABASE_URL" -f supabase/migrations/20250124_add_pricing_tables.sql

echo "🌱 Application du seeding des données..."

# Appliquer le seeding
psql "$DATABASE_URL" -f supabase/migrations/20250124_seed_pricing_data.sql

echo "✅ Vérification des données..."

# Vérifier que tout est bien créé
psql "$DATABASE_URL" -c "SELECT p.name, pr.stripe_price_id, pr.unit_amount, pr.interval FROM plans p JOIN prices pr ON p.id = pr.plan_id;"

echo "🎉 Migrations appliquées avec succès !"
