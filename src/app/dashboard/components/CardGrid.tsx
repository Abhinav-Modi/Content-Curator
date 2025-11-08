import { auth } from "@/lib/auth"; 
import { db } from "@/lib/firebase";
import {
	collection,
	getDocs,
	query,
	orderBy,
	Timestamp,
} from "firebase/firestore"; 
import { ContentCard, type CardData } from "./ContentCard"; 

export default async function CardGrid() {
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) {
		return <p>You must be logged in to see your cards.</p>;
	}

	const cardsCollectionRef = collection(db, "users", userId, "cards");
	const q = query(cardsCollectionRef, orderBy("createdAt", "desc")); 
	const querySnapshot = await getDocs(q);

	const cards: CardData[] = querySnapshot.docs.map((doc) => ({
		id: doc.id,
		...(doc.data() as Omit<CardData, "id">),
	}));

	if (cards.length === 0) {
		return (
			<div className="mt-16 text-center text-muted-foreground">
				<h3 className="text-xl font-semibold">No links saved... yet!</h3>
				<p>Paste a URL above to save your first link.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-12">
			{cards.map((card) => (
				<ContentCard key={card.id} {...card} />
			))}
		</div>
	);
}
