import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Lazy load components
const Home = () => import('@/views/Home.vue');
const Login = () => import('@/views/auth/Login.vue');
const Register = () => import('@/views/auth/Register.vue');
const BookCatalog = () => import('@/views/books/BookCatalog.vue');
const BookDetails = () => import('@/views/books/BookDetails.vue');
const UserDashboard = () => import('@/views/user/Dashboard.vue');
const UserProfile = () => import('@/views/user/Profile.vue');
const UserBorrowingHistory = () => import('@/views/user/BorrowingHistory.vue');
const AdminDashboard = () => import('@/views/admin/Dashboard.vue');
const AdminBooks = () => import('@/views/admin/Books.vue');
const AdminUsers = () => import('@/views/admin/Users.vue');
const AdminBorrowingRequests = () => import('@/views/admin/BorrowingRequests.vue');
const NotFound = () => import('@/views/NotFound.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Trang chủ' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: 'Đăng nhập',
      requiresGuest: true 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { 
      title: 'Đăng ký',
      requiresGuest: true 
    }
  },
  {
    path: '/books',
    name: 'BookCatalog',
    component: BookCatalog,
    meta: { title: 'Danh mục sách' }
  },
  {
    path: '/books/:id',
    name: 'BookDetails',
    component: BookDetails,
    meta: { title: 'Chi tiết sách' },
    props: true
  },
  {
    path: '/dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { 
      title: 'Dashboard',
      requiresAuth: true 
    }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { 
      title: 'Hồ sơ cá nhân',
      requiresAuth: true 
    }
  },
  {
    path: '/borrowing-history',
    name: 'UserBorrowingHistory',
    component: UserBorrowingHistory,
    meta: { 
      title: 'Lịch sử mượn sách',
      requiresAuth: true 
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { 
      title: 'Admin Dashboard',
      requiresAuth: true,
      requiresAdmin: true 
    }
  },
  {
    path: '/admin/books',
    name: 'AdminBooks',
    component: AdminBooks,
    meta: { 
      title: 'Quản lý sách',
      requiresAuth: true,
      requiresAdmin: true 
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { 
      title: 'Quản lý người dùng',
      requiresAuth: true,
      requiresAdmin: true 
    }
  },
  {
    path: '/admin/borrowing-requests',
    name: 'AdminBorrowingRequests',
    component: AdminBorrowingRequests,
    meta: { 
      title: 'Quản lý yêu cầu mượn',
      requiresAuth: true,
      requiresAdmin: true 
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Không tìm thấy trang' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth if not already done
  if (authStore.accessToken && !authStore.user) {
    try {
      await authStore.initializeAuth();
    } catch (error) {
      console.error('Auth initialization failed:', error);
    }
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }
  
  // Check if route requires admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' });
    return;
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'UserDashboard' });
    return;
  }
  
  next();
});

// Update document title
router.afterEach((to) => {
  const baseTitle = 'Hệ thống Mượn Sách Trực Tuyến';
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle;
});

export default router;