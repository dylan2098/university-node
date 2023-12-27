import React, { useEffect, useState, useReducer } from 'react'
import Components from '../../components/Index';
import { Typography, Box, Grid } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useLocation } from "react-router-dom";
import CourseContext from '../../context/courseAppContext';
import reducer from '../../reducer/reducer';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        '& > *': {
            marginTop: theme.spacing(2),
        },
    },
    paper: {
        height: 'auto',
        width: 300
    }
}));

export default function MyCourses() {
    const initialAppState = {
        query: '',
        items: []
    }
    const [storeCourse, dispatchCourse] = useReducer(reducer, initialAppState);
    async function loadCourses() {
        let url = '/course/my-courses';
        const res = await axiosInstance.get(url, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (res.data && res.data.data.length > 0) {

            dispatchCourse({
                type: 'init',
                payload: {
                    items: res.data.data,
                    query: ''
                }
            })
        }
    }

    useEffect(function () {
        loadCourses()
    }, []);

    const classes = useStyles();

    return (
        <div>
            <CourseContext.Provider value={{ store: storeCourse, dispatch: dispatchCourse }}>
                <Box mt={4} mx={4} mb={2}>
                    <Typography variant="h5">My Courses</Typography>
                </Box>

                <Grid container justify="center" spacing={5}>
                    {storeCourse.items.length > 0 ?
                        storeCourse.items.map((course) => (
                            <Components.ItemCard item={course} />
                        ))
                        :
                        <Typography variant="h7">No Courses</Typography>
                    }
                </Grid>
            </CourseContext.Provider>
        </div>
    )
}
