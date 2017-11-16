# encoding: utf-8
"""
@desc: 项目结束状态
@author:  ‘ttqin‘
@time: 2017/8/8 14:54
"""

from proj_status import ProjStatus
from conf.enum_action import EnumAction
from conf.enum_status import EnumStatus
import time
import db.db_project as dbproj
import db.db_users as dbusers
import conf.config as config

db_proj = dbproj.DbProject()
db_users = dbusers.DbUsers()

class FinishStatus(ProjStatus):

    status_name = EnumStatus.FINISH

    def __init__(self, proj):
        ProjStatus.__init__(self, proj)


    def take_action(self, operate_info,info_map):
        '''
        对项目执行相应动作
        :param action_name: 行为名称
        :param actor_name: 操作者名称
        :param action_reason: 操作原因
        :return:
        '''
        action_name = operate_info['operation']

        #用户ID
        user_id = operate_info['operator_id']

        if action_name == EnumAction.SEND_REPORT:
            return self.proj.send_summary_report()
        elif action_name == EnumAction.DELETE:
            # 根据用户ID 获取用户信息
            user = db_users.query_user_by_id(user_id)
            # 判断用户角色是否是管理员
            if user["role_id"] != config.USER_ADMIN_ROLE_ID:
                return -1, "该用户不是管理员，无法删除已完成项目", ""
            else:
                return self.proj.delete_proj()
        else:
            return -1, "%s 状态不允许操作： %s" % (self.status_name, action_name), ""

    def save_stage_info(self, info):
        '''
        nothing can be stored in this stage
        :param info:
        :return:
        '''
        # 更新数据库 project list 结束时间字段
        return self.proj.save_summary_map(info)

    def get_stage_info(self):
        rc, mes, req_map = self.proj.load_req_map()
        if rc != 0:
            return rc, mes, req_map
        rc, mes, approve_map = self.proj.load_approve_map()
        if rc != 0:
            return rc, mes, approve_map

        rc, mes, op_his_map_list = self.proj.load_ophistory_map_list()
        if rc != 0:
            return rc, mes, op_his_map_list

        rc, mes, sustain_map = self.proj.load_sustain_map()
        if rc != 0:
            return rc, mes, sustain_map

        rc, mes, evaluate_map = self.proj.load_evaluate_map()
        if rc != 0:
            return rc, mes, evaluate_map

        rc, mes, summary_map = self.proj.load_summary_map()
        if rc != 0:
            return rc, mes, summary_map

        result = dict()
        result['req_info_map'] = req_map
        result['approve_info_map'] = approve_map
        result['op_history_info_list'] = op_his_map_list
        result['sustain_info_map'] = sustain_map
        result['evaluate_info_map'] = evaluate_map
        result['summary_info_map'] = summary_map

        return 0, "success", result

