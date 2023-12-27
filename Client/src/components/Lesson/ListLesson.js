import React, { useEffect, useContext, useState, useReducer } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { axiosInstance, uploadImage } from '../../services/utils';
import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditorConvertFromHTML from '../EditorConvertFromHTML';
import LessonContext from '../../context/lessonAppContext';
import reducer from '../../reducer/reducer';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        marginTop: 30
    },
});


export default function ListLesson() {
    const classes = useStyles();
    const { id } = useParams();
    const [videos, setVideos] = useState([]);

    const initialAppState = {
        query: '',
        items: []
    }

    const [store, dispatch] = useReducer(reducer, initialAppState);


    const listLesson = async () => {
        const response = await axiosInstance.get(`/course/${id}/lesson`, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        // console.log(response.data.data);
        // setVideos(response.data.data);

        dispatch({
            type: 'init',
            payload: {
                items: response.data.data,
                query: ''
            }
        })


    }

    useEffect(() => {
        listLesson();
    }, [])


    const deleteLesson = async (idLesson) => {
        const response = await axiosInstance.delete(`/course/${id}/lesson/${idLesson}`, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        })

        if (response.data.status_code === 200) {
            dispatch({
                type: 'delete_item',
                payload: {
                    query: idLesson
                }
            })
        }
    }

    return (
        <>
            <Button size="small" color="primary" component={Link} to={`/add-lesson/${id}`}>
                + Add Lesson
            </Button>
            <LessonContext.Provider value={{ store, dispatch }} >
                {
                    store.items.length > 0 && store.items.map(video => (
                        <Card className={classes.root} key={video.id}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    alt="Contemplative Reptile"
                                    height="140"
                                    image="/assets/images/test.jpg"
                                    title="Contemplative Reptile"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {video.title} - Chapter {video.chapter}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <EditorConvertFromHTML html={video.description} />
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary" component={Link} to={`/course/${id}/lesson/${video.id}`}>
                                    Watch video
                            </Button>
                                <Button size="small" color="primary" onClick={() => deleteLesson(video.id)}>
                                    Delete
                            </Button>
                            </CardActions>
                        </Card>
                    ))
                }
            </LessonContext.Provider>
        </>
    )
}
