import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActionArea, CardContent, CardMedia, Box, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Info, Visibility } from '@material-ui/icons';
import { Image, Transformation } from 'cloudinary-react';
import EditorConvertFromHTML from './EditorConvertFromHTML';
import StyledRating from './Course/StyledRating';

export default function MyItemCardUpload(props) {

    const { course } = props;

    const useStyles = makeStyles({
        root: {
            maxWidth: 345,
            margin: '15px'
        },
        media: {
            height: 200,
        }
    });

    return (
        <Card>
            <CardActionArea component={Link} to={"/item/" + course.id}>
                <Image cloudName="dvweth7yl" publicId={course.image}>
                    <Transformation height="200" width="300" crop="scale" quality="auto" fetchFormat="auto" radius="20"/>
                </Image>
                <CardContent>
                    <Box align="center" width="50%" color="white" bgcolor={course.status ? "success.main" : "secondary.main"} borderRadius={16}>
                        {course.status ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                    </Box>
                    <Box fontSize={14} m={1} fontWeight="fontWeightBold" color="#0d47a1">
                        [ {course.category_name} ]
                    </Box>
                    <Box fontWeight="fontWeightBold" fontSize={20} m={1}>
                        {course.title}
                    </Box>

                    <Box component="fieldset" mb={1} borderColor="transparent">
                        <StyledRating averageRating={course.avg_rating} mode={'readOnly'} />
                    </Box>
                    <Box display="flex">
                        <Box width="50%" textAlign="left">
                            Total rating: {course.number_of_rating}
                        </Box>
                        <Box width="50%" alignItems="center" justifyContent="flex-end" display="flex">
                            <Visibility color="primary" /><Box>{course.number_of_view} views</Box>
                        </Box>
                    </Box>
                    {course.promotion_price > 0 ?
                        <Box fontWeight="fontWeightBold" fontSize={20} m={1} color="red"> ${course.promotion_price}
                            &nbsp; <span style={{ textDecorationLine: 'line-through', fontSize: 15, color: 'black', fontWeight: '500' }}>${course.price}</span>
                        </Box>
                        :
                        <Box fontWeight="fontWeightBold" fontSize={20} m={1} color="black"> ${course.price}
                        </Box>
                    }
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
