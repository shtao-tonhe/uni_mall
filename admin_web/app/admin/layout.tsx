'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ProLayout from '@ant-design/pro-layout'
import { ShoppingOutlined, AppstoreOutlined, TeamOutlined, DashboardOutlined, OrderedListOutlined } from '@ant-design/icons'
import { isAuthenticated, clearAuth, getAdminInfo, type AdminInfo } from '@/lib/auth'
import { Dropdown, Avatar, Space } from 'antd'
import Link from 'next/link'

const menuItems = [
  {
    path: '/admin/dashboard',
    name: '工作台',
    icon: <DashboardOutlined />,
  },
  {
    path: '/admin/categories',
    name: '分类管理',
    icon: <AppstoreOutlined />,
  },
  {
    path: '/admin/products',
    name: '商品管理',
    icon: <ShoppingOutlined />,
  },
  {
    path: '/admin/orders',
    name: '订单管理',
    icon: <OrderedListOutlined />,
  },
  {
    path: '/admin/users',
    name: '用户管理',
    icon: <TeamOutlined />,
  },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<AdminInfo | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
      return
    }
    setAdmin(getAdminInfo())
  }, [router])

  if (!admin) return null

  const handleLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  return (
    <ProLayout
      title="UniMall Admin"
      logo="https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg"
      layout="mix"
      navTheme="light"
      fixedHeader
      fixSiderbar
      menuItemRender={(item, dom) => (
        <Link href={item.path || '/'}>{dom}</Link>
      )}
      route={{
        path: '/admin',
        routes: menuItems,
      }}
      location={{ pathname }}
      avatarProps={{
        render: () => (
          <Dropdown
            menu={{
              items: [
                { key: 'logout', label: '退出登录', onClick: handleLogout },
              ],
            }}
          >
            <Space style={{ cursor: 'pointer', paddingRight: 16 }}>
              <Avatar size="small" src={admin.avatar || undefined} icon={!admin.avatar}>
                {admin.nickname?.charAt(0) || admin.username?.charAt(0)}
              </Avatar>
              <span>{admin.nickname || admin.username}</span>
            </Space>
          </Dropdown>
        ),
      }}
    >
      {children}
    </ProLayout>
  )
}
