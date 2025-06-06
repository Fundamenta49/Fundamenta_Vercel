import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import RobotFundi from "@/components/robot-fundi";
import ChatCalendarConnector from "@/components/chat-calendar-connector";
import Home from "@/pages/home";
import WhyFundamenta from "@/pages/why-fundamenta";
import Partner from "@/pages/partner";
import Privacy from "@/pages/privacy";
import Invite from "@/pages/invite";
import Emergency from "@/pages/emergency";
import Finance from "@/pages/finance";
import MortgagePage from "@/pages/finance/mortgage";
import Career from "@/pages/career";
import Wellness from "@/pages/wellness";
import Active from "@/pages/active";
import Learning from "@/pages/learning";
import YogaTest from "@/pages/yoga-test";
import YogaPoseAnalysis from "@/pages/yoga-pose-analysis";
import YogaProgressionPage from "@/pages/yoga-progression";
import Arcade from "@/pages/arcade";
import CalendarPage from "@/pages/calendar";
import EconomicsCourse from "@/pages/learning/courses/economics";
import VehicleMaintenanceCourse from "@/pages/learning/courses/vehicle-maintenance";
// We're using the main wellness page with URL parameters instead of separate pages
import HomeMaintenanceCourse from "@/pages/learning/courses/home-maintenance";
import CookingBasicsCourse from "@/pages/learning/courses/cooking-basics";
import HealthWellnessCourse from "@/pages/learning/courses/health-wellness";
import CriticalThinkingCourse from "@/pages/learning/courses/critical-thinking";
import ConflictResolutionCourse from "@/pages/learning/courses/conflict-resolution";
import DecisionMakingCourse from "@/pages/learning/courses/decision-making";
import TimeManagementCourse from "@/pages/learning/courses/time-management";
import CopingWithFailureCourse from "@/pages/learning/courses/coping-with-failure";
import ConversationSkillsCourse from "@/pages/learning/courses/conversation-skills";
import FormingPositiveHabitsCourse from "@/pages/learning/courses/forming-positive-habits";
import UtilitiesGuideCourse from "@/pages/learning/courses/utilities-guide";
import ShoppingBuddyCourse from "@/pages/learning/courses/shopping-buddy";
import RepairAssistantCourse from "@/pages/learning/courses/repair-assistant";
import LifeSkillsPage from "@/pages/learning/life-skills";
import IdentityDocumentsPage from "@/pages/learning/identity-documents";
import CompletedCoursesPage from "@/pages/learning/completed";
import LearningPathwaysPage from "@/pages/learning/pathways";
import DesignShowcasePage from "@/pages/design-showcase";
import LoginPage from "@/pages/login";
import { AuthProvider } from "@/lib/auth-context";
import AdminPage from "@/pages/admin";
import PersonalityTestPage from "@/pages/admin/personality-test";
import ProtectedRoute from "@/components/protected-route";
import { SkeletonDemoPage } from "@/components/SkeletonDemoPage";
// Guided Tour imports
import { GuidedTourProvider } from "@/contexts/guided-tour-context";
import { availableTours } from "@/lib/tour-controller";
import GuidedTour from "@/components/tour/guided-tour";
import useStartTour from "@/hooks/use-start-tour";

// Component to handle redirects from /wellness/* to /wellness?section=*
function WellnessRedirect() {
  const [, navigate] = useLocation();
  const section = window.location.pathname.split('/').pop();
  
  useEffect(() => {
    // Redirect to main wellness page with section parameter
    if (section) {
      navigate(`/wellness?section=${section}`);
    } else {
      // Default to wellness page if no section
      navigate('/wellness');
    }
  }, [navigate, section]);
  
  return null;
}

// Component to handle redirects from /yoga to /active?section=yoga
function YogaRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to active page with yoga section parameter
    navigate('/active?section=yoga');
  }, [navigate]);
  
  return null;
}

// Component to handle redirects from /why-fundamenta to home page with dialog open
function WhyFundamentaRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to home page with parameter to open the dialog
    navigate('/?openFounderMessage=true');
  }, [navigate]);
  
  return null;
}

// Component to handle redirects from /fitness/* to /active?section=*
function FitnessRedirect() {
  const [, navigate] = useLocation();
  const section = window.location.pathname.split('/').pop();
  
  useEffect(() => {
    // Redirect to active page with section parameter
    if (section) {
      navigate(`/active?section=${section}`);
    } else {
      // Default to active page if no section
      navigate('/active');
    }
  }, [navigate, section]);
  
  return null;
}

