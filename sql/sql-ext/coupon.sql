-- ========================================
-- 优惠券活动扩展数据表
-- 购买优惠券功能后执行此脚本
-- ========================================

-- 优惠券活动表
CREATE TABLE IF NOT EXISTS `coupon_activity` (
  `id`              int unsigned NOT NULL AUTO_INCREMENT,
  `name`            varchar(128) NOT NULL DEFAULT '' COMMENT '活动名称',
  `type`            tinyint unsigned NOT NULL DEFAULT '1' COMMENT '发放类型 1手动领取 2后台发放 3新人赠券',
  `total_num`       int unsigned NOT NULL DEFAULT '0' COMMENT '发放总量(0不限)',
  `receive_num`     int unsigned NOT NULL DEFAULT '0' COMMENT '已领取数量',
  `limit_per_user`  int unsigned NOT NULL DEFAULT '1' COMMENT '每人限领',
  `start_time`      datetime NOT NULL COMMENT '领取开始时间',
  `end_time`        datetime NOT NULL COMMENT '领取结束时间',
  `status`          tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0未开始 1进行中 2已结束 3已关闭',
  `created_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_time` (`start_time`,`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券活动表';

-- 优惠券定义表
CREATE TABLE IF NOT EXISTS `coupon` (
  `id`              int unsigned NOT NULL AUTO_INCREMENT,
  `activity_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `name`            varchar(128) NOT NULL DEFAULT '' COMMENT '优惠券名称',
  `type`            tinyint unsigned NOT NULL DEFAULT '1' COMMENT '优惠类型 1满减 2折扣',
  `face_value`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '面值(满减为金额 折扣为百分比)',
  `min_amount`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最低使用门槛(0无门槛)',
  `max_discount`    decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最高抵扣(折扣券专用,0不限)',
  `use_range`       tinyint unsigned NOT NULL DEFAULT '0' COMMENT '使用范围 0全部商品 1指定商品 2指定分类',
  `range_ids`       text COMMENT '指定商品/分类id(JSON数组)',
  `valid_days`      int unsigned NOT NULL DEFAULT '0' COMMENT '领取后有效期(天,0为固定有效期)',
  `valid_start`     datetime DEFAULT NULL COMMENT '固定有效期开始',
  `valid_end`       datetime DEFAULT NULL COMMENT '固定有效期结束',
  `total_num`       int unsigned NOT NULL DEFAULT '0' COMMENT '数量(0不限)',
  `receive_num`     int unsigned NOT NULL DEFAULT '0' COMMENT '已领取',
  `sort`            int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券定义表';

-- 用户优惠券表
CREATE TABLE IF NOT EXISTS `coupon_user` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `coupon_id`   int unsigned NOT NULL DEFAULT '0' COMMENT '优惠券id',
  `activity_id` int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `code`        varchar(64)  NOT NULL DEFAULT '' COMMENT '优惠券码',
  `status`      tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0未使用 1已使用 2已过期',
  `use_time`    datetime DEFAULT NULL COMMENT '使用时间',
  `order_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '使用订单id',
  `valid_start` datetime NOT NULL COMMENT '有效期开始',
  `valid_end`   datetime NOT NULL COMMENT '有效期结束',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_coupon` (`coupon_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';
