import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';
import { axiosInstance } from '../../services/utils';


const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        marginTop: 30
    },
});


export default function LearnedVideos() {
    const classes = useStyles();
    const [videos, setVideos] = useState([]);

    async function loadMyVideoLearned() {
        const response = await axiosInstance.get('/storage/list', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        setVideos(response.data.data);
    }

    useEffect(() => {
        loadMyVideoLearned();
    }, []);

    return (
        <>
            {
                videos.length > 0 && videos.map(video => (
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
                                    {video.lesson.title} - Chapter {video.lesson.chapter}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {video.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary" component={Link} to={`/course/${video.id_course}/lesson/${video.id_lesson}`}>
                                Watch video
                            </Button>
                        </CardActions>
                    </Card>
                ))
            }
        </>
    )
}
