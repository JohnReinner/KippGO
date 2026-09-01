# KippGO

Plataforma para academias, professores e alunos, com treinos, metas, avaliações, bioimpedância, agenda e indicadores de retenção.

## Stack

- React + TypeScript + Next.js/Vinext
- Tailwind CSS
- Supabase: autenticação, PostgreSQL e Row Level Security

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local`.
4. Preencha a Project URL e a chave pública anon/publishable.

Nunca use a chave `service_role` no frontend.

## Comandos

```bash
npm run install:ci
npm run dev
npm run build
npm run lint
```
