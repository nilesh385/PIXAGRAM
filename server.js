//e.g server.js
import express from "express";
import cors from "cors";
import { Webhook } from "svix";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const app = express();
dotenv.config({ path: "./.env" });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    Credential: true,
  })
);

app.use(express.json());

app.post(
  "/api/webhooks",
  // This is a generic method to parse the contents of the payload.

  async (req, res) => {
    const SIGNING_SECRET = process.env.VITE_CLERK_WEBHOOK_SIGNING_SECRET;

    if (!SIGNING_SECRET) {
      throw new Error(
        "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
      );
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers and body
    const headers = req.headers;
    const payload = JSON.stringify(req.body);

    // Get Svix headers for verification
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return void res.status(400).json({
        success: false,
        message: "Error: Missing svix headers",
      });
    }
    let evt;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If verification fails, error out and return error code
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.log("Error: Could not verify webhook:", err.message);
      return void res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Do something with payload

    //creating user profile
    if (evt.type === "user.created") {
      // console.log(evt.data);
      const { error: createProfileError } = await supabase
        .from("users")
        .insert({
          user_id: evt.data.id,
          username: evt.data.username,
          fullname: evt.data.first_name + " " + evt.data.last_name,
          email: evt.data.email_addresses[0].email_address,
          image: evt.data.image_url,
          role: "user",
        });
      if (createProfileError) {
        console.log(
          "Error while creating the user profile:: ",
          createProfileError.message
        );
      } else console.log("Profile Created...");

      const emptyFile = new File([], "", { type: "" });
      // Construct the folder path
      const folderPath = `users/${evt.data.id}/`;

      // Create the folder in the 'images' bucket
      const { error: createFolderError } = await supabase.storage
        .from("images")
        .upload(folderPath + "placeholder.txt", emptyFile, {
          upsert: true,
        });
      if (createFolderError) {
        console.log(
          "Error while creating the folder:: ",
          createFolderError.message
        );
      } else {
        console.log("Folder Created...");
      }
    }
    // update the user profile
    else if (evt.type === "user.updated") {
      const { error: updateProfileError } = await supabase
        .from("users")
        .update({
          username: evt.data.username,
          fullname: evt.data.first_name + " " + evt.data.last_name,
          image: evt.data.image_url,
        })
        .eq("user_id", evt.data.id);
      if (updateProfileError)
        console.log(
          "Error while updating the profile:: ",
          updateProfileError.message
        );
      else console.log("Profile Updated Successfully...");
    }
    //deleting user profile
    else if (evt.type === "user.deleted") {
      const { error: deleteProfileError } = await supabase
        .from("users")
        .delete()
        .eq("user_id", evt.data.id);
      if (deleteProfileError)
        console.log(
          "Error while deleting the user profile:: ",
          deleteProfileError.message
        );
      else console.log("Profile deleted successfully...");
    }

    return void res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  }
);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port", 3000)
);
