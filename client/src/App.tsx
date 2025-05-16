import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import { TourProvider } from "@/components/home-tour";
import RobotFundi from "@/components/robot-fundi";
import ChatCalendarConnector from "@/components/chat-calendar-connector";
import PostTourGuide from "@/components/post-tour-guide";
import { ActivityProfileProvider } from "@/contexts/activity-profile-context";
import { JungleThemeProvider } from "./jungle-path/contexts/JungleThemeContext";
import { JungleFundiProvider } from "./jungle-path/contexts/JungleFundiContext";
import { LearningThemeProvider } from "@/contexts/LearningThemeContext";
import MyPathPage from "@/pages/mypath";
import StudentMyPath from "@/pages/mypath/student";
import AnalyticsDashboard from "@/pages/mypath/analytics";
import UserAnalytics from "@/pages/mypath/user-analytics";
import JungleHubView from "@/pages/mypath/jungle-hub";
import PublicPathwaysExplore from "@/pages/explore/pathways";

// Import cooking pages
import CookingPage from "@/pages/cooking";
import RecipesPage from "@/pages/cooking/recipes";
import MealPlanPage from "@/pages/cooking/meal-plan";
import CookingTechniquesPage from "@/pages/cooking/techniques";
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
import Active from "@/pages/active-fixed";
import ActiveEnhanced from "@/pages/active-enhanced";
import Learning from "@/pages/learning";
import PerformanceDemo from "./pages/performance-demo";
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
import FinancialLiteracyCourse from "@/pages/learning/courses/financial-literacy";
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
import LearningAnalyticsDashboard from "@/pages/learning/analytics";
import SavedQuizzesPage from "@/pages/learning/saved-quizzes";
// Legacy jungle components removed in Phase 5A
import DesignShowcasePage from "@/pages/design-showcase";
import LoginPage from "@/pages/login";
import AuthPage from "@/pages/auth-page";
import ZoneTestPage from "@/pages/dev/zone-test";
import JungleHubPage from "@/pages/jungle-hub";
import LearningHubPage from "@/pages/learning-hub";
import ZonePage from "@/pages/zone";
import BasecampPage from "@/pages/basecamp";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import { AuthProvider } from "@/lib/auth-context";
import AdminPage from "@/pages/admin";
import PersonalityTestPage from "@/pages/admin/personality-test";
import ProtectedRoute from "@/components/protected-route";
import { SkeletonDemoPage } from "@/components/SkeletonDemoPage";
import DisclaimerHub from "@/pages/disclaimer-hub";
import ComponentTest from "@/pages/component-test";
import { FeatureFlagsProvider } from "@/contexts/feature-flags-context";
import FindingProfessionals from "@/pages/resources/finding-professionals";
import ProfessionalQuestions from "@/pages/resources/professional-questions";
import FindingHealthcareProviders from "@/pages/resources/finding-healthcare-providers";
import EvaluatingMedicalInformation from "@/pages/resources/evaluating-medical-information";
import FindingFinancialAdvisors from "@/pages/resources/finding-financial-advisors";
import FinancialCredentials from "@/pages/resources/financial-credentials";
import FindingTherapist from "@/pages/resources/finding-therapist";
import MentalHealthProviders from "@/pages/resources/mental-health-providers";
import ConnectsPage from "@/pages/career/connects";

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

// Component to handle redirects from legacy jungle pages to the new jungle hub
function JungleHubRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to the new jungle hub
    navigate('/jungle-hub');
  }, [navigate]);
  
  return null;
}

