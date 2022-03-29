import Sequelize from 'sequelize';
import sequelize from '../util/database';


const Expense=sequelize.define('expense',{
    id:
    {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
        MoneySpent:Sequelize.DOUBLE,
        Description:Sequelize.STRING,
        Category:Sequelize.STRING
    }
);


export default Expense;
