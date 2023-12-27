import { useEffect, useState, useReducer, useContext } from 'react'
import { Button, TextField, Typography, Box, Select, MenuItem, InputLabel } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance, uploadImage } from '../../services/utils';
import { Image, Transformation, Video } from 'cloudinary-react';
import EditorConvertToHTML from '../EditorConvertToHTML';
import { useParams, Link, useHistory } from 'react-router-dom';
import LessonContext from '../../context/lessonAppContext';

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        height: "100vh",
        overflow: 'auto',
    },
    form: {
        backgroundColor: '#ffffff',
        width: "50%",
        margin: "auto",
        border: '1px solid gray',
        padding: theme.spacing(2, 4, 3),
        borderRadius: 16,
    }
}));




export default function AddLesson() {
    const classes = useStyles();
    const { register, handleSubmit, errors, setError, clearErrors, reset, control } = useForm();
    const [shortDescription, setShortDescription] = useState();
    const [video, setVideo] = useState({});
    const { idCourse } = useParams();
    const history = useHistory();
    const [uploadVideoSuccess, setUploadVideoSuccess] = useState(false);

    const onSubmit = async (dataRequest) => {
        const data = dataRequest;
        data.description = shortDescription;
        data.id_courses = parseInt(idCourse);
        data.sort_number = parseInt(dataRequest.sort_number);

        if (video && video.public_id) {
            data.url = video.public_id;
        }

        const res = await axiosInstance.post('/course/add-lesson', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        })

        if (res.data && res.data.status_code == 200) {
            history.push('/item/' + idCourse);
        }
    }


    const uploadVideo = async e => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'n3got5z5');
        setUploadVideoSuccess(false);

        const res = await fetch("https://api.cloudinary.com/v1_1/dvweth7yl/video/upload", {
            method: 'POST',
            body: data
        })

        const file = await res.json();

        if (file && file.public_id) {
            setVideo(file);
            setUploadVideoSuccess(true);
        }
    }


    return (
        <div>
            <div className={classes.container}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>

                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload Video
                         <input
                            type="file"
                            name="file"
                            hidden
                            onChange={uploadVideo}
                        />
                    </Button>


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

                    {
                        !uploadVideoSuccess &&
                            <Box marginTop="5px" marginBottom="3px">Uploading video</Box>
                    }


                    <TextField
                        type="text"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Title"
                        name="title"
                        inputRef={register}
                    />

                    <Box marginTop="16px" marginBottom="8px">
                        <Typography variant="h5">Description</Typography>
                        <EditorConvertToHTML handleChangeValue={setShortDescription} />
                    </Box>

                    <TextField
                        type="text"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Chapter"
                        name="chapter"
                        inputRef={register}
                    />

                    <TextField
                        type="text"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Sort Number"
                        name="sort_number"
                        inputRef={register}
                    />


                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!uploadVideoSuccess}
                    >
                        Submit
                </Button>

                </form>
            </div>
        </div>
    )
}