// Component to handle redirects from /login to /auth
function AuthRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to new auth page
    navigate('/auth');
  }, [navigate]);
  
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
      <Route path="/auth">
        {/* New Auth page is completely separated from app layout */}
        <AuthPage />
      </Route>
      <Route path="/privacy-policy">
        {/* Privacy policy page without protected route */}
        <PrivacyPolicyPage />
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
            <Route path="/career/connects">
              <ProtectedRoute>
                <ConnectsPage />
              </ProtectedRoute>
            </Route>
{/* Career-new route removed as it's replaced by the updated Career component */}
            <Route path="/wellness">
              <ProtectedRoute>
                <Wellness />
              </ProtectedRoute>
            </Route>
            <Route path="/performance-demo">
              <PerformanceDemo />
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
            <Route path="/active-enhanced">
              <ProtectedRoute>
                <ActiveEnhanced />
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
            <Route path="/cooking">
              <ProtectedRoute>
                <CookingPage />
              </ProtectedRoute>
            </Route>
            <Route path="/cooking/recipes">
              <ProtectedRoute>
                <RecipesPage />
              </ProtectedRoute>
            </Route>
            <Route path="/cooking/meal-plan">
              <ProtectedRoute>
                <MealPlanPage />
              </ProtectedRoute>
            </Route>
            <Route path="/cooking/techniques">
              <ProtectedRoute>
                <CookingTechniquesPage />
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
            <Route path="/ui/components" component={ComponentTest} />
            <Route path="/dev/zone-test" component={ZoneTestPage} />
            <Route path="/jungle-hub">
              <ProtectedRoute>
                <JungleHubPage />
              </ProtectedRoute>
            </Route>
            <Route path="/learning-hub">
              <ProtectedRoute>
                <LearningHubPage />
              </ProtectedRoute>
            </Route>
            <Route path="/zone">
              <ProtectedRoute>
                <ZonePage />
              </ProtectedRoute>
            </Route>
            <Route path="/basecamp">
              <ProtectedRoute>
                <BasecampPage />
              </ProtectedRoute>
            </Route>
            {/* User-facing disclaimer hub */}
            <Route path="/disclaimers">
              <ProtectedRoute>
                <DisclaimerHub />
              </ProtectedRoute>
            </Route>
            <Route path="/resources/finding-professionals">
              <ProtectedRoute>
                <FindingProfessionals />
              </ProtectedRoute>
            </Route>
            <Route path="/resources/professional-questions">
              <ProtectedRoute>
                <ProfessionalQuestions />
              </ProtectedRoute>
            </Route>
            <Route path="/resources/finding-healthcare-providers">
              <ProtectedRoute>
                <FindingHealthcareProviders />
              </ProtectedRoute>
            </Route>
            <Route path="/resources/evaluating-medical-information">
              <ProtectedRoute>
                <EvaluatingMedicalInformation />
              </ProtectedRoute>
            </Route>
            <Route path="/resources/finding-financial-advisors">
              <ProtectedRoute>
                <FindingFinancialAdvisors />
              </ProtectedRoute>
            </Route>
            <Route path="/resources/financial-credentials">
              <ProtectedRoute>
                <FinancialCredentials />
              </ProtectedRoute>
            </Route>
            <Route path="/resources/finding-therapist">
              <ProtectedRoute>
                <FindingTherapist />
              </ProtectedRoute>
            </Route>
            <Route path="/resources/mental-health-providers">
              <ProtectedRoute>
                <MentalHealthProviders />
              </ProtectedRoute>
            </Route>
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
            <Route path="/learning/courses/financial-literacy">
              <ProtectedRoute>
                <FinancialLiteracyCourse />
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
            {/* Redirect legacy jungle pathways to the new jungle hub */}
            <Route path="/learning/jungle-pathways">
              <JungleHubRedirect />
            </Route>
            {/* Jungle demo page removed in Phase 5A cleanup */}
            <Route path="/learning/analytics">
              <ProtectedRoute>
                <LearningAnalyticsDashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/learning/saved-quizzes">
              <ProtectedRoute>
                <SavedQuizzesPage />
              </ProtectedRoute>
            </Route>
            <Route path="/mypath">
              <ProtectedRoute>
                <MyPathPage />
              </ProtectedRoute>
            </Route>
            <Route path="/mypath/student">
              <ProtectedRoute>
                <StudentMyPath />
              </ProtectedRoute>
            </Route>
            <Route path="/mypath/analytics">
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/mypath/user-analytics">
              <ProtectedRoute>
                <UserAnalytics />
              </ProtectedRoute>
            </Route>
            <Route path="/mypath/jungle-hub">
              <ProtectedRoute>
                <JungleHubView />
              </ProtectedRoute>
            </Route>
            <Route path="/explore/pathways">
              <ProtectedRoute>
                <PublicPathwaysExplore />
              </ProtectedRoute>
            </Route>
            <Route component={NotFound} />
          </Switch>
          <Toaster />
          <ChatCalendarConnector />
          <PostTourGuide />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Import dynamically to avoid server-side rendering issues
    const initAnalytics = async () => {
      try {
        const { initGA } = await import('./lib/analytics.js');
        // Verify required environment variable is present
        if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
          console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
        } else {
          initGA();
          console.log('Google Analytics initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    };
    
    initAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ActivityProfileProvider>
          <JungleThemeProvider defaultEnabled={false}>
            <JungleFundiProvider>
              <LearningThemeProvider initialTheme="standard">
                <TourProvider>
                  <FeatureFlagsProvider>
                    <Router />
                  </FeatureFlagsProvider>
                </TourProvider>
              </LearningThemeProvider>
            </JungleFundiProvider>
          </JungleThemeProvider>
        </ActivityProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;