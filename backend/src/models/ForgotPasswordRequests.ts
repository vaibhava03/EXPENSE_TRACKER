import Sequelize from 'sequelize';
import sequelize from '../util/database';


const ForgetPassWordRequests=sequelize.define('FPReq',{
    id:{
        type:Sequelize.STRING,
        primaryKey:true,
        allowNull:false
    },
    isActive:Sequelize.BOOLEAN

})
export default ForgetPassWordRequests;
