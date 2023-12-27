import React, { useContext, useState, useEffect } from 'react';
import 'react-multi-carousel/lib/styles.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StyledRating from './StyledRating'
import { axiosInstance } from '../../services/utils';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import CourseContext from '../../context/courseAppContext';
import reducer from '../../reducer/reducer';
import { Image, Transformation } from 'cloudinary-react';
export default function ItemCard(props) {

    const { item } = props;
    const initialAppState = {
        query: '',
        items: []
    }

    const [role, setRole] = useState();
    const { dispatch } = useContext(CourseContext);

    const useStyles = makeStyles({
        root: {
            maxWidth: 345,
            margin: '15px'
        },
        media: {
            height: 200,
        }
    });

    const classes = useStyles();

    const registerBuyCourse = async (id, status) => {
        const data = { id_courses: id, status };
        const response = await axiosInstance.post('/course/register-buy', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code === 200) {
            dispatch({
                type: 'update_item',
                payload: {
                    query: id,
                    items: response.data.data[0]
                }
            })
        }
    }

    const registerFavouriteCourse = async (id) => {
        const data = { id_courses: id };
        const response = await axiosInstance.post('/favourite/switch', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code === 200) {
            dispatch({
                type: 'update_item',
                payload: {
                    query: id,
                    items: response.data.data[0]
                }
            })
        }
    }

    useEffect(function () {
        setRole(localStorage.onlineCourse_role);
      }, [localStorage.onlineCourse_role]);

    return (
        <Card className={classes.root}>
            <CardActionArea component={Link} to={"/item/" + item.id}>
                <Image cloudName="dvweth7yl" publicId={item.image}>
                    <Transformation height="200" width="300" crop="scale" quality="auto" fetchFormat="auto" radius="20" />
                </Image>
                <CardContent>
                    <Box align="center" width="50%" color="white" bgcolor={item.status ? "success.main" : "secondary.main"} borderRadius={16}>
                        {item.status ? 'Hoàn thành' : 'Đang cập nhật'}
                    </Box>
                    <Box fontSize={14} m={1} fontWeight="fontWeightBold" color="#0d47a1">
                        [ {item.category_name} ]
                    </Box>
                    <Box fontWeight="fontWeightBold" fontSize={20} m={1}>
                        {item.title}
                    </Box>
                    <Box fontSize={14} m={1}>
                        Teacher: {item.full_name}
                    </Box>

                    <Box component="fieldset" mb={1} borderColor="transparent">
                        <StyledRating averageRating={item.avg_rating} mode={'readOnly'} />
                    </Box>
                    <Box>
                        Have {item.number_of_rating} of reviews
                    </Box>
                    <Box fontWeight="fontWeightBold" fontSize={20} m={1} color="red">
                        {item.promotion_price &&
                            <span>${item.promotion_price}</span>
                        }
                        &nbsp; <span style={{ textDecorationLine: 'line-through', fontSize: 15, color: 'black', fontWeight: '500' }}>${item.price}</span>
                    </Box>
                </CardContent>
            </CardActionArea>
            {
                role == 2 && 
                <>
                    <CardActions>
                        {
                            (item.status === 0 && item.is_register == false) ? (
                                <Button size="large" color="secondary" onClick={() => registerBuyCourse(item.id, 0)}>
                                    {item.is_register ? <DoneOutlineIcon /> : 'REGISTER'}
                                </Button>
                            ) : null
                        }
                        {
                            (item.status === 1 && item.is_buy == false) ? (
                                <Button size="large" color="primary" onClick={() => registerBuyCourse(item.id, 1)}>
                                    BUY
                                </Button>
                            ) : null
                        }
                        <Button size="large" color="primary" onClick={() => registerFavouriteCourse(item.id)}>
                            {item.is_favourite ? <DoneOutlineIcon /> : 'LIKE'}
                        </Button>
                    </CardActions>
                </>
            }
            
        </Card>

    )
}
