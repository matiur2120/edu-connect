export const replaceMongoIdInArray = (array) => {
    const mappedArray = array.map(item => {
      return {
        id: item._id.toString(),
        ...item
      }
    }).map(({_id, ...rest}) => rest);

    return mappedArray;
  }

  export const replaceMongoIdInObject = (obj) => {
    if(!obj) return null;
    const {_id, ...updatedObj} = {...obj, id: obj?._id.toString()};
   return updatedObj;
  }

  export const getSlug = (s) => {
    if (!s) return null;
    s= (s.trim)? s.trim(): s.replace(/^\s+|\s+$/g,'');
    return s.split(/\s+/).join('-').toLowerCase();
  }

  export function convetInHourMinSec(value){
    const hour = Math.floor(value / 3600);
    const min = Math.floor((value % 3600) / 60)
    const sec = Math.floor(value % 3600 % 60);
    const durationString = `${hour}:${min}:${sec}`
    return durationString;
  }