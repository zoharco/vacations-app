import React, { useContext } from 'react';
import Button from './FormElements/Button';
import './VacationCard.css';
import { AuthContext } from '../shared/context/auth-context';
import { ROLE } from '../shared/util/role';

export interface VacationI {
    id: string,
    title: string,
    description: string,
    price: number,
    imageUrl: string,
    countInStock: number,
    followers: string[],
    isFollowed: boolean
}

interface VacationCardProps{
    vacation: VacationI;
    userVacations: boolean;
    onFollowClick: (vacationId: string) => void;
}

const VacationCard: React.FC<VacationCardProps> = ({ vacation, userVacations, onFollowClick }) => {
    const auth = useContext(AuthContext);

    const getButtonText = () => {
        if(userVacations || vacation.isFollowed) {
            return "Unfollow";
        } 
        return "Follow";
    };

    return (
        <div className="vacation" >
            <h2 className="vacation__title">{vacation.title}</h2>
            <p className="vacation__price">Price: {vacation.price}</p>
            <img  className="vacation__image" src={vacation.imageUrl} alt={vacation.title} />
            <div className="showDetailsWrapper">
                <Button to={`/vacations/${vacation.id}`}>More Details</Button>
                {   
                    auth.userRole === ROLE.admin &&
                    <Button to={`/vacations/${vacation.id}/edit`}>Edit</Button>
                }
                
                { 
                    auth.userRole === ROLE.basic &&
                    <a className="followButton" onClick={() => onFollowClick(vacation.id)}>{getButtonText()}</a> 
                }
                
            </div>
        </div>
    );
};

export default VacationCard;