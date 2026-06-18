"use client";

import { Star } from "lucide-react";
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
        toast.success(`${cryptoName} eliminado de favoritos`);
      } else {
        await api.favorites.add(cryptoId);
        toast.success(`${cryptoName} añadido a favoritos`);
      }
      onToggle(cryptoId);
    } catch {
      toast.error("Error al actualizar favoritos");
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
          ? `Quitar ${cryptoName} de favoritos`
          : `Añadir ${cryptoName} a favoritos`
      }
    >
      <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
    </button>
  );
}
