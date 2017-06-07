module.exports = {
  hostName      : '',
  redis_url     : 'redis://192.168.132.40:6379',
  prefix        : 'mock-cache:',
  expire        : 1800,
  secretKeyBase : 'b90321d802cf09ef688b05eb6337efc3422b4e25fe42a311bc4e5ffb268c335590be89f464d3adabfbcfae4b431a5029ad6486bce777caa962d75a18322ea123',
  mysql         : {
    host: '192.168.132.44',
    user: 'root',
    password: '1qazXSW@',
    database:'mock',
    port: 3306  
  }
}