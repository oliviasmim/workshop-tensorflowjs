import { ShoppingBag, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">SmartShop</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Recommendations</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground hidden sm:inline">
            Products personalized for you
          </span>
        </div>
      </div>
    </header>
  );
};