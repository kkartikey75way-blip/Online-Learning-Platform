import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        Unauthorized !!
      </h1>
      <Link to="/" className="underline">
        Go back
      </Link>
    </div>
  );
}
