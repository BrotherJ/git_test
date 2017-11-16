# encoding: utf-8
"""
@desc: 单点登录,统一认证
@author:  ‘ttqin‘
@time: 2017/8/10 16:58
"""

import httpclient_lib
import config
import json


def get_user_jsessionid(userid):
    '''
    获取在hspauth端的jsessionid
    :param userid: userid
    :return: (rc,msg): rc=0: msg = jsessionid ; rc=1, not logged in
    '''
    get_jsession_id_url = config.SSO_GETJSESSIONID_URL + "userId=" + str(userid)
    rc,re =  httpclient_lib.doGet(config.SSO_AUTH_SERVER, get_jsession_id_url, None)
    if rc != 200:
        return (-1, 'http error')

    #print rc, re
    remap = json.loads(re)
    if remap['result'] == 'error':
        return -1, 'timeout'
    else:
        jsessionid = remap['message']
        return  0, jsessionid


def get_user_info(userid):
    '''
    从统一认证端获取用户基本信息
    :param userid: user id within hsp auth
    :return:
    '''
    ret, result = get_user_jsessionid(userid)
    #print ret,result
    if ret != 0:
        return (ret, result)

    cookie_str = "JSESSIONID=" + result
    rc, re = httpclient_lib.doGet(config.SSO_AUTH_SERVER, config.SSO_GETUSERINFO_URL,  cookie_str)
    if rc != 200:
        return (-1, 'http error')

    #print rc, re
    remap = json.loads(re)
    # print 'userid:', remap['userBean']['userId']
    # print 'showname',remap['userBean']['showName']
    # print 'departmentName', remap['userBean']['departmentName']
    # print 'userName', remap['userBean']['userName']
    # print 'email',remap['userBean']['userEmail']

    user_info_dic = {}
    if remap['result'] == 'success':
        user_info_dic['user_id'] = remap['userBean']['userId']
        user_info_dic['user_name'] = remap['userBean']['userName']
        user_info_dic['user_showname'] = remap['userBean']['showName']
        user_info_dic['department'] = remap['userBean']['departmentName']
        user_info_dic['user_email'] = remap['userBean']['userEmail']
        user_info_dic['role_id'] = "2"

        return (0, user_info_dic)
    else:
        return (-1, remap['message'])

if __name__ == '__main__':
    print get_user_info(180)





