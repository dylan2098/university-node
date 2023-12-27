import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react';


export default function Upload() {

    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState({});

    const uploadData = async e => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'n3got5z5');
        setLoading(true);

        const res = await fetch("https://api.cloudinary.com/v1_1/dvweth7yl/video/upload", {
            method: 'POST',
            body: data
        })

        const file = await res.json();
        console.log("file", file);

        if (file && file.url) {
            setVideo(file);
        }
    }

    return (
        <div>
            <Button
                variant="contained"
                component="label"
            >
                Upload File
            <input
                    type="file"
                    name="file"
                    hidden
                    onChange={uploadData}
                />
            </Button>
            <p></p> &nbsp;

            {
                video && video.public_id ? (
                    <Video
                        cloudName="dvweth7yl" publicId={video.public_id}
                        fallbackContent="Your browser does not support HTML5 video tags."
                        controls={true} >
                        <Transformation crop="pad" height="360" width="480" quality="70" duration="10" />
                    </Video>


                )
                    : null
            }

        </div>
    )
}
