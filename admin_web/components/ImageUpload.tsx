'use client'

import { useState } from 'react'
import { Upload, Button, Image, message } from 'antd'
import { UploadOutlined, DeleteOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { ossUrl } from '@/lib/oss'
import api from '@/lib/api'

interface Props {
  value?: string
  onChange?: (url: string) => void
  type?: 'image' | 'video'
}

export default function ImageUpload({ value, onChange, type = 'image' }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res: any = await api.post('/base/admin/upload', formData)
      onChange?.(res.data.objectName)
      return false
    } catch (err: any) {
      message.error(err?.message || '上传失败')
      return false
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange?.('')
  }

  if (value) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {type === 'video' ? (
          <video src={ossUrl(value)} controls style={{ maxWidth: 200, maxHeight: 200, borderRadius: 4 }} />
        ) : (
          <Image src={ossUrl(value)} width={120} height={120} style={{ objectFit: 'cover', borderRadius: 4 }} alt="" />
        )}
        <Button
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={handleRemove}
          style={{ position: 'absolute', top: -8, right: -8 }}
        />
      </div>
    )
  }

  return (
    <Upload
      accept={type === 'video' ? 'video/mp4,video/mov,video/webm' : 'image/jpeg,image/png,image/gif,image/webp'}
      showUploadList={false}
      beforeUpload={handleUpload}
    >
      <Button icon={type === 'video' ? <VideoCameraOutlined /> : <UploadOutlined />} loading={uploading}>
        {type === 'video' ? '上传视频' : '上传图片'}
      </Button>
    </Upload>
  )
}
