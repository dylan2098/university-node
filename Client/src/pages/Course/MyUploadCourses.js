import { useEffect, useState, useReducer } from 'react'
import Components from '../../components/Index';
import { Typography, Box, Grid, Paper, Modal, Button } from '@material-ui/core';
import {axiosInstance} from '../../services/utils';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import reducer from '../../reducer/reducer';
import CourseAppContext from '../../context/courseAppContext';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1
    },
    paper: {
      height: 'auto',
      width: 300
    }
}));

export default function MyUploadCourses() {
    const initialAppState = {
        items: []
    }
    const [listMyUploadCourses, dispatch] = useReducer(reducer, initialAppState);
    const [openAddCourse, setOpenAddCourse] = useState();

    async function loadMyUploadCourses() {
        const res = await axiosInstance.get('/course/my-upload-courses', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        let data_items = [];
        if (res.data && res.data.data.length > 0){
            data_items = res.data.data;
        }
        dispatch({
            type: 'init',
            payload: {
                items: data_items
            }
        });
    }

    useEffect(function () {
        loadMyUploadCourses();
    }, []);

    const classes = useStyles();

    return (
        <div>
            <CourseAppContext.Provider value={{ listMyUploadCourses, dispatch }}>
                <Box mt={4} mx={4} mb={2} display="flex">
                    <Typography variant="h5">My upload courses</Typography>
                    <Box ml={1}>
                        <Button 
                            type="button" 
                            variant="contained" 
                            color="primary" 
                            startIcon={<AddCircleIcon />}
                            onClick={() => setOpenAddCourse(true)}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>

                <Modal
                    open={openAddCourse}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <Components.AddCourse handleCloseAddCourse={setOpenAddCourse}/>
                </Modal>

                <Grid container justify="center" spacing={5}>
                    {listMyUploadCourses.items.length > 0 ? 
                        listMyUploadCourses.items.map((course) => (
                            <Grid key={course.id} item>
                            <Paper className={classes.paper}>
                                <Components.MyItemCardUpload course={course} />
                            </Paper>
                            </Grid>
                        ))
                        :
                        <Typography variant="h7">No Upload Courses</Typography>
                    }
                </Grid>
            </CourseAppContext.Provider>
        </div>
    );
}