import React, { useEffect, useState } from 'react';
import './UsersList.css';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';
import { useHttpClient } from '../shared/hooks/http-hook';

interface User {
    username: string,
    email: string
}
const UsersList = () => {
    const [loadedUsers, setLoadedUsers] = useState<Array<User>>();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    useEffect(() => {
        const fetchUsers = async () => {
            try{ 
                const responseData = await sendRequest('http://localhost:5000/api/users/');
                
                setLoadedUsers(responseData.users);
            } catch (err: any) {
            }
        };
        fetchUsers();
    }, [sendRequest]);

        
    return (
        <React.Fragment>   
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {
                (!loadedUsers || loadedUsers.length=== 0) &&
                <div className="center">
                    <h2>No user found.</h2>
                </div>
            }
            {
                loadedUsers && loadedUsers.length > 0 &&
                <ul className="users-list">
                    {   loadedUsers &&
                        loadedUsers.map((user: any, index: number) => (<li key={index} className="user-item">{user.username}</li>))
                    }
                </ul>
            }
        </React.Fragment>
    );
    
};

export default UsersList;
