'use client'

import { useState } from 'react'
import { Radio, Input, Button, Table, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import ImageUpload from './ImageUpload'
import type { ColumnsType } from 'antd/es/table'

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

interface SpecRow {
  specKey: string
  specName: string
  price: number
  stock: number
  image: string
}

interface Props {
  specType: number
  specData: SpecDimension[]
  specs: SpecCombination[]
  onChange: (data: { specType: number; specData: SpecDimension[]; specs: SpecCombination[] }) => void
}

function cartesian(dimensions: SpecDimension[]): { specKey: string; specName: string }[] {
  if (!dimensions.length || dimensions.some((d) => !d.values.length)) return []

  const combine = (i: number, keys: string[], names: string[]): { specKey: string; specName: string }[] => {
    if (i >= dimensions.length) return [{ specKey: keys.join(';'), specName: names.join(';') }]
    const result: { specKey: string; specName: string }[] = []
    for (const val of dimensions[i].values) {
      result.push(...combine(i + 1, [...keys, val], [...names, val]))
    }
    return result
  }
  return combine(0, [], [])
}

export default function SpecManager({ specType, specData, specs, onChange }: Props) {
  const [dimensions, setDimensions] = useState<SpecDimension[]>(specData.length ? specData : [{ key: '', values: [''] }])
  const [rows, setRows] = useState<SpecRow[]>(specs.length ? specs : [{ specKey: '', specName: '', price: 0, stock: 0, image: '' }])

  const emit = (dims: SpecDimension[], items: SpecRow[] | SpecCombination[]) => {
    onChange({ specType, specData: dims, specs: items as SpecCombination[] })
  }

  const handleSpecTypeChange = (v: number) => {
    if (v === 1) {
      const dims = [{ key: '', values: [''] }]
      const items = [{ specKey: '', specName: '', price: 0, stock: 0, image: '' }]
      setDimensions(dims)
      setRows(items)
      onChange({ specType: v, specData: dims, specs: items })
    } else if (v === 2) {
      const dims = [{ key: '', values: [''] }]
      setDimensions(dims)
      const combos = cartesian(dims)
      setRows([])
      onChange({ specType: v, specData: dims, specs: combos.map((c) => ({ ...c, price: 0, stock: 0, image: '' })) })
    }
  }

  const updateRow = (i: number, field: string, value: any) => {
    const next = rows.map((r, j) => (j === i ? { ...r, [field]: value } : r))
    setRows(next)
    emit(dimensions, next)
  }

  const addRow = () => {
    const next = [...rows, { specKey: '', specName: '', price: 0, stock: 0, image: '' }]
    setRows(next)
    emit(dimensions, next)
  }

  const removeRow = (i: number) => {
    if (rows.length <= 1) return
    const next = rows.filter((_, j) => j !== i)
    setRows(next)
    emit(dimensions, next)
  }

  const addDimensionValue = (di: number) => {
    const next = dimensions.map((d, j) => j === di ? { ...d, values: [...d.values, ''] } : d)
    setDimensions(next)
    const combos = cartesian(next)
    emit(next, combos.map((c) => {
      const existing = specs.find((s) => s.specName === c.specName)
      return existing || { ...c, price: 0, stock: 0, image: '' }
    }))
  }

  const updateDimensionValue = (di: number, vi: number, val: string) => {
    const next = dimensions.map((d, j) => j === di ? { ...d, values: d.values.map((v, k) => k === vi ? val : v) } : d)
    setDimensions(next)
    const combos = cartesian(next)
    emit(next, combos.map((c) => {
      const existing = specs.find((s) => s.specName === c.specName)
      return existing || { ...c, price: 0, stock: 0, image: '' }
    }))
  }

  const removeDimensionValue = (di: number, vi: number) => {
    const next = dimensions.map((d, j) => j === di ? { ...d, values: d.values.filter((_, k) => k !== vi) } : d)
    setDimensions(next)
    const combos = cartesian(next)
    emit(next, combos.map((c) => {
      const existing = specs.find((s) => s.specName === c.specName)
      return existing || { ...c, price: 0, stock: 0, image: '' }
    }))
  }

  const updateDimensionKey = (di: number, key: string) => {
    const next = dimensions.map((d, j) => j === di ? { ...d, key } : d)
    setDimensions(next)
    const combos = cartesian(next)
    emit(next, combos.map((c) => {
      const existing = specs.find((s) => s.specName === c.specName)
      return existing || { ...c, price: 0, stock: 0, image: '' }
    }))
  }

  const addDimension = () => {
    const next = [...dimensions, { key: '', values: [''] }]
    setDimensions(next)
    const combos = cartesian(next)
    emit(next, combos.map((c) => {
      const existing = specs.find((s) => s.specName === c.specName)
      return existing || { ...c, price: 0, stock: 0, image: '' }
    }))
  }

  const removeDimension = (di: number) => {
    if (dimensions.length <= 1) return
    const next = dimensions.filter((_, j) => j !== di)
    setDimensions(next)
    const combos = cartesian(next)
    emit(next, combos.map((c) => {
      const existing = specs.find((s) => s.specName === c.specName)
      return existing || { ...c, price: 0, stock: 0, image: '' }
    }))
  }

  const comboColumns: ColumnsType<SpecCombination> = [
    ...dimensions.map((dim) => ({
      title: dim.key || '规格',
      key: dim.key,
      width: 100,
      render: (_: any, record: SpecCombination) => {
        const parts = record.specName.split(';')
        const idx = dimensions.indexOf(dim)
        return <span>{parts[idx]}</span>
      },
    })),
    {
      title: '价格', key: 'price', width: 120,
      render: (_: any, record: SpecCombination, idx: number) => (
        <Input type="number" size="small" value={record.price} onChange={(e) => {
          const next = specs.map((s, j) => j === idx ? { ...s, price: Number(e.target.value) } : s)
          onChange({ specType, specData: dimensions, specs: next })
        }} style={{ width: 100 }} addonBefore="¥" />
      ),
    },
    {
      title: '库存', key: 'stock', width: 100,
      render: (_: any, record: SpecCombination, idx: number) => (
        <Input type="number" size="small" value={record.stock} onChange={(e) => {
          const next = specs.map((s, j) => j === idx ? { ...s, stock: Number(e.target.value) } : s)
          onChange({ specType, specData: dimensions, specs: next })
        }} style={{ width: 80 }} />
      ),
    },
    {
      title: '规格图片', key: 'image', width: 140,
      render: (_: any, record: SpecCombination, idx: number) => (
        <ImageUpload value={record.image} onChange={(url) => {
          const next = specs.map((s, j) => j === idx ? { ...s, image: url } : s)
          onChange({ specType, specData: dimensions, specs: next })
        }} />
      ),
    },
  ]

  if (specType === 0) return null

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Radio.Group value={specType} onChange={(e) => handleSpecTypeChange(e.target.value)}>
          <Radio value={1}>单规格</Radio>
          <Radio value={2}>多规格（笛卡尔积）</Radio>
        </Radio.Group>
      </div>

      {specType === 1 && (
        <div>
          <Table
            columns={[
              {
                title: '规格名', key: 'key', width: 120,
                render: (_: any, __: any, i: number) => (
                  <Input size="small" value={rows[i].specKey} onChange={(e) => updateRow(i, 'specKey', e.target.value)} placeholder="如：颜色" />
                ),
              },
              {
                title: '规格值', key: 'val', width: 140,
                render: (_: any, __: any, i: number) => (
                  <Input size="small" value={rows[i].specName} onChange={(e) => updateRow(i, 'specName', e.target.value)} placeholder="如：红色" />
                ),
              },
              {
                title: '价格', key: 'price', width: 120,
                render: (_: any, __: any, i: number) => (
                  <Input type="number" size="small" value={rows[i].price} onChange={(e) => updateRow(i, 'price', Number(e.target.value))} style={{ width: 100 }} addonBefore="¥" />
                ),
              },
              {
                title: '库存', key: 'stock', width: 90,
                render: (_: any, __: any, i: number) => (
                  <Input type="number" size="small" value={rows[i].stock} onChange={(e) => updateRow(i, 'stock', Number(e.target.value))} style={{ width: 70 }} />
                ),
              },
              {
                title: '图片', key: 'image', width: 140,
                render: (_: any, __: any, i: number) => (
                  <ImageUpload value={rows[i].image} onChange={(url) => updateRow(i, 'image', url)} />
                ),
              },
              {
                title: '操作', key: 'action', width: 60,
                render: (_: any, __: any, i: number) => (
                  rows.length > 1 ? <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeRow(i)} /> : null
                ),
              },
            ]}
            dataSource={rows}
            rowKey={(_, i) => String(i)}
            pagination={false}
            size="small"
          />
          <Button type="dashed" icon={<PlusOutlined />} onClick={addRow} style={{ marginTop: 8, width: '100%' }}>
            添加规格
          </Button>
        </div>
      )}

      {specType === 2 && (
        <div style={{ marginBottom: 16 }}>
          {dimensions.map((dim, di) => (
            <div key={di} style={{ marginBottom: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 6 }}>
              <Space style={{ marginBottom: 8, width: '100%' }} align="center">
                <Input
                  placeholder="规格名，如：颜色"
                  value={dim.key}
                  onChange={(e) => updateDimensionKey(di, e.target.value)}
                  style={{ width: 120 }}
                />
                {dimensions.length > 1 && (
                  <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeDimension(di)} />
                )}
              </Space>
              <Space wrap>
                {dim.values.map((val, vi) => (
                  <Space key={vi}>
                    <Input
                      size="small"
                      value={val}
                      onChange={(e) => updateDimensionValue(di, vi, e.target.value)}
                      style={{ width: 100 }}
                    />
                    {dim.values.length > 1 && (
                      <Button danger size="small" type="text" icon={<DeleteOutlined />} onClick={() => removeDimensionValue(di, vi)} />
                    )}
                    {vi === dim.values.length - 1 && (
                      <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={() => addDimensionValue(di)} />
                    )}
                  </Space>
                ))}
              </Space>
            </div>
          ))}
          <Button type="dashed" icon={<PlusOutlined />} onClick={addDimension} style={{ width: '100%' }}>
            添加规格维度
          </Button>
        </div>
      )}

      {(specType === 2 && specs.length > 0) && (
        <Table
          columns={comboColumns}
          dataSource={specs}
          rowKey="specName"
          pagination={false}
          size="small"
        />
      )}
    </div>
  )
}
