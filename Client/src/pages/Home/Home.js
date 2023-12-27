import React, { useEffect, useState, useReducer } from 'react'
import Carousel from 'react-multi-carousel';
import Components from '../../components/Index';
import { Typography, Box, Button } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import reducer from '../../reducer/reducer';
import CourseContext from '../../context/courseAppContext';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    linkRef: {
        textDecoration: 'none',
    },
    headerMargin: {
        marginTop: 20,
        marginLeft: 20
    },
}));


export default function Home() {
    const classes = useStyles();
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const [itemsCategory, setItemCategoryOfWeek] = useState([]);

    const initialAppState = {
        query: '',
        items: []
    }

    const [storeLoadTop10CoursesNew, dispatchloadTop10CoursesNew] = useReducer(reducer, initialAppState);
    const [storeLoadFiveCourseBestSeller, dispatchloadFiveCourseBestSeller] = useReducer(reducer, initialAppState);
    const [storeLoadTop4CoursesHotMost, dispatchLoadTop4CoursesHotMost] = useReducer(reducer, initialAppState);
    const [storeLoadTop10CoursesViewMost, dispatchLoadTop10CoursesViewMost] = useReducer(reducer, initialAppState);

    async function loadTop10CoursesNew() {
        const res = await axiosInstance.get('/course/best-new', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (res.data && res.data.data.length > 0) {
            dispatchloadTop10CoursesNew({
                type: 'init',
                payload: {
                    items: res.data.data,
                    query: ''
                }
            });
        }
    }

    async function loadTop4coursesHotMost() {
        const res = await axiosInstance.get('/course/top-4-courses-hot-most', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (res.data && res.data.data.length > 0) {
            // setItemsTop4CoursesHotMost(res.data.data);
            dispatchLoadTop4CoursesHotMost({
                type: 'init',
                payload: {
                    items: res.data.data,
                    query: ''
                }
            });
        }
    }

    async function loadTop10CoursesViewMost() {
        const res = await axiosInstance.get('/course/top-10-courses-view-most', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (res.data && res.data.data.length > 0) {
            dispatchLoadTop10CoursesViewMost({
                type: 'init',
                payload: {
                    items: res.data.data,
                    query: ''
                }
            });
        }
    }


    async function loadFiveCourseBestSeller() {
        const res = await axiosInstance.get('/course/best-seller', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (res.data.data.length > 0) {
            // setItemFiveCourseBestSeller(res.data.data);
            dispatchloadFiveCourseBestSeller({
                type: 'init',
                payload: {
                    items: res.data.data,
                    query: ''
                }
            });
        }
    }


    async function loadCategoryOfWeek() {
        const res = await axiosInstance.get('/category/list-category-subscriptions-week');
        if (res.data.data.length > 0) {
            setItemCategoryOfWeek(res.data.data);
        }
    }


    useEffect(function () {
        loadTop10CoursesNew();
        loadTop4coursesHotMost();
        loadFiveCourseBestSeller();
        loadCategoryOfWeek();
        loadTop10CoursesViewMost();
    }, [])

    return (
        <div>
            {
                storeLoadFiveCourseBestSeller.items.length > 0 && (
                    <CourseContext.Provider value={{ store: storeLoadFiveCourseBestSeller, dispatch: dispatchloadFiveCourseBestSeller }}>
                        <div style={{ marginTop: 35 }}>
                            <Box mt={4} mx={4} mb={0.5} >
                                <Typography variant="h5">The 5 most purchased courses</Typography>
                            </Box>
                            <Carousel responsive={responsive}>
                                {
                                    storeLoadFiveCourseBestSeller.items.map(item => <Components.ItemCard key={item.id} item={item} />)
                                }

                            </Carousel>
                        </div>
                    </CourseContext.Provider>
                )
            }


            {
                storeLoadTop4CoursesHotMost.items.length > 0 && (
                    <CourseContext.Provider value={{ store: storeLoadTop4CoursesHotMost, dispatch: dispatchLoadTop4CoursesHotMost }}>
                        <div style={{ marginTop: 35 }}>
                            <Box mt={4} mx={4} mb={0.5} >
                                <Typography variant="h5">The top 4 courses hot most</Typography>
                            </Box>
                            <Carousel responsive={responsive}>
                                {
                                    storeLoadTop4CoursesHotMost.items.map(item => <Components.ItemCard key={item.id} item={item} />)
                                }
                            </Carousel>
                        </div>
                    </CourseContext.Provider>
                )
            }


            {
                storeLoadTop10CoursesViewMost.items.length > 0 && (
                    <CourseContext.Provider value={{ store: storeLoadTop10CoursesViewMost, dispatch: dispatchLoadTop10CoursesViewMost }}>
                        <div style={{ marginTop: 35 }}>
                            <Box mt={4} mx={4} mb={0.5} >
                                <Typography variant="h5">The top 10 courses view most</Typography>
                            </Box>
                            <Carousel responsive={responsive}>
                                {
                                    storeLoadTop10CoursesViewMost.items.map(item => <Components.ItemCard key={item.id} item={item} />)
                                }
                            </Carousel>
                        </div>
                    </CourseContext.Provider>
                )
            }

            {
                storeLoadTop10CoursesNew.items.length > 0 && (
                    <CourseContext.Provider value={{ store: storeLoadTop10CoursesNew, dispatch: dispatchloadTop10CoursesNew }}>
                        <div style={{ marginTop: 35 }}>
                            <Box mt={4} mx={4} mb={0.5} >
                                <Typography variant="h5">The top 10 courses new most</Typography>
                            </Box>
                            <Carousel responsive={responsive}>
                                {
                                    storeLoadTop10CoursesNew.items.map(item => <Components.ItemCard key={item.id} item={item} />)
                                }
                            </Carousel>
                        </div>
                    </CourseContext.Provider>
                )
            }

            {
                itemsCategory.length > 0 && (
                    <div style={{ marginTop: 35 }}>
                        <Box mt={4} mx={4} mb={0.5} >
                            <Typography variant="h5">The most registered schools last week</Typography>
                        </Box>

                        {
                            itemsCategory.map(item => <Button variant="contained" color="secondary" className={classes.headerMargin} component={Link} to={'/category/' + item.id} key={item.id}>
                                {item.name}
                            </Button>)
                        }

                    </div>
                )
            }


        </div>
    )
}
