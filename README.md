# 77 Drive — Site institucional

Site da 77 Drive com página principal e painel de analytics em `/admin`.

## Tecnologias

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Supabase (analytics + login do painel)

## Passo 1 — Subir no GitHub

```sh
git init
git add .
git commit -m "Site 77 Drive"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/77drive-site.git
git push -u origin main
```

## Passo 2 — Configurar o Supabase (grátis)

1. Crie uma conta em [supabase.com](https://supabase.com) e clique em **New project** (plano Free).
2. No menu lateral, abra **SQL Editor → New query**, cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Vá em **Authentication → Users → Add user**, crie seu usuário com e-mail e senha e marque **Auto Confirm User**.
4. Volte ao **SQL Editor** e rode (trocando pelo seu e-mail):

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'seu@email.com';
   ```

5. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public**.

## Passo 3 — Publicar na Netlify

1. Em [app.netlify.com](https://app.netlify.com), clique em **Add new site → Import an existing project** e conecte o repositório do GitHub.
2. A Netlify detecta o `netlify.toml` sozinha (build: `npm run build`, publish: `dist`).
3. Antes de publicar, em **Site configuration → Environment variables**, adicione:

   | Chave | Valor |
   | --- | --- |
   | `VITE_SUPABASE_URL` | a Project URL do passo 2 |
   | `VITE_SUPABASE_ANON_KEY` | a chave anon public do passo 2 |

4. Clique em **Deploy**. Pronto — o site entra no ar.

## Passo 4 — Ver o painel

Acesse `seudominio.com/admin` e entre com o e-mail e senha criados no passo 2.
O painel mostra visitas, funil de download, dispositivos, origem das visitas e atualiza em tempo real.

## Rodar localmente (opcional)

```sh
npm install
cp .env.example .env   # preencha com os dados do Supabase
npm run dev
```

## Editar textos e links

Quase tudo está em `src/lib/site-config.ts` (links das lojas, WhatsApp, Instagram, dados legais). Os textos das seções ficam em `src/Home.tsx`.

## Privacidade

O analytics não coleta IP, nome, e-mail nem localização. Apenas: tipo de evento, botão clicado, um ID de sessão anônimo (que some ao fechar a aba), página, origem da visita e tipo de dispositivo.
