#!/usr/bin/python
# -*- coding: utf-8 -*-


############################
# DB connection config
############################

DBHOST = '10.192.4.3'
# DBHOST = '10.192.1.8'
DBPORT = 3306
DBUSER = 'root'
DBPWD = 'hillstone'
# DBPWD = 'P@ssw0rd'
DBNAME = 'hstpm_beta'
# DBNAME = 'hsp_db_mix'
DBCHARSET = 'utf8'
MINCON = 1
MAXCON = 20

#游客角色id
USER_GUEST_ROLE_ID = 2
#管理员角色ID
USER_ADMIN_ROLE_ID = 1

############################
# SSO CONFIG
############################
SSO_AUTH_SERVER = '10.192.4.4'
SSO_GETJSESSIONID_URL = '/hspauth/auth/getSessionID.do?'
SSO_GETUSERINFO_URL = '/hspauth/auth/login.do?platformId=1'

#####################
# FOLDER config
#####################
#提交项目模版。以每个模版id作为一个目录，其下存储 a. 模版html b. 所需参数map{}.对于新建项目，页面load这个空map,并load html模版
PROJ_TEMPLATE_FOLDER = 'c:/hillstone/hstpm/projtemp'
#日常测试邮件模版目录，每个邮件模版id一个目录。其下存储模版命名存储为txt文件，同时存储模版定义的变量名对应的变量值
SUSEMAIL_TEMPLATE_FOLDER = 'c:/hillstone/hstpm/dailymailtemp'
#结束邮件模版目录，每个邮件模版id一个目录。其下存储模版命名存储为txt文件，同时存储模版定义的变量名对应的变量值
SUMEMAIL_TEMPLATE_FOLDER = 'c:/hillstone/hstpm/summarymailtemp'
# 任务map储存目录
PROJ_TASKMAP_SAVE_FOLDER = 'c:/hillstone/hstpm/project'

######################
#mail config
######################
#邮件发送地址
MAIL_SENDER_FROM = "auto-mail@Hillstonenet.com"
#邮件验证 账号密码
MAIL_SENDER_NAME = "auto-mail"
MAIL_SENDER_PASSWORD = "Hillstone1"
#邮件服务器地址
SMTP_HOST = "10.88.5.10"
#邮件中显示的发送人
MAIL_FROM_SHOW = '自动化 <auto-mail@hillstonenet.com>'

#申请模板的css路径配置，用ngix代理时，路径发生变化
MODULE_CSS_PATH_PREFIX = "/static"
