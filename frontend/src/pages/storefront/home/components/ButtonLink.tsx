import { Link } from "react-router-dom";

export function ButtonLink() {
  return (
    <Link
      to="/"
      className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
    >
      ← All products
    </Link>
  );
}
