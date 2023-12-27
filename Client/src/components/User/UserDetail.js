import { useState, useEffect } from 'react';
import { TextField, Typography, Box, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
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

export default function UserDetail({ user, setDetailUser }) {
    const [open, setOpen] = useState(false);
    const { register, setValue } = useForm();

    useEffect(() => {
        if (user){
            setOpen(true);
            setTimeout(() => {
                setValue('full_name', user.full_name);
                setValue('email', user.email);
                setValue('phone', user.phone);
                setValue('des_futher', user.des_futher);
                setValue('created_at', user.created_at.substring(0,16));
                setValue('updated_at', user.updated_at.substring(0,16));
            });
        }
        else {
            setOpen(false);
        }
    }, [user]);

    const renderRoleComponent = (role) => {
        let roleName = '';
        let bgcolor = '';
        switch (role) {
            case 0:
                roleName = "Admin";
                bgcolor = "secondary.main";
                break;
            case 1:
                roleName = "Teacher";
                bgcolor = "success.main";
                break;
            case 2:
                roleName = "Student";
                bgcolor = "info.main";
                break;
        }
        return (
            <Box marginY={2} width="100px" marginY={2} align="center" color="white" bgcolor={bgcolor} borderRadius={16}>
                {roleName}
            </Box>
        )
    }

    const classes = useStyles();
    return (
        <Modal
            open={open}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div className={classes.container}>
                <form className={classes.form}>
                    <Box m={1} display="flex">
                        <Box width="90%">
                            <Typography variant="h4">Detail User</Typography>
                        </Box>
                        <Box width="10%" align="right">
                            <CloseIcon onClick={() => setDetailUser(null)} />
                        </Box>
                    </Box>
                    {user &&
                        renderRoleComponent(user.role)
                    }
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Name"
                        name="full_name"
                        inputRef={register}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Email"
                        name="email"
                        inputRef={register}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                   
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Phone"
                        name="phone"
                        inputRef={register}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    {user && user.role == 1 &&
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Description Futher"
                            name="des_futher"
                            inputRef={register}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    }
                    <Box marginY={2}>
                        <TextField
                            label="Created At"
                            type="datetime-local"
                            name="created_at"
                            inputRef={register}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                    <Box marginY={2}>
                        <TextField
                            label="Last Updated"
                            type="datetime-local"
                            name="updated_at"
                            inputRef={register}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                </form>
            </div>
        </Modal>
    )
}
