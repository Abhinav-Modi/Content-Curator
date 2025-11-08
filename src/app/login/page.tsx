import LoginForm from "./components/LoginForm";

export default function LoginPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<h1 className="text-3xl font-bold mb-8">Login</h1>
			<LoginForm />
		</main>
	);
}
