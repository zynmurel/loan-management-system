import Link from "next/link";
import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className=" flex min-h-screen  w-full items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 opacity-80">
        Loading ...
      </div>
    </main>
  );
}
