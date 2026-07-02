'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, Form, Input, InputNumber, Select, Button, Switch, Space, message, Spin } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import api from '@/lib/api'
import ImageUpload from '@/components/ImageUpload'
import SpecManager from '@/components/SpecManager'

interface Category {
  id: string
  name: string
}

interface SpecDimension {
  key: string
  values: string[]
}

interface SpecCombination {
  specKey: string
  specName: string
  price: number
  stock: number
  image: string
}

export default function ProductEditPage() {
  const params = useParams()
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [descImages, setDescImages] = useState<string[]>([])

  const isNew = params.id === 'new'

  const [specType, setSpecType] = useState(0)
  const [specData, setSpecData] = useState<SpecDimension[]>([])
  const [specs, setSpecs] = useState<SpecCombination[]>([])
  const [customParams, setCustomParams] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    api.get('/base/category/all').then((res: any) => setCategories(res.data || []))
    if (!isNew) {
      setLoading(true)
      api.get('/base/product/detail', { params: { id: params.id } })
        .then((res: any) => {
          const p = res.data
          form.setFieldsValue({
            name: p.name,
            categoryId: p.categoryId,
            price: p.price,
            marketPrice: p.marketPrice,
            stock: p.stock,
            image: p.image,
            isHot: p.isHot,
            isNew: p.isNew,
            isRecommend: p.isRecommend,
            sort: p.sort,
            status: p.status,
          })
          setImages(Array.isArray(p.images) ? p.images : (p.images ? p.images.split(',').filter(Boolean) : []))
          setDescImages(p.desc ? p.desc.split(',').filter(Boolean) : [])
          setSpecType(p.specType || 0)
          if (p.specData) {
            const parsed = typeof p.specData === 'string' ? JSON.parse(p.specData) : p.specData
            setSpecData(Array.isArray(parsed) ? parsed : [])
          }
          if (p.specs?.length) {
            setSpecs(p.specs.map((s: any) => ({ specKey: s.specKey, specName: s.specName, price: Number(s.price), stock: s.stock, image: s.image })))
          }
          if (p.params) {
            const parsed = typeof p.params === 'string' ? JSON.parse(p.params) : p.params
            setCustomParams(Array.isArray(parsed) ? parsed : [])
          }
        })
        .finally(() => setLoading(false))
    }
  }, [params.id, isNew, form])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    setSubmitting(true)
    try {
      const payload: any = {
        ...values,
        images: images.join(','),
        desc: descImages.join(','),
        specType,
        specData: JSON.stringify(specData),
        specs,
        params: JSON.stringify(customParams),
        price: specType > 0 && specs.length ? specs[0].price : values.price,
        stock: specType > 0 && specs.length ? specs.reduce((s, it) => s + it.stock, 0) : values.stock,
        marketPrice: values.marketPrice || 0,
      }

      if (isNew) {
        await api.post('/base/product/', payload)
        message.success('创建成功')
      } else {
        await api.put('/base/product/', { id: params.id, ...payload })
        message.success('保存成功')
      }
      router.push('/admin/products')
    } catch (err: any) {
      message.error(err?.message || '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spin style={{ display: 'block', marginTop: 100 }} />

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 style={{ marginBottom: 24 }}>{isNew ? '新增商品' : '编辑商品'}</h2>
      <Form form={form} layout="vertical" preserve={false}>
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="所属分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select
              showSearch
              placeholder="选择分类"
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="price" label="价格" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="¥" style={{ width: 160 }} disabled={specType > 0} />
            </Form.Item>
            <Form.Item name="marketPrice" label="原价">
              <InputNumber min={0} prefix="¥" style={{ width: 160 }} />
            </Form.Item>
            <Form.Item name="stock" label="库存" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: 140 }} disabled={specType > 0} />
            </Form.Item>
          </Space>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>封面图</div>
            <Form.Item name="image">
              <ImageUpload />
            </Form.Item>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>轮播图</div>
            <Space wrap>
              {images.map((url, i) => (
                <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                  <ImageUpload value={url} onChange={() => {
                    const next = images.filter((_, j) => j !== i)
                    setImages(next)
                  }} />
                </div>
              ))}
              <ImageUpload value="" onChange={(url) => setImages([...images, url])} />
            </Space>
          </div>
        </Card>

        <Card title="自定义参数" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>商品补充说明，如：产地、保质期等</div>
          {customParams.map((item, i) => (
            <Space key={i} style={{ marginBottom: 8, display: 'flex' }} align="center">
              <Input size="small" placeholder="标签" value={item.label} onChange={(e) => {
                const next = customParams.map((p, j) => j === i ? { ...p, label: e.target.value } : p)
                setCustomParams(next)
              }} style={{ width: 120 }} />
              <Input size="small" placeholder="值" value={item.value} onChange={(e) => {
                const next = customParams.map((p, j) => j === i ? { ...p, value: e.target.value } : p)
                setCustomParams(next)
              }} style={{ width: 280 }} />
              {customParams.length > 1 && (
                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => setCustomParams(customParams.filter((_, j) => j !== i))} />
              )}
            </Space>
          ))}
          <Button type="dashed" icon={<PlusOutlined />} onClick={() => setCustomParams([...customParams, { label: '', value: '' }])} style={{ width: '100%' }}>
            添加参数
          </Button>
        </Card>

        <Card title="规格设置" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <Switch
              checked={specType > 0}
              onChange={(checked) => {
                if (!checked) {
                  setSpecType(0)
                  setSpecData([])
                  setSpecs([])
                } else {
                  setSpecType(1)
                  const dims: SpecDimension[] = [{ key: '规格', values: ['默认'] }]
                  setSpecData(dims)
                  setSpecs([{ specKey: '规格', specName: '默认', price: 0, stock: 0, image: '' }])
                }
              }}
            />
            <span style={{ marginLeft: 8, color: '#666' }}>启用规格</span>
          </div>
          {specType > 0 && (
            <SpecManager
              specType={specType}
              specData={specData}
              specs={specs}
              onChange={(data) => {
                setSpecType(data.specType)
                setSpecData(data.specData)
                setSpecs(data.specs)
              }}
            />
          )}
        </Card>

        <Card title="其他设置" style={{ marginBottom: 16 }}>
          <Space size={16}>
            <Form.Item name="isHot" label="热销" valuePropName="checked" getValueFromEvent={(v: boolean) => v ? 1 : 0}><Switch /></Form.Item>
            <Form.Item name="isNew" label="新品" valuePropName="checked" getValueFromEvent={(v: boolean) => v ? 1 : 0}><Switch /></Form.Item>
            <Form.Item name="isRecommend" label="推荐" valuePropName="checked" getValueFromEvent={(v: boolean) => v ? 1 : 0}><Switch /></Form.Item>
          </Space>
          <Form.Item name="sort" label="排序"><InputNumber min={0} style={{ width: 120 }} /></Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select options={[{ label: '上架', value: 1 }, { label: '下架', value: 0 }]} style={{ width: 120 }} />
          </Form.Item>
          <div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>商品详情（上传详情图片）</div>
            <Space wrap>
              {descImages.map((url, i) => (
                <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                  <ImageUpload value={url} onChange={() => {
                    const next = descImages.filter((_, j) => j !== i)
                    setDescImages(next)
                  }} />
                </div>
              ))}
              <ImageUpload value="" onChange={(url) => setDescImages([...descImages, url])} />
            </Space>
          </div>
        </Card>
      </Form>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button onClick={() => router.back()}>取消</Button>
        <Button type="primary" loading={submitting} onClick={handleSubmit}>保存</Button>
      </div>
    </div>
  )
}
