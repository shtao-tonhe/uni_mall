-- ========================================
-- 会员储值扩展数据表
-- 购买储值功能后执行此脚本
-- ========================================

-- 储值配置表（全局仅一条）
CREATE TABLE IF NOT EXISTS `storage_config` (
  `id`                  int unsigned NOT NULL AUTO_INCREMENT,
  `status`              tinyint unsigned NOT NULL DEFAULT '0' COMMENT '储值开关 1开启 0关闭',
  `recharge_desc`       text COMMENT '充值说明',
  `agreement`           text COMMENT '储值协议',
  `created_at`          datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='储值配置表';

-- 储值卡规则表
CREATE TABLE IF NOT EXISTS `storage_card` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `name`        varchar(128) NOT NULL DEFAULT '' COMMENT '规则名称',
  `face_value`  decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '充值面额',
  `give_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '赠送金额',
  `give_point`  int unsigned NOT NULL DEFAULT '0' COMMENT '赠送积分',
  `sort`        int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `status`      tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='储值卡规则表';

-- 储值充值记录表
CREATE TABLE IF NOT EXISTS `storage_recharge` (
  `id`            int unsigned NOT NULL AUTO_INCREMENT,
  `user_id`       int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `card_id`       int unsigned NOT NULL DEFAULT '0' COMMENT '储值卡规则id',
  `order_no`      varchar(64) NOT NULL DEFAULT '' COMMENT '充值订单号',
  `face_value`    decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '充值金额',
  `give_amount`   decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '赠送金额',
  `total_amount`  decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '到账总额',
  `pay_amount`    decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实付金额',
  `pay_type`      tinyint unsigned NOT NULL DEFAULT '1' COMMENT '支付方式 1微信',
  `transaction_id` varchar(128) NOT NULL DEFAULT '' COMMENT '微信交易号',
  `status`        tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待支付 1成功 2失败',
  `pay_time`      datetime DEFAULT NULL COMMENT '支付时间',
  `created_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='储值充值记录表';

-- 储值消费记录表
CREATE TABLE IF NOT EXISTS `storage_consumption` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `order_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '订单id',
  `order_no`    varchar(64) NOT NULL DEFAULT '' COMMENT '订单号',
  `amount`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '消费金额',
  `before_balance` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '消费前余额',
  `after_balance`  decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '消费后余额',
  `type`        tinyint unsigned NOT NULL DEFAULT '1' COMMENT '类型 1消费 2退款',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='储值消费记录表';

-- 用户储值余额表
CREATE TABLE IF NOT EXISTS `storage_balance` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `balance`     decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '当前余额',
  `total_recharge` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '累计充值',
  `total_give`     decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '累计赠送',
  `total_consume`  decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '累计消费',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户储值余额表';
