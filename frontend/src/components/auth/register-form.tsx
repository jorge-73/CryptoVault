"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/use-translations";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";

export function RegisterForm() {
  const t = useTranslations();
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(email, password, name || undefined);
      toast.success(t.auth.toastRegisterSuccess);
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || t.auth.toastRegisterError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          {t.auth.nameLabel} <span className="text-muted-foreground">{t.auth.nameOptional}</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none ring-ring transition-all focus:ring-2 focus:ring-accent focus:border-accent"
          placeholder={t.auth.namePlaceholder}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          {t.auth.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none ring-ring transition-all focus:ring-2 focus:ring-accent focus:border-accent"
          placeholder={t.auth.emailPlaceholder}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5">
          {t.auth.passwordLabel}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-lg border bg-background px-4 py-2.5 pr-10 text-sm outline-none ring-ring transition-all focus:ring-2 focus:ring-accent focus:border-accent"
            placeholder={t.auth.passwordMinPlaceholder}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors active:scale-90"
            aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-all active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        {loading ? t.auth.registerLoading : t.auth.registerButton}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {t.auth.hasAccount}{" "}
        <Link href="/auth/login" className="text-accent hover:underline font-medium">
          {t.auth.loginLink}
        </Link>
      </p>
    </form>
  );
}
