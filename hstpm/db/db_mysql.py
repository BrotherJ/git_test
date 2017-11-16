#!/usr/bin/python
# -*- coding: utf-8 -*-
"""
desc:数据库操作类
@note:
1、执行带参数的ＳＱＬ时，请先用sql语句指定需要输入的条件列表，然后再用tuple/list进行条件批配
２、在格式ＳＱＬ中不需要使用引号指定数据类型，系统会根据输入参数自动识别
３、在输入的值中不需要使用转意函数，系统会自动处理
"""

import MySQLdb
import conf.config as conf
from MySQLdb.cursors import DictCursor
from DBUtils.PooledDB import PooledDB


def singleton(cls, *args, **kw):
    """
        将初使化好的实例放置到instances中， 以后再次初使化时，直接提取初使化好的实例
        Args:
           cls: class name
           *args: class object init paramter
           **kw: class object init parameter

        Returns:
    """
    instances = {}

    def _singleton():
        if cls not in instances:
            instances[cls] = cls(*args, **kw)
        return instances[cls]

    return _singleton


'''
db线程池
'''


@singleton
class HfpDB:
    _pool = None

    def get_conn(self):

        if self._pool is None:
            self._pool = PooledDB(creator=MySQLdb, mincached=conf.MINCON, maxcached=conf.MAXCON,
                                  host=conf.DBHOST, port=conf.DBPORT, user=conf.DBUSER, passwd=conf.DBPWD,
                                  db=conf.DBNAME, use_unicode=False, cursorclass=DictCursor, charset=conf.DBCHARSET, ping=1)

        return self._pool.connection()


class Mysql(object):
    """
        MYSQL数据库对象，负责产生数据库连接 , 此类中的连接采用连接池实现
        获取连接对象：conn = Mysql.getConn()
        释放连接对象;conn.close()或del conn
    """
    def __init__(self):
        """
        数据库构造函数，从连接池中取出连接，并生成操作游标
        """
        self._pool = HfpDB()
        self._conn = None
        self._cursor = None

    def _get_con(self):
        self._conn = self._pool.get_conn()
        self._cursor = self._conn.cursor()

    def get_all(self, sql, param=None, dispose = 1):
        """
        @summary: 执行查询，并取出所有结果集
        @param sql:查询ＳＱＬ，如果有查询条件，请只指定条件列表，并将条件值使用参数[param]传递进来
        @param param: 可选参数，条件列表值（元组/列表）
        @return: result list/boolean 查询到的结果集
        """
        try:
            self._get_con()

            if param is None:
                count = self._cursor.execute(sql)
            else:
                count = self._cursor.execute(sql, param)
            if count > 0:
                result = self._cursor.fetchall()
            else:
                result = False

            return result

        except Exception, e:
            raise e

        finally:
            if dispose == 1:
                self._dispose()

    def get_one(self, sql, param=None, dispose=1):
        """
        @summary: 执行查询，并取出第一条
        @param sql:查询ＳＱＬ，如果有查询条件，请只指定条件列表，并将条件值使用参数[param]传递进来
        @param param: 可选参数，条件列表值（元组/列表）
        @return: result list/boolean 查询到的结果集
        """
        try:
            self._get_con()

            if param is None:
                count = self._cursor.execute(sql)
            else:
                count = self._cursor.execute(sql, param)
            if count > 0:
                result = self._cursor.fetchone()
            else:
                result = False

            return result

        except Exception, e:
            raise e
        finally:
            if dispose == 1:
                self._dispose()

    def get_many(self, sql, num, param=None, dispose=1):
        """
        @summary: 执行查询，并取出num条结果
        @param sql:查询ＳＱＬ，如果有查询条件，请只指定条件列表，并将条件值使用参数[param]传递进来
        @param num:取得的结果条数
        @param param: 可选参数，条件列表值（元组/列表）
        @return: result list/boolean 查询到的结果集
        """
        try:
            self._get_con()
            if param is None:
                count = self._cursor.execute(sql)
            else:
                count = self._cursor.execute(sql, param)
            if count > 0:
                result = self._cursor.fetchmany(num)
            else:
                result = False
            return result
        except Exception, e:
            raise e
        finally:
            if dispose == 1:
                self._dispose()

    def insert_one(self, sql, value):
        """
        @summary: 向数据表插入一条记录
        @param sql:要插入的ＳＱＬ格式
        @param value:要插入的记录数据tuple/list
        @return: insertId 受影响的行数
        """

        self._get_con()
        self._cursor.execute(sql, value)
        return self.__get_insertid()

    def insert_many(self, sql, values):
        """
        @summary: 向数据表插入多条记录
        @param sql:要插入的ＳＱＬ格式
        @param values:要插入的记录数据tuple(tuple)/list[list]
        @return: count 受影响的行数
        """
        self._get_con()
        count = self._cursor.executemany(sql, values)
        return count

    def __get_insertid(self):
        """
        获取当前连接最后一次插入操作生成的id,如果没有则为０
        """
        self._cursor.execute("SELECT @@IDENTITY AS id")
        result = self._cursor.fetchall()
        return result[0]['id']

    def __query(self, sql, param=None):
        if param is None:
            count = self._cursor.execute(sql)
        else:
            count = self._cursor.execute(sql, param)
        return count

    def update(self, sql, param=None):
        """
        @summary: 更新数据表记录
        @param sql: ＳＱＬ格式及条件，使用(%s,%s)
        @param param: 要更新的  值 tuple/list
        @return: count 受影响的行数
        """
        self._get_con()
        return self.__query(sql, param)

    def delete(self, sql, param=None):
        """
        @summary: 删除数据表记录
        @param sql: ＳＱＬ格式及条件，使用(%s,%s)
        @param param: 要删除的条件 值 tuple/list
        @return: count 受影响的行数
        """
        self._get_con()
        return self.__query(sql, param)

    def end(self, option='commit'):
        """
        @summary: 结束事务
        """
        if self._cursor._closed is True:
            return

        if option == 'commit':
            self._conn.commit()
        else:
            self._conn.rollback()

        self._dispose()

    def _dispose(self):
        """
        @summary: 释放连接池资源
        """
        self._cursor.close()
        self._conn.close()