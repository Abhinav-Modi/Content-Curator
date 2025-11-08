'use server'
import {z} from "zod"
import { auth } from '@/lib/auth'; 
import { db } from '@/lib/firebase'; 
import { addDoc, collection, serverTimestamp} from 'firebase/firestore';
import * as cheerio from 'cheerio';

const UrlSchema = z.object({
  url: z.url({ message: "Please enter a valid URL." }),
});

export async function submitUrl(formData:FormData) {
    const session = await auth();
    const userId = session?.user?.id;
    if(!userId) return {status: 'error', message: 'You must be logged in.'};

    const data = {url: formData.get("url") as String};

    const validateURL = UrlSchema.safeParse(data);

    if(!validateURL.success){
        return {
            status: "error parsing url",
            message: validateURL.error.message
        }
    }

    const validatedUrl = validateURL.data.url;
    try {
    const response = await fetch(validatedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'No title found';
    const description = $('meta[property="og:description"]').attr('content') || 'No description found';
    const image = $('meta[property="og:image"]').attr('content') || null;
    await addDoc(collection(db, 'users', userId, 'cards'), {
      url: validatedUrl,
      title: title,
      description: description,
      image: image,
      createdAt: serverTimestamp(), 
    });

    return { status: 'success', message: 'Link saved!' };

  } catch (error) {
    console.error("Scraping failed:", error);
    return { status: 'error', message: 'Could not scrape or save the link. Please try a different URL.' };
  }
    
}
