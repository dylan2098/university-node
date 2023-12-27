import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { axiosInstance, uploadImage } from '../../services/utils';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import EditorConvertToHTML from '../EditorConvertToHTML';
import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        height: "100vh",
        overflow: 'auto',
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



export default function UpdateCourse(props) {
    const classes = useStyles();
    const { id } = useParams();
    const { register, handleSubmit, control } = useForm();
    const [categories, setCategories] = useState([]);
    const [shortDescription, setShortDescription] = useState();
    const [detailDescription, setDetailDescription] = useState();
    const { course } = props;
    const [image, setImage] = useState();
    const [dataImage, setDataImage] = useState();
    const [imageUploaded, setImageUploaded] = useState();
    const [isLoading, setLoading] = useState(false);
    const history = useHistory();


    const listAllCategory = async () => {
        const response = await axiosInstance.get('/category/list', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        setCategories(response.data.data);
    }

    const listStatus = [{
        id: 0,
        name: 'Chưa hoàn thành'
    },
    {
        id: 1,
        name: 'Đã hoàn thành'
    }];




    const getImageUploaded = async () => {
        let _imageUploaded = imageUploaded;
        if (!_imageUploaded) {
            if (!dataImage) {
                return null;
            }
            _imageUploaded = await uploadImage(dataImage);
            setImageUploaded(_imageUploaded);
        }
        return _imageUploaded;
    }



    useEffect(() => {
        listAllCategory();
    }, [])


    const handleUploadImage_Clicked = event => {
        var file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function (e) {
            setImage(reader.result);
        };

        setDataImage(event.target.files[0]);
    };



    const onSubmit = async (data) => {
        const dataRequest = { id, des_long: detailDescription, des_short: shortDescription };

        const _imageUploaded = await getImageUploaded();
        if (_imageUploaded && _imageUploaded.public_id) {
            dataRequest.image = _imageUploaded.public_id;
        }

        if (data.id_category) {
            dataRequest.id_category = data.id_category;
        }

        if (data.price != "") {
            dataRequest.price = data.price;
        }

        if (data.promotion_price != "") {
            dataRequest.promotion_price = data.promotion_price;
        }

        dataRequest.status = data.status;

        if (data.title != "") {
            dataRequest.title = data.title;
        }

        if (data.total_time != "") {
            dataRequest.total_time = data.total_time;
        }


        setLoading(true);

        const response = await axiosInstance.put('/course', dataRequest, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (response.data.status_code === 200) {
            setLoading(false);
            history.push('/my-upload-courses');
        }
    }


    return (
        <div>
            <form id="formUpdate" className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Button
                    variant="contained"
                    component="label"
                >
                    Upload Image
                    <input
                        accept="image/*"
                        hidden
                        type="file"
                        onChange={handleUploadImage_Clicked}
                    />
                </Button>
                {image &&
                    <img
                        width="100%"
                        maxHeight="400px"
                        src={image}
                    />
                }

                {
                    (!image && course.image) && <Image cloudName="dvweth7yl" publicId={course.image}>
                        <Transformation height="200" width="300" crop="scale" quality="auto" fetchFormat="auto" radius="20" />
                    </Image>
                }


                {
                    (categories.length > 0) && (
                        <div>
                            <FormControl className={classes.formControl}>

                                <Controller
                                    control={control}
                                    name="id_category"
                                    as={
                                        <Select id="select" defaultValue={course.id_category}>
                                            {
                                                categories.map(item =>
                                                    <MenuItem key={item.id} defaultValue={item.id} value={item.id} selected={item.id == course.id_category ? true : false}>
                                                        {item.name}
                                                    </MenuItem>)
                                            }
                                        </Select>
                                    }
                                />
                            </FormControl>
                        </div>
                    )
                }

                {
                    <FormControl className={classes.formControl}>

                        <Controller
                            control={control}
                            name="status"
                            as={
                                <Select id="selectStatus" defaultValue={course.status}>
                                    {
                                        listStatus.map(item =>
                                            <MenuItem key={item.id + 1} defaultValue={item.id} value={item.id} selected={item.id == course.status ? true : false}>
                                                {item.name}
                                            </MenuItem>)
                                    }
                                </Select>
                            }
                        />
                    </FormControl>
                }

                <div>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label={'Title: ' + course.title}
                        name="title"
                        autoFocus
                        inputRef={register()}
                    />
                </div>


                <div>
                    <TextField
                        type="number"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label={'Price: ' + course.price}
                        name="price"
                        autoFocus
                        inputRef={register()}
                    />
                </div>


                <div>
                    <TextField
                        type="number"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label={'Promotion Price: ' + course.promotion_price}
                        name="promotion_price"
                        autoFocus
                        inputRef={register()}
                    />
                </div>

                <div>
                    <TextField
                        type="number"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label={'Total Time: ' + course.total_time}
                        name="total_time"
                        autoFocus
                        inputRef={register()}
                    />
                </div>


                <Box marginTop="16px" marginBottom="8px">
                    <Typography variant="h5">Short Description</Typography>
                    <EditorConvertToHTML handleChangeValue={setShortDescription} html={course.des_short} />
                </Box>
                <Box marginTop="16px" marginBottom="8px">
                    <Typography variant="h5">Detail Description</Typography>
                    <EditorConvertToHTML handleChangeValue={setDetailDescription} html={course.des_long} />
                </Box>



                <div>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload Attachments
                    <input
                            hidden
                            type="file"
                        />
                    </Button>
                </div>

                &nbsp;
                <div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading ...' : 'Submit'}
                    </Button>
                </div>


            </form>
        </div >
    )
}
