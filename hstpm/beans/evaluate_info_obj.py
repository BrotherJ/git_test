# encoding: utf-8
"""
@desc: 评估状态填充信息
@author:  ‘mcyan‘
@time: 2017/8/14 16:19
"""


class CEvaluateInfo:

    def __init__(self):

        evaluate_info_map = dict()
        evaluate_info_map['projEstimateStartDate_val'] = ""
        evaluate_info_map['projEstimateEndDate_val'] = ""
        evaluate_info_map['projTesters_name_val'] = ""
        evaluate_info_map['projTesters_id'] = ""
        evaluate_info_map['projSpendTime_val'] = ""
        evaluate_info_map['projRisk_val'] = ""
        self.evaluate_info_map = evaluate_info_map
