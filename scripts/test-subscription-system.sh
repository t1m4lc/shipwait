#!/bin/bash

# Script de test pour vérifier que le système de subscription fonctionne

echo "🧪 Test du système de subscription Stripe..."

# Variables
BASE_URL="http://localhost:3000"
DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

echo "1️⃣ Vérification des tables de pricing..."
psql "$DB_URL" -c "
SELECT 
  p.name as plan_name,
  pr.stripe_price_id,
  pr.unit_amount / 100.0 as price_eur,
  pr.interval,
  pr.active
FROM plans p 
JOIN prices pr ON p.id = pr.plan_id 
ORDER BY pr.unit_amount;
"

echo "2️⃣ Vérification des constantes Stripe..."
node -e "
const constants = require('./stores/constants.ts');
console.log('Monthly Price ID:', constants.STRIPE_MONTHLY_PRICE_ID);
console.log('Yearly Price ID:', constants.STRIPE_YEARLY_PRICE_ID);
console.log('Lifetime Price ID:', constants.STRIPE_LIFETIME_PRICE_ID);
"

echo "3️⃣ Test de l'endpoint webhook..."
curl -s -X POST "$BASE_URL/api/stripe/webhook" \
  -H "Content-Type: application/json" \
  -d '{"type": "test"}' | head -50

echo "4️⃣ Vérification des variables d'environnement..."
if [ -z "$STRIPE_SECRET_KEY" ]; then
  echo "❌ STRIPE_SECRET_KEY manquante"
else
  echo "✅ STRIPE_SECRET_KEY présente"
fi

if [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
  echo "❌ STRIPE_WEBHOOK_SECRET manquante"
else
  echo "✅ STRIPE_WEBHOOK_SECRET présente"
fi

echo "5️⃣ Vérification de la table subscriptions..."
psql "$DB_URL" -c "
SELECT COUNT(*) as subscription_count 
FROM subscriptions;
"

echo "🎯 Pour tester un achat complet:"
echo "1. Démarrez l'app : npm run dev"
echo "2. Allez sur $BASE_URL/pricing"
echo "3. Cliquez sur 'Get Started' pour Pro"
echo "4. Utilisez la carte de test : 4242 4242 4242 4242"
echo "5. Vérifiez que l'abonnement apparaît avec :"
echo "   psql '$DB_URL' -c 'SELECT * FROM subscriptions;'"
