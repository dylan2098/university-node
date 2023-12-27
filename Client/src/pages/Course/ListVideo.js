import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../services/utils';
import env from '../../config/config.json';
import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react';
import { Card, CardContent, CardMedia, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';


import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        marginTop: 10
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginRight: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    cover: {
        width: '100%'
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    }
}));

export default function ListVideo() {
    const classes = useStyles();
    const { idCourse, idLesson } = useParams();

    const [listVideo, setListVideo] = useState([]);
    const [video, setVideo] = useState(null);

    const listVideos = async () => {
        const response = await axiosInstance.get(`course/${idCourse}/lesson`, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        setListVideo(response.data.data);
    }

    const loadVideo = async () => {
        const response = await axiosInstance.get(`course/${idCourse}/lesson/${idLesson}`, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        setVideo(response.data.data[0]);
    }

    const onClickWatchVideo = async (lessonId) => {
        const data = { lessonId, courseId: idCourse }
        const response = await axiosInstance.post(`storage`, data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        })
    }


    useEffect(() => {
        listVideos();
        loadVideo();
    }, [idLesson]);


    return (
        <div className={classes.root}>

            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Button component={Link} color="inherit" to={"/"}>Home</Button>
                </Toolbar>
            </AppBar>


            <main className={classes.content}>
                <div className={classes.toolbar} />
                {
                    (video != null) && (
                        <>
                            <Video
                                cloudName={env.cloud_dinary.cloud_name} publicId={video.url}
                                fallbackContent={video.title}
                                controls={true} >
                                <Transformation crop="pad" height="720" width="1280" quality="70"/>
                            </Video>
                            <Typography variant="body1">Chapter {video.chapter} - {video.title}</Typography>
                            <Typography variant="body1">{video.description}</Typography>
                        </>
                    )
                }

            </main>

            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="right"
            >
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    {
                        (listVideo.length > 0) && listVideo.map(video =>
                            <Link to={`/course/${idCourse}/lesson/${video.id}`} key={video.id} >
                                <Card className={classes.root} onClick={() => onClickWatchVideo(video.id)}>
                                    <div className={classes.details}>
                                        <CardContent className={classes.content}>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                {video.title}
                                            </Typography>
                                        </CardContent>
                                    </div>
                                </Card>
                            </Link>
                        )
                    }
                </List>
            </Drawer>

        </div >
    )
}
