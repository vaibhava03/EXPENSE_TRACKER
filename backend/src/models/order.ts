import Sequelize from 'sequelize';
import sequelize from '../util/database';


const Order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    orderid:Sequelize.STRING
})
export default Order;
