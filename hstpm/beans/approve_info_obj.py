# encoding: utf-8
"""
@desc: 审批状态填充信息
@author:  ‘mcyan‘
@time: 2017/8/14 16:19
"""


class CApproveInfo:

    def __init__(self):
        approve_info_map = dict()
        approve_info_map["owner_id"] = ""
        approve_info_map["owner_val"] = ""
        approve_info_map["priority_val"] = ""
        approve_info_map["approve_comments_val"] = ""

        approve_info_map['runTemp_val'] = ""
        approve_info_map['runTemp_mailTo_val'] = ""
        approve_info_map['runTemp_mailTo_name'] = ""
        approve_info_map['runTemp_mailTo_id'] = ""
        approve_info_map['runTemp_mailCC_val'] = ""
        approve_info_map['runTemp_mailCC_name'] = ""
        approve_info_map['runTemp_mailCC_id'] = ""

        approve_info_map['finishTemp_val'] = ""
        approve_info_map['finishTemp_mailTo_val'] = ""
        approve_info_map['finishTemp_mailTo_name'] = ""
        approve_info_map['finishTemp_mailTo_id'] = ""
        approve_info_map['finishTemp_mailCC_val'] = ""
        approve_info_map['finishTemp_mailCC_name'] = ""
        approve_info_map['finishTemp_mailCC_id'] = ""
        self.approve_info_map = approve_info_map
