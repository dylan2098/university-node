import React, { useContext } from 'react'
import { axiosInstance } from '../../services/utils';
import { useParams } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import moment from 'moment';
import DetailCourseContext from '../../context/detailCourseContext';


export default function Rating() {
    const { store, dispatch } = useContext(DetailCourseContext);

    console.log("Store", store);
    const { id } = useParams();

    const onChanged_loadMore = async () => {
        let page = store.query.page + 1;
        const limit = 5

        if (id !== 0) {
            const res = await axiosInstance.get('/feedback/course/' + id + '?limit=' + limit + '&page=' + page);
            if (res.data.data.length > 0) {
                dispatch({
                    type: 'init',
                    payload: {
                        items: [...store.items, ...res.data.data],
                        query: res.data.attached_data
                    }
                });
            }
        }

    }

    return (
        <div>
            {
                store.items && store.items.length > 0 ?
                    <div>
                        {
                            store.items.map(rating =>
                                <div style={{ margin: 10, marginTop: 40 }} key={rating.id}>
                                    <div>
                                        <b>Name</b>: {rating.full_name}
                                    </div>
                                    <div>
                                        <b>Point Star</b>: {rating.point_star}
                                    </div>

                                    <div>
                                        <b>Title</b>: {rating.title}
                                    </div>

                                    <div>
                                        <b>Content</b>: {rating.content}
                                    </div>

                                    <div>
                                        <b>Created At</b>: {moment(rating.created_at).format('LLL')}
                                    </div>
                                </div>
                            )
                        }
                        {
                            store.query.loadMore ? <Button color="primary" onClick={onChanged_loadMore}>Load More</Button> : null
                        }
                    </div>
                    :
                    <Typography component={'span'} variant={'body2'}>Empty Data</Typography>
            }
        </div >
    )
}
