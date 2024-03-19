'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/auth'
import SidebarNav from '@/components/Layouts/SidebarNav'
import '../../../css/style.css'

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth({ middleware: 'auth' })

  return (
    <div className="flex">
      <SidebarNav user={user} />
      {/* Page Content */}
      <main>{children}</main>
    </div>
  )
}

export default AppLayout
