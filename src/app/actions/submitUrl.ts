'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
// 1. Import the query functions
import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import * as cheerio from 'cheerio';

const UrlSchema = z.object({
  url: z.url({ message: "Please enter a valid URL." }),
});

export async function submitUrl(formData: FormData) {
  
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { status: 'error', message: 'You must be logged in.' };
  }
  const data = { url: formData.get('url') as string };
  const validationResult = UrlSchema.safeParse(data);
  if (!validationResult.success) {
    return { 
      status: 'error', 
      message: validationResult.error.message 
    };
  }
  const validatedUrl = validationResult.data.url;

  try {
    const cardsCollectionRef = collection(db, "users", userId, "cards");
    const q = query(cardsCollectionRef, where("url", "==", validatedUrl));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { status: 'error', message: 'You have already saved this link.' };
    }
    
    const response = await fetch(validatedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'No title found';
    const description = $('meta[property="og:description"]').attr('content') || 'No description found';
    const image = $('meta[property="og:image"]').attr('content') || null;

    // 4d. Save the data to Firestore
    await addDoc(cardsCollectionRef, { 
      url: validatedUrl,
      title: title,
      description: description,
      image: image,
      createdAt: serverTimestamp(),
    });

    return { status: 'success', message: 'Link saved!' };

  } catch (error) {
    console.error("Action failed:", error);
    return { status: 'error', message: 'Could not save the link. The site may be blocking scrapers.' };
  }
}