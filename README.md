# Star Wars Fleet Management Dashboard

An interactive dashboard for exploring and comparing starships from the Star Wars universe. Built with Next.js, TypeScript, and modern React patterns.

🚀 **[Live Demo](https://sw-dashboard.netlify.app/)**

## ✨ Features

- 🔍 **Real-time Search**: Search starships with debounced input
- 📊 **Advanced Filtering**: Filter by hyperdrive rating and crew size
- ♾️ **Infinite Scrolling**: Smooth pagination with automatic loading
- 🔄 **Comparison System**: Compare up to 3 starships side-by-side
- 🔗 **URL State Sync**: Shareable URLs with current filters and selections
- 📱 **Responsive Design**: Fully mobile-friendly interface
- 🏃‍♂️ **Performance Optimized**: Efficient data loading and caching

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.0 (App Router)
- **UI Components**: shadcn/ui + TailwindCSS
- **State Management**: 
  - Jotai for global state
  - URL state for filters
- **Data Fetching**: 
  - @tanstack/react-query for caching
  - ts-rest for type-safe API calls
- **Table**: @tanstack/react-table
- **API**: SWAPI (Star Wars API)

## 🚀 Getting Started

### Prerequisites

```bash
node -v # v18.x or higher required
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sanjaypinna/sw-dashboard.git
cd sw-dashboard
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
sw-dashboard/
├── app/                  # Next.js app router files
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── dashboard.tsx   # Main dashboard
│   ├── search-bar.tsx  # Search component
│   └── ...            # Other components
├── hooks/             # Custom React hooks
├── lib/              # Utilities and configurations
│   ├── api.ts       # API client
│   ├── contract.ts  # ts-rest contract
│   └── types.ts     # TypeScript types
└── public/         # Static assets
```

## 🎯 Features in Detail

### Search & Filtering
- **Search**: Real-time with 500ms debouncing
- **Hyperdrive Rating Filter**:
  - Less than 1.0
  - 1.0 to 2.0
  - Greater than 2.0
- **Crew Size Filter**:
  - 1-5 crew members
  - 6-50 crew members
  - 50+ crew members

### Starship Comparison
- Select up to 3 starships
- Detailed side-by-side comparison
- Persistent selection across page refreshes

### Performance Optimizations
- Infinite scrolling using `react-intersection-observer`
- Data caching with `react-query`
- Debounced search to minimize API calls
- Memoized filter operations

## 🔄 State Management

### URL State
```typescript
// Synced with URL parameters
/dashboard?search=falcon&hyperdrive=lt1&crew=6to50
```

### Global State (Jotai)
```typescript
// Selected starships persist across navigation
const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom)
```

## 📦 Building for Production

```bash
# Create production build
yarn build

# Start production server
yarn start
```

## 🎨 Customization

### Theme
The dashboard supports dark mode out of the box. Theme settings persist across sessions.

### API Configuration
The API client can be configured in `lib/api.ts`:
```typescript
export const starWarsClient = initQueryClient(starWarsContract, {
  baseUrl: "https://swapi.dev",
  // ...configuration
})
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SWAPI](https://swapi.dev/) for the Star Wars API
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Netlify](https://netlify.com) for hosting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📫 Contact

Project Link: [https://github.com/sanjaypinna/sw-dashboard](https://github.com/sanjaypinna/sw-dashboard)