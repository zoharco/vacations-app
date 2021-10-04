import React, { useEffect, useState, useContext } from 'react';
import Button from '../components/FormElements/Button';
import Modal from '../components/Modal';
import { useHttpClient } from '../shared/hooks/http-hook';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';
import { useParams, useHistory } from 'react-router-dom';
import './Vacation.css';
import { VacationI } from '../components/VacationCard';
import { AuthContext } from '../shared/context/auth-context';

const Vacation: React.FC = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    type ParamsType = {
        vacationId: string;
    };
    const vacationId = useParams<ParamsType>().vacationId;
    const [loadedVacation, setloadedVacation] = useState<VacationI>();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
    };

    const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    };

    useEffect(() => {
        const fetchVacations = async () => {
            try{ 
                const responseData = await sendRequest(`http://localhost:5000/api/vacations/`);
                const vacation = responseData.vacations.find((v: VacationI) => v.id === vacationId);
                setloadedVacation(vacation);
            } catch (err: any) {
            }
        };
        fetchVacations();
    }, [sendRequest, vacationId]);

    const onFollowClickHandler = async () => {
        // const vacationsUpdated = [...loadedVacations];
        // const vacationIndex = vacationsUpdated.findIndex(v => v.id === vacationId);
        // const vacationIsFollowed = vacationsUpdated[vacationIndex].isFollowed;
        // let succeeded: boolean = false;
        // if(vacationIsFollowed){
        //     succeeded = await unFollowedClickHandler(auth.userId, vacationId);
        // } else{
        //     succeeded = await followedClickHandler(auth.userId, vacationId);
        // }
        // if(succeeded) {
        //     vacationsUpdated[vacationIndex].isFollowed = !vacationIsFollowed;
        //     setloadedVacations(vacationsUpdated);
        // }
    };
        
    const onDeleteClickHandler = async () => {
        setShowConfirmModal(false);
        let vacationUpdated = {...loadedVacation};
        
        let succeeded: boolean = true;
        try{
            succeeded = await sendRequest(
                `http://localhost:5000/api/vacations/${vacationId}`, 
                'DELETE', 
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
                );
            history.push('/vacations');
        } catch(err) {}

        if(succeeded){
            history.push('/vacations');
        }
    };
    const getButtonText = () => {
        if(loadedVacation?.isFollowed) {
            return "Unfollow";
        } 
        return "Follow";
    };
    return (
        <React.Fragment>   
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            { !loadedVacation && 
                <div className="center">
                    <h2>No vacation found.</h2>
                </div>
            }
            { loadedVacation && 
                <div className="vacationPage">
                    <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={onDeleteClickHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={2}><h1>{ loadedVacation.title }</h1></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>price</td>
                                <td>{loadedVacation.price}</td>
                            </tr>
                            <tr>
                                <td>Count in stack</td>
                                <td>{loadedVacation.countInStock}</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>{loadedVacation.imageUrl}</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>{loadedVacation.description}</td>
                            </tr>
                            {loadedVacation.followers && loadedVacation.followers.length > 0 &&
                            <tr>
                                <td>Followers</td>
                                <td>
                                    {loadedVacation.followers}
                                </td>
                            </tr>
                            }
                            {
                            loadedVacation.followers && loadedVacation.followers.length === 0  &&
                            <tr>
                                <td>Followers</td>
                                <td>
                                        "No Followers"
                                </td>
                            </tr> 
                            }
                            <tr className="vacationPage__buttonsWrapper">
                                <td className="vacationPage__buttons" colSpan={2}>
                                    { <a className="deleteButton" onClick={showDeleteWarningHandler}>Delete</a> }
                                    <Button to={`/vacations/${vacationId}/edit`}>Edit</Button>
                                    { <a className="followButton" onClick={onFollowClickHandler}>{getButtonText()}</a> }    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        
                    </div>
                </div>
            }
        </React.Fragment>
    );
};

export default Vacation;
