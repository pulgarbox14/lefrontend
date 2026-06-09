// Image produit avec repli élégant quand aucune URL n'est fournie.
import { categoryEmoji } from "~/lib/categories";
import { cn } from "./ui";

export function ProductImage({
  src,
  category,
  alt,
  className,
}: {
  src?: string;
  category?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-5xl",
        className,
      )}
      aria-hidden="true"
    >
      {categoryEmoji(category)}
    </div>
  );
}
