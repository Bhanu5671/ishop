import { axiosApiInstance } from "./helper";

const getCategoryData = async (id = null, status = null) => {
    let api = '/category/get-data';
    if (id) api += `/${id}`;
    api += status ? `?status=${status}` : '';
    return axiosApiInstance.get(api)
        .then(
            (response) => {
                return response.data;
            }
        ).catch(
            (error) => {
                return null;
            }
        )

}

const getColorData = async (id = null, status = null) => {
    let api = "/color/get-data";
    if (id) api += `/${id}`
    api += status ? `?status=${status}` : '';
    return axiosApiInstance.get(api).then(
        (response) => {
            return response.data;
        }
    ).catch(
        (error) => {
            return null;
        }
    )
}

const getTrashData = async () => {
    return axiosApiInstance.get("/category/get-trashed").then(
        (response) => {
            return response.data;
        }
    ).catch(
        (error) => {
            return null;
        }
    )
}

const getColorTrash = async () => {
    return axiosApiInstance.get("/color/get-trashed").then(
        (response) => {
            return response.data;
        }
    ).catch(
        (error) => {
            return null;
        }
    )
}

const getProductData = async (prod_id = null, status = null, category_slug = null, limit = null, sortByName = null, sortByPrice = null, sortByDate = null, show = null, color = null, min = null, max = null) => {
    let api = "/product/get-data";
    if (prod_id) api += `/${prod_id}`;
    const query = new URLSearchParams();
    if (category_slug) query.append("category_slug", category_slug);
    if (status) query.append("status", status);
    if (sortByName) query.append("sortByName", sortByName);
    if (sortByPrice) query.append("sortByPrice", sortByPrice);
    if (sortByDate) query.append("sortByDate", sortByDate);
    if (show) query.append("show", show);
    if (color) query.append("color", color);
    if (min) query.append("min", min);
    if (max) query.append("max", max);
    if (limit) query.append("limit", limit);

    return axiosApiInstance.get(api + `?${query.toString()}`).then(
        (response) => {
            return response.data;
        }
    ).catch(
        (error) => {
            return null;
        }
    )
}

const getTrashProductData = async () => {
    return axiosApiInstance.get("/product/get-trashed").then(
        (response) => {
            console.log(response.data);
            return response.data;
        }
    ).catch(
        (error) => {
            return null;
        }
    )
}

const getadminLogs = async () => {
    return axiosApiInstance.get("/adminlogs/get-data").then(
        (response) => {
            return response.data;
        }
    ).catch(
        (error) => {
            return null;
        }
    )
}

export { getCategoryData, getTrashData, getColorData, getColorTrash, getProductData, getTrashProductData, getadminLogs };