import { useEffect, useState, useReducer, useContext } from 'react'
import { Button, TextField, Typography, Box, Select, MenuItem, InputLabel } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance, uploadImage } from '../../services/utils';
import { Image, Transformation } from 'cloudinary-react';
import CloseIcon from '@material-ui/icons/Close';
import CourseContext from '../../context/courseAppContext';
import EditorConvertToHTML from '../EditorConvertToHTML';

const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
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

export default function AddCourse({ handleCloseAddCourse }) {
    const { dispatch } = useContext(CourseContext);
    const { register, handleSubmit, errors, setError, clearErrors, reset, control } = useForm({
        defaultValues: {
            price: 0,
        },
    });
    const [shortDescription, setShortDescription] = useState();
    const [detailDescription, setDetailDescription] = useState();
    const [image, setImage] = useState();
    const [dataImage, setDataImage] = useState();
    const [imageUploaded, setImageUploaded] = useState();
    const [listCategory, setListCategory] = useState([]);

    const loadListCategory = async () => {
        const response = await axiosInstance.get('/category/list', {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });
        setListCategory(response.data.data);
    }

    useEffect(() => {
        loadListCategory();
    }, []);

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

    const onSubmit = async function (data) {
        if (!data['id_category']) {
            setError("errorCustom.id_category", {
                type: "manual",
                message: "Category is required"
            });
            return;
        }
        if (!shortDescription) {
            setError("errorCustom.shortDescription", {
                type: "manual",
                message: "Short Description is required"
            });
            return;
        }
        if (!detailDescription) {
            setError("errorCustom.detailDescription", {
                type: "manual",
                message: "Detail Description is required"
            });
            return;
        }
        const _imageUploaded = await getImageUploaded();
        if (!_imageUploaded) {
            setError("errorCustom.image", {
                type: "manual",
                message: "Image is required"
            });
            return;
        }
        data["image"] = _imageUploaded.public_id;
        data["price"] = parseInt(data["price"]);
        if (data["promotion_price"]) {
            data["promotion_price"] = parseInt(data["promotion_price"]);
        }
        else {
            delete data["promotion_price"];
        }
        data["des_short"] = shortDescription;
        data["des_long"] = detailDescription;
        data["attachment"] = "demo";
        const res = await axiosInstance.post('/course', data, {
            headers: {
                Authorization: localStorage.onlineCourse_accessToken
            }
        });

        if (res.data && res.data.status_code == 200) {
            dispatch({
                type: 'add_item',
                payload: res.data.data[0]
            });
            reset({});
            handleCloseAddCourse(false);
            return;
        }
    };

    const handleUploadImage_Clicked = event => {
        var file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function (e) {
            setImage(reader.result);
        };

        setDataImage(event.target.files[0]);
    };

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <Box m={1} display="flex">
                    <Box width="90%">
                        <Typography variant="h4">Create Course</Typography>
                    </Box>
                    <Box width="10%" align="right">
                        <CloseIcon onClick={() => handleCloseAddCourse(false)} />
                    </Box>
                </Box>
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
                {errors.errorCustom && errors.errorCustom.image && <Box marginTop={2} color="red" fontWeight="Bold">{errors.errorCustom.image.message}</Box>}
                {image &&
                    <img
                        width="100%"
                        maxHeight="400px"
                        src={image}
                    />
                }
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Name"
                    name="title"
                    autoFocus
                    inputRef={register({ required: true })}
                />
                {errors.titel && <Box color="red" fontWeight="Bold">Name is required</Box>}
                <InputLabel htmlFor="id_category">
                    Category
                </InputLabel>
                <Controller
                    control={control}
                    name="id_category"
                    inputRef={register({ required: true })}
                    as={
                        <Select
                            name="id_category"
                            fullWidth
                        >
                            {
                                listCategory.length > 0 && listCategory.map(item =>
                                    item && <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                )
                            }
                        </Select>
                    }
                />
                {errors.errorCustom && errors.errorCustom.id_category && <Box color="red" fontWeight="Bold">{errors.errorCustom.id_category.message}</Box>}
                <TextField
                    type="number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Price"
                    name="price"
                    inputRef={register({ required: true })}
                />
                {errors.price && <Box color="red" fontWeight="Bold">Price is required</Box>}
                <TextField
                    type="number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Promotion Price"
                    name="promotion_price"
                    inputRef={register}
                />
                <Box marginTop="16px" marginBottom="8px">
                    <Typography variant="h5">Short Description</Typography>
                    <EditorConvertToHTML handleChangeValue={setShortDescription} />
                </Box>
                {errors.errorCustom && errors.errorCustom.shortDescription && <Box color="red" fontWeight="Bold">{errors.errorCustom.shortDescription.message}</Box>}
                <Box marginTop="16px" marginBottom="8px">
                    <Typography variant="h5">Detail Description</Typography>
                    <EditorConvertToHTML handleChangeValue={setDetailDescription} />
                </Box>
                {errors.errorCustom && errors.errorCustom.detailDescription && <Box color="red" fontWeight="Bold">{errors.errorCustom.detailDescription.message}</Box>}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => clearErrors('errorCustom')}
                >
                    Submit
                </Button>

            </form>
        </div>
    )
}