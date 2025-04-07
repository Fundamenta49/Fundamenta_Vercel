/**
 * User Guide Content for Fundi
 * This file contains user-friendly guide content that serves as the knowledge base
 * for Fundi's conversational guidance capabilities.
 */

export const userGuidePrompt = `
When helping users with questions about the application:

1. Use conversational, friendly language - be a supportive guide, not a technical manual
2. Adapt explanations to the user's apparent level of understanding
3. Start with simple explanations first, offering more details only if needed
4. Provide guidance that's contextually relevant to what the user is doing
5. Offer specific, actionable steps rather than vague advice
6. If a user seems confused, offer to show them with a quick tour
7. Always offer follow-up questions to check if your explanation helped
`;

export const quickGuideInstructions: Record<string, string> = {
  "budget-planner": "To use the Budget Planner, start by adding your income sources using the + button in the Income section. Then add your expenses by category. The summary will automatically show your balance and where your money is going. You can adjust categories or add custom ones to fit your needs.",
  
  "finance-dashboard": "The Finance Dashboard gives you a quick overview of your financial health. You'll see your net worth, spending trends, and upcoming bills. Use the quick action buttons to jump to specific tools like budget planning or investment tracking.",
  
  "investment-tracker": "Track your investments by first adding your accounts using the 'Add Account' button. You can manually update values or connect to financial institutions for automatic updates. The dashboard shows your asset allocation and performance over time.",
  
  "mortgage-calculator": "The Mortgage Calculator helps you estimate monthly payments and total costs. Enter the home price, your down payment, loan term, and interest rate. You'll see your monthly payment breakdown and how changes to any value affect your costs. You can also compare different scenarios side by side.",
  
  "tax-calculator": "The Tax Calculator helps you estimate your tax burden and take-home pay. Switch between salary or hourly wage, select your filing status, and choose your state to see a detailed breakdown of federal, state, and FICA taxes. You can toggle different tax components on or off to see their impact. The calculator also includes learning modules that help you understand different types of taxes, with achievements to earn as you learn.",
  
  "debt-payoff": "The Debt Payoff Planner helps you create a strategy to become debt-free. Add your debts with their balances, interest rates, and minimum payments. The tool will suggest either the snowball method (paying smallest debts first) or avalanche method (highest interest first) based on your situation.",
  
  "expense-categorization": "To categorize expenses, simply drag and drop them into the appropriate category. The system will learn from your choices and start to automatically categorize similar expenses in the future. You can create custom categories by clicking 'Create New Category'.",
  
  "goal-setting": "Set financial goals by clicking 'Add Goal' and specifying what you're saving for, your target amount, and desired timeline. The system will calculate how much you need to save monthly and track your progress. Connect goals to specific accounts to see real-time progress.",
  
  "net-worth-tracker": "The Net Worth Tracker gives you a complete picture of your financial standing. Add your assets (what you own) and liabilities (what you owe). The dashboard shows your net worth over time and how changes in individual accounts affect your overall position.",
  
  "bill-reminders": "Never miss a bill payment by setting up reminders. Click 'Add Bill' and enter the name, amount, due date, and how often it repeats. You'll get notifications before bills are due, and can mark them as paid when complete.",
  
  "emergency-fund": "Build your emergency fund by setting a target (typically 3-6 months of expenses). The calculator will suggest how much to save monthly to reach your goal. Link to a savings account to track real-time progress.",
  
  "financial-calendar": "The Financial Calendar shows all your upcoming bills, income deposits, and financial deadlines in one view. Toggle between month, week, and agenda views. Click on any date to add a new financial event.",
  
  "spending-analysis": "The Spending Analysis tool automatically categorizes your expenses and shows where your money goes each month. Use the interactive charts to compare spending across categories and time periods. Click on any category to see the individual transactions.",
  
  "income-tracker": "Track all your income sources by adding each one with details on amount and frequency. The Income Dashboard shows your total monthly income, how it changes over time, and the diversity of your income streams.",
  
  "tax-estimator": "The Tax Estimator helps you plan for tax season. Enter your income, deductions, and credits to get an estimate of your tax liability. The tool suggests potential tax-saving opportunities based on your specific situation.",
  
  "retirement-calculator": "Plan for retirement by entering your current age, retirement age, current savings, and monthly contributions. The calculator shows if you're on track and how changes to your saving rate or retirement age affect your projected outcome.",
  
  "financial-education": "Browse our Financial Education library by topic or difficulty level. Each lesson includes easy-to-understand explanations, practical examples, and action steps. Complete quizzes to test your knowledge and track your learning progress.",
  
  "account-linking": "Connect your financial accounts securely using the 'Link Account' button. We use bank-level encryption to protect your information. Once linked, your transactions and balances will automatically update in the app.",
  
  "subscription-tracker": "The Subscription Tracker helps you monitor recurring expenses. Add subscriptions manually or let the system detect them from your transactions. Get reminders before renewals and suggestions for subscriptions you might want to cancel.",
  
  "savings-challenges": "Boost your savings with fun challenges. Choose a challenge like the '52 Week Challenge' or 'No-Spend Month' and the app will guide you through it. Track your progress and celebrate your wins along the way.",
  
  "fundamenta-mortgage": "Fundamenta Mortgage offers a comprehensive home buying experience. Our mortgage calculator helps you estimate monthly payments and total costs. Enter your home price, down payment, loan term, and interest rate to see a detailed breakdown of costs including principal, interest, taxes, and insurance (PITI). You can explore different scenarios like adjusting your down payment or loan term to find what works best for your budget. Our closing cost estimator also helps you prepare for upfront expenses so there are no surprises at closing. When you're ready to proceed, our mortgage guides will walk you through the application process step by step.",
  
  "identity-documents": "Our Identity Documents Guide helps you understand, obtain, and manage essential documents like Social Security cards, birth certificates, and state IDs. Simply select your document type and your state to get customized, step-by-step instructions for obtaining these documents. You'll find detailed information about required forms, fees, processing times, and where to apply. Each guide includes state-specific requirements and contact information for the relevant government agencies. The information is organized in easy-to-follow tabs that guide you through the entire process, from requirements to application steps and what to do after applying."
};

