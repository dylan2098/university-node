import { useContext } from 'react';
import { Button, TextField, Typography, Box } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
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

export default function AddUser({ handleCloseAddUser }) {
    const { dispatch } = useContext(UserAppContext);

    const { register, handleSubmit, errors, setError, clearErrors, reset } = useForm();

    const onSubmit = async function (data) {
        const res = await axiosInstance.post('/user', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (res.data.status_code == 200) {
            dispatch({
                type: 'add_item',
                payload: res.data.data[0]
            });
            reset({});
            handleCloseAddUser();
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


    const classes = useStyles();

    return (
        <div className={classes.container}>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)} id="formAddUser">
                <Box m={1} display="flex">
                    <Box width="90%">
                        <Typography variant="h4">Add Teacher</Typography>
                    </Box>
                    <Box width="10%" align="right">
                        <CloseIcon onClick={handleCloseAddUser} />
                    </Box>
                </Box>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="full_name_user"
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
                    id="email_user"
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
                    id="email_user"
                    label="Phone"
                    name="phone"
                    inputRef={register({ required: true })}
                />
                {errors.phone && <Box color="red" fontWeight="Bold">Phone is required</Box>}
                {errors.errorCustom && errors.errorCustom.phone_invalid && <Box color="red" fontWeight="Bold">{errors.errorCustom.phone_invalid.message}</Box>}
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="des_futher_user"
                    label="Description Futher"
                    name="des_futher"
                    inputRef={register}
                />

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
    )
}
