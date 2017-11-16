# encoding: utf-8
"""
@desc: 项目状态枚举
@author:  ‘ttqin‘
@time: 2017/8/8 14:57
"""


class EnumStatus(object):

    # DRAFT = 'draft'
    # APPROVE_PENDING = 'approvePending'
    # EVALUATE_PENDING = 'evaluatePending'
    # APPROVE_FAIL = "approveFail"
    # EVALUATE_FAIL = 'evaluateFail'
    # RUN_PENDING = 'runPending'
    # RUNNING = 'running'
    # SUSPENDED = 'suspended'
    # FINISH = 'finish'

    DRAFT = '草稿'
    APPROVE_PENDING = '待审批'
    EVALUATE_PENDING = '待评估'
    APPROVE_FAIL = "审批退回"
    EVALUATE_FAIL = '评估退回'
    RUN_PENDING = '待运行'
    RUNNING = '运行'
    SUSPENDED = '挂起'
    FINISH = '完成'


