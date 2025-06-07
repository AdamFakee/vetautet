'use strict'
require('dotenv').config();
const Sequelize = require('sequelize');

class Database {
  constructor() {
    this.masterDb = this.createConnection(1433, 'MASTER DB');
    this.slaveDb = this.createConnection(49781, 'SLAVE DB'); 
    this.getDetailedInfo()
  }

  createConnection (port, typeDbName) {
    return new Sequelize('vettautet', 'sa', '123456', {
      host: 'localhost',       // địa chỉ IP của máy chủ
      dialect: 'mssql',
      port: port,               
      dialectOptions: {
        options: {
          encrypt: false,         // nếu không dùng SSL
          trustServerCertificate: true,
        }
      },
      pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: (sql) => console.log(`${typeDbName} DB::::`, sql)}
    );
  }
  async testConnections() {
    try {
      console.log('🔍 Testing Master Database Connection...');
      await this.masterDb.authenticate();
      console.log('✅ Kết nối tới Master Database thành công!');

      console.log('🔍 Testing Slave Database Connection...');
      await this.slaveDb.authenticate();
      console.log('✅ Kết nối tới Slave Database thành công!');
    } catch (error) {
      console.error('❌ Lỗi kết nối:', error);
    }
  }

  // check thông số kết nối để xem đúng port + server hay chưa
  async getDetailedInfo() {
    try {
      console.log('\n📊 Chi tiết kết nối Master Database:');
      const masterInfo = await this.masterDb.query(`
        SELECT 
          @@SERVERNAME as ServerName,
          @@SERVICENAME as ServiceName,
          DB_NAME() as DatabaseName,
          SERVERPROPERTY('InstanceName') as InstanceName,
          SERVERPROPERTY('ServerName') as FullServerName,
          CONNECTIONPROPERTY('local_net_address') as LocalAddress,
          CONNECTIONPROPERTY('local_tcp_port') as LocalPort
      `, {
        type: Sequelize.QueryTypes.SELECT
      });
      console.table(masterInfo[0]);

      console.log('\n📊 Chi tiết kết nối Slave Database:');
      const slaveInfo = await this.slaveDb.query(`
        SELECT 
          @@SERVERNAME as ServerName,
          @@SERVICENAME as ServiceName,
          DB_NAME() as DatabaseName,
          SERVERPROPERTY('InstanceName') as InstanceName,
          SERVERPROPERTY('ServerName') as FullServerName,
          CONNECTIONPROPERTY('local_net_address') as LocalAddress,
          CONNECTIONPROPERTY('local_tcp_port') as LocalPort
      `, {
        type: Sequelize.QueryTypes.SELECT
      });
      console.table(slaveInfo[0]);

      // So sánh để xem có khác nhau không
      const masterPort = masterInfo[0].LocalPort;
      const slavePort = slaveInfo[0].LocalPort;
      const masterInstance = masterInfo[0].InstanceName;
      const slaveInstance = slaveInfo[0].InstanceName;

      console.log('\n🔍 Phân tích kết nối:');
      console.log(`Master Port: ${masterPort}, Instance: ${masterInstance || 'Default'}`);
      console.log(`Slave Port: ${slavePort}, Instance: ${slaveInstance || 'Default'}`);
      
      if (masterPort === slavePort && masterInstance === slaveInstance) {
        console.log('⚠️  CẢNH BÁO: Cả hai đang kết nối tới cùng một instance!');
        return false;
      } else {
        console.log('✅ Kết nối tới các instance khác nhau!');
        return true;
      }

    } catch (error) {
      console.error('❌ Lỗi khi lấy thông tin database:', error);
      return false;
    }
  }

  getMasterDb() {
    return this.masterDb;
  }

  getSlaveDb() {
    return this.slaveDb;
  }
}

module.exports.DatabaseConfig = Database;