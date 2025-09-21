// Study Mates Landing Page

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-inter font-bold text-foreground">
          Welcome to <span className="text-primary">Study Mates</span>
        </h1>
        <p className="text-xl text-muted-foreground font-sans leading-relaxed">
          Connect, collaborate, and succeed together. Join study groups, 
          schedule sessions, and enhance your learning with AI-powered assistance.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-inter font-medium transition-colors">
            Get Started
          </button>
          <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-inter font-medium transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
