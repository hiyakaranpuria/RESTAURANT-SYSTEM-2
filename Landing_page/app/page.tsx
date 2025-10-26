"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check,
  QrCode,
  Users,
  BarChart3,
  Zap,
  TrendingUp,
  AlertCircle,
  Clock,
  FileText,
  Smartphone,
  Bell,
  Lock,
  Utensils,
  Coffee,
  Wine,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm shadow-lg">
                QR
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                MenuFlow
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#faq"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:3000/restaurant/login")
                }
              >
                Log in
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:3000/restaurant/signup")
                }
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-40 lg:py-48">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-30" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  No app download required
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
                  Transform Your Restaurant with QR Ordering
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
                  Contactless ordering, real-time tracking, and seamless table
                  service. Reduce wait times by 40% and boost customer
                  satisfaction instantly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold shadow-lg hover:shadow-xl transition-all group"
                  onClick={() =>
                    (window.location.href =
                      "http://localhost:3000/restaurant/signup")
                  }
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full font-semibold border-2 bg-transparent"
                  onClick={() =>
                    (window.location.href =
                      "http://localhost:3000/restaurant/login")
                  }
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">
                    Works on any device
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">
                    No setup required
                  </span>
                </div>
              </div>
            </div>

            <div className="relative h-96 sm:h-[500px] lg:h-[550px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl border border-primary/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20">
                      <Smartphone className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Customer scanning QR code
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 sm:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Say Goodbye to Traditional Menus
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Modern restaurants need modern solutions. Here's what's holding
              you back.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Paper Menus Are Outdated",
                desc: "Unhygienic, difficult to update, and bad for the environment",
              },
              {
                icon: Clock,
                title: "Waiting Slows Service",
                desc: "Customers wait for waiters, orders get delayed, tables turn slower",
              },
              {
                icon: AlertCircle,
                title: "Manual Errors Happen",
                desc: "Miscommunication leads to wrong orders and unhappy customers",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="p-8 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-6">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 sm:py-32 bg-primary/3 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Three simple steps to transform your restaurant operations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Scan QR Code",
                desc: "Customer scans table QR code with their phone",
                icon: QrCode,
              },
              {
                num: "2",
                title: "Browse & Order",
                desc: "View menu, add items to cart, place order instantly",
                icon: Users,
              },
              {
                num: "3",
                title: "Track Status",
                desc: "Real-time order progress from placed to ready",
                icon: BarChart3,
              },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    {step.num}
                  </div>
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-primary/20 text-3xl font-light">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features by User Type */}
      <section id="features" className="py-20 sm:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Powerful Features for Everyone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Designed for customers, staff, and admins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Customers */}
            <Card className="p-8 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                For Customers
              </h3>
              <ul className="space-y-4">
                {[
                  "Browse menu by categories",
                  "Search items instantly",
                  "Add custom notes to orders",
                  "No app download needed",
                  "Track order in real-time",
                  "Call waiter with one tap",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Staff - Highlighted */}
            <Card className="p-8 border-2 border-primary ring-1 ring-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 mb-6">
                  <Bell className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  For Staff
                </h3>
                <ul className="space-y-4">
                  {[
                    "Live order queue dashboard",
                    "Kanban-style order management",
                    "Sound notifications for new orders",
                    "Search and filter by table/status",
                    "One-click status updates",
                    "Reduce order processing time",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Admins */}
            <Card className="p-8 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 mb-6">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                For Admins
              </h3>
              <ul className="space-y-4">
                {[
                  "Complete menu management",
                  "Category organization",
                  "Toggle item availability",
                  "Table management",
                  "Generate & print QR codes",
                  "Analytics & insights",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-32 bg-primary/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Why Restaurants Love MenuFlow
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                stat: "40%",
                label: "Faster Service",
                desc: "Reduce order time significantly",
              },
              {
                icon: TrendingUp,
                stat: "35%",
                label: "More Revenue",
                desc: "Boost table turnover",
              },
              {
                icon: Check,
                stat: "99%",
                label: "Fewer Errors",
                desc: "Eliminate miscommunication",
              },
              {
                icon: BarChart3,
                stat: "Real-time",
                label: "Better Insights",
                desc: "Track popular items",
              },
            ].map((benefit, i) => (
              <Card
                key={i}
                className="p-8 text-center border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4 mx-auto">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {benefit.stat}
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  {benefit.label}
                </h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-32 bg-primary/3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Perfect for Any Restaurant
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Utensils,
                title: "Fast Casual",
                desc: "Quick service restaurants",
              },
              {
                icon: Wine,
                title: "Fine Dining",
                desc: "Upscale table service",
              },
              {
                icon: Coffee,
                title: "Cafés & Bars",
                desc: "Coffee shops and lounges",
              },
            ].map((useCase, i) => (
              <Card
                key={i}
                className="p-8 border border-border/50 hover:border-primary/50 text-center hover:shadow-lg transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4 mx-auto">
                  <useCase.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground">{useCase.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-32 bg-primary/3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Trusted by 100+ Restaurants
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                restaurant: "The Urban Bistro",
                location: "San Francisco, CA",
                quote:
                  "MenuFlow reduced our order errors by 95% and improved customer satisfaction significantly.",
              },
              {
                name: "Marco Rossi",
                restaurant: "Bella Italia",
                location: "New York, NY",
                quote:
                  "Our table turnover increased by 40%. This system is a game-changer for our business.",
              },
              {
                name: "James Wilson",
                restaurant: "The Coffee House",
                location: "Austin, TX",
                quote:
                  "Simple to use, reliable, and our customers love the seamless ordering experience.",
              },
            ].map((testimonial, i) => (
              <Card
                key={i}
                className="p-8 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-primary text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-foreground mb-6 italic font-medium">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-bold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {testimonial.restaurant}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-32 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "Do customers need to download an app?",
                a: "No! MenuFlow works directly in the browser. Customers just scan the QR code and start ordering.",
              },
              {
                q: "How do I generate QR codes?",
                a: "Our built-in QR generator creates unique codes for each table. You can print them or display them digitally.",
              },
              {
                q: "Can I update the menu in real-time?",
                a: "Yes! Changes are instant. Mark items as unavailable, update prices, or add new items anytime.",
              },
              {
                q: "What devices are supported?",
                a: "All smartphones and tablets with a modern browser. Works on iOS, Android, and any device with a camera.",
              },
              {
                q: "Is training required?",
                a: "Minimal! The interface is intuitive. We provide documentation and video tutorials for your team.",
              },
              {
                q: "How is my data secured?",
                a: "We use industry-standard encryption, JWT authentication, and role-based access control to keep your data safe.",
              },
            ].map((faq, i) => (
              <Card
                key={i}
                className="p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {faq.q}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-32 bg-primary/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Ready to Modernize Your Restaurant?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
            Join restaurants already using MenuFlow to streamline operations and
            delight customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold shadow-lg hover:shadow-xl transition-all group"
              onClick={() =>
                (window.location.href =
                  "http://localhost:3000/restaurant/signup")
              }
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full font-semibold border-2 bg-transparent"
              onClick={() =>
                (window.location.href =
                  "http://localhost:3000/restaurant/login")
              }
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Demo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Quick Start
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    API Docs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              © 2025 MenuFlow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
