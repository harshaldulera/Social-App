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
    
}