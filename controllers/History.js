import History from "../models/history.js"
import { sequelize } from "../models/models.js"

const Like_Tag = (post_id_param, username_param) => {
    History.findAll({ where: { username: username_param } })
        .then((results) => {
            let data = results.map(({ username, post_id }) => ({ username, post_id }))
            // Apabila post_id untuk username sudah pernah terdaftar pada history, maka tidak dilakukan apapun.
            if (data.some(obj => obj.username === username_param && obj.post_id === post_id_param)) { }
            // Apabila tidak ditemukan baru dimasukkan
            else {
                // History yang disimpan hanya dilimit untuk menyimpan 20 history post_id saja
                // Apabila > 20, maka delete yang pertama dan input yg terbaru
                if (data.length >= 20) {
                    History.destroy({ where: data[0] })
                }
                History.create({
                    username: username_param,
                    post_id: post_id_param
                })
            }
        })
}

const UnLike_Tag = (post_id_param, username_param) => {
    History.findAll({ where: { username: username_param } })
        .then((results) => {
            let data = results.map(({ username, post_id }) => ({ username, post_id }))
            // Apabila post_id untuk username sudah pernah terdaftar pada history, maka akan dihapus dari db
            if (data.some(obj => obj.username === username_param && obj.post_id === post_id_param)) {
                History.destroy({ where: { username: username_param, post_id: post_id_param } })
            }
            // Apabila tidak ditemukan, maka ditidak dilakukan apapun
            else { }
        })
}

const Bookmark_Tag = (post_id_param, username_param) => {
    History.findAll({ where: { username: username_param } })
        .then((results) => {
            let data = results.map(({ username, post_id }) => ({ username, post_id }))
            // Apabila post_id untuk username sudah pernah terdaftar pada history, maka tidak dilakukan apapun.
            if (data.some(obj => obj.username === username_param && obj.post_id === post_id_param)) { }
            // Apabila tidak ditemukan baru dimasukkan
            else {
                // History yang disimpan hanya dilimit untuk menyimpan 20 history post_id saja
                // Apabila > 20, maka delete yang pertama dan input yg terbaru
                if (data.length >= 20) {
                    History.destroy({ where: data[0] })
                }
                History.create({
                    username: username_param,
                    post_id: post_id_param
                })
            }
        })
}

const UnBookmark_Tag = (post_id_param, username_param) => {
    History.findAll({ where: { username: username_param } })
        .then((results) => {
            let data = results.map(({ username, post_id }) => ({ username, post_id }))
            // Apabila post_id untuk username sudah pernah terdaftar pada history, maka akan dihapus dari db
            if (data.some(obj => obj.username === username_param && obj.post_id === post_id_param)) {
                History.destroy({ where: { username: username_param, post_id: post_id_param } })
            }
            // Apabila tidak ditemukan, maka ditidak dilakukan apapun
            else { }
        })
}

const Saved_History = (req, res, next) => {
    sequelize.query(`SELECT posts.tags FROM historys 
                        INNER JOIN posts ON historys.post_id = posts.id
                        WHERE historys.username = "${req.session.user.username}"`,
        { type: sequelize.QueryTypes.SELECT })
        .then((results) => {
            const tagsArray = results.reduce((acc, item) => {
                item.tags.split(";").forEach(tag => {
                    if (tag !== "no person") {
                        const index = acc.findIndex(x => x.tag === tag);
                        if (index === -1) {
                            acc.push({ tag, count: 1 });
                        } else {
                            acc[index].count += 1;
                        }
                    }
                });
                return acc;
            }, []).sort((a, b) => b.count - a.count);

            // Log the sorted tags array
            req.session.user.history = tagsArray;
            console.log( req.session.user.history );
            next();
        })
}

export { Like_Tag, UnLike_Tag, Bookmark_Tag, UnBookmark_Tag, Saved_History };