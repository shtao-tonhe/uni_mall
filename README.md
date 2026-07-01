uni_mall 整体项目根目录标准化结构（前端客户端 + Node 服务端 + Next 管理后台 + 定时任务脚本 四分离）
根目录总览
plaintext
uni_mall/
├── client              # UniApp 微信商城客户端（前文整套分包商城前端）
├── server_api          # Node.js + Express 业务接口服务
├── admin_web           # Next.js 商家管理后台
├── scripts_task        # Node.js 自动化定时/异步处理脚本
├── sql                 # 数据库SQL脚本（基础表 + 扩展功能独立sql-ext）
├── docs                # 项目架构、接口、部署文档（包含你之前的分包规范MD）
├── deploy              # 部署脚本、nginx配置、docker配置
├── README.md           # 项目启动、环境、交付说明
逐个目录细分说明
1. client（UniApp 商城客户端，纯前端，对应之前分包架构）
plaintext
client/
├── manifest.json       # 功能编译开关（分销/拼团/秒杀等ENABLE开关）
├── pages.json          # 动态分包注册、Tab动态渲染配置
├── common/             # 全局公共工具、基础请求、基础组件、基础状态
├── pages/              # 主包：首页/分类/购物车/商品/订单/个人中心等基础页面
├── subPackages/        # 所有付费扩展独立分包（分销、拼团、秒杀、储值等）
├── api/ext/            # 扩展分包专属接口
├── store/ext/          # 扩展业务状态
├── components/ext/     # 扩展活动弹窗、营销组件
├── static/base/        # 极简公共图标，大图全部走OSS
2. server_api（Node.js + Express 核心业务接口服务）
处理商城所有前后端交互：商品、订单、支付、用户、分销、拼团等业务接口
plaintext
server_api/
├── app.js              # 项目入口
├── config/             # 数据库、OSS、微信支付、小程序配置
├── controller/         # 控制器分层
│   ├── base/           # 基础商城控制器（商品、订单、购物车、支付）
│   ├── ext/            # 扩展功能控制器（分销、秒杀、拼团、储值等分文件夹）
├── model/              # 数据库模型
│   ├── base/           # 基础业务表模型
│   ├── ext/            # 扩展功能独立模型
├── routes/             # 路由注册，扩展路由按需挂载
├── service/            # 业务逻辑层
├── middleware/         # 鉴权、参数校验、日志中间件
├── utils/              # 通用工具
├── package.json
3. admin_web（Next.js 商家后台管理系统）
商家登录、商品管理、订单管理、活动配置、Tab 导航自定义、扩展功能开关配置
plaintext
admin_web/
├── src/
│   ├── app/            # Next.js App路由
│   ├── api/            # 后台请求封装
│   ├── components/     # 后台通用组件
│   ├── store/          # 后台状态
│   ├── page/           # 页面：商品、订单、营销配置、Tab自定义配置、权限
├── public/
├── next.config.js
├── package.json
重点页面：底部 Tab 自定义配置页，仅展示当前商家已购买开通的功能，支持排序、显隐、修改图标文字。
4. scripts_task（Node.js 自动化异步 / 定时任务脚本，独立进程运行）
不耦合主接口服务，单独启动，处理延时、轮询逻辑
plaintext
scripts_task/
├── task_order.js       # 订单超时未支付自动取消、关闭订单
├── task_refund.js      # 售后超时自动退款处理
├── task_seckill.js     # 秒杀定时上下架、库存释放
├── task_commission.js  # 分销佣金定时结算、提现自动处理
├── task_coupon.js      # 优惠券过期回收
├── config.js           # 数据库、定时周期配置
├── package.json
运行方式：pm2 单独守护启动，和 server_api 服务完全解耦，互不影响。
5. sql（数据库脚本，区分基础表与扩展插拔脚本，纠正之前混淆点）
plaintext
sql/
├── base.sql            # 商城基础业务建表脚本（用户、商品、订单、购物车、地址）
├── sql-ext/            # 各付费扩展独立建表脚本（非备份，仅建表结构）
│   ├── distribution.sql
│   ├── seckill.sql
│   ├── groupbuy.sql
│   ├── storage.sql
│   └── agent.sql
交付规则：
基础版商家：仅执行 base.sql
加购扩展：按需执行对应 sql-ext 内脚本，表完全隔离无耦合
配套目录补充说明
docs/：存放你之前写好的《UniApp 商城分包架构规范.md》、接口文档、交付套餐说明；
deploy/：存放线上部署脚本、Nginx 反向代理配置、Docker Compose，方便批量交付商家独立部署；
四大模块完全解耦：客户端、接口服务、管理后台、定时任务均可单独修改、单独部署，互不冲突。
给团队一句话说明 sql-ext
sql-ext 不是数据库备份文件，是每个付费扩展功能专属数据表初始化建表脚本，客户购买对应功能后，后端执行对应 SQL 完成数据层能力开通，实现插拔式功能扩展。