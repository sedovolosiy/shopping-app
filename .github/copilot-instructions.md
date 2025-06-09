# GitHub Copilot Instructions for Shopping Optimizer

## Project Overview

**Shopping Optimizer** - это прогрессивное веб-приложение (PWA) для оптимизации маршрутов в магазинах на основе AI-анализа списков покупок.

### Core Technologies

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS + shadcn/ui components
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **AI Integration**: Google Gemini API
- **Animations**: Framer Motion
- **State Management**: React Context API + local state

---

## Architecture Patterns

### 1. Device-Responsive Architecture

The application uses sophisticated device detection with three main rendering modes:

```typescript
// Device Types
type DeviceType = "mobile" | "tablet" | "desktop";
type OrientationType = "portrait" | "landscape";

// Usage in components
const { deviceType, isMobile, isTablet, isDesktop } = useDevice();
```

**Responsive Breakpoints:**

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Intermediate: `1024px - 1280px`
- Desktop: `> 1280px`

### 2. Component Naming Conventions

Follow these patterns when creating components:

```typescript
// Device-specific components
components/mobile-{feature}.tsx     // Mobile-only
components/tablet-{feature}.tsx     // Tablet-only
components/desktop-{feature}.tsx    // Desktop-only

// Shared components
components/{feature}.tsx            // Cross-platform
components/ui/{component}.tsx       // UI library components

// Business logic components
components/{business-domain}.tsx    // shopping-list-form.tsx
```

### 3. CSS Architecture

The project uses layered CSS approach:

```css
/* Global styles with CSS variables */
app/globals.css

/* Device-specific styles */
app/mobile-styles.css       /* Mobile optimizations */
app/tablet-styles.css       /* Tablet layouts */
app/intermediate-styles.css /* Transition styles */
app/desktop-styles.css      /* Desktop enhancements */
```

---

## Coding Standards

### 1. TypeScript Patterns

```typescript
// Always use proper TypeScript interfaces
interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  categoryOrder: number;
  purchased: boolean;
  originalText: string;
  language?: string;
  listId?: string;
}

// Use branded types for IDs
type ItemId = string & { __brand: "ItemId" };
type ListId = string & { __brand: "ListId" };

// Prefer const assertions for immutable data
const STORE_TYPES = ["lidl", "biedronka", "aldi"] as const;
type StoreType = (typeof STORE_TYPES)[number];
```

### 2. React Component Patterns

```typescript
// Use React.FC with proper props interface
interface ComponentProps {
  data: ShoppingItem[];
  onUpdate: (item: ShoppingItem) => void;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({ data, onUpdate, className }) => {
  // Use React.memo for performance optimization
  return React.memo(() => (
    <div className={cn("base-styles", className)}>
      {/* Component content */}
    </div>
  ));
};

// Always export with proper display name
Component.displayName = "ComponentName";
export { Component };
```

### 3. API Route Patterns

```typescript
// app/api/{resource}/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schema
const RequestSchema = z.object({
  items: z.array(z.string()),
  storeType: z.enum(["lidl", "biedronka", "aldi"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);

    // Business logic here

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
```

---

## Business Logic Guidelines

### 1. AI Service Integration

```typescript
// lib/services/aiService.ts patterns
import { GoogleGenerativeAI } from "@google/generative-ai";

class AIService {
  private genAI: GoogleGenerativeAI;

  async processShoppingList(
    input: string,
    language: string = "auto"
  ): Promise<ShoppingItem[]> {
    // Always include error handling
    try {
      const result = await this.genAI.generateContent(prompt);
      return this.parseAIResponse(result);
    } catch (error) {
      // Fallback to local categorization
      return this.fallbackCategorization(input);
    }
  }
}
```

### 2. Store Categorization System

```typescript
// lib/categorization/ patterns
interface CategoryDefinition {
  name: string;
  order: number;
  keywords: string[];
  icon: string;
}

interface StoreLayoutConfig {
  name: string;
  displayName: string;
  categories: CategoryDefinition[];
}

// Always support multiple stores
const STORE_CONFIGS: Record<StoreType, StoreLayoutConfig> = {
  lidl: {
    /* config */
  },
  biedronka: {
    /* config */
  },
  aldi: {
    /* config */
  },
};
```

### 3. Route Optimization

```typescript
// lib/store-data.ts patterns
export function optimizeShoppingRoute(
  items: ShoppingItem[],
  storeType: StoreType
): ShoppingItem[] {
  const storeConfig = STORE_CONFIGS[storeType];

  return items
    .sort((a, b) => a.categoryOrder - b.categoryOrder)
    .map((item, index) => ({ ...item, routePosition: index }));
}
```

---

## UI/UX Patterns

### 1. Responsive Component Structure

