import { useContext, useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Modal } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from '../../services/utils';
import UserAppContext from '../../context/userAppContext';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        height: "100vh",
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

export default function UpdateUser({ user, setUserEdit }) {
    const { dispatch } = useContext(UserAppContext);
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, errors, setError, clearErrors, reset, setValue } = useForm();

    const onSubmit = async function (data) {
        if (user){
            data["id"] = user.id;
        }
        const res = await axiosInstance.put('/user', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (res.data.status_code == 200) {
            dispatch({
                type: 'update_item',
                payload: {
                    query: res.data.data[0].id,
                    items: {...user , ...res.data.data[0]}
                }
            });
            reset({});
            setUserEdit(null);
            return;
        }
        else if (res.data.status_code == 603) {
            setError("errorCustom.email_invalid", {
                type: "manual",
                message: res.data.message
            });
        }
        else if (res.data.status_code == 609) {
            setError("errorCustom.phone_invalid", {
                type: "manual",
                message: res.data.message
            });
        }
        else if (res.data.status_code == 601) {
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

    useEffect(() => {
        if (user){
            setOpen(true);
            setTimeout(() => {
                setValue('full_name', user.full_name);
                setValue('email', user.email);
                setValue('phone', user.phone);
                setValue('des_futher', user.des_futher);
            });
            clearErrors('errorCustom');
        }
        else {
            setOpen(false);
        }
    }, [user]);

    const classes = useStyles();

    return (
        <Modal
            open={open}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div className={classes.container}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} id="formAddUser">
                    <Box m={1} display="flex">
                        <Box width="90%">
                            <Typography variant="h4">Update User</Typography>
                        </Box>
                        <Box width="10%" align="right">
                            <CloseIcon onClick={() => setUserEdit(null)} />
                        </Box>
                    </Box>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Name"
                        name="full_name"
                        autoFocus
                        inputRef={register({ required: true })}
                    />
                    {errors.full_name && <Box color="red" fontWeight="Bold">Name is required</Box>}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Email"
                        name="email"
                        inputRef={register({ required: true })}
                    />
                    {errors.email && <Box color="red" fontWeight="Bold">Email is required</Box>}
                    {errors.errorCustom && errors.errorCustom.email_invalid && <Box color="red" fontWeight="Bold">{errors.errorCustom.email_invalid.message}</Box>}
                    {errors.errorCustom && errors.errorCustom.email_exist && <Box color="red" fontWeight="Bold">{errors.errorCustom.email_exist.message}</Box>}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Phone"
                        name="phone"
                        inputRef={register({ required: true })}
                    />
                    {errors.phone && <Box color="red" fontWeight="Bold">Phone is required</Box>}
                    {errors.errorCustom && errors.errorCustom.phone_invalid && <Box color="red" fontWeight="Bold">{errors.errorCustom.phone_invalid.message}</Box>}
                    
                    {user && user.role == 1 &&
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Description Futher"
                            name="des_futher"
                            inputRef={register}
                        />
                    }

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => clearErrors('errorCustom')}
                    >
                        Submit
                    </Button>

                </form>
            </div>
        </Modal>
    )
}
