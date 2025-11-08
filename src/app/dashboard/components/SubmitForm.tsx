"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitUrl } from "@/app/actions/submitUrl";

export default function SubmitForm() {
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const router = useRouter();
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null); // Clear old messages
		setSuccess(null);

		const formData = new FormData(event.currentTarget);
		const result = await submitUrl(formData); // Call the action

		// 3. Check the result from the Server Action
		if (result.status === "error") {
			setError(result.message);
		} else {
			setSuccess(result.message);
			setUrl(""); // Clear input on success
			router.refresh();
		}
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col md:flex-row gap-4 w-full max-w-xl mt-8"
		>
			<div className="grid w-full items-center gap-1.5">
				<Label htmlFor="url" className="sr-only">
					Paste URL
				</Label>
				<Input
					type="url"
					id="url"
					name="url"
					placeholder="https://your-link.com"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					required
				/>
			</div>
			<Button type="submit">Save Link</Button>
			{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
			{success && <p className="text-green-500 text-sm mt-2">{success}</p>}
		</form>
	);
}
