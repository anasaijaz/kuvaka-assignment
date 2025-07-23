# Kuvaka Assignment

A modern web application built with Next.js, featuring Material 3 Expressive design, state management with Zustand, data fetching with SWR, and beautiful toast notifications.

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with Material 3 Expressive theme
- **UI Components**: shadcn/ui components stored in `components/ui/`
- **State Management**: Zustand with persistence
- **Data Fetching**: SWR with Axios
- **Notifications**: React Hot Toast with custom styling
- **Type Safety**: JavaScript with JSDoc (can be upgraded to TypeScript)

## 🎨 Design System

The project implements Material 3 Expressive design with:

- **Custom color palette** with light/dark theme support
- **Elevated cards** with proper shadows and border radius
- **Smooth animations** and transitions
- **Responsive design** patterns
- **Accessibility** considerations

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles with Material 3 colors
│   ├── layout.js            # Root layout with providers
│   ├── page.js             # Home page with feature showcase
│   └── providers.js        # SWR and Toast providers
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── fetcher.js          # Axios instance and SWR fetcher
│   ├── store.js            # Zustand stores
│   ├── helpers.js          # Utility functions
│   ├── hooks.js            # Custom SWR hooks
│   └── utils.js            # Utility functions
└── tailwind.config.js      # Extended with Material 3 theme
```

## 🛠️ Features

### State Management (Zustand)

- **Persistent store** with localStorage
- **Multiple stores** for different concerns
- **DevTools integration** for debugging
- **TypeScript-ready** store structure

### Data Fetching (SWR + Axios)

- **Custom hooks** for different HTTP methods
- **Error handling** with toast notifications
- **Loading states** and caching
- **Request/Response interceptors**
- **Pagination support**
- **Infinite loading** capabilities

### Toast Notifications

- **Material 3 styled** notifications
- **Multiple types**: success, error, loading, promise
- **Custom positioning** and animations
- **Promise-based** notifications
- **Auto-dismiss** functionality

### UI Components

- **shadcn/ui components** with Material 3 styling
- **Custom utility classes** for common patterns
- **Responsive design** components
- **Accessibility features** built-in
- **Animation-ready** components

## 🎯 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding New Colors

Update the CSS variables in `app/globals.css` and extend the Tailwind config in `tailwind.config.js`.

### Adding New Components

Use the shadcn/ui CLI to add components:

```bash
npx shadcn@latest add [component-name]
```

### State Management

Create new stores in `lib/store.js` or create separate store files for different features.

### API Integration

Use the custom hooks in `lib/hooks.js` for different types of API calls:

```javascript
import { useGet, usePost } from "@/lib/hooks";

// GET request
const { data, error, isLoading } = useGet("/api/users");

// POST request
const { execute, isMutating } = usePost("/api/users");
```

## 🔧 Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first** approach
- **Flexible grid** layouts
- **Adaptive components**
- **Touch-friendly** interactions

## 🌟 Material 3 Features

- **Dynamic color** system
- **Elevated surfaces** with proper shadows
- **State layers** for interactions
- **Motion and animations**
- **Typography** scale
- **Shape and layout** principles

## 🚀 Deployment

The project is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
