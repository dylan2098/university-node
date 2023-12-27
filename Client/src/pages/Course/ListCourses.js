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


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ListCourses() {
    const { id } = useParams();
    let query = useQuery();

    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);



    const initialAppState = {
        query: '',
        items: []
    }

    const [storeCourse, dispatchCourse] = useReducer(reducer, initialAppState);

    async function loadCourses() {
        if (id > 0) {
            let limit = 10;
            let url = '/course/category/' + id;

            if (query.get('limit') && query.get('limit') > 0) {
                limit = query.get('limit');
                url += `?limit=${limit}`;
            }

            if (page > 1) {
                url += `&page=${page}`;
            }

            const res = await axiosInstance.get(url, {
                headers: {
                    Authorization: localStorage.onlineCourse_accessToken
                }
            });

            if (res.data && res.data.status_code == 200) {

                const total = res.data.attached_data.total;

                setTotalPage(Math.ceil(total / limit));

                dispatchCourse({
                    type: 'init',
                    payload: {
                        items: res.data.data,
                        query: ''
                    }
                })
            }
        }
    }

    useEffect(function () {
        loadCourses()
    }, [id, page]);

    const classes = useStyles();

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <div>
            <CourseContext.Provider value={{ store: storeCourse, dispatch: dispatchCourse }}>
                <Box mt={4} mx={4} mb={2}>
                    <Typography variant="h5">Courses</Typography>
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

                <Pagination count={totalPage} showFirstButton showLastButton variant="outlined" color="primary" onChange={handleChange} />
            </CourseContext.Provider>
        </div>
    )
}
