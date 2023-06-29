import fs from "fs";
import fetch from "node-fetch";

const Tags = (req,res,next) => {
    const imageData = fs.readFileSync(`public${req.image_path_name}`);
    // Convert the buffer to base64 encoding
    const base64Image = imageData.toString('base64');
    // Construct the JSON payload with the base64 image data
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": "clarifai",
            "app_id": "main"
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "base64": base64Image
                    }
                }
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + 'ed41d75e58b34ecd915f1b39cbe4b61b'
        },
        body: raw
    };
    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch(`https://api.clarifai.com/v2/models/general-image-recognition/versions/aa7f35c01e0642fda5cf400f543e7c40/outputs`, requestOptions)
        .then( resp => resp.json() )
        .then( data => {
            let tags = data.outputs[0].data.concepts.slice(0,3).map( obj => obj.name ).join(";");
            req.tags = tags;
            next()
        })
        .catch(error => console.log('error', error));
}

export default Tags;