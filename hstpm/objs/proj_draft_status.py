# encoding: utf-8
"""
@desc: 项目草稿状态
@author:  ‘ttqin‘
@time: 2017/8/8 14:54
"""

from proj_status import ProjStatus
from conf.enum_action import EnumAction
from conf.enum_status import EnumStatus
import db.db_project as dbproj
import json

db_proj = dbproj.DbProject()
class DraftStatus(ProjStatus):

    status_name = EnumStatus.DRAFT

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
        actor_name = operate_info['operator']
        action_name = operate_info['operation']
        userid = operate_info['operator_id']

        if action_name == EnumAction.DELETE:
            return self.proj.delete_proj()
        elif action_name == EnumAction.SUBMIT_APPROVE:
            self.proj.set_status(EnumStatus.APPROVE_PENDING)
            self.proj.update_proj_db_status(EnumStatus.APPROVE_PENDING)
            self.proj.update_proj_submitter(userid)
            rc, mess, name = self.proj.get_proj_name()
            if rc != 0:
                return rc, mess, name
            self.proj.proj_name = name
            rc, message, out = self.record_status_change_event(action_name, actor_name)
            if rc != 0:
                return rc, message, out
            rc, message, out = self.save_stage_info(info_map)
            if rc == 0:
                self.send_satus_change_email(action_name, self.status_name,
                                             EnumStatus.APPROVE_PENDING, actor_name)
            return rc, message, out
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

        result = dict()
        result['req_info_map'] = req_map
        return 0, "success", result

if __name__ == '__main__':
    print "start save app map"







