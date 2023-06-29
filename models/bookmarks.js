import {sequelize, DataTypes} from "./models.js";

let Bookmark = sequelize.define ( "bookmarks", {
    id: { primaryKey: true, type: DataTypes.INTEGER },
    username : { primaryKey: true, type: DataTypes.STRING },
    status: DataTypes.BOOLEAN
})

export default Bookmark;