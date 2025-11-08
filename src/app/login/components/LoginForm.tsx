"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			const result = await signIn("credentials", {
				redirect: false,
				email: email,
				password: password,
			});
			if (result?.error) {
				setError("Invalid email or password");
			} else if (result?.ok) {
				window.location.href = "/dashboard";
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("An unexpected error occurred. Please try again.");
		}
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-sm"
		>
			<div className="grid w-full items-center gap-1.5">
				<Label htmlFor="email">Email</Label>
				<Input
					type="email"
					id="email"
					placeholder="Enter your email id"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				></Input>
			</div>
			<div className="grid w-full items-center gap-1.5">
				<Label htmlFor="password">Password</Label>
				<Input
					type="password"
					id="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				></Input>
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}

			<Button type="submit">Log In / Sign Up</Button>
		</form>
	);
}
