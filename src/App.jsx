import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
function App() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to Shadcn UI</h1>
      <Button 
        onClick={() => alert("Hello")} 
        variant="default"
        className="mt-4"
      >
        Click me
      </Button>
      {/* <Badge>Badge</Badge> */}
      
    </div>
  );
}

export default App;
