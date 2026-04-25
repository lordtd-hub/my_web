import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SiteLayout } from "../components/SiteLayout";
import { AdminCourseDetailPage } from "../pages/admin/AdminCourseDetailPage";
import { AdminCourseImportPage } from "../pages/admin/AdminCourseImportPage";
import { AdminCourseNewPage } from "../pages/admin/AdminCourseNewPage";
import { AdminCourseScoresPage } from "../pages/admin/AdminCourseScoresPage";
import { AdminCourseStudentsPage } from "../pages/admin/AdminCourseStudentsPage";
import { AdminCoursesPage } from "../pages/admin/AdminCoursesPage";
import { AdminHomePage } from "../pages/admin/AdminHomePage";
import { AboutPage } from "../pages/public/AboutPage";
import { ContactPage } from "../pages/public/ContactPage";
import { CourseDetailPage } from "../pages/public/CourseDetailPage";
import { CoursesPage } from "../pages/public/CoursesPage";
import { HomePage } from "../pages/public/HomePage";
import { LoginPage } from "../pages/public/LoginPage";
import { NotFoundPage } from "../pages/public/NotFoundPage";
import { ProjectsPage } from "../pages/public/ProjectsPage";
import { ResearchPage } from "../pages/public/ResearchPage";
import { TeachingPage } from "../pages/public/TeachingPage";
import { StudentCoursesPage } from "../pages/student/StudentCoursesPage";
import { StudentHomePage } from "../pages/student/StudentHomePage";
import { StudentScoresPage } from "../pages/student/StudentScoresPage";
import { ProtectedRoute } from "../routes/ProtectedRoute";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <SiteLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/teaching" element={<TeachingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute>
              <StudentCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:courseId/scores"
          element={
            <ProtectedRoute>
              <StudentScoresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/new"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCourseNewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:courseId"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:courseId/students"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCourseStudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:courseId/scores"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCourseScoresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:courseId/import"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCourseImportPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SiteLayout>
  );
}
