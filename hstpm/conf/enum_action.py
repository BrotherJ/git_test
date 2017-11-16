# encoding: utf-8
"""
@desc: 项目可操作行为
@author:  ‘ttqin‘
@time: 2017/8/8 15:02
"""

class EnumAction(object):

    # DELETE = 'delete'
    # #提交审批
    # SUBMIT_APPROVE = 'submitApprove'
    # #审批不通过
    # REJECT_APPROVE = 'rejectApprove'
    # # 审批通过
    # PASS_APPROVE = 'passApprove'
    # #评估不通过
    # REJECT_EVALUATE = "rejectEvaluate"
    # #通过评估
    # PASS_EVALUATE = "passEvaluate"
    # #开始运行
    # START_RUN = "startRun"
    # #挂起
    # SUSPEND_RUN = "suspendRun"
    # #终止运行
    # TERMINATE_RUN = "terminate"
    # #发送运维报告
    # SEND_SUSTAIN_REPORT = "sendSustainReport"
    # #发送项目总结报告
    # SEND_SUMMARY_REPORT = "sendSummaryReport"

    DELETE = '删除'
    # 提交审批
    SUBMIT_APPROVE = '提交'
    # 审批不通过
    REJECT_APPROVE = '审批不通过'
    # 审批通过
    PASS_APPROVE = '审批通过'
    # 评估不通过
    REJECT_EVALUATE = "评估不通过"
    # 通过评估
    PASS_EVALUATE = "评估通过"
    # 开始运行
    START_RUN = "开始"
    # 挂起
    SUSPEND_RUN = "挂起"
    # 终止运行
    TERMINATE_RUN = "终止"
    # 发送运维报告
    # SEND_SUSTAIN_REPORT = "发送运维报告"
    # 发送项目总结报告
    # SEND_SUMMARY_REPORT = "发送总结报告"
    SEND_REPORT = "发送报告"