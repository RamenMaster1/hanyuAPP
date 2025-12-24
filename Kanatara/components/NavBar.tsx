import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const navItems = [
  { href: "/ladder", label: "梯度学习" },
  { href: "/exam", label: "真题练习" },
  { href: "/vocab", label: "词汇学习" },
  { href: "/video", label: "视频模块" },
  { href: "/tasks", label: "社区任务" },
  { href: "/user", label: "用户中心" },
  { href: "/assistant", label: "AI助手" },
];

export const NavBar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="w-full px-6 lg:px-12 py-3 flex items-center justify-between relative">
        {/* Kanatara Title with padding-left */}
        <Link href="/">
          <span className="text-xl font-semibold text-primary pl-8 md:pl-0">Kanatara</span> {/* Added padding-left for small screens */}
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md transition-colors ${
                router.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-slate-500 hidden sm:inline">{user.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-primary">
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                注册
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu - Positioned to the left near the logo */}
        <div className="md:hidden flex items-center absolute left-4 top-4">
          <button
            className="text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col gap-4 p-4 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.href}
                className={`text-left px-3 py-2 rounded-md transition-colors ${
                  router.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:text-primary"
                }`}
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push(item.href);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
