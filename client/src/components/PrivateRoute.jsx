import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector(state => state.user);
    
    if (!currentUser) return <Navigate to="/sign-in" />; // If no user, redirect to login
    if (currentUser.isAdmin) return <Navigate to="/admin" />; // If admin, redirect to admin home

    return <Outlet />; // Otherwise, allow access to user routes
}
