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
config.dbpool.max = 50;
config.dbpool.min = 10;
config.dbpool.timeout = 30000;

config.mssql = [];
config.mssql.driver = 'SQL Server Native Client 11.0';
config.mssql.host = '10.104.151.40';
config.mssql.port = 31051;
config.mssql.database = 'ModooMatgo_DB';
config.mssql.databasecommnuity = 'ModooMatgo_DB';
config.mssql.user = 'modoomatgo_nme_service_app';
config.mssql.password = '(Y(cQmZh6!FFWHfd';

config.redis = [];
config.redis.select = 8;

config.sentinel1 = [];
config.sentinel1.host = '10.100.98.26';
config.sentinel1.port = 26379;

config.sentinel2 = [];
config.sentinel2.host = '10.100.98.26';
config.sentinel2.port = 26381;

config.sentinel3 = [];
config.sentinel3.host = '10.100.98.26';
config.sentinel3.port = 26383;

// 머니 교환???�태
config.gameSetting = [];
config.gameSetting.moneyExchange = 1;

module.exports = config;