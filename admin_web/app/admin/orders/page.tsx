'use client'

import { useState } from 'react'
import { Tag, Button, Space, Drawer, Descriptions, Table, message, Modal, Input, Select, DatePicker } from 'antd'
import ProTable from '@ant-design/pro-table'
import type { ProColumns } from '@ant-design/pro-table'
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
import api from '@/lib/api'

const { RangePicker } = DatePicker

interface OrderItem {
  productName: string
  productImage: string
  specName: string
  price: number
  num: number
  subtotal: number
}

interface Order {
  id: string
  orderNo: string
  status: number
  totalAmount: number
  payAmount: number
  freightAmount: number
  consignee: string
  phone: string
  address: string
  remark: string
  deliveryCompany: string
  deliveryNo: string
  createdAt: string
  payTime: string
  deliveryTime: string
  receiveTime: string
  items: OrderItem[]
  user: { nickname: string; phone: string }
}

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待付款', color: 'orange' },
  1: { text: '待发货', color: 'blue' },
  2: { text: '待收货', color: 'cyan' },
  3: { text: '已完成', color: 'green' },
  4: { text: '已取消', color: 'default' },
  5: { text: '售后中', color: 'red' },
}

export default function OrdersPage() {
  const [detailVisible, setDetailVisible] = useState(false)
  const [detail, setDetail] = useState<Order | null>(null)
  const [deliverVisible, setDeliverVisible] = useState(false)
  const [deliverOrder, setDeliverOrder] = useState<Order | null>(null)
  const [deliverCompany, setDeliverCompany] = useState('')
  const [deliverNo, setDeliverNo] = useState('')
  const [deliverLoading, setDeliverLoading] = useState(false)

  const columns: ProColumns<Order>[] = [
    {
      title: '订单号', dataIndex: 'orderNo', width: 200, copyable: true,
      hideInSearch: true,
    },
    {
      title: '订单号', dataIndex: 'orderNo', key: 'orderNo-search', hideInTable: true,
    },
    {
      title: '用户', width: 120,
      render: (_, record) => record.user?.nickname || record.user?.phone || '-',
      hideInSearch: true,
    },
    {
      title: '状态', dataIndex: 'status', width: 100,
      valueEnum: Object.fromEntries(
        Object.entries(statusMap).map(([k, v]) => [k, { text: v.text }])
      ),
      render: (_, record) => {
        const s = statusMap[record.status] || { text: '未知', color: 'default' }
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    {
      title: '实付金额', dataIndex: 'payAmount', width: 120,
      render: (_, record) => `¥${Number(record.payAmount).toFixed(2)}`,
      hideInSearch: true,
    },
    {
      title: '收货人', dataIndex: 'consignee', width: 100,
      hideInSearch: true,
    },
    {
      title: '下单时间', dataIndex: 'createdAt', valueType: 'dateTime', width: 180, hideInSearch: true,
    },
    {
      title: '下单时间', key: 'dateRange', hideInTable: true,
      renderFormItem: () => <RangePicker style={{ width: 240 }} />,
      search: { transform: (value: any) => {
        if (!value) return {}
        return { startDate: value[0].format('YYYY-MM-DD'), endDate: value[1].format('YYYY-MM-DD') }
      }},
    },
    {
      title: '操作', width: 180, hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => showDetail(record.id)}>
            详情
          </Button>
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => showDeliver(record)}>
              发货
            </Button>
          )}
          {record.status === 0 && (
            <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleCancel(record.id)}>
              取消
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const showDetail = async (id: string) => {
    try {
      const res: any = await api.get('/base/admin-order/detail', { params: { id } })
      setDetail(res.data)
      setDetailVisible(true)
    } catch { message.error('获取订单详情失败') }
  }

  const showDeliver = (order: Order) => {
    setDeliverOrder(order)
    setDeliverCompany('')
    setDeliverNo('')
    setDeliverVisible(true)
  }

  const handleDeliver = async () => {
    if (!deliverCompany || !deliverNo) {
      message.warning('请填写物流信息')
      return
    }
    setDeliverLoading(true)
    try {
      await api.post('/base/admin-order/deliver', { id: deliverOrder!.id, deliveryCompany: deliverCompany, deliveryNo: deliverNo })
      message.success('发货成功')
      setDeliverVisible(false)
      setDetailVisible(false)
    } catch (err: any) {
      message.error(err?.message || '发货失败')
    } finally {
      setDeliverLoading(false)
    }
  }

  const handleCancel = (id: string) => {
    Modal.confirm({
      title: '确认取消订单？',
      content: '取消后库存将自动释放',
      onOk: async () => {
        try {
          await api.post('/base/admin-order/cancel', { id })
          message.success('已取消')
        } catch (err: any) {
          message.error(err?.message || '取消失败')
        }
      },
    })
  }

  return (
    <div>
      <ProTable<Order>
        columns={columns}
        request={async (params) => {
          const { current, pageSize, orderNo, status, startDate, endDate, ...rest } = params
          const res: any = await api.get('/base/admin-order/', {
            params: { page: current, pageSize, orderNo, status, startDate, endDate },
          })
          return { data: res.data.list, total: res.data.total, success: true }
        }}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        search={{
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
      />

      <Drawer
        title={`订单详情 #${detail?.orderNo || ''}`}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        width={600}
      >
        {detail && (
          <>
            <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="订单号" span={2}>{detail.orderNo}</Descriptions.Item>
              <Descriptions.Item label="订单状态" span={2}>
                <Tag color={statusMap[detail.status]?.color}>{statusMap[detail.status]?.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="用户">{detail.user?.nickname || '-'}</Descriptions.Item>
              <Descriptions.Item label="手机号">{detail.user?.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="收货人">{detail.consignee}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{detail.phone}</Descriptions.Item>
              <Descriptions.Item label="收货地址" span={2}>{detail.address}</Descriptions.Item>
              <Descriptions.Item label="商品金额">¥{Number(detail.totalAmount).toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="运费">¥{Number(detail.freightAmount).toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="实付金额" span={2}>
                <span style={{ color: '#f5222d', fontWeight: 600 }}>¥{Number(detail.payAmount).toFixed(2)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="用户备注" span={2}>{detail.remark || '-'}</Descriptions.Item>
              {detail.deliveryCompany && (
                <Descriptions.Item label="物流公司">{detail.deliveryCompany}</Descriptions.Item>
              )}
              {detail.deliveryNo && (
                <Descriptions.Item label="物流单号">{detail.deliveryNo}</Descriptions.Item>
              )}
              <Descriptions.Item label="下单时间">{dayjs(detail.createdAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="付款时间">{detail.payTime ? dayjs(detail.payTime).format('YYYY-MM-DD HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="发货时间">{detail.deliveryTime ? dayjs(detail.deliveryTime).format('YYYY-MM-DD HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="收货时间">{detail.receiveTime ? dayjs(detail.receiveTime).format('YYYY-MM-DD HH:mm') : '-'}</Descriptions.Item>
            </Descriptions>

            <h4 style={{ marginBottom: 8 }}>商品列表</h4>
            <Table
              dataSource={detail.items}
              rowKey={(_, i) => String(i)}
              pagination={false}
              size="small"
              columns={[
                { title: '商品', dataIndex: 'productName', render: (v, r) => (
                  <Space>
                    {r.productImage ? <img src={r.productImage} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : null}
                    <span>{v}</span>
                  </Space>
                )},
                { title: '规格', dataIndex: 'specName', render: (v) => v || '-' },
                { title: '单价', dataIndex: 'price', render: (v) => `¥${Number(v).toFixed(2)}` },
                { title: '数量', dataIndex: 'num' },
                { title: '小计', dataIndex: 'subtotal', render: (v) => `¥${Number(v).toFixed(2)}` },
              ]}
            />

            {detail.status === 1 && (
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => showDeliver(detail)}>
                  发货
                </Button>
              </div>
            )}
          </>
        )}
      </Drawer>

      <Modal
        title="发货"
        open={deliverVisible}
        onCancel={() => setDeliverVisible(false)}
        onOk={handleDeliver}
        confirmLoading={deliverLoading}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            placeholder="选择物流公司"
            value={deliverCompany || undefined}
            onChange={setDeliverCompany}
            style={{ width: '100%' }}
            options={[
              { label: '顺丰速运', value: '顺丰速运' },
              { label: '中通快递', value: '中通快递' },
              { label: '圆通速递', value: '圆通速递' },
              { label: '韵达快递', value: '韵达快递' },
              { label: '京东快递', value: '京东快递' },
              { label: 'EMS', value: 'EMS' },
              { label: '极兔速递', value: '极兔速递' },
            ]}
          />
          <Input placeholder="物流单号" value={deliverNo} onChange={(e) => setDeliverNo(e.target.value)} />
        </Space>
      </Modal>
    </div>
  )
}
