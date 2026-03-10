import * as mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5, 
insertIdAsNumber: true, 
  bigIntAsNumber: true    
});


// Teste de conexão imediato
pool.getConnection()
    .then(conn => {
        console.log(" Conectado ao MariaDB com sucesso!");
        conn.release(); 
    })
    .catch(err => {
        console.error(" Erro ao conectar ao banco:", err.message);
    });

    export default pool; //essa linha sempre no final