
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// Upload or update profile photo
export const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select a photo.",
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Upload image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "book-basket/profile-photos",
                    public_id: `user_${user._id}`,
                    overwrite: true,
                    transformation: [
                        {
                            width: 500,
                            height: 500,
                            crop: "fill",
                            gravity: "face",
                        },
                    ],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            stream.end(req.file.buffer);
        });

        user.profileImage = uploadResult.secure_url;
        await user.save();

        return res.status(200).json({
            message: "Profile photo updated successfully.",
            profileImage: user.profileImage,
        });

    } catch (error) {
        console.error("Profile photo upload error:", error);

        return res.status(500).json({
            message: "Unable to upload profile photo.",
        });
    }
};

// Remove profile photo
export const removeProfilePhoto = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Delete image from Cloudinary
        if (user.profileImage) {
            await cloudinary.uploader.destroy(
                `book-basket/profile-photos/user_${user._id}`,
                { resource_type: "image" }
            );
        }

        // Remove image URL from database
        user.profileImage = "";
        await user.save();

        return res.status(200).json({
            message: "Profile photo removed successfully.",
            profileImage: "",
        });

    } catch (error) {
        console.error("Profile photo removal error:", error);

        return res.status(500).json({
            message: "Unable to remove profile photo.",
        });
    }
};
