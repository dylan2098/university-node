import React, { useState, useEffect, useReducer, useContext } from 'react'
import { useParams } from 'react-router-dom';
import reducer from '../../reducer/reducer';
import { axiosInstance } from '../../services/utils';
import { Typography, Box, Button } from '@material-ui/core';
import Components from '../../components/Index';
import { makeStyles } from '@material-ui/core/styles';
import Carousel from 'react-multi-carousel';
import DetailCourseContext from '../../context/detailCourseContext';
import CourseContext from '../../context/courseAppContext';
import { Link } from 'react-router-dom';


import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';




const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: 20
    },
    linkRef: {
        textDecoration: 'none',
    }
}));


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `wrapped-tab-${index}`,
        'aria-controls': `wrapped-tabpanel-${index}`,
    };
}


export default function DetailCourse() {
    const classes = useStyles();



    const [value, setValue] = React.useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



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


    const { id } = useParams();
    const [course, setCourse] = useState(null);

    const initialAppState = {
        query: '',
        items: []
    }

    const [storeDetailCourse, dispatchDetailCourse] = useReducer(reducer, initialAppState);
    const [storeCourse, dispatchCourse] = useReducer(reducer, initialAppState);

    async function loadCourseDetail() {
        if (id !== 0) {
            const res = await axiosInstance.get('/course/' + id, {
                headers: {
                    Authorization: localStorage.onlineCourse_accessToken
                }
            });
            if (res.data.data.length > 0) {
                setCourse(res.data.data[0]);
                await loadFiveCourseBestSeller(res.data.data[0].id_category);
            }
        }
    }


    async function loadFiveCourseBestSeller(categoryId) {
        const res = await axiosInstance.get('/course/best-seller-category/' + categoryId, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (res.data.data.length > 0) {
            dispatchCourse({
                type: 'init',
                payload: {
                    items: res.data.data,
                    query: ''
                }
            })
        }
    }


    async function loadRatings(page = 1, limit = 5) {
        if (id !== 0) {
            const res = await axiosInstance.get('/feedback/course/' + id + '?limit=' + limit + '&page=' + page);
            if (res.data.data.length > 0) {
                dispatchDetailCourse({
                    type: 'init',
                    payload: {
                        items: res.data.data,
                        query: res.data.attached_data
                    }
                });
            }
        }
    }

    useEffect(function () {
        loadCourseDetail();
        loadRatings()
    }, [id]);

    return (
        course ? (
            <div className={classes.root}>
                <DetailCourseContext.Provider value={{ store: storeDetailCourse, dispatch: dispatchDetailCourse }}>
                    <CourseContext.Provider value={{ store: storeCourse, dispatch: dispatchCourse }}>

                        {
                            course.first_video_id && course.is_buy &&
                            <div style={{ marginTop: 35 }}>
                                <Box mt={4} mx={4} mb={0.5} >
                                    <Button component={Link} color="primary" to={"/course/" + course.id + "/lesson/" + course.first_video_id}>Xem Video</Button>
                                </Box>
                            </div>
                        }

                        <AppBar position="static">
                            <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                                <Tab
                                    value="one"
                                    label="Course Information"
                                    wrapped
                                    {...a11yProps('one')}
                                />
                                <Tab value="two" label="Teacher Information" {...a11yProps('two')} />
                                <Tab value="three" label="Rating" {...a11yProps('three')} />
                                {localStorage.onlineCourse_role == 2 && course.is_buy && <Tab value="four" label="Add Feedback" {...a11yProps('four')} />}
                                <Tab value="five" label="Top 5 purchases" {...a11yProps('five')} />
                                {localStorage.onlineCourse_role < 2 && localStorage.onlineCourse_id == course.id_creator && 
                                    <Tab value="six" label="Update Courses" {...a11yProps('six')} />
                                }
                                {localStorage.onlineCourse_role == 1 && localStorage.onlineCourse_id == course.id_creator &&
                                    <Tab value="seven" label="Lesson" {...a11yProps('seven')} />
                                }
                            </Tabs>
                        </AppBar>

                        <TabPanel value={value} index="one">
                            <Components.DetailCard course={course} />
                        </TabPanel>

                        <TabPanel value={value} index="two">
                            <Typography component={'div'} variant={'h4'}>Teacher</Typography>

                            {course.user.full_name && <div>
                                <b>Full Name</b> : {course.user.full_name}
                            </div>}

                            {course.user.email && <div>
                                <b>Email</b> : {course.user.email}
                            </div>}

                            {course.user.phone && <div>
                                <b>Phone</b> : {course.user.phone}
                            </div>}


                            {course.user.des_futher && <div>
                                <b>Description Futher</b> : {course.user.des_futher}
                            </div>}

                        </TabPanel>

                        <TabPanel value={value} index="three">
                            <Components.Rating />
                        </TabPanel>

                        {
                            localStorage.onlineCourse_role == 2 && <TabPanel value={value} index="four">
                                {
                                    course.is_buy ? <>
                                        <Components.FormFeedBack />
                                    </> : <b>Please buy the course!</b>
                                }
                            </TabPanel>
                        }

                        <TabPanel value={value} index="five">
                            <div style={{ marginTop: 35 }}>
                                <Box mt={4} mx={4} mb={0.5} >
                                    <Typography variant="h5">Top 5 purchases of courses in the same field</Typography>
                                </Box>
                                <Carousel responsive={responsive}>
                                    {
                                        storeCourse.items.length > 0 ?
                                            storeCourse.items.map(item => <Components.ItemCard key={item.id} item={item} />)
                                        :
                                            <b style={{ color: 'red' }}>Empty Data</b>
                                    }
                                </Carousel>
                            </div>
                        </TabPanel>

                        {
                            (localStorage.onlineCourse_role == 1 && localStorage.onlineCourse_id == course.id_creator) && <TabPanel value={value} index="six">
                                <div style={{ marginTop: 35 }}>
                                    <Box mt={4} mx={4} mb={0.5} >
                                        <Components.UpdateCourse course={course} />
                                    </Box>
                                </div>
                            </TabPanel>
                        }


                        {
                            (localStorage.onlineCourse_role == 1 && localStorage.onlineCourse_id == course.id_creator) && <TabPanel value={value} index="seven">
                                <div style={{ marginTop: 35 }}>
                                    <Box mt={4} mx={4} mb={0.5} >
                                        <Components.ListLesson />
                                    </Box>
                                </div>
                            </TabPanel>
                        }


                    </CourseContext.Provider>
                </DetailCourseContext.Provider>
            </div>
        )
            :
            <Typography component={'span'} variant={'body2'}>Loading ...</Typography>

    )
}
