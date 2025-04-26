import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function getShoppingLists(userId: string) {
  const client = await clientPromise;
  
  return client
    .db()
    .collection("shopping_lists")
    .find({
      $or: [
        { userId }, // Owner
        { sharedWith: userId } // Shared with user
      ]
    })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createShoppingList(userId: string, title: string, description = "") {
  const client = await clientPromise;
  
  const newList = {
    userId,
    title,
    description,
    createdAt: new Date(),
    items: [],
    sharedWith: [], // New: empty array by default
  };

  const result = await client
    .db()
    .collection("shopping_lists")
    .insertOne(newList);

  return result.insertedId;
}

export async function getShoppingListById(listId: string) {
  const client = await clientPromise;
  
  return client
    .db()
    .collection("shopping_lists")
    .findOne({ _id: new ObjectId(listId) });
}
