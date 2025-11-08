// src/app/dashboard/page.tsx

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<h1 className="text-4xl font-bold">Welcome to your Dashboard!</h1>
			<p className="mt-4">You are successfully logged in.</p>
			{session.user && (
				<p className="mt-2 text-gray-600">Logged in as: {session.user.email}</p>
			)}
		</main>
	);
}
