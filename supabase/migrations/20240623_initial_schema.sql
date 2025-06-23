create type "public"."submission_behavior_type" as enum ('do_nothing', 'show_message', 'redirect');

create table "public"."custom_page_template" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "project_id" uuid not null,
    "name" text not null,
    "html" text not null,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


alter table "public"."custom_page_template" enable row level security;

create table "public"."leads" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "email" text not null,
    "submission_behavior_id" uuid not null,
    "source" text,
    "created_at" timestamp without time zone not null default now(),
    "device_type" text,
    "browser" text,
    "os" text,
    "country" text
);


alter table "public"."leads" enable row level security;

create table "public"."pages" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "title" text,
    "html" text not null,
    "active" boolean default true,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


alter table "public"."pages" enable row level security;

create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null,
    "created_at" timestamp without time zone not null default now(),
    "slug" text not null
);


alter table "public"."projects" enable row level security;

create table "public"."submission_behaviors" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "behavior_type" submission_behavior_type not null,
    "message" character varying(120),
    "redirect_url" text,
    "created_at" timestamp without time zone not null default now()
);


alter table "public"."submission_behaviors" enable row level security;

CREATE UNIQUE INDEX custom_page_template_pkey ON public.custom_page_template USING btree (id);

CREATE UNIQUE INDEX leads_pkey ON public.leads USING btree (id);

CREATE UNIQUE INDEX pages_pkey ON public.pages USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE INDEX projects_slug_idx ON public.projects USING btree (slug);

CREATE UNIQUE INDEX projects_slug_key ON public.projects USING btree (slug);

CREATE UNIQUE INDEX submission_behaviors_pkey ON public.submission_behaviors USING btree (id);

alter table "public"."custom_page_template" add constraint "custom_page_template_pkey" PRIMARY KEY using index "custom_page_template_pkey";

alter table "public"."leads" add constraint "leads_pkey" PRIMARY KEY using index "leads_pkey";

alter table "public"."pages" add constraint "pages_pkey" PRIMARY KEY using index "pages_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."submission_behaviors" add constraint "submission_behaviors_pkey" PRIMARY KEY using index "submission_behaviors_pkey";

alter table "public"."custom_page_template" add constraint "custom_page_template_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."custom_page_template" validate constraint "custom_page_template_project_id_fkey";

alter table "public"."custom_page_template" add constraint "custom_page_template_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."custom_page_template" validate constraint "custom_page_template_user_id_fkey";

alter table "public"."leads" add constraint "leads_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."leads" validate constraint "leads_project_id_fkey";

alter table "public"."leads" add constraint "leads_submission_behavior_id_fkey" FOREIGN KEY (submission_behavior_id) REFERENCES submission_behaviors(id) ON DELETE SET NULL not valid;

alter table "public"."leads" validate constraint "leads_submission_behavior_id_fkey";

alter table "public"."pages" add constraint "pages_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."pages" validate constraint "pages_project_id_fkey";

alter table "public"."projects" add constraint "projects_slug_key" UNIQUE using index "projects_slug_key";

alter table "public"."projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_user_id_fkey";