```typescript
// Device-aware rendering
const ResponsiveComponent: React.FC<Props> = (props) => {
  const { deviceType } = useDevice();

  if (deviceType === "mobile") {
    return <MobileView {...props} />;
  }

  if (deviceType === "tablet") {
    return <TabletView {...props} />;
  }

  return <DesktopView {...props} />;
};
```

### 2. Animation Patterns

```typescript
// Use Framer Motion consistently
import { motion, AnimatePresence } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 }
}

// Apply to lists and state changes
<AnimatePresence>
  {items.map(item => (
    <motion.div key={item.id} {...fadeIn}>
      {/* Content */}
    </motion.div>
  ))}
</AnimatePresence>
```

### 3. Form Handling

```typescript
// Use react-hook-form + zod validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  shoppingList: z.string().min(1, "Список не может быть пустым"),
  storeType: z.enum(["lidl", "biedronka", "aldi"]),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    shoppingList: "",
    storeType: "lidl",
  },
});
```

---

## Performance Guidelines

### 1. Component Optimization

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo<Props>(
  ({ data }) => {
    // Heavy computation or rendering
  },
  (prevProps, nextProps) => {
    // Custom comparison if needed
    return prevProps.data.length === nextProps.data.length;
  }
);

// Use useMemo for expensive calculations
const optimizedRoute = useMemo(
  () => optimizeShoppingRoute(items, storeType),
  [items, storeType]
);

// Use useCallback for event handlers
const handleItemToggle = useCallback((itemId: string) => {
  setItems((prev) =>
    prev.map((item) =>
      item.id === itemId ? { ...item, purchased: !item.purchased } : item
    )
  );
}, []);
```

### 2. Data Fetching

```typescript
// Use SWR-like pattern for API calls
const useShoppingLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch("/api/shopping-list");
        const data = await response.json();
        setLists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  return { lists, loading, error, refetch: fetchLists };
};
```

### 3. Bundle Optimization

```typescript
// Use dynamic imports for heavy features
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false,
});

// Lazy load AI features
const useAI = () => {
  const [aiService, setAiService] = useState<AIService | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USING_AI === "true") {
      import("../lib/services/aiService").then(({ AIService }) => {
        setAiService(new AIService());
      });
    }
  }, []);

  return aiService;
};
```

---

## Testing Patterns

### 1. Component Testing

```typescript
// Use React Testing Library
import { render, screen, fireEvent } from "@testing-library/react";
import { DeviceProvider } from "../components/device-detector";

const renderWithProviders = (component: React.ReactElement) => {
  return render(<DeviceProvider>{component}</DeviceProvider>);
};

test("should toggle item purchase status", () => {
  renderWithProviders(<ShoppingListItem item={mockItem} />);

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
});
```

### 2. API Testing

```typescript
// Test API routes
import { createMocks } from "node-mocks-http";
import handler from "../app/api/shopping-list/route";

test("POST /api/shopping-list processes items correctly", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: {
      items: ["молоко", "хлеб", "масло"],
      storeType: "lidl",
    },
  });

  await handler(req, res);

  expect(res._getStatusCode()).toBe(200);
  const data = JSON.parse(res._getData());
  expect(data.items).toHaveLength(3);
});
```

---

## Security & Error Handling

### 1. Input Validation

```typescript
// Always validate API inputs
import { z } from "zod";

const ShoppingListSchema = z.object({
  items: z.array(z.string().max(100)),
  storeType: z.enum(["lidl", "biedronka", "aldi"]),
  userId: z.string().uuid().optional(),
});

// Sanitize user inputs
import DOMPurify from "dompurify";

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};
```

### 2. Error Boundaries

```typescript
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

---

## Accessibility Guidelines

### 1. Semantic HTML

```typescript
// Use proper semantic elements
<main role="main">
  <section aria-labelledby="shopping-list-heading">
    <h2 id="shopping-list-heading">Список покупок</h2>
    <ul role="list">
      {items.map((item) => (
        <li key={item.id} role="listitem">
          <label htmlFor={`item-${item.id}`}>
            <input
              id={`item-${item.id}`}
              type="checkbox"
              checked={item.purchased}
              aria-describedby={`item-${item.id}-category`}
            />
            {item.name}
          </label>
          <span id={`item-${item.id}-category`} className="sr-only">
            Категория: {item.category}
          </span>
        </li>
      ))}
    </ul>
  </section>
</main>
```

### 2. Keyboard Navigation

```typescript
// Implement proper keyboard support
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      toggleItem(itemId);
      break;
    case "ArrowDown":
      event.preventDefault();
      focusNextItem();
      break;
    case "ArrowUp":
      event.preventDefault();
      focusPreviousItem();
      break;
  }
};
```

---

