
import {sequelize, DataTypes} from "./models.js";

const Likes = sequelize.define("likes", {
    id: { primaryKey: true, type: DataTypes.INTEGER },
    username : { primaryKey: true, type: DataTypes.STRING },
    status: DataTypes.BOOLEAN
})

export default Likes;