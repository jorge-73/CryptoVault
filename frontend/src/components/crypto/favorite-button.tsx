"use client";

import { Star } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FavoriteButtonProps {
  cryptoId: string;
  cryptoName: string;
  isFavorite: boolean;
  onToggle: (id: string) => void;
}

export function FavoriteButton({
  cryptoId,
  cryptoName,
  isFavorite,
  onToggle,
}: FavoriteButtonProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await api.favorites.remove(cryptoId);
        toast.success(t.coinDetail.toastRemoved);
      } else {
        await api.favorites.add(cryptoId);
        toast.success(t.coinDetail.toastAdded);
      }
      onToggle(cryptoId);
    } catch {
      toast.error(t.coinDetail.toastError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
        isFavorite
          ? "text-yellow-500 hover:text-yellow-600"
          : "text-muted-foreground hover:text-yellow-500"
      )}
      aria-label={
        isFavorite
          ? t.coinDetail.favoriteRemove(cryptoName)
          : t.coinDetail.favoriteAdd(cryptoName)
      }
    >
      <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
    </button>
  );
}
