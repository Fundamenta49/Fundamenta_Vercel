import React from 'react';
import { Route, Switch, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MeditationGuide from './components/meditation-guide';
import InterviewPractice from './components/interview-practice';
import Finance from './pages/finance';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Career Development Platform</h1>
            <div className="flex gap-4">
              <Link href="/">
                <a className="text-muted-foreground hover:text-foreground">Home</a>
              </Link>
              <Link href="/interview">
                <a className="text-muted-foreground hover:text-foreground">Interview Prep</a>
              </Link>
              <Link href="/wellness">
                <a className="text-muted-foreground hover:text-foreground">Wellness</a>
              </Link>
              <Link href="/finance">
                <a className="text-muted-foreground hover:text-foreground">Finance</a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/">
            <div className="grid gap-6">
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Welcome to Your Career Journey</h2>
                <p className="text-muted-foreground">
                  Access tools and resources to advance your career, maintain wellness, and achieve financial stability.
                </p>
              </section>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Interview Practice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Prepare for your next interview with AI-powered practice sessions.
                    </p>
                    <Link href="/interview">
                      <a className="text-primary hover:underline">Start Practice →</a>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wellness Center</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Take care of your mental health with guided meditation sessions.
                    </p>
                    <Link href="/wellness">
                      <a className="text-primary hover:underline">Start Session →</a>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Plan your financial future with our comprehensive tools.
                    </p>
                    <Link href="/finance">
                      <a className="text-primary hover:underline">View Tools →</a>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Route>

          <Route path="/interview" component={InterviewPractice} />
          <Route path="/wellness" component={MeditationGuide} />
          <Route path="/finance" component={Finance} />
        </Switch>
      </main>
    </div>
  );
};

export default App;