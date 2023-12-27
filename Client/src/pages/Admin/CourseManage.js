import { useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import reducer from '../../reducer/reducer';
import Component from '../../components/Index';
import CourseAppContext from '../../context/courseAppContext';


const initialAppState = {
    query: '',
    items: []
}

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    colorBackground: {
        backgroundColor: '#ffffff'
    }
}))



export default function CourseManage() {

    const [store, dispatch] = useReducer(reducer, initialAppState);
    const classes = useStyles();

    return (
        <CourseAppContext.Provider value={{ store, dispatch }}>
            <Typography variant="h4" align="center" style={{ marginBottom: 20 }}>List Course</Typography>


            <Component.ListCourse />
        </CourseAppContext.Provider>
    )
}
