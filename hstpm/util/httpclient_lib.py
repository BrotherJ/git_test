#-*-coding:utf-8-*-

'''
    *模块说明*: 实现http get和post请求
    *作者*: ttqin
    *创建时间*: 2016-03-14
   
'''

import httplib, urllib


def doGet(host, url, cookie = None, **params):
    '''
     *函数说明*: 发送get请求
     *参数说明*:
             [host]: http服务器host地址
             [url]:请求url
             [cookie]: cookie string
             [params]: 请求参数 key=value的形式传递

      *返回值*: status, response
		
      *作者*: ttqin
      *创建时间*: 2016-03-14
    '''
    httpClient = None
    try:
        httpClient  = httplib.HTTPConnection(host)
        
        i = 0
        for key in params:
            if i == 0:
                url = url + '?' + key + '=' + params[key]
            else:
                url = url + '&' + key + '=' + params[key]
            i = i + 1
        if cookie is not None:
            httpClient.request('GET', url, headers={'Cookie': cookie})
        else:
            httpClient.request('GET', url)
        response = httpClient.getresponse()
        return response.status, response.read()
    except Exception, e:
        print e
        return -1, e
    finally:
        if httpClient:
            httpClient.close()


			
def doPost(host, url, **params):
    '''
     *函数说明*: 发送post请求
     *参数说明*:
             [host]: http服务器host地址
             [url]:请求url
             [params]: 请求参数 key=value的形式传递

      *返回值*: status, response
		
      *作者*: ttqin
      *创建时间*: 2016-03-14
    '''
    httpClient = None
    try:
        params = urllib.urlencode(params)
        headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"text/plain"}
        httpClient = httplib.HTTPConnection(host)
        httpClient.request('POST', url, params, headers)
        response = httpClient.getresponse();
        return response.status, response.read()

    except Exception, e:
        print e
        return -1, e

    finally:
        if httpClient:
            httpClient.close();			








    


    
    
