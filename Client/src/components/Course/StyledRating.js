import { withStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { Star } from '@material-ui/icons';

export default function StyledRating(props) {

    const { averageRating, mode } = props;

    const StyledRating = withStyles({
        iconFilled: {
            color: '#ff9800',
        },
        iconHover: {
            color: '#f57c00',
        },
    })(Rating);

    return (
        <StyledRating
            name="customized-color"
            defaultValue={averageRating}
            getLabelText={(value) => `${value} Star${value > 1 ? 's' : ''}`}
            precision={0.5}
            icon={<Star fontSize="inherit" />}
            readOnly={mode === "readOnly" ? true : false}
        />
    )
}