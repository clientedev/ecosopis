import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Check, Package, Sparkles, Calendar } from "lucide-react";

export default function BoxSubscription() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-primary text-primary-foreground py-24 text-center">
        <div className="container-width">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">The Eco Box</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            A monthly curation of our finest scientific formulas, delivered to your doorstep.
            Experience luxury skincare at a fraction of the cost.
          </p>
        </div>
      </div>

      <div className="container-width py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
            <h3 className="font-display text-2xl font-bold mb-2">Starter</h3>
            <div className="text-3xl font-bold text-primary mb-6">R$ 89<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> 2 Full-size products</li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Monthly newsletter</li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Free shipping</li>
            </ul>
            <Button className="w-full" variant="outline">Subscribe</Button>
          </div>

          {/* Card 2 - Featured */}
          <div className="bg-white p-8 rounded-2xl border-2 border-primary shadow-xl transform scale-105 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Essentials</h3>
            <div className="text-3xl font-bold text-primary mb-6">R$ 149<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> 4 Full-size products</li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Exclusive samples</li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Early access to launches</li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Free shipping</li>
            </ul>
            <Button className="w-full">Subscribe Now</Button>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
            <h3 className="font-display text-2xl font-bold mb-2">Complete</h3>
            <div className="text-3xl font-bold text-primary mb-6">R$ 229<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Full Routine (6 products)</li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Personalized consultation</li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> VIP Events access</li>
            </ul>
            <Button className="w-full" variant="outline">Subscribe</Button>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-lg mb-2">Free Delivery</h4>
            <p className="text-muted-foreground text-sm">We handle the shipping costs on all subscriptions.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-lg mb-2">Surprise Value</h4>
            <p className="text-muted-foreground text-sm">Box value is always at least double what you pay.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-lg mb-2">Flexible</h4>
            <p className="text-muted-foreground text-sm">Skip a month or cancel anytime with one click.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
