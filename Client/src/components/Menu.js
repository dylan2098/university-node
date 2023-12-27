import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import menuAppContext from '../context/menuAppContext';
import { axiosInstance } from '../services/utils';



const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    headerMargin: {
        marginTop: 80,
        marginLeft: 20
    },
    formatLink: {
        textDecoration: 'none',
        color: 'blue'
    }
}));


export default function Menu({ initQuery }) {
    const classes = useStyles();
    const { dispatch, store } = useContext(menuAppContext);
    const [categoryId, setCategoryId] = useState(0);


    async function loadCategory(id) {
        const res = await axiosInstance.get(`/category/${id}`);
        setCategoryId(id);
        if (res.status === 200 && res.data.data.length > 0) {
            dispatch({
                type: 'init',
                payload: {
                    items: res.data,
                    query: ''
                }
            });
        }
    }


    const changed_Category = async (id) => {
        loadCategory(id)
    }


    useEffect(function () {
        loadCategory(categoryId);
    }, [categoryId])

    return (
        <div className={classes.headerMargin}>
            <Typography className={classes.root}>

                {
                    (store.items.data) ? store.items.data.map(item => (
                        <Button variant="contained" color="secondary" component={Link} to={'/category/' + item.id} key={item.id} onClick={() => changed_Category(item.id)}>
                            {item.name}
                        </Button>
                    )) :
                        (
                            <Typography component={'span'} variant={'body2'}>Loading...</Typography>
                        )
                }

            </Typography>
        </div>
    )
}
