import React, { useEffect, useState, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../../services/utils';
import { Typography, Box, Grid } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import Components from '../../components/Index';
import { makeStyles } from '@material-ui/core/styles';
import reducer from '../../reducer/reducer';
import CourseContext from '../../context/courseAppContext';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            marginTop: theme.spacing(2),
        },
    },
}));


export default function SearchCourse() {
    let query = useQuery();
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);

    const initialAppState = {
        query: '',
        items: []
    }

    const [store, dispatch] = useReducer(reducer, initialAppState);

    const classes = useStyles();

    async function searchListCourses() {
        let url = `/course/all?`;
        let limit = 10;


        if (query.get('q')) {
            url = `/course/search/?q=${query.get('q')}`
        }

        if (query.get('limit') && query.get('limit') > 0) {
            limit = query.get('limit');
            url += `&limit=${limit}`;
        }

        if (page > 1) {
            url += `&page=${page}`;
        }

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        dispatch({
            type: 'init',
            payload: {
                items: response.data.data,
                query: ''
            }
        })

        const total = response.data.attached_data.total;

        setTotalPage(Math.ceil(total / limit));
    }


    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        searchListCourses();
    }, [query.get('q'), page])

    return (
        <div className={classes.root}>
            <Box mt={4} mx={4} mb={2}>
                <Typography variant="h5">Courses</Typography>
            </Box>

            <Grid container justify="center" spacing={5}>

                {store.items.length > 0 ? (
                    <CourseContext.Provider value={{ store, dispatch }}>
                        {
                            store.items.map((course) => (
                                <Components.ItemCard item={course} />
                            ))
                        }

                        <Typography component="div">
                            <Pagination count={totalPage} showFirstButton showLastButton variant="outlined" color="primary" onChange={handleChange} />
                        </Typography>
                    </CourseContext.Provider>
                )
                    :
                    <Typography variant="h7">No Courses</Typography>
                }
            </Grid>
        </div>
    )
}
