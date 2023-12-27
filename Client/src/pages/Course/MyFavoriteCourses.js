import { useEffect, useState, useReducer } from 'react'
import Components from '../../components/Index';
import { Typography, Box, Grid } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import { makeStyles } from '@material-ui/core/styles';
import CourseContext from '../../context/courseAppContext';
import reducer from '../../reducer/reducer';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    paper: {
        height: 'auto',
        width: 300
    }
}));

const initialAppState = {
    query: '',
    items: []
}
export default function MyFavoriteCourses() {

    const [listMyFavoriteCourses, setListMyFavoriteCourses] = useReducer(reducer, initialAppState);

    async function loadMyFavoriteCourses() {
        const res = await axiosInstance.get('/course/my-favourite-courses', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (res.data && res.data.data.length > 0) {
            setListMyFavoriteCourses({
                type: 'init',
                payload: {
                    items: res.data.data,
                    query: ''
                }
            });
        }
    }

    useEffect(function () {
        loadMyFavoriteCourses();
    }, []);

    const classes = useStyles();

    return (
        <div>
                <CourseContext.Provider value={{ store: listMyFavoriteCourses, dispatch: setListMyFavoriteCourses }}>
            <Box mt={4} mx={4} mb={2} >
                <Typography variant="h5">My favorite courses</Typography>
            </Box>
            <Grid container justify="center" spacing={5}>

                {listMyFavoriteCourses.items.length > 0 ?
                    listMyFavoriteCourses.items.map((course) => (
                        <Components.ItemCard key={course.id} item={course} />
                    ))
                    :
                    <Typography variant="h7">No Favorite Courses</Typography>
                }
                
            
            </Grid>
                </CourseContext.Provider>
        </div>
    )
}