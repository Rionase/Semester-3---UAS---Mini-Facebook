import {sequelize, DataTypes} from "./models.js";

const History = sequelize.define("historys", {
    username: DataTypes.STRING,
    post_id: DataTypes.INTEGER 
})

export default History;