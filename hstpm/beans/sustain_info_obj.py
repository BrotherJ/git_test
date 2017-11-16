# encoding: utf-8
"""
@desc: 运维状态填充信息
@author:  ‘mcyan‘
@time: 2017/8/14 16:19
"""


class CSustainInfo:

    def __init__(self):
        sustain_info_map = dict()
        sustain_info_map['sustainRisk_val'] = ""
        sustain_info_map['totalProgress_map_val'] = ""
        sustain_info_map['totalProgress_val'] = ""
        sustain_info_map['bugAdded_mapList_val'] = []
        self.sustain_info_map = sustain_info_map