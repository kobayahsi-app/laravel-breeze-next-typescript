import { useState } from 'react'
import { usePathname } from 'next/navigation'

import NavLink from '@/components/NavLink'
import ResponsiveNavLink, {
  ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'

import { UserType } from '@/types/User'
import { useAuth } from '@/hooks/auth'
import '../../css/style.css'

const SidebarNav = ({ user }: { user: UserType }) => {
  const pathname = usePathname()

  const { logout } = useAuth({})
  const [open, setOpen] = useState<boolean>(false)

  return (
    <nav className="sidebar">
      {/* Primary Navigation Menu */}
      <div className="">
        <div className="">
          {/* Navigation Links */}
          <div className="nav_list">
            <NavLink href={`/admin/dashboard`} active={pathname === `/admin/dashboard`}>
              TOP
            </NavLink>
          </div>
          <div className="nav_list">
            <NavLink href={`/admin/sheets`} active={pathname === `/admin/sheets`}>
              問診票
            </NavLink>
          </div>
          <div className="nav_list">
            <NavLink href="/admin/setting" active={pathname === '/admin/setting'}>
              設定
            </NavLink>
          </div>
          <div onClick={logout} className="nav_list">
            <NavLink href="/admin/login" active={pathname === '/logout'}>
              ログアウト
            </NavLink>
          </div>
        </div>

        {/* Hamburger */}
        <div className="-mr-2 flex items-center sm:hidden">
          <button
            onClick={() => setOpen(open => !open)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24">
              {open ? (
                <path
                  className="inline-flex"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  className="inline-flex"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Responsive Navigation Menu */}
      {open && (
        <div className="block sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink
              href="/admin/dashboard"
              active={pathname === '/admin/dashboard'}>
              Dashboard
            </ResponsiveNavLink>
          </div>

          {/* Responsive Settings Options */}
          <div className="pt-4 pb-1 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-10 w-10 fill-current text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div className="ml-3">
                <div className="font-medium text-base text-gray-800">
                  {user?.clinic_name}
                </div>
                <div className="font-medium text-sm text-gray-500">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              {/* Authentication */}
              <ResponsiveNavButton onClick={logout}>Logout</ResponsiveNavButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default SidebarNav