function Router() {
  // Define a separate route configuration for the login page
  return (
    <Switch>
      <Route path="/login">
        {/* Login page is completely separated from app layout */}
        <div className="login-container">
          <LoginPage />
        </div>
      </Route>
      <Route>
        <Layout>
          <Switch>
            <Route path="/">
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Route>
            <Route path="/why-fundamenta">
              <WhyFundamentaRedirect />
            </Route>
            <Route path="/partner" component={Partner} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/invite" component={Invite} />
            <Route path="/emergency" component={Emergency} />
            <Route path="/finance">
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            </Route>
            <Route path="/finance/mortgage">
              <ProtectedRoute>
                <MortgagePage />
              </ProtectedRoute>
            </Route>
            <Route path="/career">
              <ProtectedRoute>
                <Career />
              </ProtectedRoute>
            </Route>
            <Route path="/wellness">
              <ProtectedRoute>
                <Wellness />
              </ProtectedRoute>
            </Route>
            <Route path="/wellness/:section">
              <ProtectedRoute>
                <WellnessRedirect />
              </ProtectedRoute>
            </Route>
            <Route path="/active">
              <ProtectedRoute>
                <Active />
              </ProtectedRoute>
            </Route>
            <Route path="/active/:section">
              <ProtectedRoute>
                <Active />
              </ProtectedRoute>
            </Route>
            <Route path="/yoga">
              <ProtectedRoute>
                <YogaRedirect />
              </ProtectedRoute>
            </Route>
            <Route path="/fitness/:section">
              <ProtectedRoute>
                <FitnessRedirect />
              </ProtectedRoute>
            </Route>
            <Route path="/fitness">
              <ProtectedRoute>
                <FitnessRedirect />
              </ProtectedRoute>
            </Route>
            <Route path="/yoga-test">
              <ProtectedRoute>
                <YogaTest />
              </ProtectedRoute>
            </Route>
            <Route path="/yoga-pose-analysis">
              <ProtectedRoute>
                <YogaPoseAnalysis />
              </ProtectedRoute>
            </Route>
            <Route path="/yoga-progression">
              <ProtectedRoute>
                <YogaProgressionPage />
              </ProtectedRoute>
            </Route>
            <Route path="/arcade">
              <ProtectedRoute>
                <Arcade />
              </ProtectedRoute>
            </Route>
            <Route path="/admin" component={AdminPage} />
            <Route path="/admin/personality-test" component={PersonalityTestPage} />
            <Route path="/design-showcase" component={DesignShowcasePage} />
            <Route path="/ui/skeletons" component={SkeletonDemoPage} />
            <Route path="/learning">
              <ProtectedRoute>
                <Learning />
              </ProtectedRoute>
            </Route>
            <Route path="/calendar">
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/vehicle-maintenance">
              <ProtectedRoute>
                <VehicleMaintenanceCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/home-maintenance">
              <ProtectedRoute>
                <HomeMaintenanceCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/cooking-basics">
              <ProtectedRoute>
                <CookingBasicsCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/health-wellness">
              <ProtectedRoute>
                <HealthWellnessCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/economics">
              <ProtectedRoute>
                <EconomicsCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/critical-thinking">
              <ProtectedRoute>
                <CriticalThinkingCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/conflict-resolution">
              <ProtectedRoute>
                <ConflictResolutionCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/life-skills">
              <ProtectedRoute>
                <LifeSkillsPage />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/identity-documents">
              <ProtectedRoute>
                <IdentityDocumentsPage />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/decision-making">
              <ProtectedRoute>
                <DecisionMakingCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/time-management">
              <ProtectedRoute>
                <TimeManagementCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/coping-with-failure">
              <ProtectedRoute>
                <CopingWithFailureCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/conversation-skills">
              <ProtectedRoute>
                <ConversationSkillsCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/forming-positive-habits">
              <ProtectedRoute>
                <FormingPositiveHabitsCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/utilities-guide">
              <ProtectedRoute>
                <UtilitiesGuideCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/shopping-buddy">
              <ProtectedRoute>
                <ShoppingBuddyCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/courses/repair-assistant">
              <ProtectedRoute>
                <RepairAssistantCourse />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/completed">
              <ProtectedRoute>
                <CompletedCoursesPage />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/pathways">
              <ProtectedRoute>
                <LearningPathwaysPage />
              </ProtectedRoute>
            </Route>
            <Route component={NotFound} />
          </Switch>
          <Toaster />
          <ChatCalendarConnector />
        </Layout>
      </Route>
    </Switch>
  );
}

// TourController component to hook up tour events
function TourController() {
  // Use the hook to enable tour starting
  useStartTour();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GuidedTourProvider tours={availableTours}>
          <Router />
          <GuidedTour />
          <TourController />
        </GuidedTourProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;