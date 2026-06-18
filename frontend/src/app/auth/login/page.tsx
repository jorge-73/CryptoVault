import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de CryptoVault",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <div className="rounded-xl border bg-card p-8">
        <h1 className="text-2xl font-bold mb-1">Iniciar sesión</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Accede a tu cuenta para gestionar tus favoritos
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
