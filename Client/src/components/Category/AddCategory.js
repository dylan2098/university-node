import React, { useEffect, useState, useContext } from 'react';
import { FormControl, InputLabel, Input, Select, MenuItem, Button, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from '../../services/utils';
import CategoryAppContext from '../../context/categoryAppContext';

const useStyles = makeStyles((theme) => ({
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
}))



export default function AddCategory() {
    const { dispatch } = useContext(CategoryAppContext);

    const { register, handleSubmit, control } = useForm({
        defaultValues: {
            name_category: '',
            parent_category: 0
        },
    });

    const onSubmit = async function (data) {
        const res = await axiosInstance.post('/category', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (res.data.status_code === 200) {
            dispatch({
                type: 'add_item',
                payload: res.data.data
            });
            document.getElementById('formAddCategory').reset();
        }
    };


    const classes = useStyles();

    const [categoriesParent, setCategoriesParent] = useState([]);

    const loadCategoriesParent = async () => {
        const response = await axiosInstance.get('/category/0');
        setCategoriesParent(response.data.data);
    }

    useEffect(() => {
        loadCategoriesParent();
    }, [])

    return (
        <div className={classes.colorBackground}>
            <form id="formAddCategory" onSubmit={handleSubmit(onSubmit)} >

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name_category"
                    label="Name"
                    name="name"
                    autoFocus
                    inputRef={register({ required: true })}
                />

                <FormControl className={classes.formControl}>

                    <InputLabel htmlFor="category-select">
                        Parent Category
                    </InputLabel>


                    <Controller
                        control={control}
                        name="id_parent"
                        as={
                            <Select id="category-select">
                                <MenuItem value={0}>None</MenuItem>
                                {
                                    categoriesParent.length > 0 && categoriesParent.map(item =>
                                        item && <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
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
                    Submit
          </Button>

            </form>
        </div>
    )
}
