app.get( "/addHistory" , (req,res) => {
    Likes.findAll({ where: { status: 1 } })
  .then(async (results) => {
    for (let i = 0; i < results.length; i++) {
      const results1 = await History.findAll({ where: { username: results[i].username } });
      let data = results1.map(({ username, post_id }) => ({ username, post_id }));
      console.log('data:', data);
      console.log('results[i]:', results[i]);
      // Apabila post_id untuk username sudah pernah terdaftar pada history, maka tidak dilakukan apapun.
      if (data.some(obj => obj.username === results[i].username && obj.post_id === results[i].id)) {
        console.log(`data with username ${results[i].username} and post_id ${results[i].id} already exists`);
      }
      // Apabila tidak ditemukan baru dimasukkan
      else {
        // History yang disimpan hanya dilimit untuk menyimpan 20 history post_id saja
        // Apabila > 20, maka delete yang pertama dan input yg terbaru
        if (data.length >= 20) {
          console.log(data[i], "akan didelete -----------------------------------")
          History.destroy({ where: data[0] })
            .then(() => {
              History.create({
                username: results[i].username,
                post_id: results[i].id
              });
              console.log(`data with username ${results[i].username} and post_id ${results[i].id} is created after deleting data with username ${data[0].username} and post_id ${data[0].post_id}`);
            });
        }
        else {
          History.create({
            username: results[i].username,
            post_id: results[i].id
          });
          console.log(`data with username ${results[i].username} and post_id ${results[i].id} is created`);
        }
      }
      console.log(`---------------- Pengulangan ke - ${i} berhasil. ---------------`);
    }
  });
})