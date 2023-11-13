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

export async function fetchCommunityPosts(id: string) {
    try {
        connectToDB();

        const communityPosts = await Community.findById(id).populate({
            path: "threads",
            model: Thread,
            populate: [
                {
                    path: "author",
                    model: User,
                    select: "name image id",
                },
                {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "name image id",
                    },
                },
            ],
        });

        return communityPosts;

    } catch (error) {
        console.error("Error fetching community posts: ", error);
        throw error;
    }
}

export async function fetchCommunities({
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
} : {
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof Community> = {};
        
        if (searchString.trim() !== "" ) {
            query.$or = [
                { username: { $regex: regex } },
                { name: {  $regex: regex } },
            ];
        }

        const sortOptions = { createdAt: sortBy };

        const communitiesQuery = Community.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
            .populate("members");

        const totalCommunitiesCoumt = await Community.countDocuments(query);

        const communities = await communitiesQuery.exec();

        const isNext = totalCommunitiesCoumt > skipAmount + communities.length;

        return { communities, isNext };
    } catch (error) {
        console.error("Error fetching Communities: ", error);
        throw error;
    }
}