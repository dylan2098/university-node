import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { Button, Box, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert'
import {axiosInstance} from '../../services/utils';
import {useForm} from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 1, 2),
        height: "40px"
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        height: "70vh",
    },
    form: {
        backgroundColor: '#ffffff',
        width: "50%",
        margin: "auto",
        border: '1px solid gray',
        padding: theme.spacing(2, 4, 3),
        borderRadius: 16,
    }
}));


export default function UserProfile() {
    const classes = useStyles();
    const {register, handleSubmit, errors, setError, clearErrors, reset, setValue} = useForm();

    const [userEdit, setUserEdit] = useState();
    const [saveSuccess, setSaveSuccess] = useState(false);

    const onSubmit = async function (data) {
        setSaveSuccess(false);
        const res = await axiosInstance.put('/user/update', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (res.data.status_code == 200) {
            setUserEdit(res.data.data[0]);
            localStorage.onlineCourse_displayName = res.data.data[0].full_name;
            setSaveSuccess(true);
            return;
        } else if (res.data.status_code == 603) {
            setError("errorCustom.email_invalid", {
                type: "manual",
                message: res.data.message
            });
        } else if (res.data.status_code == 609) {
            setError("errorCustom.phone_invalid", {
                type: "manual",
                message: res.data.message
            });
        } else if (res.data.status_code == 601) {
            setError("errorCustom.email_exist", {
                type: "manual",
                message: "Email exists!"
            });
        }
        reset({
            ...data
        }, {
            errors: true
        });
    };

    async function loadProfileUser() {
        const response = await axiosInstance.get('/user/profile', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (response.data && response.data.status_code === 200) {
            setUserEdit(response.data.data);
        }
    }

    useEffect(function () {
        loadProfileUser();
    }, []);

    useEffect(function () {
        if (userEdit) {
            setTimeout(() => {
                setValue('full_name', userEdit.full_name);
                setValue('email', userEdit.email);
                setValue('phone', userEdit.phone);
                setValue('des_futher', userEdit.des_futher);
            });
            clearErrors('errorCustom');
        }
        else {
            reset({});
        }
    }, [userEdit]);

    return (userEdit ?
        <div className={classes.container}>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <Box m={1} display="flex">
                    <Box>
                        <Typography variant="h4">Profile</Typography>
                    </Box>
                </Box>
                
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Name"
                    name="full_name"
                    autoFocus
                    inputRef={register({required: true})}
                />
                {errors.full_name && <Box color="red" fontWeight="Bold">Name is required</Box>}
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email"
                    name="email"
                    inputRef={register({required: true})}
                />
                {errors.email && <Box color="red" fontWeight="Bold">Email is required</Box>}
                {errors.errorCustom && errors.errorCustom.email_invalid &&
                <Box color="red" fontWeight="Bold">{errors.errorCustom.email_invalid.message}</Box>}
                {errors.errorCustom && errors.errorCustom.email_exist &&
                <Box color="red" fontWeight="Bold">{errors.errorCustom.email_exist.message}</Box>}
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Phone"
                    name="phone"
                    inputRef={register({required: true})}
                />
                {errors.phone && <Box color="red" fontWeight="Bold">Phone is required</Box>}
                {errors.errorCustom && errors.errorCustom.phone_invalid &&
                <Box color="red" fontWeight="Bold">{errors.errorCustom.phone_invalid.message}</Box>}

                {userEdit.role == 1 &&
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Description Futher"
                    name="des_futher"
                    inputRef={register}
                />
                }

                <Box m={1} display="flex" className={classes.submit}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={() => clearErrors('errorCustom')}
                    >
                        Save
                    </Button>
                    {saveSuccess && 
                        <Box marginLeft={1}>
                            <Alert severity="success">Save success!</Alert>
                        </Box>
                    }
                </Box>
            </form>
        </div>
        :
        <Typography component={'span'} variant={'body2'}>Loading ...</Typography>
    )
}
