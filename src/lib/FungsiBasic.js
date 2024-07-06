export const fn_copy_id_for_mongo = (item) => {
  item["id"] = item._id;
  return item;
};

export const fn_removeLeadingPipeAndSpaces = (str) => {
  return str.replace(/^\s*\|\s*/, "");
};
