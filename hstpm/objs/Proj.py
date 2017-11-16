# encoding: utf-8
"""
@desc: 
@author:  ‘ttqin‘
@time: 2017/8/8 14:08
"""

from conf.enum_status import EnumStatus
import conf.config as config
import os
import shutil

import beans.approve_info_obj
import beans.evaluate_info_obj
import beans.req_info_obj
import beans.summary_info_obj
import beans.sustain_info_obj
import db.db_project
import db.db_users
from tornado.template import Template
import util.mail_sender as mail_sender
import datetime
import time
import codecs


from conf.global_import import *


db_proj = db.db_project.DbProject()
db_user = db.db_users.DbUsers()

class Proj:
    """
    @desc: 项目对象类
    @author:  ‘ttqin‘
    @time: 2017/8/8 14:08

    """

    proj_id = None
    proj_name = None

    #提交请求信息map
    req_map = {}

    #审批信息map
    approve_map = {}

    #评估信息map
    evaluate_map = {}

    #运维信息map
    sustain_map = {}

    #历史运维信息map list
    history_sustain_map_list = []


    #结束总结信息map
    summary_map = {}

    #操作历史事件（状态变更历史）记录列表
    op_history_event_map_list = []

    #项目状态父类
    status = None


    def __init__(self, id, proj_name=""):
        """
        初使化项目信息，获取ID 和项目名称
        :param id:
        :param proj_name: 项目名称
        """
        self.proj_id = id
        self.proj_name = proj_name


    def set_status(self, status_name):
        """
        获取status实例对象
        :param status_name:
        :return:
        """
        if status_name == EnumStatus.DRAFT:
            self.status = DraftStatus(self)
        elif status_name == EnumStatus.APPROVE_PENDING :
            self.status = ApprovePendingStatus(self)
        elif status_name == EnumStatus.APPROVE_FAIL :
            self.status = FailApproveStatus(self)
        elif status_name == EnumStatus.EVALUATE_PENDING :
            self.status = EvaluatePendingStatus(self)
        elif status_name == EnumStatus.EVALUATE_FAIL:
            self.status = FailEvaluteStatus(self)
        elif status_name == EnumStatus.RUN_PENDING:
            self.status = RunPendingStatus(self)
        elif status_name == EnumStatus.RUNNING:
            self.status = RunningStatus(self)
        elif status_name == EnumStatus.SUSPENDED:
            self.status = SuspendedStatus(self)
        elif status_name == EnumStatus.FINISH:
            self.status = FinishStatus(self)

    def load_req_map(self):
        """
        加载请求信息map
        :return:
        """
        req_file = None
        write_file = None
        try:
            if os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/req_info.txt"):
                req_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/req_info.txt",
                                    'r')
                req_str = req_file.read()
                if len(req_str.strip()) > 0:
                    req_info = eval(req_str)
                else:
                    write_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/req_info.txt",
                                    'w')
                    req_info_obj = beans.req_info_obj.CReqInfo()
                    req_info = req_info_obj.req_info_map
                    write_file.write(str(req_info))
            else:
                req_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/req_info.txt",
                                    'w')
                req_info_obj = beans.req_info_obj.CReqInfo()
                req_info = req_info_obj.req_info_map
                req_file.write(str(req_info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if req_file is not None:
                req_file.close()
            if write_file is not None:
                write_file.close()

        return 0, "success", req_info

    def load_approve_map(self):
        """
        加载审批信息map
        :return:
        """

        approve_file = None
        write_file = None
        try:
            if os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/approve_info.txt"):
                approve_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/approve_info.txt",
                                    'r')
                approve_str = approve_file.read()
                if len(approve_str.strip()) > 0:
                    approve_info = eval(approve_str)
                else:
                    write_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/approve_info.txt",
                                      'w')
                    approve_info_obj = beans.approve_info_obj.CApproveInfo()
                    approve_info = approve_info_obj.approve_info_map
                    write_file.write(str(approve_info))
            else:
                approve_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/approve_info.txt",
                                    'w')
                approve_info_obj = beans.approve_info_obj.CApproveInfo()
                approve_info = approve_info_obj.approve_info_map
                approve_file.write(str(approve_info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if approve_file is not None:
                approve_file.close()
            if write_file is not None:
                write_file.close()

        return 0, "success", approve_info

    def load_evaluate_map(self):
        """
        加载评估信息map
        :return:
        """
        evaluate_file = None
        write_file = None
        try:
            if os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/evaluate_info.txt"):
                evaluate_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/evaluate_info.txt",
                                     'r')
                evaluate_str = evaluate_file.read()
                if len(evaluate_str.strip()) > 0:
                    evaluate_info = eval(evaluate_str)
                else:
                    write_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/evaluate_info.txt",
                                      'w')
                    evaluate_info_obj = beans.evaluate_info_obj.CEvaluateInfo()
                    evaluate_info = evaluate_info_obj.evaluate_info_map
                    write_file.write(str(evaluate_info))
            else:
                evaluate_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/evaluate_info.txt",
                                     'w')
                evaluate_info_obj = beans.evaluate_info_obj.CEvaluateInfo()
                evaluate_info = evaluate_info_obj.evaluate_info_map
                evaluate_file.write(str(evaluate_info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if evaluate_file is not None:
                evaluate_file.close()
            if write_file is not None:
                write_file.close()

        return 0, "success", evaluate_info

    def load_sustain_map(self, testers=None):
        """
        加载维护信息map
        其中的运维人员信息从数据库中获取
        :return:
        """
        sustain_file = None
        write_file = None
        try:
            if os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/sustain_info.txt"):
                sustain_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/sustain_info.txt",
                                    'r')
                sustain_str = sustain_file.read()
                if len(sustain_str.strip()) > 0:
                    sustain_info = eval(sustain_str)
                else:
                    write_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/sustain_info.txt",
                                    'w')
                    sustain_info_obj = beans.sustain_info_obj.CSustainInfo()
                    sustain_info = sustain_info_obj.sustain_info_map
                    if testers is not None and len(testers) > 0:
                        tester_arr = str(testers).split(";")
                        tester_val = dict()
                        for tester in tester_arr:
                            tester_val[str(tester)] = ""
                        sustain_info['totalProgress_map_val'] = tester_val
                    write_file.write(str(sustain_info))
            else:
                sustain_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/sustain_info.txt",
                                    'w')
                sustain_info_obj = beans.sustain_info_obj.CSustainInfo()
                sustain_info = sustain_info_obj.sustain_info_map
                if testers is not None and len(testers) > 0:
                    tester_arr = str(testers).split(";")
                    tester_val = dict()
                    for tester in tester_arr:
                        tester_val[str(tester)] = ""
                    sustain_info['totalProgress_map_val'] = tester_val
                sustain_file.write(str(sustain_info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if sustain_file is not None:
                sustain_file.close()
            if write_file is not None:
                write_file.close()

        return 0, "success", sustain_info

    def load_sustain_map_list(self):
        """
        加载历史维护信息map
        :return:
        """
        pass


    def load_summary_map(self):
        """
        加载总结信息map
        :return:
        """
        summary_file = None
        write_file = None
        try:
            if os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/summary_info.txt"):
                summary_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/summary_info.txt",
                                    'r')
                summary_str = summary_file.read()
                if len(summary_str.strip()) > 0:
                    summary_info = eval(summary_str)
                else:
                    write_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/summary_info.txt",
                                      'w')
                    summary_info_obj = beans.summary_info_obj.CSummaryInfo()
                    summary_info = summary_info_obj.summary_info_map
                    write_file.write(str(summary_info))
            else:
                summary_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/summary_info.txt",
                                    'w')
                summary_info_obj = beans.summary_info_obj.CSummaryInfo()
                summary_info = summary_info_obj.summary_info_map
                summary_file.write(str(summary_info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if summary_file is not None:
                summary_file.close()
            if write_file is not None:
                write_file.close()

        return 0, "success", summary_info

    def load_ophistory_map_list(self):
        """
        加载操作历史map list
        :return:
        """
        history_file = None

        try:
            if os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/event_info.txt"):
                history_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/event_info.txt",
                                    'r')
                history = history_file.read()
                if len(history) > 0:
                    history_list = eval(history)
                else:
                    history_list = []
            else:
                history_list = []
        except Exception as e:
            return -1, "failed", e
        finally:
            if history_file is not None:
                history_file.close()
        return 0, "success", history_list

    def save_approve_info(self, info):
        """
        保存审批信息map，导出至文件
        :param info: 审批信息字典
        :return:
        """

        app_file = None
        try:
            if not os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id)):
                os.mkdir(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id))
            app_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/approve_info.txt", 'w')
            app_file.write(str(info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if app_file is not None:
                app_file.close()

        return 0, "success", self.proj_id

    def save_req_map(self, info):
        """
        保存请求map, 导出至当前项目所在的文件夹
        :param info:
        :return:
        """
        req_file = None
        try:
            if not os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id)):
                os.mkdir(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id))
            req_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/req_info.txt", 'w')
            req_file.write(str(info).encode('utf-8'))
        except Exception as e:
            return -1, "failed", e
        finally:
            if req_file is not None:
                req_file.close()

        return 0, self.proj_id, self.proj_id

    def save_evaluate_map(self, info):
        """
        保存评估map, 导出至当前项目所在的文件夹
        :param info:
        :return:
        """
        evaluate_file = None
        try:
            if not os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id)):
                os.mkdir(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id))
            app_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/evaluate_info.txt", 'w')
            app_file.write(str(info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if evaluate_file is not None:
                evaluate_file.close()

        return 0, "success", ""

    def load_sustain_history(self, date):
        hisfile_path = (config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) +
                        "/sustain_history_" + date + ".txt")

        if os.path.exists(hisfile_path):
            history_file = open(hisfile_path, 'r')
            his_info = history_file.read()
            if len(his_info) > 0:
                his_map = eval(his_info)
                return 0, "success", his_map
            else:
                return -1, date + "的历史记录不存在", ""
        else:
            return -1, date + "的历史记录不存在", ""

    def get_sustain_history_list(self):
        try:
            history_folder_path = config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id)
            date_list = []
            for file_name in os.listdir(history_folder_path):
                if os.path.isfile(os.path.join(history_folder_path, file_name)):
                    if file_name.startswith("sustain_history_"):
                        this_date = file_name.replace("sustain_history_", "").replace(".txt", "")
                        date_list.append(this_date)
            today_date = datetime.datetime.now().strftime('%Y-%m-%d')
            if today_date in date_list:
                date_list.remove(today_date)
            return 0, "success", date_list
        except Exception as e:
            return -1, "获取历史运维记录日期信息失败", str(e)

    def save_sustain_map(self, info):
        """
        当前维护信息保存，
        保存每天的文件，不同日期建立新的文件
        :param info:
        :return:
        """
        sustain_file = None
        history_file = None
        today_date = datetime.datetime.now().strftime('%Y-%m-%d')

        hisfile_path = (config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) +
                        "/sustain_history_" + today_date + ".txt")
        infofile_path = config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/sustain_info.txt"
        try:
            if not os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id)):
                os.mkdir(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id))

            # 如果不存在，自动创建；如果存在则覆盖
            history_file = open(hisfile_path, 'w')
            history_file.write(str(info))
            sustain_file = open(infofile_path, 'w')
            sustain_file.write(str(info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if sustain_file is not None:
                sustain_file.close()
            if history_file is not None:
                history_file.close()

        return 0, "success", ""

    def save_summary_map(self, info):
        """
        总结信息保存
        :param info:
        :return:
        """
        summary_file = None
        try:
            if not os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id)):
                os.mkdir(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id))
            summary_file = open(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id) + "/summary_info.txt", 'w')
            summary_file.write(str(info))
        except Exception as e:
            return -1, "failed", e
        finally:
            if summary_file is not None:
                summary_file.close()

        return 0, "success", ""



    def save_stage_info(self, info):
        """
        保存不同阶段的信息，该方法委托给status类进行处理
        :param info:
        :return:take_action
        """
        return self.status.save_stage_info(info)




    def take_action(self, action_info, info_map):
        """
        need to be override by subclasses
        > 1. 对于当前的行为，当前状态应该如何变化, 将self.proj_obj.status重新赋值
        > 2. 判断是否要调用send_satus_change_email， 传入当前status和目标status
        > 3. 判断是否要调用record_status_change_event
        :param action_name: 行为名称
        :return:
        """
        return self.status.take_action(action_info, info_map)




    def get_stage_info(self):
        """
        对于不同状态的项目，返回不同的map
        Returns:
        """
        return self.status.get_stage_info()



    def send_daily_report(self):
        """
        加载日报邮件模版，发送每日维护信息报告
        :return:
        """
        # 获取项目ID和名称
        project_id = self.proj_id


        #邮件接收人及抄送人信息
        receiver_dict = {}
        cc_dict = {}

        #获取项目相关的信息
        rtn, msg, app_info = self.load_approve_map()
        rtn, msg, eva_info = self.load_evaluate_map()
        rtn, msg, req_info = self.load_req_map()
        testers = eva_info['projTesters_name_val']
        rtn, msg, sus_info = self.load_sustain_map(testers)
        rtn, msg, summary_info = self.load_summary_map()

        project_name = req_info["projName_val"]

        # 邮件主题
        subject = project_name + "项目自动化测试日报(" + datetime.datetime.now().strftime('%Y-%m-%d') + ")"

        # 邮件内容
        content = ""

        # 获取运维邮件模板ID
        runtemp_id = app_info["runTemp_val"]
        #获取收件人邮箱和姓名（以";"分割）
        runTemp_mailTo_val = app_info["runTemp_mailTo_val"]
        runTemp_mailTo_name = app_info["runTemp_mailTo_name"]
        mail_receivers = runTemp_mailTo_val.split(";")
        mail_receivers_showname = runTemp_mailTo_name.split(";")
        #遍历数组,将收件人和显示名称以key-value 存放到dict集合中
        for i in range(0, len(mail_receivers)):
            receiver_dict[mail_receivers[i]] = mail_receivers_showname[i]

        # 获取抄送人邮箱和姓名（以";"分割）
        runTemp_mailCC_val = app_info["runTemp_mailCC_val"]
        runTemp_mailCC_name = app_info["runTemp_mailCC_name"]
        mail_cc = runTemp_mailCC_val.split(";")
        mail_cc_showname = runTemp_mailCC_name.split(";")
        # 遍历数组,将收件人和显示名称以key-value 存放到dict集合中
        for i in range(0, len(mail_cc)):
            cc_dict[mail_cc[i]] = mail_cc_showname[i]

        # 根据邮件模板ID 获取
        if runtemp_id != "":
            # rtn, msg, mail_template = db_user.get_mail_template_by_id(runtemp_id)
            #判断是否有运维邮件模板信息
            # if mail_template:
            # 根据模板名称获取日常邮件模板
            file_path = config.SUSEMAIL_TEMPLATE_FOLDER + "/"  + runtemp_id + ".txt"
            run_file = open(file_path, 'r')
            #需进行中文乱码处理
            run_mail_temp_str = run_file.read()
            #使用tornado 模板填充
            content = Template(run_mail_temp_str).generate(req_info_map=req_info, evaluate_info_map=eva_info,
                                                           approve_info_map=app_info, sustain_info_map=sus_info,
                                                           summary_info_map=summary_info,tester_map=self.dict_deal(sus_info["totalProgress_map_val"]),
                                                           bugAdded_map_list=self.get_bug_info(sus_info["bugAdded_mapList_val"]))
            #发送邮件
            mail_sender.send_mail(receiver_dict,cc_dict,subject,content)
            return 0, "succeed", ""
            # else:
            #     return -1,"未找到相应邮件模板",""
        else:
            return -1, "无运维状态邮件模板", ""

    def send_summary_report(self):
        """
        加载结束报告邮件模版，发送项目结束报告
        :return:
        """
        # 获取项目ID
        project_id = self.proj_id

        # 邮件接收人及抄送人信息
        receiver_dict = {}
        cc_dict = {}

        # 获取项目相关的信息
        rtn, msg, app_info = self.load_approve_map()
        rtn, msg, eva_info = self.load_evaluate_map()
        rtn, msg, req_info = self.load_req_map()
        rtn, msg, sus_info = self.load_sustain_map()
        rtn, msg, summary_info = self.load_summary_map()

        #项目名称 -- 通过text文件获取
        project_name = req_info["projName_val"]
        # 邮件主题
        subject = project_name + "项目自动化测试报告"

        # 邮件内容
        content = ""

        # 获取结束邮件模板ID
        finishtemp_id = app_info["finishTemp_val"]
        # 获取收件人邮箱和姓名（以";"分割）
        finishTemp_mailTo_val = app_info["finishTemp_mailTo_val"]
        finishTemp_mailTo_name = app_info["finishTemp_mailTo_name"]
        mail_receivers = finishTemp_mailTo_val.split(";")
        mail_receivers_showname = finishTemp_mailTo_name.split(";")
        # 遍历数组,将收件人和显示名称以key-value 存放到dict集合中
        for i in range(0, len(mail_receivers)):
            receiver_dict[mail_receivers[i]] = mail_receivers_showname[i]

        # 获取抄送人邮箱和姓名（以";"分割）
        finishTemp_mailCC_val = app_info["finishTemp_mailCC_val"]
        finishTemp_mailCC_name = app_info["finishTemp_mailCC_name"]
        mail_cc = finishTemp_mailCC_val.split(";")
        mail_cc_showname = finishTemp_mailCC_name.split(";")
        # 遍历数组,将收件人和显示名称以key-value 存放到dict集合中
        for i in range(0, len(mail_cc)):
            cc_dict[mail_cc[i]] = mail_cc_showname[i]

        # 根据邮件模板ID 获取
        if finishtemp_id != "":
            # rtn, msg, mail_template = db_user.get_mail_template_by_id(finishtemp_id)
            # 判断是否有运维邮件模板信息
            # if mail_template:
            # 根据模板名称获取日常邮件模板
            file_path = config.SUMEMAIL_TEMPLATE_FOLDER + "/" + finishtemp_id + ".txt"
            run_file = open(file_path, 'r')
            # 需进行中文乱码处理
            run_mail_temp_str = run_file.read()
            # 使用tornado 模板填充
            content = Template(run_mail_temp_str).generate(req_info_map=req_info, evaluate_info_map=eva_info,
                                                           approve_info_map=app_info, sustain_info_map=sus_info,
                                                           summary_info_map=summary_info,tester_map=self.dict_deal(sus_info["totalProgress_map_val"]),
                                                           bugAdded_map_list=self.get_bug_info(sus_info["bugAdded_mapList_val"]))
            # 发送邮件
            mail_sender.send_mail(receiver_dict, cc_dict, subject, content)
            return 0, "succeed", ""
            # else:
            #     return -1, "未找到相应邮件模板", ""
        else:
            return -1, "无运维状态邮件模板", ""

    def delete_proj(self):
        """
        删除项目
        :return:
        """
        # 删除数据库记录
        project_id = self.proj_id
        res, mess, out = db_proj.delete_project(project_id)
        if res != 0:
            return res, "delete project in db failed:" + mess, out
        try:
            # 删除map文件、文件夹
            if os.path.exists(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id)):
                shutil.rmtree(config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(self.proj_id))
            return 0, "success", ""
        except Exception as e:
            return -1, "delete project failed:" + str(e), ""

    def update_proj_db_status(self, status):
        """
        在db中更新项目当前状态status
        :return:
        """
        return db_proj.update_project_status(self.proj_id, status)

    def update_proj_submitter(self, userid):
        return db_proj.update_project_group_submitter(userid, self.proj_id)

    def update_proj_owner(self, ownerid):
        return db_proj.update_project_group_owner(ownerid, self.proj_id)

    def get_proj_name(self):
        return db_proj.get_project_name(self.proj_id)

    def get_project_info(self):
        rc, mes, req_map = self.load_req_map()
        if rc != 0:
            return rc, mes, req_map
        rc, mes, approve_map = self.load_approve_map()
        if rc != 0:
            return rc, mes, approve_map

        # rc, mes, op_his_map_list = self.load_ophistory_map_list()
        # if rc != 0:
        #     return rc, mes, op_his_map_list
        rc, mes, evaluate_map = self.load_evaluate_map()
        if rc != 0:
            return rc, mes, evaluate_map
        testers = evaluate_map['projTesters_name_val']
        rc, mes, sustain_map = self.load_sustain_map(testers)
        if rc != 0:
            return rc, mes, sustain_map

        rc, mes, summary_map = self.load_summary_map()
        if rc != 0:
            return rc, mes, summary_map

        result = dict()
        result['req_info_map'] = req_map
        result['approve_info_map'] = approve_map
        # result['op_history_info_list'] = op_his_map_list
        result['sustain_info_map'] = sustain_map
        result['evaluate_info_map'] = evaluate_map
        result['summary_info_map'] = summary_map

        return 0, "success", result

    def edit_approve_info(self, approve_info):
        """
        除了draft状态，任何状态都可以调用本方法
        更新approveinfo，不造成状态变更
        Args:
            approve_info:

        Returns:

        """
        # 从表中获取需要更新的字段 owner priority
        if 'owner_id' in approve_info:
            owner_id = approve_info['owner_id']
        else:
            return -1, "owner id not exist", ""

        self.update_proj_owner(owner_id)
        if 'priority_val' in approve_info:
            param = dict()
            param['priority'] = approve_info['priority_val']
            db_proj.update_existed_project_info(param, self.proj_id)

        # 拷贝运维和结束邮件模板到项目文件夹下，以便后续可以进行显示和修改邮件模板
        finish_temp_id = approve_info["finishTemp_val"]
        run_temp_id = approve_info["runTemp_val"]
        project_id = self.proj_id
        rtn, msg, finish_mail_template = db_user.get_mail_template_by_id(finish_temp_id)
        rtn, msg, run_mail_template = db_user.get_mail_template_by_id(run_temp_id)

        # 判断模板文件是否存在
        if finish_mail_template and run_mail_template:
            finish_mail_path = config.SUMEMAIL_TEMPLATE_FOLDER + "/" + finish_temp_id + ".txt"
            run_mail_path = config.SUSEMAIL_TEMPLATE_FOLDER + "/" + run_temp_id + ".txt"
            target_path = config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(project_id) + "/"
            # 拷贝运维状态和结束状态邮件模板文件到项目目录下
            shutil.copyfile(finish_mail_path, target_path + finish_temp_id + ".txt")
            shutil.copyfile(run_mail_path, target_path + run_temp_id + ".txt")
        else:
            return -1, "mail tenplate is not exist", ""
        # 保存map
        return self.save_approve_info(approve_info)

    def dict_deal(self, dict_param):
        '''
        Template支持的函数方法，遍历获取dict集合中key-value值
        :param dict_param:
        :return:
        '''
        result = ""
        if dict_param !="":
            for key in dict_param.keys():
                content = str(dict_param[key])
                result = result + key + ":" + content.replace("\n","\n\t\t\t") + "\n\t\t"
        return result

    def get_bug_info(self,bug_list = []):
        '''
        获取bug信息 ,id,status,intro,comments

        :param dict_param:
        :return:输出格式如下
        ID:XXXXX
            状态:xxxxxx
            简介:xxxxxx
        ID:XXXXX
            状态:xxxxxx
            简介:xxxxxx
        '''
        bug_str = ""
        if bug_list != []:
            for bug_add_map in bug_list:
                bug_str = bug_str + "ID：" + bug_add_map["id"] +"\n\t\t\t状态：" + bug_add_map["status"] + "\n\t\t\t简介：" + bug_add_map["intro"] + "\n\t\t"
        return bug_str

