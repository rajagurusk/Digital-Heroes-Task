import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">

        <h1
          onClick={() => navigate("/")}
          className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer text-center"
        >
          Lead Management System
        </h1>

        <div className="flex items-center gap-3 sm:gap-4">

          <button
            onClick={() => navigate("/admin-login")}
            className="px-3 sm:px-5 py-2 text-sm sm:text-base rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
          >
            Admin Login
          </button>

          <button
            onClick={() => navigate("/member-login")}
            className="px-3 sm:px-5 py-2 text-sm sm:text-base rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Member Login
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;