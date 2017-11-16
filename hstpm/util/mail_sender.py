# encoding: utf-8
"""
@desc: 邮件发送单元
@author:  ‘ttqin‘
@time: 2017/8/8 16:09
"""

import smtplib
from email.mime.text import MIMEText
from email.header import  Header
import conf.config as config
from tornado.template import Template
from email.utils import formataddr


def send_mail(receive_dict,cc_dict,subject,content):
    '''
    发送邮件
    :param receive_dict:  key --邮箱地址  ，value  --用户名称
    :return:
    '''

    #接收人及姓名
    receiver_list = []
    receivers = ""
    receivers_showname = ""

    cc = ""
    cc_showname = ""
    #遍历
    for key in receive_dict.keys():
        receiver_list.append(key)
        receivers = receivers + key + ","
        receivers_showname = receivers_showname  + receive_dict[key] + ","
    #去除最后的符号
    if receivers_showname !="":
        receivers = receivers[:-1]
        receivers_showname = receivers_showname[:-1]

    #对于抄送人
    for key in cc_dict.keys():
        cc = cc + key + ";"
        cc_showname = cc_showname + cc_dict[key] + ","
        receiver_list.append(key)
    if cc_showname != "":
        cc = cc[:-1]
        cc_showname = cc_showname[:-1]

    # 三个参数：第一个为文本内容，第二个 plain 设置文本格式，第三个 utf-8 设置编码
    message = MIMEText(content, 'plain', 'utf-8')

    #邮件标题、发件人、收件人等显示信息
    message['Subject'] = Header(subject, 'utf-8')
    #使用formataddr格式，以便可以进行邮件回复
    message['From'] = formataddr([config.MAIL_FROM_SHOW,config.MAIL_SENDER_FROM])
    message['To'] = formataddr((receivers_showname,receivers))
    message['Cc'] = formataddr([cc_showname,cc])

    try:
        smtpObj = smtplib.SMTP()
        #SMTP 端口为25
        smtpObj.connect(config.SMTP_HOST,25)
        smtpObj.login(config.MAIL_SENDER_NAME,config.MAIL_SENDER_PASSWORD)
        smtpObj.sendmail(config.MAIL_SENDER_FROM, receiver_list, message.as_string())
        # print "邮件发送成功"
    except smtplib.SMTPException:
        print "Error: 无法发送邮件"
    finally:
        smtpObj.quit()


if __name__ == '__main__':
    receive_dict = {"ttqin@hillstonenet.com":"秦亭亭","jiongsun@hillstonenet.com":"孙炯","pingzhang@hillstonenet.com":"张萍"}
    cc_dict = {"ttqin@hillstonenet.com":"秦亭亭","jiongsun@hillstonenet.com":"孙炯","pingzhang@hillstonenet.com":"张萍"}
    subject = "subject"
    content = "content"
    send_mail(receive_dict,cc_dict,subject,content)
    # print ""
    # test_send_mail(receive_dict,{},subject,content)
    # sub_mp ={}
    # sub_mp["ss"] = "test"
    # sub_mp["yuyu"] = "iuiu"
    # content = Template("<html><body><h1>{{sub['ss']}}</h1><h1>{{sub['yuyu']}}</h1></body></html>").generate(sub=sub_mp)
    # print content
