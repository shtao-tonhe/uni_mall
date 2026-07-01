-- ========================================
-- 社群接龙扩展数据表
-- 购买接龙功能后执行此脚本
-- ========================================

-- 接龙活动表
CREATE TABLE IF NOT EXISTS `jielong_activity` (
  `id`            int unsigned NOT NULL AUTO_INCREMENT,
  `name`          varchar(128) NOT NULL DEFAULT '' COMMENT '活动名称',
  `cover`         varchar(512) NOT NULL DEFAULT '' COMMENT '封面图',
  `description`   text COMMENT '活动说明',
  `start_time`    datetime NOT NULL COMMENT '开始时间',
  `end_time`      datetime NOT NULL COMMENT '结束时间',
  `auto_sort`     tinyint unsigned NOT NULL DEFAULT '1' COMMENT '接龙自动排序 1按时间 0手动',
  `show_phone`    tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否显示手机号 1显示 0隐藏',
  `show_remark`   tinyint unsigned NOT NULL DEFAULT '1' COMMENT '是否显示备注 1显示 0隐藏',
  `remark_name`   varchar(64)  NOT NULL DEFAULT '备注' COMMENT '备注栏名称',
  `max_per_user`  int unsigned NOT NULL DEFAULT '0' COMMENT '每人限接(0不限)',
  `status`        tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0未开始 1进行中 2已结束 3已关闭',
  `created_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_time` (`start_time`,`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='接龙活动表';

-- 接龙商品表
CREATE TABLE IF NOT EXISTS `jielong_product` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `product_id`  int unsigned NOT NULL DEFAULT '0' COMMENT '商品id',
  `spec_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '规格id(0为全部规格)',
  `price`       decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '接龙价',
  `stock`       int unsigned NOT NULL DEFAULT '0' COMMENT '接龙库存',
  `limit_num`   int unsigned NOT NULL DEFAULT '0' COMMENT '限购(0不限)',
  `sort`        int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='接龙商品表';

-- 接龙参与记录表
CREATE TABLE IF NOT EXISTS `jielong_member` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `nickname`    varchar(64)  NOT NULL DEFAULT '' COMMENT '用户昵称(快照)',
  `phone`       varchar(20)  NOT NULL DEFAULT '' COMMENT '联系电话',
  `remark`      varchar(512) NOT NULL DEFAULT '' COMMENT '备注',
  `sort_order`  int unsigned NOT NULL DEFAULT '0' COMMENT '接龙序号',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='接龙参与记录表';

-- 接龙购买明细表
CREATE TABLE IF NOT EXISTS `jielong_order` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int unsigned NOT NULL DEFAULT '0' COMMENT '活动id',
  `member_id`   int unsigned NOT NULL DEFAULT '0' COMMENT '参与记录id',
  `product_id`  int unsigned NOT NULL DEFAULT '0' COMMENT '商品id',
  `spec_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '规格id',
  `price`       decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单价',
  `num`         int unsigned NOT NULL DEFAULT '1' COMMENT '数量',
  `order_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '正式订单id(0未下单)',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_member` (`member_id`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='接龙购买明细表';
