import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../shared/hooks/http-hook';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';
import VacationCard, { VacationI} from '../components/VacationCard';
import './MyVacations.css';
import { AuthContext } from '../shared/context/auth-context';
import { unFollowedClickHandler } from '../shared/util/vacation';

const MyVacations: React.FC = () => {
    const auth = useContext(AuthContext);
    const [loadedVacations, setloadedVacations] = useState<VacationI[]>([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    useEffect(() => {
        const fetchUsers = async () => {
            try{ 

                /*
                succeeded = await sendRequest(
                `http://localhost:5000/api/vacations/${vacationId}`, 
                'DELETE', 
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
                );
                 */
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/${auth.userId}/my-vacations`, 
                    'GET',
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                );
                const followedVacation = responseData.vacations.map((vacation: VacationI) => {
                    return {
                        ...vacation,
                        isFollowed: true
                    }
                });
                setloadedVacations(followedVacation);
            } catch (err: any) {
            }
        };
        fetchUsers();
    }, [sendRequest]);

    const onFollowClickHandler = async (vacationId: string) => {
        let vacationsUpdated = [...loadedVacations];
        const vacationIndex = vacationsUpdated.findIndex(v => v.id === vacationId);
        let succeeded: boolean = false;
        try{
            succeeded = await unFollowedClickHandler(auth.userId, vacationId, auth.token);
        } catch (err) {}
        if(succeeded){
            vacationsUpdated[vacationIndex].isFollowed = !vacationsUpdated[vacationIndex].isFollowed;
            vacationsUpdated = vacationsUpdated.filter(v => v.isFollowed !== false);
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
                    <h1>Yours Vacations</h1>
                    <div className="vacations">
                        {   loadedVacations &&
                            loadedVacations.map((vacation: any, index: number) => (
                                <VacationCard key={vacation.id} onFollowClick={onFollowClickHandler} userVacations={true} vacation={vacation} />
                            ))
                        }
                    </div>
                </div>
            }
        </React.Fragment>
    );
};

export default MyVacations;