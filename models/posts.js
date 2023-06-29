import {sequelize, DataTypes} from "./models.js";

const Posts = sequelize.define("posts", {
    username: DataTypes.STRING,
    imagepath: DataTypes.STRING,
    description: DataTypes.STRING,
    tags: DataTypes.STRING(1000)
})

export default Posts