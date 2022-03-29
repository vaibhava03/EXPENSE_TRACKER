import Sequelize from 'sequelize';
import sequelize from '../util/database';

const Expense=sequelize.define('fileUrl',{
    id:
    {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
        fileUrl:Sequelize.STRING,
        
    }
);


export default Expense;
