const cloudinaryInstance = require("../config/cloudinary");
const ITEM = require("../Models/category");
const Dress = require("../Models/dress");

const items = async (req, res) => {
    
    try {
        const items = await ITEM.find()
        console.log(items);
        if (items) {
            return res.status(200).json(items)
        }
        return res.staus(400).json('no items')
    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error")
    } 

}
const viewType = async (req, res) => {
    console.log(req.params);
    const type = req.params.type
    try {
        const items = await Dress.find({ Type: type })

        if (items) {
            console.log(items);
            return res.status(200).json({ items })
        }
        return res.status(400).json({ data: 1 })
    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error")
    }


}

const detail = async (req, res) => {
    console.log(req.params.id);
    try {
        const data = await Dress.findById(req.params.id)
        console.log(data)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        return res.status(500).json('internal server error')

    }

}


// Function to extract public ID from the Cloudinary URL
const extractPublicId = (url) => {
    try {
        // Extract the part of the URL after "upload/"
        const parts = url.split('/upload/');

        // Remove the version part and get the public ID with extension
        const publicIdWithExtension = parts[1].replace(/^v\d+\//, ''); // Remove "v1725291251/"

        // Remove the file extension (e.g., ".jpg") and decode URL
        const publicId = decodeURIComponent(publicIdWithExtension.split('.')[0]);

        return publicId;
    } catch (error) {
        console.error(`Failed to extract public ID from URL: ${url}`, error);
        return null;
    }
};

const deleting = async (req, res) => {
    console.log(req.params.id);
    try {
        const find = await Dress.findById(req.params.id);
        const pics = find.Pics;
        console.log("Images to delete:", pics);

        if (pics && pics.length > 0) {
            // Perform all deletions
            const deletionResults = await Promise.all(
                pics.map(async (file) => {
                    const publicId = extractPublicId(file);
                    console.log("Public ID extracted:", publicId);

                    if (!publicId) {
                        throw new Error(`Invalid URL format: ${file}`);
                    }

                    const result = await cloudinaryInstance.uploader.destroy(publicId);
                    console.log("Deletion result for", publicId, ":", result);

                    if (result.result !== 'ok') {
                        throw new Error(`Failed to delete file: ${file}`);
                    }
                    return result; // Return the result to keep track
                })
            );

            // If all deletions are successful, delete the Dress document
            await Dress.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Files and dress deleted successfully', results: deletionResults });

        } else {
            // No files to delete
            res.status(404).json({ message: 'No files to delete' });
        }
    } catch (error) {
        console.error("Error in deletion process:", error);

        // Check if a specific error occurred during deletion
        if (error.message.includes('Failed to delete file')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error deleting files', error: error.message });
        }
    }
};

module.exports = { items, viewType, detail, deleting }  