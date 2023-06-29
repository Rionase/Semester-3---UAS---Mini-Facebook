import {sequelize, DataTypes} from "./models.js";

const Users = sequelize.define("users", {
    username: { primaryKey: true, type: DataTypes.STRING },
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    birthday: DataTypes.STRING,
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    relationship: DataTypes.STRING,
    profile: { type: DataTypes.STRING, defaultValue: "/image/DefaultProfile.jpg" },
    privacy: { type: DataTypes.STRING, defaultValue: "Public" }
})

export default Users