## PWA Features

### 1. Service Worker

```typescript
// app/sw-register.ts patterns
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("SW registered:", registration);
    })
    .catch((error) => {
      console.log("SW registration failed:", error);
    });
}
```

### 2. Offline Support

```typescript
// Cache shopping lists for offline access
const useOfflineStorage = () => {
  const saveOffline = useCallback((data: ShoppingList[]) => {
    try {
      localStorage.setItem("offline-shopping-lists", JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save offline data:", error);
    }
  }, []);

  const loadOffline = useCallback((): ShoppingList[] => {
    try {
      const stored = localStorage.getItem("offline-shopping-lists");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Failed to load offline data:", error);
      return [];
    }
  }, []);

  return { saveOffline, loadOffline };
};
```

---

## Common Pitfalls to Avoid

### ❌ Don't Do This

```typescript
// Don't use any or unknown types
const processData = (data: any) => {
  /* ... */
};

// Don't mutate state directly
items.push(newItem);
setItems(items);

// Don't forget error handling in async functions
const fetchData = async () => {
  const response = await fetch("/api/data"); // Can throw!
  return response.json();
};

// Don't hardcode device detection
const isMobile = window.innerWidth < 768;
```

### ✅ Do This Instead

```typescript
// Use proper types
const processData = (data: ShoppingItem[]) => {
  /* ... */
};

// Use immutable updates
setItems((prev) => [...prev, newItem]);

// Always handle errors
const fetchData = async () => {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("Fetch failed");
    return response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};

// Use device context
const { isMobile } = useDevice();
```

---

## File Organization

