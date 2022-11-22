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
    let qs = req.url.substr(req.url.indexOf('?')+8);
    let filterMajorList = qs.split(',')
    const all = await PostModel.find({
      major: { $nin: filterMajorList }  
    });
    res.status(200).json(all)
  } catch (err) {
    res.status(500).json(error)
  }
}
