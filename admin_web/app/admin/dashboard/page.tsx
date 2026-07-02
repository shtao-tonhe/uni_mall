'use client'

import { Card, Col, Row, Statistic } from 'antd'
import { ShoppingOutlined, TeamOutlined, AppstoreOutlined, DollarOutlined } from '@ant-design/icons'

export default function DashboardPage() {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>工作台</h2>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card><Statistic title="商品总数" value={0} prefix={<ShoppingOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="分类数量" value={0} prefix={<AppstoreOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="用户总数" value={0} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日订单" value={0} prefix={<DollarOutlined />} /></Card>
        </Col>
      </Row>
    </div>
  )
}
