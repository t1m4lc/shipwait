-- Enable RLS on feature_flags table
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see feature flags available to their subscription or free features
CREATE POLICY "Users can view feature flags for their subscription" ON public.feature_flags
FOR SELECT
TO authenticated
USING (
  -- Allow access to free features (those with null price_id in config)
  EXISTS (
    SELECT 1
    FROM jsonb_array_elements(feature_flags.price_configs) AS config
    WHERE config->>'price_id' IS NULL
  )
  OR
  -- Allow access to features based on user's active subscription
  EXISTS (
    SELECT 1 
    FROM public.subscriptions s
    INNER JOIN public.prices p ON s.price_id = p.id
    WHERE s.user_id = auth.uid()
      AND s.status IN ('active', 'trialing')
      AND EXISTS (
        SELECT 1
        FROM jsonb_array_elements(feature_flags.price_configs) AS config
        WHERE config->>'price_id' = p.stripe_price_id
      )
  )
);

-- Grant necessary permissions
GRANT SELECT ON public.feature_flags TO authenticated;
