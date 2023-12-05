export const fn_copy_id_for_mongo = (item) => {
  item["id"] = item._id;
  return item;
};
