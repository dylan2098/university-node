import React, { useEffect, useState, useContext } from 'react';
import CategoryAppContext from '../../context/categoryAppContext';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Switch } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import { Link } from 'react-router-dom';


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});



export default function ListCategory() {
    const classes = useStyles();
    const { store, dispatch } = useContext(CategoryAppContext);

    const handleChange = async (id, status) => {
        const data = { id, status: status == 1 ? 0 : 1 };
        const response = await axiosInstance.put('/category', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code === 200) {
            dispatch({
                type: 'update_item',
                payload: {
                    query: id,
                    items: response.data.data
                }
            })
        }

    }

    const deleteCategory = async (id) => {
        const data = { id: parseInt(id) };
        const response = await axiosInstance.delete('/category', {
            data,
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code === 200) {
            if (response.data.attached_data.action === 'UPDATE') {
                dispatch({
                    type: 'update_item',
                    payload: {
                        query: id,
                        items: response.data.data
                    }
                })
            }
            else {
                dispatch({
                    type: 'delete_item',
                    payload: {
                        query: id,
                        items: store.items
                    }
                })
            }
        }
    }

    return (

        <div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#ID</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Category Parent</TableCell>
                            <TableCell align="center">OFF/ON (Status)</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {store.items.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.id_parent !== 0 ? row.parent.name : null}</TableCell>
                                <TableCell align="center">
                                    <Switch
                                        checked={row.status == 1 ? true : false}
                                        onChange={() => handleChange(row.id, row.status)}
                                        name="status"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                </TableCell>
                                <TableCell align="center" >
                                    <Button color="primary" component={Link} to={'/admin/category/' + row.id}>Update</Button>
                                    <Button color="secondary" onClick={() => deleteCategory(row.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
