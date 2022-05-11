import Home from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import MyProfilePage from "./pages/MyProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import MyPostPage from "./pages/MyPostPage";
import FollowsPage from "./pages/FollowsPage";
import TermsofServicePage from "./pages/TermsofServicePage";
import AboutupPage from "./pages/AboutupPage";
import ForDeveloperPage from "./pages/ForDeveloperPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import RegisterPage from "./pages/RegisterPage";
import FollowerPage from "./pages/FollowerPage";
import NewPostPage from "./pages/NewPostPage";
import EditPostPage from "./pages/EditPostPage";

import ProfilePage from "./pages/ProfilePage";

import MessengerPage from "./pages/messenger/MessengerPage";

import TestFilesUpload from "./_test/TestFilesUpload";

export default [
  { path: "/", name: "หน้าหลัก", Component: Home },
  { path: "/register", name: "สมัครสมาชิก", Component: RegisterPage },
  {
    path: "/forget-password",
    name: "ลืมรหัสผ่าน",
    Component: ForgetPasswordPage,
  },
  { path: "/detail/:_id", name: "รายละเอียด", Component: DetailPage },
  { path: "/my-profile", name: "My Profile", Component: MyProfilePage },
  { path: "/profile/:_id", name: "Profile", Component: ProfilePage },
  { path: "/my-profile/my-post", name: "Your posts", Component: MyPostPage },
  { path: "/my-profile/follows", name: "Follows", Component: FollowsPage },
  {
    path: "/my-profile/my-post/:nid",
    name: "รายละเอียด",
    Component: DetailPage,
  },
  {
    path: "/my-profile/my-followup/:nid",
    name: "รายละเอียด",
    Component: DetailPage,
  },

  {
    path: "/test-files-upload",
    name: "TestFilesUpload",
    Component: TestFilesUpload,
  },

  { path: "/follower/:nid", name: "ผู้ติดตาม", Component: FollowerPage },
  // { path: "/my-profile/detail/:nid", name: "รายละเอียด", Component: DetailPage },
  // /my-profile/detail/70287
  { path: "/settings", name: "Settings", Component: SettingsPage },
  {
    path: "/notifications",
    name: "Notifications",
    Component: NotificationsPage,
  },
  {
    path: "/terms-of-service",
    name: "Terms of Service",
    Component: TermsofServicePage,
  },
  { path: "/about-up", name: "About up", Component: AboutupPage },
  {
    path: "/for-developer",
    name: "For Developer",
    Component: ForDeveloperPage,
  },

  { path: "/new-post", name: "New post", Component: NewPostPage },

  { path: "/edit-post/:id", name: "Edit post", Component: EditPostPage },

  { path: "/list-chat", name: "List Chat", Component: MessengerPage },
];
