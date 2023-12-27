import React, { useState, useContext } from 'react';

import { Button, CssBaseline, TextField, Container, Box } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import {Star} from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { axiosInstance } from '../../services/utils';
import DetailCourseContext from '../../context/detailCourseContext';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


export default function FormFeedBack() {
    const { dispatch } = useContext(DetailCourseContext);

    const { id } = useParams();

    const StyledRating = withStyles({
        iconFilled: {
            color: '#ff9800',
        },
        iconHover: {
            color: '#f57c00',
        },
    })(Rating);


    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const [valueRating, setValueRating] = useState(5);
    const [message, setMessage] = useState("");


    const onSubmit = async function (data) {
        data.point_star = valueRating;
        data.id_courses = parseInt(id);

        const res = await axiosInstance.post('/feedback', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (res.data.status_code === 200) {
            dispatch({
                type: 'add_item',
                payload: res.data.data[0]
            });
            setMessage(res.data.message);
            document.getElementById('formFeedBack').reset();
        }
    }


    return (
        <Container Container component="main" maxWidth="xs" >
            <CssBaseline />
            <div className={classes.paper}>
                <form className={classes.form} id="formFeedBack" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        autoFocus
                        inputRef={register({ required: true })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="content"
                        label="Content"
                        id="content"
                        autoComplete="current-password"
                        inputRef={register({ required: true })}
                    />

                    <Box component="fieldset" mb={1} borderColor="transparent">
                        <StyledRating
                            name="customized-color"
                            defaultValue={valueRating}
                            getLabelText={(valueRating) => `${valueRating} Star${valueRating !== 1 ? 's' : ''}`}
                            precision={0.5}
                            icon={<Star fontSize="inherit" />}
                            onChange={(event, newValue) => {
                                setValueRating(newValue);
                            }}
                        />
                    </Box>

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
            <div>
                {
                    message ? message : null
                }
            </div>
        </Container>
    )
}
