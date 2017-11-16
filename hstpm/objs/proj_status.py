# encoding: utf-8
"""
@desc: 
@author:  ‘ttqin‘
@time: 2017/8/8 14:15
"""
import time
import os
import conf.config as config
from conf.enum_status import EnumStatus as enumstatus
import Proj
import util.mail_sender as mail_sender
# import project_model
import db.db_project
import db.db_users
import util.global_info as global_info

db_proj = db.db_project.DbProject()
db_user = db.db_users.DbUsers()
class ProjStatus:
    """
    @desc: 项目状态对象类
    @author:  ‘ttqin‘
    @time: 2017/8/8 14:08
    """
    #状态id
    status_name = None

    proj = None

    def __init__(self, proj_obj):
        self.proj = proj_obj


    def send_satus_change_email(self, action_name, ori_status, dst_status, actor_name, action_reason=""):
        """
        发送状态变更邮件
        :param action_name: 行为名称
        :param actor_name: 操作者名称
        :param action_reason:操作原因
        :return:
        """
        content = "原状态:" + ori_status +"\n" \
                  + "当前状态:"  +  dst_status +"\n" \
                    + "操作人:" + actor_name +"\n" \
                  + "操作动作:" + action_name + "\n" \
                  + "操作原因:" + action_reason
        #邮件标题
        subject = "项目" + str(self.proj.proj_name) + "状态变更提醒"
        #定义接收人和抄送人集合，key --email(作为收件地址) ，value -- showname(作为收件人显示)
        receiver_dict = {}
        cc_dict = {}
        #获取项目ID
        project_id = self.proj.proj_id
        #根据项目ID 获取项目关联用户信息
        rtn,msg,users = db_proj.search_project_users(project_id)

        #判断是否是草稿状态提交
        if ori_status == enumstatus.DRAFT:
            #草稿状态提交，接收人为管理员，抄送人为项目参与人
            #1.获取管理员
            user_param = {}
            user_param["role_id"] = "1"
            rtn,msg,admin_users = db_user.search_users(user_param)
            if admin_users:
                for user in admin_users:
                    receiver_dict[user["user_email"]] = user["showname"]

            #2.抄送人
            if users:
                for user in users:
                    cc_dict[user["user_email"]] = user["user_showname"]
        else:
            #非草稿状态提交，接收人为项目参与人
            if users:
                for user in users:
                    receiver_dict[user["user_email"]] = user["user_showname"]


        #发送邮件
        mail_sender.send_mail(receiver_dict,cc_dict,subject,content)

    def record_status_change_event(self, operation, operator, action_reason=""):
        """
        append change event to event map list
        :param operation: 行为名称
        :param operator: 操作者名称
        :param action_reason: 操作原因
        :return:
        """
        change_info_map = dict()
        change_info_map['operation'] = str(operation)
        change_info_map['operator'] = str(operator)
        change_info_map['comments'] = str(action_reason)
        change_info_map['operate_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        change_file = None
        write_file = None
        try:
            if not os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj.proj_id)):
                os.mkdir(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj.proj_id))

            if not os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj.proj_id) + "/event_info.txt"):
                write_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj.proj_id) + "/event_info.txt",
                                  'w')
                write_file.close()

            change_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj.proj_id) + "/event_info.txt", 'r')
            org_str = change_file.read()

            if len(org_str) == 0:
                org_list = []
            else:
                org_list = eval(org_str)
            org_list.append(change_info_map)

            write_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj.proj_id) + "/event_info.txt", 'w')
            write_file.write(str(org_list))
        except Exception as e:
            return -1, "failed", e
        finally:
            if change_file is not None:
                change_file.close()
            if write_file is not None:
                write_file.close()

        return 0, "success", ""

    ############# below functions need to be override ###############

    def take_action(self, action_info, info_map):
        """
        need to be override by subclasses
        > 1. 对于当前的行为，当前状态应该如何变化, 将self.proj_obj.status重新赋值
        > 2. 判断是否要调用send_satus_change_email， 传入当前status和目标status
        > 3. 判断是否要调用record_status_change_event
        :param action_name: 行为名称
        :return:
        """
        pass


    def save_stage_info(self, info):
        """
        need to be override by subclasses
        对于不同状态项目，保存相应的信息至文件
        :param info:
        :return:
        """
        pass

    def get_stage_info(self):
        """
        对于不同状态的项目，返回不同的map
        Args:
            info:

        Returns:

        """

if __name__ == '__main__':
    pj = Proj.Proj(1,"test_proj")
    pb = ProjStatus(pj)
    # print pb.record_status_change_event("action1a", "actor1a", "reason1a")
    pb.send_satus_change_email("submitApprove","draft","approvePending","xxx","提交草稿状态项目")
