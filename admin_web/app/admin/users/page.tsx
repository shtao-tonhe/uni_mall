'use client'

import { Tag } from 'antd'
import ProTable from '@ant-design/pro-table'
import type { ProColumns } from '@ant-design/pro-table'
import api from '@/lib/api'

interface User {
  id: string
  nickname: string
  avatar: string
  phone: string
  gender: number
  status: number
  createdAt: string
}

export default function UsersPage() {
  const columns: ProColumns<User>[] = [
    {
      title: '昵称', dataIndex: 'nickname', width: 160,
      render: (_, record) => (
        <span>{record.nickname || '(未设置昵称)'}</span>
      ),
    },
    {
      title: '手机号', dataIndex: 'phone', width: 140,
      render: (v) => v || '-',
    },
    {
      title: '性别', dataIndex: 'gender', width: 80,
      valueEnum: { 0: { text: '未知' }, 1: { text: '男' }, 2: { text: '女' } },
      hideInSearch: true,
    },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => record.status === 1 ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag>,
      hideInSearch: true,
    },
    { title: '注册时间', dataIndex: 'createdAt', valueType: 'dateTime', width: 180, hideInSearch: true },
  ]

  return (
    <div>
      <ProTable<User>
        columns={columns}
        request={async (params) => {
          const res: any = await api.get('/base/user/profile', {
            params: { page: params.current, pageSize: params.pageSize, nickname: params.nickname, phone: params.phone },
          })
          return {
            data: res.data.list,
            total: res.data.total,
            success: true,
          }
        }}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        search={{
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
      />
    </div>
  )
}
