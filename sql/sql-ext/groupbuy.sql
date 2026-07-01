-- ========================================
-- 拼团活动扩展数据表
-- 购买拼团功能后执行此脚本
-- ========================================

-- 拼团活动表
CREATE TABLE IF NOT EXISTS `groupbuy_activity` (
  `id`              int unsigned NOT NULL AUTO_INCREMENT,
  `name`            varchar(128) NOT NULL DEFAULT '' COMMENT '活动名称',
  `product_id`      int unsigned NOT NULL DEFAULT '0' COMMENT '商品id',
  `spec_id`         int unsigned NOT NULL DEFAULT '0' COMMENT '规格id(0为全部规格)',
  `group_price`     decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '拼团价',
  `group_num`       int unsigned NOT NULL DEFAULT '2' COMMENT '成团人数',
  `limit_num`       int unsigned NOT NULL DEFAULT '0' COMMENT '限购数量(0不限)',
  `total_stock`     int unsigned NOT NULL DEFAULT '0' COMMENT '活动总库存',
  `sales`           int unsigned NOT NULL DEFAULT '0' COMMENT '已拼销量',
  `is_alone`        tinyint unsigned NOT NULL DEFAULT '1' COMMENT '是否单独购买 1是 0否',
  `alone_price`     decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单独购买价',
  `start_time`      datetime NOT NULL COMMENT '开始时间',
  `end_time`        datetime NOT NULL COMMENT '结束时间',
  `status`          tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0未开始 1进行中 2已结束 3已关闭',
  `created_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_status` (`status`),
  KEY `idx_time` (`start_time`,`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='拼团活动表';

-- 拼团团队表
CREATE TABLE IF NOT EXISTS `groupbuy_team` (
  `id`            int unsigned NOT NULL AUTO_INCREMENT,
  `activity_id`   int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `order_id`      int unsigned NOT NULL DEFAULT '0' COMMENT '团长订单id',
  `user_id`       int unsigned NOT NULL DEFAULT '0' COMMENT '团长用户id',
  `need_num`      int unsigned NOT NULL DEFAULT '2' COMMENT '需成团人数',
  `joined_num`    int unsigned NOT NULL DEFAULT '1' COMMENT '已参团人数',
  `status`        tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0拼团中 1已成团 2未成团退款',
  `start_time`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开团时间',
  `success_time`  datetime DEFAULT NULL COMMENT '成团时间',
  `close_time`    datetime DEFAULT NULL COMMENT '关闭时间',
  `created_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='拼团团队表';

-- 拼团参团记录表
CREATE TABLE IF NOT EXISTS `groupbuy_member` (
  `id`         int unsigned NOT NULL AUTO_INCREMENT,
  `team_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '团队id',
  `activity_id` int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `order_id`   int unsigned NOT NULL DEFAULT '0' COMMENT '订单id',
  `user_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `is_leader`  tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否团长 1是 0否',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_team` (`team_id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='拼团参团记录表';
