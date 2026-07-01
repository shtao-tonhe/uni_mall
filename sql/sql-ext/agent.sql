-- ========================================
-- 代理层级扩展数据表
-- 购买代理功能后执行此脚本
-- ========================================

-- 代理等级配置表
CREATE TABLE IF NOT EXISTS `agent_level` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `name`        varchar(64)  NOT NULL DEFAULT '' COMMENT '等级名称',
  `level`       tinyint unsigned NOT NULL DEFAULT '1' COMMENT '等级权重(数字越大等级越高)',
  `condition`   tinyint unsigned NOT NULL DEFAULT '1' COMMENT '升级条件 1消费满额 2订单数 3团队人数',
  `condition_value` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '条件值',
  `commission_rate` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '默认佣金比例(%)',
  `upgrade_self` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '上级是否享受级差 1是 0否',
  `sort`        int unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代理等级配置表';

-- 代理商表
CREATE TABLE IF NOT EXISTS `agent` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `parent_id`   int unsigned NOT NULL DEFAULT '0' COMMENT '上级代理id',
  `level_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '当前等级id',
  `parent_chain` varchar(256) NOT NULL DEFAULT '' COMMENT '上级链(逗号分隔id)',
  `name`        varchar(64)  NOT NULL DEFAULT '' COMMENT '真实姓名',
  `phone`       varchar(20)  NOT NULL DEFAULT '' COMMENT '联系电话',
  `total_commission` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '累计佣金',
  `withdrawn`   decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '已提现',
  `freeze`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '冻结中',
  `team_count`  int unsigned NOT NULL DEFAULT '0' COMMENT '团队人数',
  `order_count` int unsigned NOT NULL DEFAULT '0' COMMENT '团队订单数',
  `total_sales` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '团队销售额',
  `status`      tinyint unsigned NOT NULL DEFAULT '1' COMMENT '状态 1正常 0禁用',
  `apply_time`  datetime DEFAULT NULL COMMENT '申请时间',
  `agree_time`  datetime DEFAULT NULL COMMENT '通过时间',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user` (`user_id`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_level` (`level_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代理商表';

-- 代理佣金记录表
CREATE TABLE IF NOT EXISTS `agent_commission` (
  `id`          int unsigned NOT NULL AUTO_INCREMENT,
  `agent_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '代理id',
  `user_id`     int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `order_id`    int unsigned NOT NULL DEFAULT '0' COMMENT '订单id',
  `order_no`    varchar(64)  NOT NULL DEFAULT '' COMMENT '订单号',
  `level_diff`  tinyint unsigned NOT NULL DEFAULT '1' COMMENT '级差层数',
  `amount`      decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '佣金金额',
  `rate`        decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '佣金比例(%)',
  `status`      tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待结算 1已结算 2已失效',
  `settle_time` datetime DEFAULT NULL COMMENT '结算时间',
  `created_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_agent` (`agent_id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代理佣金记录表';

-- 代理提现申请表
CREATE TABLE IF NOT EXISTS `agent_withdraw` (
  `id`            int unsigned NOT NULL AUTO_INCREMENT,
  `agent_id`      int unsigned NOT NULL DEFAULT '0' COMMENT '代理id',
  `user_id`       int unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
  `amount`        decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '提现金额',
  `charge`        decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '手续费',
  `actual_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实际到账',
  `account_type`  tinyint unsigned NOT NULL DEFAULT '1' COMMENT '提现方式 1微信 2银行卡 3支付宝',
  `account_info`  varchar(256) NOT NULL DEFAULT '' COMMENT '收款账户信息',
  `status`        tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态 0待审核 1通过 2拒绝 3已打款',
  `refuse_reason` varchar(512) NOT NULL DEFAULT '' COMMENT '拒绝原因',
  `audit_time`    datetime DEFAULT NULL COMMENT '审核时间',
  `transfer_time` datetime DEFAULT NULL COMMENT '打款时间',
  `created_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_agent` (`agent_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代理提现申请表';