```
app/
├── layout.tsx                    # Root layout with device providers
├── page.tsx                      # Home page
├── MainClientContent.tsx         # Main client content wrapper
├── service-worker-register.tsx   # PWA service worker registration
├── sw-register.ts               # Service worker utilities
├── globals.css                  # Global styles with CSS variables
├── mobile-styles.css            # Mobile-specific styles
├── mobile-scroll-fixes.css      # Mobile scroll optimizations
├── tablet-styles.css            # Tablet-specific styles
├── intermediate-styles.css      # Transition styles (1024px-1280px)
├── desktop-styles.css           # Desktop-specific styles
└── api/                         # API routes
    ├── shopping-list/           # Shopping list CRUD
    │   ├── route.ts            # Main shopping list endpoint
    │   ├── items/              # Item-specific operations
    │   ├── services/           # Business logic services
    │   │   ├── aiService.ts    # Google Gemini AI integration
    │   │   ├── aiPrompt.ts     # AI prompts and templates
    │   │   ├── userService.ts  # User management
    │   │   └── shoppingListService.ts # List operations
    │   ├── schemas/            # Validation schemas
    │   │   └── validation.ts   # Zod validation schemas
    │   └── utils/              # Utility functions
    │       ├── jsonParser.ts   # JSON parsing utilities
    │       └── itemCategorizer.ts # Item categorization
    ├── stores/                 # Store management
    ├── user/                   # User authentication
    ├── user-preferences/       # User settings
    └── status/                 # Health checks

components/
├── device-detector.tsx          # Device detection provider
├── mobile-bottom-navigation.tsx # Mobile tab navigation
├── mobile-drawer.tsx           # Mobile drawer/modal
├── tablet-layout.tsx           # Tablet container layout
├── tablet-navigation.tsx       # Tablet navigation
├── desktop-layout.tsx          # Desktop sidebar layout
├── desktop-main-content.tsx    # Desktop content area
├── orientation-handler.tsx     # Device orientation detection
├── shopping-list-form.tsx      # List creation form
├── optimized-list-view.tsx     # Route-optimized list display
├── saved-lists-view.tsx        # Saved lists management
├── category-group.tsx          # Category grouping component
├── list-item-entry.tsx         # Individual shopping item
├── user-login.tsx              # Authentication component
├── ai-status.tsx               # AI processing indicator
├── error-display.tsx           # Error handling component
├── full-page-loader.tsx        # Loading states
├── install-prompt.tsx          # PWA installation prompt
├── theme-provider.tsx          # Theme management
├── virtual-scroll.tsx          # Performance optimization
└── ui/                         # shadcn/ui components
    ├── alert.tsx              # Alert notifications
    ├── alert-dialog.tsx       # Modal dialogs
    ├── aspect-ratio.tsx       # Aspect ratio utility
    ├── avatar.tsx             # User avatars
    ├── badge.tsx              # Status badges
    ├── button.tsx             # Button component
    ├── card.tsx               # Card layouts
    ├── checkbox.tsx           # Checkbox inputs
    ├── command.tsx            # Command palette
    ├── dialog.tsx             # Dialog modals
    ├── drawer.tsx             # Drawer component
    ├── dropdown-menu.tsx      # Dropdown menus
    ├── form.tsx               # Form components
    ├── input.tsx              # Text inputs
    ├── input-otp.tsx          # OTP input
    ├── label.tsx              # Form labels
    ├── popover.tsx            # Popover component
    ├── progress.tsx           # Progress bars
    ├── radio-group.tsx        # Radio button groups
    ├── scroll-area.tsx        # Custom scroll areas
    ├── select.tsx             # Select dropdowns
    ├── separator.tsx          # Visual separators
    ├── sheet.tsx              # Sheet component
    ├── skeleton.tsx           # Loading skeletons
    ├── switch.tsx             # Toggle switches
    ├── table.tsx              # Data tables
    ├── textarea.tsx           # Text areas
    ├── toast.tsx              # Toast notifications
    ├── toaster.tsx            # Toast container
    ├── toggle.tsx             # Toggle buttons
    ├── toggle-group.tsx       # Toggle groups
    └── tooltip.tsx            # Tooltips

hooks/
└── use-toast.ts                # Toast notification hook

lib/
├── types.ts                    # TypeScript interfaces
├── utils.ts                    # General utility functions
├── db.ts                       # Database connection (Prisma)
├── api-client.ts               # API client utilities
├── error-handling.ts           # Error handling utilities
├── env-config.ts               # Environment configuration
├── store-data.ts               # Store configuration data
└── categorization/             # Advanced categorization system
    ├── index.ts               # Main categorization API
    ├── types.ts               # Categorization types
    ├── storeConfigs.ts        # Store-specific configurations
    ├── core/                  # Core categorization logic
    │   ├── categoryMatcher.ts # Category matching algorithms
    │   ├── fuzzyMatcher.ts    # Fuzzy string matching
    │   ├── languageDetector.ts # Language detection
    │   └── textNormalizer.ts  # Text normalization
    ├── patterns/              # Categorization patterns
    │   ├── basePatterns.ts    # Base category patterns
    │   └── storePatterns.ts   # Store-specific patterns
    ├── utils/                 # Categorization utilities
    │   ├── cache.ts           # Caching mechanisms
    │   ├── categoryOrder.ts   # Category ordering
    │   ├── learning.ts        # Machine learning utilities
    │   └── metrics.ts         # Performance metrics
    └── tests/                 # Test files
        ├── categorizer.test.ts # Categorization tests
        └── testData.ts        # Test data sets

prisma/
├── schema.prisma              # Database schema
├── dev.db                     # SQLite development database
└── migrations/                # Database migrations

public/
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker
├── icons/                     # App icons for PWA
└── store-logos/               # Store brand logos

scripts/
└── seed-stores.js             # Database seeding script

# Root level files
├── layout.tsx                 # Legacy layout (may conflict with app/layout.tsx)
├── middleware.ts              # Next.js middleware
├── components.json            # shadcn/ui configuration
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
├── postcss.config.js          # PostCSS configuration
├── .env.local                 # Local environment variables
├── .env.example               # Environment variables template
├── .env.production            # Production environment variables
├── .eslintrc.json             # ESLint configuration
└── .gitignore                 # Git ignore rules
```

---

## Environment Configuration

### Required Environment Variables

```bash
# .env.local
DATABASE_URL="file:./prisma/dev.db"
GOOGLE_GEMINI_API_KEY="your_api_key_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_USING_AI="true"

# Production additional variables
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="https://your-domain.com"
```

### Feature Flags

```typescript
// Use environment variables for feature toggles
const Features = {
  AI_ENABLED: process.env.NEXT_PUBLIC_USING_AI === "true",
  ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS === "true",
  OFFLINE_MODE: process.env.NEXT_PUBLIC_OFFLINE_MODE === "true",
};

// Use in components
if (Features.AI_ENABLED) {
  // AI-powered categorization
} else {
  // Fallback to local categorization
}
```

---

## Deployment Considerations

### 1. Build Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    formats: ["image/webp", "image/avif"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
```

### 2. Database Migration

```bash
# Always run these in production deployment
npx prisma generate
npx prisma migrate deploy
```

---

## Multi-language Support

### Text Patterns

```typescript
// Support for multiple languages in lists
const LANGUAGE_PATTERNS = {
  ru: /[а-яё]/i,
  en: /[a-z]/i,
  uk: /[а-яіїє]/i,
  pl: /[ąćęłńóśźż]/i,
};

const detectLanguage = (text: string): string => {
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(text)) return lang;
  }
  return "en"; // default
};
```

---

**Remember**: This is a responsive, multi-device PWA with AI integration. Always consider device type, performance, accessibility, and offline capabilities when writing code. Use the established patterns and maintain consistency with the existing codebase.
