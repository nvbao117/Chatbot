# 📚 Tài Liệu Code - Learning Chatbot Project

## 🎯 Tổng Quan Dự Án

Dự án **Learning Chatbot** là một ứng dụng học tập thông minh được xây dựng bằng React + Vite, tích hợp AI chatbot để hỗ trợ học tập. Ứng dụng có giao diện hiện đại, responsive và hỗ trợ nhiều tính năng học tập tương tác.

## 🏗️ Kiến Trúc Dự Án

### 📁 Cấu Trúc Thư Mục

```
src/
├── components/           # Các component tái sử dụng
│   ├── auth/            # Components xác thực (Login, Register)
│   ├── chatbot/         # Components chatbot
│   ├── common/          # Components chung (Button, Input, Header, Sidebar)
│   ├── subjects/        # Components môn học
│   ├── topics/          # Components chủ đề
│   └── quiz/            # Components quiz
├── pages/               # Các trang chính
│   ├── Login/           # Trang đăng nhập
│   ├── Register/        # Trang đăng ký
│   ├── Dashboard/       # Trang chủ
│   ├── Chat/            # Trang chat chính
│   ├── Subjects/        # Trang danh sách môn học
│   ├── Quiz/            # Trang quiz
│   ├── Progress/        # Trang tiến độ học tập
│   ├── Achievements/    # Trang thành tích
│   └── Profile/         # Trang hồ sơ cá nhân
├── store/               # Redux store và slices
│   └── slices/          # Các Redux slices
├── services/            # API services và mock data
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── config/              # Cấu hình ứng dụng
```

## 🔧 Công Nghệ Sử Dụng

### Frontend
- **React 18** - UI library chính
- **Vite** - Build tool và dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **CSS Modules** - Styling với scoped CSS
- **PostCSS + Tailwind CSS** - Utility-first CSS framework

### Backend & API
- **Mock Services** - Dữ liệu giả cho development
- **LocalStorage** - Lưu trữ dữ liệu local
- **Axios** - HTTP client (cho production)

### UI/UX
- **Glassmorphism Design** - Thiết kế hiện đại với hiệu ứng kính
- **Responsive Design** - Tương thích mọi thiết bị
- **Animations** - Hiệu ứng chuyển động mượt mà
- **Dark/Light Theme** - Hỗ trợ chế độ sáng/tối

## 📋 Chi Tiết Các Component Chính

### 🔐 Authentication System

#### `src/pages/Login/Login.jsx`
```javascript
/**
 * Trang Đăng Nhập
 * 
 * Component này render trang đăng nhập với thiết kế siêu hiện đại bao gồm:
 * - Background gradient động với các hình dạng trôi nổi
 * - Hiệu ứng theo dõi chuột
 * - Carousel giới thiệu các tính năng của ứng dụng
 * - Phần thống kê với các chỉ số quan trọng
 * - Form đăng nhập với tùy chọn đăng nhập xã hội
 * 
 * Trang được thiết kế để vừa trong một màn hình không cần cuộn
 * và cung cấp trải nghiệm người dùng hấp dẫn về mặt thị giác.
 */
```

**Tính năng chính:**
- Animated background với floating shapes
- Mouse follower effect
- Features carousel tự động chuyển slide
- Stats section hiển thị metrics
- Social login buttons
- Responsive design

#### `src/components/auth/LoginForm/LoginForm.jsx`
```javascript
/**
 * Form Đăng Nhập
 * 
 * Component này render form đăng nhập với các tính năng:
 * - Input email và password với validation
 * - Hiển thị lỗi từ server hoặc validation
 * - Tùy chọn "Remember me" và "Forgot password"
 * - Button submit với loading state
 * - Link chuyển đến trang đăng ký
 */
```

**Tính năng chính:**
- Real-time validation
- Error handling
- Loading states
- Form submission với API integration

### 🤖 Chatbot System

#### `src/components/chatbot/ChatWidget/ChatWidget.jsx`
```javascript
/**
 * Chat Widget Component
 * 
 * Component này render widget chat nổi với các tính năng:
 * - Chat window với input và messages
 * - Chat history sidebar có thể toggle
 * - Redux state management cho conversations
 * - Auto-save/load từ localStorage
 * - Responsive design cho mobile
 */
```

**Tính năng chính:**
- Floating chat widget
- Chat history management
- Real-time messaging
- Message persistence
- Typing indicators

#### `src/pages/Chat/ChatPage.jsx`
```javascript
/**
 * Trang Chat Chính
 * 
 * Trang chat với giao diện lớn như GPT bao gồm:
 * - Layout 2 cột với history sidebar bên trái
 * - Chat container chính bên phải
 * - Quick suggestions và actions
 * - Message history management
 * - Responsive design
 */
```

### 🏪 State Management

#### `src/store/slices/authSlice.js`
```javascript
/**
 * Redux Slice cho Authentication
 * 
 * Slice này quản lý state và actions liên quan đến xác thực:
 * - User info, token, loading states
 * - Login, logout, register actions
 * - Auto-save/load từ localStorage
 * - Role-based permissions
 */
```

**State structure:**
```javascript
const initialState = {
  user: null,                    // Thông tin user
  token: null,                   // JWT token
  isAuthenticated: false,        // Trạng thái đăng nhập
  loading: false,                // Loading state
  error: null,                   // Error message
}
```