if __name__ == '__main__':
    # pass
    # print "start save app map"
    # pj = Proj(120,"")
    # pj.send_daily_report()
    # pj.send_summary_report()
    # print pj.load_sustain_history("2017-08-28")
    # approve = dict()
    # approve["owner_id"] = ""
    # approve["owner_val"] = ""
    # approve["priority_val"] = ""
    #
    # approve['runTemp_val'] = ""
    # approve['runTemp_mailTo_val'] = ""
    # approve['runTemp_mailTo_name'] = ""
    # approve['runTemp_mailTo_id'] = ""
    # approve['runTemp_mailCC_val'] = ""
    # approve['runTemp_mailCC_name'] = ""
    # approve['runTemp_mailCC_id'] = ""
    #
    # approve['finishTemp_val'] = ""
    # approve['finishTemp_mailTo_val'] = "邮件地址"
    # approve['finishTemp_mailTo_name'] = ""
    # approve['finishTemp_mailTo_id'] = ""
    # approve['finishTemp_mailCC_val'] = ""
    # approve['finishTemp_mailCC_name'] = ""
    # approve['finishTemp_mailCC_id'] = ""
    #
    #
    #
    # approve_label = dict()
    # approve_label['owner_label'] = "项目负责人"
    #
    # approve_label['priority_label'] = "优先级"
    # approve_label['runTemp_label'] = "运维邮件模板"
    # approve_label['runTemp_mailTo_label'] = "运维邮件模板"
    # approve_label['runTemp_mailCC_label'] = "运维邮件抄送人"
    # approve_label['finishTemp_label'] = "结束邮件模板"
    # approve_label['finishTemp_mailCC_label'] = "结束邮件接收人"
    # approve_label['finishTemp_mailCC_label'] = "运维邮件抄送人"
    #
    #
    #
    #
    # # 提交申请表
    # req_info_map = dict()
    # req_info_map['projName_val'] = ""
    # req_info_map['projPubDate_val'] = ""
    # req_info_map['qaLiasion_val'] = ""
    # req_info_map['projLiaison_val'] = ""
    # req_info_map['desc_val'] = ""
    # req_info_map['stoneOsBaseLine_val'] = ""
    # req_info_map['testImage_val'] = ""
    # req_info_map['platform_val'] = ""
    # req_info_map['expectTestStartDate_val'] = ""
    # req_info_map['otherExplain_val'] = ""
    # req_info_map['newPlatDevName_val'] = ""
    # req_info_map['newPlatVersion_val'] = ""
    # req_info_map['defaultHostName_val'] = ""
    # req_info_map['adminAccountInfo_val'] = ""
    # req_info_map['urldb_support_val'] = ""
    # req_info_map['urldb_defaultStatus_val'] = ""
    # req_info_map['urldb_unsetallStatus_val'] = ""
    # req_info_map['vsys_support_val'] = ""
    # req_info_map['vsys_defaultStatus_val'] = ""
    # req_info_map['vsys_unsetallStatus_val'] = ""
    # req_info_map['vr_support_val'] = ""
    # req_info_map['vr_defaultStatus_val'] = ""
    # req_info_map['vr_unsetallStatus_val'] = ""
    #
    # req_info_map['commandLineSupportResult_val'] = ""
    # req_info_map['commandLineComments_val'] = ""
    # req_info_map['shellPwResult_val'] = ""
    # req_info_map['shellPwComments_val'] = ""
    # req_info_map['rebootUnsetallResult_val'] = ""
    # req_info_map['rebootUnsetallComments_val'] = ""
    # req_info_map['unsetallSaveConfigResult_val'] = ""
    # req_info_map['unsetallSaveConfigComments_val'] = ""
    # req_info_map['longestRebootTimeResult_val'] = ""
    # req_info_map['longestRebootTimeComments_val'] = ""
    # req_info_map['consolePrintResult_val'] = ""
    # req_info_map['consolePrintComments_val'] = ""
    # req_info_map['startCheckResult_val'] = ""
    # req_info_map['startCheckComments_val'] = ""
    #
    # print req_info_map
    #
    # # 测试进度label
    # req_label_map = dict()
    # req_label_map['projName_label'] = "项目名称"
    # req_label_map['projPubDate_label'] = "项目发布日期"
    # req_label_map['qaLiaison_label'] = "项目FR链接"
    # req_label_map['projLiaison_label'] = "研发接口人"
    # req_label_map['desc_label'] = "项目简介"
    # req_label_map['stoneOsBaseLine_label'] = "StoneOS软件基线"
    # req_label_map['testImage_label'] = "测试使用版本名称"
    # req_label_map['platform_label'] = "需要测试平台"
    # req_label_map['expectTestStartDate_label'] = "期望测试开始日期"
    # req_label_map['otherExplain_label'] = "其他说明"
    # req_label_map['newPlatDevName_label'] = "新平台测试设备名称"
    # req_label_map['newPlatVersion_label'] = "新平台测试版本名称"
    # req_label_map['defaultHostName__label'] = "默认host name"
    # req_label_map['adminAccountInfo_label'] = "管理员账号信息"
    # req_label_map['urldb_support_label'] = "是否支持urldb"
    # req_label_map['urldb_defaultStatus_label'] = "urldb默认状态"
    # req_label_map['urldb_unsetallStatus_label'] = "urldb unsetall后状态"
    # req_label_map['vsys_support_label'] = "是否支持vsys"
    # req_label_map['vsys_defaultStatus_label'] = "vsys默认状态"
    # req_label_map['vsys_unsetallStatus_label'] = "vsys unsetall后状态"
    # req_label_map['vr_support_label'] = "是否支持vr"
    # req_label_map['vr_defaultStatus_label'] = "vr默认状态"
    # req_label_map['vr_unsetallStatus_label'] = "vr unsetall后状态"
    # req_label_map['commandLineSupportResult_label'] = "console命令行使用支持"
    # req_label_map['commandLineComments_label'] = "console命令行使用备注"
    # req_label_map['shellPwResult_label'] = "shell密码支持"
    # req_label_map['shellPwComments_label'] = "shell密码支持备注"
    # req_label_map['rebootUnsetallResult_label'] = "命令行支持reboot和unsetall"
    # req_label_map['rebootUnsetallComments_label'] = "命令行支持reboot和unsetal备注"
    # req_label_map['unsetallSaveConfigResult_label'] = "unsetall支持保留接口配置和特征库"
    # req_label_map['unsetallSaveConfigComments_label'] = "unsetall支持保留接口配置和特征库备注"
    # req_label_map['longestRebootTimeResult_label'] = "可接受reboot/unset all最长时间"
    # req_label_map['longestRebootTimeComments_label'] = "可接受reboot/unset all最长时间备注"
    # req_label_map['consolePrintResult_label'] = "正常使用过程中console是否有打印信息"
    # req_label_map['consolePrintComments_label'] = "正常使用过程中console是否有打印信息备注"
    # req_label_map['startCheckResult_label'] = "登陆以后是否需要等待和检查才能继续测试"
    # req_label_map['startCheckComments_label'] = "登陆以后是否需要等待和检查才能继续测试备注"
    #
    # # 测试进度信息
    #
    # # 测试人员map，为evaluate_info_map的projTesters_name_val的值组成的map
    # tester_map = dict()
    # tester_map['TestA_name'] = "%55"
    # tester_map['TestB_name'] = "%66"
    #
    # sustain_info_map = dict()
    # sustain_info_map['sustainRisk_val'] = ""
    # sustain_info_map['totalProgress_map_val'] = tester_map
    # sustain_info_map['bugAdded_val'] = ""
    #
    #
    # sustain_label_map = dict()
    # sustain_label_map['sustainRisk_label'] = "运维风险评估"
    # sustain_label_map['totalProgress_map_label'] = "项目总体进度"
    # sustain_label_map['bugAdded_label'] = "增加的bug"
    #
    #
    # # 评估信息
    # evaluate_info_map = dict()
    # evaluate_info_map['projEstimateStartDate_val'] = ""
    # evaluate_info_map['projEstimateEndDate_val'] = ""
    # evaluate_info_map['projTesters_name_val'] = "TestA_name,TestB_name"
    # evaluate_info_map['projTesters_id'] = ""
    # evaluate_info_map['projSpendTime_val'] = ""
    # evaluate_info_map['projRisk_val'] = ""
    #
    # evaluate_label_map = dict()
    # evaluate_label_map['projEstimateStartDate_label'] = "项目预计开始时间"
    # evaluate_label_map['projEstimateEndDate_label'] = "项目预计结束时间"
    # evaluate_label_map['projTesters_name_label'] = "项目投入测试人员"
    # evaluate_label_map['projSpendTime_label'] = "项目投入时间"
    # evaluate_label_map['projRisk_label'] = "预计风险"
    #
    # # 项目总结信息
    # summary_info_map = dict()
    # summary_info_map['summary_val'] = ''
    # summary_info_map['summaryRisk_val'] = ''
    #
    # summary_label_map = dict()
    # summary_label_map['summary_label'] = '项目总结'
    # summary_label_map['summaryRisk_label'] = '总结风险评估'
