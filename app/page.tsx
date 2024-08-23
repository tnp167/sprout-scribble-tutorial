import getPosts from "@/server/actions/get-posts";
import Image from "next/image";

export default async function Home() {
  return (
    <main>
      <Image src="/vercel.svg" alt="Vercel logo" width={72} height={72} />
    </main>
  );
  //);
}
