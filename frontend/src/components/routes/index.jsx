import AuthPage from "../pages/AuthenticationPage/AuthenticationPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import PetListPage from "../pages/PetPages/PetListPage/PetListPage";
import PetDetailPage from "../pages/PetPages/PetDetailPage/PetDetailPage";
import CartPage from "../pages/CartPage/CartPage";
import ContactPage from "../pages/ContactPage/ContactPage";
import EditProfilePage from "../pages/UserProfilePage/EditProfilePage";
import UserProfile from "../pages/UserProfilePage/UserProfilePage";
import PaymentSuccess from "../pages/Payments/PaymentSuccess";
import PaymentCancel from "../pages/Payments/PaymentCancel";
import OrderHistoryPage from "../pages/OrderHistoryPage/OrderHistoryPage";
import ForgotPasswordPage from "../pages/AuthenticationPage/ForgotPasswordPage";
import ResetPasswordPage from "../pages/AuthenticationPage/ResetPasswordPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/forgot-password',
        page: ForgotPasswordPage,
    },
    {
        path: '/reset-password/:token',
        page: ResetPasswordPage,
    },
    {
        path: '/auth',
        page: AuthPage,
    },
    {
        path: '/order-history',
        page: OrderHistoryPage,
        isShowHeader: true,
    },
    {
        path: '/payment-success',
        page: PaymentSuccess,
        isShowHeader: true,
    },
    {
        path: '/payment-canceled',
        page: PaymentCancel,
        isShowHeader: true,
    },
    {
        path: '/profile',
        page: UserProfile,
        isShowHeader: true,
    },
    {
        path: '/profile/edit',
        page: EditProfilePage,
        isShowHeader: true,
    },
    {
        path: '/contact',
        page: ContactPage,
        isShowHeader: true,
    },
    {
        path: '/pets/:type', // ✅ Route động để hiển thị danh sách thú cưng theo loại
        page: PetListPage,
        isShowHeader: true,
    },
    {
        path: '/pet/:id',
        page: PetDetailPage,
        isShowHeader: true,
    },
    {
        path: '/cart',
        page: CartPage,
        isShowHeader: true,
    },
    {
        path: '*',
        page: NotFoundPage,
    },
]