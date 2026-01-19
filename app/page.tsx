import Image from "next/image";
import { Button  } from "@/components/ui/button";
// import {db} from '@/lib/db'

export default async function Home() {

  // const user = db.user
  return (
    <div>
      {/* <div>{user}</div> */}
      <Button>
        Get Started
      </Button>
    </div>
  );
}