#### `src/store/slices/chatSlice.js`
```javascript
/**
 * Redux Slice cho Chat Management
 * 
 * Slice này quản lý state và actions liên quan đến chat:
 * - Conversations list
 * - Current conversation
 * - Messages array
 * - Loading, typing, error states
 * - LocalStorage integration
 */
```

### 🔌 Services Layer

#### `src/services/authService.js`
```javascript
/**
 * Service Xác Thực
 * 
 * Service này xử lý tất cả các API liên quan đến xác thực:
 * - Đăng nhập (login)
 * - Đăng ký (register) 
 * - Đăng xuất (logout)
 * - Refresh token
 * - Verify token
 * 
 * Trong development sử dụng mock data, production sử dụng real API
 */
```

**API Methods:**
- `login(email, password)` - Đăng nhập
- `register(userData)` - Đăng ký
- `logout()` - Đăng xuất
- `refreshToken()` - Làm mới token
- `verifyToken()` - Kiểm tra token

#### `src/services/chatbotService.js`
```javascript
/**
 * Service Chatbot
 * 
 * Service này xử lý tất cả các API liên quan đến chatbot:
 * - Gửi message và nhận response
 * - Lấy lịch sử chat
 * - Xóa lịch sử chat
 * - Mock responses cho development
 */
```

### 🎨 UI Components

#### `src/components/common/Button/Button.jsx`
```javascript
/**
 * Button Component
 * 
 * Component button tái sử dụng với các variants:
 * - Primary, secondary, outline
 * - Loading state
 * - Disabled state
 * - Icon support
 * - Responsive design
 */
```

#### `src/components/common/Input/Input.jsx`
```javascript
/**
 * Input Component
 * 
 * Component input tái sử dụng với các tính năng:
 * - Label và placeholder
 * - Error handling
 * - Icon support
 * - Validation states
 * - Responsive design
 */
```

## 🚀 Cách Chạy Dự Án

### 1. Cài Đặt Dependencies
```bash
npm install
# hoặc
pnpm install
```

### 2. Chạy Development Server
```bash
npm run dev
# hoặc
pnpm dev
```

### 3. Build Production
```bash
npm run build
# hoặc
pnpm build
```

## 🔑 Tài Khoản Test

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** admin

### Teacher Account
- **Email:** teacher@example.com
- **Password:** teacher123
- **Role:** teacher

### Student Account
- **Email:** user@example.com
- **Password:** user123
- **Role:** student

## 📱 Responsive Design

### Desktop (1200px+)
- Layout 2 cột cho chat page
- Full sidebar navigation
- Large form layouts

### Tablet (768px - 1199px)
- Collapsible sidebar
- Adjusted spacing
- Optimized touch targets

### Mobile (< 768px)
- Single column layout
- Bottom navigation
- Full-screen modals
- Touch-friendly interactions

## 🎨 Design System

### Color Palette
- **Primary:** #667eea (Blue gradient)
- **Secondary:** #764ba2 (Purple gradient)
- **Success:** #43e97b (Green)
- **Warning:** #f093fb (Pink)
- **Error:** #f5576c (Red)
- **Info:** #4facfe (Cyan)

### Typography
- **Font Family:** Inter, system-ui, sans-serif
- **Headings:** 2rem - 3rem
- **Body:** 1rem
- **Small:** 0.875rem

### Spacing
- **xs:** 0.25rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Learning Chatbot
VITE_APP_VERSION=1.0.0
```

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 📊 Performance Optimizations

### Code Splitting
- Lazy loading cho các pages
- Dynamic imports cho components lớn
- Route-based splitting

### State Management
- Redux Toolkit cho predictable state updates
- Memoization với useMemo và useCallback
- Optimized re-renders

### Bundle Optimization
- Tree shaking
- Dead code elimination
- Minification và compression

## 🧪 Testing Strategy

### Unit Tests
- Component testing với React Testing Library
- Hook testing
- Utility function testing

### Integration Tests
- API integration testing
- Redux store testing
- User flow testing

### E2E Tests
- Critical user journeys
- Cross-browser testing
- Performance testing

## 🚀 Deployment

### Build Process
1. **Linting** - ESLint code quality checks
2. **Type Checking** - TypeScript compilation
3. **Testing** - Unit và integration tests
4. **Building** - Vite production build
5. **Optimization** - Bundle analysis và optimization

### Production Checklist
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Error tracking setup
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] Security headers
- [ ] HTTPS enabled

## 📈 Future Enhancements

### Planned Features
- [ ] Real-time notifications
- [ ] Video call integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Offline support
- [ ] Multi-language support
- [ ] Advanced AI features

### Technical Improvements
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] WebSocket integration
- [ ] PWA features
- [ ] Advanced caching strategies
- [ ] CDN integration

## 🤝 Contributing

### Code Style
- ESLint configuration
- Prettier formatting
- Conventional commits
- Code review process

### Git Workflow
1. Feature branch từ `main`
2. Development và testing
3. Pull request với description
4. Code review
5. Merge sau khi approved

## 📞 Support

### Documentation
- Component documentation
- API documentation
- Deployment guides
- Troubleshooting guides

### Contact
- **Email:** support@learningchatbot.com
- **GitHub:** github.com/learning-chatbot
- **Documentation:** docs.learningchatbot.com

---

**Lưu ý:** Tài liệu này được cập nhật thường xuyên. Vui lòng kiểm tra phiên bản mới nhất trước khi phát triển.
