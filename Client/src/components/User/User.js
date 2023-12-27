import { useContext, useEffect, useState } from 'react';
import { TableCell, TableRow, Button, Switch, Box } from '@material-ui/core';
import { axiosInstance } from '../../services/utils';
import UserAppContext from '../../context/userAppContext';

export default function User({ user, openEditUser, openDetailUser }){
    const { dispatch } = useContext(UserAppContext);

    async function handleChangeStatus(){
        let data = {
            id: user.id
        };
        const res = await axiosInstance.put('/user/change-status', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        if (res.data && res.data.status_code == 200){
            dispatch({
                type: "update_item",
                payload: {
                    query: res.data.data[0].id,
                    items: res.data.data[0]
                }
            });
        }
    }

    const handleDelete = async function (){
        const res = await axiosInstance.delete('/user', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            },
            data: {
                id: user.id
            }
        });
        if (res.data){
            if(res.data.status_code == 200){
                dispatch({
                    type: "delete_item",
                    payload: {
                        query: user.id
                    }
                });
            }
            else if(res.data.status_code == 1451){
                alert('The user cannot delete. Please changes the status to OFF if you want to disable the user.');
            }
        }
    }

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

    return (
        <TableRow key={user.id}>
            <TableCell align="center">
                {user.id}
            </TableCell>
            <TableCell align="center">{user.full_name}</TableCell>
            <TableCell align="center">{user.email}</TableCell>
            <TableCell align="center">{renderRoleComponent(user.role)}</TableCell>
            <TableCell align="center">
                <Switch
                    checked={user.status == 1 ? true : false}
                    onChange={() => handleChangeStatus()}
                    name="status"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </TableCell>
            <TableCell align="center" >
                <Button onClick={() => openDetailUser(user)}>Detail</Button>
                <Button color="primary" onClick={() => openEditUser(user)}>Update</Button>
                <Button color="secondary" onClick={() => handleDelete()}>Delete</Button>
            </TableCell>
        </TableRow>
    )
}