-- ========================================
-- 分销推广扩展数据表
-- 购买分销功能后执行此脚本
-- ========================================

-- 分销配置表（全局仅一条）
CREATE TABLE IF NOT EXISTS `distribution_config` (
  `id`                  int unsigned NOT NULL AUTO_INCREMENT,
  `status`              tinyint unsigned NOT NULL DEFAULT '0' COMMENT '分销开关 1开启 0关闭',
  `level`               tinyint unsigned NOT NULL DEFAULT '1' COMMENT '分销层级 1/2',
  `first_rate`          decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '一级佣金比例(%)',
  `second_rate`         decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '二级佣金比例(%)',
  `become_condition`    tinyint unsigned NOT NULL DEFAULT '0' COMMENT '成为分销商条件 0无条件 1消费满额 2购买指定商品',
  `become_amount`       decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '消费满额条件(元)',
  `become_product_ids`  text COMMENT '指定商品id(JSON数组)',
  `withdraw_min`        decimal(10,2) NOT NULL DEFAULT '1.00' COMMENT '最低提现金额',
  `withdraw_max`        decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最高提现金额(0不限)',
  `withdraw_charge`     decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '提现手续费率(%)',
  `agreement`           text COMMENT '分销协议',
  `created_at`          datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分销配置表';

-- 分销商表
CREATE TABLE IF NOT EXISTS `distributor` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `parent_id`   int unsigned NOT NULL DEFAULT '0' COMMENT '上级分销商id',
  `level`       tinyint unsigned NOT NULL DEFAULT '1' COMMENT '分销商等级 1一级 2二级',
  `name`        varchar(64)  NOT NULL DEFAULT '' COMMENT '真实姓名',
  `phone`       varchar(20)  NOT NULL DEFAULT '' COMMENT '联系电话',
  `total_commission` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '累计佣金',
  `withdrawn`   decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '已提现佣金',
  `freeze`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '冻结中佣金',
  `status`      tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态 1正常 0禁用',
  `apply_time`  datetime DEFAULT NULL COMMENT '申请时间',
  `agree_time`  datetime DEFAULT NULL COMMENT '审核通过时间',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user` (`user_id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分销商表';

-- 分销佣金记录表
CREATE TABLE IF NOT EXISTS `distribution_commission` (
  `id`              int unsigned NOT NULL AUTO_INCREMENT,
  `distributor_id`  int unsigned NOT NULL DEFAULT '0' COMMENT '分销商id',
  `user_id`         int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `order_id`        int unsigned NOT NULL DEFAULT '0' COMMENT '订单id',
  `order_no`        varchar(64)  NOT NULL DEFAULT '' COMMENT '订单号',
  `level`           tinyint unsigned NOT NULL DEFAULT '1' COMMENT '佣金层级 1一级 2二级',
  `amount`          decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '佣金金额',
  `rate`            decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '佣金比例(%)',
  `status`          tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待结算 1已结算 2已失效',
  `settle_time`     datetime DEFAULT NULL COMMENT '结算时间',
  `created_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_distributor` (`distributor_id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分销佣金记录表';

-- 分销提现申请表
CREATE TABLE IF NOT EXISTS `distribution_withdraw` (
  `id`              int unsigned NOT NULL AUTO_INCREMENT,
  `distributor_id`  int unsigned NOT NULL DEFAULT '0' COMMENT '分销商id',
  `user_id`         int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `amount`          decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '提现金额',
  `charge`          decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '手续费',
  `actual_amount`   decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实际到账',
  `account_type`    tinyint unsigned NOT NULL DEFAULT '1' COMMENT '提现方式 1微信 2银行卡 3支付宝',
  `account_info`    varchar(256) NOT NULL DEFAULT '' COMMENT '收款账户信息',
  `status`          tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待审核 1通过 2拒绝 3已打款',
  `refuse_reason`   varchar(512) NOT NULL DEFAULT '' COMMENT '拒绝原因',
  `audit_time`      datetime DEFAULT NULL COMMENT '审核时间',
  `transfer_time`   datetime DEFAULT NULL COMMENT '打款时间',
  `created_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_distributor` (`distributor_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分销提现申请表';
