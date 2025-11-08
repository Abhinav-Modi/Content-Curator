import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Link2 } from "lucide-react"; 

export interface CardData {
	id: string;
	url: string;
	title: string;
	description: string | null;
	image: string | null;
	createdAt: any; // Firestore timestamp replace bro
}

export function ContentCard({ url, title, description, image }: CardData) {

	const domain = new URL(url).hostname;

	return (
		<Card className="flex flex-col overflow-hidden h-full">
			{image ? (
				<img src={image} alt={title} className="h-48 w-full object-cover" />
			) : (
				<div className="h-48 w-full bg-secondary flex items-center justify-center text-muted-foreground">
					<Link2 className="h-16 w-16" />
				</div>
			)}
			<CardHeader>
				<CardTitle className="truncate">{title}</CardTitle>
				<CardDescription className="line-clamp-2">
					{description || "No description available"}
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-auto pt-0">
				{/* 5. Show the original URL's domain */}
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-blue-500 hover:underline truncate"
				>
					{domain}
				</a>
			</CardContent>
		</Card>
	);
}
