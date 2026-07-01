-- ========================================
-- 秒杀活动扩展数据表
-- 购买秒杀功能后执行此脚本
-- ========================================

-- 秒杀活动表
CREATE TABLE IF NOT EXISTS `seckill_activity` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `name`        varchar(128) NOT NULL DEFAULT '' COMMENT '活动名称',
  `start_time`  datetime NOT NULL COMMENT '开始时间',
  `end_time`    datetime NOT NULL COMMENT '结束时间',
  `status`      tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0未开始 1进行中 2已结束 3已关闭',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_time` (`start_time`,`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='秒杀活动表';

-- 秒杀商品表
CREATE TABLE IF NOT EXISTS `seckill_product` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `product_id`  int unsigned NOT NULL DEFAULT '0' COMMENT '商品id',
  `spec_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '规格id(0为全部规格)',
  `seckill_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '秒杀价',
  `stock`       int unsigned NOT NULL DEFAULT '0' COMMENT '秒杀库存',
  `limit_num`   int unsigned NOT NULL DEFAULT '1' COMMENT '限购数量',
  `sales`       int unsigned NOT NULL DEFAULT '0' COMMENT '已秒数量',
  `sort`        int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='秒杀商品表';

-- 秒杀订单表（关联秒杀活动）
CREATE TABLE IF NOT EXISTS `seckill_order` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `product_id`  int unsigned NOT NULL DEFAULT '0' COMMENT '商品id',
  `order_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '订单id',
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `seckill_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '秒杀价',
  `num`         int unsigned NOT NULL DEFAULT '1' COMMENT '购买数量',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='秒杀订单表';
