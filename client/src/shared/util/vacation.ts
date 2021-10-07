export const followedClickHandler = async ( userId: string, vacationId: string, token: string) => {
    try{
        const response = await fetch(`http://localhost:5000/api/users/${userId}/follow`, {
            method:"POST",
            body: JSON.stringify({
                userId: userId,
                vacationId: vacationId
            }),
            headers:  {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        });
  
        const responseData = await response.json();
        if(!response.ok){
            return false
        }
    } catch(err: any) {
    }
    return true;
};

export const unFollowedClickHandler = async (userId: string, vacationId: string, token: string) => {
    try{
        const response = await fetch(`http://localhost:5000/api/users/${userId}/unfollow`, {
            method:"DELETE",
            body: JSON.stringify({
                userId: userId,
                vacationId: vacationId
            }),
            headers:  {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        });

        const responseData = await response.json();
        if(!response.ok){
            return false
        }
    } catch(err: any) {
    }
    return true;
};







