import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { es } from "@/translations/es";

export const metadata: Metadata = {
  title: es.auth.loginTitle,
  description: es.auth.loginSubtitle,
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <div className="rounded-xl border bg-card p-8">
        <h1 className="text-2xl font-bold mb-1">{es.auth.loginHeading}</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          {es.auth.loginDescription}
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
