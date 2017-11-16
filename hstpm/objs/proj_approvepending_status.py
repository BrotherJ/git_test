# encoding: utf-8
"""
@desc: 项目待审批状态
@author:  ‘ttqin‘
@time: 2017/8/8 14:54
"""

from proj_status import ProjStatus
from conf.enum_action import EnumAction
from conf.enum_status import EnumStatus
import db.db_project as dbproj
import db.db_users as dbusers
import json
import conf.config as config
import shutil

db_proj = dbproj.DbProject()
db_users = dbusers.DbUsers()
class ApprovePendingStatus(ProjStatus):

    status_name = EnumStatus.APPROVE_PENDING

    def __init__(self, proj):
        ProjStatus.__init__(self, proj)


    def take_action(self, operate_info,info_map=None):
        """
        对项目执行相应动作
        :param action_name: 行为名称
        :param actor_name: 操作者名称
        :param action_reason: 操作原因
        :return:
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

        if action_name == EnumAction.PASS_APPROVE:
            if 'owner_id' in info_map:
                owner_id = info_map['owner_id']
            else:
                return -1, "owner id not exist", ""

            self.proj.set_status(EnumStatus.EVALUATE_PENDING)
            self.proj.update_proj_db_status(EnumStatus.EVALUATE_PENDING)
            self.proj.update_proj_owner(owner_id)

            rc, mes, out = self.record_status_change_event(action_name, actor_name, action_reason)
            if rc != 0:
                return rc, mes, out
            # 拷贝运维和结束邮件模板到项目文件夹下，以便后续可以进行显示和修改邮件模板
            finish_temp_id = info_map["finishTemp_val"]
            run_temp_id = info_map["runTemp_val"]
            project_id = self.proj.proj_id
            rtn, msg, finish_mail_template = db_users.get_mail_template_by_id(finish_temp_id)
            rtn, msg, run_mail_template = db_users.get_mail_template_by_id(run_temp_id)

            # 判断模板文件是否存在
            if finish_mail_template and run_mail_template:
                finish_mail_path = config.SUMEMAIL_TEMPLATE_FOLDER + "/" + str(finish_temp_id) + ".txt"
                run_mail_path = config.SUSEMAIL_TEMPLATE_FOLDER + "/" + str(run_temp_id) + ".txt"
                target_path = config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(project_id) + "/"
                # 拷贝运维状态和结束状态邮件模板文件到项目目录下
                shutil.copyfile(finish_mail_path,target_path + str(finish_temp_id) + ".txt")
                shutil.copyfile(run_mail_path, target_path + str(run_temp_id) + ".txt")
            else:
                return -1, "mail tenplate is not exist", ""
            rc, mes, out = self.save_stage_info(info_map)
            if rc == 0:
                self.send_satus_change_email(action_name, self.status_name,
                                             EnumStatus.EVALUATE_PENDING, actor_name, action_reason)
            return rc, mes, out
        elif action_name == EnumAction.REJECT_APPROVE:
            self.proj.set_status(EnumStatus.APPROVE_FAIL)
            self.proj.update_proj_db_status(EnumStatus.APPROVE_FAIL)
            rc, mes, out = self.record_status_change_event(action_name, actor_name, action_reason)
            if rc == 0:
                self.send_satus_change_email(action_name, self.status_name,
                                             EnumStatus.APPROVE_FAIL, actor_name, action_reason)
            return rc, mes, out
        else:
            return -1, "%s 状态不允许操作： %s" % (self.status_name, action_name), ""

    def save_stage_info(self, info):
        """
        对于不同状态项目，保存相应的信息至文件
        approve pending 状态时 approve map
        任务名需要保存数据库
        :param info:
        :return:
        """
        paramdict = dict()
        if 'priority_val' in info:
            paramdict['priority'] = info['priority_val']
            res, mes, out = db_proj.update_existed_project_info(paramdict, self.proj.proj_id)
            if res != 0:
                return res, mes, out
        return self.proj.save_approve_info(info)

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

        result = dict()
        result['req_info_map'] = req_map
        result['approve_info_map'] = approve_map
        result['op_history_info_list'] = op_his_map_list
        return 0, "success", result


if __name__ == '__main__':
    pass