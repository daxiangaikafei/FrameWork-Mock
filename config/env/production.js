module.exports = {
  hostName      : '',
  // redis_url     : 'redis://:Jy123456@192.168.0.65:6379',
  redis: {
    sentinels: [
      { host: '172.16.20.57', port: 26379 },
      { host: '172.16.20.57', port: 36379 },
      { host: '172.16.20.57', port: 46379 }],
    name: 'nodejs',
    password: 'tuhuredis',
  },
  prefix        : 'mock-cache:',
  expire        : 1800,
  secretKeyBase : 'b90321d802cf09ef688b05eb6337efc3422b4e25fe42a311bc4e5ffb268c335590be89f464d3adabfbcfae4b431a5029ad6486bce777caa962d75a18322ea123',
  mysql         : {
    host: '172.16.20.168',
    user: 'nodejsuser',
    password: 'Itsme@999',
    database:'mock',
    port: 3306  
  },
  dir: {
    publish: '/root/publish',
    biz: {
      cashier: {
        git: 'git@gitlab.tuhu.cn:finance/H5/Pay.git',
        sub: '',
        mail: 'xiaolin@tuhu.cn,wangguan@tuhu.cn'
      }
    }
  }
}