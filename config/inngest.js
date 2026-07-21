import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },         // Arg 1: Config
  { event: 'clerk/user.created' },        // Arg 2: Trigger (แยกออกมา)
  async ({ event }) => {                  // Arg 3: Handler
    const { id, first_name, last_name, email_addresses, image_url } = event.data
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url
    }
    await connectDB()
    await User.create(userData)
  }
)

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },       // Arg 1: Config
  { event: 'clerk/user.updated' },        // Arg 2: Trigger (แยกออกมา)
  async ({ event }) => {                  // Arg 3: Handler
    const { id, first_name, last_name, email_addresses, image_url } = event.data
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url
    }
    await connectDB()
    await User.findByIdAndUpdate(id, userData)
  }
)

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },       // Arg 1: Config
  { event: 'clerk/user.deleted' },        // Arg 2: Trigger (แยกออกมา)
  async ({ event }) => {                  // Arg 3: Handler
    const { id } = event.data

    await connectDB()
    await User.findByIdAndDelete(id)
  }
)