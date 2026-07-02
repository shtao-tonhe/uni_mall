-- ========================================
-- 商城基础业务建表脚本（base）
-- 主键/外键使用 bigint unsigned + mysql2 bigNumberStrings
-- JS 层得到字符串，DB 层存 64 位整数
-- ========================================

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id`         bigint unsigned NOT NULL COMMENT '雪花id',
  `openid`     varchar(64)  DEFAULT NULL COMMENT '微信openid',
  `unionid`    varchar(64)  DEFAULT NULL COMMENT '微信unionid',
  `nickname`   varchar(64)  NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar`     varchar(512) NOT NULL DEFAULT '' COMMENT '头像',
  `phone`      varchar(20)  DEFAULT NULL COMMENT '手机号',
  `gender`     tinyint unsigned NOT NULL DEFAULT '0' COMMENT '性别 0未知 1男 2女',
  `status`     tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态 1正常 0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 商品分类表
CREATE TABLE IF NOT EXISTS `category` (
  `id`         bigint unsigned NOT NULL COMMENT '雪花id',
  `name`       varchar(64)  NOT NULL DEFAULT '' COMMENT '分类名称',
  `pid`        bigint unsigned NOT NULL DEFAULT 0 COMMENT '父级id',
  `level`      tinyint unsigned NOT NULL DEFAULT '1' COMMENT '层级 1一级 2二级 3三级',
  `sort`       int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `status`     tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态 1显示 0隐藏',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pid` (`pid`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 商品表
CREATE TABLE IF NOT EXISTS `product` (
  `id`            bigint unsigned NOT NULL COMMENT '雪花id',
  `name`          varchar(256) NOT NULL DEFAULT '' COMMENT '商品名称',
  `image`         varchar(512) NOT NULL DEFAULT '' COMMENT '商品主图',
  `images`        text COMMENT '商品轮播图(JSON数组)',
  `video`         varchar(512) NOT NULL DEFAULT '' COMMENT '商品视频',
  `desc`          text COMMENT '商品详情(纯文本)',
  `category_id`   bigint unsigned NOT NULL DEFAULT 0 COMMENT '分类id',
  `price`         decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '售价',
  `market_price`  decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '市场价',
  `stock`         int unsigned NOT NULL DEFAULT '0' COMMENT '总库存',
  `sales`         int unsigned NOT NULL DEFAULT '0' COMMENT '销量',
  `params`        text COMMENT '自定义参数(JSON数组 [{label,value}])',
  `spec_type`     tinyint unsigned NOT NULL DEFAULT '0' COMMENT '规格类型 0无规格 1笛卡尔积 2直接录入',
  `spec_data`     text COMMENT '规格模板(JSON {groups:[{name,values}]} )',
  `status`        tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态 1上架 0下架',
  `is_hot`        tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否热销',
  `is_new`        tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否新品',
  `is_recommend`  tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否推荐',
  `sort`          int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 商品规格表
CREATE TABLE IF NOT EXISTS `product_spec` (
  `id`         bigint unsigned NOT NULL COMMENT '雪花id',
  `product_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT '商品id',
  `spec_key`   varchar(128) NOT NULL DEFAULT '' COMMENT '规格唯一键(用于笛卡尔积标识)',
  `spec_name`  varchar(128) NOT NULL DEFAULT '' COMMENT '规格展示名(如 红色/M)',
  `specs`      text COMMENT '规格明细(JSON数组 [{name,value}])',
  `price`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '规格价格',
  `stock`      int unsigned NOT NULL DEFAULT '0' COMMENT '规格库存',
  `image`      varchar(512) NOT NULL DEFAULT '' COMMENT '规格图',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品规格表';

-- 购物车表
CREATE TABLE IF NOT EXISTS `cart` (
  `id`         bigint unsigned NOT NULL COMMENT '雪花id',
  `user_id`    bigint unsigned NOT NULL DEFAULT 0 COMMENT '用户id',
  `product_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT '商品id',
  `spec_id`    bigint unsigned NOT NULL DEFAULT 0 COMMENT '规格id',
  `num`        int unsigned NOT NULL DEFAULT '1' COMMENT '数量',
  `selected`   tinyint unsigned NOT NULL DEFAULT '1' COMMENT '是否选中 1是 0否',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 订单表
CREATE TABLE IF NOT EXISTS `order` (
  `id`              bigint unsigned NOT NULL COMMENT '雪花id',
  `order_no`        varchar(64)  NOT NULL DEFAULT '' COMMENT '订单号',
  `user_id`         bigint unsigned NOT NULL DEFAULT 0 COMMENT '用户id',
  `total_amount`    decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品总金额',
  `pay_amount`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实付金额',
  `freight_amount`  decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '运费金额',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `pay_type`        tinyint unsigned NOT NULL DEFAULT '0' COMMENT '支付方式 1微信',
  `status`          tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待付款 1待发货 2待收货 3已完成 4已取消 5售后',
  `pay_time`        datetime DEFAULT NULL COMMENT '支付时间',
  `delivery_time`   datetime DEFAULT NULL COMMENT '发货时间',
  `receive_time`    datetime DEFAULT NULL COMMENT '收货时间',
  `close_time`      datetime DEFAULT NULL COMMENT '关闭时间',
  `consignee`       varchar(64)  NOT NULL DEFAULT '' COMMENT '收货人姓名',
  `phone`           varchar(20)  NOT NULL DEFAULT '' COMMENT '联系电话',
  `address`         varchar(256) NOT NULL DEFAULT '' COMMENT '收货地址',
  `remark`          varchar(512) NOT NULL DEFAULT '' COMMENT '买家备注',
  `delivery_company` varchar(64)  NOT NULL DEFAULT '' COMMENT '物流公司',
  `delivery_no`      varchar(128) NOT NULL DEFAULT '' COMMENT '物流单号',
  `created_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单明细表
CREATE TABLE IF NOT EXISTS `order_item` (
  `id`            bigint unsigned NOT NULL COMMENT '雪花id',
  `order_id`      bigint unsigned NOT NULL DEFAULT 0 COMMENT '订单id',
  `product_id`    bigint unsigned NOT NULL DEFAULT 0 COMMENT '商品id',
  `product_name`  varchar(256) NOT NULL DEFAULT '' COMMENT '商品名称(快照)',
  `product_image` varchar(512) NOT NULL DEFAULT '' COMMENT '商品图片(快照)',
  `spec_id`       bigint unsigned NOT NULL DEFAULT 0 COMMENT '规格id',
  `spec_name`     varchar(128) NOT NULL DEFAULT '' COMMENT '规格名称(快照)',
  `price`         decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '购买单价',
  `num`           int unsigned NOT NULL DEFAULT '1' COMMENT '购买数量',
  `subtotal`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '小计金额',
  `created_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

-- 收货地址表
CREATE TABLE IF NOT EXISTS `address` (
  `id`         bigint unsigned NOT NULL COMMENT '雪花id',
  `user_id`    bigint unsigned NOT NULL DEFAULT 0 COMMENT '用户id',
  `consignee`  varchar(64)  NOT NULL DEFAULT '' COMMENT '收货人',
  `phone`      varchar(20)  NOT NULL DEFAULT '' COMMENT '联系电话',
  `province`   varchar(32)  NOT NULL DEFAULT '' COMMENT '省',
  `city`       varchar(32)  NOT NULL DEFAULT '' COMMENT '市',
  `district`   varchar(32)  NOT NULL DEFAULT '' COMMENT '区',
  `street`     varchar(64)  NOT NULL DEFAULT '' COMMENT '镇/街道',
  `detail`     varchar(256) NOT NULL DEFAULT '' COMMENT '详细地址',
  `is_default` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否默认 1是 0否',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';

-- 支付记录表
CREATE TABLE IF NOT EXISTS `payment` (
  `id`             bigint unsigned NOT NULL COMMENT '雪花id',
  `order_id`       bigint unsigned NOT NULL DEFAULT 0 COMMENT '订单id',
  `order_no`       varchar(64)  NOT NULL DEFAULT '' COMMENT '订单号',
  `user_id`        bigint unsigned NOT NULL DEFAULT 0 COMMENT '用户id',
  `amount`         decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `pay_type`       tinyint unsigned NOT NULL DEFAULT '1' COMMENT '支付方式 1微信',
  `transaction_id` varchar(128) NOT NULL DEFAULT '' COMMENT '微信交易号',
  `status`         tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待支付 1成功 2失败',
  `pay_time`       datetime DEFAULT NULL COMMENT '支付时间',
  `created_at`     datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_transaction` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';

-- 售后/退款表
CREATE TABLE IF NOT EXISTS `refund` (
  `id`             bigint unsigned NOT NULL COMMENT '雪花id',
  `refund_no`      varchar(64)  NOT NULL DEFAULT '' COMMENT '退款单号',
  `order_id`       bigint unsigned NOT NULL DEFAULT 0 COMMENT '订单id',
  `order_item_id`  bigint unsigned NOT NULL DEFAULT 0 COMMENT '订单明细id',
  `user_id`        bigint unsigned NOT NULL DEFAULT 0 COMMENT '用户id',
  `reason`         varchar(512) NOT NULL DEFAULT '' COMMENT '退款原因',
  `amount`         decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '退款金额',
  `status`         tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待审核 1同意 2拒绝 3已完成',
  `refuse_reason`  varchar(512) NOT NULL DEFAULT '' COMMENT '拒绝原因',
  `audit_time`     datetime DEFAULT NULL COMMENT '审核时间',
  `completed_time` datetime DEFAULT NULL COMMENT '完成时间',
  `created_at`     datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_refund_no` (`refund_no`),
  KEY `idx_order` (`order_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='售后/退款表';

-- 商家配置表
CREATE TABLE IF NOT EXISTS `shop_config` (
  `id`           bigint unsigned NOT NULL COMMENT '雪花id',
  `name`         varchar(128) NOT NULL DEFAULT '' COMMENT '店铺名称',
  `logo`         varchar(512) NOT NULL DEFAULT '' COMMENT '店铺logo',
  `phone`        varchar(20)  NOT NULL DEFAULT '' COMMENT '客服电话',
  `province`     varchar(32)  NOT NULL DEFAULT '' COMMENT '省',
  `city`         varchar(32)  NOT NULL DEFAULT '' COMMENT '市',
  `district`     varchar(32)  NOT NULL DEFAULT '' COMMENT '区',
  `address`      varchar(256) NOT NULL DEFAULT '' COMMENT '详细地址',
  `freight`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '默认运费',
  `free_freight` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '免运费门槛(0为不免)',
  `created_at`   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家配置表';

-- Banner管理表
CREATE TABLE IF NOT EXISTS `banner` (
  `id`          bigint unsigned   NOT NULL COMMENT '雪花id',
  `title`       varchar(128)  NOT NULL DEFAULT '' COMMENT '标题',
  `image`       varchar(512)  NOT NULL DEFAULT '' COMMENT '图片地址',
  `jump_type`   tinyint unsigned NOT NULL DEFAULT '1' COMMENT '跳转类型 1小程序页面 2外部URL',
  `jump_target` varchar(1024) NOT NULL DEFAULT '' COMMENT '跳转目标(页面路径或完整URL)',
  `start_time`  datetime DEFAULT NULL COMMENT '展示开始时间',
  `end_time`    datetime DEFAULT NULL COMMENT '展示结束时间',
  `status`      tinyint unsigned NOT NULL DEFAULT '1' COMMENT '是否展示 1显示 0隐藏',
  `sort`        int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort` (`sort`),
  KEY `idx_time` (`start_time`,`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Banner管理表';

-- 短信验证码表
CREATE TABLE IF NOT EXISTS `sms_code` (
  `id`         bigint unsigned NOT NULL COMMENT '雪花id',
  `phone`      varchar(20)  NOT NULL DEFAULT '' COMMENT '手机号',
  `code`       varchar(6)   NOT NULL DEFAULT '' COMMENT '验证码',
  `type`       tinyint unsigned NOT NULL DEFAULT '1' COMMENT '类型 1登录 2绑定手机',
  `expired_at` datetime NOT NULL COMMENT '过期时间',
  `used`       tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否使用 1是 0否',
  `used_at`    datetime DEFAULT NULL COMMENT '使用时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_phone_code` (`phone`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信验证码表';

-- 管理员表
CREATE TABLE IF NOT EXISTS `admin` (
  `id`         bigint unsigned NOT NULL COMMENT '雪花id',
  `username`   varchar(64)  NOT NULL DEFAULT '' COMMENT '用户名',
  `password`   varchar(256) NOT NULL DEFAULT '' COMMENT '密码(bcrypt)',
  `nickname`   varchar(64)  NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar`     varchar(512) NOT NULL DEFAULT '' COMMENT '头像',
  `role`       varchar(32)  NOT NULL DEFAULT 'admin' COMMENT '角色',
  `status`     tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态 1正常 0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 默认管理员账号 (密码: admin123)
INSERT IGNORE INTO `admin` (`id`, `username`, `password`, `nickname`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$10$RqoLDAU/nkeed1x6yWozLeVMmHhAE0njKJcJXSb9xQ8UCB4ZHLxBe', '超级管理员', 'super_admin', 1, NOW(), NOW());