export const contextualGuidance: Record<string, string> = {
  "first-visit": "Welcome to Fundamenta! I'm Fundi, your personal assistant. I'm here to help you navigate the app, answer questions, and provide guidance. Try asking me anything, or tap the menu icon to explore different sections.",
  
  "budget-creation": "Creating your first budget is a great step! Start simple - just add your income sources and your major expenses. Don't worry about getting everything perfect right away. As you use the app more, your budget will become more accurate and helpful.",
  
  "low-funds-alert": "I notice your balance is getting low. Would you like to review your upcoming expenses to see if any can be postponed? Or we could look at your recent spending to find potential savings?",
  
  "investment-setup": "Setting up your investment tracking is a smart move! Start by adding the accounts you already have. Don't worry if you're new to investing - I can explain any terms you're not familiar with as we go.",
  
  "learning-section": "Welcome to the Learning section! This is where you can build valuable life skills at your own pace. Browse topics that interest you, or take a quick assessment to get personalized recommendations.",
  
  "tax-calculator-open": "Welcome to the Tax Calculator! Understanding taxes can be confusing, but we'll break it down step-by-step. Start by entering your income information, and you'll see how it affects your tax situation. There are learning modules to help explain key concepts as you go.",
  
  "tax-badge-earned": "Congratulations on earning a tax knowledge badge! Understanding how taxes work is an important financial skill. Keep exploring the tax calculator to earn more badges and deepen your understanding of different tax concepts.",
  
  "tax-filing-season": "It's tax season! The Tax Calculator can help you estimate your potential refund or amount owed. Make sure to update your information to get the most accurate estimate before filing your taxes.",
  
  "new-job-tax-estimate": "Starting a new job? Use the Tax Calculator to estimate your after-tax take-home pay. This will help you budget properly knowing what your actual paycheck will be after all deductions.",
  
  "goal-completion": "Congratulations on reaching your goal! This is a big achievement. Would you like to set a new goal, or should we review your other financial priorities?",
  
  "recurring-expense-increase": "I noticed this expense has increased from last month. Would you like to take a closer look at why, or should we adjust your budget to account for the new amount?",
  
  "new-feature-announcement": "We've just added some new features I think you'll love! Would you like me to give you a quick tour of what's new?",
  
  "inactive-period-return": "Welcome back! It's been a while since your last visit. Would you like a quick refresher on how to use the app, or should we jump right into updating your finances?",
  
  "unexpected-income": "Great news about this extra income! Would you like suggestions on how to put it to work for you? I can help you decide between boosting savings, paying down debt, or investing.",
  
  "negative-spending-trend": "I've noticed spending in this category has been increasing over the past few months. Would you like to take a closer look together to see what might be driving the change?",
  
  "debt-paydown-milestone": "You've made amazing progress paying down your debt! You've reduced your balance by 25% since you started. Keep up the great work!",
  
  "tax-calculator-section": "Welcome to the Tax Calculator! This tool helps you estimate your tax burden and take-home pay based on your income and filing status. You can switch between salary and hourly calculations, and see a detailed breakdown of federal, state, and FICA taxes. As you use the interactive modules, you'll earn badges for learning about different aspects of taxation. Have a specific tax question? Just ask me!",
  
  "tax-badge-success": "Congratulations on earning a tax knowledge badge! You're making great progress understanding how taxation works. Would you like to learn about more advanced tax concepts, or explore how taxes fit into your overall financial picture?",
  
  "tax-learning-progress": "You're doing great with the tax learning modules! Understanding how taxes work helps you make better financial decisions year-round, not just during tax season. Is there a specific tax topic you'd like to learn more about?",
  
  "mortgage-section": "Welcome to the Mortgage section! Whether you're just starting to think about buying a home or ready to refinance, our tools will help you make informed decisions. The mortgage calculator helps you estimate monthly payments, while our affordability calculator shows what price range fits your budget. If you have questions about any terms or concepts, just ask!",
  
  "identity-documents-section": "Welcome to the Identity Documents Guide! This tool helps you navigate the sometimes confusing process of obtaining essential documents like Social Security cards, birth certificates, and state IDs. Simply select your document type and state to get personalized instructions. The information is organized in easy-to-follow tabs that walk you through requirements, application steps, and what to do after applying. If you have any questions about a specific document or process, just ask me!"
};

