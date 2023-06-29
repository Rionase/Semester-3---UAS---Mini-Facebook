import {sequelize, DataTypes} from "./models.js";

const Friend = sequelize.define( "friends", {
    user1: DataTypes.STRING,
    user2: DataTypes.STRING,
    status: DataTypes.BOOLEAN
})

export default Friend