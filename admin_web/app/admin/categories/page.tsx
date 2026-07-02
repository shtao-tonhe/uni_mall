'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import api from '@/lib/api'

interface Category {
  id: string
  name: string
  pid: string
  level: number
  sort: number
  status: number
  children?: Category[]
}

export default function CategoriesPage() {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res: any = await api.get('/base/category/tree')
      setData(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async () => {
    const raw = await form.validateFields()
    const values = { ...raw, id: editItem?.id ? String(editItem.id) : undefined, pid: raw.pid ? String(raw.pid) : '' }
    try {
      if (editItem) {
        await api.put('/base/category/', { id: editItem.id, ...values })
        message.success('更新成功')
      } else {
        await api.post('/base/category/', values)
        message.success('创建成功')
      }
      setModalOpen(false)
      fetchData()
    } catch (err: any) {
      message.error(err?.message || '操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete('/base/category/', { data: { id } })
      message.success('删除成功')
      fetchData()
    } catch (err: any) {
      message.error(err?.message || '删除失败')
    }
  }

  const openEdit = (item: Category) => {
    setEditItem(item)
    setModalOpen(true)
  }

  const openCreate = () => {
    setEditItem(null)
    setModalOpen(true)
  }

  const columns: ColumnsType<Category> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v: number) => v === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
    },
    {
      title: '操作', key: 'action', width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>分类管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增分类</Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        defaultExpandAllRows
      />

      <Modal
        title={editItem ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}
          key={editItem?.id || 'create'}
          initialValues={editItem ? {
            name: editItem.name,
            pid: editItem.pid,
            sort: editItem.sort,
            status: editItem.status,
          } : { pid: '', sort: 0, status: 1 }}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="pid" label="父级分类" initialValue="">
            <Select
              allowClear
              placeholder="顶级分类"
              options={data.filter(c => c.id).map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