alter table "public"."submission_behaviors" add constraint "submission_behaviors_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."submission_behaviors" validate constraint "submission_behaviors_project_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_slug_from_name(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    base_slug TEXT;
BEGIN
    -- Convert to lowercase
    base_slug := LOWER(name);
    
    -- Replace spaces and special chars with hyphens
    base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9]+', '-', 'g');
    
    -- Remove leading and trailing hyphens
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- If empty after cleaning, use a default
    IF base_slug = '' THEN
        base_slug := 'project';
    END IF;
    
    -- Return unique slug
    RETURN generate_unique_slug(base_slug);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_unique_slug(base_slug text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_slug TEXT := base_slug;
    counter INTEGER := 1;
BEGIN
    -- Try with the original slug first
    LOOP
        -- Exit if no duplicate found
        IF NOT EXISTS (SELECT 1 FROM projects WHERE slug = new_slug) THEN
            RETURN new_slug;
        END IF;
        
        -- Generate a new slug with counter
        new_slug := base_slug || '-' || counter;
        counter := counter + 1;
        
        -- Safety exit - avoid infinite loops
        IF counter > 100 THEN
            RETURN base_slug || '-' || floor(random() * 10000)::TEXT;
        END IF;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_project_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Only generate slug if not provided
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_slug_from_name(NEW.name);
    END IF;
    
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."custom_page_template" to "anon";

grant insert on table "public"."custom_page_template" to "anon";

grant references on table "public"."custom_page_template" to "anon";

grant select on table "public"."custom_page_template" to "anon";

grant trigger on table "public"."custom_page_template" to "anon";

grant truncate on table "public"."custom_page_template" to "anon";

grant update on table "public"."custom_page_template" to "anon";

grant delete on table "public"."custom_page_template" to "authenticated";

grant insert on table "public"."custom_page_template" to "authenticated";

grant references on table "public"."custom_page_template" to "authenticated";

grant select on table "public"."custom_page_template" to "authenticated";

grant trigger on table "public"."custom_page_template" to "authenticated";

grant truncate on table "public"."custom_page_template" to "authenticated";

grant update on table "public"."custom_page_template" to "authenticated";

grant delete on table "public"."custom_page_template" to "service_role";

grant insert on table "public"."custom_page_template" to "service_role";

grant references on table "public"."custom_page_template" to "service_role";

grant select on table "public"."custom_page_template" to "service_role";

grant trigger on table "public"."custom_page_template" to "service_role";

grant truncate on table "public"."custom_page_template" to "service_role";

grant update on table "public"."custom_page_template" to "service_role";

grant delete on table "public"."leads" to "anon";

grant insert on table "public"."leads" to "anon";

grant references on table "public"."leads" to "anon";

grant select on table "public"."leads" to "anon";

grant trigger on table "public"."leads" to "anon";

grant truncate on table "public"."leads" to "anon";

grant update on table "public"."leads" to "anon";

grant delete on table "public"."leads" to "authenticated";

grant insert on table "public"."leads" to "authenticated";

grant references on table "public"."leads" to "authenticated";

grant select on table "public"."leads" to "authenticated";

grant trigger on table "public"."leads" to "authenticated";

grant truncate on table "public"."leads" to "authenticated";

grant update on table "public"."leads" to "authenticated";

grant delete on table "public"."leads" to "service_role";

grant insert on table "public"."leads" to "service_role";

grant references on table "public"."leads" to "service_role";

grant select on table "public"."leads" to "service_role";

grant trigger on table "public"."leads" to "service_role";

grant truncate on table "public"."leads" to "service_role";

grant update on table "public"."leads" to "service_role";

grant delete on table "public"."pages" to "anon";

grant insert on table "public"."pages" to "anon";

grant references on table "public"."pages" to "anon";

grant select on table "public"."pages" to "anon";

grant trigger on table "public"."pages" to "anon";

grant truncate on table "public"."pages" to "anon";

grant update on table "public"."pages" to "anon";

grant delete on table "public"."pages" to "authenticated";

grant insert on table "public"."pages" to "authenticated";

grant references on table "public"."pages" to "authenticated";

grant select on table "public"."pages" to "authenticated";

grant trigger on table "public"."pages" to "authenticated";

grant truncate on table "public"."pages" to "authenticated";

grant update on table "public"."pages" to "authenticated";

grant delete on table "public"."pages" to "service_role";

grant insert on table "public"."pages" to "service_role";

grant references on table "public"."pages" to "service_role";

grant select on table "public"."pages" to "service_role";

grant trigger on table "public"."pages" to "service_role";

grant truncate on table "public"."pages" to "service_role";

grant update on table "public"."pages" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."submission_behaviors" to "anon";

grant insert on table "public"."submission_behaviors" to "anon";

grant references on table "public"."submission_behaviors" to "anon";

grant select on table "public"."submission_behaviors" to "anon";

grant trigger on table "public"."submission_behaviors" to "anon";

grant truncate on table "public"."submission_behaviors" to "anon";

grant update on table "public"."submission_behaviors" to "anon";

grant delete on table "public"."submission_behaviors" to "authenticated";

grant insert on table "public"."submission_behaviors" to "authenticated";

grant references on table "public"."submission_behaviors" to "authenticated";

grant select on table "public"."submission_behaviors" to "authenticated";

grant trigger on table "public"."submission_behaviors" to "authenticated";

grant truncate on table "public"."submission_behaviors" to "authenticated";

grant update on table "public"."submission_behaviors" to "authenticated";

grant delete on table "public"."submission_behaviors" to "service_role";

grant insert on table "public"."submission_behaviors" to "service_role";

grant references on table "public"."submission_behaviors" to "service_role";

grant select on table "public"."submission_behaviors" to "service_role";

grant trigger on table "public"."submission_behaviors" to "service_role";

grant truncate on table "public"."submission_behaviors" to "service_role";

grant update on table "public"."submission_behaviors" to "service_role";

create policy "custom_page_template_owner_only"
on "public"."custom_page_template"
as permissive
for all
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "leads_owner_only"
on "public"."leads"
as permissive
for all
to public
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))))
with check ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "projects_owner_only"
on "public"."projects"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "behaviors_owner_only"
on "public"."submission_behaviors"
as permissive
for all
to public
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))))
with check ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


CREATE TRIGGER before_insert_project BEFORE INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION set_project_slug();



