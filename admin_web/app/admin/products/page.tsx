'use client'

import { Button, Space, Tag, Image } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import ProTable from '@ant-design/pro-table'
import type { ProColumns } from '@ant-design/pro-table'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { ossUrl } from '@/lib/oss'

interface Product {
  id: string
  name: string
  image: string
  price: string
  stock: number
  sales: number
  status: number
  isHot: number
  isNew: number
  createdAt: string
}

export default function ProductsPage() {
  const router = useRouter()

  const columns: ProColumns<Product>[] = [
    {
      title: '商品',
      dataIndex: 'name',
      width: 280,
      render: (_, record) => (
        <Space>
          <Image src={ossUrl(record.image)} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} preview={false} alt="" />
          <span>{record.name}</span>
        </Space>
      ),
    },
    { title: '价格', dataIndex: 'price', width: 100, valueType: 'money', align: 'right' },
    { title: '库存', dataIndex: 'stock', width: 80, align: 'right', hideInSearch: true },
    { title: '销量', dataIndex: 'sales', width: 80, align: 'right', hideInSearch: true },
    {
      title: '状态', dataIndex: 'status', width: 100, valueType: 'select',
      valueEnum: { 1: { text: '上架', status: 'Success' }, 0: { text: '下架', status: 'Error' } },
    },
    {
      title: '推荐', key: 'flags', width: 120, hideInSearch: true,
      render: (_, record) => (
        <Space>
          {record.isHot ? <Tag color="red">热销</Tag> : null}
          {record.isNew ? <Tag color="blue">新品</Tag> : null}
        </Space>
      ),
    },
    {
      title: '操作', key: 'action', width: 120, hideInSearch: true,
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => router.push(`/admin/products/edit/${record.id}`)}>
          编辑
        </Button>
      ),
    },
  ]

  return (
    <div>
      <ProTable<Product>
        columns={columns}
        request={async (params) => {
          const res: any = await api.get('/base/product/', {
            params: { page: params.current, pageSize: params.pageSize, name: params.name, status: params.status },
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
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => router.push('/admin/products/edit/new')}>
            新增商品
          </Button>,
        ]}
      />
    </div>
  )
}
