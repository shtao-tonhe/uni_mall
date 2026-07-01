-- ========================================
-- 积分商城扩展数据表
-- 购买积分功能后执行此脚本
-- ========================================

-- 积分配置表（全局仅一条）
CREATE TABLE IF NOT EXISTS `point_config` (
  `id`              int unsigned NOT NULL AUTO_INCREMENT,
  `status`          tinyint unsigned NOT NULL DEFAULT '0' COMMENT '积分开关 1开启 0关闭',
  `name`            varchar(64)  NOT NULL DEFAULT '积分' COMMENT '积分名称',
  `rate`            int unsigned NOT NULL DEFAULT '1' COMMENT '消费1元获得积分数',
  `deduct_rate`     int unsigned NOT NULL DEFAULT '0' COMMENT '积分抵扣比例(多少积分抵1元,0关闭抵扣)',
  `deduct_limit`    decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '每单最高抵扣金额(0不限)',
  `sign_point`      int unsigned NOT NULL DEFAULT '0' COMMENT '每日签到送积分(0关闭签到)',
  `expire_days`     int unsigned NOT NULL DEFAULT '0' COMMENT '积分有效期(天,0永久)',
  `agreement`       text COMMENT '积分说明',
  `created_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分配置表';

-- 积分商品表
CREATE TABLE IF NOT EXISTS `point_product` (
  `id`            int unsigned NOT NULL AUTO_INCREMENT,
  `name`          varchar(256) NOT NULL DEFAULT '' COMMENT '商品名称',
  `image`         varchar(512) NOT NULL DEFAULT '' COMMENT '商品图片',
  `desc`          text COMMENT '商品描述',
  `point`         int unsigned NOT NULL DEFAULT '0' COMMENT '兑换所需积分',
  `price`         decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '需补金额(0为纯积分兑换)',
  `stock`         int unsigned NOT NULL DEFAULT '0' COMMENT '库存',
  `limit_num`     int unsigned NOT NULL DEFAULT '0' COMMENT '限兑数量(0不限)',
  `sales`         int unsigned NOT NULL DEFAULT '0' COMMENT '已兑数量',
  `sort`          int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `status`        tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态 1上架 0下架',
  `created_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sort` (`sort`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分商品表';

-- 积分兑换订单表
CREATE TABLE IF NOT EXISTS `point_order` (
  `id`              int unsigned NOT NULL AUTO_INCREMENT,
  `order_no`        varchar(64)  NOT NULL DEFAULT '' COMMENT '兑换单号',
  `user_id`         int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `product_id`      int unsigned NOT NULL DEFAULT '0' COMMENT '积分商品id',
  `product_name`    varchar(256) NOT NULL DEFAULT '' COMMENT '商品名称(快照)',
  `product_image`   varchar(512) NOT NULL DEFAULT '' COMMENT '商品图片(快照)',
  `point`           int unsigned NOT NULL DEFAULT '0' COMMENT '消耗积分',
  `amount`          decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '补金额',
  `pay_amount`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实付金额(0为纯积分)',
  `consignee`       varchar(64)  NOT NULL DEFAULT '' COMMENT '收货人',
  `phone`           varchar(20)  NOT NULL DEFAULT '' COMMENT '联系电话',
  `address`         varchar(256) NOT NULL DEFAULT '' COMMENT '收货地址',
  `status`          tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待发货 1已发货 2已完成 3已取消',
  `delivery_time`   datetime DEFAULT NULL COMMENT '发货时间',
  `receive_time`    datetime DEFAULT NULL COMMENT '收货时间',
  `created_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分兑换订单表';

-- 积分记录表
CREATE TABLE IF NOT EXISTS `point_record` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `point`       int NOT NULL DEFAULT '0' COMMENT '变动积分(正增负减)',
  `before_point` int unsigned NOT NULL DEFAULT '0' COMMENT '变动前积分',
  `after_point`  int unsigned NOT NULL DEFAULT '0' COMMENT '变动后积分',
  `type`        tinyint unsigned NOT NULL DEFAULT '0' COMMENT '类型 1消费得积分 2下单抵扣 3签到 4兑换商品 5后台调整 6过期',
  `remark`      varchar(256) NOT NULL DEFAULT '' COMMENT '备注说明',
  `relation_id` varchar(64) NOT NULL DEFAULT '' COMMENT '关联业务id',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

-- 签到记录表
CREATE TABLE IF NOT EXISTS `point_sign` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `sign_date`   date NOT NULL COMMENT '签到日期',
  `point`       int unsigned NOT NULL DEFAULT '0' COMMENT '获得积分',
  `continuation` int unsigned NOT NULL DEFAULT '1' COMMENT '连续签到天数',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`,`sign_date`),
  KEY `idx_user` (`user_id`),
  KEY `idx_date` (`sign_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到记录表';
