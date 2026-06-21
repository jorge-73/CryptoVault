import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { es } from "@/translations/es";

export const metadata: Metadata = {
  title: es.auth.registerTitle,
  description: es.auth.registerSubtitle,
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <div className="rounded-xl border bg-card p-8">
        <h1 className="text-2xl font-bold mb-1">{es.auth.registerHeading}</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          {es.auth.registerDescription}
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
