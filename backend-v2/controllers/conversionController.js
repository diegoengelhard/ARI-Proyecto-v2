const controller = {};

controller.txtToXml = async (req, res) => {
  try {
    res.status(201).send({ message: "received txt to xml request" });
  } catch (err) {
    console.log(err);
  }
}

controller.txtToJson = async (req, res) => {
  try {
    res.status(201).send({ message: "received txt to json request" });
  } catch (err) {
    console.log(err);
  }
}

controller.xmlToTxt = async (req, res) => {
  try {
    res.status(201).send({ message: "received xml to txt request" });
  } catch (err) {
    console.log(err);
  }
}

controller.jsonToTxt = async (req, res) => {
  try {
    res.status(201).send({ message: "received json to txt request" });
  } catch (err) {
    console.log(err);
  }
}

module.exports = controller;