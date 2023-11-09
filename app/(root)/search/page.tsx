import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser } from "@/lib/actions/user.actions"
import { profileTabs } from "@/constants"
import ThreadsTab from "@/components/shared/ThreadsTab"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


async function page () {
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect("/onboarding");  
    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
        </section>
    )
}

export default page