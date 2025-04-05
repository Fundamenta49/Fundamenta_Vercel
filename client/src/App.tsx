import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import RobotFundi from "@/components/robot-fundi";
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
import FundiShowcase from "@/pages/fundi-showcase";
import LearningCalendar from "@/components/learning-calendar";
import EnhancedCalendar from "@/components/enhanced-calendar";
import CalendarRedesigned from "@/components/calendar-redesigned";
import CalendarTestingPage from "@/pages/calendar-testing";
import EconomicsCourse from "@/pages/learning/courses/economics";
import VehicleMaintenanceCourse from "@/pages/learning/courses/vehicle-maintenance";
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
import { TourProvider } from "./contexts/tour-context";
import Tour from "./components/tour";
import LoginPage from "@/pages/login";
import { AuthProvider } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";
import TestNotification from "@/components/test-notification";

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route>
        <Layout>
          <Tour />
          <Switch>
            <Route path="/">
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Route>
            <Route path="/why-fundamenta" component={WhyFundamenta} />
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
            <Route path="/active">
              <ProtectedRoute>
                <Active />
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
            <Route path="/fundi-showcase" component={FundiShowcase} />
            <Route path="/learning">
              <ProtectedRoute>
                <Learning />
              </ProtectedRoute>
            </Route>
            <Route path="/learning-calendar">
              <ProtectedRoute>
                <LearningCalendar />
              </ProtectedRoute>
            </Route>
            <Route path="/enhanced-calendar">
              <ProtectedRoute>
                <EnhancedCalendar />
              </ProtectedRoute>
            </Route>
            <Route path="/redesigned-calendar">
              <ProtectedRoute>
                <CalendarRedesigned />
              </ProtectedRoute>
            </Route>
            <Route path="/calendar-testing">
              <ProtectedRoute>
                <CalendarTestingPage />
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
            <Route component={NotFound} />
          </Switch>
          <Toaster />
          <TestNotification />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TourProvider>
          <Router />
        </TourProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;