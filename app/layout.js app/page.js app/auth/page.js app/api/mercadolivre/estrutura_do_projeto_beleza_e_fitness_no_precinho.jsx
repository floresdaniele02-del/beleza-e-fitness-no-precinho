// 📁 ESTRUTURA DE PASTAS DO PROJETO
// beleza-e-fitness-no-precinho/
// ├─ app/
// │  ├─ layout.js
// │  ├─ page.js
// │  ├─ globals.css
// │  ├─ auth/
// │  │  └─ page.js
// │  └─ api/
// │     └─ mercadolivre/
// │        ├─ token/route.js
// │        ├─ refresh/route.js
// │        └─ produtos/route.js
// ├─ package.json
// ├─ next.config.js
// └─ tailwind.config.js

// =========================
// app/layout.js
// =========================
export const metadata = {
  title: "Beleza e Fitness no Precinho",
  description: "Promoções de beleza, fitness e roupas direto do Mercado Livre"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

// =========================
// app/page.js (HOME)
// =========================
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("/api/mercadolivre/produtos")
      .then(res => res.json())
      .then(data => setProdutos(data.results || []));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">🔥 Promoções do Momento</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos.map(p => (
          <div key={p.id} className="border rounded-xl p-4">
            <img src={p.thumbnail} alt={p.title} />
            <h2 className="font-semibold mt-2">{p.title}</h2>
            <p className="font-bold text-green-600">R$ {p.price}</p>
            <a
              href={p.permalink}
              target="_blank"
              className="block mt-2 bg-blue-600 text-white text-center py-2 rounded"
            >
              Comprar no Mercado Livre
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}

// =========================
// app/auth/page.js
// =========================
export default function AuthPage() {
  return (
    <main className="p-10 text-center">
      <h1 className="text-xl font-bold">Autorização concluída</h1>
      <p>Você pode fechar esta página.</p>
    </main>
  );
}

// =========================
// app/api/mercadolivre/token/route.js
// =========================
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const response = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.ML_APP_ID,
      client_secret: process.env.ML_SECRET_KEY,
      code,
      redirect_uri: "https://belezaefitnessnoprecinho.com.br/auth"
    })
  });

  return NextResponse.json(await response.json());
}

// =========================
// app/api/mercadolivre/refresh/route.js
// =========================
import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: process.env.ML_APP_ID,
      client_secret: process.env.ML_SECRET_KEY,
      refresh_token: process.env.ML_REFRESH_TOKEN
    })
  });

  return NextResponse.json(await response.json());
}

// =========================
// app/api/mercadolivre/produtos/route.js
// =========================
import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://api.mercadolibre.com/sites/MLB/search?q=fitness&limit=12"
  );
  return NextResponse.json(await response.json());
}

// =========================
// package.json (RESUMO)
// =========================
// {
//   "name": "beleza-e-fitness-no-precinho",
//   "private": true,
//   "scripts": {
//     "dev": "next dev",
//     "build": "next build",
//     "start": "next start"
//   },
//   "dependencies": {
//     "next": "latest",
//     "react": "latest",
//     "react-dom": "latest"
//   }
// }
