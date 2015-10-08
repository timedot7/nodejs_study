/**
 * New node file
 */

var config = module.exports = {};

config.server = [];
config.server.env = 'production';
config.server.loglevel = 'silly';
config.server.basedir = '/contents';
config.server.port = 9550;

config.dbpool = [];
config.dbpool.max = 100;
config.dbpool.min = 10;
config.dbpool.timeout = 30000;

config.mssql = [];
config.mssql.driver = 'SQL Server Native Client 11.0';
config.mssql.host = '192.168.27.241';
config.mssql.port = 41051;
config.mssql.database = 'mobile_matgo_real';
config.mssql.databasecommnuity = 'community_db';
config.mssql.user = 'QAGame_ACC';
config.mssql.password = 'eo@qkr#rpa5';

config.redis = [];
//config.redis.host = '192.168.20.94';
config.redis.host = '192.168.20.165';
config.redis.port = 6379;

/*
config.mysql.master = [];
config.mysql.master.host = '192.168.62.18';
config.mysql.master.port = 58306;
config.mysql.master.user = 'QAGame_ACC';
config.mysql.master.password = 'eo@qkr#rpa5'; 
config.mysql.master.database = 'matgopang_db';

config.mysql.slave = [];
config.mysql.slave.host = '192.168.62.10';
config.mysql.slave.port = 58306;
config.mysql.slave.user = 'QAGame_ACC';
config.mysql.slave.password = 'eo@qkr#rpa5';
config.mysql.slave.database = 'matgopang_db';
*/

// 머니 교환???�태
config.gameSetting = [];
config.gameSetting.moneyExchange = 1;

module.exports = config;