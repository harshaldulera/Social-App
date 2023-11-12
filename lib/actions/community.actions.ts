"use server"

import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function createCommunity (
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    createdById: string
) {
    try {
        connectToDB();

        const user = await User.findOne({ id: createdById });

        if(!user) {
            throw new Error("User not Found");
        }

        const newCommunity = new Community({
            id,
            name,
            username,
            image,
            bio,
            createdBy: user._id
        });

        const createdCommunity = await newCommunity.save();

        user.communities.push(createdCommunity._id);
        await user.save();

        return createdCommunity;
    } catch (error: any) {
        console.error("Error creating community: ", error);
        throw error;
    }
}

export async function fetchCommunityDetails(id: string) {
    try {
        connectToDB();

        const communityDetails = await Community.findOne({ id }).populate([ "createdBy",
            {
                path: "members",
                model: User,
                select: "name username image _id id",
            },
        ]);

        return communityDetails;


    } catch (error: any) {
        console.error("Error fetching community details: ", error);
        throw error;
    }
}