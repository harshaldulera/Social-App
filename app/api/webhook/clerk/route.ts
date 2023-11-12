import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { IncomingHttpHeaders }from "http";
import { NextResponse } from "next/server";
import {
    addMemberToCommunity,
    createCommunity,
    deleteCommunity,
    removeUserFromCommunity,
    updateCommunityInfo,
} from "@/lib/actions/community.actions";

type EventType =
    | "organization.created"
    | "organizationInvitation.created"
    | "organizationMembership.created"
    | "organizationMembership.deleted"
    | "organization.updated"
    | "organization.deleted";

type Event = {
        data: Record<string, string | number | Record<string, string>[]>;
        object: "event";
        type: EventType;
};

export const POST = async (request: Request) => {
    const payload = await request.json();
    const header = headers();

    const heads = {
        "svix-id": header.get("svix-id"),
        "svix-timestamp": headers.get("svix-timestamp"),
        "svix-signature": headers.get("svix-signature"),
    };

    const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

    let evnt: Event | null = null;

    try {
        evnt = wh.verify{
            JSON.stringify(payload),
            heads as IncomingHttpHeaders & WebhookRequiredHeaders,
        } as Event;
    } catch (err) {
        return NextResponse.json({ message: err }, { status: 400});
    }

    const eventType: EventType = evnt?.type!;

    if (eventType === 'organization.created'){
        const { id, name, slug, logo_url, image_url, created_by } = evnt.data ?? {};

        try {
            await createCommunity(
                id,
                name,
                slug,
                logo_url || image_url,
                "org bio",
                created_by
            );

            return NextResponse.json({ message: "User Created" }, { status: 201 });
        } catch (err) {
            console.log(err);
            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }

    if (eventType === "organizationInvitation.created") {
        try {
            console.log("Invitation Created", evnt?.data);

            return NextResponse.json(
                { message: "Invitation Created" },
                { status: 201}
            );
        } catch (err) {
            console.log(err);
            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }
    
    if (eventType === "organizationMembership.created") {
        try {
            const { organization, public_user_data } = evnt?.data;
            console.log("created", evnt?.data);

            await addMemberToCommunity(organization.id, public_user_data.id);

            return NextResponse.json(
                { message: "Member Accepted" },
                { status: 201 }
            );
        } catch (err) {
            console.log(err);
            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }

    if (eventType === "organizationMembership.deleted") {
        try {
            const { organization, public_user_data } = evnt?.data;
            console.log("removed", ennt?.data);

            await removeUserFromCommunity(public_user_data.user_id, organization.id);

            return NextResponse.json(
                { message: "Member Removed" },
                { status: 201 }
            )
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }

    if (eventType === "organization.updated") {
        try {
            const {id, logo_url, name, slug } = evnt?.data;
            console.log("updated", evnt?.data);

            await updateCommunityInfo(id, name, slug, logo_url);

            return NextResponse.json(
                { message: "Community Updated" },
                { status: 201 }
            );
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }

    
}