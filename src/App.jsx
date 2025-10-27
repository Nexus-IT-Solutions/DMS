import OfficerLogin from "./pages/(auth)/OfficerLogin";

function App() {
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return (
    <div className="min-h-screen bg-gray-900">
      <OfficerLogin />
    </div>
  );
}

export default App;