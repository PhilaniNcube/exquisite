import { getPayload } from "payload";
import config from "@payload-config";
import { cacheLife } from "next/cache";

export const getDashboardStats = async () => {
  "use cache";
  cacheLife("hours");
  const payload = await getPayload({ config });

  const [
    orders,
    productsCount,
    customersCount,
    schoolsCount,
    photosCount,
    usersCount,
    schoolPhotosCount,
    clientGalleriesCount
  ] = await Promise.all([
    payload.find({ collection: "orders", limit: 0, depth: 1 }),
    payload.count({ collection: "products" }),
    payload.count({ collection: "customers" }),
    payload.count({ collection: "schools" }),
    payload.count({ collection: "photos" }),
    payload.count({ collection: "users" }),
    payload.count({ collection: "schoolPhotos" }),
    payload.count({ collection: "client-galleries" }),
  ]);

  const paidRevenue = orders.docs
    .filter(order => order.orderStatus === 'completed' || order.orderStatus === 'processing' || order.orderStatus === 'printed')
    .reduce((acc, order) => acc + (order.orderTotal || 0), 0);

  const pendingRevenue = orders.docs
    .filter(order => order.orderStatus === 'pending' || order.orderStatus === 'cancelled' || !order.orderStatus)
    .reduce((acc, order) => acc + (order.orderTotal || 0), 0);

  return {
    orders: orders.totalDocs,
    paidRevenue,
    pendingRevenue,
    products: productsCount.totalDocs,
    customers: customersCount.totalDocs,
    schools: schoolsCount.totalDocs,
    photos: photosCount.totalDocs,
    users: usersCount.totalDocs,
    schoolPhotos: schoolPhotosCount.totalDocs,
    clientGalleries: clientGalleriesCount.totalDocs,
  };
};
