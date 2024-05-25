const strFromObj = (list) => {
  var str = "";

  list?.forEach((el) => {
    str += `/${el.title}`;
  });

  return str;
};

export default strFromObj;