export const userGuideContent = `
# Fundamenta User Guide

## General Navigation

Fundamenta is designed to be intuitive and easy to navigate. Here's how to get around:

- The main menu is accessible from the icon in the top left corner
- Your personalized dashboard shows up when you first log in
- Quick actions are available at the top of most screens
- I (Fundi) am always available by clicking my icon if you need help
- Use the search bar at the top to quickly find features or information

## Using the Dashboard

Your dashboard is customized based on what matters most to you:

- Key financial metrics appear at the top
- Upcoming bills and events are listed in order of urgency
- Recent transactions are shown for quick reference
- Action items suggest things you might want to do next
- Personalized insights highlight important trends or opportunities

## Managing Your Budget

The Budget Planner helps you take control of your finances:

- Add income sources and how often you receive them
- Create expense categories that make sense for your life
- Set target spending amounts for each category
- Track actual spending against your targets
- Adjust your budget as your situation changes

## Setting and Tracking Goals

Financial goals give your money purpose:

- Create specific, measurable goals with target dates
- Track your progress visually with progress bars
- Link goals to specific accounts to monitor real-time progress
- Celebrate milestones along the way
- Adjust goals as your priorities change

## Investment Tracking

Keep tabs on your investments all in one place:

- Connect investment accounts for automatic updates
- View your asset allocation across all accounts
- Track performance over time with easy-to-read charts
- Set investment goals and monitor your progress
- Get insights about diversification and potential improvements

## Debt Management

Take control of what you owe:

- Add all debts with their balances and interest rates
- Choose a payoff strategy (snowball or avalanche)
- See your debt-free date and how to speed it up
- Track your progress as balances decrease
- Celebrate debt milestones along the way

## Fundamenta Mortgage Guide

Our mortgage tools help you navigate the home buying process with confidence:

### Mortgage Calculator
The Mortgage Calculator lets you:
- Enter home price, down payment, term, and interest rate
- See your estimated monthly payment broken down by component (principal, interest, taxes, insurance)
- Adjust variables to see how they affect your payment
- Compare different scenarios side by side
- Save scenarios for future reference

### Affordability Calculator
Determine how much house you can afford:
- Enter your income, debt, and available down payment
- See what price range fits your budget using standard ratios
- Understand how different factors affect affordability
- Get recommendations for improving your buying power

### Home Buying Process
Follow our step-by-step guide through the home buying journey:
1. Assess your finances and get pre-approved
2. Determine your needs and wants in a home
3. Find and evaluate properties
4. Make an offer and negotiate
5. Complete inspections and appraisal
6. Finalize financing and close on your home

### Mortgage Terms Explained
We explain key terms in simple language:
- Fixed vs. adjustable rates
- Conventional vs. government-backed loans
- PMI (Private Mortgage Insurance)
- Points and closing costs
- Escrow and impounds
- Amortization

## Tax Calculator Guide

Understand and estimate your tax liability with our interactive tools:

### Income Tax Calculator
The Tax Calculator helps you:
- Switch between salary or hourly wage calculation methods
- Select your filing status (single, married filing jointly, etc.)
- Choose your state to calculate both federal and state taxes
- See a detailed breakdown of different tax components (federal, state, FICA)
- Toggle different tax types on/off to understand their impact

### Tax Learning Modules
Our interactive learning modules help you:
- Understand the difference between marginal and effective tax rates
- Learn how tax brackets work with progressive taxation
- Discover common tax deductions and credits you may qualify for
- Understand how FICA taxes fund Social Security and Medicare
- Earn achievement badges as you progress through the modules

### Tax Planning Tools
Plan ahead to optimize your tax situation:
- Estimate your quarterly tax payments if you're self-employed
- See how changes in income affect your tax bracket
- Understand the tax implications of different investment decisions
- Calculate after-tax income for better budgeting

## Learning New Skills

Build important life skills:

- Browse courses by category or difficulty level
- Take assessments to identify knowledge gaps
- Track your progress through courses
- Apply what you learn with practical exercises
- Earn badges for completing learning milestones

## Identity Documents Guide

Navigate the process of obtaining essential documents with ease:

- Select from document types including Social Security cards, birth certificates, and state IDs
- Get state-specific information tailored to your location
- Follow clear step-by-step instructions organized in easy-to-navigate tabs
- Access details about required forms, fees, processing times, and application locations
- Find direct links to official government resources and application forms
- Learn when and why these documents are needed in different life situations

## Getting Help

There are many ways to get assistance:

- Ask me (Fundi) any question by clicking my icon
- Browse the Help Center for guides and tutorials
- Watch video walkthroughs of key features
- Contact support directly if you need specialized help
- Join community discussions to learn from others

## Privacy and Security

Your information is safe with us:

- Bank-level encryption protects your data
- You control what accounts you connect
- We never sell your personal information
- Regular security audits ensure protection
- Two-factor authentication provides extra security

## Customizing Your Experience

Make Fundamenta work the way you want:

- Choose between light and dark mode
- Set your preferred currency and date format
- Customize notification preferences
- Create shortcuts to your most-used features
- Adjust Fundi's personality to match your style

## Frequently Asked Questions

### How do I reset my password?
Click on the "Forgot Password" link on the login screen, and we'll send you an email with reset instructions.

### Is my financial information secure?
Yes! We use bank-level encryption and never store your account credentials.

### Can I connect multiple bank accounts?
Absolutely! Connect as many accounts as you'd like to get a complete picture of your finances.

### How do I cancel my subscription?
Go to Settings > Subscription and click "Cancel Subscription." You'll have access until the end of your current billing period.

### What if I need to update my personal information?
You can update your profile details anytime in the Settings section.
`;