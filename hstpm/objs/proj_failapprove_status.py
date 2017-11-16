# encoding: utf-8
"""
@desc: 项目审批失败状态
@author:  ‘ttqin‘
@time: 2017/8/8 14:54
"""

from proj_status import ProjStatus
from conf.enum_action import EnumAction
from conf.enum_status import EnumStatus
import db.db_project as dbproj

db_proj = dbproj.DbProject()

class FailApproveStatus(ProjStatus):

    status_name = EnumStatus.APPROVE_FAIL

    def __init__(self, proj):
        ProjStatus.__init__(self, proj)

    def take_action(self, operate_info, info_map):
        '''
        对项目执行相应动作
        :param action_name: 行为名称
        :param actor_name: 操作者名称
        :param action_reason: 操作原因
        :return:
        '''
        actor_name = operate_info['operator']
        action_name = operate_info['operation']
        if 'comments' in operate_info:
            action_reason = operate_info['comments']
        else:
            action_reason = ""

        rc, mess, name = self.proj.get_proj_name()
        if rc != 0:
            return rc, mess, name
        self.proj.proj_name = name

        if action_name == EnumAction.DELETE:
            return self.proj.delete_proj()

        elif action_name == EnumAction.SUBMIT_APPROVE:
            self.proj.set_status(EnumStatus.APPROVE_PENDING)
            self.proj.update_proj_db_status(EnumStatus.APPROVE_PENDING)
            rc, mes, out = self.record_status_change_event(action_name, actor_name, action_reason)
            if rc != 0:
                return rc, mes, out
            rc, mes, out = self.save_stage_info(info_map)
            if rc == 0:
                self.send_satus_change_email(action_name, self.status_name, EnumStatus.APPROVE_PENDING,
                                             actor_name, action_reason)
            return rc, mes, out
        else:
            return -1, "%s 状态不允许操作： %s" % (self.status_name, action_name), ""

    def save_stage_info(self, info):
        '''
        对于不同状态项目，保存相应的信息至文件
        :param info:
        :return:
        '''
        paramdict = dict()
        if 'projName_val' in info:
            paramdict['name'] = info['projName_val']

        res, mes, out = db_proj.update_existed_project_info(paramdict, self.proj.proj_id)
        if res != 0:
            return res, mes, out
        return self.proj.save_req_map(info)

    def get_stage_info(self):
        rc, mes, req_map = self.proj.load_req_map()
        if rc != 0:
            return rc, mes, req_map

        rc, mes, op_his_map_list = self.proj.load_ophistory_map_list()
        if rc != 0:
            return rc, mes, op_his_map_list

        result = dict()
        result['req_info_map'] = req_map

        result['op_history_info_list'] = op_his_map_list
        return 0, "success", result

