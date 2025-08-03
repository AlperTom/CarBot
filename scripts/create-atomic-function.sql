-- Create atomic function for user profile retrieval
-- This fixes the authentication race condition by ensuring atomic queries

CREATE OR REPLACE FUNCTION get_user_profile_atomic(
  user_id UUID,
  user_email TEXT
)
RETURNS TABLE (
  user_role TEXT,
  workshop_data JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is workshop owner
  RETURN QUERY
  SELECT 
    'owner'::TEXT as user_role,
    row_to_json(w.*)::JSONB as workshop_data
  FROM workshops w
  WHERE w.owner_email = user_email 
    AND w.active = true
  LIMIT 1;
  
  -- If no workshop found as owner, check employee status
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      wu.role as user_role,
      row_to_json(w.*)::JSONB as workshop_data
    FROM workshop_users wu
    JOIN workshops w ON w.id = wu.workshop_id
    WHERE wu.user_id = get_user_profile_atomic.user_id
      AND wu.active = true
      AND w.active = true
    LIMIT 1;
  END IF;
  
  -- If still no results, return customer role
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      'customer'::TEXT as user_role,
      '{}'::JSONB as workshop_data;
  END IF;
END;
$$;