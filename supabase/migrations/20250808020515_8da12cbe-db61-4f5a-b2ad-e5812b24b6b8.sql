-- Grant admin role to the current user
INSERT INTO public.user_roles (user_id, role)
VALUES ('a6c6a731-0010-4e4a-9b75-9e1feb18a034', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;