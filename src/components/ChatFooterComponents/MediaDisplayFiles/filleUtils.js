import { fetchRequestCaller } from "../../../utils";

export const uploadFile = async (file, user) => {
    const formData = new FormData();
    formData.append('file', file); // Append the file to the form data

    let res = await fetchRequestCaller({
        method: "POST",
        data: formData, // Use FormData here
        token: user?.token ?? null,
        url: "chats/uploadFile",
        headers: {
            // Content-Type is not needed for FormData, as the browser will set it automatically
            'Authorization': `Bearer ${user?.token ?? ''}` // Ensure proper token header
        }
    });
    return res;
};
