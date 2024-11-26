import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {

  const {userId} = await auth();

  if(userId !== null) {
      redirect('/events')
  }

  return (

    <div className="container text-center my-4 mx-auto">

      <h1 className="text-3xl mb-4">
        Fancy home page
      </h1>

      <div className="flex gap-2 justify-center">

      <Button asChild>
        <SignInButton />
      </Button>

        <Button asChild>
          <SignUpButton />
        </Button>

        <UserButton />
      </div>

    </div>

  );

}
