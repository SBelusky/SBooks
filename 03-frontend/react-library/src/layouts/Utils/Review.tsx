import ReviewModel from '../../models/ReviewModel';
import { StarsReview } from './StartReview';

export const Review: React.FC<{ review: ReviewModel }> = (props) => {
    const date = new Date(props.review.date);
    const longMonth = date.toLocaleString('sk-SK', { month: 'long' });
    const longMonthCapitalized = longMonth.charAt(0).toUpperCase() + longMonth.slice(1);
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    const dateToRender = `${dateDay}. ${longMonthCapitalized} ${dateYear} `;

    return (
        <div>
            <div className="col-sm-8 col-md-8">
                <h5>{props.review.userEmail}</h5>
                <div className="row">
                    <div className="col">{dateToRender}</div>
                    <div className="col">
                        <StarsReview rating={props.review.rating} size={32} />
                    </div>
                </div>
                <div className="mt-2">
                    <p>{props.review.reviewDescription}</p>
                </div>
            </div>
            <hr />
        </div>
    );
};
