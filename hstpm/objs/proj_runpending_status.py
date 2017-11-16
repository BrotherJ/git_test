# encoding: utf-8
"""
@desc: 项目等待运行状态
@author:  ‘ttqin‘
@time: 2017/8/8 14:54
"""

from proj_status import ProjStatus
from conf.enum_action import EnumAction
from conf.enum_status import EnumStatus
import time
import db.db_project as dbproj

db_proj = dbproj.DbProject()


class RunPendingStatus(ProjStatus):


    status_name = EnumStatus.RUN_PENDING
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

        now_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        if action_name == EnumAction.START_RUN:
            self.proj.set_status(EnumStatus.RUNNING)
            self.proj.update_proj_db_status(EnumStatus.RUNNING)
            db_proj.update_project_into_run_time(now_time, self.proj.proj_id)
            rc, mes, out = self.record_status_change_event(action_name, actor_name, action_reason)
            if rc == 0:
                self.send_satus_change_email(action_name, self.status_name, EnumStatus.RUNNING, actor_name,
                                             action_reason)
            return rc, mes, out

        elif action_name == EnumAction.TERMINATE_RUN:
            self.proj.set_status(EnumStatus.FINISH)
            self.proj.update_proj_db_status(EnumStatus.FINISH)

            db_proj.update_project_out_run_time(now_time, self.proj.proj_id)
            rc, mes, out = self.record_status_change_event(action_name, actor_name, action_reason)
            if rc == 0:
                self.send_satus_change_email(action_name, self.status_name, EnumStatus.FINISH, actor_name,
                                             action_reason)
            return rc, mes, out
        else:
            return -1, "%s 状态不允许操作： %s" % (self.status_name, action_name), ""

    def get_stage_info(self):
        '''
        nothing can be edit in this stage
        :param info:
        :return:
        '''
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
