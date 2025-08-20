# WealthFlow - Personal Finance Dashboard

A modern, responsive personal finance dashboard built with Next.js 14, TypeScript, and Tailwind CSS. Track expenses, manage budgets, set financial goals, and visualize your financial data with interactive charts.

## Live Demo

[View Live Demo](your-deployment-url-here) | [Portfolio Case Study](your-portfolio-url-here)

## Features

### Core Functionality

- **Dashboard Overview**: Real-time financial statistics and insights
- **Transaction Management**: Add, categorize, and track income/expenses
- **Budget Planning**: Create and monitor spending budgets by category
- **Goal Tracking**: Set and visualize progress toward financial goals
- **Investment Portfolio**: Monitor investment performance and allocation
- **Analytics**: Interactive charts and financial trend analysis

### Technical Features

- **Responsive Design**: Mobile-first approach with seamless tablet/desktop experience
- **Dark/Light Mode**: Theme switching with system preference detection
- **Real-time Updates**: Instant UI updates with optimistic rendering
- **Data Visualization**: Interactive charts using Recharts library
- **Form Validation**: Comprehensive validation using React Hook Form + Zod
- **State Management**: Global state with Zustand for performance
- **Animations**: Smooth micro-interactions with Framer Motion

## Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier (via ESLint config)
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Turbopack (Next.js)

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm 9+

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/wealthflow-dashboard.git
   cd wealthflow-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration values.

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── dashboard/         # Dashboard-specific components
│   ├── charts/            # Chart components
│   ├── forms/             # Form components
│   └── common/            # Shared utility components
├── data/                  # Mock data and constants
├── lib/                   # Utilities and configurations
├── store/                 # Zustand state stores
└── types/                 # TypeScript type definitions
```

## Key Components

### Dashboard Layout

- Responsive sidebar navigation with mobile drawer
- Header with search, notifications, and user profile
- Breadcrumb navigation and page transitions

### Financial Widgets

- **StatCard**: Animated financial metric displays
- **SpendingChart**: Monthly income vs expenses visualization
- **CategoryChart**: Spending breakdown by category
- **GoalProgress**: Visual progress tracking for financial goals

### Data Management

- **Transaction Store**: CRUD operations for financial transactions
- **Budget Store**: Budget creation and monitoring
- **Goal Store**: Financial goal setting and tracking

## Development Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Code Standards

- Use TypeScript strict mode
- Follow ESLint configuration
- Write descriptive commit messages
- Add JSDoc comments for complex functions
- Ensure responsive design across all components

## Performance Optimizations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Use `@next/bundle-analyzer`
- **Lazy Loading**: Dynamic imports for heavy components
- **Memoization**: React.memo and useMemo for expensive operations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Roadmap

### Version 1.1

- [ ] Data export (CSV, PDF)
- [ ] Advanced filtering and search
- [ ] Recurring transaction templates
- [ ] Financial insights and recommendations

### Version 1.2

- [ ] Multi-currency support
- [ ] Bank account integration
- [ ] Investment tracking enhancements
- [ ] Mobile app (React Native)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Design Inspiration**: Modern fintech applications
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## Contact

**Swarna Lekha Kanakaraj**
Project Link:

Portfolio:

---

**Built with Next.js 14 | TypeScript | Tailwind CSS**
