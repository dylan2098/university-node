import React from 'react';
import moment from 'moment';
import { Image, Transformation } from 'cloudinary-react';
import EditorConvertFromHTML from '../EditorConvertFromHTML';
import { Box } from '@material-ui/core';


export default function DetailCard(props) {
    const { course } = props;

    return (
        <div>
            {course.image && <Image cloudName="dvweth7yl" publicId={course.image}>
                <Transformation height="200" width="300" crop="scale" quality="auto" fetchFormat="auto" radius="20" />
            </Image>}

            {course.title && <div>
                <b>Title</b>: {course.title}
            </div>}

            {
                course.des_short && <div>
                    <b>Descriptions Short:</b>
                    <Box marginLeft={2}>
                        <EditorConvertFromHTML html={course.des_short} />
                    </Box>
                </div>
            }

            {course.des_long && <div>
                <b>Descriptions Long:</b>
                <Box marginLeft={2}>
                    <EditorConvertFromHTML html={course.des_long} />
                </Box>
            </div>}

            {course.avg_rating != 0 && <div>
                <b>Rating</b> : {course.avg_rating}
            </div>}

            {course.number_of_rating != 0 && <div>
                <b>Number of Rating</b> : {course.number_of_rating}
            </div>}

            {course.total_registration != 0 && <div>
                <b>Number of Register</b> : {course.total_registration}
            </div>}

            {course.price && <div>
                <b>Price</b> : ${course.price}
            </div>}

            {course.promotion_price && <div>
                <b>Promotion Price</b> : ${course.promotion_price}
            </div>}

            {course.updated_at && <div>
                <b>Lasted Update</b> : {moment(course.updated_at).format("LLL")}
            </div>}

            {course.attachment && <div>
                <b>Attachments</b> : {course.attachment}
            </div>}


            <p></p>

        </div>
    )
}
