// ... in src/app/dashboard/components/SubmitForm.tsx
"use client";
import { submitUrl } from "@/app/actions/submitUrl";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SubmitForm() {
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null); // Clear old messages
		setSuccess(null);

		const formData = new FormData(event.currentTarget);
		const result = await submitUrl(formData);

		if (result.status === "error") {
			setError(result.message);
		} else {
			setSuccess(result.message);
			setUrl("");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col md:flex-row gap-4 w-full max-w-xl mt-8"
		>
			{/* ... rest of the form ... */}
			<Button type="submit">Save Link</Button>
			{/* 4. Display the messages */}
			{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
			{success && <p className="text-green-500 text-sm mt-2">{success}</p>}
		</form>
	);
}
