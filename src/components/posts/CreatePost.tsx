import { Loader2, PlusIcon, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PostSchemaType, postSchema } from "@/types/types";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import userStore, { type UserState } from "@/store/userStore";

export default function CreatePost() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = userStore((state: UserState) => state.currentUser);

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImage(null);
    setImagePreview(null);
  };
  const handleCreatePost = async (values: PostSchemaType) => {
    if (!supabase) return toast.error("Database error...");
    if (!values.title) return toast.error("Title is required...");
    try {
      setLoading(true);
      let image_url = "";
      if (image) {
        const fileExt = image.name.split(".").pop();
        const filePath = `users/${
          user?.user_id
        }/${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase?.storage
          .from("images")
          .upload(filePath, image);

        if (uploadError) {
          toast.error("Upload Image Error: " + uploadError.message);
          return;
        }

        const { data: publicUrl } = supabase?.storage
          .from("images")
          .getPublicUrl(filePath);
        image_url = publicUrl.publicUrl;
      }
      const { error: postError } = await supabase.from("posts").insert({
        title: values.title,
        description: values?.description,
        image: image_url || null,
        user_id: user?.user_id!,
      });
      if (postError) {
        await supabase.storage.from("images").remove([image_url]);
        toast.error(postError.message);
        return;
      }
      setImage(null);
      setImagePreview(null);

      toast.success("Post created successfully");
      navigate("/myPosts");
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-max h-max">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="size-12 fixed bottom-20 right-20 rounded-full border-[1px]">
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
            <DialogDescription>
              Write a Title , desciption and add an image to create a post.
              Image is optional.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(handleCreatePost)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title..."
                        id="title"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Description..."
                        id="description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="file"
                          accept="image/*"
                          id="image"
                          className="hidden"
                          {...field}
                          onChange={(e) => handleImageChange(e)}
                        />
                        <label
                          htmlFor="image"
                          className=" block text-center p-4 border-2 border-dashed rounded-lg"
                        >
                          {imagePreview ? (
                            <>
                              <div className="h-full w-full relative">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className=" max-h-64 mx-auto"
                                />
                                <Button
                                  className="absolute top-2 right-2 h-5 w-5 p-0 rounded-full border-[1px] border-gray-300"
                                  onClick={(e) => handleRemoveImage(e)}
                                >
                                  <X />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-500 cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto mb-2" />
                              <p>Click to upload an image</p>
                            </div>
                          )}
                        </label>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Create Post"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