#######################################################
    # pj = Proj(1)
    # print pj.save_sustain_map(sustain_info_map)
    # print "start load app map"
    #
    # print pj.load_sustain_map()
    # pj = Proj(1, "test_proj")
    # pj.send_daily_report()
    # pj.send_summary_report()

    # sus_info = {}
    # sus_info['bugAdd_maplist_val'] = []

    # dict_1 = {}
    # dict_1["id"] = "111"
    # dict_1["status"]  = "status1"
    # dict_1["intro"] = "intro1"
    # dict_1["comments"] = "comments1"
    # sus_info['bugAdd_maplist_val'].append(dict_1)
    #
    # dict_2 = {}
    # dict_2["id"] = "222"
    # dict_2["status"] = "status2"
    # dict_2["intro"] = "intro2"
    # dict_2["comments"] = "comments2"
    # sus_info['bugAdd_maplist_val'].append(dict_2)
    #
    # dict_3 = {}
    # dict_3["id"] = "333"
    # dict_3["status"] = "status3"
    # dict_3["intro"] = "intro3"
    # dict_3["comments"] = "comments3"
    # sus_info['bugAdd_maplist_val'].append(dict_3)

    # print sus_info['bugAdd_maplist_val']
    #
    # if sus_info['bugAdd_maplist_val'] != []:
    #     for dict in sus_info['bugAdd_maplist_val']:
    #         print dict["id"]
    # else:
    #     print "null"
    pass