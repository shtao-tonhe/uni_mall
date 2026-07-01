const config = require('../../config')
const logger = require('../../utils/logger')

class SmsService {
  async sendCode(phone, code) {
    if (!config.sms.accessKey || !config.sms.secretKey) {
      logger.info(`[DEV SMS] 发送验证码 ${code} 到 ${phone}`)
      return
    }

    const { accessKey, secretKey, signName, loginTemplate } = config.sms
    const Core = require('@alicloud/pop-core')
    const client = new Core({ accessKeyId: accessKey, accessKeySecret: secretKey, endpoint: 'https://dysmsapi.aliyuncs.com', apiVersion: '2017-05-25' })

    await client.request('SendSms', {
      PhoneNumbers: phone,
      SignName: signName,
      TemplateCode: loginTemplate,
      TemplateParam: JSON.stringify({ code }),
    })
  }
}

module.exports = new SmsService()
