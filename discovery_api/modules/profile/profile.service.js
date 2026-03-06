import { Profile, Role, User } from "../../models/model.js";

export const createProfile = async (req) => {

    const userProfile = await Profile.findOne({ where: { userId: req.user.id } });
    if(userProfile) {
        throw { status: 400, message: "Profile is already created" };
    }

    const filePath = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : null; // normalize slashes for Windows


    const profile = await Profile.create({
        ...req.body,
        profilePicture: filePath,
        userId: req.user.id,
    });

    return profile;
}

export const getProfileById = async (id) => {
    const profile = await User.findOne({ where: { id }, include: [Role, Profile] });
    console.log(profile);

    if (!profile) {
        throw { status: 404, message: "Profile not found" };
    }
    return profile;
}

export const updateProfileById = async (id, req) => {
    const profile = await Profile.findOne({ where: { userId: id } });
    if (!profile) {
        return createProfile(req);
    }

    if (req.file) {
        req.body.profilePicture = `/${req.file.path.replace(/\\/g, "/")}`; // normalize slashes for Windows
    }

    await profile.update(req.body);
    return profile;
}