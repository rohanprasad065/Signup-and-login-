import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 drop-shadow-sm">
        Welcome
      </h1>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
