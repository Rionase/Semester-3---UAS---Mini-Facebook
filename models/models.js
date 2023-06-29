import {Sequelize, DataTypes} from 'sequelize';

const sequelize = new Sequelize("minifacebook", "root", "", {
    host: 'localhost', 
    dialect: 'mysql' 
});

export {sequelize, DataTypes};