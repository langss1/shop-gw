-- =============================================================
-- Seed opsional — memindahkan 3 app dummy yang dulu hardcoded di
-- src/components/AppStoreGrid.tsx supaya storefront tidak kosong.
-- Aman dijalankan berulang (idempotent lewat slug).
-- =============================================================

insert into public.apps
  (slug, name, tagline, description, category, platform, year, tech_stack,
   gradient, video_url, rating, content_rating, has_iap, version,
   download_url, status, is_featured, sort_order)
values
  (
    'dataflow-analytics',
    'DataFlow Analytics',
    'Analitik data real-time bertenaga AI',
    'An enterprise-grade analytics platform powered by AI. Process massive datasets in real-time, generate predictive insights, and visualize your data streams effortlessly. Built for data scientists and decision makers.',
    'AI & Big Data',
    'web',
    2026,
    array['Next.js', 'Python', 'TensorFlow', 'PostgreSQL'],
    'from-blue-500 to-cyan-400',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    4.5, '12+', true, '1.0.0',
    '/development',
    'published', true, 1
  ),
  (
    'cybervault-pro',
    'CyberVault Pro',
    'Penyimpanan kriptografi & pemindai kerentanan',
    'Next-generation cryptographic storage and vulnerability scanning toolkit. Secure your enterprise assets with military-grade encryption and automated pentesting reports.',
    'Cybersecurity',
    'mobile',
    2025,
    array['Rust', 'React', 'WebAssembly', 'Docker'],
    'from-indigo-600 to-purple-500',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    4.7, '12+', false, '2.1.0',
    '/development',
    'published', false, 2
  ),
  (
    'nexus-ui-framework',
    'Nexus UI Framework',
    'Component library headless untuk web modern',
    'A powerful, headless component library and design system for modern web applications. Focus on accessibility and beautiful micro-interactions out of the box.',
    'Web Development',
    'web',
    2026,
    array['TypeScript', 'Tailwind CSS', 'Framer Motion'],
    'from-emerald-400 to-teal-500',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    4.8, '3+', false, '0.9.2',
    '/development',
    'published', false, 3
  )
on conflict (slug) do nothing;

-- Links contoh
insert into public.app_links (app_id, type, url, label, sort_order)
select a.id, v.type, v.url, v.label, v.sort_order
from public.apps a
join (values
  ('dataflow-analytics', 'github', '/development', 'Source', 1),
  ('dataflow-analytics', 'launch', '/development', 'Live Demo', 2),
  ('cybervault-pro',     'launch', '/development', 'Live Demo', 1),
  ('nexus-ui-framework', 'github', '/development', 'Source', 1),
  ('nexus-ui-framework', 'npm',    '/development', 'npm', 2)
) as v(slug, type, url, label, sort_order) on v.slug = a.slug
where not exists (
  select 1 from public.app_links l where l.app_id = a.id and l.url = v.url and l.type = v.type
);

-- Banner contoh
insert into public.banners (title, subtitle, gradient, sort_order, is_active)
select v.title, v.subtitle, v.gradient, v.sort_order, true
from (values
  ('Featured Application',
   'Discover the most powerful tools to accelerate your workflow.',
   'from-blue-600 via-indigo-600 to-purple-700', 1),
  ('Built for Developers',
   'Open source tooling, dokumentasi lengkap, dan rilis rutin.',
   'from-emerald-500 via-teal-600 to-cyan-700', 2)
) as v(title, subtitle, gradient, sort_order)
where not exists (select 1 from public.banners b where b.title = v.title);
