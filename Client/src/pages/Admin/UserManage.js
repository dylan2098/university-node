import { useState, useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Modal, Select, MenuItem } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import reducer from '../../reducer/reducer';
import UserAppContext from '../../context/userAppContext';
import Component from '../../components/Index';

export default function UserManage(){
    const initialAppState = {
        items: []
    }
    const [store, dispatch] = useReducer(reducer, initialAppState);

    const [open, setOpen] = useState(false);

    const handleOpenAddUser = () => {
        setOpen(true);
    };

    const handleCloseAddUser = () => {
        setOpen(false);
    };

    return (
        <div>
            <Typography variant="h4" align="center" style={{ marginBottom: 20 }}>List User</Typography>

            <Button type="button" onClick={handleOpenAddUser} variant="contained" color="primary">
                Add Teacher User
            </Button>
            
            <UserAppContext.Provider value={{ store, dispatch }}>
                <Component.ListUser />
                <Modal
                    open={open}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <Component.AddUser handleCloseAddUser={handleCloseAddUser}/>
                </Modal>
            </UserAppContext.Provider>

        </div>
    )
}