import React, { useState, useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Modal, Button } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import reducer from '../../reducer/reducer';
import CategoryAppContext from '../../context/categoryAppContext';
import Component from '../../components/Index';


const initialAppState = {
    query: '',
    items: []
}


export default function CategoryManage() {

    const [store, dispatch] = useReducer(reducer, initialAppState);

    async function loadListCategory() {
        const res = await axiosInstance.get('/category/list', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        dispatch({
            type: 'init',
            payload: {
                items: res.data.data,
                query: ''
            }
        });
    }

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        loadListCategory();
    }, [])


    return (
        <div>
            <CategoryAppContext.Provider value={{ store, dispatch }}>

                <Typography variant="h4" align="center" style={{ marginBottom: 20 }}>List Category</Typography>

                <Button type="button" onClick={handleOpen} variant="contained" color="primary">
                    Add Category
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <Component.AddCategory />
                </Modal>

                <p></p> &nbsp;

                <Component.ListCategory />
            </CategoryAppContext.Provider>
        </div>
    )
}
