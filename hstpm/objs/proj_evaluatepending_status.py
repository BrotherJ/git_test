# encoding: utf-8
"""
@desc: 项目待评估状态
@author:  ‘ttqin‘
@time: 2017/8/8 14:54
"""

from proj_status import ProjStatus
from conf.enum_action import EnumAction
from conf.enum_status import EnumStatus
import db.db_project as dbproj

db_proj = dbproj.DbProject()

class EvaluatePendingStatus(ProjStatus):

    status_name = EnumStatus.EVALUATE_PENDING

    def __init__(self, proj):
        ProjStatus.__init__(self, proj)

    def take_action(self, operate_info, info_map=None):
        """
        对项目执行相应动作
        Args:
            operate_info:
            info_map:
        Returns:
        """
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

        if action_name == EnumAction.PASS_EVALUATE:
            self.proj.set_status(EnumStatus.RUN_PENDING)
            self.proj.update_proj_db_status(EnumStatus.RUN_PENDING)

            rc, mess, out = self.record_status_change_event(action_name, actor_name, action_reason)
            if rc != 0:
                return rc, mess, out
            rc, mess, out = self.save_stage_info(info_map)
            if rc == 0:
                self.send_satus_change_email(action_name, self.status_name,
                                             EnumStatus.RUN_PENDING, actor_name, action_reason)
            return rc, mess, out
        elif action_name == EnumAction.REJECT_EVALUATE:
            self.proj.set_status(EnumStatus.EVALUATE_FAIL)
            self.proj.update_proj_db_status(EnumStatus.EVALUATE_FAIL)

            rc, mess, out = self.record_status_change_event(action_name, actor_name, action_reason)
            if rc ==0:
                self.send_satus_change_email(action_name, self.status_name,
                                             EnumStatus.EVALUATE_FAIL, actor_name, action_reason)
            return rc, mess, out

        else:
            return -1, "%s 状态不允许操作： %s" % (self.status_name, action_name), ""

    def save_stage_info(self, info):
        """
        对于不同状态项目，保存相应的信息至文件
        :param info:
        :return:
        """
        tester_arr = []
        if 'projTesters_id' in info:
            tester_arr = str(info['projTesters_id']).split(";")
        res, mes, out = db_proj.update_project_group(self.proj.proj_id, tester_arr)
        if res != 0:
            return res, mes, out
        return self.proj.save_evaluate_map(info)

    def get_stage_info(self):
        rc, mes, req_map = self.proj.load_req_map()
        if rc != 0:
            return rc, mes, req_map

        rc, mes, approve_map = self.proj.load_approve_map()
        if rc != 0:
            return rc, mes, approve_map

        rc, mes, evaluate_map = self.proj.load_evaluate_map()
        if rc != 0:
            return rc, mes, approve_map

        rc, mes, op_his_map_list = self.proj.load_ophistory_map_list()
        if rc != 0:
            return rc, mes, op_his_map_list

        result = dict()
        result['req_info_map'] = req_map
        result['approve_info_map'] = approve_map
        result['evaluate_info_map'] = evaluate_map
        result['op_history_info_list'] = op_his_map_list

        return 0, "success", result

