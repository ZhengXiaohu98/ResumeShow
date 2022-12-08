import PostModel from "../Models/postModel.js";

// this function get all the resumes in db
export const getAll = async (req, res) => {
  try {
    const all = await PostModel.find({});
    res.status(200).json(all)
  } catch (err) {
    res.status(500).json(error)
  }
}

// this function get partial resume in db(filter majors)
export const getFilterMajor = async (req, res) => {

  try {
    let qs = req.url.substr(req.url.indexOf('?')+8).split(',');
    let filterMajorList = []
    for(var tag of qs){
      let str = tag.split("%20").join(" ");
      tag = str;
      filterMajorList.push(tag)
    }

    const all = await PostModel.find({
      major: { $in: filterMajorList }  
    });

    res.status(200).json(all)
  } catch (err) {
    res.status(500).json(err)
  }
}
