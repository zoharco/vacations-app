import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../shared/hooks/http-hook';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';
import VacationCard, { VacationI} from '../components/VacationCard';
import { AuthContext } from '../shared/context/auth-context';
import { followedClickHandler, unFollowedClickHandler } from '../shared/util/vacation'
import './Vacations.css';


const Vacations: React.FC = () => {
    const auth = useContext(AuthContext);
    const [loadedVacations, setloadedVacations] = useState<VacationI[]>([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    useEffect(() => {
        const fetchVacations = async () => {
            try{ 
                const responseData = await sendRequest('http://localhost:5000/api/vacations/');
                const followedVacation = responseData.vacations.map((vacation: VacationI) => {
                    return {
                        ...vacation,
                        isFollowed: vacation.followers.includes(auth.userId)
                    }
                });
                setloadedVacations(followedVacation);
            } catch (err: any) {
            }
        };

        fetchVacations();
    }, [sendRequest, auth.userId]);

    const onFollowClickHandler = async (vacationId: string) => {
        const vacationsUpdated = [...loadedVacations];
        const vacationIndex = vacationsUpdated.findIndex(v => v.id === vacationId);
        const vacationIsFollowed = vacationsUpdated[vacationIndex].isFollowed;
        let succeeded: boolean = false;
        if(vacationIsFollowed){
            succeeded = await unFollowedClickHandler(auth.userId, vacationId);
        } else{
            succeeded = await followedClickHandler(auth.userId, vacationId);
        }
        if(succeeded) {
            vacationsUpdated[vacationIndex].isFollowed = !vacationIsFollowed;
            setloadedVacations(vacationsUpdated);
        }
    };

    
    return (
        <React.Fragment>   
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {
                loadedVacations && loadedVacations.length > 0 &&
                <div>
                    <h1>Our Vacations</h1>
                    <div className="vacations">
                        {   
                            loadedVacations.map((vacation: VacationI) => (
                                <VacationCard onFollowClick={onFollowClickHandler} userVacations={false} key={vacation.id} vacation={vacation} />
                            ))
                        }
                    </div>
                </div>
            }
        </React.Fragment>
    );
};

export default Vacations;