import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Box } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import CourseAppContext from '../../context/courseAppContext';
import { useForm, Controller } from 'react-hook-form';
import { FormControl, InputLabel, Input, Select, MenuItem, Button, TextField, Typography } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    colorBackground: {
        backgroundColor: '#ffffff'
    }
}));


export default function ListCourse() {
    const { register, handleSubmit, control } = useForm();
    const classes = useStyles();
    const { store, dispatch } = useContext(CourseAppContext);
    const [categories, setCategories] = useState([]);
    const [teachers, setTeachers] = useState([]);



    const loadListCourses = async () => {
        const response = await axiosInstance.get('/course/list-courses', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        })

        if (response.data.status_code === 200) {

            console.log(response.data);
            dispatch({
                type: 'init',
                payload: {
                    items: response.data.data,
                    query: ''
                }
            })
        }
    }


    const loadCategories = async () => {
        const response = await axiosInstance.get('/category/list', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code == 200) {
            setCategories(response.data.data);
        }
    }


    const loadTeachers = async () => {
        const response = await axiosInstance.get('/user/list-teachers', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code == 200) {
            setTeachers(response.data.data);
        }
    }


    useEffect(() => {
        loadListCourses();
        loadCategories();
        loadTeachers();
    }, [])

    const handleChange = async (id, active) => {
        const data = { id, active: active == 1 ? 0 : 1 };
        const response = await axiosInstance.put('/course/active-course', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code === 200) {
            dispatch({
                type: 'update_item',
                payload: {
                    query: id,
                    items: response.data.data[0]
                }
            })
        }
    }

    const renderStatusComponent = (status) => {
        let name = '';
        let bgcolor = '';
        switch (status) {
            case 0:
                name = "Uncomplete";
                bgcolor = "secondary.main";
                break;
            case 1:
                name = "Complete";
                bgcolor = "success.main";
                break;
        }
        return (
            <Box marginY={2} width="100px" marginY={2} align="center" color="white" bgcolor={bgcolor} borderRadius={16}>
                {name}
            </Box>
        )
    }


    const onSubmit = async function (data) {
        let url = '/course/list-courses/?';

        if (data.category) {
            url += `category=${data.category}`
        }

        if (data.teacher) {
            url += `&teacher=${data.teacher}`
        }


        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code === 200) {
            dispatch({
                type: 'init',
                payload: {
                    items: response.data.data,
                    query: ''
                }
            })
        }
    };



    const filterComponents = () => {
        return (
            <div>
                <form id="formFilter" onSubmit={handleSubmit(onSubmit)} >
                    <FormControl className={classes.formControl}>

                        <InputLabel htmlFor="category-select">
                            Category
                        </InputLabel>


                        <Controller
                            control={control}
                            name="category"
                            as={
                                <Select id="category-select">
                                    <MenuItem value={0}>None</MenuItem>
                                    {
                                        categories.length > 0 && categories.map(item =>
                                            item && <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        )
                                    }
                                </Select>
                            }
                        />
                    </FormControl>


                    <FormControl className={classes.formControl}>

                        <InputLabel htmlFor="teacher-select">
                            Teacher
                        </InputLabel>


                        <Controller
                            control={control}
                            name="teacher"
                            as={
                                <Select id="teacher-select">
                                    <MenuItem value={0}>None</MenuItem>
                                    {
                                        teachers.length > 0 && teachers.map(item =>
                                            item && <MenuItem key={item.id} value={item.id}>{item.full_name}</MenuItem>
                                        )
                                    }
                                </Select>
                            }
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Filter
                    </Button>
                </form>
            </div>
        )
    }


    return (
        <CourseAppContext.Provider value={{ store, dispatch }}>
            {
                filterComponents()
            }
            {
                (store.items.length > 0) ? (
                    <TableContainer TableContainer TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">#ID</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Category Name</TableCell>
                                    <TableCell align="center">Teacher</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Promotion Price</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">OFF/ON (Active)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {store.items.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">{row.title}</TableCell>
                                        <TableCell align="center">{row.category_name}</TableCell>
                                        <TableCell align="center">{row.full_name}</TableCell>
                                        <TableCell align="center">{row.price}</TableCell>
                                        <TableCell align="center">{row.promotion_price}</TableCell>
                                        {
                                            renderStatusComponent(row.status)
                                        }
                                        <TableCell align="center">
                                            <Switch
                                                checked={row.active == 1 ? true : false}
                                                onChange={() => handleChange(row.id, row.active)}
                                                name="active"
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) :
                    (
                        <Typography className={classes.title} variant="h6" noWrap>
                            Courses Empty
                        </Typography>
                    )
            }


        </CourseAppContext.Provider >
    )
}
