import Sequelize from 'sequelize';
import sequelize from '../util/database';


const User=sequelize.define('user',{
    id:
    {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
        name:Sequelize.STRING,
        email:{
           type:Sequelize.STRING,
           unique:true
          },
        phone:{
           type:Sequelize.STRING,
           unique:true
          },
        password:Sequelize.STRING
    }
);


export default User;
