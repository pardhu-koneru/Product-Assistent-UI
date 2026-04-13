import { Outlet } from "react-router";
import Navbar from "~/components/common/Navbar";

/**
 * PublicLayout — shared wrapper for all customer-facing pages.
 * Renders Navbar at top, page content in middle, footer at bottom.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 py-4 sm:py-6">
        <p className="text-center text-xs sm:text-sm text-white">
          &copy; 2024 ShopAI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
