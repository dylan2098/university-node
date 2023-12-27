import { useEffect, useState, useContext } from 'react';
import UserAppContext from '../../context/userAppContext';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Switch } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import User from './User';
import Component from '../Index';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function ListUser(){
    const classes = useStyles();
    const { store, dispatch } = useContext(UserAppContext);

    const [userEdit, setUserEdit] = useState();
    const [detailUser, setDetailUser] = useState();

    async function loadListUser(){
        const response = await axiosInstance.get('/user', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data && response.data.status_code === 200){
            dispatch({
                type: 'init',
                payload: {
                    items: response.data.data
                }
            });
        }
    }

    useEffect(() => {
        loadListUser();
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#ID</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Role</TableCell>
                            <TableCell align="center">Status (OFF/ON)</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {store.items.map((item) => <User key={item.id} user={item} openEditUser={setUserEdit} openDetailUser={setDetailUser}/>)}
                    </TableBody>
                </Table>
            </TableContainer>
            <Component.UpdateUser user={userEdit} setUserEdit={setUserEdit}/>
            <Component.UserDetail user={detailUser} setDetailUser={setDetailUser}/>
        </div>
    )
}