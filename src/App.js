// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RouteGuard } from './components/auth/RouteGuard';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import StaffRegistrationPage from './components/auth/StaffRegistrationPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import LibrarianDashboard from './components/dashboards/LibrarianDashboard';
import MemberDashboard from './components/dashboards/MemberDashboard';
import BooksPage from './components/pages/BooksPage';
import NotFoundPage from './components/NotFoundPage';
import RootRedirect from './components/RootRedirect';
import LoansPage from "./components/pages/LoansPage";
import MemberLoans from "./components/loans/MemberLoans";
import {Paper} from "@mui/material";
import DashboardLayout from "./components/layouts/DashboardLayout";
import UsersPage from "./components/pages/UsersPage";
import ReservationManagement from "./components/reservations/ReservationManagement";
import MemberReservations from "./components/reservations/MemberReservations";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Root Route Redirect */}
                    <Route
                        path="/"
                        element={
                            <RouteGuard>
                                <RootRedirect />
                            </RouteGuard>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <RouteGuard allowedRoles={['ADMIN']}>
                                <AdminDashboard />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/admin/books"
                        element={
                            <RouteGuard allowedRoles={['ADMIN']}>
                                <BooksPage />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <RouteGuard allowedRoles={['ADMIN']}>
                                <UsersPage />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/admin/staff-register"
                        element={
                            <RouteGuard allowedRoles={['ADMIN']}>
                                <StaffRegistrationPage />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/admin/loans"
                        element={
                            <RouteGuard allowedRoles={['ADMIN']}>
                                <LoansPage />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/admin/reservations"
                        element={
                            <RouteGuard allowedRoles={['ADMIN']}>
                                <DashboardLayout title="Reservation Management">
                                    <Paper className="p-4">
                                        <ReservationManagement />
                                    </Paper>
                                </DashboardLayout>
                            </RouteGuard>
                        }
                    />

                    {/* Librarian Routes */}
                    <Route
                        path="/librarian"
                        element={
                            <RouteGuard allowedRoles={['LIBRARIAN']}>
                                <LibrarianDashboard />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/librarian/books"
                        element={
                            <RouteGuard allowedRoles={['LIBRARIAN']}>
                                <BooksPage />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/librarian/member-register"
                        element={
                            <RouteGuard allowedRoles={['LIBRARIAN']}>
                                <StaffRegistrationPage />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/librarian/loans"
                        element={
                            <RouteGuard allowedRoles={['LIBRARIAN']}>
                                <LoansPage />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/librarian/reservations"
                        element={
                            <RouteGuard allowedRoles={['LIBRARIAN']}>
                                <DashboardLayout title="Reservation Management">
                                    <Paper className="p-4">
                                        <ReservationManagement />
                                    </Paper>
                                </DashboardLayout>
                            </RouteGuard>
                        }
                    />

                    {/* Member Routes */}
                    <Route
                        path="/member"
                        element={
                            <RouteGuard allowedRoles={['MEMBER']}>
                                <MemberDashboard />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/member/books"
                        element={
                            <RouteGuard allowedRoles={['MEMBER']}>
                                <BooksPage />
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/member/loans"
                        element={
                            <RouteGuard allowedRoles={['MEMBER']}>
                                <DashboardLayout title="My Loans">
                                    <Paper className="p-4">
                                        <MemberLoans />
                                    </Paper>
                                </DashboardLayout>
                            </RouteGuard>
                        }
                    />
                    <Route
                        path="/member/reservations"
                        element={
                            <RouteGuard allowedRoles={['MEMBER']}>
                                <DashboardLayout title="My Reservations">
                                    <Paper className="p-4">
                                        <MemberReservations />
                                    </Paper>
                                </DashboardLayout>
                            </RouteGuard>
                        }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;