# encoding: utf-8
"""
@desc: 请求状态填充信息
@author:  ‘mcyan‘
@time: 2017/8/14 16:19
"""


class CReqInfo:
    def __init__(self):
        req_info_map = dict()
        req_info_map['projName_val'] = ""
        req_info_map['projPubDate_val'] = ""
        req_info_map['qaLiaison_val'] = ""
        req_info_map['projLiaison_val'] = ""
        req_info_map['desc_val'] = ""
        req_info_map['stoneOsBaseLine_val'] = ""
        req_info_map['testImage_val'] = ""
        req_info_map['platform_check_val'] = ""
        req_info_map['expectTestStartDate_val'] = ""
        req_info_map['otherExplain_val'] = ""
        req_info_map['newPlatDevName_val'] = ""
        req_info_map['newPlatVersion_val'] = ""
        req_info_map['defaultHostName_val'] = ""
        req_info_map['adminAccountInfo_val'] = ""
        req_info_map['urldb_support_val'] = ""
        req_info_map['urldb_defaultStatus_val'] = ""
        req_info_map['urldb_unsetallStatus_val'] = ""
        req_info_map['vsys_support_val'] = ""
        req_info_map['vsys_defaultStatus_val'] = ""
        req_info_map['vsys_unsetallStatus_val'] = ""
        req_info_map['vr_support_val'] = ""
        req_info_map['vr_defaultStatus_val'] = ""
        req_info_map['vr_unsetallStatus_val'] = ""

        req_info_map['commandLineSupportResult_val'] = ""
        req_info_map['commandLineComments_val'] = ""
        req_info_map['shellPwResult_val'] = ""
        req_info_map['shellPwComments_val'] = ""
        req_info_map['rebootUnsetallResult_val'] = ""
        req_info_map['rebootUnsetallComments_val'] = ""
        req_info_map['unsetallSaveConfigResult_val'] = ""
        req_info_map['unsetallSaveConfigComments_val'] = ""
        req_info_map['longestRebootTimeResult_val'] = ""
        req_info_map['longestRebootTimeComments_val'] = ""
        req_info_map['consolePrintResult_val'] = ""
        req_info_map['consolePrintComments_val'] = ""
        req_info_map['startCheckResult_val'] = ""
        req_info_map['startCheckComments_val'] = ""
        self.req_info_map = req_info_map
