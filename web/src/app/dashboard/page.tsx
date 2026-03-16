"use client";

import { signOut } from "next-auth/react";

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sair</button>
    </main>
  );
}
