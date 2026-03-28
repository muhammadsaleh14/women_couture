import { Link } from "react-router-dom";

export function ButtonLink() {
  return (
    <Link
      to="/"
      className="text-sm font-medium text-stone-700 underline-offset-4 hover:underline"
    >
      ← All products
    </Link>
  );
}
