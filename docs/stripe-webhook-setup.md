# Configuration des Webhooks Stripe

## Étapes pour configurer les webhooks Stripe

### 1. Créer un webhook dans Stripe Dashboard

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Cliquez sur "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Sélectionnez ces événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.resumed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 2. Récupérer le secret webhook

1. Une fois le webhook créé, cliquez dessus
2. Dans la section "Signing secret", cliquez sur "Reveal"
3. Copiez le secret (commence par `whsec_`)
4. Mettez à jour votre variable d'environnement `STRIPE_WEBHOOK_SECRET`

### 3. Tester le webhook

Vous pouvez tester avec Stripe CLI :

```bash
# Installer Stripe CLI
stripe login

# Forward events to votre endpoint local
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Dans un autre terminal, trigger un event de test
stripe trigger checkout.session.completed
```

### 4. Variables d'environnement requises

```env
# Stripe
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_KEY=eyJ... # Clé service role pour les webhooks
```

### 5. Test d'achat complet

1. Démarrez votre application : `npm run dev`
2. Allez sur `/pricing`
3. Cliquez sur "Get Started" pour Pro
4. Complétez l'achat avec les données de test Stripe :
   - Carte : `4242 4242 4242 4242`
   - Date : toute date future
   - CVC : tout code à 3 chiffres
5. Vérifiez que l'abonnement apparaît dans votre table `subscriptions`

### 6. Debug des webhooks

Si les webhooks ne fonctionnent pas :

1. Vérifiez les logs Stripe Dashboard > Webhooks > votre endpoint > Recent deliveries
2. Vérifiez les logs de votre application
3. Testez manuellement l'endpoint webhook :

```bash
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "test"}'
```

### 7. Problèmes courants

- **403 Forbidden** : Vérifiez que le `STRIPE_WEBHOOK_SECRET` est correct
- **Table 'prices' doesn't exist** : Appliquez les migrations créées
- **User not found** : Assurez-vous que l'utilisateur existe dans `auth.users`
- **Empty subscriptions table** : Vérifiez que les webhooks arrivent bien et que les prix existent
