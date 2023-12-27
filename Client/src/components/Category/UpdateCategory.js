import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { axiosInstance } from '../../services/utils';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import CategoryAppContext from '../../context/categoryAppContext';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
}));




export default function UpdateCategory() {
    const { dispatch } = useContext(CategoryAppContext);

    const { id } = useParams();
    const classes = useStyles();
    const [category, setCategory] = useState({});
    const [categoriesParent, setCategoriesParent] = useState([]);

    const { register, handleSubmit, control } = useForm();
    const history = useHistory();


    const onSubmit = async (data) => {
        const dataSendRequest = { id: parseInt(id) };
        if (data.id_parent) {
            dataSendRequest.id_parent = data.id_parent;
        }

        if (data.name && data.name != "") {
            dataSendRequest.name = data.name;
        }

        const response = await axiosInstance.put('/category', dataSendRequest, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        history.push('/admin/category/');
    }


    async function loadCategory(id) {
        const response = await axiosInstance.get('/category/detail/' + id, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code === 200) {
            setCategory(response.data.data);
        }
    }


    async function loadCategoriesParent() {
        const response = await axiosInstance.get('/category/0');
        setCategoriesParent(response.data.data);
    }


    useEffect(() => {
        loadCategory(id)
        loadCategoriesParent();
    }, []);

    return (
        <div>
            <Typography variant="h4">
                Update Category
            </Typography>

            <form id="formUpdate" className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <TextField id="outlined-basic" value={category.id} disabled />
                </div>
                <div>
                    <TextField id="outlined-basic" name="name" inputRef={register()} label={category.name} />
                </div>

                {
                    (category.id_parent > 0) && (
                        <div>
                            <FormControl className={classes.formControl}>

                                <Controller
                                    control={control}
                                    name="id_parent"
                                    as={
                                        <Select id="select" defaultValue={category.id_parent}>
                                            {
                                                categoriesParent.map(item =>
                                                    <MenuItem key={item.id} defaultValue={item.id} value={item.id} selected={item.id == category.id_parent ? true : false}>
                                                        {item.name}
                                                    </MenuItem>)
                                            }
                                        </Select>
                                    }
                                />
                            </FormControl>
                        </div>
                    )
                }

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Submit
                </Button>

                <Button color="primary" component={Link} to={'/admin/category/'}>Cancel</Button>

            </form>
        </div>
    )
}
